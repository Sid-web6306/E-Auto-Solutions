import { NextResponse } from "next/server";
import admin from "firebase-admin";

import { getAdminDb } from "@/lib/firebase-admin";

async function verifyToken(authHeader: string | null) {
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split("Bearer ")[1];
  if (!token) return null;

  try {
    const db = getAdminDb();
    void db;
    const decoded = await admin.auth().verifyIdToken(token);
    return decoded;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const decodedToken = await verifyToken(authHeader);

    if (!decodedToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = getAdminDb();
    const snapshot = await db
      .collection("enquiries")
      .orderBy("createdAt", "desc")
      .get();

    const enquiries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ enquiries }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: message, code: "ENQUIRIES_FETCH_FAILED" },
      { status: 500 }
    );
  }
}
