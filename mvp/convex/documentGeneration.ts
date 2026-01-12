/**
 * Document Generation Action
 *
 * This action generates legal documents by:
 * 1. Fetching intake data from the database
 * 2. Transforming it into the format needed by document templates
 * 3. Optionally using Claude to enhance/customize the document
 * 4. Saving the generated document to the database
 */

import { action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import Anthropic from "@anthropic-ai/sdk";

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

// Transform intake data to will format
function transformToWillData(intake: ReturnType<typeof parseIntakeData>) {
  const { personal, family, assets, goals } = intake;

  // Build children array
  const children = family.children?.map((child) => ({
    name: child.name,
    birthDate: child.dateOfBirth,
    isMinor: child.isMinor || false,
    isDeceased: child.isDeceased || false,
  })) || [];

  // Build specific bequests from assets
  const specificBequests: Array<{
    property: string;
    beneficiary: string;
    beneficiaryRelationship?: string;
    alternateBeneficiary?: string;
  }> = [];

  // Add major assets as specific bequests if there's a specific distribution plan
  if (goals.distributionPreference === "specific") {
    // Real estate
    assets.realEstate?.forEach((prop) => {
      specificBequests.push({
        property: prop.name || prop.description || "Real property",
        beneficiary: family.primaryBeneficiary || "[Beneficiary]",
        beneficiaryRelationship: family.primaryBeneficiaryRelationship,
      });
    });
  }

  // Build pets array
  const pets = goals.pets?.map((pet) => ({
    name: pet.name,
    type: pet.type,
    caretaker: pet.caretaker || family.primaryBeneficiary || "[Caretaker]",
  }));

  return {
    testatorFullName: `${personal.firstName || ""} ${personal.middleName || ""} ${personal.lastName || ""}`.trim() || "[Your Name]",
    testatorAddress: personal.address || "[Address]",
    testatorCity: personal.city || "[City]",
    testatorState: personal.state || "California",
    testatorCounty: personal.county || "[County]",
    maritalStatus: (personal.maritalStatus as "single" | "married" | "divorced" | "widowed" | "domestic_partnership") || "single",
    spouseName: personal.spouseName,
    children,
    pets,
    specificBequests,
    residuaryBeneficiary: family.primaryBeneficiary || "[Primary Beneficiary]",
    residuaryBeneficiaryRelationship: family.primaryBeneficiaryRelationship,
    alternateResiduaryBeneficiary: family.alternateBeneficiary,
    alternateResiduaryBeneficiaryRelationship: family.alternateBeneficiaryRelationship,
    executorName: family.executor || "[Executor Name]",
    executorRelationship: family.executorRelationship,
    alternateExecutorName: family.alternateExecutor,
    alternateExecutorRelationship: family.alternateExecutorRelationship,
    guardianName: family.guardian,
    guardianRelationship: family.guardianRelationship,
    alternateGuardianName: family.alternateGuardian,
    includeNoContestClause: true,
    survivorshipDays: 45,
  };
}

// Transform intake data to trust format
function transformToTrustData(intake: ReturnType<typeof parseIntakeData>) {
  const { personal, family, assets } = intake;

  const fullName = `${personal.firstName || ""} ${personal.middleName || ""} ${personal.lastName || ""}`.trim() || "[Your Name]";

  // Build trust property from assets
  const trustProperty: Array<{
    description: string;
    type: "real_estate" | "bank_account" | "investment" | "vehicle" | "business" | "personal_property" | "other";
    estimatedValue?: number;
  }> = [];

  assets.realEstate?.forEach((prop) => {
    trustProperty.push({
      description: prop.name || prop.description || "Real property",
      type: "real_estate",
      estimatedValue: prop.value,
    });
  });

  assets.bankAccounts?.forEach((acc) => {
    trustProperty.push({
      description: acc.name || acc.description || "Bank account",
      type: "bank_account",
      estimatedValue: acc.value,
    });
  });

  assets.investments?.forEach((inv) => {
    trustProperty.push({
      description: inv.name || inv.description || "Investment account",
      type: "investment",
      estimatedValue: inv.value,
    });
  });

  // Build beneficiaries
  const beneficiaries: Array<{
    name: string;
    relationship?: string;
    propertyDescription: string;
  }> = [];

  if (family.primaryBeneficiary) {
    beneficiaries.push({
      name: family.primaryBeneficiary,
      relationship: family.primaryBeneficiaryRelationship,
      propertyDescription: "Residuary trust property",
    });
  }

  return {
    trustName: `The ${fullName} Revocable Living Trust`,
    trustType: personal.maritalStatus === "married" ? "shared" as const : "individual" as const,
    grantorFullName: fullName,
    grantorAddress: personal.address || "[Address]",
    grantorCity: personal.city || "[City]",
    grantorState: personal.state || "California",
    grantorCounty: personal.county || "[County]",
    coGrantorFullName: personal.maritalStatus === "married" ? personal.spouseName : undefined,
    initialTrusteeName: fullName,
    initialTrusteeIsSameAsGrantor: true,
    successorTrusteeName: family.trustee || family.executor || "[Successor Trustee]",
    successorTrusteeRelationship: family.executorRelationship,
    incapacityDeterminer: "physician" as const,
    trustProperty,
    beneficiaries,
    residuaryBeneficiary: family.primaryBeneficiary || "[Primary Beneficiary]",
    residuaryBeneficiaryRelationship: family.primaryBeneficiaryRelationship,
    alternateResiduaryBeneficiary: family.alternateBeneficiary,
    survivorshipDays: 5,
    includeSpendthriftProvision: true,
    governingLaw: personal.state || "California",
  };
}

// Transform intake data to financial POA format
function transformToFinancialPOAData(intake: ReturnType<typeof parseIntakeData>) {
  const { personal, family } = intake;

  const fullName = `${personal.firstName || ""} ${personal.middleName || ""} ${personal.lastName || ""}`.trim() || "[Your Name]";

  return {
    principalFullName: fullName,
    principalAddress: personal.address || "[Address]",
    principalCity: personal.city || "[City]",
    principalState: personal.state || "California",
    principalCounty: personal.county || "[County]",
    agentName: family.financialAgent || family.executor || "[Agent Name]",
    agentRelationship: family.financialAgentRelationship || family.executorRelationship,
    alternateAgentName: family.alternateFinancialAgent || family.alternateExecutor,
    effectiveImmediately: false,
    springingPOA: true,
    powers: {
      realEstate: true,
      financialInstitutions: true,
      stocks: true,
      bonds: true,
      commodities: true,
      tangiblePersonalProperty: true,
      safeDepositBoxes: true,
      insurance: true,
      retirement: true,
      taxes: true,
      gifts: true,
      trusts: true,
      businessOperations: true,
      claims: true,
      government: true,
      allPowers: true,
    },
    allowGifts: true,
    giftLimitPerPerson: 17000, // Annual gift tax exclusion
    giftLimitPerYear: 50000,
    allowGiftsToAgent: false,
    agentCompensation: "reasonable" as const,
  };
}

// Transform intake data to healthcare POA format
function transformToHealthcarePOAData(intake: ReturnType<typeof parseIntakeData>) {
  const { personal, family, goals } = intake;

  const fullName = `${personal.firstName || ""} ${personal.middleName || ""} ${personal.lastName || ""}`.trim() || "[Your Name]";

  return {
    principalFullName: fullName,
    principalAddress: personal.address || "[Address]",
    principalCity: personal.city || "[City]",
    principalState: personal.state || "California",
    principalCounty: personal.county || "[County]",
    principalDateOfBirth: personal.dateOfBirth,
    agentName: family.healthcareAgent || "[Healthcare Agent]",
    agentRelationship: family.healthcareAgentRelationship,
    alternateAgentName: family.alternateHealthcareAgent,
    authorityStartsUpon: "incapacity" as const,
    powers: {
      consentToTreatment: true,
      refuseTreatment: true,
      withdrawTreatment: true,
      accessMedicalRecords: true,
      hireDischargeMedicalPersonnel: true,
      admitToFacilities: true,
      organDonation: goals.organDonation !== "no",
      autopsy: true,
      dispositionOfRemains: true,
    },
    lifeSustainingTreatment: "agent_decides" as const,
    artificialNutrition: "agent_decides" as const,
    organDonationPreference: (goals.organDonation === "yes" ? "yes" : goals.organDonation === "no" ? "no" : "agent_decides") as "yes" | "no" | "agent_decides",
    painManagement: "balanced" as const,
  };
}

// Transform intake data to healthcare directive format
function transformToHealthcareDirectiveData(intake: ReturnType<typeof parseIntakeData>) {
  const { personal, goals } = intake;

  const fullName = `${personal.firstName || ""} ${personal.middleName || ""} ${personal.lastName || ""}`.trim() || "[Your Name]";

  return {
    principalFullName: fullName,
    principalAddress: personal.address || "[Address]",
    principalCity: personal.city || "[City]",
    principalState: personal.state || "California",
    principalCounty: personal.county || "[County]",
    principalDateOfBirth: personal.dateOfBirth,
    conditions: {
      terminalIllness: true,
      permanentUnconsciousness: true,
      advancedDementia: true,
      endStageCondition: true,
    },
    lifeSustainingTreatment: {
      cardiopulmonaryResuscitation: "trial" as const,
      mechanicalVentilation: "trial" as const,
      artificialNutrition: "trial" as const,
      artificialHydration: "yes" as const,
      dialysis: "trial" as const,
      antibiotics: "yes" as const,
      bloodTransfusions: "yes" as const,
    },
    comfortCare: {
      painMedication: true,
      hospiceCare: true,
      spiritualCare: true,
      familyPresence: true,
      musicOrReadings: true,
    },
    painManagement: "maximum_comfort" as const,
    careLocation: "home" as const,
    organDonation: (goals.organDonation === "yes" ? "full" : goals.organDonation === "no" ? "none" : "full") as "full" | "limited" | "none" | "research_only",
    allowAutopsy: "if_required" as const,
    bodyDisposition: (goals.funeralPreferences?.includes("cremat") ? "cremation" : "burial") as "burial" | "cremation" | "donation_to_science" | "agent_decides",
    additionalInstructions: goals.endOfLifeWishes,
  };
}

// Main document generation action
export const generateDocument = action({
  args: {
    estatePlanId: v.id("estatePlans"),
    documentType: documentTypeValidator,
    useAI: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<{
    success: boolean;
    documentId?: string;
    content?: string;
    error?: string;
  }> => {
    try {
      // Fetch intake data
      const intakeSections = await ctx.runQuery(
        internal.queries.getIntakeDataInternal,
        { estatePlanId: args.estatePlanId }
      );

      if (!intakeSections || intakeSections.length === 0) {
        return {
          success: false,
          error: "No intake data found. Please complete the intake questionnaire first.",
        };
      }

      // Parse intake data
      const intake = parseIntakeData(intakeSections as IntakeSection[]);

      // Import and generate document based on type
      let content: string;
      let title: string;

      // Dynamic import of templates (these are Node.js modules)
      // Note: In a real implementation, you'd import these at the top
      // For now, we'll generate the content inline based on the type

      switch (args.documentType) {
        case "will": {
          const willData = transformToWillData(intake);
          // We'll call Claude to generate the will if useAI is true
          if (args.useAI) {
            content = await generateWithClaude(args.documentType, willData, intake);
          } else {
            // Use template directly - in production, import the actual template
            content = generateWillContent(willData);
          }
          title = "Last Will and Testament";
          break;
        }

        case "trust": {
          const trustData = transformToTrustData(intake);
          if (args.useAI) {
            content = await generateWithClaude(args.documentType, trustData, intake);
          } else {
            content = generateTrustContent(trustData);
          }
          title = "Revocable Living Trust";
          break;
        }

        case "poa_financial": {
          const poaData = transformToFinancialPOAData(intake);
          if (args.useAI) {
            content = await generateWithClaude(args.documentType, poaData, intake);
          } else {
            content = generateFinancialPOAContent(poaData);
          }
          title = "Durable Power of Attorney for Finances";
          break;
        }

        case "poa_healthcare": {
          const hcPoaData = transformToHealthcarePOAData(intake);
          if (args.useAI) {
            content = await generateWithClaude(args.documentType, hcPoaData, intake);
          } else {
            content = generateHealthcarePOAContent(hcPoaData);
          }
          title = "Healthcare Power of Attorney";
          break;
        }

        case "healthcare_directive": {
          const directiveData = transformToHealthcareDirectiveData(intake);
          if (args.useAI) {
            content = await generateWithClaude(args.documentType, directiveData, intake);
          } else {
            content = generateHealthcareDirectiveContent(directiveData);
          }
          title = "Healthcare Directive (Living Will)";
          break;
        }

        case "hipaa": {
          content = generateHIPAAContent(intake);
          title = "HIPAA Authorization";
          break;
        }

        default:
          return {
            success: false,
            error: `Document type '${args.documentType}' is not yet supported.`,
          };
      }

      // Save the document
      const documentId = await ctx.runMutation(internal.documentGeneration.saveGeneratedDocument, {
        estatePlanId: args.estatePlanId,
        type: args.documentType,
        title,
        content,
        format: "markdown",
      });

      return {
        success: true,
        documentId: documentId as string,
        content,
      };
    } catch (error) {
      console.error("Document generation error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate document",
      };
    }
  },
});

// Claude-enhanced generation
async function generateWithClaude(
  documentType: string,
  templateData: Record<string, unknown>,
  intake: ReturnType<typeof parseIntakeData>
): Promise<string> {
  const anthropic = new Anthropic();

  const prompts: Record<string, string> = {
    will: `Generate a comprehensive Last Will and Testament based on the following information.
Use proper legal language while keeping it readable. Include all standard sections (declaration,
revocation, family status, property distribution, executor appointment, powers, and signature blocks).

User Information:
${JSON.stringify(templateData, null, 2)}

State: ${intake.personal.state || "California"}

Important:
- Include a prominent disclaimer that this is a draft for review
- Use clear, unambiguous language
- Include all necessary legal clauses (survivorship, severability, no-contest if applicable)
- Format in markdown with clear section headers`,

    trust: `Generate a comprehensive Revocable Living Trust document based on the following information.
Include all standard sections (declaration, trustees, powers, incapacity provisions, distribution,
and execution blocks).

User Information:
${JSON.stringify(templateData, null, 2)}

State: ${intake.personal.state || "California"}

Important:
- Include a prominent disclaimer that this is a draft for review
- Include Schedule A for trust property
- Include provisions for incapacity management
- Format in markdown with clear section headers`,

    poa_financial: `Generate a comprehensive Durable Power of Attorney for Finances based on the following information.
Include all standard sections (designation, powers, limitations, duties, and signature blocks).

User Information:
${JSON.stringify(templateData, null, 2)}

State: ${intake.personal.state || "California"}

Important:
- Include a prominent disclaimer that this is a draft for review
- Make it a "durable" power of attorney that survives incapacity
- Include comprehensive powers listing
- Format in markdown with clear section headers`,

    poa_healthcare: `Generate a comprehensive Healthcare Power of Attorney based on the following information.
Include sections for agent designation, authority, and medical decision-making preferences.

User Information:
${JSON.stringify(templateData, null, 2)}

State: ${intake.personal.state || "California"}

Important:
- Include a prominent disclaimer that this is a draft for review
- Include HIPAA authorization language
- Format in markdown with clear section headers`,

    healthcare_directive: `Generate a comprehensive Healthcare Directive (Living Will) based on the following information.
Include sections for treatment preferences, comfort care, and end-of-life wishes.

User Information:
${JSON.stringify(templateData, null, 2)}

State: ${intake.personal.state || "California"}

Important:
- Include a prominent disclaimer that this is a draft for review
- Include clear treatment choice tables
- Format in markdown with clear section headers`,
  };

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    messages: [
      {
        role: "user",
        content: prompts[documentType] || prompts.will,
      },
    ],
  });

  const textContent = message.content.find((block) => block.type === "text");
  return textContent ? textContent.text : "Error generating document";
}

