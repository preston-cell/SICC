"use node";

/**
 * Gap Analysis Action - Using Claude Code in E2B
 *
 * This action analyzes estate planning intake data by:
 * 1. Fetching intake data from the database
 * 2. Calling the Next.js API route which runs Claude Code in E2B
 * 3. Claude Code uses the us-estate-planning-analyzer skill to produce comprehensive analysis
 * 4. Saving the analysis results to the database
 */

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getStateSpecificContent, getFinancialProfilePrompt } from "./stateSpecificAnalysis";

// Gap analysis action - analyzes estate planning intake data using Claude Code via API route
export const runGapAnalysis = action({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, { estatePlanId }) => {
    // Fetch all intake data for this estate plan
    const intakeData = await ctx.runQuery(internal.gapAnalysisQueries.getIntakeDataForAnalysis, {
      estatePlanId,
    });

    if (!intakeData || !intakeData.estatePlan) {
      throw new Error("Estate plan not found");
    }

    // Create agent run record
    const runId: Id<"agentRuns"> = await ctx.runMutation(
      internal.mutations.createRun,
      { prompt: `Gap analysis for estate plan ${estatePlanId}` }
    );

    // Update run status
    await ctx.runMutation(internal.mutations.updateRun, {
      runId,
      status: "running",
    });

    try {
      // Build the analysis prompt
      const analysisPrompt = buildAnalysisPrompt(intakeData);

      // Call the Next.js API route for E2B execution
      const apiUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/e2b/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: analysisPrompt,
          outputFile: "analysis.json",
          timeoutMs: 240000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API call failed: ${response.status} ${errorText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "E2B execution failed");
      }

      const output = `STDOUT:\n${result.stdout}\n\nSTDERR:\n${result.stderr || "(none)"}`;

      // Parse the JSON result from output
      let analysisResult;

      // Try to read from file content first
      if (result.fileContent) {
        try {
          analysisResult = JSON.parse(result.fileContent);
        } catch {
          console.error("Failed to parse file content as JSON");
        }
      }

      // Try to extract JSON from stdout
      if (!analysisResult) {
        const jsonMatch = result.stdout?.match(/```json\n([\s\S]*?)\n```/) ||
                          result.stdout?.match(/\{[\s\S]*"score"[\s\S]*"recommendations"[\s\S]*\}/);

        if (jsonMatch) {
          try {
            const jsonStr = jsonMatch[1] || jsonMatch[0];
            const start = jsonStr.indexOf('{');
            const end = jsonStr.lastIndexOf('}') + 1;
            if (start !== -1 && end > start) {
              analysisResult = JSON.parse(jsonStr.substring(start, end));
            }
          } catch (e) {
            console.error("Failed to parse analysis JSON:", e);
          }
        }
      }

      // If we still don't have a result, create a default one
      if (!analysisResult) {
        analysisResult = {
          score: 50,
          missingDocuments: [],
          outdatedDocuments: [],
          inconsistencies: [],
          recommendations: [
            {
              action: "Review analysis output manually",
              priority: "medium",
              reason: "Automated parsing could not extract structured results"
            }
          ],
          stateSpecificNotes: [],
          rawAnalysis: result.stdout,
        };
      }

      // Save the gap analysis results
      await ctx.runMutation(internal.estatePlanning.saveGapAnalysis, {
        estatePlanId,
        runId,
        score: analysisResult.score || 50,
        estateComplexity: analysisResult.estateComplexity
          ? JSON.stringify(analysisResult.estateComplexity)
          : undefined,
        estimatedEstateTax: (analysisResult.estimatedEstateTax || analysisResult.financialExposure?.estimatedEstateTax)
          ? JSON.stringify(analysisResult.estimatedEstateTax || analysisResult.financialExposure?.estimatedEstateTax)
          : undefined,
        missingDocuments: JSON.stringify(analysisResult.missingDocuments || []),
        outdatedDocuments: JSON.stringify(analysisResult.outdatedDocuments || []),
        inconsistencies: JSON.stringify(analysisResult.inconsistencies || []),
        taxOptimization: (analysisResult.taxOptimization || analysisResult.taxStrategies)
          ? JSON.stringify(analysisResult.taxOptimization || analysisResult.taxStrategies)
          : undefined,
        medicaidPlanning: analysisResult.medicaidPlanning
          ? JSON.stringify(analysisResult.medicaidPlanning)
          : undefined,
        recommendations: JSON.stringify(analysisResult.recommendations || analysisResult.prioritizedRecommendations || []),
        stateSpecificNotes: JSON.stringify(analysisResult.stateSpecificNotes || analysisResult.stateSpecificConsiderations || []),
        rawAnalysis: analysisResult.rawAnalysis || output,
      });

      // Update run as completed
      await ctx.runMutation(internal.mutations.updateRun, {
        runId,
        status: "completed",
        output,
      });

      return {
        success: true,
        runId,
        analysisResult,
      };
    } catch (err: unknown) {
      const error = err as Error & { stdout?: string; stderr?: string };
      const errorOutput = `Error: ${error.message}\nStdout: ${error.stdout || ""}\nStderr: ${error.stderr || ""}`;

      await ctx.runMutation(internal.mutations.updateRun, {
        runId,
        status: "failed",
        output: errorOutput,
        error: error.message,
      });

      return {
        success: false,
        runId,
        error: error.message,
      };
    }
  },
});

