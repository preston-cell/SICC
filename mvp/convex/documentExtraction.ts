"use node";

/**
 * Document Extraction Action
 *
 * Extracts intake form data from uploaded estate planning documents.
 * This enables the "document-first" flow where users upload documents
 * before filling out the intake questionnaire, and the system auto-fills
 * form fields based on extracted information.
 *
 * Note: Only the action is in this file. Queries and mutations are in
 * extractedData.ts because they cannot be in "use node" files.
 */

import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import Anthropic from "@anthropic-ai/sdk";

// ============================================
// TYPES
// ============================================

interface ExtractedPersonalData {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  maritalStatus?: string;
  occupation?: string;
}

interface ExtractedFamilyData {
  spouseFirstName?: string;
  spouseLastName?: string;
  spouseDateOfBirth?: string;
  children?: Array<{
    name: string;
    dateOfBirth?: string;
    relationship?: string;
    isMinor?: boolean;
    hasSpecialNeeds?: boolean;
  }>;
  otherDependents?: string[];
}

interface ExtractedAssetData {
  realEstate?: Array<{
    address?: string;
    estimatedValue?: string;
    ownership?: string;
  }>;
  bankAccounts?: Array<{
    institution?: string;
    accountType?: string;
    estimatedValue?: string;
  }>;
  investmentAccounts?: Array<{
    institution?: string;
    accountType?: string;
    estimatedValue?: string;
  }>;
  retirementAccounts?: Array<{
    institution?: string;
    accountType?: string;
    estimatedValue?: string;
  }>;
  lifeInsurance?: Array<{
    company?: string;
    policyType?: string;
    faceValue?: string;
  }>;
  businessInterests?: Array<{
    name?: string;
    type?: string;
    ownershipPercentage?: string;
  }>;
  estimatedTotalValue?: string;
}

interface ExtractedExistingDocuments {
  hasWill?: boolean;
  willYear?: string;
  willAttorney?: string;
  hasTrust?: boolean;
  trustType?: string;
  trustYear?: string;
  hasPOAFinancial?: boolean;
  poaFinancialAgent?: string;
  hasPOAHealthcare?: boolean;
  poaHealthcareAgent?: string;
  hasHealthcareDirective?: boolean;
  hasHIPAA?: boolean;
}

interface ExtractedGoalsData {
  executor?: string;
  alternateExecutor?: string;
  trustee?: string;
  guardian?: string;
  alternateGuardian?: string;
  primaryBeneficiary?: string;
  contingentBeneficiary?: string;
  charitableGiving?: boolean;
  specialInstructions?: string;
}

interface ExtractionResult {
  personal?: ExtractedPersonalData;
  family?: ExtractedFamilyData;
  assets?: ExtractedAssetData;
  existingDocuments?: ExtractedExistingDocuments;
  goals?: ExtractedGoalsData;
  overallConfidence: number;
  sourceDocuments: string[];
  extractionNotes: string[];
}

interface UploadedDocument {
  _id: Id<"uploadedDocuments">;
  fileName: string;
  documentType: string;
  storageId: Id<"_storage">;
  mimeType: string;
  extractedText?: string;
}

// ============================================
// MAIN EXTRACTION ACTION
// ============================================