// Fallback content generators (simplified versions)
function generateWillContent(data: ReturnType<typeof transformToWillData>): string {
  return `
# LAST WILL AND TESTAMENT

## OF ${data.testatorFullName.toUpperCase()}

---

**IMPORTANT NOTICE:** This document is a DRAFT for review purposes only.

---

## PART 1: DECLARATION

I, **${data.testatorFullName}**, a resident of ${data.testatorCity}, ${data.testatorCounty} County, ${data.testatorState}, being of sound mind, declare this to be my Last Will and Testament.

## PART 2: REVOCATION

I revoke all previous wills and codicils.

## PART 3: FAMILY

Marital Status: ${data.maritalStatus}
${data.spouseName ? `Spouse: ${data.spouseName}` : ""}
${data.children.length > 0 ? `Children: ${data.children.map(c => c.name).join(", ")}` : "No children"}

## PART 4: RESIDUARY ESTATE

I give all remaining property to **${data.residuaryBeneficiary}** (${data.residuaryBeneficiaryRelationship || "beneficiary"}).

## PART 5: EXECUTOR

I appoint **${data.executorName}** as Executor.
${data.alternateExecutorName ? `Alternate: ${data.alternateExecutorName}` : ""}

## SIGNATURE

Date: ____________________

_______________________________
${data.testatorFullName}

## WITNESSES

Witness 1: _______________________ Date: ________
Witness 2: _______________________ Date: ________
`;
}

