import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ===========================================
// FAMILY CONTACTS QUERIES
// ===========================================

// Get all contacts for an estate plan
export const getContacts = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("familyContacts")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .collect();
  },
});

// Get contacts by role
export const getContactsByRole = query({
  args: {
    estatePlanId: v.id("estatePlans"),
    role: v.union(
      v.literal("executor"),
      v.literal("trustee"),
      v.literal("healthcare_proxy"),
      v.literal("financial_poa"),
      v.literal("guardian"),
      v.literal("beneficiary"),
      v.literal("advisor"),
      v.literal("attorney"),
      v.literal("other")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("familyContacts")
      .withIndex("by_role", (q) =>
        q.eq("estatePlanId", args.estatePlanId).eq("role", args.role)
      )
      .collect();
  },
});

// Get contact count
export const getContactCount = query({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, args) => {
    const contacts = await ctx.db
      .query("familyContacts")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", args.estatePlanId))
      .collect();
    return contacts.length;
  },
});

// ===========================================
// FAMILY CONTACTS MUTATIONS
// ===========================================

// Create a new contact
export const createContact = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    name: v.string(),
    relationship: v.string(),
    role: v.union(
      v.literal("executor"),
      v.literal("trustee"),
      v.literal("healthcare_proxy"),
      v.literal("financial_poa"),
      v.literal("guardian"),
      v.literal("beneficiary"),
      v.literal("advisor"),
      v.literal("attorney"),
      v.literal("other")
    ),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("familyContacts", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a contact
export const updateContact = mutation({
  args: {
    contactId: v.id("familyContacts"),
    name: v.optional(v.string()),
    relationship: v.optional(v.string()),
    role: v.optional(v.union(
      v.literal("executor"),
      v.literal("trustee"),
      v.literal("healthcare_proxy"),
      v.literal("financial_poa"),
      v.literal("guardian"),
      v.literal("beneficiary"),
      v.literal("advisor"),
      v.literal("attorney"),
      v.literal("other")
    )),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { contactId, ...updates } = args;
    const now = Date.now();

    // Filter out undefined values
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    await ctx.db.patch(contactId, {
      ...filteredUpdates,
      updatedAt: now,
    });
    return contactId;
  },
});

// Delete a contact
export const deleteContact = mutation({
  args: { contactId: v.id("familyContacts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.contactId);
  },
});

// Role display names
export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  executor: "Executor",
  trustee: "Trustee",
  healthcare_proxy: "Healthcare Proxy",
  financial_poa: "Financial Power of Attorney",
  guardian: "Guardian",
  beneficiary: "Beneficiary",
  advisor: "Financial Advisor",
  attorney: "Attorney",
  other: "Other",
};
