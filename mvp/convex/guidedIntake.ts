import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Map step IDs to data sections for backward compatibility
const STEP_TO_SECTION: Record<number, "personal" | "family" | "assets" | "existing_documents" | "goals"> = {
  1: "personal",
  2: "family",
  3: "assets",
  4: "existing_documents",
  5: "goals",
  6: "goals",
  7: "goals",
  8: "goals",
};

// Get guided intake progress for a plan
export const getGuidedProgress = query({
  args: {
    estatePlanId: v.id("estatePlans"),
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("guidedIntakeProgress")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .first();

    if (!progress) {
      // Return default progress if none exists
      return {
        currentStep: 1,
        completedSteps: [] as number[],
        flowMode: "guided" as const,
      };
    }

    return {
      currentStep: progress.currentStep,
      completedSteps: progress.completedSteps,
      flowMode: progress.flowMode,
      currentQuestionIndex: progress.currentQuestionIndex,
      lastSavedAt: progress.lastSavedAt,
    };
  },
});

// Get data for a specific step
export const getStepData = query({
  args: {
    estatePlanId: v.id("estatePlans"),
    stepId: v.number(),
  },
  handler: async (ctx, args) => {
    // First check guidedIntakeProgress for step-specific data
    const progress = await ctx.db
      .query("guidedIntakeProgress")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .first();

    if (progress?.stepData) {
      try {
        const stepDataMap = JSON.parse(progress.stepData) as Record<string, string>;
        if (stepDataMap[args.stepId.toString()]) {
          return { data: stepDataMap[args.stepId.toString()] };
        }
      } catch (e) {
        console.error("Failed to parse step data:", e);
      }
    }

    // Fall back to existing intakeData for backward compatibility
    const section = STEP_TO_SECTION[args.stepId];
    if (section) {
      const existingData = await ctx.db
        .query("intakeData")
        .withIndex("by_estate_plan_section", (q) =>
          q.eq("estatePlanId", args.estatePlanId).eq("section", section)
        )
        .first();

      if (existingData) {
        return { data: existingData.data };
      }
    }

    return { data: "{}" };
  },
});

// Get all step data for review
export const getAllStepData = query({
  args: {
    estatePlanId: v.id("estatePlans"),
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("guidedIntakeProgress")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .first();

    const results: { stepId: number; data: string }[] = [];

    if (progress?.stepData) {
      try {
        const stepDataMap = JSON.parse(progress.stepData) as Record<string, string>;
        for (const [stepId, data] of Object.entries(stepDataMap)) {
          results.push({ stepId: parseInt(stepId, 10), data });
        }
      } catch (e) {
        console.error("Failed to parse step data:", e);
      }
    }

    // Also get data from existing intakeData sections
    const intakeSections = await ctx.db
      .query("intakeData")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .collect();

    for (const section of intakeSections) {
      // Find the step ID for this section (use first matching step)
      const stepId = Object.entries(STEP_TO_SECTION).find(
        ([, sec]) => sec === section.section
      )?.[0];
      if (stepId && !results.find((r) => r.stepId === parseInt(stepId, 10))) {
        results.push({ stepId: parseInt(stepId, 10), data: section.data });
      }
    }

    return results.sort((a, b) => a.stepId - b.stepId);
  },
});

// Save step data (auto-save)
export const saveStepData = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    stepId: v.number(),
    data: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Get or create progress record
    let progress = await ctx.db
      .query("guidedIntakeProgress")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .first();

    // Parse existing step data or create new map
    let stepDataMap: Record<string, string> = {};
    if (progress?.stepData) {
      try {
        stepDataMap = JSON.parse(progress.stepData);
      } catch (e) {
        console.error("Failed to parse existing step data:", e);
      }
    }

    // Update step data
    stepDataMap[args.stepId.toString()] = args.data;

    if (progress) {
      await ctx.db.patch(progress._id, {
        stepData: JSON.stringify(stepDataMap),
        currentStep: Math.max(progress.currentStep, args.stepId),
        updatedAt: now,
        lastSavedAt: now,
      });
    } else {
      await ctx.db.insert("guidedIntakeProgress", {
        estatePlanId: args.estatePlanId,
        currentStep: args.stepId,
        completedSteps: [],
        flowMode: "guided",
        stepData: JSON.stringify(stepDataMap),
        createdAt: now,
        updatedAt: now,
        lastSavedAt: now,
      });
    }

    // Also save to legacy intakeData for backward compatibility
    const section = STEP_TO_SECTION[args.stepId];
    if (section) {
      const existingSection = await ctx.db
        .query("intakeData")
        .withIndex("by_estate_plan_section", (q) =>
          q.eq("estatePlanId", args.estatePlanId).eq("section", section)
        )
        .first();

      // Merge new data with existing section data
      let mergedData = args.data;
      if (existingSection) {
        try {
          const existing = JSON.parse(existingSection.data);
          const incoming = JSON.parse(args.data);
          mergedData = JSON.stringify({ ...existing, ...incoming });
        } catch (e) {
          // If parsing fails, just use new data
        }

        await ctx.db.patch(existingSection._id, {
          data: mergedData,
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("intakeData", {
          estatePlanId: args.estatePlanId,
          section,
          data: mergedData,
          isComplete: false,
          updatedAt: now,
        });
      }
    }

    return { success: true };
  },
});

