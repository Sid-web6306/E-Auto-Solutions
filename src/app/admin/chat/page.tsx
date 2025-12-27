"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useAdminChat, AdminChatProvider } from "@/lib/chat-context";
import { ChatSession } from "@/lib/chat-types";

function ChatSessionItem({
  session,
  isActive,
  onClick,
}: {
  session: ChatSession;
  isActive: boolean;
  onClick: () => void;
}) {
  const statusColors = {
    pending: "bg-yellow-500",
    active: "bg-emerald-500",
    closed: "bg-gray-400",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl p-3 text-left transition-colors ${
        isActive
          ? "bg-emerald-50 dark:bg-emerald-900/30"
          : "hover:bg-gray-50 dark:hover:bg-gray-800"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-white truncate">
              {session.userName}
            </span>
            <span
              className={`h-2 w-2 rounded-full ${statusColors[session.status]}`}
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {session.userPhone}
          </p>
        </div>
        {session.adminUnreadCount > 0 && (
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
            {session.adminUnreadCount}
          </span>
        )}
      </div>
      <div className="mt-1 text-xs text-gray-400">
        {session.status === "pending" ? "Waiting..." : "Active"}
      </div>
    </button>
  );
}

function AdminChatContent() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const {
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
  } = useAdminChat();

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/admin/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (activeSessionId) {
      markMessagesAsRead(activeSessionId);
    }
  }, [activeSessionId, markMessagesAsRead, messages]);

  useEffect(() => {
    document.title = totalUnreadCount > 0 
      ? `(${totalUnreadCount}) Chat - E-Auto Admin` 
      : "Chat - E-Auto Admin";
  }, [totalUnreadCount]);

  async function handleSendMessage(e: FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    const text = message;
    setMessage("");
    await sendMessage(text);
  }

  async function handleActivateSession() {
    if (activeSessionId) {
      await activateSession(activeSessionId);
    }
  }

  async function handleCloseSession() {
    if (activeSessionId) {
      await closeSession(activeSessionId);
    }
  }

  function formatTime(timestamp: { toDate?: () => Date } | null) {
    if (!timestamp?.toDate) return "";
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-sm text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <div className="flex w-80 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            Chat Sessions
          </h1>
          <div className="mt-1 flex gap-3 text-sm">
            <span className="text-emerald-600">
              {sessions.filter((s) => s.status === "active").length} active
            </span>
            {pendingCount > 0 && (
              <span className="text-yellow-600">{pendingCount} pending</span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {sessions.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No active chat sessions
            </div>
          ) : (
            <div className="space-y-1">
              {sessions.map((session) => (
                <ChatSessionItem
                  key={session.id}
                  session={session}
                  isActive={session.id === activeSessionId}
                  onClick={() => setActiveSession(session.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        {!activeSession ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="mx-auto mb-4 h-16 w-16 text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                />
              </svg>
              <p className="font-medium">Select a chat</p>
              <p className="text-sm">Choose a session from the sidebar</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {activeSession.userName}
                </h2>
                <p className="text-sm text-gray-500">{activeSession.userPhone}</p>
              </div>
              <div className="flex items-center gap-2">
                {activeSession.status === "pending" && (
                  <button
                    onClick={handleActivateSession}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    Accept Chat
                  </button>
                )}
                <button
                  onClick={handleCloseSession}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Close Session
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 p-6 dark:bg-gray-950">
              {activeSession.status === "pending" && messages.length === 0 && (
                <div className="mb-4 rounded-lg bg-yellow-50 p-3 text-center text-sm text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                  Click &quot;Accept Chat&quot; to start chatting with this user
                </div>
              )}

              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "admin" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        msg.sender === "admin"
                          ? "bg-emerald-600 text-white"
                          : "bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      <p
                        className={`mt-1 text-xs ${
                          msg.sender === "admin"
                            ? "text-white/70"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <form
              onSubmit={handleSendMessage}
              className="border-t border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    activeSession.status === "pending"
                      ? "Accept the chat first..."
                      : "Type your message..."
                  }
                  disabled={activeSession.status === "pending"}
                  className="h-11 flex-1 rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800"
                />
                <button
                  type="submit"
                  disabled={!message.trim() || activeSession.status === "pending"}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminChatPage() {
  return (
    <AdminChatProvider>
      <AdminChatContent />
    </AdminChatProvider>
  );
}
