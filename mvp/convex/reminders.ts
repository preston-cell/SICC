import { mutation, query, internalMutation } from "./_generated/server";
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

    // If requires document update, create a reminder with smart due date based on event type
    if (args.requiresDocumentUpdate) {
      // Use smart priority based on life event type
      const priority = getLifeEventPriority(args.eventType);
      const dueDate = calculateDueDateFromPriority(priority);

      await ctx.db.insert("reminders", {
        estatePlanId: args.estatePlanId,
        type: "life_event",
        lifeEvent: args.eventType,
        title: `Update estate plan after ${args.eventType.replace("_", " ")}`,
        description: `Your ${args.eventType.replace("_", " ")} event may require updates to your estate planning documents.`,
        dueDate,
        status: "pending",
        priority,
        isRecurring: false,
        sourceType: "life_event",
        sourceId: `life_event_${eventId}`,
        isAutoGenerated: true,
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

// ===========================================
// SUB-TASK QUERIES & MUTATIONS
// ===========================================

// Get sub-tasks for a parent reminder
export const getSubTasks = query({
  args: { parentReminderId: v.id("reminders") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reminders")
      .withIndex("by_parent", (q) => q.eq("parentReminderId", args.parentReminderId))
      .collect();
  },
});

// Get all reminders with their sub-task counts
export const getRemindersWithSubTaskCounts = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, args) => {
    const reminders = await ctx.db
      .query("reminders")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .collect();

    // Get sub-task counts for parent reminders
    const parentReminders = reminders.filter(r => !r.parentReminderId);
    const subTaskCounts: Record<string, { total: number; completed: number }> = {};

    for (const parent of parentReminders) {
      const subTasks = reminders.filter(r => r.parentReminderId === parent._id);
      if (subTasks.length > 0) {
        subTaskCounts[parent._id] = {
          total: subTasks.length,
          completed: subTasks.filter(s => s.status === "completed").length,
        };
      }
    }

    return {
      reminders: parentReminders,
      subTaskCounts,
    };
  },
});

// ===========================================
// SMART DUE DATE HELPERS
// ===========================================

// Priority to days mapping for smart due dates
const PRIORITY_TO_DAYS = {
  urgent: 7,
  high: 14,
  medium: 30,
  low: 90,
} as const;

// Calculate due date based on priority
export function calculateDueDateFromPriority(priority: "urgent" | "high" | "medium" | "low"): number {
  const days = PRIORITY_TO_DAYS[priority];
  return Date.now() + (days * 24 * 60 * 60 * 1000);
}

// Life event to priority mapping for smart defaults
const LIFE_EVENT_PRIORITIES: Record<string, "urgent" | "high" | "medium" | "low"> = {
  marriage: "high",
  divorce: "high",
  birth: "urgent",
  death: "urgent",
  major_asset_change: "medium",
  relocation: "medium",
  retirement: "medium",
  business_change: "medium",
  health_change: "high",
  other: "medium",
};

// Get smart priority for a life event
export function getLifeEventPriority(eventType: string): "urgent" | "high" | "medium" | "low" {
  return LIFE_EVENT_PRIORITIES[eventType] || "medium";
}

// ===========================================
// AUTO-GENERATE ACTION ITEMS
// ===========================================

// Task breakdown templates for common document types
const TASK_BREAKDOWNS: Record<string, string[]> = {
  will: [
    "Choose an executor and backup executor",
    "List all beneficiaries and their shares",
    "Identify specific bequests (jewelry, heirlooms, etc.)",
    "Designate guardians for minor children if applicable",
    "Schedule consultation with estate planning attorney",
  ],
  trust: [
    "Determine the type of trust needed",
    "Identify trustee and successor trustee",
    "List assets to transfer into the trust",
    "Define distribution terms and conditions",
    "Review trust document with attorney",
  ],
  poa_financial: [
    "Choose a trusted agent for financial matters",
    "Decide on powers to grant (broad vs. limited)",
    "Choose a successor agent",
    "Review with attorney and have properly witnessed",
  ],
  poa_healthcare: [
    "Choose a healthcare proxy/agent",
    "Discuss your healthcare wishes with your agent",
    "Choose a successor healthcare agent",
    "Have document properly executed per state law",
  ],
  healthcare_directive: [
    "Consider end-of-life care preferences",
    "Document preferences for life-sustaining treatment",
    "Specify organ donation preferences",
    "Review and sign with required witnesses/notarization",
  ],
  beneficiary_review: [
    "Gather current beneficiary forms from all accounts",
    "Review retirement account beneficiaries",
    "Review life insurance beneficiaries",
    "Update any outdated designations",
    "Ensure contingent beneficiaries are named",
  ],
};

