"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { getClientFirestore } from "./firebase-client";
import { getVisitorId } from "./visitor-id";
import {
  ChatSession,
  ChatMessage,
  ChatSessionStatus,
  MAX_ACTIVE_SESSIONS,
  SESSION_TIMEOUT_MINUTES,
} from "./chat-types";

type UserChatContextType = {
  session: ChatSession | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isChatAvailable: boolean;
  startSession: (name: string, phone: string) => Promise<{ success: boolean; error?: string }>;
  sendMessage: (text: string) => Promise<void>;
  markMessagesAsRead: () => Promise<void>;
  unreadCount: number;
};

type AdminChatContextType = {
  sessions: ChatSession[];
  activeSessionId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  setActiveSession: (sessionId: string) => void;
  sendMessage: (text: string) => Promise<void>;
  closeSession: (sessionId: string) => Promise<void>;
  activateSession: (sessionId: string) => Promise<void>;
  markMessagesAsRead: (sessionId: string) => Promise<void>;
  totalUnreadCount: number;
  pendingCount: number;
};

const UserChatContext = createContext<UserChatContextType | null>(null);
const AdminChatContext = createContext<AdminChatContextType | null>(null);

function playNotificationSound() {
  if (typeof window === "undefined") return;
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch {
    // Ignore audio errors
  }
}

