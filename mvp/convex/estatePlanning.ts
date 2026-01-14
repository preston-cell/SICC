import { mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Section types for intake data
const sectionValidator = v.union(
  v.literal("personal"),
  v.literal("family"),
  v.literal("assets"),
  v.literal("existing_documents"),
  v.literal("goals")
);

// Document types
const documentTypeValidator = v.union(
  v.literal("will"),
  v.literal("trust"),
  v.literal("poa_financial"),
  v.literal("poa_healthcare"),
  v.literal("healthcare_directive"),
  v.literal("hipaa"),
  v.literal("other")
);

// ============================================
// ESTATE PLAN MUTATIONS
// ============================================

// Create a new estate plan
export const createEstatePlan = mutation({
  args: {
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, { userId, sessionId, name }) => {
    const now = Date.now();
    const estatePlanId = await ctx.db.insert("estatePlans", {
      userId,
      sessionId,
      name: name || "My Estate Plan",
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });
    return estatePlanId;
  },
});

// Update estate plan status
export const updateEstatePlanStatus = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    status: v.union(
      v.literal("draft"),
      v.literal("intake_in_progress"),
      v.literal("intake_complete"),
      v.literal("analysis_complete"),
      v.literal("documents_generated"),
      v.literal("complete")
    ),
  },
  handler: async (ctx, { estatePlanId, status }) => {
    await ctx.db.patch(estatePlanId, {
      status,
      updatedAt: Date.now(),
    });
  },
});

// Update estate plan details
export const updateEstatePlan = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    name: v.optional(v.string()),
    stateOfResidence: v.optional(v.string()),
  },
  handler: async (ctx, { estatePlanId, name, stateOfResidence }) => {
    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    if (name !== undefined) updates.name = name;
    if (stateOfResidence !== undefined) updates.stateOfResidence = stateOfResidence;
    await ctx.db.patch(estatePlanId, updates);
  },
});

// Delete an estate plan and all related data
export const deleteEstatePlan = mutation({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, { estatePlanId }) => {
    // Delete all intake data
    const intakeRecords = await ctx.db
      .query("intakeData")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .collect();
    for (const record of intakeRecords) {
      await ctx.db.delete(record._id);
    }

    // Delete all documents
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .collect();
    for (const doc of documents) {
      await ctx.db.delete(doc._id);
    }

    // Delete all gap analyses
    const analyses = await ctx.db
      .query("gapAnalysis")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .collect();
    for (const analysis of analyses) {
      await ctx.db.delete(analysis._id);
    }

    // Delete the estate plan itself
    await ctx.db.delete(estatePlanId);
  },
});

// ============================================
// INTAKE DATA MUTATIONS
// ============================================

// Save or update intake data for a section
export const updateIntakeData = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    section: sectionValidator,
    data: v.string(), // JSON stringified data
    isComplete: v.boolean(),
  },
  handler: async (ctx, { estatePlanId, section, data, isComplete }) => {
    const now = Date.now();

    // Check if intake data already exists for this section
    const existing = await ctx.db
      .query("intakeData")
      .withIndex("by_estate_plan_section", (q) =>
        q.eq("estatePlanId", estatePlanId).eq("section", section)
      )
      .first();

    if (existing) {
      // Update existing record
      await ctx.db.patch(existing._id, {
        data,
        isComplete,
        completedAt: isComplete ? now : undefined,
        updatedAt: now,
      });
      return existing._id;
    } else {
      // Create new record
      const id = await ctx.db.insert("intakeData", {
        estatePlanId,
        section,
        data,
        isComplete,
        completedAt: isComplete ? now : undefined,
        updatedAt: now,
      });

      // Update estate plan status to in_progress if it was draft
      const estatePlan = await ctx.db.get(estatePlanId);
      if (estatePlan && estatePlan.status === "draft") {
        await ctx.db.patch(estatePlanId, {
          status: "intake_in_progress",
          updatedAt: now,
        });
      }

      return id;
    }
  },
});

