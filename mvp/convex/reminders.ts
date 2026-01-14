import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ===========================================
// REMINDER QUERIES
// ===========================================

// Get all reminders for an estate plan
export const getReminders = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reminders")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .collect();
  },
});

// Get pending reminders sorted by due date
export const getPendingReminders = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, args) => {
    const reminders = await ctx.db
      .query("reminders")
      .withIndex("by_status", (q) =>
        q.eq("estatePlanId", args.estatePlanId).eq("status", "pending")
      )
      .collect();

    // Sort by due date
    return reminders.sort((a, b) => a.dueDate - b.dueDate);
  },
});

// Get upcoming reminders (due in next 30 days)
export const getUpcomingReminders = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, args) => {
    const now = Date.now();
    const thirtyDaysFromNow = now + (30 * 24 * 60 * 60 * 1000);

    const reminders = await ctx.db
      .query("reminders")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .collect();

    return reminders
      .filter(r => r.status === "pending" && r.dueDate >= now && r.dueDate <= thirtyDaysFromNow)
      .sort((a, b) => a.dueDate - b.dueDate);
  },
});

// Get overdue reminders
export const getOverdueReminders = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, args) => {
    const now = Date.now();

    const reminders = await ctx.db
      .query("reminders")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .collect();

    return reminders
      .filter(r => r.status === "pending" && r.dueDate < now)
      .sort((a, b) => a.dueDate - b.dueDate);
  },
});

// ===========================================
// REMINDER MUTATIONS
// ===========================================

// Create a new reminder
export const createReminder = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    userId: v.optional(v.id("users")),
    type: v.union(
      v.literal("annual_review"),
      v.literal("life_event"),
      v.literal("document_update"),
      v.literal("beneficiary_review"),
      v.literal("custom")
    ),
    title: v.string(),
    description: v.optional(v.string()),
    lifeEvent: v.optional(v.union(
      v.literal("marriage"),
      v.literal("divorce"),
      v.literal("birth"),
      v.literal("death"),
      v.literal("major_asset_change"),
      v.literal("relocation"),
      v.literal("retirement"),
      v.literal("business_change"),
      v.literal("health_change"),
      v.literal("other")
    )),
    dueDate: v.number(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    isRecurring: v.boolean(),
    recurrencePattern: v.optional(v.union(
      v.literal("monthly"),
      v.literal("quarterly"),
      v.literal("annually"),
      v.literal("biannually")
    )),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("reminders", {
      ...args,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Complete a reminder
export const completeReminder = mutation({
  args: {
    reminderId: v.id("reminders"),
    createNextRecurrence: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const reminder = await ctx.db.get(args.reminderId);
    if (!reminder) throw new Error("Reminder not found");

    // Mark as completed
    await ctx.db.patch(args.reminderId, {
      status: "completed",
      completedAt: now,
      updatedAt: now,
    });

    // If recurring and requested, create next occurrence
    if (reminder.isRecurring && args.createNextRecurrence !== false && reminder.recurrencePattern) {
      let nextDueDate = reminder.dueDate;
      switch (reminder.recurrencePattern) {
        case "monthly":
          nextDueDate += 30 * 24 * 60 * 60 * 1000;
          break;
        case "quarterly":
          nextDueDate += 90 * 24 * 60 * 60 * 1000;
          break;
        case "annually":
          nextDueDate += 365 * 24 * 60 * 60 * 1000;
          break;
        case "biannually":
          nextDueDate += 182 * 24 * 60 * 60 * 1000;
          break;
      }

      await ctx.db.insert("reminders", {
        estatePlanId: reminder.estatePlanId,
        userId: reminder.userId,
        type: reminder.type,
        title: reminder.title,
        description: reminder.description,
        lifeEvent: reminder.lifeEvent,
        dueDate: nextDueDate,
        status: "pending",
        priority: reminder.priority,
        isRecurring: true,
        recurrencePattern: reminder.recurrencePattern,
        createdAt: now,
        updatedAt: now,
      });
    }

    return args.reminderId;
  },
});

// Snooze a reminder
export const snoozeReminder = mutation({
  args: {
    reminderId: v.id("reminders"),
    snoozeUntil: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.patch(args.reminderId, {
      status: "snoozed",
      snoozedUntil: args.snoozeUntil,
      dueDate: args.snoozeUntil,
      updatedAt: now,
    });
    return args.reminderId;
  },
});

// Dismiss a reminder
export const dismissReminder = mutation({
  args: { reminderId: v.id("reminders") },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.patch(args.reminderId, {
      status: "dismissed",
      updatedAt: now,
    });
    return args.reminderId;
  },
});

// Update a reminder
export const updateReminder = mutation({
  args: {
    reminderId: v.id("reminders"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    priority: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    )),
    isRecurring: v.optional(v.boolean()),
    recurrencePattern: v.optional(v.union(
      v.literal("monthly"),
      v.literal("quarterly"),
      v.literal("annually"),
      v.literal("biannually")
    )),
  },
  handler: async (ctx, args) => {
    const { reminderId, ...updates } = args;
    const now = Date.now();

    await ctx.db.patch(reminderId, {
      ...updates,
      updatedAt: now,
    });
    return reminderId;
  },
});

// Delete a reminder
export const deleteReminder = mutation({
  args: { reminderId: v.id("reminders") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.reminderId);
  },
});

