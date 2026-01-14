/**
 * Uploaded Documents - Mutations, Queries, and Actions
 *
 * Handles document upload, storage, text extraction, and AI analysis
 * for user-uploaded legal documents (Phase 9).
 */

import { mutation, query, action, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Document type validator
const documentTypeValidator = v.union(
  v.literal("will"),
  v.literal("trust"),
  v.literal("poa_financial"),
  v.literal("poa_healthcare"),
  v.literal("healthcare_directive"),
  v.literal("deed"),
  v.literal("insurance_policy"),
  v.literal("beneficiary_form"),
  v.literal("other")
);

// ============================================
// MUTATIONS
// ============================================

// Generate upload URL for client-side upload
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Save uploaded document metadata after file is uploaded
export const saveUploadedDocument = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    storageId: v.id("_storage"),
    fileName: v.string(),
    fileSize: v.number(),
    mimeType: v.string(),
    documentType: documentTypeValidator,
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const docId = await ctx.db.insert("uploadedDocuments", {
      estatePlanId: args.estatePlanId,
      storageId: args.storageId,
      fileName: args.fileName,
      fileSize: args.fileSize,
      mimeType: args.mimeType,
      documentType: args.documentType,
      description: args.description,
      analysisStatus: "pending",
      uploadedAt: now,
    });

    return docId;
  },
});

// Internal mutation to update extracted text
export const updateExtractedText = internalMutation({
  args: {
    documentId: v.id("uploadedDocuments"),
    extractedText: v.string(),
  },
  handler: async (ctx, { documentId, extractedText }) => {
    await ctx.db.patch(documentId, {
      extractedText,
      extractedAt: Date.now(),
      analysisStatus: "analyzing",
    });
  },
});

// Internal mutation to update analysis status
export const updateAnalysisStatus = internalMutation({
  args: {
    documentId: v.id("uploadedDocuments"),
    status: v.union(
      v.literal("pending"),
      v.literal("extracting"),
      v.literal("analyzing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    analysisResult: v.optional(v.string()),
    analysisError: v.optional(v.string()),
  },
  handler: async (ctx, { documentId, status, analysisResult, analysisError }) => {
    const updates: {
      analysisStatus: typeof status;
      analysisResult?: string;
      analysisError?: string;
      analyzedAt?: number;
    } = {
      analysisStatus: status,
    };

    if (analysisResult) {
      updates.analysisResult = analysisResult;
    }
    if (analysisError) {
      updates.analysisError = analysisError;
    }
    if (status === "completed" || status === "failed") {
      updates.analyzedAt = Date.now();
    }

    await ctx.db.patch(documentId, updates);
  },
});

// Delete an uploaded document
export const deleteUploadedDocument = mutation({
  args: { documentId: v.id("uploadedDocuments") },
  handler: async (ctx, { documentId }) => {
    const doc = await ctx.db.get(documentId);
    if (doc) {
      // Delete the file from storage
      await ctx.storage.delete(doc.storageId);
      // Delete the document record
      await ctx.db.delete(documentId);
    }
    return { success: true };
  },
});

// ============================================
// QUERIES
// ============================================

// Get all uploaded documents for an estate plan
export const getUploadedDocuments = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, { estatePlanId }) => {
    const docs = await ctx.db
      .query("uploadedDocuments")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .collect();

    // Get file URLs for each document
    const docsWithUrls = await Promise.all(
      docs.map(async (doc) => {
        const url = await ctx.storage.getUrl(doc.storageId);
        return { ...doc, fileUrl: url };
      })
    );

    return docsWithUrls;
  },
});

// Get a single uploaded document by ID
export const getUploadedDocument = query({
  args: { documentId: v.id("uploadedDocuments") },
  handler: async (ctx, { documentId }) => {
    const doc = await ctx.db.get(documentId);
    if (!doc) return null;

    const url = await ctx.storage.getUrl(doc.storageId);
    return { ...doc, fileUrl: url };
  },
});

// Get documents by analysis status
export const getDocumentsByStatus = query({
  args: {
    estatePlanId: v.id("estatePlans"),
    status: v.union(
      v.literal("pending"),
      v.literal("extracting"),
      v.literal("analyzing"),
      v.literal("completed"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, { estatePlanId, status }) => {
    return await ctx.db
      .query("uploadedDocuments")
      .withIndex("by_status", (q) =>
        q.eq("estatePlanId", estatePlanId).eq("analysisStatus", status)
      )
      .collect();
  },
});

// Internal query to get document for analysis
export const getDocumentForAnalysis = internalQuery({
  args: { documentId: v.id("uploadedDocuments") },
  handler: async (ctx, { documentId }) => {
    return await ctx.db.get(documentId);
  },
});

// Internal query to get intake data for cross-reference
export const getIntakeDataForCrossReference = internalQuery({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, { estatePlanId }) => {
    const estatePlan = await ctx.db.get(estatePlanId);

    const intakeData = await ctx.db
      .query("intakeData")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .collect();

    const beneficiaryDesignations = await ctx.db
      .query("beneficiaryDesignations")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .collect();

    return {
      estatePlan,
      intakeData,
      beneficiaryDesignations,
    };
  },
});

// Internal query to get documents by status (for batch processing)
export const getDocumentsByStatusInternal = internalQuery({
  args: {
    estatePlanId: v.id("estatePlans"),
    status: v.union(
      v.literal("pending"),
      v.literal("extracting"),
      v.literal("analyzing"),
      v.literal("completed"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, { estatePlanId, status }) => {
    return await ctx.db
      .query("uploadedDocuments")
      .withIndex("by_status", (q) =>
        q.eq("estatePlanId", estatePlanId).eq("analysisStatus", status)
      )
      .collect();
  },
});

// Get document analysis summary for estate plan
export const getDocumentAnalysisSummary = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, { estatePlanId }) => {
    const docs = await ctx.db
      .query("uploadedDocuments")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .collect();

    const summary = {
      totalDocuments: docs.length,
      pendingAnalysis: docs.filter((d) => d.analysisStatus === "pending").length,
      inProgress: docs.filter((d) => ["extracting", "analyzing"].includes(d.analysisStatus)).length,
      completed: docs.filter((d) => d.analysisStatus === "completed").length,
      failed: docs.filter((d) => d.analysisStatus === "failed").length,
      documentTypes: {} as Record<string, number>,
    };

    // Count by document type
    docs.forEach((doc) => {
      summary.documentTypes[doc.documentType] = (summary.documentTypes[doc.documentType] || 0) + 1;
    });

    return summary;
  },
});
