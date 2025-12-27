"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useUserChat } from "@/lib/chat-context";
import { SITE_CONFIG } from "@/lib/constants";

export function ChatWidget() {
  const {
    session,
    messages,
    isLoading,
    isChatAvailable,
    startSession,
    sendMessage,
    markMessagesAsRead,
    unreadCount,
  } = useUserChat();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && session) {
      markMessagesAsRead();
    }
  }, [isOpen, session, markMessagesAsRead]);

  async function handleStartChat(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    setError("");

    const result = await startSession(name.trim(), phone.trim());

    if (!result.success) {
      setError(result.error || "Failed to start chat");
    }

    setIsSubmitting(false);
  }

  async function handleSendMessage(e: FormEvent) {
    e.preventDefault();
    if (!message.trim() || !session) return;

    const text = message;
    setMessage("");
    await sendMessage(text);
  }

  function formatTime(timestamp: { toDate?: () => Date } | null) {
    if (!timestamp?.toDate) return "";
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  if (isLoading) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 sm:bottom-8 sm:right-8">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-emerald-700"
          aria-label="Open chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
            />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {isOpen && (
        <div className="flex h-[500px] w-[360px] flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between rounded-t-2xl bg-emerald-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-semibold">{SITE_CONFIG.supportName}</div>
                <div className="text-xs text-white/80">
                  {session?.status === "active"
                    ? "Online"
                    : session?.status === "pending"
                    ? "Waiting for agent..."
                    : "Chat with us"}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 hover:bg-white/20"
              aria-label="Close chat"
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
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {!session && !isChatAvailable && (
              <div className="flex h-full items-center justify-center text-center">
                <div className="text-gray-500">
                  <p className="mb-2 font-medium">Chat Unavailable</p>
                  <p className="text-sm">
                    Our team is currently busy. Please try again later.
                  </p>
                </div>
              </div>
            )}

            {!session && isChatAvailable && (
              <form onSubmit={handleStartChat} className="space-y-4">
                <div className="text-center">
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    Enter your details to start chatting with our team.
                  </p>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/50 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-700 dark:bg-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your phone number"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-700 dark:bg-gray-800"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim() || !phone.trim()}
                  className="h-11 w-full rounded-xl bg-emerald-600 font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Starting..." : "Start Chat"}
                </button>
              </form>
            )}

            {session && (
              <div className="space-y-3">
                {session.status === "pending" && messages.length === 0 && (
                  <div className="rounded-lg bg-yellow-50 p-3 text-center text-sm text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Waiting for an agent to join...
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        msg.sender === "user"
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      <p
                        className={`mt-1 text-xs ${
                          msg.sender === "user"
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
            )}
          </div>

          {session && session.status !== "closed" && (
            <form
              onSubmit={handleSendMessage}
              className="border-t border-gray-200 p-3 dark:border-gray-700"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    session.status === "pending"
                      ? "Waiting for agent..."
                      : "Type a message..."
                  }
                  disabled={session.status === "pending"}
                  className="h-10 flex-1 rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800"
                />
                <button
                  type="submit"
                  disabled={!message.trim() || session.status === "pending"}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
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
          )}

          {session?.status === "closed" && (
            <div className="border-t border-gray-200 p-3 text-center text-sm text-gray-500 dark:border-gray-700">
              This chat session has ended.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
