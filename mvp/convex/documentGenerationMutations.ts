/**
 * Document Generation Mutations
 *
 * Mutations for saving generated documents to the database.
 * These run in the Convex runtime (not Node.js).
 */

import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Document type validator
const documentTypeValidator = v.union(
  v.literal("will"),
  v.literal("trust"),
  v.literal("poa_financial"),
  v.literal("poa_healthcare"),
  v.literal("healthcare_directive"),
  v.literal("hipaa"),
  v.literal("other")
);

// Internal mutation to save generated document
export const saveGeneratedDocument = internalMutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    type: documentTypeValidator,
    title: v.string(),
    content: v.string(),
    format: v.union(v.literal("markdown"), v.literal("html"), v.literal("pdf")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Get the next version number for this document type
    const existingDocs = await ctx.db
      .query("documents")
      .withIndex("by_type", (q) =>
        q.eq("estatePlanId", args.estatePlanId).eq("type", args.type)
      )
      .collect();
    const version = existingDocs.length + 1;

    const docId = await ctx.db.insert("documents", {
      estatePlanId: args.estatePlanId,
      type: args.type,
      title: args.title,
      content: args.content,
      format: args.format,
      version,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });

    return docId;
  },
});
