import { NextResponse } from "next/server";

function parsePrivateKey(raw: string): string {
  let key = raw.trim();
  
  // Remove surrounding quotes if present
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  // Handle escaped newlines
  key = key.replace(/\\n/g, "\n").replace(/\r\n/g, "\n");

  return key;
}

export async function GET() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  const parsed = privateKey ? parsePrivateKey(privateKey) : null;

  return NextResponse.json({
    projectId: projectId ? `${projectId.slice(0, 10)}... (len: ${projectId.length})` : "MISSING",
    clientEmail: clientEmail ? `${clientEmail.slice(0, 20)}... (len: ${clientEmail.length})` : "MISSING",
    raw: privateKey
      ? {
          length: privateKey.length,
          first30: privateKey.slice(0, 30),
        }
      : "MISSING",
    parsed: parsed
      ? {
          length: parsed.length,
          startsCorrectly: parsed.startsWith("-----BEGIN PRIVATE KEY-----"),
          endsCorrectly: parsed.endsWith("-----END PRIVATE KEY-----\n") || parsed.endsWith("-----END PRIVATE KEY-----"),
          hasRealNewlines: parsed.includes("\n"),
          newlineCount: (parsed.match(/\n/g) || []).length,
        }
      : "MISSING",
  });
}
