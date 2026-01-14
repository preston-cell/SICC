"use node";

/**
 * Document Generation Action - Using Claude Code in E2B
 *
 * This action generates legal documents by:
 * 1. Fetching intake data from the database
 * 2. Calling the Next.js API route which runs Claude Code in E2B
 * 3. Claude Code iterates and generates high-quality legal documents
 * 4. Saving the generated document to the database
 */

import { action } from "./_generated/server";
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
  v.literal("hipaa"),
  v.literal("other")
);

// Helper to parse intake data
interface IntakeSection {
  section: string;
  data: string;
  isComplete: boolean;
}

interface PersonalData {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  county?: string;
  maritalStatus?: string;
  spouseName?: string;
  phoneNumber?: string;
  email?: string;
}

interface FamilyMember {
  name: string;
  relationship: string;
  dateOfBirth?: string;
  isMinor?: boolean;
  isDeceased?: boolean;
}

interface FamilyData {
  hasChildren?: boolean;
  children?: FamilyMember[];
  hasDependents?: boolean;
  dependents?: FamilyMember[];
  primaryBeneficiary?: string;
  primaryBeneficiaryRelationship?: string;
  alternateBeneficiary?: string;
  alternateBeneficiaryRelationship?: string;
  executor?: string;
  executorRelationship?: string;
  alternateExecutor?: string;
  alternateExecutorRelationship?: string;
  guardian?: string;
  guardianRelationship?: string;
  alternateGuardian?: string;
  trustee?: string;
  healthcareAgent?: string;
  healthcareAgentRelationship?: string;
  alternateHealthcareAgent?: string;
  financialAgent?: string;
  financialAgentRelationship?: string;
  alternateFinancialAgent?: string;
}

interface Asset {
  type: string;
  name: string;
  value?: number;
  description?: string;
}

interface AssetsData {
  realEstate?: Asset[];
  bankAccounts?: Asset[];
  investments?: Asset[];
  retirementAccounts?: Asset[];
  lifeInsurance?: Asset[];
  vehicles?: Asset[];
  businessInterests?: Asset[];
  personalProperty?: Asset[];
  estimatedTotalValue?: number;
}

interface GoalsData {
  primaryGoal?: string;
  distributionPreference?: string;
  charitableGiving?: boolean;
  charitableOrganizations?: string[];
  petCare?: boolean;
  pets?: Array<{ name: string; type: string; caretaker?: string }>;
  specialInstructions?: string;
  concernsAboutProbate?: boolean;
  wantsLivingTrust?: boolean;
  endOfLifeWishes?: string;
  organDonation?: string;
  funeralPreferences?: string;
}

function parseIntakeData(intakeSections: IntakeSection[]): {
  personal: PersonalData;
  family: FamilyData;
  assets: AssetsData;
  goals: GoalsData;
} {
  const result = {
    personal: {} as PersonalData,
    family: {} as FamilyData,
    assets: {} as AssetsData,
    goals: {} as GoalsData,
  };

  for (const section of intakeSections) {
    try {
      const data = JSON.parse(section.data);
      switch (section.section) {
        case "personal":
          result.personal = data;
          break;
        case "family":
          result.family = data;
          break;
        case "assets":
          result.assets = data;
          break;
        case "goals":
          result.goals = data;
          break;
      }
    } catch {
      console.error(`Failed to parse ${section.section} data`);
    }
  }

  return result;
}

// Document type display names
const documentTitles: Record<string, string> = {
  will: "Last Will and Testament",
  trust: "Revocable Living Trust",
  poa_financial: "Durable Power of Attorney for Finances",
  poa_healthcare: "Healthcare Power of Attorney",
  healthcare_directive: "Healthcare Directive (Living Will)",
  hipaa: "HIPAA Authorization",
};

