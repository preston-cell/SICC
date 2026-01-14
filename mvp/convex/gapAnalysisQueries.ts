import { internalQuery } from "./_generated/server";
import { v } from "convex/values";

// Internal query to get all intake data for gap analysis
export const getIntakeDataForAnalysis = internalQuery({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, { estatePlanId }) => {
    // Get the estate plan
    const estatePlan = await ctx.db.get(estatePlanId);
    if (!estatePlan) {
      return null;
    }

    // Get all intake data sections
    const intakeRecords = await ctx.db
      .query("intakeData")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .collect();

    // Organize by section
    const sections: Record<string, { data: string; isComplete: boolean }> = {};
    for (const record of intakeRecords) {
      sections[record.section] = {
        data: record.data,
        isComplete: record.isComplete,
      };
    }

    // Get beneficiary designations
    const beneficiaryDesignations = await ctx.db
      .query("beneficiaryDesignations")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .collect();

    return {
      estatePlan: {
        id: estatePlan._id,
        status: estatePlan.status,
        stateOfResidence: estatePlan.stateOfResidence,
        name: estatePlan.name,
      },
      personal: sections.personal || null,
      family: sections.family || null,
      assets: sections.assets || null,
      existingDocuments: sections.existing_documents || null,
      goals: sections.goals || null,
      beneficiaryDesignations: beneficiaryDesignations.map((d) => ({
        assetType: d.assetType,
        assetName: d.assetName,
        institution: d.institution,
        estimatedValue: d.estimatedValue,
        primaryBeneficiaryName: d.primaryBeneficiaryName,
        primaryBeneficiaryRelationship: d.primaryBeneficiaryRelationship,
        primaryBeneficiaryPercentage: d.primaryBeneficiaryPercentage,
        contingentBeneficiaryName: d.contingentBeneficiaryName,
        contingentBeneficiaryRelationship: d.contingentBeneficiaryRelationship,
        contingentBeneficiaryPercentage: d.contingentBeneficiaryPercentage,
        lastReviewedDate: d.lastReviewedDate,
        notes: d.notes,
      })),
    };
  },
});