// Mark intake as complete (all sections done)
export const completeIntake = mutation({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, { estatePlanId }) => {
    // Verify all sections are complete
    const sections = ["personal", "family", "assets", "existing_documents", "goals"] as const;
    const intakeRecords = await ctx.db
      .query("intakeData")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .collect();

    const completedSections = new Set(
      intakeRecords.filter((r) => r.isComplete).map((r) => r.section)
    );

    const allComplete = sections.every((s) => completedSections.has(s));

    if (!allComplete) {
      throw new Error("Not all intake sections are complete");
    }

    const now = Date.now();

    await ctx.db.patch(estatePlanId, {
      status: "intake_complete",
      updatedAt: now,
    });

    // Create default reminders for the estate plan
    const oneYear = 365 * 24 * 60 * 60 * 1000;

    // Annual review reminder
    await ctx.db.insert("reminders", {
      estatePlanId,
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
      estatePlanId,
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
  },
});

// ============================================
// DOCUMENT MUTATIONS
// ============================================

// Create a new document
export const createDocument = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    runId: v.optional(v.id("agentRuns")),
    type: documentTypeValidator,
    title: v.string(),
    content: v.string(),
    format: v.union(v.literal("markdown"), v.literal("html"), v.literal("pdf")),
  },
  handler: async (ctx, { estatePlanId, runId, type, title, content, format }) => {
    const now = Date.now();

    // Get the next version number for this document type
    const existingDocs = await ctx.db
      .query("documents")
      .withIndex("by_type", (q) =>
        q.eq("estatePlanId", estatePlanId).eq("type", type)
      )
      .collect();
    const version = existingDocs.length + 1;

    const docId = await ctx.db.insert("documents", {
      estatePlanId,
      runId,
      type,
      title,
      content,
      format,
      version,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });

    return docId;
  },
});

// Update document status
export const updateDocumentStatus = mutation({
  args: {
    documentId: v.id("documents"),
    status: v.union(v.literal("draft"), v.literal("reviewed"), v.literal("final")),
  },
  handler: async (ctx, { documentId, status }) => {
    await ctx.db.patch(documentId, {
      status,
      updatedAt: Date.now(),
    });
  },
});

// Update document content (creates a new version conceptually, but we update in place)
export const updateDocumentContent = mutation({
  args: {
    documentId: v.id("documents"),
    content: v.string(),
  },
  handler: async (ctx, { documentId, content }) => {
    const doc = await ctx.db.get(documentId);
    if (!doc) throw new Error("Document not found");

    await ctx.db.patch(documentId, {
      content,
      version: doc.version + 1,
      status: "draft", // Reset to draft when edited
      updatedAt: Date.now(),
    });
  },
});

// Delete a document
export const deleteDocument = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    await ctx.db.delete(documentId);
  },
});

// ============================================
// GAP ANALYSIS MUTATIONS (Internal - called by actions)
// ============================================

// Save gap analysis results
export const saveGapAnalysis = internalMutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    runId: v.optional(v.id("agentRuns")),
    score: v.optional(v.number()),
    estateComplexity: v.optional(v.string()),
    estimatedEstateTax: v.optional(v.string()),
    commonIssues: v.optional(v.string()), // JSON string of detected common issues (missing beneficiaries, unclear trusts, missing guardians)
    missingDocuments: v.string(),
    outdatedDocuments: v.string(),
    inconsistencies: v.string(),
    taxOptimization: v.optional(v.string()),
    medicaidPlanning: v.optional(v.string()),
    recommendations: v.string(),
    stateSpecificNotes: v.string(),
    rawAnalysis: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const analysisId = await ctx.db.insert("gapAnalysis", {
      ...args,
      createdAt: Date.now(),
    });

    // Update estate plan status
    await ctx.db.patch(args.estatePlanId, {
      status: "analysis_complete",
      updatedAt: Date.now(),
    });

    return analysisId;
  },
});

// Public mutation for saving gap analysis (called from frontend API route flow)
export const saveGapAnalysisPublic = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    score: v.optional(v.number()),
    estateComplexity: v.optional(v.string()),
    estimatedEstateTax: v.optional(v.string()),
    missingDocuments: v.string(),
    outdatedDocuments: v.string(),
    inconsistencies: v.string(),
    taxOptimization: v.optional(v.string()),
    medicaidPlanning: v.optional(v.string()),
    recommendations: v.string(),
    stateSpecificNotes: v.string(),
    rawAnalysis: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const analysisId = await ctx.db.insert("gapAnalysis", {
      ...args,
      createdAt: Date.now(),
    });

    // Update estate plan status
    await ctx.db.patch(args.estatePlanId, {
      status: "analysis_complete",
      updatedAt: Date.now(),
    });

    return analysisId;
  },
});

// ============================================
// USER MUTATIONS (for future auth)
// ============================================

// Create a user
export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, { email, name }) => {
    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      throw new Error("User with this email already exists");
    }

    const userId = await ctx.db.insert("users", {
      email,
      name,
      createdAt: Date.now(),
    });

    return userId;
  },
});

