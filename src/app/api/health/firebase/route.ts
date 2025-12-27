import { NextResponse } from "next/server";

import { getAdminDb } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const write = url.searchParams.get("write") === "1";

    const db = getAdminDb();

    if (write) {
      const ref = db.collection("_health").doc();
      await ref.set({
        createdAt: new Date().toISOString(),
        type: "firebase_admin_healthcheck",
      });
      await ref.delete();
    }

    return NextResponse.json({ ok: true, writeTest: write });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