function generateTrustContent(data: ReturnType<typeof transformToTrustData>): string {
  return `
# REVOCABLE LIVING TRUST

## ${data.trustName.toUpperCase()}

---

**IMPORTANT NOTICE:** This document is a DRAFT for review purposes only.

---

## DECLARATION

I, **${data.grantorFullName}**, create this revocable living trust.

## TRUSTEE

Initial Trustee: ${data.grantorFullName}
Successor Trustee: ${data.successorTrusteeName}

## BENEFICIARIES

Residuary Beneficiary: ${data.residuaryBeneficiary}

## SCHEDULE A: TRUST PROPERTY

${data.trustProperty.map((p, i) => `${i + 1}. ${p.description} (${p.type})`).join("\n")}

## SIGNATURE

Date: ____________________

_______________________________
${data.grantorFullName}, Grantor

[NOTARY ACKNOWLEDGMENT]
`;
}

function generateFinancialPOAContent(data: ReturnType<typeof transformToFinancialPOAData>): string {
  return `
# DURABLE POWER OF ATTORNEY FOR FINANCES

---

**IMPORTANT NOTICE:** This document is a DRAFT for review purposes only.

---

## PRINCIPAL

I, **${data.principalFullName}**, appoint:

## AGENT

**${data.agentName}**${data.agentRelationship ? ` (${data.agentRelationship})` : ""}

## POWERS GRANTED

${data.powers.allPowers ? "All financial powers are granted." : "Specific powers as marked."}

## EFFECTIVE DATE

${data.springingPOA ? "This POA becomes effective upon my incapacity." : "This POA is effective immediately."}

## SIGNATURE

Date: ____________________

_______________________________
${data.principalFullName}

[NOTARY ACKNOWLEDGMENT]
`;
}

