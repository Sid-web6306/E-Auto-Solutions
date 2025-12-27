"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

type Dealer = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  location: string;
  createdAt: string;
  updatedAt: string;
};

type Status =
  | { state: "loading" }
  | { state: "success"; data: Dealer[] }
  | { state: "error"; message: string };

export default function AdminDealersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<Status>({ state: "loading" });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/admin/login");
      return;
    }

    async function fetchDealers() {
      try {
        const token = await user!.getIdToken();
        const res = await fetch("/api/admin/dealers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to fetch dealers");
        }

        const data = await res.json();
        setStatus({ state: "success", data: data.dealers });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setStatus({ state: "error", message });
      }
    }

    fetchDealers();
  }, [user, authLoading, router]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this dealer?")) return;

    try {
      const token = await user!.getIdToken();
      const res = await fetch(`/api/admin/dealers?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete dealer");
      }

      if (status.state === "success") {
        setStatus({
          state: "success",
          data: status.data.filter((d) => d.id !== id),
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(message);
    }
  }

  if (authLoading || status.state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-black/60 dark:text-white/60">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="px-4 py-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dealers</h1>
          <Link
            href="/admin/dealers/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add Dealer
          </Link>
        </div>

        {status.state === "error" && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            {status.message}
          </div>
        )}

        {status.state === "success" && status.data.length === 0 && (
          <div className="rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-500 dark:border-gray-700">
            No dealers added yet. Click &quot;Add Dealer&quot; to get started.
          </div>
        )}

        {status.state === "success" && status.data.length > 0 && (
          <div className="grid gap-4">
            {status.data.map((dealer) => (
              <div
                key={dealer.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {dealer.name}
                    </h3>
                    <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-4 w-4 flex-shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                          />
                        </svg>
                        {dealer.phone}
                      </p>
                      <p className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-4 w-4 flex-shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                          />
                        </svg>
                        {dealer.email}
                      </p>
                      <p className="flex items-start gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-4 w-4 flex-shrink-0 mt-0.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                          />
                        </svg>
                        <span>
                          {dealer.address}
                          <br />
                          <span className="font-medium">{dealer.location}</span>
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/dealers/${dealer.id}`}
                      className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(dealer.id)}
                      className="inline-flex h-9 items-center justify-center rounded-lg border border-red-200 bg-white px-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-950"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