// Beneficiary designation type for type safety
interface BeneficiaryDesignation {
  assetType: string;
  assetName: string;
  institution?: string;
  estimatedValue?: string;
  primaryBeneficiaryName: string;
  primaryBeneficiaryRelationship?: string;
  primaryBeneficiaryPercentage?: number;
  contingentBeneficiaryName?: string;
  contingentBeneficiaryRelationship?: string;
  contingentBeneficiaryPercentage?: number;
  lastReviewedDate?: string;
  notes?: string;
}

// ============================================
// COMMON DOCUMENT ISSUE DETECTION
// ============================================

// Interface for detected common issues
interface CommonDocumentIssue {
  type: "missing_beneficiary" | "unclear_trust" | "missing_guardian" | "outdated_designation" | "inconsistent_beneficiary" | "business_succession";
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  affectedAssets?: string[];
  recommendation: string;
}

// Interface for parsed family data
interface FamilyData {
  hasSpouse?: boolean;
  spouseName?: string;
  hasChildren?: boolean;
  numberOfChildren?: number;
  children?: Array<{
    name?: string;
    age?: number;
    isMinor?: boolean;
    relationship?: string;
  }>;
  hasMinorChildren?: boolean;
  guardianNominated?: boolean;
  guardianName?: string;
  alternateGuardianName?: string;
  hasDependents?: boolean;
  hasSpecialNeedsDependents?: boolean;
  specialNeedsDetails?: string;
  previousMarriages?: boolean;
  childrenFromPreviousMarriage?: boolean;
}

// Interface for parsed assets data
interface AssetsData {
  hasRetirementAccounts?: boolean;
  retirementAccountsValue?: string;
  hasLifeInsurance?: boolean;
  lifeInsuranceValue?: string;
  lifeInsuranceBeneficiaries?: string;
  hasInvestmentAccounts?: boolean;
  hasBankAccounts?: boolean;
  hasTrust?: boolean;
  trustType?: string;
  trustDetails?: string;
  // Business interest fields
  hasBusinessInterests?: boolean;
  businessType?: string;
  businessName?: string;
  businessValue?: string;
  businessOwnershipPercentage?: number;
  hasBusinessPartners?: boolean;
  hasBuySellAgreement?: boolean;
  hasSuccessionPlan?: boolean;
  businessKeyEmployees?: boolean;
}

// Interface for parsed existing documents data
interface ExistingDocsData {
  hasWill?: boolean;
  willDate?: string;
  hasTrust?: boolean;
  trustType?: string;
  trustDate?: string;
  trustFunded?: boolean;
  trustBeneficiaries?: string;
  trustSuccessorTrustee?: string;
  hasPOAFinancial?: boolean;
  hasPOAHealthcare?: boolean;
  hasHealthcareDirective?: boolean;
}

