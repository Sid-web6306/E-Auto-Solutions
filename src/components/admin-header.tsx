"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function AdminHeader() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.push("/admin/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur-md shadow-sm dark:bg-gray-950/95 dark:border-white/5">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
        <Link href="/admin/enquiries" className="flex items-center gap-3 group">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-transform group-hover:scale-105">
            EA
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
              E-Auto Admin
            </div>
            <div className="text-xs text-emerald-600 font-medium">
              Dashboard
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {!loading && user && (
            <>
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