export function UserChatProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatAvailable, setIsChatAvailable] = useState(true);
  const prevMessagesLengthRef = useRef(0);
  const isInitialLoadRef = useRef(true);

  const visitorId = typeof window !== "undefined" ? getVisitorId() : "";

  useEffect(() => {
    if (!visitorId) {
      setTimeout(() => setIsLoading(false), 0);
      return;
    }

    const db = getClientFirestore();
    const sessionsRef = collection(db, "chat_sessions");

    const q = query(
      sessionsRef,
      where("visitorId", "==", visitorId),
      where("status", "in", ["pending", "active"]),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const sessionDoc = snapshot.docs[0];
          const sessionData = {
            id: sessionDoc.id,
            ...sessionDoc.data(),
          } as ChatSession;
          setSession(sessionData);
        } else {
          setSession(null);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Chat session listener error:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [visitorId]);

  useEffect(() => {
    if (!session?.id) {
      setTimeout(() => setMessages([]), 0);
      return;
    }

    const db = getClientFirestore();
    const messagesRef = collection(db, "chat_sessions", session.id, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ChatMessage[];
        
        if (!isInitialLoadRef.current && msgs.length > prevMessagesLengthRef.current) {
          const lastMsg = msgs[msgs.length - 1];
          if (lastMsg && lastMsg.sender === "admin") {
            playNotificationSound();
          }
        }
        
        prevMessagesLengthRef.current = msgs.length;
        isInitialLoadRef.current = false;
        setMessages(msgs);
      },
      (error) => {
        console.error("Messages listener error:", error);
      }
    );

    return () => {
      unsubscribe();
      isInitialLoadRef.current = true;
    };
  }, [session?.id]);

  useEffect(() => {
    if (!session?.id || session.status !== "active") return;

    const checkTimeout = () => {
      const lastActivity = session.lastActivityAt?.toDate?.() || new Date();
      const now = new Date();
      const diffMinutes = (now.getTime() - lastActivity.getTime()) / (1000 * 60);

      if (diffMinutes >= SESSION_TIMEOUT_MINUTES) {
        const db = getClientFirestore();
        const sessionRef = doc(db, "chat_sessions", session.id);
        updateDoc(sessionRef, {
          status: "closed",
          closedAt: serverTimestamp(),
        });
      }
    };

    const interval = setInterval(checkTimeout, 60000);
    return () => clearInterval(interval);
  }, [session?.id, session?.status, session?.lastActivityAt]);

  const startSession = useCallback(
    async (name: string, phone: string): Promise<{ success: boolean; error?: string }> => {
      const db = getClientFirestore();
      const sessionsRef = collection(db, "chat_sessions");
      const currentVisitorId = getVisitorId();

      // Check for active/pending session first
      const activeByPhone = query(
        sessionsRef,
        where("userPhone", "==", phone),
        where("status", "in", ["pending", "active"])
      );
      const activeSnapshot = await getDocs(activeByPhone);

      if (!activeSnapshot.empty) {
        const existingSession = activeSnapshot.docs[0];
        
        if (existingSession.data().visitorId !== currentVisitorId) {
          await updateDoc(doc(db, "chat_sessions", existingSession.id), {
            visitorId: currentVisitorId,
          });
        }
        return { success: true };
      }

      // Check for closed session to reopen
      const closedByPhone = query(
        sessionsRef,
        where("userPhone", "==", phone),
        where("status", "==", "closed"),
        orderBy("closedAt", "desc")
      );
      const closedSnapshot = await getDocs(closedByPhone);

      if (!closedSnapshot.empty) {
        // Reopen the most recent closed session
        const closedSession = closedSnapshot.docs[0];
        
        // Check rate limit before reopening
        const activeSessionsQuery = query(
          sessionsRef,
          where("status", "in", ["pending", "active"])
        );
        const allActiveSnapshot = await getDocs(activeSessionsQuery);

        if (allActiveSnapshot.size >= MAX_ACTIVE_SESSIONS) {
          setIsChatAvailable(false);
          return { success: false, error: "Chat is currently busy. Please try again later." };
        }

        await updateDoc(doc(db, "chat_sessions", closedSession.id), {
          visitorId: currentVisitorId,
          status: "pending",
          lastActivityAt: serverTimestamp(),
          closedAt: null,
        });
        return { success: true };
      }

      // No existing session, create new one
      const activeSessionsQuery = query(
        sessionsRef,
        where("status", "in", ["pending", "active"])
      );
      const allActiveSnapshot = await getDocs(activeSessionsQuery);

      if (allActiveSnapshot.size >= MAX_ACTIVE_SESSIONS) {
        setIsChatAvailable(false);
        return { success: false, error: "Chat is currently busy. Please try again later." };
      }

      await addDoc(sessionsRef, {
        visitorId: currentVisitorId,
        userName: name,
        userPhone: phone,
        status: "pending" as ChatSessionStatus,
        createdAt: serverTimestamp(),
        lastActivityAt: serverTimestamp(),
        closedAt: null,
        adminUnreadCount: 0,
        userUnreadCount: 0,
      });

      return { success: true };
    },
    []
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!session?.id || !text.trim()) return;

      const db = getClientFirestore();
      const messagesRef = collection(db, "chat_sessions", session.id, "messages");
      const sessionRef = doc(db, "chat_sessions", session.id);

      await addDoc(messagesRef, {
        text: text.trim(),
        sender: "user",
        createdAt: serverTimestamp(),
        read: false,
      });

      await updateDoc(sessionRef, {
        lastActivityAt: serverTimestamp(),
        adminUnreadCount: (session.adminUnreadCount || 0) + 1,
      });
    },
    [session]
  );

  const markMessagesAsRead = useCallback(async () => {
    if (!session) return;

    const db = getClientFirestore();
    const sessionRef = doc(db, "chat_sessions", session.id);

    await updateDoc(sessionRef, {
      userUnreadCount: 0,
    });
  }, [session]);

  const unreadCount = session?.userUnreadCount || 0;

  return (
    <UserChatContext.Provider
      value={{
        session,
        messages,
        isLoading,
        isChatAvailable,
        startSession,
        sendMessage,
        markMessagesAsRead,
        unreadCount,
      }}
    >
      {children}
    </UserChatContext.Provider>
  );
}

