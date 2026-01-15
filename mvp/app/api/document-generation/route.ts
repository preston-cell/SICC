import { NextResponse } from "next/server";

// Extend Vercel function timeout
export const maxDuration = 300;

const E2B_API_URL = "/api/e2b/execute";

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
    children?: Array<{ name: string; isMinor?: boolean }>;
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
    realEstate?: Array<{ name: string; value?: number }>;
    bankAccounts?: Array<{ name: string }>;
    investments?: Array<{ name: string }>;
    retirementAccounts?: Array<{ name: string }>;
    lifeInsurance?: Array<{ name: string }>;
    businessInterests?: Array<{ name: string }>;
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

// Build document generation prompt
function buildDocumentGenerationPrompt(
  documentType: string,
  intake: IntakeData
): string {
  const { personal = {}, family = {}, assets = {}, goals = {} } = intake;
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

  return `IMPORTANT: First, read the skill file at /home/user/.claude/skills/estate-document-analyzer/SKILL.md to understand document generation best practices.

You are an expert estate planning attorney assistant. Generate a high-quality legal document.

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
6. CRITICAL: Use the Write tool to save the document to: /home/user/generated/${documentType}.md

Generate the document now and save it using the Write tool.`;
}

export async function POST(req: Request) {
  try {
    const { documentType, intakeData } = await req.json();

    if (!documentType) {
      return NextResponse.json({ error: "Document type is required" }, { status: 400 });
    }

    if (!intakeData) {
      return NextResponse.json({ error: "Intake data is required" }, { status: 400 });
    }

    // Build the prompt
    const prompt = buildDocumentGenerationPrompt(documentType, intakeData);

    // Get the base URL for the E2B API
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    // Call the E2B execute endpoint with extended timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 minutes

    let response;
    try {
      response = await fetch(`${baseUrl}${E2B_API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          outputFile: `${documentType}.md`,
          timeoutMs: 0, // Disable E2B command timeout
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`E2B API call failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "E2B execution failed");
    }

    // Get the document content from fileContent or stdout
    let content = result.fileContent || "";

    // If no fileContent, try to extract from stdout
    if (!content && result.stdout) {
      // Look for markdown content in stdout
      const mdMatch = result.stdout.match(/```markdown\n([\s\S]*?)\n```/) ||
                      result.stdout.match(/```md\n([\s\S]*?)\n```/) ||
                      result.stdout.match(/# DRAFT[\s\S]*/);
      if (mdMatch) {
        content = mdMatch[1] || mdMatch[0];
      }
    }

    if (!content) {
      content = "Document generation completed but content could not be extracted. Please try again.";
    }

    return NextResponse.json({
      success: true,
      content,
      stdout: result.stdout,
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
