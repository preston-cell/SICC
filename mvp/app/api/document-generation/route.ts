import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth-helper";
import { prisma } from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";

// Extend Vercel function timeout
export const maxDuration = 300;

interface IntakeData {
  personal?: {
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
  };
  family?: {
    // Children from form (firstName/lastName format)
    hasChildren?: boolean;
    children?: Array<{
      firstName?: string;
      lastName?: string;
      name?: string; // Legacy format
      dateOfBirth?: string;
      relationship?: string;
      isMinor?: boolean;
      hasSpecialNeeds?: boolean;
      specialNeedsDetails?: string;
    }>;
    // Spouse info
    hasSpouse?: boolean;
    spouseFirstName?: string;
    spouseLastName?: string;
    // Guardian info
    guardianName?: string;
    guardianRelationship?: string;
    alternateGuardianName?: string;
    // Legacy fields
    primaryBeneficiary?: string;
    primaryBeneficiaryRelationship?: string;
    alternateBeneficiary?: string;
    executor?: string;
    executorRelationship?: string;
    alternateExecutor?: string;
    guardian?: string;
    healthcareAgent?: string;
    financialAgent?: string;
  };
  assets?: {
    realEstate?: Array<{ name?: string; address?: string; value?: number; estimatedValue?: number }>;
    bankAccounts?: Array<{ name?: string; institution?: string; accountType?: string }>;
    investments?: Array<{ name?: string; institution?: string; accountType?: string }>;
    retirementAccounts?: Array<{ name?: string; institution?: string; accountType?: string }>;
    lifeInsurance?: Array<{ name?: string; company?: string; policyType?: string; deathBenefit?: number }>;
    businessInterests?: Array<{ name?: string; businessName?: string; ownershipPercentage?: number }>;
    estimatedTotalValue?: number;
  };
  goals?: {
    primaryGoal?: string;
    distributionPreference?: string;
    charitableGiving?: boolean;
    specialInstructions?: string;
    endOfLifeWishes?: string;
    organDonation?: string;
  };
}

// State code to full name mapping
const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "District of Columbia",
};