// ===========================================
// LIFE EVENTS QUERIES & MUTATIONS
// ===========================================

// Get all life events for an estate plan
export const getLifeEvents = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lifeEvents")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .order("desc")
      .collect();
  },
});

// Log a life event
export const logLifeEvent = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    eventType: v.union(
      v.literal("marriage"),
      v.literal("divorce"),
      v.literal("birth"),
      v.literal("death"),
      v.literal("major_asset_change"),
      v.literal("relocation"),
      v.literal("retirement"),
      v.literal("business_change"),
      v.literal("health_change"),
      v.literal("other")
    ),
    title: v.string(),
    description: v.optional(v.string()),
    eventDate: v.number(),
    requiresDocumentUpdate: v.boolean(),
    documentsAffected: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Create the life event
    const eventId = await ctx.db.insert("lifeEvents", {
      estatePlanId: args.estatePlanId,
      eventType: args.eventType,
      title: args.title,
      description: args.description,
      eventDate: args.eventDate,
      requiresDocumentUpdate: args.requiresDocumentUpdate,
      documentsAffected: args.documentsAffected ? JSON.stringify(args.documentsAffected) : undefined,
      planUpdated: false,
      createdAt: now,
    });

    // If requires document update, create a reminder
    if (args.requiresDocumentUpdate) {
      // Due in 2 weeks
      const dueDate = now + (14 * 24 * 60 * 60 * 1000);

      await ctx.db.insert("reminders", {
        estatePlanId: args.estatePlanId,
        type: "life_event",
        lifeEvent: args.eventType,
        title: `Update estate plan after ${args.eventType.replace("_", " ")}`,
        description: `Your ${args.eventType.replace("_", " ")} event may require updates to your estate planning documents.`,
        dueDate,
        status: "pending",
        priority: "high",
        isRecurring: false,
        createdAt: now,
        updatedAt: now,
      });
    }

    return eventId;
  },
});

// Mark life event as addressed
export const markEventAddressed = mutation({
  args: { eventId: v.id("lifeEvents") },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.patch(args.eventId, {
      planUpdated: true,
      planUpdatedAt: now,
    });
    return args.eventId;
  },
});

// ===========================================
// AUTO-REMINDER HELPERS
// ===========================================

// Create default reminders for a new estate plan
export const createDefaultReminders = mutation({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, args) => {
    const now = Date.now();
    const oneYear = 365 * 24 * 60 * 60 * 1000;

    // Annual review reminder
    await ctx.db.insert("reminders", {
      estatePlanId: args.estatePlanId,
      type: "annual_review",
      title: "Annual Estate Plan Review",
      description: "Review your estate plan to ensure it reflects your current wishes and life circumstances.",
      dueDate: now + oneYear,
      status: "pending",
      priority: "medium",
      isRecurring: true,
      recurrencePattern: "annually",
      createdAt: now,
      updatedAt: now,
    });

    // Beneficiary review reminder (every 6 months)
    await ctx.db.insert("reminders", {
      estatePlanId: args.estatePlanId,
      type: "beneficiary_review",
      title: "Review Beneficiary Designations",
      description: "Verify that beneficiary designations on retirement accounts, life insurance, and other accounts are current.",
      dueDate: now + (oneYear / 2),
      status: "pending",
      priority: "medium",
      isRecurring: true,
      recurrencePattern: "biannually",
      createdAt: now,
      updatedAt: now,
    });

    return true;
  },
});

// Get reminder statistics
export const getReminderStats = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, args) => {
    const reminders = await ctx.db
      .query("reminders")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .collect();

    const now = Date.now();

    return {
      total: reminders.length,
      pending: reminders.filter(r => r.status === "pending").length,
      completed: reminders.filter(r => r.status === "completed").length,
      overdue: reminders.filter(r => r.status === "pending" && r.dueDate < now).length,
      snoozed: reminders.filter(r => r.status === "snoozed").length,
      urgent: reminders.filter(r => r.status === "pending" && r.priority === "urgent").length,
    };
  },
});