// Build Claude Code prompt for document generation
function buildDocumentGenerationPrompt(
  documentType: string,
  intake: ReturnType<typeof parseIntakeData>
): string {
  const { personal, family, assets, goals } = intake;
  const state = personal.state || "California";
  const fullName = `${personal.firstName || ""} ${personal.middleName || ""} ${personal.lastName || ""}`.trim() || "[Client Name]";

  const documentTypePrompts: Record<string, string> = {
    will: `Generate a comprehensive Last Will and Testament for ${fullName}.

Requirements:
- State: ${state}
- Use proper legal language while keeping it readable
- Include all standard sections:
  * Declaration and revocation of prior wills
  * Family status declaration
  * Specific bequests (if any)
  * Residuary estate distribution
  * Executor appointment and powers
  * Guardian nomination (if minor children)
  * No-contest clause
  * Signature and witness blocks
- Include survivorship period (45 days recommended)
- Make sure to reference all named parties correctly`,

    trust: `Generate a comprehensive Revocable Living Trust for ${fullName}.

Requirements:
- State: ${state}
- Trust name: "The ${fullName} Revocable Living Trust"
- Include all standard sections:
  * Declaration and purpose
  * Grantor and trustee appointments
  * Trust property (Schedule A)
  * Revocability provisions
  * Incapacity provisions
  * Distribution provisions
  * Powers of trustee
  * Successor trustee provisions
  * Spendthrift clause
  * Governing law
  * Signature and notary blocks`,

    poa_financial: `Generate a comprehensive Durable Power of Attorney for Finances for ${fullName}.

Requirements:
- State: ${state}
- Make it "durable" (survives incapacity)
- Include comprehensive powers:
  * Real estate transactions
  * Banking and financial institution access
  * Investment management
  * Tax matters
  * Business operations
  * Insurance matters
  * Retirement accounts
  * Gift-giving authority (with limits)
- Include springing provisions (effective upon incapacity)
- Signature and notary blocks`,

    poa_healthcare: `Generate a comprehensive Healthcare Power of Attorney for ${fullName}.

Requirements:
- State: ${state}
- Include all standard sections:
  * Agent designation
  * Powers granted (consent, refuse, withdraw treatment)
  * Medical records access (HIPAA)
  * Facility admission authority
  * Organ donation preferences
  * Agent succession
  * Effective date provisions
- Signature and witness blocks`,

    healthcare_directive: `Generate a comprehensive Healthcare Directive (Living Will) for ${fullName}.

Requirements:
- State: ${state}
- Include clear directives for:
  * Terminal illness
  * Permanent unconsciousness
  * Advanced dementia/end-stage conditions
- Cover specific treatments:
  * CPR
  * Mechanical ventilation
  * Artificial nutrition/hydration
  * Dialysis
  * Antibiotics
- Include comfort care preferences
- Pain management preferences
- Organ donation preferences
- Signature and witness blocks`,

    hipaa: `Generate a comprehensive HIPAA Authorization for ${fullName}.

Requirements:
- State: ${state}
- Authorize release of all protected health information
- Include mental health, HIV/AIDS, and substance abuse records
- Designate healthcare agent as authorized recipient
- Include purpose (healthcare decision-making)
- No expiration unless revoked
- Signature block`,
  };

  return `You are an expert estate planning attorney assistant. Generate a high-quality legal document.

=== CLIENT INFORMATION ===

PERSONAL:
- Full Name: ${fullName}
- Address: ${personal.address || "[Address]"}, ${personal.city || "[City]"}, ${personal.state || "[State]"} ${personal.zipCode || "[ZIP]"}
- County: ${personal.county || "[County]"}
- Date of Birth: ${personal.dateOfBirth || "[DOB]"}
- Marital Status: ${personal.maritalStatus || "single"}
${personal.spouseName ? `- Spouse: ${personal.spouseName}` : ""}

FAMILY:
${family.children && family.children.length > 0
  ? `- Children: ${family.children.map(c => `${c.name}${c.isMinor ? " (minor)" : ""}`).join(", ")}`
  : "- No children"}
- Primary Beneficiary: ${family.primaryBeneficiary || "[Not specified]"} (${family.primaryBeneficiaryRelationship || "relationship"})
- Alternate Beneficiary: ${family.alternateBeneficiary || "[Not specified]"}
- Executor: ${family.executor || "[Not specified]"} (${family.executorRelationship || "relationship"})
- Alternate Executor: ${family.alternateExecutor || "[Not specified]"}
${family.guardian ? `- Guardian for minors: ${family.guardian}` : ""}
- Healthcare Agent: ${family.healthcareAgent || "[Not specified]"}
- Financial Agent: ${family.financialAgent || "[Not specified]"}

ASSETS:
${assets.estimatedTotalValue ? `- Estimated Total Value: $${assets.estimatedTotalValue.toLocaleString()}` : ""}
${assets.realEstate && assets.realEstate.length > 0 ? `- Real Estate: ${assets.realEstate.length} properties` : ""}
${assets.bankAccounts && assets.bankAccounts.length > 0 ? `- Bank Accounts: ${assets.bankAccounts.length} accounts` : ""}
${assets.investments && assets.investments.length > 0 ? `- Investments: ${assets.investments.length} accounts` : ""}
${assets.retirementAccounts && assets.retirementAccounts.length > 0 ? `- Retirement: ${assets.retirementAccounts.length} accounts` : ""}
${assets.lifeInsurance && assets.lifeInsurance.length > 0 ? `- Life Insurance: ${assets.lifeInsurance.length} policies` : ""}
${assets.businessInterests && assets.businessInterests.length > 0 ? `- Business Interests: ${assets.businessInterests.length}` : ""}

GOALS:
- Primary Goal: ${goals.primaryGoal || "Not specified"}
- Distribution Preference: ${goals.distributionPreference || "Not specified"}
${goals.charitableGiving ? `- Charitable Giving: Yes` : ""}
${goals.specialInstructions ? `- Special Instructions: ${goals.specialInstructions}` : ""}
${goals.endOfLifeWishes ? `- End-of-Life Wishes: ${goals.endOfLifeWishes}` : ""}
${goals.organDonation ? `- Organ Donation: ${goals.organDonation}` : ""}

=== DOCUMENT REQUEST ===

${documentTypePrompts[documentType] || documentTypePrompts.will}

=== OUTPUT REQUIREMENTS ===

1. Generate the complete document in Markdown format
2. Include a prominent DRAFT disclaimer at the top
3. Use proper legal language appropriate for ${state}
4. Include all necessary signature blocks, witness lines, and notary acknowledgments
5. Fill in all available information from above; use [PLACEHOLDER] for missing required info
6. Save the document to: /home/user/generated/${documentType}.md

Generate the document now.`;
}

