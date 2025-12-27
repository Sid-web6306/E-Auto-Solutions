import { NextResponse } from "next/server";
import { z } from "zod";

import { getAdminDb } from "@/lib/firebase-admin";

const enquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(7).max(20),
  city: z.string().trim().min(1).max(80).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(2000),
  sourcePage: z.string().trim().max(200).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = enquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = getAdminDb();

    const doc = {
      ...parsed.data,
      city: parsed.data.city || null,
      createdAt: new Date().toISOString(),
    };

    const ref = await db.collection("enquiries").add(doc);

    return NextResponse.json({ ok: true, id: ref.id }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { ok: false, error: message, code: "ENQUIRY_WRITE_FAILED" },
      { status: 500 }
    );
  }
}