export const extractIntakeData = action({
  args: {
    estatePlanId: v.id("estatePlans"),
  },
  handler: async (ctx, { estatePlanId }): Promise<{
    success: boolean;
    extractionResult?: ExtractionResult;
    error?: string;
  }> => {
    try {
      // Get all uploaded documents for this estate plan
      const documents = await ctx.runQuery(
        internal.extractedData.getDocumentsForExtraction,
        { estatePlanId }
      ) as UploadedDocument[];

      if (!documents || documents.length === 0) {
        return {
          success: false,
          error: "No documents found for extraction",
        };
      }

      // Collect text from all documents
      const documentTexts: Array<{ fileName: string; documentType: string; text: string }> = [];

      for (const doc of documents) {
        let text = doc.extractedText;

        // If text wasn't previously extracted, extract it now
        if (!text) {
          const fileUrl = await ctx.storage.getUrl(doc.storageId);
          if (fileUrl) {
            const response = await fetch(fileUrl);
            const arrayBuffer = await response.arrayBuffer();
            const base64Content = Buffer.from(arrayBuffer).toString("base64");
            text = await extractTextFromDocument(base64Content, doc.mimeType);
          }
        }

        if (text) {
          documentTexts.push({
            fileName: doc.fileName,
            documentType: doc.documentType,
            text,
          });
        }
      }

      if (documentTexts.length === 0) {
        return {
          success: false,
          error: "Could not extract text from any documents",
        };
      }

      // Run extraction analysis
      const extractionResult = await runIntakeExtraction(documentTexts);

      // Save extracted data for each section that has data
      const sections = ["personal", "family", "assets", "existing_documents", "goals"] as const;
      const documentIds = documents.map((d) => d._id);

      for (const section of sections) {
        const sectionData = getSectionData(extractionResult, section);
        if (sectionData && Object.keys(sectionData).length > 0) {
          await ctx.runMutation(
            internal.extractedData.saveExtractedData,
            {
              estatePlanId,
              section,
              extractedData: JSON.stringify(sectionData),
              sourceDocumentIds: documentIds,
              confidence: extractionResult.overallConfidence,
            }
          );
        }
      }

      return {
        success: true,
        extractionResult,
      };
    } catch (error) {
      console.error("Document extraction error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function getSectionData(
  result: ExtractionResult,
  section: "personal" | "family" | "assets" | "existing_documents" | "goals"
): Record<string, unknown> | undefined {
  switch (section) {
    case "personal":
      return result.personal as Record<string, unknown> | undefined;
    case "family":
      return result.family as Record<string, unknown> | undefined;
    case "assets":
      return result.assets as Record<string, unknown> | undefined;
    case "existing_documents":
      return result.existingDocuments as Record<string, unknown> | undefined;
    case "goals":
      return result.goals as Record<string, unknown> | undefined;
    default:
      return undefined;
  }
}

async function extractTextFromDocument(
  base64Content: string,
  mimeType: string
): Promise<string> {
  const anthropic = new Anthropic();

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: mimeType as "application/pdf",
              data: base64Content,
            },
          },
          {
            type: "text",
            text: `Extract ALL text from this legal document. Preserve structure and important details including:
1. Names of all parties (testator, grantor, trustees, executors, beneficiaries, agents)
2. Dates (execution date, birth dates mentioned)
3. Addresses and contact information
4. Asset descriptions and values
5. Family relationships mentioned
6. Specific bequests and distributions
7. Signature blocks

Format as plain text with clear section breaks.`,
          },
        ],
      },
    ],
  });

  const textContent = message.content.find((block) => block.type === "text");
  return textContent?.text || "";
}

