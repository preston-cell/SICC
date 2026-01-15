"use client";

import { Suspense } from "react";
import IntakeProgress from "../../components/IntakeProgress";
import IntakeNavigation from "../../components/IntakeNavigation";
import { FormField, TextInput, Select, RadioGroup, FormSection, Checkbox, TextArea, InfoBox } from "../../components/FormFields";
import { useIntakeForm, useOtherSectionData } from "../useIntakeForm";
import { ExtractedBadge, ExtractedDataBanner } from "../../components/ExtractedBadge";

// Personal data interface for cross-section check
interface PersonalData {
  maritalStatus: string;
}

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  relationship: string; // biological, adopted, stepchild
  isMinor: boolean;
  hasSpecialNeeds: boolean;
  specialNeedsDetails: string;
}

interface FamilyData {
  // Spouse info (if married)
  hasSpouse: boolean;
  spouseFirstName: string;
  spouseLastName: string;
  spouseDateOfBirth: string;
  spouseIsUSCitizen: boolean;

  // Children
  hasChildren: boolean;
  children: Child[];

  // Guardian for minor children
  guardianName: string;
  guardianRelationship: string;
  alternateGuardianName: string;
  alternateGuardianRelationship: string;
  guardianInstructions: string;

  // Other dependents
  hasOtherDependents: boolean;
  otherDependentsDetails: string;

  // Pets
  hasPets: boolean;
  petsDetails: string;

  // Parents
  parentsLiving: string; // both, mother_only, father_only, neither
  parentsCareNeeded: boolean;
}

const DEFAULT_DATA: FamilyData = {
  hasSpouse: false,
  spouseFirstName: "",
  spouseLastName: "",
  spouseDateOfBirth: "",
  spouseIsUSCitizen: true,
  hasChildren: false,
  children: [],
  guardianName: "",
  guardianRelationship: "",
  alternateGuardianName: "",
  alternateGuardianRelationship: "",
  guardianInstructions: "",
  hasOtherDependents: false,
  otherDependentsDetails: "",
  hasPets: false,
  petsDetails: "",
  parentsLiving: "",
  parentsCareNeeded: false,
};

const RELATIONSHIP_OPTIONS = [
  { value: "biological", label: "Biological Child" },
  { value: "adopted", label: "Adopted Child" },
  { value: "stepchild", label: "Stepchild" },
];

const PARENTS_OPTIONS = [
  { value: "both", label: "Both parents are living" },
  { value: "mother_only", label: "Only mother is living" },
  { value: "father_only", label: "Only father is living" },
  { value: "neither", label: "Neither parent is living" },
];

const GUARDIAN_RELATIONSHIP_OPTIONS = [
  { value: "sibling", label: "Sibling" },
  { value: "parent", label: "Parent/Grandparent" },
  { value: "aunt_uncle", label: "Aunt/Uncle" },
  { value: "cousin", label: "Cousin" },
  { value: "friend", label: "Close Friend" },
  { value: "other", label: "Other" },
];

// Marital statuses that should hide spouse section
const SINGLE_STATUSES = ["single", "divorced", "widowed"];

