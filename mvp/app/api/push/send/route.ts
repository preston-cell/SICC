import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

// Configure web-push with VAPID keys
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || "";
// VAPID subject must be https: or mailto: URL
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
const vapidSubject = appUrl.startsWith("https://") ? appUrl : "mailto:hello@estate-plan.app";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

interface PushPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
  tag?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  reminderId?: string;
}

interface SendPushRequest {
  subscription: string; // JSON stringified PushSubscription
  payload: PushPayload;
}

export async function POST(request: NextRequest) {
  try {
    // Check if VAPID keys are configured
    if (!vapidPublicKey || !vapidPrivateKey) {
      return NextResponse.json(
        { error: "Push notifications are not configured" },
        { status: 500 }
      );
    }

    const body: SendPushRequest = await request.json();
    const { subscription, payload } = body;

    if (!subscription || !payload) {
      return NextResponse.json(
        { error: "Missing subscription or payload" },
        { status: 400 }
      );
    }

    // Parse the subscription
    let pushSubscription: webpush.PushSubscription;
    try {
      pushSubscription = JSON.parse(subscription);
    } catch {
      return NextResponse.json(
        { error: "Invalid subscription format" },
        { status: 400 }
      );
    }

    // Send the push notification
    const result = await webpush.sendNotification(
      pushSubscription,
      JSON.stringify({
        title: payload.title,
        body: payload.body,
        url: payload.url || "/",
        icon: payload.icon || "/icon-192.png",
        tag: payload.tag || "estate-plan-reminder",
        priority: payload.priority || "medium",
        reminderId: payload.reminderId,
      }),
      {
        TTL: 60 * 60, // 1 hour
        urgency: payload.priority === "urgent" ? "high" : "normal",
      }
    );

    return NextResponse.json({
      success: true,
      statusCode: result.statusCode,
    });
  } catch (error: unknown) {
    console.error("Error sending push notification:", error);

    // Handle specific web-push errors
    const err = error as { statusCode?: number; body?: string };
    if (err.statusCode === 410 || err.statusCode === 404) {
      // Subscription has expired or is invalid
      return NextResponse.json(
        { error: "Subscription expired", code: "SUBSCRIPTION_EXPIRED" },
        { status: 410 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send push notification" },
      { status: 500 }
    );
  }
}

// Also support GET for testing
export async function GET() {
  return NextResponse.json({
    configured: !!(vapidPublicKey && vapidPrivateKey),
    publicKey: vapidPublicKey ? "configured" : "missing",
  });
}