// Generate action items from gap analysis
export const generateActionItemsFromAnalysis = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    includeSubTasks: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const includeSubTasks = args.includeSubTasks ?? true;

    // Get the latest gap analysis
    const analyses = await ctx.db
      .query("gapAnalysis")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .order("desc")
      .take(1);

    if (analyses.length === 0) {
      return { created: 0, message: "No gap analysis found" };
    }

    const analysis = analyses[0];

    // Get existing reminders to avoid duplicates
    const existingReminders = await ctx.db
      .query("reminders")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .collect();

    const existingSourceIds = new Set(
      existingReminders
        .filter(r => r.sourceId)
        .map(r => r.sourceId)
    );

    let createdCount = 0;

    // Parse missing documents
    // Note: gap analysis API returns "document" field, but handle "type" for backwards compatibility
    const missingDocs: Array<{ document?: string; type?: string; priority: string; reason: string }> =
      JSON.parse(analysis.missingDocuments || "[]");

    for (const doc of missingDocs) {
      const docName = doc.document || doc.type || "Document";
      const sourceId = `missing_doc_${docName}`;
      if (existingSourceIds.has(sourceId)) continue;

      const priority = (doc.priority as "urgent" | "high" | "medium" | "low") || "medium";
      const dueDate = calculateDueDateFromPriority(priority);

      // Create parent reminder
      const parentId = await ctx.db.insert("reminders", {
        estatePlanId: args.estatePlanId,
        type: "document_update",
        title: `Create ${docName.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}`,
        description: doc.reason,
        dueDate,
        status: "pending",
        priority,
        isRecurring: false,
        sourceType: "gap_analysis",
        sourceId,
        isAutoGenerated: true,
        createdAt: now,
        updatedAt: now,
      });
      createdCount++;

      // Create sub-tasks if template exists
      if (includeSubTasks && docName && TASK_BREAKDOWNS[docName]) {
        const subTasks = TASK_BREAKDOWNS[docName];
        for (let i = 0; i < subTasks.length; i++) {
          await ctx.db.insert("reminders", {
            estatePlanId: args.estatePlanId,
            type: "document_update",
            title: subTasks[i],
            dueDate: dueDate + (i * 24 * 60 * 60 * 1000), // Stagger by 1 day each
            status: "pending",
            priority: "medium",
            isRecurring: false,
            parentReminderId: parentId,
            sourceType: "gap_analysis",
            sourceId: `${sourceId}_step_${i}`,
            isAutoGenerated: true,
            createdAt: now,
            updatedAt: now,
          });
          createdCount++;
        }
      }
    }

    // Parse recommendations
    const recommendations: Array<{ action: string; priority: string; reason: string }> =
      JSON.parse(analysis.recommendations || "[]");

    for (let i = 0; i < recommendations.length; i++) {
      const rec = recommendations[i];
      const sourceId = `recommendation_${i}`;
      if (existingSourceIds.has(sourceId)) continue;

      const priority = (rec.priority as "urgent" | "high" | "medium" | "low") || "medium";
      const dueDate = calculateDueDateFromPriority(priority);

      await ctx.db.insert("reminders", {
        estatePlanId: args.estatePlanId,
        type: "custom",
        title: rec.action,
        description: rec.reason,
        dueDate,
        status: "pending",
        priority,
        isRecurring: false,
        sourceType: "gap_analysis",
        sourceId,
        isAutoGenerated: true,
        createdAt: now,
        updatedAt: now,
      });
      createdCount++;
    }

    // Parse inconsistencies
    const inconsistencies: Array<{ issue: string; details: string; recommendation: string }> =
      JSON.parse(analysis.inconsistencies || "[]");

    for (let i = 0; i < inconsistencies.length; i++) {
      const issue = inconsistencies[i];
      const sourceId = `inconsistency_${i}`;
      if (existingSourceIds.has(sourceId)) continue;

      // Inconsistencies are usually high priority
      const priority = "high" as const;
      const dueDate = calculateDueDateFromPriority(priority);

      await ctx.db.insert("reminders", {
        estatePlanId: args.estatePlanId,
        type: "document_update",
        title: `Resolve: ${issue.issue}`,
        description: `${issue.details}\n\nRecommendation: ${issue.recommendation}`,
        dueDate,
        status: "pending",
        priority,
        isRecurring: false,
        sourceType: "gap_analysis",
        sourceId,
        isAutoGenerated: true,
        createdAt: now,
        updatedAt: now,
      });
      createdCount++;
    }

    return { created: createdCount, message: `Created ${createdCount} action items` };
  },
});

// Complete parent reminder when all sub-tasks are done
export const completeParentIfAllChildrenDone = mutation({
  args: { parentReminderId: v.id("reminders") },
  handler: async (ctx, args) => {
    const subTasks = await ctx.db
      .query("reminders")
      .withIndex("by_parent", (q) => q.eq("parentReminderId", args.parentReminderId))
      .collect();

    if (subTasks.length === 0) return false;

    const allCompleted = subTasks.every(t => t.status === "completed");

    if (allCompleted) {
      const now = Date.now();
      await ctx.db.patch(args.parentReminderId, {
        status: "completed",
        completedAt: now,
        updatedAt: now,
      });
      return true;
    }

    return false;
  },
});

