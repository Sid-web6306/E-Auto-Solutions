"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "error"; message: string };

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn, user, loading } = useAuth();
  const [status, setStatus] = useState<Status>({ state: "idle" });

  useEffect(() => {
    if (!loading && user) {
      router.push("/admin/enquiries");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-black/60 dark:text-white/60">Loading...</div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ state: "submitting" });

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    try {
      await signIn(email, password);
      router.push("/admin/enquiries");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setStatus({ state: "error", message });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-bold">Admin Login</h1>
        
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email"
              name="email"
              placeholder="admin@example.com"
              required
              disabled={status.state === "submitting"}
              className="h-11 rounded-2xl border border-black/15 bg-transparent px-4 text-sm outline-none focus:border-black/30 dark:border-white/15 dark:focus:border-white/30"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              disabled={status.state === "submitting"}
              className="h-11 rounded-2xl border border-black/15 bg-transparent px-4 text-sm outline-none focus:border-black/30 dark:border-white/15 dark:focus:border-white/30"
            />
          </div>

          <button
            type="submit"
            disabled={status.state === "submitting"}
            className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white hover:bg-black/90 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            {status.state === "submitting" ? "Signing in…" : "Sign in"}
          </button>

          {status.state === "error" && (
            <div className="text-center text-sm text-red-600 dark:text-red-400">
              {status.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
