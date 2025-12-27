"use client";

import { useMemo, useState } from "react";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success" }
  | { state: "error"; message: string };

export function EnquiryForm(props: { sourcePage?: string }) {
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const disabled = useMemo(() => status.state === "submitting", [status.state]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ state: "submitting" });

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      city: String(formData.get("city") || ""),
      message: String(formData.get("message") || ""),
      sourcePage: props.sourcePage,
    };

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setStatus({
          state: "error",
          message: data?.error || "Failed to submit. Please try again.",
        });
        return;
      }

      form.reset();
      setStatus({ state: "success" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error";
      setStatus({ state: "error", message });
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <label className="text-sm font-semibold">Name</label>
        <input
          className="h-11 rounded-2xl border border-black/15 bg-transparent px-4 text-sm outline-none focus:border-black/30 dark:border-white/15 dark:focus:border-white/30"
          name="name"
          placeholder="Your name"
          disabled={disabled}
          required
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold">Phone</label>
        <input
          className="h-11 rounded-2xl border border-black/15 bg-transparent px-4 text-sm outline-none focus:border-black/30 dark:border-white/15 dark:focus:border-white/30"
          name="phone"
          placeholder="Your phone"
          disabled={disabled}
          required
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold">City</label>
        <input
          className="h-11 rounded-2xl border border-black/15 bg-transparent px-4 text-sm outline-none focus:border-black/30 dark:border-white/15 dark:focus:border-white/30"
          name="city"
          placeholder="Your city"
          disabled={disabled}
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold">Message</label>
        <textarea
          className="min-h-28 rounded-2xl border border-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-black/30 dark:border-white/15 dark:focus:border-white/30"
          name="message"
          placeholder="Tell us what you need"
          disabled={disabled}
          required
        />
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="inline-flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white hover:bg-black/90 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90"
      >
        {status.state === "submitting" ? "Submitting…" : "Submit enquiry"}
      </button>

      {status.state === "success" ? (
        <div className="text-sm text-black/70 dark:text-white/70">
          Thanks! We received your enquiry.
        </div>
      ) : null}

      {status.state === "error" ? (
        <div className="text-sm text-red-600 dark:text-red-400">
          {status.message}
        </div>
      ) : null}
    </form>
  );
}
