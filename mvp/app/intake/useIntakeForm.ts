"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  useIntakeSection,
  useIntakeProgress,
  useExtractedDataBySection,
  updateIntakeData,
} from "../hooks/usePrismaQueries";
import { useRouter, useSearchParams } from "next/navigation";
import { IntakeStep } from "../components/IntakeProgress";

type Section = "personal" | "family" | "assets" | "existing_documents" | "goals";
type SaveStatus = "idle" | "saving" | "saved" | "error";

// Map URL step names to database section names
const STEP_TO_SECTION: Record<IntakeStep, Section> = {
  personal: "personal",
  family: "family",
  assets: "assets",
  existing: "existing_documents",
  goals: "goals",
};

// Map to next step with descriptive labels
const STEP_CONFIG: Record<IntakeStep, { next: IntakeStep | "complete"; nextLabel: string }> = {
  personal: { next: "family", nextLabel: "Continue to Family" },
  family: { next: "assets", nextLabel: "Continue to Assets" },
  assets: { next: "existing", nextLabel: "Continue to Documents" },
  existing: { next: "goals", nextLabel: "Continue to Goals" },
  goals: { next: "complete", nextLabel: "Review & Complete" },
};

// Debounce delay in milliseconds
const AUTO_SAVE_DELAY = 2000;