function generateHealthcarePOAContent(data: ReturnType<typeof transformToHealthcarePOAData>): string {
  return `
# HEALTHCARE POWER OF ATTORNEY

---

**IMPORTANT NOTICE:** This document is a DRAFT for review purposes only.

---

## PRINCIPAL

I, **${data.principalFullName}**, designate:

## HEALTHCARE AGENT

**${data.agentName}**${data.agentRelationship ? ` (${data.agentRelationship})` : ""}

## AUTHORITY

My agent may make all healthcare decisions for me when I cannot make them myself.

## SIGNATURE

Date: ____________________

_______________________________
${data.principalFullName}

## WITNESSES

Witness 1: _______________________ Date: ________
Witness 2: _______________________ Date: ________
`;
}

function generateHealthcareDirectiveContent(data: ReturnType<typeof transformToHealthcareDirectiveData>): string {
  return `
# HEALTHCARE DIRECTIVE (LIVING WILL)

---

**IMPORTANT NOTICE:** This document is a DRAFT for review purposes only.

---

## DECLARATION

I, **${data.principalFullName}**, make this directive about my healthcare.

## CONDITIONS

This directive applies when I have a terminal illness or am permanently unconscious.

## TREATMENT PREFERENCES

- CPR: ${data.lifeSustainingTreatment.cardiopulmonaryResuscitation}
- Mechanical Ventilation: ${data.lifeSustainingTreatment.mechanicalVentilation}
- Artificial Nutrition: ${data.lifeSustainingTreatment.artificialNutrition}

## COMFORT CARE

I always want comfort care to relieve pain and suffering.

## ORGAN DONATION

Preference: ${data.organDonation}

## SIGNATURE

Date: ____________________

_______________________________
${data.principalFullName}

## WITNESSES

Witness 1: _______________________ Date: ________
Witness 2: _______________________ Date: ________
`;
}

