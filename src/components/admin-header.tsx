"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getClientFirestore } from "@/lib/firebase-client";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

type ChatCounts = {
  total: number;
  pending: number;
  unread: number;
};

export function AdminHeader() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [chatCounts, setChatCounts] = useState<ChatCounts>({
    total: 0,
    pending: 0,
    unread: 0,
  });

  useEffect(() => {
    if (!user) return;

    const db = getClientFirestore();
    const sessionsRef = collection(db, "chat_sessions");
    const q = query(
      sessionsRef,
      where("status", "in", ["pending", "active"])
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let pending = 0;
        let unread = 0;

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.status === "pending") pending++;
          unread += data.adminUnreadCount || 0;
        });

        setChatCounts({
          total: snapshot.size,
          pending,
          unread,
        });
      },
      (error) => {
        console.error("Admin header chat listener error:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  async function handleSignOut() {
    await signOut();
    router.push("/admin/login");
  }

  function openChatInNewTab() {
    window.open("/admin/chat", "_blank");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur-md shadow-sm dark:bg-gray-950/95 dark:border-white/5">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
        <Link href="/admin/enquiries" className="flex items-center gap-3 group">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-transform group-hover:scale-105">
            EA
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
                E-Auto
              </span>
              {!loading && user && (
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                  Admin
                </span>
              )}
            </div>
            <div className="text-xs text-emerald-600 font-medium">
              Electric Mobility
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {!loading && user && (
            <>
              <button
                onClick={openChatInNewTab}
                className="relative inline-flex h-9 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                  />
                </svg>
                <span className="hidden sm:inline">Chat</span>
                {(chatCounts.unread > 0 || chatCounts.pending > 0) && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                    {chatCounts.unread + chatCounts.pending}
                  </span>
                )}
              </button>
              <span className="hidden text-sm text-gray-600 dark:text-gray-400 sm:inline">
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="inline-flex h-9 items-center justify-center rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
