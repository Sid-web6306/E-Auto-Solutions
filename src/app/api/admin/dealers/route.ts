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
      .collection("dealers")
      .orderBy("createdAt", "desc")
      .get();

    const dealers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ dealers }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: message, code: "DEALERS_FETCH_FAILED" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const decodedToken = await verifyToken(authHeader);

    if (!decodedToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, address, phone, email, location } = body;

    if (!name || !address || !phone || !email || !location) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const docRef = await db.collection("dealers").add({
      name,
      address,
      phone,
      email,
      location,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { id: docRef.id, message: "Dealer added successfully" },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: message, code: "DEALER_CREATE_FAILED" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const decodedToken = await verifyToken(authHeader);

    if (!decodedToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, name, address, phone, email, location } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Dealer ID is required" },
        { status: 400 }
      );
    }

    if (!name || !address || !phone || !email || !location) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    await db.collection("dealers").doc(id).update({
      name,
      address,
      phone,
      email,
      location,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "Dealer updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: message, code: "DEALER_UPDATE_FAILED" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const decodedToken = await verifyToken(authHeader);

    if (!decodedToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Dealer ID is required" },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    await db.collection("dealers").doc(id).delete();

    return NextResponse.json(
      { message: "Dealer deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: message, code: "DEALER_DELETE_FAILED" },
      { status: 500 }
    );
  }
}
