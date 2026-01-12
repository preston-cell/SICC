import { query, internalQuery } from "./_generated/server";
import { v } from "convex/values";

// ============================================
// AGENT RUN QUERIES (existing)
// ============================================

// Get a single agent run by ID
export const getRun = query({
  args: { runId: v.id("agentRuns") },
  handler: async (ctx, { runId }) => {
    return await ctx.db.get(runId);
  },
});

// Get all runs, most recent first
export const listRuns = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("agentRuns")
      .withIndex("by_created")
      .order("desc")
      .take(50);
  },
});

// Get files for a specific run
export const getFilesForRun = query({
  args: { runId: v.id("agentRuns") },
  handler: async (ctx, { runId }) => {
    return await ctx.db
      .query("generatedFiles")
      .withIndex("by_run", (q) => q.eq("runId", runId))
      .collect();
  },
});

// Get a single file by ID
export const getFile = query({
  args: { fileId: v.id("generatedFiles") },
  handler: async (ctx, { fileId }) => {
    return await ctx.db.get(fileId);
  },
});

// ============================================
// ESTATE PLAN QUERIES
// ============================================

// Get a single estate plan by ID
export const getEstatePlan = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, { estatePlanId }) => {
    return await ctx.db.get(estatePlanId);
  },
});

// Get estate plan by session ID (for anonymous users)
export const getEstatePlanBySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    return await ctx.db
      .query("estatePlans")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .first();
  },
});

// Get all estate plans for a user
export const getEstatePlansForUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("estatePlans")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// Get recent estate plans (for dashboard) - filtered by session or user
export const listRecentEstatePlans = query({
  args: {
    limit: v.optional(v.number()),
    sessionId: v.optional(v.string()),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, { limit, sessionId, userId }) => {
    // If userId is provided, get plans for that user
    if (userId) {
      return await ctx.db
        .query("estatePlans")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .order("desc")
        .take(limit || 10);
    }

    // If sessionId is provided, get plans for that session
    // BUT only return plans that have NOT been linked to a user account
    if (sessionId) {
      const sessionPlans = await ctx.db
        .query("estatePlans")
        .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
        .order("desc")
        .take(limit || 10);

      // Filter out plans that have been linked to a user (they should only be visible when logged in)
      return sessionPlans.filter((plan) => !plan.userId);
    }

    // No filter provided - return empty array for safety
    return [];
  },
});

// Get estate plan with all related data (full view)
export const getEstatePlanFull = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, { estatePlanId }) => {
    const estatePlan = await ctx.db.get(estatePlanId);
    if (!estatePlan) return null;

    // Get all intake data
    const intakeData = await ctx.db
      .query("intakeData")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .collect();

    // Get all documents
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .collect();

    // Get latest gap analysis
    const gapAnalyses = await ctx.db
      .query("gapAnalysis")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .order("desc")
      .take(1);
    const latestGapAnalysis = gapAnalyses[0] || null;

    return {
      ...estatePlan,
      intakeData,
      documents,
      latestGapAnalysis,
    };
  },
});

// ============================================
// INTAKE DATA QUERIES
// ============================================

// Get all intake data for an estate plan
export const getIntakeData = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, { estatePlanId }) => {
    return await ctx.db
      .query("intakeData")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .collect();
  },
});

// Get intake data for a specific section
export const getIntakeSection = query({
  args: {
    estatePlanId: v.id("estatePlans"),
    section: v.union(
      v.literal("personal"),
      v.literal("family"),
      v.literal("assets"),
      v.literal("existing_documents"),
      v.literal("goals")
    ),
  },
  handler: async (ctx, { estatePlanId, section }) => {
    return await ctx.db
      .query("intakeData")
      .withIndex("by_estate_plan_section", (q) =>
        q.eq("estatePlanId", estatePlanId).eq("section", section)
      )
      .first();
  },
});

