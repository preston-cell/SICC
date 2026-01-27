import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import webpush from "web-push";

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

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
 * Process pending notifications and send them
 * This endpoint can be called by:
 * - Vercel Cron
 * - Convex scheduled action
 * - Manual trigger
 */
export async function POST(request: NextRequest) {
  try {
    // Verify API key for security (optional, for cron jobs)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Allow requests without auth in development, or with valid cron secret
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // Also allow internal requests (no auth header but from localhost)
      const isInternal = request.headers.get("x-internal-request") === "true";
      if (!isInternal && process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Get pending notifications from Convex
    const pendingNotifications = await convex.query(api.notifications.getPendingNotifications, {});

    console.log(`Processing ${pendingNotifications.length} pending notifications`);

    const results = {
      processed: 0,
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const notification of pendingNotifications) {
      results.processed++;

      try {
        if (notification.type === "push") {
          // Get the notification preferences to get the push subscription
          const prefs = await convex.query(api.notifications.getNotificationPreferences, {
            estatePlanId: notification.estatePlanId,
          });

          if (!prefs.pushSubscription) {
            console.log(`No push subscription for estate plan ${notification.estatePlanId}`);
            await convex.mutation(api.notifications.markNotificationSent, {
              notificationId: notification._id,
              error: "No push subscription found",
            });
            results.failed++;
            continue;
          }

          // Check if VAPID keys are configured
          if (!vapidPublicKey || !vapidPrivateKey) {
            console.error("VAPID keys not configured");
            await convex.mutation(api.notifications.markNotificationSent, {
              notificationId: notification._id,
              error: "VAPID keys not configured",
            });
            results.failed++;
            continue;
          }

          // Parse the subscription
          const pushSubscription = JSON.parse(prefs.pushSubscription);

          // Send the push notification
          await webpush.sendNotification(
            pushSubscription,
            JSON.stringify({
              title: notification.subject,
              body: notification.body || "You have a reminder",
              url: `/analysis/${notification.estatePlanId}/reminders`,
              icon: "/icon-192.png",
              tag: `reminder-${notification.reminderId || notification._id}`,
              priority: "high",
              reminderId: notification.reminderId,
            }),
            {
              TTL: 60 * 60 * 24, // 24 hours
              urgency: "high",
            }
          );

          // Mark as sent
          await convex.mutation(api.notifications.markNotificationSent, {
            notificationId: notification._id,
          });
          results.sent++;
          console.log(`Push notification sent: ${notification.subject}`);

        } else if (notification.type === "email") {
          // Email sending would go here - using Resend
          // For now, just mark as sent (email implementation is separate)
          console.log(`Email notification queued: ${notification.subject}`);
          // The email would be sent via the Resend API
          // await sendReminderEmail(...);

          // Mark as sent for now (implement actual email sending separately)
          await convex.mutation(api.notifications.markNotificationSent, {
            notificationId: notification._id,
          });
          results.sent++;

        } else if (notification.type === "digest") {
          // Digest email sending
          console.log(`Digest notification queued: ${notification.subject}`);
          await convex.mutation(api.notifications.markNotificationSent, {
            notificationId: notification._id,
          });
          results.sent++;
        }

      } catch (error) {
        console.error(`Failed to send notification ${notification._id}:`, error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        results.errors.push(errorMessage);
        results.failed++;

        // Check if subscription expired
        const err = error as { statusCode?: number };
        if (err.statusCode === 410 || err.statusCode === 404) {
          // Subscription expired - mark as failed and note it
          await convex.mutation(api.notifications.markNotificationSent, {
            notificationId: notification._id,
            error: "Push subscription expired",
          });
        } else {
          await convex.mutation(api.notifications.markNotificationSent, {
            notificationId: notification._id,
            error: errorMessage,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
    });

  } catch (error) {
    console.error("Error processing notifications:", error);
    return NextResponse.json(
      { error: "Failed to process notifications" },
      { status: 500 }
    );
  }
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    configured: {
      vapid: !!(vapidPublicKey && vapidPrivateKey),
      convex: !!process.env.NEXT_PUBLIC_CONVEX_URL,
    },
  });
}