// Interface for parsed goals data
interface GoalsData {
  primaryGoals?: string[];
  specificBequests?: string;
  charitableGiving?: boolean;
  specialInstructions?: string;
}

/**
 * Detect missing beneficiary issues
 * Checks for retirement accounts and life insurance without proper beneficiary designations
 */
function detectMissingBeneficiaries(
  assetsData: AssetsData,
  beneficiaryDesignations: BeneficiaryDesignation[],
  familyData: FamilyData
): CommonDocumentIssue[] {
  const issues: CommonDocumentIssue[] = [];

  // Check if user has retirement accounts but no beneficiary designations tracked
  if (assetsData.hasRetirementAccounts && beneficiaryDesignations.length === 0) {
    issues.push({
      type: "missing_beneficiary",
      severity: "critical",
      title: "Retirement Account Beneficiaries Not Tracked",
      description: "You have retirement accounts but haven't tracked beneficiary designations. Retirement accounts pass directly to named beneficiaries, bypassing your will.",
      recommendation: "Review and document beneficiary designations for all retirement accounts (401(k), IRA, etc.). Ensure primary and contingent beneficiaries are named.",
    });
  }

  // Check if user has life insurance but no beneficiary info
  if (assetsData.hasLifeInsurance && !assetsData.lifeInsuranceBeneficiaries && beneficiaryDesignations.filter(b => b.assetType === "life_insurance").length === 0) {
    issues.push({
      type: "missing_beneficiary",
      severity: "critical",
      title: "Life Insurance Beneficiaries Not Specified",
      description: "You have life insurance but haven't specified beneficiaries. Life insurance proceeds go directly to named beneficiaries.",
      recommendation: "Contact your life insurance provider to verify and update beneficiary designations. Consider naming both primary and contingent beneficiaries.",
    });
  }

  // Check for accounts without contingent beneficiaries
  const accountsWithoutContingent = beneficiaryDesignations.filter(
    b => b.primaryBeneficiaryName && !b.contingentBeneficiaryName
  );
  if (accountsWithoutContingent.length > 0) {
    issues.push({
      type: "missing_beneficiary",
      severity: "high",
      title: "Missing Contingent Beneficiaries",
      description: `${accountsWithoutContingent.length} account(s) have primary beneficiaries but no contingent (backup) beneficiaries named.`,
      affectedAssets: accountsWithoutContingent.map(a => a.assetName || a.assetType),
      recommendation: "Name contingent beneficiaries for all accounts. If your primary beneficiary predeceases you, assets may go through probate without a contingent.",
    });
  }

  // Check for potential ex-spouse issues (if divorced with beneficiaries named)
  if (familyData.previousMarriages) {
    const potentialExSpouseIssues = beneficiaryDesignations.filter(b => {
      const relationship = b.primaryBeneficiaryRelationship?.toLowerCase();
      return relationship === "spouse" || relationship === "ex-spouse";
    });
    if (potentialExSpouseIssues.length > 0) {
      issues.push({
        type: "inconsistent_beneficiary",
        severity: "critical",
        title: "Review Beneficiaries After Previous Marriage",
        description: "You indicated previous marriages. Ensure beneficiary designations have been updated and don't still name an ex-spouse.",
        affectedAssets: potentialExSpouseIssues.map(a => a.assetName || a.assetType),
        recommendation: "Review all beneficiary designations immediately. Update any that still name a former spouse unless intentional.",
      });
    }
  }

  // Check if children exist but aren't reflected in beneficiaries (for families with children)
  if (familyData.hasChildren && familyData.numberOfChildren && familyData.numberOfChildren > 0) {
    const childBeneficiaries = beneficiaryDesignations.filter(
      b => b.primaryBeneficiaryRelationship?.toLowerCase() === "child" ||
           b.contingentBeneficiaryRelationship?.toLowerCase() === "child"
    );
    if (beneficiaryDesignations.length > 0 && childBeneficiaries.length === 0) {
      issues.push({
        type: "inconsistent_beneficiary",
        severity: "medium",
        title: "Children Not Named as Beneficiaries",
        description: "You have children but none are named as beneficiaries on tracked accounts. This may be intentional, but worth reviewing.",
        recommendation: "Consider whether children should be named as primary or contingent beneficiaries on some accounts.",
      });
    }
  }

  return issues;
}