function generateHIPAAContent(intake: ReturnType<typeof parseIntakeData>): string {
  const fullName = `${intake.personal.firstName || ""} ${intake.personal.lastName || ""}`.trim() || "[Your Name]";
  const agent = intake.family.healthcareAgent || "[Healthcare Agent]";

  return `
# HIPAA AUTHORIZATION

## Authorization for Release of Health Information

---

**IMPORTANT NOTICE:** This document is a DRAFT for review purposes only.

---

## PATIENT INFORMATION

Name: **${fullName}**
Date of Birth: ${intake.personal.dateOfBirth || "[DOB]"}
Address: ${intake.personal.address || "[Address]"}, ${intake.personal.city || "[City]"}, ${intake.personal.state || "[State]"}

## AUTHORIZED PERSON

I authorize my healthcare providers to release my protected health information to:

**${agent}**

## SCOPE OF AUTHORIZATION

This authorization covers all of my medical records, including but not limited to:
- Medical history and physical examinations
- Test results and diagnostic imaging
- Treatment plans and progress notes
- Mental health records
- HIV/AIDS-related information
- Substance abuse treatment records

## PURPOSE

This information may be used for healthcare decision-making and coordination of care.

## EXPIRATION

This authorization does not expire unless revoked in writing.

## SIGNATURE

Date: ____________________

_______________________________
${fullName}

---

**Note:** You have the right to revoke this authorization at any time by providing written notice to your healthcare providers.
`;
}

// Internal query for intake data
// This needs to be added to queries.ts as an internal query