// Build document generation prompt
function buildDocumentGenerationPrompt(
  documentType: string,
  intake: IntakeData
): string {
  const { personal = {}, family = {}, assets = {}, goals = {} } = intake;
  // Convert 2-letter state code to full name, fallback to the value itself if it's already a full name
  const stateCode = personal.state || "";
  const state = STATE_NAMES[stateCode] || stateCode || "California";
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
- Address: ${personal.address || "[Address]"}, ${personal.city || "[City]"}, ${state} ${personal.zipCode || "[ZIP]"}
- County: ${personal.county || "[County]"}
- Date of Birth: ${personal.dateOfBirth || "[DOB]"}
- Marital Status: ${personal.maritalStatus || "single"}
${personal.spouseName ? `- Spouse: ${personal.spouseName}` : ""}

FAMILY:
${family.hasSpouse && (family.spouseFirstName || family.spouseLastName)
  ? `- Spouse: ${family.spouseFirstName || ""} ${family.spouseLastName || ""}`.trim()
  : ""}
${family.children && family.children.length > 0
  ? `- Children: ${family.children.map(c => {
      const childName = c.name || `${c.firstName || ""} ${c.lastName || ""}`.trim() || "[Name]";
      const minorStatus = c.isMinor ? " (minor)" : "";
      const specialNeeds = c.hasSpecialNeeds ? " (special needs)" : "";
      return `${childName}${minorStatus}${specialNeeds}`;
    }).join(", ")}`
  : "- No children"}
${family.guardianName ? `- Guardian for minors: ${family.guardianName}${family.guardianRelationship ? ` (${family.guardianRelationship})` : ""}` : ""}
${family.alternateGuardianName ? `- Alternate Guardian: ${family.alternateGuardianName}` : ""}
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

=== FORMATTING REQUIREMENTS ===

CRITICAL - DO NOT USE:
- Horizontal rules (---, ***, ___) - NEVER use these
- HTML tags like <br>, <hr>, or any other HTML
- Tables or table-like formatting
- Any markdown that creates lines across the page

INSTEAD USE:
- Blank lines between sections for visual separation
- Proper heading hierarchy (# for title, ## for major sections, ### for subsections)
- For signature lines, use this exact format with text labels:

Signature: ________________________________________

Print Name: ________________________________________

Date: ________________________________________

- Always have TWO blank lines before major section headings
- Keep the document clean and professional with no decorative lines

Generate the complete document now.`;
}

export async function POST(req: NextRequest) {
  try {
    // Require auth or session for document generation
    const authContext = await getAuthContext(req);
    if (!authContext.userId && !authContext.sessionId) {
      return NextResponse.json(
        { error: "Authentication or session required" },
        { status: 401 }
      );
    }

    const { documentType, intakeData: providedIntakeData, estatePlanId } = await req.json();

    if (!documentType) {
      return NextResponse.json({ error: "Document type is required" }, { status: 400 });
    }

    // Get intake data - either from request or fetch from database
    let intakeData: IntakeData = providedIntakeData || {};

    if (!providedIntakeData && estatePlanId) {
      // Fetch intake data from database
      const sections = await prisma.intakeData.findMany({
        where: { estatePlanId },
        select: { section: true, data: true }
      });

      for (const section of sections) {
        try {
          const parsed = JSON.parse(section.data);
          intakeData[section.section as keyof IntakeData] = parsed;
        } catch {
          // Skip unparseable sections
        }
      }

      // Also fetch guided intake data if available
      const guidedProgress = await prisma.guidedIntakeProgress.findFirst({
        where: { estatePlanId },
        select: { stepData: true }
      });

      if (guidedProgress?.stepData) {
        // stepData is already a JSON object from Prisma, structured as { "1": {...}, "2": {...} }
        const stepDataObj = guidedProgress.stepData as Record<string, Record<string, unknown>>;

        // Combine all step data into a flat object
        const flatData: Record<string, unknown> = {};
        for (const stepData of Object.values(stepDataObj)) {
          if (stepData && typeof stepData === 'object') {
            Object.assign(flatData, stepData);
          }
        }

        // Map flat guided data to IntakeData structure
        if (Object.keys(flatData).length > 0) {
          // Personal info
          intakeData.personal = {
            ...intakeData.personal,
            firstName: flatData.firstName as string,
            lastName: flatData.lastName as string,
            middleName: flatData.middleName as string,
            dateOfBirth: flatData.dateOfBirth as string,
            address: flatData.address as string,
            city: flatData.city as string,
            state: flatData.state as string,
            zipCode: flatData.zipCode as string,
            county: flatData.county as string,
            maritalStatus: flatData.maritalStatus as string,
            spouseName: flatData.spouseName as string,
          };

          // Family info
          intakeData.family = {
            ...intakeData.family,
            hasSpouse: flatData.maritalStatus === 'married',
            spouseFirstName: flatData.spouseFirstName as string,
            spouseLastName: flatData.spouseLastName as string,
            hasChildren: flatData.hasChildren as boolean,
            children: flatData.children as Array<{
              firstName?: string;
              lastName?: string;
              name?: string;
              dateOfBirth?: string;
              relationship?: string;
              isMinor?: boolean;
              hasSpecialNeeds?: boolean;
              specialNeedsDetails?: string;
            }>,
            guardianName: flatData.guardianName as string,
            guardianRelationship: flatData.guardianRelationship as string,
            alternateGuardianName: flatData.alternateGuardianName as string,
            primaryBeneficiary: flatData.primaryBeneficiary as string,
            primaryBeneficiaryRelationship: flatData.primaryBeneficiaryRelationship as string,
            alternateBeneficiary: flatData.alternateBeneficiary as string,
            executor: flatData.executor as string,
            executorRelationship: flatData.executorRelationship as string,
            alternateExecutor: flatData.alternateExecutor as string,
            healthcareAgent: flatData.healthcareAgent as string,
            financialAgent: flatData.financialAgent as string,
          };

          // Assets info
          if (flatData.realEstate || flatData.bankAccounts || flatData.investments ||
              flatData.retirementAccounts || flatData.estimatedTotalValue) {
            intakeData.assets = {
              ...intakeData.assets,
              realEstate: flatData.realEstate as Array<{ name?: string; address?: string; value?: number; estimatedValue?: number }>,
              bankAccounts: flatData.bankAccounts as Array<{ name?: string; institution?: string; accountType?: string }>,
              investments: flatData.investments as Array<{ name?: string; institution?: string; accountType?: string }>,
              retirementAccounts: flatData.retirementAccounts as Array<{ name?: string; institution?: string; accountType?: string }>,
              lifeInsurance: flatData.lifeInsurance as Array<{ name?: string; company?: string; policyType?: string; deathBenefit?: number }>,
              businessInterests: flatData.businessInterests as Array<{ name?: string; businessName?: string; ownershipPercentage?: number }>,
              estimatedTotalValue: flatData.estimatedTotalValue as number,
            };
          }

          // Goals info
          if (flatData.primaryGoal || flatData.distributionPreference || flatData.specialInstructions) {
            intakeData.goals = {
              ...intakeData.goals,
              primaryGoal: flatData.primaryGoal as string,
              distributionPreference: flatData.distributionPreference as string,
              charitableGiving: flatData.charitableGiving as boolean,
              specialInstructions: flatData.specialInstructions as string,
              endOfLifeWishes: flatData.endOfLifeWishes as string,
              organDonation: flatData.organDonation as string,
            };
          }
        }
      }
    }

    if (!intakeData || Object.keys(intakeData).length === 0) {
      return NextResponse.json({ error: "Intake data is required. Please complete the intake questionnaire first." }, { status: 400 });
    }

    // Build the prompt
    const prompt = buildDocumentGenerationPrompt(documentType, intakeData);

    // Use direct Anthropic API call for document generation
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    console.log("API Key check - exists:", !!anthropicApiKey, "length:", anthropicApiKey?.length, "starts with sk-ant:", anthropicApiKey?.startsWith("sk-ant"));

    if (!anthropicApiKey) {
      return NextResponse.json({ error: "Anthropic API key not configured" }, { status: 500 });
    }

    const anthropic = new Anthropic({ apiKey: anthropicApiKey.trim() });

    // Call Claude API directly
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract text content from the response
    let content = "";
    for (const block of message.content) {
      if (block.type === "text") {
        content += block.text;
      }
    }

    if (!content) {
      content = "Document generation completed but content could not be extracted. Please try again.";
    }

    return NextResponse.json({
      success: true,
      content,
    });

  } catch (error) {
    console.error("Document generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