/**
 * Detect unclear trust issues
 * Checks for trust-related problems like unfunded trusts, missing trustees, unclear terms
 */
function detectUnclearTrustIssues(
  existingDocsData: ExistingDocsData,
  assetsData: AssetsData,
  goalsData: GoalsData
): CommonDocumentIssue[] {
  const issues: CommonDocumentIssue[] = [];

  // Check if trust exists but may not be funded
  if (existingDocsData.hasTrust && existingDocsData.trustFunded === false) {
    issues.push({
      type: "unclear_trust",
      severity: "critical",
      title: "Trust May Not Be Properly Funded",
      description: "You have a trust but it may not be funded. An unfunded trust provides no benefit - assets must be transferred into the trust to avoid probate.",
      recommendation: "Review trust funding immediately. Ensure real estate deeds, bank accounts, and investment accounts are titled in the trust's name.",
    });
  }

  // Check if trust exists but no successor trustee named
  if (existingDocsData.hasTrust && !existingDocsData.trustSuccessorTrustee) {
    issues.push({
      type: "unclear_trust",
      severity: "high",
      title: "No Successor Trustee Identified",
      description: "Your trust doesn't have a clearly identified successor trustee. Someone must manage the trust if you become incapacitated or pass away.",
      recommendation: "Name a successor trustee (and alternate) who can manage trust assets and make distributions according to trust terms.",
    });
  }

  // Check if trust beneficiaries are unclear
  if (existingDocsData.hasTrust && !existingDocsData.trustBeneficiaries) {
    issues.push({
      type: "unclear_trust",
      severity: "high",
      title: "Trust Beneficiaries Not Clearly Defined",
      description: "Trust beneficiaries haven't been clearly documented. This could lead to disputes or unintended distributions.",
      recommendation: "Review and clearly document primary and contingent trust beneficiaries, including specific percentages or shares.",
    });
  }

  // Check for trust type mismatch with goals
  if (existingDocsData.hasTrust && goalsData.charitableGiving && existingDocsData.trustType?.toLowerCase() !== "charitable") {
    issues.push({
      type: "unclear_trust",
      severity: "medium",
      title: "Trust Type May Not Match Charitable Goals",
      description: "You've indicated charitable giving goals but your current trust may not be optimized for charitable purposes.",
      recommendation: "Consider whether a Charitable Remainder Trust (CRT) or Charitable Lead Trust (CLT) would better serve your goals.",
    });
  }

  // Check if has significant assets but no trust
  const hasSignificantAssets = assetsData.hasRetirementAccounts ||
                               assetsData.hasLifeInsurance ||
                               assetsData.hasInvestmentAccounts;
  if (hasSignificantAssets && !existingDocsData.hasTrust && !existingDocsData.hasWill) {
    issues.push({
      type: "unclear_trust",
      severity: "high",
      title: "No Will or Trust for Significant Assets",
      description: "You have significant assets but no will or trust. Without estate planning documents, state law will determine how assets are distributed.",
      recommendation: "Consult with an estate planning attorney to create a will and consider whether a revocable living trust would benefit your situation.",
    });
  }

  return issues;
}

/**
 * Detect missing guardian issues
 * Checks for families with minor children who haven't nominated guardians
 */