// Internal mutation for generating action items (called from gapAnalysis action)
export const internalGenerateActionItems = internalMutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    includeSubTasks: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const includeSubTasks = args.includeSubTasks ?? true;

    // Get the latest gap analysis
    const analyses = await ctx.db
      .query("gapAnalysis")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .order("desc")
      .take(1);

    if (analyses.length === 0) {
      return { created: 0, message: "No gap analysis found" };
    }

    const analysis = analyses[0];

    // Get existing reminders to avoid duplicates
    const existingReminders = await ctx.db
      .query("reminders")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .collect();

    const existingSourceIds = new Set(
      existingReminders
        .filter(r => r.sourceId)
        .map(r => r.sourceId)
    );

    let createdCount = 0;

    // Parse missing documents
    // Note: gap analysis API returns "document" field, but handle "type" for backwards compatibility
    const missingDocs: Array<{ document?: string; type?: string; priority: string; reason: string }> =
      JSON.parse(analysis.missingDocuments || "[]");

    for (const doc of missingDocs) {
      const docName = doc.document || doc.type || "Document";
      const sourceId = `missing_doc_${docName}`;
      if (existingSourceIds.has(sourceId)) continue;

      const priority = (doc.priority as "urgent" | "high" | "medium" | "low") || "medium";
      const dueDate = calculateDueDateFromPriority(priority);

      // Create parent reminder
      const parentId = await ctx.db.insert("reminders", {
        estatePlanId: args.estatePlanId,
        type: "document_update",
        title: `Create ${docName.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}`,
        description: doc.reason,
        dueDate,
        status: "pending",
        priority,
        isRecurring: false,
        sourceType: "gap_analysis",
        sourceId,
        isAutoGenerated: true,
        createdAt: now,
        updatedAt: now,
      });
      createdCount++;

      // Create sub-tasks if template exists
      if (includeSubTasks && docName && TASK_BREAKDOWNS[docName]) {
        const subTasks = TASK_BREAKDOWNS[docName];
        for (let i = 0; i < subTasks.length; i++) {
          await ctx.db.insert("reminders", {
            estatePlanId: args.estatePlanId,
            type: "document_update",
            title: subTasks[i],
            dueDate: dueDate + (i * 24 * 60 * 60 * 1000),
            status: "pending",
            priority: "medium",
            isRecurring: false,
            parentReminderId: parentId,
            sourceType: "gap_analysis",
            sourceId: `${sourceId}_step_${i}`,
            isAutoGenerated: true,
            createdAt: now,
            updatedAt: now,
          });
          createdCount++;
        }
      }
    }

    // Parse recommendations
    const recommendations: Array<{ action: string; priority: string; reason: string }> =
      JSON.parse(analysis.recommendations || "[]");

    for (let i = 0; i < recommendations.length; i++) {
      const rec = recommendations[i];
      const sourceId = `recommendation_${i}`;
      if (existingSourceIds.has(sourceId)) continue;

      const priority = (rec.priority as "urgent" | "high" | "medium" | "low") || "medium";
      const dueDate = calculateDueDateFromPriority(priority);

      await ctx.db.insert("reminders", {
        estatePlanId: args.estatePlanId,
        type: "custom",
        title: rec.action,
        description: rec.reason,
        dueDate,
        status: "pending",
        priority,
        isRecurring: false,
        sourceType: "gap_analysis",
        sourceId,
        isAutoGenerated: true,
        createdAt: now,
        updatedAt: now,
      });
      createdCount++;
    }

    // Parse inconsistencies
    const inconsistencies: Array<{ issue: string; details: string; recommendation: string }> =
      JSON.parse(analysis.inconsistencies || "[]");

    for (let i = 0; i < inconsistencies.length; i++) {
      const issue = inconsistencies[i];
      const sourceId = `inconsistency_${i}`;
      if (existingSourceIds.has(sourceId)) continue;

      const priority = "high" as const;
      const dueDate = calculateDueDateFromPriority(priority);

      await ctx.db.insert("reminders", {
        estatePlanId: args.estatePlanId,
        type: "document_update",
        title: `Resolve: ${issue.issue}`,
        description: `${issue.details}\n\nRecommendation: ${issue.recommendation}`,
        dueDate,
        status: "pending",
        priority,
        isRecurring: false,
        sourceType: "gap_analysis",
        sourceId,
        isAutoGenerated: true,
        createdAt: now,
        updatedAt: now,
      });
      createdCount++;
    }

    return { created: createdCount, message: `Created ${createdCount} action items` };
  },
});

// Update reminder priority and auto-adjust due date
export const updateReminderPriorityWithSmartDate = mutation({
  args: {
    reminderId: v.id("reminders"),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    autoAdjustDate: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const updates: Record<string, unknown> = {
      priority: args.priority,
      updatedAt: now,
    };

    // Auto-adjust due date if requested
    if (args.autoAdjustDate !== false) {
      updates.dueDate = calculateDueDateFromPriority(args.priority);
    }

    await ctx.db.patch(args.reminderId, updates);
    return args.reminderId;
  },
});
