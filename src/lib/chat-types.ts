import { Timestamp } from "firebase/firestore";

export type ChatSessionStatus = "pending" | "active" | "closed";

export type ChatSession = {
  id: string;
visitorId: string;
  userName: string;
  userPhone: string;
  status: ChatSessionStatus;
  createdAt: Timestamp;
  lastActivityAt: Timestamp;
  closedAt: Timestamp | null;
  adminUnreadCount: number;
  userUnreadCount: number;
};

export type ChatMessage = {
  id: string;
  text: string;
  sender: "admin" | "user";
  createdAt: Timestamp;
  read: boolean;
};

export const MAX_ACTIVE_SESSIONS = 5;
export const SESSION_TIMEOUT_MINUTES = 15;