function detectMissingGuardians(
  familyData: FamilyData,
  existingDocsData: ExistingDocsData
): CommonDocumentIssue[] {
  const issues: CommonDocumentIssue[] = [];

  // Check if has minor children but no guardian nominated
  const hasMinorChildren = familyData.hasMinorChildren ||
    (familyData.children?.some(c => c.isMinor || (c.age !== undefined && c.age < 18)));

  if (hasMinorChildren && !familyData.guardianNominated && !familyData.guardianName) {
    issues.push({
      type: "missing_guardian",
      severity: "critical",
      title: "No Guardian Nominated for Minor Children",
      description: "You have minor children but haven't nominated a guardian. If both parents pass away, a court will decide who raises your children without your input.",
      recommendation: "Nominate a guardian (and alternate) for your minor children in your will immediately. Consider the guardian's values, location, and ability to care for your children.",
    });
  }

  // Check if guardian is nominated but no alternate
  if (familyData.guardianName && !familyData.alternateGuardianName) {
    issues.push({
      type: "missing_guardian",
      severity: "high",
      title: "No Alternate Guardian Nominated",
      description: "You've nominated a guardian but no alternate. If your primary guardian is unable or unwilling to serve, the court will choose.",
      recommendation: "Nominate an alternate guardian in case your first choice cannot serve.",
    });
  }

  // Check if has special needs dependents without proper planning
  if (familyData.hasSpecialNeedsDependents) {
    issues.push({
      type: "missing_guardian",
      severity: "critical",
      title: "Special Needs Dependent Requires Additional Planning",
      description: "You have a dependent with special needs. Standard inheritance could disqualify them from government benefits.",
      recommendation: "Consult with a special needs planning attorney. Consider a Special Needs Trust (SNT) to provide for your dependent without affecting their benefits eligibility.",
    });
  }

  // Check if will exists but might not include guardian provisions
  if (hasMinorChildren && existingDocsData.hasWill && !familyData.guardianNominated) {
    issues.push({
      type: "missing_guardian",
      severity: "high",
      title: "Will May Not Include Guardian Nomination",
      description: "You have a will and minor children, but guardian nomination status is unclear. Your will should explicitly name a guardian.",
      recommendation: "Review your will to ensure it includes guardian nominations for all minor children.",
    });
  }

  return issues;
}

/**
 * Detect outdated beneficiary designations
 * Checks for designations that haven't been reviewed recently
 */
function detectOutdatedDesignations(
  beneficiaryDesignations: BeneficiaryDesignation[]
): CommonDocumentIssue[] {
  const issues: CommonDocumentIssue[] = [];
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  const outdatedDesignations = beneficiaryDesignations.filter(b => {
    if (!b.lastReviewedDate) return true; // No review date = potentially outdated
    try {
      const reviewDate = new Date(b.lastReviewedDate);
      return reviewDate < twoYearsAgo;
    } catch {
      return true; // Can't parse date = flag it
    }
  });

  if (outdatedDesignations.length > 0) {
    const neverReviewed = outdatedDesignations.filter(b => !b.lastReviewedDate);
    const oldReviews = outdatedDesignations.filter(b => b.lastReviewedDate);

    if (neverReviewed.length > 0) {
      issues.push({
        type: "outdated_designation",
        severity: "medium",
        title: "Beneficiary Designations Never Reviewed",
        description: `${neverReviewed.length} account(s) have no recorded review date for beneficiary designations.`,
        affectedAssets: neverReviewed.map(a => a.assetName || a.assetType),
        recommendation: "Review these beneficiary designations and record the review date. Beneficiaries should be reviewed annually or after major life events.",
      });
    }

    if (oldReviews.length > 0) {
      issues.push({
        type: "outdated_designation",
        severity: "medium",
        title: "Beneficiary Designations Need Review",
        description: `${oldReviews.length} account(s) haven't had beneficiary designations reviewed in over 2 years.`,
        affectedAssets: oldReviews.map(a => a.assetName || a.assetType),
        recommendation: "Review and update beneficiary designations. Life changes (marriage, divorce, births, deaths) may require updates.",
      });
    }
  }

  return issues;
}

/**
 * Detect business interest issues
 * Checks for business succession planning, buy-sell agreements, and key person concerns
 */
