import admin from "firebase-admin";
import { prisma } from "@workspace/db";
import { sendMail } from "./sendMail";

let firebaseInitialized = false;

function initFirebase() {
  if (firebaseInitialized) return;
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    console.warn("[FCM] FIREBASE_SERVICE_ACCOUNT_JSON not set, push notifications disabled");
    return;
  }

  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    firebaseInitialized = true;
    console.log("[FCM] Firebase Admin initialized");
  } catch (err) {
    console.error("[FCM] Failed to initialize Firebase Admin:", err);
  }
}

type NotificationType = "galleryExpiry" | "storageWarning" | "billingFailed" | "comments";

/**
 * Send a notification to a user via browser push and/or email.
 * Respects the user's per-channel notification preferences.
 */
export async function sendNotification(
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
  data?: Record<string, string>,
) {
  // Always persist as an in-app notification
  await (prisma as any).notification.create({
    data: { userId, type, title, body, data: data ?? undefined },
  });

  const prefs = await (prisma as any).notificationPreference.findUnique({
    where: { userId },
  });

  // All channels default to false — if no prefs record, skip entirely
  const browserKey = `${type}Browser` as const;
  const emailKey = `${type}Email` as const;
  const browserEnabled = prefs?.[browserKey] === true;
  const emailEnabled = prefs?.[emailKey] === true;

  if (!browserEnabled && !emailEnabled) {
    return;
  }

  // Send browser push via FCM
  if (browserEnabled) {
    await sendBrowserPush(userId, type, title, body, data);
  }

  // Send email
  if (emailEnabled) {
    await sendEmailNotification(userId, title, body);
  }
}

async function sendBrowserPush(
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
  data?: Record<string, string>,
) {
  initFirebase();
  if (!firebaseInitialized) return;

  const tokens = await (prisma as any).fcmToken.findMany({
    where: { userId },
    select: { token: true },
  });

  if (tokens.length === 0) {
    console.log(`[FCM] No tokens for user ${userId}, skipping browser push`);
    return;
  }

  const tokenStrings: string[] = tokens.map((t: any) => t.token);

  try {
    const response = await admin.messaging().sendEachForMulticast({
      tokens: tokenStrings,
      notification: { title, body },
      data: data ?? {},
    });

    // Clean up invalid tokens
    const tokensToRemove: string[] = [];
    response.responses.forEach((resp, idx) => {
      if (
        !resp.success &&
        resp.error &&
        (resp.error.code === "messaging/registration-token-not-registered" ||
          resp.error.code === "messaging/invalid-registration-token")
      ) {
        tokensToRemove.push(tokenStrings[idx]!);
      }
    });

    if (tokensToRemove.length > 0) {
      await (prisma as any).fcmToken.deleteMany({
        where: { userId, token: { in: tokensToRemove } },
      });
      console.log(`[FCM] Removed ${tokensToRemove.length} stale token(s) for user ${userId}`);
    }

    console.log(
      `[FCM] Sent "${type}" browser push to user ${userId}: ${response.successCount}/${tokenStrings.length} succeeded`,
    );
  } catch (err) {
    console.error(`[FCM] Failed to send "${type}" browser push to user ${userId}:`, err);
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendEmailNotification(
  userId: string,
  title: string,
  body: string,
) {
  const user = await (prisma as any).user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!user?.email) return;

  const safeTitle = escapeHtml(title);
  const safeBody = escapeHtml(body);

  try {
    await sendMail({
      to: user.email,
      subject: `FOTNO — ${title}`,
      text: `<h2 style="margin:0 0 8px;font-size:18px;font-weight:600;color:#111827;">${safeTitle}</h2>
<p style="margin:0;color:#374151;">${safeBody}</p>`,
      preheaderText: body,
    });
    console.log(`[Notification] Sent email to user ${userId}: "${title}"`);
  } catch (err) {
    console.error(`[Notification] Failed to send email to user ${userId}:`, err);
  }
}

// Keep backward-compatible alias
export const sendPushNotification = sendNotification;