// Get intake progress (which sections are complete)
export const getIntakeProgress = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, { estatePlanId }) => {
    const allSections = ["personal", "family", "assets", "existing_documents", "goals"] as const;

    const intakeRecords = await ctx.db
      .query("intakeData")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .collect();

    const sectionStatus: Record<string, { exists: boolean; isComplete: boolean }> = {};

    for (const section of allSections) {
      const record = intakeRecords.find((r) => r.section === section);
      sectionStatus[section] = {
        exists: !!record,
        isComplete: record?.isComplete || false,
      };
    }

    const completedCount = Object.values(sectionStatus).filter((s) => s.isComplete).length;
    const totalCount = allSections.length;

    return {
      sections: sectionStatus,
      completedCount,
      totalCount,
      percentComplete: Math.round((completedCount / totalCount) * 100),
      isAllComplete: completedCount === totalCount,
    };
  },
});

// ============================================
// DOCUMENT QUERIES
// ============================================

// Get all documents for an estate plan
export const getDocuments = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, { estatePlanId }) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .collect();
  },
});

// Get a single document by ID
export const getDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    return await ctx.db.get(documentId);
  },
});

// Get documents by type for an estate plan
export const getDocumentsByType = query({
  args: {
    estatePlanId: v.id("estatePlans"),
    type: v.union(
      v.literal("will"),
      v.literal("trust"),
      v.literal("poa_financial"),
      v.literal("poa_healthcare"),
      v.literal("healthcare_directive"),
      v.literal("hipaa"),
      v.literal("other")
    ),
  },
  handler: async (ctx, { estatePlanId, type }) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_type", (q) =>
        q.eq("estatePlanId", estatePlanId).eq("type", type)
      )
      .collect();
  },
});

// ============================================
// GAP ANALYSIS QUERIES
// ============================================

// Get latest gap analysis for an estate plan
export const getLatestGapAnalysis = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, { estatePlanId }) => {
    const analyses = await ctx.db
      .query("gapAnalysis")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .order("desc")
      .take(1);
    return analyses[0] || null;
  },
});

// Get all gap analyses for an estate plan (history)
export const getGapAnalysisHistory = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, { estatePlanId }) => {
    return await ctx.db
      .query("gapAnalysis")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .order("desc")
      .collect();
  },
});

// ============================================
// USER QUERIES
// ============================================

// Get user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
  },
});

// Get user by ID
export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

// ============================================
// BENEFICIARY DESIGNATION QUERIES
// ============================================

// Get all beneficiary designations for an estate plan
export const getBeneficiaryDesignations = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, { estatePlanId }) => {
    return await ctx.db
      .query("beneficiaryDesignations")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .collect();
  },
});

// Get beneficiary designations by asset type
export const getBeneficiaryDesignationsByType = query({
  args: {
    estatePlanId: v.id("estatePlans"),
    assetType: v.union(
      v.literal("retirement_401k"),
      v.literal("retirement_ira"),
      v.literal("retirement_roth"),
      v.literal("retirement_pension"),
      v.literal("retirement_other"),
      v.literal("life_insurance"),
      v.literal("annuity"),
      v.literal("bank_pod"),
      v.literal("brokerage_tod"),
      v.literal("real_estate_tod"),
      v.literal("other")
    ),
  },
  handler: async (ctx, { estatePlanId, assetType }) => {
    return await ctx.db
      .query("beneficiaryDesignations")
      .withIndex("by_asset_type", (q) =>
        q.eq("estatePlanId", estatePlanId).eq("assetType", assetType)
      )
      .collect();
  },
});

// Get a single beneficiary designation by ID
export const getBeneficiaryDesignation = query({
  args: { designationId: v.id("beneficiaryDesignations") },
  handler: async (ctx, { designationId }) => {
    return await ctx.db.get(designationId);
  },
});

// ============================================
// INTERNAL QUERIES (for actions)
// ============================================

// Internal query for document generation action
export const getIntakeDataInternal = internalQuery({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, { estatePlanId }) => {
    return await ctx.db
      .query("intakeData")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .collect();
  },
});