export function AdminChatProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const prevMessagesLengthRef = useRef(0);
  const isInitialLoadRef = useRef(true);
  const prevSessionsRef = useRef<ChatSession[]>([]);

  useEffect(() => {
    const db = getClientFirestore();
    const sessionsRef = collection(db, "chat_sessions");

    const q = query(
      sessionsRef,
      where("status", "in", ["pending", "active"]),
      orderBy("lastActivityAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const sessionsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ChatSession[];

        const prevIds = new Set(prevSessionsRef.current.map((s) => s.id));
        const newSessions = sessionsData.filter((s) => !prevIds.has(s.id));
        
        if (prevSessionsRef.current.length > 0 && newSessions.length > 0) {
          playNotificationSound();
        }

        prevSessionsRef.current = sessionsData;
        setSessions(sessionsData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Admin sessions listener error:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!activeSessionId) {
      setTimeout(() => setMessages([]), 0);
      return;
    }

    const db = getClientFirestore();
    const messagesRef = collection(db, "chat_sessions", activeSessionId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ChatMessage[];

        if (!isInitialLoadRef.current && msgs.length > prevMessagesLengthRef.current) {
          const lastMsg = msgs[msgs.length - 1];
          if (lastMsg && lastMsg.sender === "user") {
            playNotificationSound();
          }
        }

        prevMessagesLengthRef.current = msgs.length;
        isInitialLoadRef.current = false;
        setMessages(msgs);
      },
      (error) => {
        console.error("Admin messages listener error:", error);
      }
    );

    return () => {
      unsubscribe();
      isInitialLoadRef.current = true;
    };
  }, [activeSessionId]);

  useEffect(() => {
    if (sessions.length === 0) return;

    const checkTimeouts = async () => {
      const db = getClientFirestore();
      const now = new Date();

      for (const session of sessions) {
        if (session.status !== "active") continue;

        const lastActivity = session.lastActivityAt?.toDate?.() || new Date();
        const diffMinutes = (now.getTime() - lastActivity.getTime()) / (1000 * 60);

        if (diffMinutes >= SESSION_TIMEOUT_MINUTES) {
          const sessionRef = doc(db, "chat_sessions", session.id);
          await updateDoc(sessionRef, {
            status: "closed",
            closedAt: serverTimestamp(),
          });
        }
      }
    };

    const interval = setInterval(checkTimeouts, 60000);
    return () => clearInterval(interval);
  }, [sessions]);

  const setActiveSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
    isInitialLoadRef.current = true;
    prevMessagesLengthRef.current = 0;
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!activeSessionId || !text.trim()) return;

      const db = getClientFirestore();
      const messagesRef = collection(db, "chat_sessions", activeSessionId, "messages");
      const sessionRef = doc(db, "chat_sessions", activeSessionId);

      const currentSession = sessions.find((s) => s.id === activeSessionId);

      await addDoc(messagesRef, {
        text: text.trim(),
        sender: "admin",
        createdAt: serverTimestamp(),
        read: false,
      });

      await updateDoc(sessionRef, {
        lastActivityAt: serverTimestamp(),
        userUnreadCount: (currentSession?.userUnreadCount || 0) + 1,
      });
    },
    [activeSessionId, sessions]
  );

  const closeSession = useCallback(async (sessionId: string) => {
    const db = getClientFirestore();
    const sessionRef = doc(db, "chat_sessions", sessionId);

    await updateDoc(sessionRef, {
      status: "closed",
      closedAt: serverTimestamp(),
    });

    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
    }
  }, [activeSessionId]);

  const activateSession = useCallback(async (sessionId: string) => {
    const db = getClientFirestore();
    const sessionRef = doc(db, "chat_sessions", sessionId);

    await updateDoc(sessionRef, {
      status: "active",
      lastActivityAt: serverTimestamp(),
    });
  }, []);

  const markMessagesAsRead = useCallback(async (sessionId: string) => {
    const db = getClientFirestore();
    const sessionRef = doc(db, "chat_sessions", sessionId);

    await updateDoc(sessionRef, {
      adminUnreadCount: 0,
    });
  }, []);

  const totalUnreadCount = sessions.reduce((acc, s) => acc + (s.adminUnreadCount || 0), 0);
  const pendingCount = sessions.filter((s) => s.status === "pending").length;

  return (
    <AdminChatContext.Provider
      value={{
        sessions,
        activeSessionId,
        messages,
        isLoading,
        setActiveSession,
        sendMessage,
        closeSession,
        activateSession,
        markMessagesAsRead,
        totalUnreadCount,
        pendingCount,
      }}
    >
      {children}
    </AdminChatContext.Provider>
  );
}

export function useUserChat() {
  const context = useContext(UserChatContext);
  if (!context) {
    throw new Error("useUserChat must be used within a UserChatProvider");
  }
  return context;
}

export function useAdminChat() {
  const context = useContext(AdminChatContext);
  if (!context) {
    throw new Error("useAdminChat must be used within an AdminChatProvider");
  }
  return context;
}