// Interface for extracted data record
interface ExtractedDataRecord {
  section: string;
  parsedData: Record<string, unknown>;
  confidence: number;
  status: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Field Transformation Layer
// Maps extracted JSON field names to form field names
// ─────────────────────────────────────────────────────────────────────────────

// Helper to split "EMILY CHEN" into {firstName: "Emily", lastName: "Chen"}
function splitName(fullName: string | undefined): { firstName: string; lastName: string } {
  if (!fullName) return { firstName: "", lastName: "" };
  const parts = fullName.trim().split(/\s+/);
  const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  if (parts.length === 1) return { firstName: titleCase(parts[0]), lastName: "" };
  return {
    firstName: titleCase(parts[0]),
    lastName: parts.slice(1).map(titleCase).join(" "),
  };
}

// Map relationship strings to form dropdown values
function mapRelationship(rel: string | undefined): string {
  if (!rel) return "";
  const lower = rel.toLowerCase();
  if (lower.includes("sister") || lower.includes("brother")) return "sibling";
  if (lower.includes("friend")) return "friend";
  if (lower.includes("aunt") || lower.includes("uncle")) return "aunt_uncle";
  if (lower.includes("parent") || lower.includes("mother") || lower.includes("father")) return "parent";
  if (lower.includes("cousin")) return "cousin";
  return "other";
}

// Extract year from date string like "March 15, 2016"
function extractYear(dateStr: string | undefined): string {
  if (!dateStr) return "";
  const match = dateStr.match(/\d{4}/);
  return match ? match[0] : "";
}

// Extract state abbreviation from governing law string
function extractState(governingLaw: string | undefined): string {
  if (!governingLaw) return "";
  const stateMap: Record<string, string> = {
    "massachusetts": "MA", "california": "CA", "new york": "NY", "texas": "TX",
    "florida": "FL", "illinois": "IL", "pennsylvania": "PA", "ohio": "OH",
    "georgia": "GA", "north carolina": "NC", "michigan": "MI", "new jersey": "NJ",
    "virginia": "VA", "washington": "WA", "arizona": "AZ", "tennessee": "TN",
    "colorado": "CO", "maryland": "MD", "minnesota": "MN", "wisconsin": "WI",
    "alabama": "AL", "south carolina": "SC", "louisiana": "LA", "kentucky": "KY",
    "oregon": "OR", "oklahoma": "OK", "connecticut": "CT", "utah": "UT",
    "iowa": "IA", "nevada": "NV", "arkansas": "AR", "mississippi": "MS",
    "kansas": "KS", "new mexico": "NM", "nebraska": "NE", "west virginia": "WV",
    "idaho": "ID", "hawaii": "HI", "new hampshire": "NH", "maine": "ME",
    "montana": "MT", "rhode island": "RI", "delaware": "DE", "south dakota": "SD",
    "north dakota": "ND", "alaska": "AK", "vermont": "VT", "wyoming": "WY",
    "district of columbia": "DC", "commonwealth of massachusetts": "MA",
  };
  const lower = governingLaw.toLowerCase();
  for (const [name, abbrev] of Object.entries(stateMap)) {
    if (lower.includes(name)) return abbrev;
  }
  return "";
}

// Map trust type to form dropdown value
function mapTrustType(trustType: string | undefined): string {
  if (!trustType) return "";
  const lower = trustType.toLowerCase();
  if (lower.includes("revocable") && lower.includes("living")) return "revocable_living";
  if (lower.includes("irrevocable")) return "irrevocable";
  if (lower.includes("special needs")) return "special_needs";
  return "other";
}

// Transform personal section extracted data to form fields
function transformPersonalData(data: Record<string, unknown>): Record<string, unknown> {
  return {
    firstName: data.firstName,
    middleName: data.middleName,
    lastName: data.lastName,
    dateOfBirth: data.dateOfBirth,
    email: data.email,
    phone: data.phone,
    // Rename: address → streetAddress, zip → zipCode
    streetAddress: data.address,
    city: data.city,
    state: extractState(data.state as string) || data.state,
    zipCode: data.zip,
    maritalStatus: data.maritalStatus,
  };
}

// Transform family section extracted data to form fields
function transformFamilyData(data: Record<string, unknown>): Record<string, unknown> {
  const children = (data.children as Array<{
    fullName: string;
    dateOfBirth: string;
    isMinor: boolean;
    relationship: string;
  }>) || [];

  const guardian = data.guardianForMinors as {
    primaryGuardian?: string;
    primaryGuardianRelationship?: string;
    successorGuardian?: string;
    successorGuardianRelationship?: string;
  } | undefined;

  // Check if spouse data exists (may be in personal extraction)
  const hasSpouseData = !!(data.spouseFirstName || data.spouseFullName);
  const spouseName = data.spouseFullName
    ? splitName(data.spouseFullName as string)
    : { firstName: data.spouseFirstName as string || "", lastName: data.spouseLastName as string || "" };

  return {
    // Infer boolean flags
    hasSpouse: hasSpouseData,
    spouseFirstName: spouseName.firstName,
    spouseLastName: spouseName.lastName,
    spouseDateOfBirth: data.spouseDateOfBirth || "",
    spouseIsUSCitizen: true, // default

    // Transform children array
    hasChildren: children.length > 0,
    children: children.map((child, idx) => {
      const names = splitName(child.fullName);
      const rel = child.relationship?.toLowerCase() || "";
      return {
        id: `extracted_${idx}_${Date.now()}`,
        firstName: names.firstName,
        lastName: names.lastName,
        dateOfBirth: child.dateOfBirth || "",
        relationship: (rel === "son" || rel === "daughter" || rel === "child") ? "biological" : rel || "biological",
        isMinor: child.isMinor ?? false,
        hasSpecialNeeds: false,
        specialNeedsDetails: "",
      };
    }),

    // Flatten guardian structure
    guardianName: guardian?.primaryGuardian ? splitName(guardian.primaryGuardian).firstName + " " + splitName(guardian.primaryGuardian).lastName : "",
    guardianRelationship: mapRelationship(guardian?.primaryGuardianRelationship),
    alternateGuardianName: guardian?.successorGuardian ? splitName(guardian.successorGuardian).firstName + " " + splitName(guardian.successorGuardian).lastName : "",
    alternateGuardianRelationship: mapRelationship(guardian?.successorGuardianRelationship),
  };
}

// Transform existing documents section extracted data to form fields
function transformExistingDocsData(data: Record<string, unknown>): Record<string, unknown> {
  const executor = data.executor as { name?: string; relationship?: string } | undefined;
  const successorExecutor = data.successorExecutor as { name?: string; relationship?: string } | undefined;

  return {
    // Convert boolean to yes/no string
    hasWill: data.hasWill === true ? "yes" : data.hasWill === false ? "no" : "unsure",
    willYear: extractYear(data.willDate as string),
    willState: extractState(data.governingLaw as string),
    willConcerns: "",

    hasTrust: !!data.hasTrust,
    trustType: mapTrustType(data.trustType as string),
    trustYear: extractYear(data.trustDate as string),
    trustConcerns: "",

    hasPOAFinancial: data.hasPoaFinancial === true ? "yes" : data.hasPoaFinancial === false ? "no" : "unsure",
    poaFinancialYear: "",
    poaFinancialAgent: data.financialPoa || "",

    hasPOAHealthcare: data.hasPoaHealthcare === true ? "yes" : data.hasPoaHealthcare === false ? "no" : "unsure",
    poaHealthcareYear: "",
    poaHealthcareAgent: data.healthcareProxy || "",

    hasHealthcareDirective: data.hasHealthcareDirective === true ? "yes" : data.hasHealthcareDirective === false ? "no" : "unsure",
    healthcareDirectiveYear: "",

    hasHIPAA: false,

    // Flatten executor info
    executorName: executor?.name || "",
    executorRelationship: executor?.relationship || "",
    successorExecutorName: successorExecutor?.name || "",
  };
}

// Transform goals section extracted data to form fields
function transformGoalsData(data: Record<string, unknown>): Record<string, unknown> {
  const primaryGoals = Array.isArray(data.primaryGoals) ? data.primaryGoals as string[] : [];
  const concerns = Array.isArray(data.concerns) ? data.concerns as string[] : [];

  // Split executor name if it's a full name
  const executorFullName = data.executorName as string | undefined;
  const executorNames = executorFullName ? splitName(executorFullName) : { firstName: "", lastName: "" };

  // Split guardian name if it's a full name
  const guardianFullName = data.guardianName as string | undefined;
  const guardianNames = guardianFullName ? splitName(guardianFullName) : { firstName: "", lastName: "" };

  return {
    topPriorities: primaryGoals.join("\n"),
    additionalGoals: concerns.join("\n"),
    funeralDetails: data.specialInstructions || "",
    // Distribution plan could map to primaryBeneficiaryDetails
    primaryBeneficiaryDetails: data.distributionPlan || "",
    // Executor fields
    executorName: executorFullName ? `${executorNames.firstName} ${executorNames.lastName}`.trim() : "",
    executorRelationship: data.executorRelationship || "",
    alternateExecutorName: data.alternateExecutorName || "",
    // Guardian fields
    hasMinorChildren: !!data.hasMinorChildren,
    guardianName: guardianFullName ? `${guardianNames.firstName} ${guardianNames.lastName}`.trim() : "",
    guardianRelationship: mapRelationship(data.guardianRelationship as string),
    alternateGuardianName: data.alternateGuardianName || "",
  };
}

// Main transformer function
function transformExtractedData(
  section: Section,
  extractedData: Record<string, unknown>
): Record<string, unknown> {
  switch (section) {
    case "personal":
      return transformPersonalData(extractedData);
    case "family":
      return transformFamilyData(extractedData);
    case "existing_documents":
      return transformExistingDocsData(extractedData);
    case "goals":
      return transformGoalsData(extractedData);
    case "assets":
      // Assets section doesn't need much transformation
      return extractedData;
    default:
      return extractedData;
  }
}

// ─────────────────────────────────────────────────────────────────────────────

// Helper to get current year for dynamic placeholders
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

// Helper to get example year (current year - 1 for "recent" examples)
export function getExampleYear(): string {
  return String(new Date().getFullYear() - 1);
}

export function useIntakeForm<T extends object>(
  step: IntakeStep,
  defaultData: T
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");

  const [formData, setFormData] = useState<T>(defaultData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [extractedFields, setExtractedFields] = useState<Set<string>>(new Set());
  const [dataInitialized, setDataInitialized] = useState(false);

  // Refs for auto-save
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formDataRef = useRef<T>(formData);

  // Keep formDataRef in sync
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Convert planId to proper type
  const estatePlanId = planId;

  // Fetch existing intake data using SWR
  const { data: existingData, isLoading: existingDataLoading } = useIntakeSection(
    estatePlanId,
    STEP_TO_SECTION[step]
  );

  // Fetch extracted data for pre-fill using SWR
  const { data: extractedData, isLoading: extractedDataLoading } = useExtractedDataBySection(
    estatePlanId,
    STEP_TO_SECTION[step]
  );

  // Fetch intake progress using SWR
  const { data: progress } = useIntakeProgress(estatePlanId);


  // Merge extracted data with existing/default data
  // Priority: existing manual data > extracted data > default
  useEffect(() => {
    // Wait until both queries have resolved
    if (existingData === undefined || extractedData === undefined) {
      return;
    }

    // Only initialize once
    if (dataInitialized) {
      return;
    }

    let manualData: Partial<T> = {};
    let extractedValues: Partial<T> = {};

    // Parse existing manual data if available
    if (existingData?.data) {
      try {
        manualData = JSON.parse(existingData.data) as Partial<T>;
      } catch (e) {
        console.error("Failed to parse existing intake data:", e);
      }
    }

    // Parse extracted data if available and transform to match form fields
    if (extractedData?.parsedData) {
      // Transform extracted field names to match form fields
      extractedValues = transformExtractedData(
        STEP_TO_SECTION[step],
        extractedData.parsedData as Record<string, unknown>
      ) as Partial<T>;
    }

    // Merge: default -> extracted -> manual
    const merged = { ...defaultData };
    const newExtractedFields = new Set<string>();

    // Apply extracted values first
    for (const [key, value] of Object.entries(extractedValues)) {
      if (value !== undefined && value !== null && value !== "") {
        (merged as Record<string, unknown>)[key] = value;
        newExtractedFields.add(key);
      }
    }

    // Apply manual values (override extracted)
    for (const [key, value] of Object.entries(manualData)) {
      if (value !== undefined && value !== null && value !== "") {
        (merged as Record<string, unknown>)[key] = value;
        // If manual value differs from extracted, remove from extracted set
        if (extractedValues[key as keyof T] !== value) {
          newExtractedFields.delete(key);
        }
      }
    }

    setFormData(merged);
    formDataRef.current = merged;
    setExtractedFields(newExtractedFields);
    setDataInitialized(true);
  }, [existingData, extractedData, defaultData, dataInitialized]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Internal save function
  const doSave = useCallback(async (data: T, markComplete = false): Promise<boolean> => {
    if (!estatePlanId) {
      console.error("No estate plan ID");
      return false;
    }

    setSaveStatus("saving");
    setSaveError(null);

    try {
      await updateIntakeData(
        estatePlanId,
        STEP_TO_SECTION[step],
        {
          data: JSON.stringify(data),
          isComplete: markComplete,
        }
      );
      setHasChanges(false);
      setSaveStatus("saved");
      setLastSaved(new Date());
      return true;
    } catch (error) {
      console.error("Failed to save intake data:", error);
      setSaveStatus("error");
      setSaveError(error instanceof Error ? error.message : "Failed to save");
      return false;
    }
  }, [estatePlanId, step]);

  // Debounced auto-save
  const triggerAutoSave = useCallback(() => {
    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save
    saveTimeoutRef.current = setTimeout(async () => {
      await doSave(formDataRef.current, false);
    }, AUTO_SAVE_DELAY);
  }, [doSave]);

  // Update form field with auto-save
  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      return updated;
    });
    setHasChanges(true);
    setSaveStatus("idle");
    triggerAutoSave();
  }, [triggerAutoSave]);

  // Manual save (without marking complete)
  const save = useCallback(async () => {
    // Cancel pending auto-save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    setIsSubmitting(true);
    try {
      await doSave(formData, false);
    } finally {
      setIsSubmitting(false);
    }
  }, [doSave, formData]);

  // Save and continue to next step
  const saveAndContinue = useCallback(async () => {
    // Cancel pending auto-save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setIsSubmitting(true);
    try {
      const success = await doSave(formData, true);
      if (success) {
        const config = STEP_CONFIG[step];
        if (config.next === "complete") {
          // Go to gap analysis or summary
          router.push(`/intake?planId=${planId}&complete=true`);
        } else {
          router.push(`/intake/${config.next}?planId=${planId}`);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [doSave, formData, step, router, planId]);

  // Save and exit to intake landing
  const saveAndExit = useCallback(async () => {
    // Cancel pending auto-save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setIsSubmitting(true);
    try {
      await doSave(formData, false);
      router.push(`/intake?planId=${planId}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [doSave, formData, router, planId]);

  // Get completed steps as a Set
  const completedSteps = new Set<IntakeStep>();
  if (progress?.sections) {
    for (const [section, status] of Object.entries(progress.sections)) {
      const s = status as { isComplete: boolean };
      if (s.isComplete) {
        // Reverse map section to step
        const stepEntry = Object.entries(STEP_TO_SECTION).find(
          ([_, sec]) => sec === section
        );
        if (stepEntry) {
          completedSteps.add(stepEntry[0] as IntakeStep);
        }
      }
    }
  }

  // Get step configuration
  const stepConfig = STEP_CONFIG[step];

  // Check if a field was pre-filled from extraction
  const isFieldExtracted = useCallback((field: string) => {
    return extractedFields.has(field);
  }, [extractedFields]);

  // Get extraction confidence for this section
  const extractionConfidence = extractedData?.confidence;

  return {
    formData,
    setFormData,
    updateField,
    save,
    saveAndContinue,
    saveAndExit,
    isSubmitting,
    hasChanges,
    estatePlanId,
    completedSteps,
    progress,
    isLoading: existingDataLoading || extractedDataLoading || !dataInitialized,
    // Auto-save related
    saveStatus,
    lastSaved,
    saveError,
    // Step navigation
    nextStepLabel: stepConfig.nextLabel,
    isLastStep: stepConfig.next === "complete",
    // Extraction related
    extractedFields,
    isFieldExtracted,
    extractionConfidence,
    hasExtractedData: extractedFields.size > 0,
  };
}

// US States list for dropdowns
export const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
];

// Hook to fetch data from another intake section
export function useOtherSectionData<T>(
  estatePlanId: string | null,
  section: Section
): { data: T | null; isLoading: boolean } {
  const { data: sectionData, isLoading } = useIntakeSection(estatePlanId, section);

  if (isLoading) {
    return { data: null, isLoading: true };
  }

  if (!sectionData?.data) {
    return { data: null, isLoading: false };
  }

  try {
    return { data: JSON.parse(sectionData.data) as T, isLoading: false };
  } catch {
    return { data: null, isLoading: false };
  }
}