// Complete a step and move to next
export const completeStep = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    stepId: v.number(),
    data: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // ===== Inline save step data logic =====
    // Get or create progress record
    let progress = await ctx.db
      .query("guidedIntakeProgress")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .first();

    // Parse existing step data or create new map
    let stepDataMap: Record<string, string> = {};
    if (progress?.stepData) {
      try {
        stepDataMap = JSON.parse(progress.stepData);
      } catch (e) {
        console.error("Failed to parse existing step data:", e);
      }
    }

    // Update step data
    stepDataMap[args.stepId.toString()] = args.data;

    if (progress) {
      const completedSteps = progress.completedSteps.includes(args.stepId)
        ? progress.completedSteps
        : [...progress.completedSteps, args.stepId];

      await ctx.db.patch(progress._id, {
        stepData: JSON.stringify(stepDataMap),
        completedSteps,
        currentStep: args.stepId + 1,
        updatedAt: now,
        lastSavedAt: now,
      });
    } else {
      await ctx.db.insert("guidedIntakeProgress", {
        estatePlanId: args.estatePlanId,
        currentStep: args.stepId + 1,
        completedSteps: [args.stepId],
        flowMode: "guided",
        stepData: JSON.stringify(stepDataMap),
        createdAt: now,
        updatedAt: now,
        lastSavedAt: now,
      });
    }

    // Also save to legacy intakeData for backward compatibility
    const section = STEP_TO_SECTION[args.stepId];
    if (section) {
      const existingSection = await ctx.db
        .query("intakeData")
        .withIndex("by_estate_plan_section", (q) =>
          q.eq("estatePlanId", args.estatePlanId).eq("section", section)
        )
        .first();

      // Merge new data with existing section data
      let mergedData = args.data;
      if (existingSection) {
        try {
          const existing = JSON.parse(existingSection.data);
          const incoming = JSON.parse(args.data);
          mergedData = JSON.stringify({ ...existing, ...incoming });
        } catch (e) {
          // If parsing fails, just use new data
        }

        await ctx.db.patch(existingSection._id, {
          data: mergedData,
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("intakeData", {
          estatePlanId: args.estatePlanId,
          section,
          data: mergedData,
          isComplete: false,
          updatedAt: now,
        });
      }
    }

    // ===== End inline save logic =====

    // Mark corresponding section as complete if this is the last step for that section
    const sectionForComplete = STEP_TO_SECTION[args.stepId];
    if (sectionForComplete) {
      // Steps 5, 6, 7 all map to "goals" - only mark complete on step 7 or 8
      // For steps 1-4, mark complete immediately since they have unique sections
      const isGoalsSection = args.stepId >= 5 && args.stepId <= 7;
      const shouldMarkComplete = !isGoalsSection || args.stepId === 7;

      if (shouldMarkComplete) {
        const sectionToComplete = await ctx.db
          .query("intakeData")
          .withIndex("by_estate_plan_section", (q) =>
            q.eq("estatePlanId", args.estatePlanId).eq("section", sectionForComplete)
          )
          .first();

        if (sectionToComplete) {
          await ctx.db.patch(sectionToComplete._id, {
            isComplete: true,
            completedAt: now,
            updatedAt: now,
          });
        }
      }
    }

    // Update estate plan status if all steps are complete
    if (args.stepId === 8) {
      const plan = await ctx.db.get(args.estatePlanId);
      if (plan) {
        await ctx.db.patch(args.estatePlanId, {
          status: "intake_complete",
          updatedAt: now,
        });
      }
    }

    return { success: true };
  },
});

// Initialize guided intake (create progress record)
export const initializeGuidedIntake = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    flowMode: v.optional(v.union(v.literal("guided"), v.literal("comprehensive"))),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if progress already exists
    const existing = await ctx.db
      .query("guidedIntakeProgress")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .first();

    if (existing) {
      return existing._id;
    }

    // Create new progress record
    const progressId = await ctx.db.insert("guidedIntakeProgress", {
      estatePlanId: args.estatePlanId,
      currentStep: 1,
      completedSteps: [],
      flowMode: args.flowMode || "guided",
      createdAt: now,
      updatedAt: now,
    });

    // Update estate plan status
    await ctx.db.patch(args.estatePlanId, {
      status: "intake_in_progress",
      updatedAt: now,
    });

    return progressId;
  },
});

// Reset guided intake progress (start over)
export const resetGuidedProgress = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const progress = await ctx.db
      .query("guidedIntakeProgress")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .first();

    if (progress) {
      await ctx.db.patch(progress._id, {
        currentStep: 1,
        completedSteps: [],
        stepData: undefined,
        currentQuestionIndex: undefined,
        updatedAt: now,
        lastSavedAt: undefined,
      });
    }

    return { success: true };
  },
});
