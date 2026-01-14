"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
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
  const estatePlanId = planId as Id<"estatePlans"> | null;

  // Fetch existing intake data
  const existingData = useQuery(
    api.queries.getIntakeSection,
    estatePlanId
      ? { estatePlanId, section: STEP_TO_SECTION[step] }
      : "skip"
  );

  // Fetch extracted data for pre-fill
  const extractedData = useQuery(
    api.extractedData.getExtractedDataBySection,
    estatePlanId
      ? { estatePlanId, section: STEP_TO_SECTION[step] }
      : "skip"
  ) as ExtractedDataRecord | null | undefined;

  // Fetch intake progress
  const progress = useQuery(
    api.queries.getIntakeProgress,
    estatePlanId ? { estatePlanId } : "skip"
  );

  // Mutation to save intake data
  const updateIntakeData = useMutation(api.estatePlanning.updateIntakeData);

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

    // Parse extracted data if available
    if (extractedData?.parsedData) {
      extractedValues = extractedData.parsedData as Partial<T>;
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
      await updateIntakeData({
        estatePlanId,
        section: STEP_TO_SECTION[step],
        data: JSON.stringify(data),
        isComplete: markComplete,
      });
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
  }, [estatePlanId, step, updateIntakeData]);

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
      if (status.isComplete) {
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
    isLoading: existingData === undefined || extractedData === undefined || !dataInitialized,
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
  const sectionData = useQuery(
    api.queries.getIntakeSection,
    estatePlanId
      ? { estatePlanId: estatePlanId as Id<"estatePlans">, section }
      : "skip"
  );

  if (sectionData === undefined) {
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