// Main document generation action using Claude Code in E2B via API route
export const generateDocument = action({
  args: {
    estatePlanId: v.id("estatePlans"),
    documentType: documentTypeValidator,
    useAI: v.optional(v.boolean()), // kept for API compatibility, always uses Claude Code now
  },
  handler: async (ctx, args): Promise<{
    success: boolean;
    documentId?: string;
    content?: string;
    error?: string;
    runId?: string;
  }> => {
    // Create run record
    const runId: Id<"agentRuns"> = await ctx.runMutation(
      internal.mutations.createRun,
      { prompt: `Generate ${args.documentType} document for estate plan ${args.estatePlanId}` }
    );

    try {
      // Fetch intake data
      const intakeSections = await ctx.runQuery(
        internal.queries.getIntakeDataInternal,
        { estatePlanId: args.estatePlanId }
      );

      if (!intakeSections || intakeSections.length === 0) {
        await ctx.runMutation(internal.mutations.updateRun, {
          runId,
          status: "failed",
          error: "No intake data found",
        });
        return {
          success: false,
          error: "No intake data found. Please complete the intake questionnaire first.",
        };
      }

      // Parse intake data
      const intake = parseIntakeData(intakeSections as IntakeSection[]);

      // Update status to running
      await ctx.runMutation(internal.mutations.updateRun, {
        runId,
        status: "running",
      });

      // Build the prompt for Claude Code
      const prompt = buildDocumentGenerationPrompt(args.documentType, intake);

      // Call the Next.js API route for E2B execution
      const apiUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/e2b/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          outputFile: `${args.documentType}.md`,
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

      // Get content from file or parse from stdout
      let content = result.fileContent || "";

      if (!content || content.trim().length < 100) {
        // Try to extract content from stdout
        const markdownMatch = result.stdout?.match(/```markdown\n([\s\S]*?)\n```/);
        if (markdownMatch) {
          content = markdownMatch[1];
        } else {
          // Look for content after "# " (markdown header)
          const headerMatch = result.stdout?.match(/(# [A-Z][\s\S]*)/);
          if (headerMatch) {
            content = headerMatch[1];
          }
        }
      }

      if (!content || content.trim().length < 100) {
        throw new Error("Claude Code did not generate sufficient document content");
      }

      // Save the document to the database
      const documentId = await ctx.runMutation(
        internal.documentGenerationMutations.saveGeneratedDocument,
        {
          estatePlanId: args.estatePlanId,
          type: args.documentType,
          title: documentTitles[args.documentType] || "Legal Document",
          content,
          format: "markdown",
        }
      );

      // Update run as completed
      await ctx.runMutation(internal.mutations.updateRun, {
        runId,
        status: "completed",
        output,
      });

      return {
        success: true,
        documentId: documentId as string,
        content,
        runId: runId as string,
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
        error: error.message,
        runId: runId as string,
      };
    }
  },
});
