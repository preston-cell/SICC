"use node";

/**
 * Document Analysis Action
 *
 * Extracts text from uploaded PDFs and runs AI analysis to:
 * 1. Summarize the document content
 * 2. Identify key provisions and parties
 * 3. Cross-reference with intake data for inconsistencies
 * 4. Generate hypothetical scenarios
 * 5. Provide actionable recommendations
 */

import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import Anthropic from "@anthropic-ai/sdk";

// ============================================
// MAIN ANALYSIS ACTION
// ============================================

export const analyzeDocument = action({
  args: {
    documentId: v.id("uploadedDocuments"),
  },
  handler: async (ctx, { documentId }): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      // Get the document
      const doc = await ctx.runQuery(internal.uploadedDocuments.getDocumentForAnalysis, {
        documentId,
      });

      if (!doc) {
        return { success: false, error: "Document not found" };
      }

      // Update status to extracting
      await ctx.runMutation(internal.uploadedDocuments.updateAnalysisStatus, {
        documentId,
        status: "extracting",
      });

      // Get the file content
      const fileUrl = await ctx.storage.getUrl(doc.storageId);
      if (!fileUrl) {
        throw new Error("Could not get file URL");
      }

      // Fetch the file
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const base64Content = Buffer.from(arrayBuffer).toString("base64");

      // Extract text from PDF using Claude's vision capability
      const extractedText = await extractTextFromPDF(base64Content, doc.mimeType);

      // Save extracted text
      await ctx.runMutation(internal.uploadedDocuments.updateExtractedText, {
        documentId,
        extractedText,
      });

      // Get intake data for cross-reference
      const intakeData = await ctx.runQuery(
        internal.uploadedDocuments.getIntakeDataForCrossReference,
        { estatePlanId: doc.estatePlanId }
      );

      // Run AI analysis
      const analysisResult = await runDocumentAnalysis(
        extractedText,
        doc.documentType,
        doc.fileName,
        intakeData
      );

      // Save analysis result
      await ctx.runMutation(internal.uploadedDocuments.updateAnalysisStatus, {
        documentId,
        status: "completed",
        analysisResult: JSON.stringify(analysisResult),
      });

      return { success: true };
    } catch (error) {
      console.error("Document analysis error:", error);

      // Update status to failed
      await ctx.runMutation(internal.uploadedDocuments.updateAnalysisStatus, {
        documentId,
        status: "failed",
        analysisError: error instanceof Error ? error.message : "Unknown error",
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

// ============================================
// PDF TEXT EXTRACTION
// ============================================

async function extractTextFromPDF(
  base64Content: string,
  mimeType: string
): Promise<string> {
  const anthropic = new Anthropic();

  // Use Claude's vision capability to extract text from PDF
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
            text: `Please extract ALL text from this legal document. Preserve the structure, headings, sections, and formatting as much as possible. Include:

1. Document title and type
2. All parties mentioned (names, roles)
3. All sections and articles
4. All provisions, clauses, and terms
5. Signature blocks and dates
6. Any schedules or exhibits

Format the output as plain text with clear section breaks. Do not summarize - extract the complete text.`,
          },
        ],
      },
    ],
  });

  const textContent = message.content.find((block) => block.type === "text");
  return textContent?.text || "";
}

// ============================================
// AI DOCUMENT ANALYSIS
// ============================================

interface AnalysisResult {
  summary: {
    documentType: string;
    documentDate: string | null;
    jurisdiction: string | null;
    overallPurpose: string;
  };
  keyParties: Array<{
    name: string;
    role: string;
    relationship?: string;
  }>;
  keyProvisions: Array<{
    section: string;
    title: string;
    summary: string;
    importance: "high" | "medium" | "low";
  }>;
  inconsistencies: Array<{
    issue: string;
    documentSays: string;
    intakeSays: string;
    severity: "critical" | "warning" | "info";
    recommendation: string;
  }>;
  potentialIssues: Array<{
    issue: string;
    details: string;
    severity: "critical" | "warning" | "info";
    recommendation: string;
  }>;
  hypotheticals: Array<{
    scenario: string;
    outcome: string;
    considerations: string[];
  }>;
  recommendations: Array<{
    action: string;
    priority: "high" | "medium" | "low";
    reason: string;
  }>;
  plainEnglishSummary: string;
}

interface IntakeSection {
  section: string;
  data: string;
  isComplete: boolean;
}

interface BeneficiaryDesignation {
  assetType: string;
  assetName: string;
  primaryBeneficiaryName: string;
  primaryBeneficiaryRelationship?: string;
  contingentBeneficiaryName?: string;
}

interface IntakeData {
  estatePlan: {
    stateOfResidence?: string;
  } | null;
  intakeData: IntakeSection[];
  beneficiaryDesignations: BeneficiaryDesignation[];
}

