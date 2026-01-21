import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ===========================================
// DOCUMENT CHECKLIST QUERIES
// ===========================================

// Get all checklist items for an estate plan
export const getChecklistItems = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documentChecklistItems")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .collect();
  },
});

// Get checklist items by category
export const getChecklistByCategory = query({
  args: {
    estatePlanId: v.id("estatePlans"),
    category: v.union(
      v.literal("real_estate"),
      v.literal("financial"),
      v.literal("retirement"),
      v.literal("insurance"),
      v.literal("business"),
      v.literal("personal"),
      v.literal("existing_documents")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documentChecklistItems")
      .withIndex("by_category", (q) =>
        q.eq("estatePlanId", args.estatePlanId).eq("category", args.category)
      )
      .collect();
  },
});

// Get checklist progress
export const getChecklistProgress = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("documentChecklistItems")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .collect();

    const total = items.length;
    const gathered = items.filter(i => i.status === "gathered").length;
    const inProgress = items.filter(i => i.status === "in_progress").length;

    return {
      total,
      gathered,
      inProgress,
      notGathered: total - gathered - inProgress,
      percentComplete: total > 0 ? Math.round((gathered / total) * 100) : 0,
    };
  },
});

// ===========================================
// DOCUMENT CHECKLIST MUTATIONS
// ===========================================

// Update checklist item status
export const updateChecklistStatus = mutation({
  args: {
    itemId: v.id("documentChecklistItems"),
    status: v.union(
      v.literal("not_gathered"),
      v.literal("in_progress"),
      v.literal("gathered")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.patch(args.itemId, {
      status: args.status,
      notes: args.notes,
      updatedAt: now,
    });
    return args.itemId;
  },
});

// Generate checklist based on intake data
export const generateChecklist = mutation({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if checklist already exists
    const existing = await ctx.db
      .query("documentChecklistItems")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .first();

    if (existing) {
      return { created: 0, message: "Checklist already exists" };
    }

    // Get intake data
    const intakeData = await ctx.db
      .query("intakeData")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .collect();

    const intakeBySection: Record<string, Record<string, unknown>> = {};
    for (const intake of intakeData) {
      try {
        intakeBySection[intake.section] = JSON.parse(intake.data);
      } catch {
        intakeBySection[intake.section] = {};
      }
    }

    const assets = intakeBySection.assets || {};
    const existingDocs = intakeBySection.existing_documents || {};
    const family = intakeBySection.family || {};

    const items: Array<{
      category: "real_estate" | "financial" | "retirement" | "insurance" | "business" | "personal" | "existing_documents";
      title: string;
      description: string;
    }> = [];

    // Personal documents (always)
    items.push(
      { category: "personal", title: "Birth Certificate", description: "Original or certified copy" },
      { category: "personal", title: "Social Security Card", description: "For all family members" },
      { category: "personal", title: "Marriage Certificate", description: "If married, certified copy" },
      { category: "personal", title: "Driver's License or ID", description: "Current government-issued ID" }
    );

    // Real estate documents
    if (assets.hasPrimaryHome || assets.hasOtherRealEstate) {
      items.push(
        { category: "real_estate", title: "Property Deeds", description: "Deeds for all owned properties" },
        { category: "real_estate", title: "Mortgage Statements", description: "Recent statements showing balance" },
        { category: "real_estate", title: "Property Tax Records", description: "Most recent tax bills" },
        { category: "real_estate", title: "Homeowners Insurance", description: "Current policy declarations" }
      );
    }

    // Financial documents
    if (assets.hasBankAccounts || assets.hasInvestmentAccounts) {
      items.push(
        { category: "financial", title: "Bank Statements", description: "Recent statements for all accounts" },
        { category: "financial", title: "Investment Statements", description: "Brokerage and investment accounts" },
        { category: "financial", title: "Stock Certificates", description: "If holding physical certificates" }
      );
    }

    // Retirement documents
    if (assets.hasRetirementAccounts) {
      items.push(
        { category: "retirement", title: "401(k) Statements", description: "Recent statements with beneficiary info" },
        { category: "retirement", title: "IRA Statements", description: "Traditional and Roth IRA statements" },
        { category: "retirement", title: "Pension Documents", description: "If receiving or entitled to pension" },
        { category: "retirement", title: "Beneficiary Forms", description: "Current beneficiary designations" }
      );
    }

    // Insurance documents
    if (assets.hasLifeInsurance) {
      items.push(
        { category: "insurance", title: "Life Insurance Policies", description: "All policy documents" },
        { category: "insurance", title: "Policy Beneficiary Forms", description: "Current beneficiary designations" }
      );
    }

    // Business documents
    if (assets.hasBusinessInterests) {
      items.push(
        { category: "business", title: "Operating Agreement", description: "LLC or partnership agreement" },
        { category: "business", title: "Buy-Sell Agreement", description: "If exists with partners" },
        { category: "business", title: "Business Tax Returns", description: "Last 2-3 years" },
        { category: "business", title: "Business Valuation", description: "If available" }
      );
    }

    // Existing estate planning documents
    if (existingDocs.hasWill) {
      items.push({ category: "existing_documents", title: "Current Will", description: "Most recent version for review" });
    }
    if (existingDocs.hasTrust) {
      items.push({ category: "existing_documents", title: "Trust Documents", description: "All trust agreements" });
    }
    if (existingDocs.hasPowerOfAttorney) {
      items.push({ category: "existing_documents", title: "Power of Attorney", description: "Financial POA documents" });
    }
    if (existingDocs.hasHealthcareDirective) {
      items.push({ category: "existing_documents", title: "Healthcare Directive", description: "Living will or advance directive" });
    }

    // If has children, add guardian-related docs
    const familyChildren = family as { hasChildren?: boolean; numberOfChildren?: number };
    if (familyChildren.hasChildren || (familyChildren.numberOfChildren && familyChildren.numberOfChildren > 0)) {
      items.push({ category: "personal", title: "Children's Birth Certificates", description: "For minor children" });
    }

    // Insert all items
    let created = 0;
    for (const item of items) {
      await ctx.db.insert("documentChecklistItems", {
        estatePlanId: args.estatePlanId,
        category: item.category,
        title: item.title,
        description: item.description,
        status: "not_gathered",
        createdAt: now,
        updatedAt: now,
      });
      created++;
    }

    return { created, message: `Created ${created} checklist items` };
  },
});