function detectBusinessInterestIssues(
  assetsData: AssetsData,
  familyData: FamilyData,
  existingDocsData: ExistingDocsData
): CommonDocumentIssue[] {
  const issues: CommonDocumentIssue[] = [];

  // Only process if user has business interests
  if (!assetsData.hasBusinessInterests) {
    return issues;
  }

  // Critical: No succession plan for business
  if (!assetsData.hasSuccessionPlan) {
    issues.push({
      type: "business_succession",
      severity: "critical",
      title: "No Business Succession Plan",
      description: "You own a business but haven't established a succession plan. Without one, your business may fail, be sold at a loss, or create family conflicts if you become incapacitated or pass away.",
      recommendation: "Develop a comprehensive business succession plan that addresses ownership transfer, management transition, and funding mechanisms. Consider whether the business will be sold, transferred to family, or liquidated.",
    });
  }

  // Critical: Has business partners but no buy-sell agreement
  if (assetsData.hasBusinessPartners && !assetsData.hasBuySellAgreement) {
    issues.push({
      type: "business_succession",
      severity: "critical",
      title: "No Buy-Sell Agreement with Business Partners",
      description: "You have business partners but no buy-sell agreement in place. If a partner dies, becomes disabled, or wants to exit, there's no defined process for handling their ownership interest.",
      recommendation: "Execute a buy-sell agreement with all partners that establishes: valuation methods, triggering events (death, disability, retirement, divorce), funding mechanisms (life insurance, installment payments), and transfer restrictions.",
    });
  }

  // High: Business value is significant but no life insurance to fund buy-out
  const significantBusinessValues = ["500k_1m", "1m_2m", "2m_5m", "5m_10m", "over_10m"];
  if (assetsData.businessValue && significantBusinessValues.includes(assetsData.businessValue)) {
    if (!assetsData.hasLifeInsurance && assetsData.hasBusinessPartners) {
      issues.push({
        type: "business_succession",
        severity: "high",
        title: "No Life Insurance to Fund Business Buy-Out",
        description: "Your business has significant value with partners, but you may not have adequate life insurance to fund a buy-out. Partners or heirs may not have liquidity to purchase your interest.",
        recommendation: "Consider key person life insurance or cross-purchase life insurance policies to fund buy-sell agreement obligations. This ensures liquidity is available when needed.",
      });
    }
  }

  // High: Family business without clear family involvement plan
  if (familyData.hasChildren && !assetsData.hasSuccessionPlan) {
    issues.push({
      type: "business_succession",
      severity: "high",
      title: "Family Business Succession Unclear",
      description: "You have children and a business, but no succession plan. It's unclear whether family members will inherit, manage, or sell the business.",
      recommendation: "Decide and document: Will children inherit the business? Are they qualified and interested in running it? Should some children receive business interests while others receive equivalent non-business assets? Consider a family meeting to discuss expectations.",
    });
  }

  // High: Business with key employees but no retention planning
  if (assetsData.businessKeyEmployees && !assetsData.hasSuccessionPlan) {
    issues.push({
      type: "business_succession",
      severity: "high",
      title: "Key Employee Retention Not Addressed",
      description: "Your business relies on key employees, but there's no plan to retain them during ownership transition. Key employees may leave, taking critical knowledge and relationships.",
      recommendation: "Implement key employee retention strategies: stay bonuses, deferred compensation, phantom stock, or actual equity participation. Document these arrangements and communicate with key personnel.",
    });
  }

  // Medium: Sole proprietorship or 100% ownership without backup
  if (assetsData.businessOwnershipPercentage === 100 || !assetsData.hasBusinessPartners) {
    if (!existingDocsData.hasPOAFinancial) {
      issues.push({
        type: "business_succession",
        severity: "high",
        title: "No Financial POA for Business Operations",
        description: "You're the sole owner of your business with no financial power of attorney. If you become incapacitated, no one may have legal authority to operate, sell, or manage the business.",
        recommendation: "Execute a durable financial power of attorney that specifically grants authority over business operations, banking, contracts, and potential sale of business assets.",
      });
    }
  }

  // Medium: Business entity type may need review
  if (assetsData.businessType === "sole_proprietorship") {
    issues.push({
      type: "business_succession",
      severity: "medium",
      title: "Sole Proprietorship Limits Estate Planning Options",
      description: "Operating as a sole proprietorship limits liability protection and succession planning options. The business cannot be easily transferred or have shared ownership.",
      recommendation: "Consult with a business attorney about converting to an LLC or corporation. These structures offer better liability protection, easier ownership transfer, and more sophisticated succession planning options.",
    });
  }

  // Medium: Business but no operating agreement or corporate documents reviewed
  if (assetsData.businessType && ["llc", "partnership", "s_corp", "c_corp"].includes(assetsData.businessType)) {
    issues.push({
      type: "business_succession",
      severity: "medium",
      title: "Review Business Governing Documents",
      description: "Your business structure has governing documents (operating agreement, bylaws, partnership agreement) that should be reviewed to ensure they align with your estate plan.",
      recommendation: "Review your business governing documents with your estate planning attorney. Ensure transfer restrictions, buy-out provisions, and management succession align with your will and trust provisions.",
    });
  }

  return issues;
}