async function runDocumentAnalysis(
  extractedText: string,
  documentType: string,
  fileName: string,
  intakeData: IntakeData
): Promise<AnalysisResult> {
  const anthropic = new Anthropic();

  // Parse intake data for cross-reference
  let personalData: Record<string, unknown> = {};
  let familyData: Record<string, unknown> = {};
  let assetsData: Record<string, unknown> = {};
  let goalsData: Record<string, unknown> = {};

  intakeData.intakeData.forEach((section: IntakeSection) => {
    try {
      const data = JSON.parse(section.data);
      switch (section.section) {
        case "personal":
          personalData = data;
          break;
        case "family":
          familyData = data;
          break;
        case "assets":
          assetsData = data;
          break;
        case "goals":
          goalsData = data;
          break;
      }
    } catch {
      // Ignore parse errors
    }
  });

  // Get state from estatePlan first, then fall back to personal data
  // Note: The personal intake form stores state as "state" field, not "stateOfResidence"
  const stateOfResidence = intakeData.estatePlan?.stateOfResidence
    || (personalData.state as string)
    || (personalData.stateOfResidence as string)
    || "Unknown";

  const prompt = `You are an expert estate planning attorney. Analyze the following legal document and provide a comprehensive analysis.

DOCUMENT TYPE: ${documentType}
FILE NAME: ${fileName}

DOCUMENT CONTENT:
${extractedText.substring(0, 50000)} ${extractedText.length > 50000 ? "\n\n[Document truncated due to length...]" : ""}

USER'S CURRENT SITUATION (from intake questionnaire):

Personal Information:
${JSON.stringify(personalData, null, 2)}

Family Information:
${JSON.stringify(familyData, null, 2)}

Assets:
${JSON.stringify(assetsData, null, 2)}

Goals:
${JSON.stringify(goalsData, null, 2)}

Beneficiary Designations on Accounts:
${JSON.stringify(intakeData.beneficiaryDesignations, null, 2)}

State of Residence: ${stateOfResidence}

---

Please analyze this document and provide your response in the following JSON format:

{
  "summary": {
    "documentType": "The specific type of document (e.g., 'Last Will and Testament', 'Revocable Living Trust')",
    "documentDate": "The date the document was signed/executed, or null if not found",
    "jurisdiction": "The state/jurisdiction the document was created for",
    "overallPurpose": "A one-sentence summary of what this document does"
  },
  "keyParties": [
    {
      "name": "Full name of the person",
      "role": "Their role (e.g., 'Testator', 'Executor', 'Trustee', 'Beneficiary')",
      "relationship": "Relationship to the document creator if mentioned"
    }
  ],
  "keyProvisions": [
    {
      "section": "Section or article number/name",
      "title": "Brief title for this provision",
      "summary": "What this provision does in plain English",
      "importance": "high/medium/low based on impact"
    }
  ],
  "inconsistencies": [
    {
      "issue": "Brief description of the inconsistency",
      "documentSays": "What the document states",
      "intakeSays": "What the user's current situation is",
      "severity": "critical/warning/info",
      "recommendation": "What should be done to resolve this"
    }
  ],
  "potentialIssues": [
    {
      "issue": "Name of the potential issue",
      "details": "Explanation of the problem",
      "severity": "critical/warning/info",
      "recommendation": "Suggested action"
    }
  ],
  "hypotheticals": [
    {
      "scenario": "What if [scenario]?",
      "outcome": "Based on this document, [outcome]",
      "considerations": ["List of things to consider"]
    }
  ],
  "recommendations": [
    {
      "action": "Specific action to take",
      "priority": "high/medium/low",
      "reason": "Why this is recommended"
    }
  ],
  "plainEnglishSummary": "A 2-3 paragraph summary of what this document does, written for someone with no legal background. Explain the key points, who benefits, and any important conditions or limitations."
}

IMPORTANT ANALYSIS GUIDELINES:

1. INCONSISTENCIES - Look for:
   - Named beneficiaries who may be deceased (check family data for deaths)
   - Ex-spouses still named (check marital status)
   - Children not included (compare children in document vs intake)
   - Wrong state laws referenced (compare to current state of residence)
   - Executors/trustees who may no longer be appropriate
   - Asset descriptions that don't match current assets
   - Outdated addresses

2. POTENTIAL ISSUES - Look for:
   - Document appears to be more than 5 years old
   - Missing important provisions (no residuary clause, no survivorship provision)
   - Ambiguous language that could cause disputes
   - State-specific requirements that may not be met
   - Tax implications based on estate value
   - Conflicts with beneficiary designations on accounts

3. HYPOTHETICALS - Generate 3-5 relevant scenarios:
   - "What if you become incapacitated before death?"
   - "What if [primary beneficiary] predeceases you?"
   - "What if you move to a different state?"
   - "What if your estate value changes significantly?"
   - Scenarios specific to their family situation

4. CROSS-REFERENCE with beneficiary designations:
   - Retirement accounts, life insurance, and TOD/POD accounts BYPASS the will
   - Flag if will says one thing but beneficiary designations say another
   - This is a common source of estate planning failures

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

  // Parse the JSON response
  try {
    const jsonStart = responseText.indexOf("{");
    const jsonEnd = responseText.lastIndexOf("}") + 1;
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      const jsonStr = responseText.substring(jsonStart, jsonEnd);
      return JSON.parse(jsonStr);
    }
  } catch (e) {
    console.error("Failed to parse analysis JSON:", e);
  }

  // Return a default structure if parsing fails
  return {
    summary: {
      documentType: documentType,
      documentDate: null,
      jurisdiction: null,
      overallPurpose: "Analysis could not be completed",
    },
    keyParties: [],
    keyProvisions: [],
    inconsistencies: [],
    potentialIssues: [
      {
        issue: "Analysis Error",
        details: "The document could not be fully analyzed. Please try again or contact support.",
        severity: "warning",
        recommendation: "Try re-uploading the document or ensure it's a valid PDF.",
      },
    ],
    hypotheticals: [],
    recommendations: [],
    plainEnglishSummary: responseText || "Analysis could not be completed.",
  };
}