// Link an anonymous estate plan to a user
export const linkEstatePlanToUser = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    userId: v.id("users"),
  },
  handler: async (ctx, { estatePlanId, userId }) => {
    await ctx.db.patch(estatePlanId, {
      userId,
      sessionId: undefined, // Clear session ID once linked to user
      updatedAt: Date.now(),
    });
  },
});

// ============================================
// BENEFICIARY DESIGNATION MUTATIONS
// ============================================

// Validator for beneficiary asset types
const beneficiaryAssetTypeValidator = v.union(
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
);

// Create a new beneficiary designation
export const createBeneficiaryDesignation = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    assetType: beneficiaryAssetTypeValidator,
    assetName: v.string(),
    institution: v.optional(v.string()),
    accountNumber: v.optional(v.string()),
    estimatedValue: v.optional(v.string()),
    primaryBeneficiaryName: v.string(),
    primaryBeneficiaryRelationship: v.optional(v.string()),
    primaryBeneficiaryPercentage: v.optional(v.number()),
    contingentBeneficiaryName: v.optional(v.string()),
    contingentBeneficiaryRelationship: v.optional(v.string()),
    contingentBeneficiaryPercentage: v.optional(v.number()),
    lastReviewedDate: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const designationId = await ctx.db.insert("beneficiaryDesignations", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return designationId;
  },
});

// Update an existing beneficiary designation
export const updateBeneficiaryDesignation = mutation({
  args: {
    designationId: v.id("beneficiaryDesignations"),
    assetType: v.optional(beneficiaryAssetTypeValidator),
    assetName: v.optional(v.string()),
    institution: v.optional(v.string()),
    accountNumber: v.optional(v.string()),
    estimatedValue: v.optional(v.string()),
    primaryBeneficiaryName: v.optional(v.string()),
    primaryBeneficiaryRelationship: v.optional(v.string()),
    primaryBeneficiaryPercentage: v.optional(v.number()),
    contingentBeneficiaryName: v.optional(v.string()),
    contingentBeneficiaryRelationship: v.optional(v.string()),
    contingentBeneficiaryPercentage: v.optional(v.number()),
    lastReviewedDate: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { designationId, ...updates }) => {
    const existing = await ctx.db.get(designationId);
    if (!existing) {
      throw new Error("Beneficiary designation not found");
    }

    // Filter out undefined values
    const filteredUpdates: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        filteredUpdates[key] = value;
      }
    }

    await ctx.db.patch(designationId, filteredUpdates);
  },
});

// Delete a beneficiary designation
export const deleteBeneficiaryDesignation = mutation({
  args: { designationId: v.id("beneficiaryDesignations") },
  handler: async (ctx, { designationId }) => {
    await ctx.db.delete(designationId);
  },
});

// Bulk save beneficiary designations (for form submission)
export const saveBeneficiaryDesignations = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    designations: v.array(
      v.object({
        id: v.optional(v.id("beneficiaryDesignations")),
        assetType: beneficiaryAssetTypeValidator,
        assetName: v.string(),
        institution: v.optional(v.string()),
        accountNumber: v.optional(v.string()),
        estimatedValue: v.optional(v.string()),
        primaryBeneficiaryName: v.string(),
        primaryBeneficiaryRelationship: v.optional(v.string()),
        primaryBeneficiaryPercentage: v.optional(v.number()),
        contingentBeneficiaryName: v.optional(v.string()),
        contingentBeneficiaryRelationship: v.optional(v.string()),
        contingentBeneficiaryPercentage: v.optional(v.number()),
        lastReviewedDate: v.optional(v.string()),
        notes: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, { estatePlanId, designations }) => {
    const now = Date.now();

    // Get existing designations to determine what to delete
    const existing = await ctx.db
      .query("beneficiaryDesignations")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .collect();

    const existingIds = new Set(existing.map((d) => d._id));
    const submittedIds = new Set(
      designations.filter((d) => d.id).map((d) => d.id)
    );

    // Delete designations that were removed
    for (const existingDesignation of existing) {
      if (!submittedIds.has(existingDesignation._id)) {
        await ctx.db.delete(existingDesignation._id);
      }
    }

    // Create or update designations
    for (const designation of designations) {
      const { id, ...data } = designation;

      if (id && existingIds.has(id)) {
        // Update existing
        await ctx.db.patch(id, {
          ...data,
          updatedAt: now,
        });
      } else {
        // Create new
        await ctx.db.insert("beneficiaryDesignations", {
          estatePlanId,
          ...data,
          createdAt: now,
          updatedAt: now,
        });
      }
    }
  },
});
