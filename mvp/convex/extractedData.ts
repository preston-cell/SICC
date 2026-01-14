/**
 * Extracted Data Queries and Mutations
 *
 * Handles CRUD operations for extracted intake data.
 * These are separate from the Node.js action file because
 * queries and mutations cannot be in "use node" files.
 */

import { query, mutation, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Section validator matching schema
const sectionValidator = v.union(
  v.literal("personal"),
  v.literal("family"),
  v.literal("assets"),
  v.literal("existing_documents"),
  v.literal("goals")
);

// ============================================
// INTERNAL QUERIES (called by actions)
// ============================================

export const getDocumentsForExtraction = internalQuery({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, { estatePlanId }) => {
    return await ctx.db
      .query("uploadedDocuments")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .collect();
  },
});

export const getExtractedDataForEstatePlan = internalQuery({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, { estatePlanId }) => {
    return await ctx.db
      .query("extractedIntakeData")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .collect();
  },
});

// ============================================
// INTERNAL MUTATIONS (called by actions)
// ============================================

export const saveExtractedData = internalMutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    section: sectionValidator,
    extractedData: v.string(),
    sourceDocumentIds: v.array(v.id("uploadedDocuments")),
    confidence: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if we already have extracted data for this section
    const existing = await ctx.db
      .query("extractedIntakeData")
      .withIndex("by_section", (q) =>
        q.eq("estatePlanId", args.estatePlanId).eq("section", args.section)
      )
      .first();

    if (existing) {
      // Update existing record
      await ctx.db.patch(existing._id, {
        extractedData: args.extractedData,
        sourceDocumentIds: args.sourceDocumentIds,
        confidence: args.confidence,
        status: "extracted",
      });
      return existing._id;
    }

    // Create new record
    return await ctx.db.insert("extractedIntakeData", {
      estatePlanId: args.estatePlanId,
      section: args.section,
      extractedData: args.extractedData,
      sourceDocumentIds: args.sourceDocumentIds,
      confidence: args.confidence,
      status: "extracted",
      createdAt: Date.now(),
    });
  },
});

export const updateExtractedDataStatus = internalMutation({
  args: {
    extractedDataId: v.id("extractedIntakeData"),
    status: v.union(
      v.literal("extracted"),
      v.literal("reviewed"),
      v.literal("applied"),
      v.literal("rejected")
    ),
  },
  handler: async (ctx, { extractedDataId, status }) => {
    await ctx.db.patch(extractedDataId, { status });
  },
});

// ============================================
// PUBLIC QUERIES
// ============================================

// Get all extracted data for an estate plan
export const getExtractedData = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, { estatePlanId }) => {
    const extractedData = await ctx.db
      .query("extractedIntakeData")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .collect();

    // Parse the JSON data for each section
    return extractedData.map((record) => ({
      ...record,
      parsedData: JSON.parse(record.extractedData),
    }));
  },
});

// Get extracted data for a specific section
export const getExtractedDataBySection = query({
  args: {
    estatePlanId: v.id("estatePlans"),
    section: sectionValidator,
  },
  handler: async (ctx, { estatePlanId, section }) => {
    const record = await ctx.db
      .query("extractedIntakeData")
      .withIndex("by_section", (q) =>
        q.eq("estatePlanId", estatePlanId).eq("section", section)
      )
      .first();

    if (!record) return null;

    return {
      ...record,
      parsedData: JSON.parse(record.extractedData),
    };
  },
});

// ============================================
// PUBLIC MUTATIONS
// ============================================

// Mark extracted data as reviewed/applied by user
export const markExtractedDataStatus = mutation({
  args: {
    extractedDataId: v.id("extractedIntakeData"),
    status: v.union(
      v.literal("reviewed"),
      v.literal("applied"),
      v.literal("rejected")
    ),
  },
  handler: async (ctx, { extractedDataId, status }) => {
    await ctx.db.patch(extractedDataId, { status });
  },
});

// Apply extracted data to intake form (copies to intakeData table)
export const applyExtractedData = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    section: sectionValidator,
    mergedData: v.string(), // JSON string of merged/accepted data
  },
  handler: async (ctx, { estatePlanId, section, mergedData }) => {
    const now = Date.now();

    // Update or create intake data
    const existing = await ctx.db
      .query("intakeData")
      .withIndex("by_estate_plan_section", (q) =>
        q.eq("estatePlanId", estatePlanId).eq("section", section)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        data: mergedData,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("intakeData", {
        estatePlanId,
        section,
        data: mergedData,
        isComplete: false,
        updatedAt: now,
      });
    }

    // Mark extracted data as applied
    const extractedRecord = await ctx.db
      .query("extractedIntakeData")
      .withIndex("by_section", (q) =>
        q.eq("estatePlanId", estatePlanId).eq("section", section)
      )
      .first();

    if (extractedRecord) {
      await ctx.db.patch(extractedRecord._id, { status: "applied" });
    }

    // Update estate plan status to in_progress if draft
    const estatePlan = await ctx.db.get(estatePlanId);
    if (estatePlan && estatePlan.status === "draft") {
      await ctx.db.patch(estatePlanId, {
        status: "intake_in_progress",
        updatedAt: now,
      });
    }
  },
});