function FamilyFormContent() {
  const {
    formData,
    updateField,
    setFormData,
    saveAndExit,
    saveAndContinue,
    isSubmitting,
    estatePlanId,
    completedSteps,
    isLoading,
    saveStatus,
    lastSaved,
    nextStepLabel,
    isFieldExtracted,
    hasExtractedData,
  } = useIntakeForm<FamilyData>("family", DEFAULT_DATA);

  // Fetch personal data to check marital status
  const { data: personalData } = useOtherSectionData<PersonalData>(
    estatePlanId,
    "personal"
  );

  // Determine if spouse section should be shown based on marital status
  const isSingle = personalData?.maritalStatus
    ? SINGLE_STATUSES.includes(personalData.maritalStatus)
    : false;

  // Check if there are any minor children
  const hasMinorChildren = formData.children.some((child) => child.isMinor);

  const addChild = () => {
    const newChild: Child = {
      id: Date.now().toString(),
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      relationship: "biological",
      isMinor: false,
      hasSpecialNeeds: false,
      specialNeedsDetails: "",
    };
    setFormData((prev) => ({
      ...prev,
      children: [...prev.children, newChild],
    }));
  };

  const updateChild = (id: string, field: keyof Child, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      children: prev.children.map((child) =>
        child.id === id ? { ...child, [field]: value } : child
      ),
    }));
  };

  const removeChild = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      children: prev.children.filter((child) => child.id !== id),
    }));
  };

  // Basic validation
  const canContinue = true; // Family info is optional

  if (!estatePlanId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No estate plan found. Please start from the beginning.
        </p>
        <a href="/intake" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
          Start New Estate Plan
        </a>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress */}
      <IntakeProgress
        currentStep="family"
        completedSteps={completedSteps}
        estatePlanId={estatePlanId}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Family Information
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Tell us about your family members. This helps us understand who may be beneficiaries or need provisions in your estate plan.
        </p>
        {hasExtractedData && (
          <div className="mt-4">
            <ExtractedDataBanner />
          </div>
        )}
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-8">
        {/* Spouse Information - Hidden if marital status is single/divorced/widowed */}
        {!isSingle && (
          <FormSection
            title="Spouse or Partner"
            description="Information about your spouse or domestic partner"
          >
            <Checkbox
              checked={formData.hasSpouse}
              onChange={(v) => updateField("hasSpouse", v)}
              label="I have a spouse or domestic partner"
              description="Check this if you are married or in a registered domestic partnership"
            />

            {formData.hasSpouse && (
              <div className="mt-4 pl-4 border-l-2 border-blue-200 dark:border-blue-800 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label={<span className="flex items-center gap-2">Spouse&apos;s First Name {isFieldExtracted("spouseFirstName") && <ExtractedBadge />}</span>}>
                    <TextInput
                      value={formData.spouseFirstName}
                      onChange={(v) => updateField("spouseFirstName", v)}
                      placeholder="Jane"
                    />
                  </FormField>
                  <FormField label={<span className="flex items-center gap-2">Spouse&apos;s Last Name {isFieldExtracted("spouseLastName") && <ExtractedBadge />}</span>}>
                    <TextInput
                      value={formData.spouseLastName}
                      onChange={(v) => updateField("spouseLastName", v)}
                      placeholder="Smith"
                    />
                  </FormField>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Spouse's Date of Birth">
                    <TextInput
                      type="date"
                      value={formData.spouseDateOfBirth}
                      onChange={(v) => updateField("spouseDateOfBirth", v)}
                    />
                  </FormField>
                  <div className="flex items-end">
                    <Checkbox
                      checked={formData.spouseIsUSCitizen}
                      onChange={(v) => updateField("spouseIsUSCitizen", v)}
                      label="U.S. Citizen"
                      description="Important for tax planning purposes"
                    />
                  </div>
                </div>
              </div>
            )}
          </FormSection>
        )}

        {/* Children */}
        <FormSection
          title="Children"
          description="Include all children (biological, adopted, and stepchildren)"
        >
          <Checkbox
            checked={formData.hasChildren}
            onChange={(v) => {
              updateField("hasChildren", v);
              if (!v) {
                setFormData((prev) => ({ ...prev, children: [] }));
              }
            }}
            label="I have children"
          />

          {formData.hasChildren && (
            <div className="mt-4 space-y-4">
              {formData.children.map((child, index) => (
                <div
                  key={child.id || `child-${index}`}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Child {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeChild(child.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField label="First Name">
                      <TextInput
                        value={child.firstName}
                        onChange={(v) => updateChild(child.id, "firstName", v)}
                        placeholder="First name"
                      />
                    </FormField>
                    <FormField label="Last Name">
                      <TextInput
                        value={child.lastName}
                        onChange={(v) => updateChild(child.id, "lastName", v)}
                        placeholder="Last name"
                      />
                    </FormField>
                    <FormField label="Date of Birth">
                      <TextInput
                        type="date"
                        value={child.dateOfBirth}
                        onChange={(v) => updateChild(child.id, "dateOfBirth", v)}
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Relationship">
                      <Select
                        value={child.relationship}
                        onChange={(v) => updateChild(child.id, "relationship", v)}
                        options={RELATIONSHIP_OPTIONS}
                      />
                    </FormField>
                    <div className="flex items-end">
                      <Checkbox
                        checked={child.isMinor}
                        onChange={(v) => updateChild(child.id, "isMinor", v)}
                        label="Minor (under 18)"
                      />
                    </div>
                  </div>

                  <Checkbox
                    checked={child.hasSpecialNeeds}
                    onChange={(v) => updateChild(child.id, "hasSpecialNeeds", v)}
                    label="Has special needs"
                    description="May require a special needs trust"
                  />

                  {child.hasSpecialNeeds && (
                    <FormField label="Special Needs Details">
                      <TextInput
                        value={child.specialNeedsDetails}
                        onChange={(v) => updateChild(child.id, "specialNeedsDetails", v)}
                        placeholder="Brief description of special needs"
                      />
                    </FormField>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addChild}
                className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600
                           rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-500
                           hover:text-blue-500 transition-colors"
              >
                + Add Child
              </button>
            </div>
          )}
        </FormSection>

        {/* Guardian for Minor Children - Only shown if there are minor children */}
        {hasMinorChildren && (
          <FormSection
            title="Guardian for Minor Children"
            description="If something happens to you, who should care for your minor children?"
          >
            <InfoBox type="info" title="Why This Matters">
              Naming a guardian ensures your children are cared for by someone you trust.
              Without this designation, a court will decide who raises your children.
            </InfoBox>

            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Preferred Guardian's Name" required>
                  <TextInput
                    value={formData.guardianName}
                    onChange={(v) => updateField("guardianName", v)}
                    placeholder="Full legal name"
                  />
                </FormField>
                <FormField label="Relationship">
                  <Select
                    value={formData.guardianRelationship}
                    onChange={(v) => updateField("guardianRelationship", v)}
                    options={GUARDIAN_RELATIONSHIP_OPTIONS}
                    placeholder="Select relationship"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Alternate Guardian's Name" hint="In case primary cannot serve">
                  <TextInput
                    value={formData.alternateGuardianName}
                    onChange={(v) => updateField("alternateGuardianName", v)}
                    placeholder="Full legal name"
                  />
                </FormField>
                <FormField label="Relationship">
                  <Select
                    value={formData.alternateGuardianRelationship}
                    onChange={(v) => updateField("alternateGuardianRelationship", v)}
                    options={GUARDIAN_RELATIONSHIP_OPTIONS}
                    placeholder="Select relationship"
                  />
                </FormField>
              </div>

              <FormField
                label="Special Instructions"
                hint="Optional guidance for raising your children"
              >
                <TextArea
                  value={formData.guardianInstructions}
                  onChange={(v) => updateField("guardianInstructions", v)}
                  placeholder="e.g., Religious upbringing preferences, education priorities, keep siblings together"
                  rows={3}
                />
              </FormField>
            </div>
          </FormSection>
        )}

        {/* Other Dependents */}
        <FormSection
          title="Other Dependents"
          description="Anyone else who depends on you financially"
        >
          <Checkbox
            checked={formData.hasOtherDependents}
            onChange={(v) => updateField("hasOtherDependents", v)}
            label="I have other dependents"
            description="e.g., elderly parents, siblings, other relatives"
          />

          {formData.hasOtherDependents && (
            <FormField label="Please describe">
              <TextInput
                value={formData.otherDependentsDetails}
                onChange={(v) => updateField("otherDependentsDetails", v)}
                placeholder="e.g., My elderly mother lives with us and requires care"
              />
            </FormField>
          )}
        </FormSection>

        {/* Parents */}
        <FormSection
          title="Parents"
          description="Information about your parents"
        >
          <FormField label="Parents' Status">
            <RadioGroup
              name="parentsLiving"
              value={formData.parentsLiving}
              onChange={(v) => updateField("parentsLiving", v)}
              options={PARENTS_OPTIONS}
            />
          </FormField>

          {(formData.parentsLiving === "both" ||
            formData.parentsLiving === "mother_only" ||
            formData.parentsLiving === "father_only") && (
            <Checkbox
              checked={formData.parentsCareNeeded}
              onChange={(v) => updateField("parentsCareNeeded", v)}
              label="My parent(s) may need care or financial support"
              description="This may affect your estate planning decisions"
            />
          )}
        </FormSection>

        {/* Pets */}
        <FormSection
          title="Pets"
          description="Do you have pets that need care provisions?"
        >
          <Checkbox
            checked={formData.hasPets}
            onChange={(v) => updateField("hasPets", v)}
            label="I have pets"
            description="You can include pet care instructions in your estate plan"
          />

          {formData.hasPets && (
            <FormField label="Please describe your pets">
              <TextInput
                value={formData.petsDetails}
                onChange={(v) => updateField("petsDetails", v)}
                placeholder="e.g., 2 dogs (Golden Retrievers), 1 cat"
              />
            </FormField>
          )}
        </FormSection>
      </div>

      {/* Navigation */}
      <IntakeNavigation
        currentStep="family"
        estatePlanId={estatePlanId}
        onSaveAndExit={saveAndExit}
        onSaveAndContinue={saveAndContinue}
        isSubmitting={isSubmitting}
        canContinue={canContinue}
        saveStatus={saveStatus}
        lastSaved={lastSaved}
        nextStepLabel={nextStepLabel}
      />
    </div>
  );
}

export default function FamilyPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <FamilyFormContent />
    </Suspense>
  );
}
