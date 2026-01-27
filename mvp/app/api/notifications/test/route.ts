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

/**
 * Send a test push notification directly to a subscription
 * Used for testing push notification setup
 */
export async function POST(request: NextRequest) {
  try {
    // Check if VAPID keys are configured
    if (!vapidPublicKey || !vapidPrivateKey) {
      return NextResponse.json(
        {
          error: "Push notifications are not configured",
          details: "VAPID keys are missing. Please set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in your environment variables."
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { subscription, title, message } = body;

    if (!subscription) {
      return NextResponse.json(
        { error: "Missing subscription" },
        { status: 400 }
      );
    }

    // Parse the subscription if it's a string
    const pushSubscription = typeof subscription === "string"
      ? JSON.parse(subscription)
      : subscription;

    // Send the test notification
    const result = await webpush.sendNotification(
      pushSubscription,
      JSON.stringify({
        title: title || "Test Notification",
        body: message || "Push notifications are working! 🎉",
        url: "/",
        icon: "/icon-192.png",
        tag: "test-notification",
        priority: "high",
      }),
      {
        TTL: 60, // 1 minute
        urgency: "high",
      }
    );

    return NextResponse.json({
      success: true,
      statusCode: result.statusCode,
    });

  } catch (error) {
    console.error("Error sending test push notification:", error);

    const err = error as { statusCode?: number; body?: string; message?: string };

    // Handle specific web-push errors
    if (err.statusCode === 410 || err.statusCode === 404) {
      return NextResponse.json(
        {
          error: "Subscription expired or invalid",
          details: "Please re-enable push notifications",
          code: "SUBSCRIPTION_EXPIRED"
        },
        { status: 410 }
      );
    }

    if (err.statusCode === 401) {
      return NextResponse.json(
        {
          error: "VAPID authentication failed",
          details: "Please check your VAPID keys configuration",
          code: "VAPID_ERROR"
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to send test notification",
        details: err.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}
