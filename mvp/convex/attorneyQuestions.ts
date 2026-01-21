import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ===========================================
// ATTORNEY QUESTIONS QUERIES
// ===========================================

// Get all questions for an estate plan
export const getQuestions = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("attorneyQuestions")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .collect();
  },
});

// Get questions by category
export const getQuestionsByCategory = query({
  args: {
    estatePlanId: v.id("estatePlans"),
    category: v.union(
      v.literal("documents"),
      v.literal("assets"),
      v.literal("beneficiaries"),
      v.literal("tax"),
      v.literal("general")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("attorneyQuestions")
      .withIndex("by_category", (q) =>
        q.eq("estatePlanId", args.estatePlanId).eq("category", args.category)
      )
      .collect();
  },
});

// Get question count
export const getQuestionCount = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, args) => {
    const questions = await ctx.db
      .query("attorneyQuestions")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .collect();
    return {
      total: questions.length,
      unanswered: questions.filter(q => !q.isAnswered).length,
      answered: questions.filter(q => q.isAnswered).length,
    };
  },
});

// ===========================================
// ATTORNEY QUESTIONS MUTATIONS
// ===========================================

// Create a new question
export const createQuestion = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    question: v.string(),
    category: v.optional(v.union(
      v.literal("documents"),
      v.literal("assets"),
      v.literal("beneficiaries"),
      v.literal("tax"),
      v.literal("general")
    )),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("attorneyQuestions", {
      estatePlanId: args.estatePlanId,
      question: args.question,
      category: args.category ?? "general",
      isAnswered: false,
      createdAt: now,
    });
  },
});

// Update a question
export const updateQuestion = mutation({
  args: {
    questionId: v.id("attorneyQuestions"),
    question: v.optional(v.string()),
    category: v.optional(v.union(
      v.literal("documents"),
      v.literal("assets"),
      v.literal("beneficiaries"),
      v.literal("tax"),
      v.literal("general")
    )),
  },
  handler: async (ctx, args) => {
    const { questionId, ...updates } = args;
    const now = Date.now();

    // Filter out undefined values
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    await ctx.db.patch(questionId, {
      ...filteredUpdates,
      updatedAt: now,
    });
    return questionId;
  },
});

// Mark question as answered
export const markAnswered = mutation({
  args: {
    questionId: v.id("attorneyQuestions"),
    answer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.patch(args.questionId, {
      isAnswered: true,
      answer: args.answer,
      updatedAt: now,
    });
    return args.questionId;
  },
});

// Mark question as unanswered
export const markUnanswered = mutation({
  args: { questionId: v.id("attorneyQuestions") },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.patch(args.questionId, {
      isAnswered: false,
      answer: undefined,
      updatedAt: now,
    });
    return args.questionId;
  },
});

// Delete a question
export const deleteQuestion = mutation({
  args: { questionId: v.id("attorneyQuestions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.questionId);
  },
});

// Category display names
export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  documents: "Documents",
  assets: "Assets & Property",
  beneficiaries: "Beneficiaries",
  tax: "Tax Planning",
  general: "General",
};
