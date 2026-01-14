/**
 * Estate Planning Document Templates
 *
 * This module exports all document generation functions and their
 * associated data types for creating legal estate planning documents.
 *
 * Documents included:
 * - Last Will and Testament
 * - Revocable Living Trust
 * - Durable Power of Attorney for Finances
 * - Healthcare Power of Attorney
 * - Healthcare Directive (Living Will)
 * - Executor Instruction Letter
 * - Trustee Instruction Letter
 */

// Will Template
export {
  generateWill,
  STATE_REQUIREMENTS,
  type WillData,
  type StateRequirements,
} from "./will";

// Living Trust Template
export {
  generateLivingTrust,
  type TrustData,
} from "./livingTrust";

// Power of Attorney Templates
export {
  generateFinancialPOA,
  generateHealthcarePOA,
  type FinancialPOAData,
  type HealthcarePOAData,
} from "./powerOfAttorney";

// Healthcare Directive Template
export {
  generateHealthcareDirective,
  type HealthcareDirectiveData,
} from "./healthcareDirective";

// Instruction Letters
export {
  generateExecutorLetter,
  generateTrusteeLetter,
  type ExecutorLetterData,
  type TrusteeLetterData,
} from "./instructionLetters";

// Document type mapping for dynamic generation
export const DOCUMENT_GENERATORS = {
  will: "generateWill",
  trust: "generateLivingTrust",
  poa_financial: "generateFinancialPOA",
  poa_healthcare: "generateHealthcarePOA",
  healthcare_directive: "generateHealthcareDirective",
  executor_letter: "generateExecutorLetter",
  trustee_letter: "generateTrusteeLetter",
} as const;

export type DocumentType = keyof typeof DOCUMENT_GENERATORS;

// Document metadata
export const DOCUMENT_METADATA: Record<DocumentType, {
  title: string;
  description: string;
  estimatedTime: string;
  requiredSections: string[];
}> = {
  will: {
    title: "Last Will and Testament",
    description: "Directs how your property should be distributed after death and names guardians for minor children.",
    estimatedTime: "30-45 minutes",
    requiredSections: ["personal", "family", "assets", "goals"],
  },
  trust: {
    title: "Revocable Living Trust",
    description: "Holds your property during your lifetime and transfers it to beneficiaries without probate.",
    estimatedTime: "45-60 minutes",
    requiredSections: ["personal", "family", "assets", "goals"],
  },
  poa_financial: {
    title: "Durable Power of Attorney for Finances",
    description: "Authorizes someone to manage your financial affairs if you become incapacitated.",
    estimatedTime: "15-20 minutes",
    requiredSections: ["personal", "family"],
  },
  poa_healthcare: {
    title: "Healthcare Power of Attorney",
    description: "Authorizes someone to make medical decisions for you if you cannot make them yourself.",
    estimatedTime: "15-20 minutes",
    requiredSections: ["personal", "family"],
  },
  healthcare_directive: {
    title: "Healthcare Directive (Living Will)",
    description: "Expresses your wishes about end-of-life medical treatment.",
    estimatedTime: "20-30 minutes",
    requiredSections: ["personal", "goals"],
  },
  executor_letter: {
    title: "Letter to Executor",
    description: "Practical guidance and important information for your executor.",
    estimatedTime: "15-20 minutes",
    requiredSections: ["personal", "assets"],
  },
  trustee_letter: {
    title: "Letter to Successor Trustee",
    description: "Practical guidance and important information for your successor trustee.",
    estimatedTime: "15-20 minutes",
    requiredSections: ["personal", "assets"],
  },
};
