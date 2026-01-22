"use client";

import { Suspense, useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import {
  useGuidedIntakeProgress,
  saveGuidedStepData,
} from "@/app/hooks/usePrismaQueries";
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "@/app/components/ui";
import {
  ProgressHeader,
  SaveIndicator,
  EmotionalBanner,
  ConversationCard,
  GateQuestion,
  YesNoField,
  QuestionGroup,
  FormField,
  TextInput,
  Textarea,
  SelectInput,
  RadioGroup,
  PriorityPicker,
  MultiSelect,
} from "@/components/intake";
import {
  GUIDED_STEPS,
  getStepBySlug,
  getNextStep,
  getPreviousStep,
  getVisibleQuestions,
  Question,
  GuidedStep,
  ASSET_TYPE_OPTIONS,
  PRIORITY_OPTIONS,
} from "@/lib/intake/guided-flow-config";
import { US_STATES } from "@/app/intake/useIntakeForm";
import { getWhyThisMatters } from "@/lib/intake/question-helpers";

type SaveStatus = "idle" | "saving" | "saved" | "error";

function GuidedStepContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const stepSlug = params.step as string;
  const planId = searchParams.get("planId");

  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formDataRef = useRef<Record<string, unknown>>(formData);

  // Get step configuration
  const step = getStepBySlug(stepSlug);

  // SWR query for guided intake progress (includes step data)
  const estatePlanId = planId;

  const { data: guidedProgress, isLoading: isLoadingProgress } = useGuidedIntakeProgress(estatePlanId);

  // Extract existing step data from the progress object (memoized to prevent infinite loops)
  const existingDataString = useMemo(() => {
    if (step && guidedProgress?.stepData && guidedProgress.stepData[step.id]) {
      return JSON.stringify(guidedProgress.stepData[step.id]);
    }
    return null;
  }, [step, guidedProgress?.stepData]);

  // Keep ref in sync
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Initialize form data from existing data
  useEffect(() => {
    if (existingDataString) {
      try {
        const parsed = JSON.parse(existingDataString);
        setFormData(parsed);
        formDataRef.current = parsed;
      } catch (e) {
        console.error("Failed to parse existing data:", e);
      }
    }
  }, [existingDataString]);

  // Auto-save logic
  const doSave = useCallback(
    async (data: Record<string, unknown>) => {
      if (!estatePlanId || !step) return;

      setSaveStatus("saving");
      try {
        await saveGuidedStepData(estatePlanId, step.id, data, false);
        setSaveStatus("saved");
        setLastSaved(new Date());
      } catch (error) {
        console.error("Failed to save:", error);
        setSaveStatus("error");
      }
    },
    [estatePlanId, step]
  );

  const triggerAutoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      doSave(formDataRef.current);
    }, 2000);
  }, [doSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Update field handler
  const updateField = useCallback(
    (fieldId: string, value: unknown) => {
      setFormData((prev) => {
        const updated = { ...prev, [fieldId]: value };
        return updated;
      });
      setSaveStatus("idle");
      triggerAutoSave();
    },
    [triggerAutoSave]
  );

  // Navigation handlers
  const handleNext = async () => {
    if (!estatePlanId || !step) return;

    setIsNavigating(true);

    // Clear any pending auto-save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    try {
      // Save and mark step complete
      await saveGuidedStepData(estatePlanId, step.id, formData, true);

      // Navigate to next step
      const nextStep = getNextStep(step.id);
      if (nextStep) {
        router.push(`/intake/guided/${nextStep.slug}?planId=${planId}`);
      } else {
        // Final step - go to review/completion
        router.push(`/intake?planId=${planId}&complete=true`);
      }
    } catch (error) {
      console.error("Failed to complete step:", error);
      setIsNavigating(false);
    }
  };

  const handleBack = async () => {
    if (!step) return;

    // Save current progress before going back
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (estatePlanId) {
      await doSave(formData);
    }

    const prevStep = getPreviousStep(step.id);
    if (prevStep) {
      router.push(`/intake/guided/${prevStep.slug}?planId=${planId}`);
    } else {
      router.push(`/intake/guided?planId=${planId}`);
    }
  };

  const handleSkip = async () => {
    if (!step) return;

    const nextStep = getNextStep(step.id);
    if (nextStep) {
      router.push(`/intake/guided/${nextStep.slug}?planId=${planId}`);
    }
  };

  // Render loading state
  if (!step) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--text-muted)]">Step not found</p>
        <Button variant="secondary" onClick={() => router.push("/intake/guided")}>
          Go Back
        </Button>
      </div>
    );
  }

  if (isLoadingProgress) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--accent-purple)]" />
      </div>
    );
  }

  // Combine all step data for cross-step conditionals
  const allStepData: Record<string, unknown> = {};
  if (guidedProgress?.stepData) {
    Object.values(guidedProgress.stepData).forEach((stepData) => {
      if (stepData && typeof stepData === 'object') {
        Object.assign(allStepData, stepData);
      }
    });
  }

  // Merge with current form data (current step takes precedence)
  const mergedData = { ...allStepData, ...formData };

  // Get visible questions based on merged data (includes cross-step conditionals)
  const visibleQuestions = getVisibleQuestions(step, mergedData);
  const completedSteps = guidedProgress?.completedSteps || [];

  return (
    <div className="space-y-6">
      {/* Progress header */}
      <ProgressHeader
        currentStep={step.id}
        completedSteps={completedSteps}
        stepTitle={step.title}
        estimatedMinutes={step.estimatedMinutes}
      />

      {/* Save indicator */}
      <div className="flex justify-end">
        <SaveIndicator status={saveStatus} lastSaved={lastSaved} />
      </div>

      {/* Emotional banner */}
      {step.emotionalMessage && (
        <EmotionalBanner message={step.emotionalMessage} />
      )}

      {/* Main content card */}
      <ConversationCard title={step.title} subtitle={step.subtitle}>
        <div className="space-y-6">
          {step.id === 8 ? (
            // Review step - show summary
            <ReviewSummary planId={planId} />
          ) : (
            // Regular questions
            visibleQuestions.map((question) => (
              <QuestionRenderer
                key={question.id}
                question={question}
                value={formData[question.id]}
                onChange={(value) => updateField(question.id, value)}
                formData={formData}
              />
            ))
          )}
        </div>
      </ConversationCard>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button variant="secondary" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center gap-3">
          {step.canSkip && (
            <button
              onClick={handleSkip}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors"
            >
              Skip for now
            </button>
          )}

          <Button
            variant="primary"
            onClick={handleNext}
            disabled={isNavigating}
          >
            {isNavigating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Saving...
              </>
            ) : step.id === 8 ? (
              <>
                Complete
                <Check className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Question renderer component
interface QuestionRendererProps {
  question: Question;
  value: unknown;
  onChange: (value: unknown) => void;
  formData: Record<string, unknown>;
}

function QuestionRenderer({
  question,
  value,
  onChange,
  formData,
}: QuestionRendererProps) {
  const whyMatters = getWhyThisMatters(question.id);

  switch (question.type) {
    case "text":
    case "email":
    case "phone":
      return (
        <FormField
          label={question.label || ""}
          help={question.help}
          required={question.required}
        >
          <TextInput
            value={(value as string) || ""}
            onChange={(v) => onChange(v)}
            placeholder={question.placeholder}
            type={question.type === "email" ? "email" : question.type === "phone" ? "tel" : "text"}
          />
          {whyMatters && (
            <p className="text-xs text-[var(--text-caption)] mt-1">{whyMatters}</p>
          )}
        </FormField>
      );

    case "date":
      return (
        <FormField
          label={question.label || ""}
          help={question.help}
          required={question.required}
        >
          <TextInput
            value={(value as string) || ""}
            onChange={(v) => onChange(v)}
            placeholder={question.placeholder || "MM/DD/YYYY"}
            type="date"
          />
        </FormField>
      );

    case "textarea":
      return (
        <FormField
          label={question.label || ""}
          help={question.help}
          required={question.required}
        >
          <Textarea
            value={(value as string) || ""}
            onChange={(v) => onChange(v)}
            placeholder={question.placeholder}
          />
        </FormField>
      );

    case "state-select":
      return (
        <FormField
          label={question.label || ""}
          help={question.help}
          required={question.required}
        >
          <SelectInput
            value={(value as string) || ""}
            onChange={(v) => onChange(v)}
            options={US_STATES}
            placeholder="Select a state..."
          />
        </FormField>
      );

    case "radio":
      return (
        <FormField
          label={question.label || ""}
          help={question.help}
          required={question.required}
        >
          <RadioGroup
            value={(value as string) || ""}
            onChange={(v) => onChange(v)}
            options={question.options || []}
            columns={question.options && question.options.length > 4 ? 2 : 1}
          />
        </FormField>
      );

    case "yes-no":
      return (
        <YesNoField
          label={question.label || ""}
          value={value as boolean | null | undefined}
          onChange={(v) => onChange(v)}
          help={question.help}
        />
      );

    case "gate":
      return (
        <GateQuestion
          question={question.label || ""}
          value={value as boolean | null | undefined}
          onChange={(v) => onChange(v)}
          help={question.help}
        />
      );

    case "multi-select":
      return (
        <FormField
          label={question.label || ""}
          help={question.help}
          required={question.required}
        >
          <MultiSelect
            options={question.options || ASSET_TYPE_OPTIONS}
            value={(value as string[]) || []}
            onChange={(v) => onChange(v)}
          />
        </FormField>
      );

    case "priority-picker":
      return (
        <FormField
          label={question.label || ""}
          help={question.help}
          required={question.required}
        >
          <PriorityPicker
            options={question.options || PRIORITY_OPTIONS}
            value={(value as string[]) || []}
            onChange={(v) => onChange(v)}
            maxSelections={3}
          />
        </FormField>
      );

    case "child-list":
      return (
        <ChildListField
          label={question.label || ""}
          value={(value as Child[]) || []}
          onChange={(v) => onChange(v)}
        />
      );

    default:
      return (
        <FormField label={question.label || ""}>
          <TextInput
            value={(value as string) || ""}
            onChange={(v) => onChange(v)}
            placeholder={question.placeholder}
          />
        </FormField>
      );
  }
}

// Child list field component
interface Child {
  id?: string;
  name: string;
  dateOfBirth?: string;
  relationship?: string;
}

interface ChildListFieldProps {
  label: string;
  value: Child[];
  onChange: (value: Child[]) => void;
}

function ChildListField({ label, value, onChange }: ChildListFieldProps) {
  const addChild = () => {
    onChange([...value, {
      id: `child-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: "",
      dateOfBirth: "",
      relationship: "child"
    }]);
  };

  const updateChild = (index: number, field: keyof Child, fieldValue: string) => {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: fieldValue };
    onChange(updated);
  };

  const removeChild = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--text-heading)]">
          {label}
        </label>
        <button
          type="button"
          onClick={addChild}
          className="text-sm text-[var(--accent-purple)] hover:underline"
        >
          + Add child
        </button>
      </div>

      {value.length === 0 && (
        <p className="text-sm text-[var(--text-muted)] py-4 text-center">
          Click &quot;+ Add child&quot; to add your first child
        </p>
      )}

      {value.map((child, index) => (
        <div
          key={child.id || `child-fallback-${index}`}
          className="bg-[var(--off-white)] rounded-xl p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text-muted)]">
              Child {index + 1}
            </span>
            <button
              type="button"
              onClick={() => removeChild(index)}
              className="text-xs text-[var(--error)] hover:underline"
            >
              Remove
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TextInput
              value={child.name}
              onChange={(v) => updateChild(index, "name", v)}
              placeholder="Full name"
            />
            <TextInput
              value={child.dateOfBirth || ""}
              onChange={(v) => updateChild(index, "dateOfBirth", v)}
              placeholder="Date of birth"
              type="date"
            />
          </div>
          <SelectInput
            value={child.relationship || "child"}
            onChange={(v) => updateChild(index, "relationship", v)}
            options={[
              { value: "child", label: "Biological child" },
              { value: "adopted", label: "Adopted child" },
              { value: "stepchild", label: "Stepchild" },
            ]}
          />
        </div>
      ))}
    </div>
  );
}

// Review summary component
function ReviewSummary({ planId }: { planId: string | null }) {
  const router = useRouter();
  const estatePlanId = planId;

  const { data: guidedProgress, isLoading } = useGuidedIntakeProgress(estatePlanId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--accent-purple)]" />
      </div>
    );
  }

  // Combine all step data from the progress object
  const combinedData: Record<string, unknown> = {};
  if (guidedProgress?.stepData) {
    Object.values(guidedProgress.stepData).forEach((stepData) => {
      if (stepData && typeof stepData === 'object') {
        Object.assign(combinedData, stepData);
      }
    });
  }

  const sections = [
    {
      title: "About You",
      stepSlug: "about-you",
      fields: [
        { key: "firstName", label: "Name", format: (d: Record<string, unknown>) => `${d.firstName || ""} ${d.middleName || ""} ${d.lastName || ""}`.trim() },
        { key: "dateOfBirth", label: "Date of Birth" },
        { key: "stateOfResidence", label: "State" },
        { key: "maritalStatus", label: "Relationship Status" },
      ],
    },
    {
      title: "Family",
      stepSlug: "family",
      fields: [
        { key: "spouseFirstName", label: "Spouse", format: (d: Record<string, unknown>) => d.spouseFirstName ? `${d.spouseFirstName} ${d.spouseLastName || ""}`.trim() : "N/A" },
        { key: "hasChildren", label: "Has Children", format: (d: Record<string, unknown>) => d.hasChildren ? "Yes" : "No" },
        { key: "children", label: "Children", format: (d: Record<string, unknown>) => Array.isArray(d.children) ? `${d.children.length} child(ren)` : "None" },
      ],
    },
    {
      title: "Assets",
      stepSlug: "assets",
      fields: [
        { key: "assetTypes", label: "Asset Types", format: (d: Record<string, unknown>) => Array.isArray(d.assetTypes) ? d.assetTypes.join(", ") : "None selected" },
        { key: "totalEstateEstimate", label: "Estimated Estate Value" },
      ],
    },
    {
      title: "Documents",
      stepSlug: "documents",
      fields: [
        { key: "hasWill", label: "Has Will", format: (d: Record<string, unknown>) => d.hasWill ? "Yes" : "No" },
        { key: "hasTrust", label: "Has Trust", format: (d: Record<string, unknown>) => d.hasTrust ? "Yes" : "No" },
      ],
    },
    {
      title: "Priorities",
      stepSlug: "priorities",
      fields: [
        { key: "topPriorities", label: "Top Priorities", format: (d: Record<string, unknown>) => Array.isArray(d.topPriorities) ? d.topPriorities.join(", ") : "None selected" },
      ],
    },
    {
      title: "Key People",
      stepSlug: "people",
      fields: [
        { key: "executorName", label: "Executor" },
        { key: "healthcareProxyName", label: "Healthcare Proxy" },
        { key: "guardianName", label: "Guardian", format: (d: Record<string, unknown>) => (d.guardianName as string) || "N/A" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <p className="text-[var(--text-muted)]">
        Review your information below. Click on any section to make changes.
      </p>

      {sections.map((section) => (
        <div
          key={section.title}
          className="bg-[var(--off-white)] rounded-xl p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-[var(--text-heading)]">
              {section.title}
            </h3>
            <button
              onClick={() => router.push(`/intake/guided/${section.stepSlug}?planId=${planId}`)}
              className="text-sm text-[var(--accent-purple)] hover:underline flex items-center gap-1"
            >
              Edit
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {section.fields.map((field) => {
              const rawValue = field.format
                ? field.format(combinedData)
                : combinedData[field.key];
              const displayValue = typeof rawValue === "string" ? rawValue : (rawValue ? String(rawValue) : "Not provided");
              return (
                <div key={field.key}>
                  <span className="text-[var(--text-caption)]">{field.label}: </span>
                  <span className="text-[var(--text-heading)]">{displayValue}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GuidedStepPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--accent-purple)]" />
        </div>
      }
    >
      <GuidedStepContent />
    </Suspense>
  );
}
