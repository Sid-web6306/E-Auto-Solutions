import admin from "firebase-admin";

type ServiceAccount = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
};

function getPrivateKey(): string | undefined {
  const raw = process.env.FIREBASE_PRIVATE_KEY;
  if (!raw) return undefined;

  const trimmed = raw.trim();
  const unquoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1)
      : trimmed;

  return unquoted.replace(/\\n/g, "\n").replace(/\r\n/g, "\n");
}

function loadServiceAccountFromEnv(): ServiceAccount | null {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!json) return null;

  const trimmed = json.trim();
  const unquoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1)
      : trimmed;

  const parsed = JSON.parse(unquoted) as ServiceAccount;
  if (parsed.private_key) {
    parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
  }

  return parsed;
}

export function getAdminDb() {
  if (!admin.apps.length) {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const serviceAccountFromEnv = loadServiceAccountFromEnv();

    if (serviceAccountPath) {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccountPath;
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    } else if (serviceAccountFromEnv) {
      const projectId =
        serviceAccountFromEnv.project_id || process.env.FIREBASE_PROJECT_ID;
      const clientEmail =
        serviceAccountFromEnv.client_email || process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey =
        serviceAccountFromEnv.private_key || getPrivateKey();

      if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
          "Invalid FIREBASE_SERVICE_ACCOUNT_JSON. Expected project_id, client_email, private_key."
        );
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = getPrivateKey();

      if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
          "Missing Firebase Admin env vars. Set FIREBASE_SERVICE_ACCOUNT_PATH (recommended) or FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY."
        );
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }
  }

  return admin.firestore();
}