/**
 * Main function to detect all common document issues
 * Aggregates results from all detection functions
 */
function detectCommonIssues(
  familyData: FamilyData,
  assetsData: AssetsData,
  existingDocsData: ExistingDocsData,
  goalsData: GoalsData,
  beneficiaryDesignations: BeneficiaryDesignation[]
): CommonDocumentIssue[] {
  const allIssues: CommonDocumentIssue[] = [];

  // Run all detection functions
  allIssues.push(...detectMissingBeneficiaries(assetsData, beneficiaryDesignations, familyData));
  allIssues.push(...detectUnclearTrustIssues(existingDocsData, assetsData, goalsData));
  allIssues.push(...detectMissingGuardians(familyData, existingDocsData));
  allIssues.push(...detectOutdatedDesignations(beneficiaryDesignations));
  allIssues.push(...detectBusinessInterestIssues(assetsData, familyData, existingDocsData));

  // Sort by severity (critical first)
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  allIssues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return allIssues;
}

// Build the analysis prompt from intake data
function buildAnalysisPrompt(intakeData: {
  estatePlan: { stateOfResidence?: string };
  personal?: { data: string };
  family?: { data: string };
  assets?: { data: string };
  existingDocuments?: { data: string };
  goals?: { data: string };
  beneficiaryDesignations?: BeneficiaryDesignation[];
}): string {
  const state = intakeData.estatePlan?.stateOfResidence || "Unknown";

  let personalData = {};
  let familyData = {};
  let assetsData = {};
  let existingDocsData = {};
  let goalsData = {};

  try {
    if (intakeData.personal?.data) personalData = JSON.parse(intakeData.personal.data);
    if (intakeData.family?.data) familyData = JSON.parse(intakeData.family.data);
    if (intakeData.assets?.data) assetsData = JSON.parse(intakeData.assets.data);
    if (intakeData.existingDocuments?.data) existingDocsData = JSON.parse(intakeData.existingDocuments.data);
    if (intakeData.goals?.data) goalsData = JSON.parse(intakeData.goals.data);
  } catch (e) {
    console.error("Error parsing intake data:", e);
  }

  const beneficiaryData = intakeData.beneficiaryDesignations || [];

  // Get state-specific analysis content
  const stateContent = getStateSpecificContent(state);
  const financialProfilePrompt = getFinancialProfilePrompt();

  // Build state-specific section if available
  let stateSpecificSection = '';
  if (stateContent.isSupported) {
    stateSpecificSection = `
=== STATE-SPECIFIC ANALYSIS REQUIREMENTS FOR ${state.toUpperCase()} ===

You MUST apply the following state-specific rules in your analysis:

${stateContent.complianceReference}

${stateContent.taxReference}

${stateContent.medicaidReference}

=== END STATE-SPECIFIC REQUIREMENTS ===
`;
  }

  return `You are an expert estate planning analyst using the us-estate-planning-analyzer skill.

Perform a comprehensive gap analysis of the following estate planning data.

STATE OF RESIDENCE: ${state}
${stateContent.isSupported ? `\n**ENHANCED ANALYSIS**: This state (${state}) has specialized analysis rules available. Apply them carefully.\n` : ''}

=== INTAKE DATA ===

PERSONAL INFORMATION:
${JSON.stringify(personalData, null, 2)}

FAMILY INFORMATION:
${JSON.stringify(familyData, null, 2)}

ASSETS OVERVIEW:
${JSON.stringify(assetsData, null, 2)}

BENEFICIARY DESIGNATIONS (accounts that bypass the will):
${beneficiaryData.length > 0 ? JSON.stringify(beneficiaryData, null, 2) : "No beneficiary designations tracked"}

EXISTING DOCUMENTS:
${JSON.stringify(existingDocsData, null, 2)}

GOALS AND WISHES:
${JSON.stringify(goalsData, null, 2)}

${financialProfilePrompt}

${stateSpecificSection}

=== ANALYSIS REQUIREMENTS ===

Analyze this estate plan comprehensively. Consider:

1. **Missing Documents**: What essential documents are missing based on their situation?
   - Will, Trust, POAs (financial & healthcare), Healthcare Directive, HIPAA
   - Consider family situation (minor children need guardian nominations)
   - Consider asset complexity (high value may need trust)

2. **Outdated Documents**: Any documents created more than 5 years ago?

3. **Inconsistencies**: Conflicts between stated goals and existing documents?
   - Beneficiary designations vs. will provisions
   - Ex-spouse still named on accounts?
   - Children from previous marriage not included?

4. **State-Specific Issues**: Requirements specific to ${state}

5. **Tax Planning**: Based on estate value, any tax optimization strategies?

6. **Beneficiary Conflicts**: Do retirement/insurance beneficiaries match will intentions?

=== OUTPUT FORMAT ===

Save your analysis as JSON to: /home/user/generated/analysis.json

Use this exact format:
{
  "score": <number 0-100 representing estate plan completeness>,
  "estateComplexity": "<low, moderate, or high>",
  "estimatedEstateTax": {
    "state": <estimated state estate tax in dollars>,
    "federal": <estimated federal estate tax in dollars>,
    "notes": "<explanation>"
  },
  "commonIssues": [
    {
      "type": "<missing_beneficiary, unclear_trust, missing_guardian, outdated_designation, inconsistent_beneficiary, or business_succession>",
      "severity": "<critical, high, medium, or low>",
      "title": "<short title for the issue>",
      "description": "<detailed description of the issue>",
      "affectedAssets": ["<list of affected assets if applicable>"],
      "recommendation": "<specific action to resolve>"
    }
  ],
  "missingDocuments": [
    {
      "type": "<document type>",
      "priority": "<high, medium, or low>",
      "reason": "<why this document is needed>",
      "estimatedImpact": "<dollar impact if applicable>"
    }
  ],
  "outdatedDocuments": [
    {
      "type": "<document type>",
      "issue": "<what's outdated>",
      "recommendation": "<what should be done>"
    }
  ],
  "inconsistencies": [
    {
      "issue": "<describe the inconsistency>",
      "details": "<specifics>",
      "recommendation": "<how to resolve>"
    }
  ],
  "taxOptimization": [
    {
      "strategy": "<strategy name>",
      "applicability": "<why this applies>",
      "estimatedSavings": "<dollar amount>",
      "complexity": "<conservative, moderate, or advanced>",
      "priority": "<high, medium, or low>"
    }
  ],
  "medicaidPlanning": {
    "atRisk": <boolean>,
    "concerns": ["<list of concerns>"],
    "recommendations": ["<recommendations>"],
    "lookbackIssues": ["<5-year look-back concerns>"]
  },
  "recommendations": [
    {
      "action": "<specific action to take>",
      "priority": "<high, medium, or low>",
      "reason": "<why this is important>",
      "estimatedImpact": "<dollar impact if calculable>"
    }
  ],
  "stateSpecificNotes": [
    {
      "note": "<state-specific consideration>",
      "relevance": "<why this matters>",
      "citation": "<legal citation if applicable>"
    }
  ]
}

Perform the analysis now and save the results.`;
}