// Delete all checklist items (for regenerating)
export const clearChecklist = mutation({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("documentChecklistItems")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .collect();

    for (const item of items) {
      await ctx.db.delete(item._id);
    }

    return { deleted: items.length };
  },
});

// ===========================================
// PREPARATION TASK OVERVIEW
// ===========================================

// Get overall preparation progress
export const getPreparationProgress = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, args) => {
    // Document checklist progress
    const checklistItems = await ctx.db
      .query("documentChecklistItems")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .collect();

    const checklistTotal = checklistItems.length;
    const checklistGathered = checklistItems.filter(i => i.status === "gathered").length;

    // Family contacts progress
    const contacts = await ctx.db
      .query("familyContacts")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .collect();

    // Attorney questions count
    const questions = await ctx.db
      .query("attorneyQuestions")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .collect();

    return {
      documents: {
        total: checklistTotal,
        completed: checklistGathered,
        percentComplete: checklistTotal > 0 ? Math.round((checklistGathered / checklistTotal) * 100) : 0,
      },
      contacts: {
        total: contacts.length,
        // Consider "complete" if at least 2 key contacts added
        hasMinimum: contacts.length >= 2,
      },
      questions: {
        total: questions.length,
        unanswered: questions.filter(q => !q.isAnswered).length,
      },
    };
  },
});

// Category display names
export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  real_estate: "Real Estate",
  financial: "Financial Accounts",
  retirement: "Retirement Accounts",
  insurance: "Insurance",
  business: "Business",
  personal: "Personal Documents",
  existing_documents: "Existing Estate Documents",
};