async function runIntakeExtraction(
  documents: Array<{ fileName: string; documentType: string; text: string }>
): Promise<ExtractionResult> {
  const anthropic = new Anthropic();

  // Combine all document texts
  const combinedText = documents
    .map((d) => `=== DOCUMENT: ${d.fileName} (${d.documentType}) ===\n${d.text}`)
    .join("\n\n");

  const prompt = `You are an expert estate planning document analyzer. Extract personal and estate planning information from the following documents to pre-fill an intake questionnaire.

DOCUMENTS:
${combinedText.substring(0, 80000)}${combinedText.length > 80000 ? "\n\n[Documents truncated...]" : ""}

---

Extract all relevant information and return a JSON object with the following structure:

{
  "personal": {
    "firstName": "First name of the document creator/testator/grantor",
    "lastName": "Last name",
    "dateOfBirth": "Date of birth if found (ISO format YYYY-MM-DD)",
    "address": "Street address",
    "city": "City",
    "state": "State (2-letter code)",
    "zipCode": "ZIP code",
    "phone": "Phone number if found",
    "email": "Email if found",
    "maritalStatus": "married, single, divorced, or widowed",
    "occupation": "Occupation if mentioned"
  },
  "family": {
    "spouseFirstName": "Spouse's first name if married",
    "spouseLastName": "Spouse's last name",
    "spouseDateOfBirth": "Spouse's DOB if found",
    "children": [
      {
        "name": "Full name",
        "dateOfBirth": "DOB if known",
        "relationship": "son, daughter, stepchild, etc.",
        "isMinor": true/false,
        "hasSpecialNeeds": true/false if mentioned
      }
    ],
    "otherDependents": ["Names of other dependents mentioned"]
  },
  "assets": {
    "realEstate": [
      {
        "address": "Property address",
        "estimatedValue": "Value if mentioned",
        "ownership": "How titled (joint, trust, etc.)"
      }
    ],
    "bankAccounts": [
      {
        "institution": "Bank name",
        "accountType": "checking, savings, etc.",
        "estimatedValue": "Balance if mentioned"
      }
    ],
    "investmentAccounts": [
      {
        "institution": "Brokerage name",
        "accountType": "brokerage, stocks, etc.",
        "estimatedValue": "Value if mentioned"
      }
    ],
    "retirementAccounts": [
      {
        "institution": "Institution",
        "accountType": "401k, IRA, Roth IRA, etc.",
        "estimatedValue": "Value if mentioned"
      }
    ],
    "lifeInsurance": [
      {
        "company": "Insurance company",
        "policyType": "term, whole life, etc.",
        "faceValue": "Death benefit amount"
      }
    ],
    "businessInterests": [
      {
        "name": "Business name",
        "type": "LLC, corporation, partnership, etc.",
        "ownershipPercentage": "Ownership % if mentioned"
      }
    ],
    "estimatedTotalValue": "Total estate value if calculable"
  },
  "existingDocuments": {
    "hasWill": true/false,
    "willYear": "Year will was executed",
    "willAttorney": "Attorney who drafted it if mentioned",
    "hasTrust": true/false,
    "trustType": "revocable, irrevocable, etc.",
    "trustYear": "Year trust was created",
    "hasPOAFinancial": true/false,
    "poaFinancialAgent": "Name of financial POA agent",
    "hasPOAHealthcare": true/false,
    "poaHealthcareAgent": "Name of healthcare agent",
    "hasHealthcareDirective": true/false,
    "hasHIPAA": true/false
  },
  "goals": {
    "executor": "Named executor",
    "alternateExecutor": "Alternate executor if named",
    "trustee": "Trustee if trust exists",
    "guardian": "Guardian for minor children if named",
    "alternateGuardian": "Alternate guardian",
    "primaryBeneficiary": "Primary beneficiary description",
    "contingentBeneficiary": "Contingent beneficiary",
    "charitableGiving": true/false if charitable gifts mentioned,
    "specialInstructions": "Any special distribution instructions"
  },
  "overallConfidence": 0-100,
  "sourceDocuments": ["List of document names used"],
  "extractionNotes": ["Important notes about the extraction, ambiguities, or missing info"]
}

EXTRACTION GUIDELINES:
1. Only include fields where you found clear information - use null or omit for unknown
2. For dates, use ISO format (YYYY-MM-DD) when possible
3. For values, include the number with currency symbol (e.g., "$500,000")
4. Confidence should reflect how certain you are about the extracted data (0-100)
5. Include notes about any ambiguous information or conflicts between documents
6. If the same person appears in multiple roles (e.g., spouse is also executor), note appropriately
7. For marital status, infer from context if not explicitly stated
8. Pay special attention to execution dates to determine document age

Respond ONLY with the JSON object, no additional text.`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const textContent = message.content.find((block) => block.type === "text");
  const responseText = textContent?.text || "";

  // Parse JSON response
  try {
    const jsonStart = responseText.indexOf("{");
    const jsonEnd = responseText.lastIndexOf("}") + 1;
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      const jsonStr = responseText.substring(jsonStart, jsonEnd);
      return JSON.parse(jsonStr);
    }
  } catch (e) {
    console.error("Failed to parse extraction JSON:", e);
  }

  // Return default if parsing fails
  return {
    overallConfidence: 0,
    sourceDocuments: documents.map((d) => d.fileName),
    extractionNotes: ["Extraction parsing failed - manual entry required"],
  };
}
