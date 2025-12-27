"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

type Enquiry = {
  id: string;
  name: string;
  phone: string;
  city: string | null;
  message: string;
  sourcePage?: string;
  createdAt: string;
};

type Status =
  | { state: "loading" }
  | { state: "success"; data: Enquiry[] }
  | { state: "error"; message: string };

export default function AdminEnquiriesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<Status>({ state: "loading" });

  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/admin/login");
      return;
    }

    async function fetchEnquiries() {
      try {
        const token = await user!.getIdToken();
        const res = await fetch("/api/admin/enquiries", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to fetch enquiries");
        }

        const data = await res.json();
        setStatus({ state: "success", data: data.enquiries });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setStatus({ state: "error", message });
      }
    }

    fetchEnquiries();
  }, [user, authLoading, router]);

  const filteredEnquiries = useMemo(() => {
    if (status.state !== "success") return [];

    return status.data.filter((enquiry) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        enquiry.name.toLowerCase().includes(query) ||
        enquiry.phone.toLowerCase().includes(query) ||
        enquiry.message.toLowerCase().includes(query) ||
        (enquiry.city && enquiry.city.toLowerCase().includes(query));

      const enquiryDate = new Date(enquiry.createdAt);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate + "T23:59:59") : null;

      const matchesDateRange =
        (!start || enquiryDate >= start) && (!end || enquiryDate <= end);

      return matchesSearch && matchesDateRange;
    });
  }, [status, searchQuery, startDate, endDate]);

  function clearFilters() {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
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
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Enquiries</h1>
            <span className="text-sm text-gray-500">
              {filteredEnquiries.length} of{" "}
              {status.state === "success" ? status.data.length : 0} results
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search name, phone, city, message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500 dark:bg-gray-800">
                  From
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-11 w-40 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500 dark:bg-gray-800">
                  To
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-11 w-40 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
            </div>
            {(searchQuery || startDate || endDate) && (
              <button
                onClick={clearFilters}
                className="h-11 rounded-xl border border-gray-200 bg-white px-5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {status.state === "error" && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            {status.message}
          </div>
        )}

        {status.state === "success" && filteredEnquiries.length === 0 && (
          <div className="rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-500 dark:border-gray-700">
            {status.data.length === 0
              ? "No enquiries yet."
              : "No enquiries match your filters."}
          </div>
        )}

        {status.state === "success" && filteredEnquiries.length > 0 && (
          <div className="grid gap-4">
            {filteredEnquiries.map((enquiry) => (
              <div
                key={enquiry.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {enquiry.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {enquiry.phone}
                      {enquiry.city && ` • ${enquiry.city}`}
                    </p>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    {new Date(enquiry.createdAt).toLocaleString()}
                    {enquiry.sourcePage && (
                      <div className="mt-1">From: {enquiry.sourcePage}</div>
                    )}
                  </div>
                </div>
                <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                  {enquiry.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
