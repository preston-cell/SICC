import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Check for due reminders and send notifications
 * Runs hourly via cron
 */
export const checkAndSendReminders = internalAction({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const oneDayFromNow = now + 24 * 60 * 60 * 1000;

    // Get all pending reminders that are due within the next day
    // We'll need to query through a regular query first
    const dueRemindersData = await ctx.runQuery(
      internal.notificationActions.getDueRemindersInternal,
      {}
    );

    console.log(`Found ${dueRemindersData.length} due reminders to process`);

    for (const { reminder, preferences } of dueRemindersData) {
      // Skip if no preferences or notifications disabled
      if (!preferences) continue;

      const isOverdue = reminder.dueDate < now;

      // Send email notification if enabled
      if (preferences.emailEnabled && preferences.emailAddress && preferences.emailVerified) {
        // Check reminder type preferences
        const shouldNotify =
          (reminder.type === "annual_review" && preferences.annualReviewReminders) ||
          (reminder.type === "beneficiary_review" && preferences.beneficiaryReviewReminders) ||
          (reminder.type === "life_event" && preferences.lifeEventPrompts) ||
          (isOverdue && preferences.overdueAlerts) ||
          reminder.type === "custom" ||
          reminder.type === "document_update" ||
          reminder.type === "preparation_task";

        if (shouldNotify) {
          // Log the notification attempt
          await ctx.runMutation(internal.notifications.logNotification, {
            estatePlanId: reminder.estatePlanId,
            reminderId: reminder._id,
            type: "email",
            subject: `Reminder: ${reminder.title}`,
            body: reminder.description,
            status: "pending",
          });

          // Note: Actual email sending happens via HTTP action to avoid
          // Convex action limitations. The API route will process pending notifications.
        }
      }

      // Send push notification if enabled
      if (preferences.pushEnabled && preferences.pushSubscription) {
        await ctx.runMutation(internal.notifications.logNotification, {
          estatePlanId: reminder.estatePlanId,
          reminderId: reminder._id,
          type: "push",
          subject: reminder.title,
          body: reminder.description,
          status: "pending",
        });
      }
    }
  },
});

/**
 * Send weekly digest emails to users who have enabled them
 * Runs weekly on Sundays via cron
 */
export const sendWeeklyDigests = internalAction({
  args: {},
  handler: async (ctx) => {
    // Get all notification preferences with digest enabled
    const prefsWithDigest = await ctx.runQuery(
      internal.notificationActions.getDigestEnabledPreferences,
      {}
    );

    console.log(`Processing ${prefsWithDigest.length} weekly digests`);

    for (const prefs of prefsWithDigest) {
      if (!prefs.emailAddress || !prefs.emailVerified) continue;
      if (prefs.digestFrequency !== "weekly") continue;

      // Get pending reminders for this estate plan
      const reminders = await ctx.runQuery(
        internal.notificationActions.getPendingRemindersForEstatePlan,
        { estatePlanId: prefs.estatePlanId }
      );

      if (reminders.length === 0) continue;

      // Log the digest notification
      await ctx.runMutation(internal.notifications.logNotification, {
        estatePlanId: prefs.estatePlanId,
        type: "digest",
        subject: `Weekly Estate Plan Summary (${reminders.length} items)`,
        status: "pending",
      });
    }
  },
});

// Internal queries used by the actions above
import { internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const getDueRemindersInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const oneDayFromNow = now + 24 * 60 * 60 * 1000;

    // Get all pending reminders due within the next day
    const reminders = await ctx.db
      .query("reminders")
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "pending"),
          q.lte(q.field("dueDate"), oneDayFromNow)
        )
      )
      .take(100);

    // Get notification preferences for each estate plan
    const reminderWithPrefs = await Promise.all(
      reminders.map(async (reminder) => {
        const prefs = await ctx.db
          .query("notificationPreferences")
          .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", reminder.estatePlanId))
          .first();
        return { reminder, preferences: prefs };
      })
    );

    return reminderWithPrefs;
  },
});

export const getDigestEnabledPreferences = internalQuery({
  args: {},
  handler: async (ctx) => {
    const prefs = await ctx.db
      .query("notificationPreferences")
      .filter((q) => q.eq(q.field("digestEnabled"), true))
      .take(500);

    return prefs;
  },
});

export const getPendingRemindersForEstatePlan = internalQuery({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, args) => {
    const now = Date.now();
    const reminders = await ctx.db
      .query("reminders")
      .withIndex("by_status", (q) =>
        q.eq("estatePlanId", args.estatePlanId).eq("status", "pending")
      )
      .take(50);

    return reminders.map((r) => ({
      title: r.title,
      dueDate: r.dueDate,
      priority: r.priority,
      isOverdue: r.dueDate < now,
    }));
  },
});
