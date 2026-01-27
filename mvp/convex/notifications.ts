import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// ============================================
// QUERIES
// ============================================

// Get notification preferences for an estate plan
export const getNotificationPreferences = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, args) => {
    const preferences = await ctx.db
      .query("notificationPreferences")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .first();

    // Return default preferences if none exist
    if (!preferences) {
      return {
        estatePlanId: args.estatePlanId,
        emailEnabled: false,
        emailAddress: undefined,
        emailVerified: false,
        pushEnabled: false,
        pushSubscription: undefined,
        digestEnabled: false,
        digestFrequency: "weekly" as const,
        annualReviewReminders: true,
        beneficiaryReviewReminders: true,
        lifeEventPrompts: true,
        overdueAlerts: true,
        isDefault: true,
      };
    }

    return { ...preferences, isDefault: false };
  },
});

// Get notification log for an estate plan
export const getNotificationLog = query({
  args: {
    estatePlanId: v.id("estatePlans"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const logs = await ctx.db
      .query("notificationLog")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .order("desc")
      .take(limit);

    return logs;
  },
});

// Get pending notifications to send
export const getPendingNotifications = query({
  args: {},
  handler: async (ctx) => {
    const pendingLogs = await ctx.db
      .query("notificationLog")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .take(100);

    return pendingLogs;
  },
});

// ============================================
// MUTATIONS
// ============================================

// Create or update notification preferences
export const updateNotificationPreferences = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    emailEnabled: v.optional(v.boolean()),
    emailAddress: v.optional(v.string()),
    pushEnabled: v.optional(v.boolean()),
    pushSubscription: v.optional(v.string()),
    digestEnabled: v.optional(v.boolean()),
    digestFrequency: v.optional(v.union(
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("monthly")
    )),
    annualReviewReminders: v.optional(v.boolean()),
    beneficiaryReviewReminders: v.optional(v.boolean()),
    lifeEventPrompts: v.optional(v.boolean()),
    overdueAlerts: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { estatePlanId, ...updates } = args;
    const now = Date.now();

    // Check if preferences already exist
    const existing = await ctx.db
      .query("notificationPreferences")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .first();

    if (existing) {
      // Update existing preferences
      await ctx.db.patch(existing._id, {
        ...updates,
        updatedAt: now,
      });
      return existing._id;
    } else {
      // Create new preferences with defaults
      const newPreferences = await ctx.db.insert("notificationPreferences", {
        estatePlanId,
        emailEnabled: updates.emailEnabled ?? false,
        emailAddress: updates.emailAddress,
        emailVerified: false,
        pushEnabled: updates.pushEnabled ?? false,
        pushSubscription: updates.pushSubscription,
        digestEnabled: updates.digestEnabled ?? false,
        digestFrequency: updates.digestFrequency ?? "weekly",
        annualReviewReminders: updates.annualReviewReminders ?? true,
        beneficiaryReviewReminders: updates.beneficiaryReviewReminders ?? true,
        lifeEventPrompts: updates.lifeEventPrompts ?? true,
        overdueAlerts: updates.overdueAlerts ?? true,
        createdAt: now,
        updatedAt: now,
      });
      return newPreferences;
    }
  },
});

// Verify email address
export const verifyEmail = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
  },
  handler: async (ctx, args) => {
    const preferences = await ctx.db
      .query("notificationPreferences")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .first();

    if (preferences) {
      await ctx.db.patch(preferences._id, {
        emailVerified: true,
        updatedAt: Date.now(),
      });
    }
  },
});

// Save push subscription
export const savePushSubscription = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    subscription: v.string(),
  },
  handler: async (ctx, args) => {
    const preferences = await ctx.db
      .query("notificationPreferences")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .first();

    const now = Date.now();

    if (preferences) {
      await ctx.db.patch(preferences._id, {
        pushEnabled: true,
        pushSubscription: args.subscription,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("notificationPreferences", {
        estatePlanId: args.estatePlanId,
        emailEnabled: false,
        emailVerified: false,
        pushEnabled: true,
        pushSubscription: args.subscription,
        digestEnabled: false,
        digestFrequency: "weekly",
        annualReviewReminders: true,
        beneficiaryReviewReminders: true,
        lifeEventPrompts: true,
        overdueAlerts: true,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Log a notification (internal use)
export const logNotification = internalMutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    reminderId: v.optional(v.id("reminders")),
    type: v.union(v.literal("email"), v.literal("push"), v.literal("digest")),
    subject: v.string(),
    body: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("sent"),
      v.literal("failed"),
      v.literal("delivered")
    ),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("notificationLog", {
      ...args,
      sentAt: args.status === "sent" ? now : undefined,
      createdAt: now,
    });
  },
});

// Mark notification as sent
export const markNotificationSent = mutation({
  args: {
    notificationId: v.id("notificationLog"),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.patch(args.notificationId, {
      status: args.error ? "failed" : "sent",
      sentAt: now,
      error: args.error,
    });
  },
});

// Get due reminders that need notifications
export const getDueReminders = query({
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
