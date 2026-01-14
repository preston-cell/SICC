"use client";

import { Suspense } from "react";
import IntakeProgress from "../../components/IntakeProgress";
import IntakeNavigation from "../../components/IntakeNavigation";
import { FormField, TextInput, RadioGroup, FormSection, TextArea, Checkbox } from "../../components/FormFields";
import { useIntakeForm } from "../useIntakeForm";
import GlossaryTooltip, { GlossaryHelpIcon } from "../../components/GlossaryTooltip";
import { ExtractedBadge, ExtractedDataBanner } from "../../components/ExtractedBadge";

interface GoalsData {
  // Primary Beneficiaries
  primaryBeneficiaryPlan: string;
  primaryBeneficiaryDetails: string;

  // Executor
  executorPreference: string;
  executorName: string;
  executorRelationship: string;
  alternateExecutorName: string;

  // Guardian for Minors
  hasMinorChildren: boolean;
  guardianName: string;
  guardianRelationship: string;
  alternateGuardianName: string;
  guardianInstructions: string;

  // Healthcare Wishes
  lifeSupportPreference: string;
  organDonation: string;
  additionalHealthcareWishes: string;

  // End of Life
  funeralPreference: string;
  funeralDetails: string;
  burialPreference: string;

  // Charitable Giving
  charitableGiving: boolean;
  charitableDetails: string;

  // Special Considerations
  hasSpecialConsiderations: boolean;
  blendedFamily: boolean;
  blendedFamilyDetails: string;
  internationalAssets: boolean;
  internationalDetails: string;
  specialNeedsBeneficiary: boolean;
  specialNeedsDetails: string;
  businessSuccession: boolean;
  businessSuccessionDetails: string;

  // Priorities
  topPriorities: string;

  // Additional Goals
  additionalGoals: string;
}

const DEFAULT_DATA: GoalsData = {
  primaryBeneficiaryPlan: "",
  primaryBeneficiaryDetails: "",
  executorPreference: "",
  executorName: "",
  executorRelationship: "",
  alternateExecutorName: "",
  hasMinorChildren: false,
  guardianName: "",
  guardianRelationship: "",
  alternateGuardianName: "",
  guardianInstructions: "",
  lifeSupportPreference: "",
  organDonation: "",
  additionalHealthcareWishes: "",
  funeralPreference: "",
  funeralDetails: "",
  burialPreference: "",
  charitableGiving: false,
  charitableDetails: "",
  hasSpecialConsiderations: false,
  blendedFamily: false,
  blendedFamilyDetails: "",
  internationalAssets: false,
  internationalDetails: "",
  specialNeedsBeneficiary: false,
  specialNeedsDetails: "",
  businessSuccession: false,
  businessSuccessionDetails: "",
  topPriorities: "",
  additionalGoals: "",
};

const BENEFICIARY_PLANS = [
  { value: "spouse_then_children", label: "Everything to spouse, then to children equally", description: "Most common for married couples with children" },
  { value: "spouse_only", label: "Everything to spouse", description: "No children or spouse will handle distribution" },
  { value: "children_equally", label: "Directly to children equally", description: "Common for single parents or widowed individuals" },
  { value: "children_unequally", label: "To children in unequal shares", description: "Different amounts to different children" },
  { value: "custom", label: "Custom distribution", description: "I have specific wishes to describe" },
];

const EXECUTOR_PREFERENCES = [
  { value: "spouse", label: "My spouse/partner" },
  { value: "child", label: "One of my children" },
  { value: "sibling", label: "A sibling" },
  { value: "friend", label: "A trusted friend" },
  { value: "professional", label: "A professional (attorney, bank, etc.)" },
  { value: "other", label: "Someone else" },
];

const LIFE_SUPPORT_OPTIONS = [
  { value: "all_measures", label: "I want all possible measures to extend my life" },
  { value: "comfort_only", label: "I want comfort care only (no artificial life support)" },
  { value: "limited", label: "I want limited intervention (case-by-case basis)" },
  { value: "unsure", label: "I'm not sure / need to think about it" },
];

const ORGAN_DONATION_OPTIONS = [
  { value: "yes_all", label: "Yes, I want to donate any needed organs and tissues" },
  { value: "yes_limited", label: "Yes, but only specific organs/tissues" },
  { value: "no", label: "No, I do not want to be an organ donor" },
  { value: "unsure", label: "I'm not sure" },
];

const FUNERAL_OPTIONS = [
  { value: "traditional", label: "Traditional funeral service" },
  { value: "memorial", label: "Memorial service (no body present)" },
  { value: "simple", label: "Simple/minimal service" },
  { value: "celebration", label: "Celebration of life" },
  { value: "none", label: "No service" },
  { value: "unsure", label: "No preference / family can decide" },
];

const BURIAL_OPTIONS = [
  { value: "burial", label: "Traditional burial" },
  { value: "cremation", label: "Cremation" },
  { value: "green_burial", label: "Green/natural burial" },
  { value: "other", label: "Other" },
  { value: "unsure", label: "No preference / family can decide" },
];

function GoalsFormContent() {
  const {
    formData,
    updateField,
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
  } = useIntakeForm<GoalsData>("goals", DEFAULT_DATA);

  const canContinue = true;

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
        currentStep="goals"
        completedSteps={completedSteps}
        estatePlanId={estatePlanId}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Goals & Wishes
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Tell us about your wishes for your estate and end-of-life preferences. This is the most important part - it&apos;s about what matters most to you.
        </p>
        {hasExtractedData && (
          <div className="mt-4">
            <ExtractedDataBanner />
          </div>
        )}
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-8">
        {/* Primary Beneficiaries */}
        <FormSection
          title="Distribution of Assets"
          description="How would you like your assets distributed after you pass?"
        >
          <FormField label="Primary distribution plan">
            <RadioGroup
              name="primaryBeneficiaryPlan"
              value={formData.primaryBeneficiaryPlan}
              onChange={(v) => updateField("primaryBeneficiaryPlan", v)}
              options={BENEFICIARY_PLANS}
            />
          </FormField>

          {(formData.primaryBeneficiaryPlan === "custom" ||
            formData.primaryBeneficiaryPlan === "children_unequally") && (
            <FormField label="Please describe your wishes">
              <TextArea
                value={formData.primaryBeneficiaryDetails}
                onChange={(v) => updateField("primaryBeneficiaryDetails", v)}
                placeholder="e.g., 50% to spouse, 25% to each child, specific items to specific people, etc."
                rows={4}
              />
            </FormField>
          )}
        </FormSection>

        {/* Executor */}
        <FormSection
          title={<><GlossaryTooltip term="Executor">Executor</GlossaryTooltip> / Personal Representative</>}
          description="Who should manage your estate after you pass?"
        >
          <FormField label="Who would you like to serve as executor?">
            <RadioGroup
              name="executorPreference"
              value={formData.executorPreference}
              onChange={(v) => updateField("executorPreference", v)}
              options={EXECUTOR_PREFERENCES}
            />
          </FormField>

          {formData.executorPreference && formData.executorPreference !== "unsure" && (
            <div className="space-y-4 mt-4 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Executor's full name">
                  <TextInput
                    value={formData.executorName}
                    onChange={(v) => updateField("executorName", v)}
                    placeholder="Full legal name"
                  />
                </FormField>
                <FormField label="Relationship to you">
                  <TextInput
                    value={formData.executorRelationship}
                    onChange={(v) => updateField("executorRelationship", v)}
                    placeholder="e.g., Spouse, Son, Attorney"
                  />
                </FormField>
              </div>
              <FormField label="Alternate executor (backup)">
                <TextInput
                  value={formData.alternateExecutorName}
                  onChange={(v) => updateField("alternateExecutorName", v)}
                  placeholder="Full name of backup executor"
                />
              </FormField>
            </div>
          )}
        </FormSection>

        {/* Guardian for Minors */}
        <FormSection
          title={<><GlossaryTooltip term="Guardian">Guardian</GlossaryTooltip> for Minor Children</>}
          description="If you have minor children, who should care for them?"
        >
          <Checkbox
            checked={formData.hasMinorChildren}
            onChange={(v) => updateField("hasMinorChildren", v)}
            label="I have minor children who need a guardian designation"
          />

          {formData.hasMinorChildren && (
            <div className="space-y-4 mt-4 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Preferred guardian's name">
                  <TextInput
                    value={formData.guardianName}
                    onChange={(v) => updateField("guardianName", v)}
                    placeholder="Full legal name"
                  />
                </FormField>
                <FormField label="Relationship">
                  <TextInput
                    value={formData.guardianRelationship}
                    onChange={(v) => updateField("guardianRelationship", v)}
                    placeholder="e.g., Sister, Brother, Friend"
                  />
                </FormField>
              </div>
              <FormField label="Alternate guardian">
                <TextInput
                  value={formData.alternateGuardianName}
                  onChange={(v) => updateField("alternateGuardianName", v)}
                  placeholder="Full name of backup guardian"
                />
              </FormField>
              <FormField label="Any special instructions for raising your children?">
                <TextArea
                  value={formData.guardianInstructions}
                  onChange={(v) => updateField("guardianInstructions", v)}
                  placeholder="e.g., Religious upbringing preferences, education priorities, keeping siblings together"
                  rows={3}
                />
              </FormField>
            </div>
          )}
        </FormSection>

        {/* Healthcare Wishes */}
        <FormSection
          title="Healthcare Wishes"
          description="Your preferences for medical care if you cannot communicate"
        >
          <FormField label="Life-sustaining treatment preferences">
            <RadioGroup
              name="lifeSupportPreference"
              value={formData.lifeSupportPreference}
              onChange={(v) => updateField("lifeSupportPreference", v)}
              options={LIFE_SUPPORT_OPTIONS}
            />
          </FormField>

          <FormField label="Organ donation">
            <RadioGroup
              name="organDonation"
              value={formData.organDonation}
              onChange={(v) => updateField("organDonation", v)}
              options={ORGAN_DONATION_OPTIONS}
            />
          </FormField>

          <FormField label="Additional healthcare wishes">
            <TextArea
              value={formData.additionalHealthcareWishes}
              onChange={(v) => updateField("additionalHealthcareWishes", v)}
              placeholder="Any other healthcare preferences or instructions"
              rows={3}
            />
          </FormField>
        </FormSection>

        {/* Funeral & Burial */}
        <FormSection
          title="Funeral & Final Arrangements"
          description="Your preferences for services and remains"
        >
          <FormField label="Service preference">
            <RadioGroup
              name="funeralPreference"
              value={formData.funeralPreference}
              onChange={(v) => updateField("funeralPreference", v)}
              options={FUNERAL_OPTIONS}
            />
          </FormField>

          <FormField label="Burial/cremation preference">
            <RadioGroup
              name="burialPreference"
              value={formData.burialPreference}
              onChange={(v) => updateField("burialPreference", v)}
              options={BURIAL_OPTIONS}
            />
          </FormField>

          <FormField label="Additional details or wishes">
            <TextArea
              value={formData.funeralDetails}
              onChange={(v) => updateField("funeralDetails", v)}
              placeholder="e.g., Specific cemetery, songs to play, people to notify"
              rows={3}
            />
          </FormField>
        </FormSection>

        {/* Charitable Giving */}
        <FormSection
          title="Charitable Giving"
          description="Optional: Leave gifts to charity"
        >
          <Checkbox
            checked={formData.charitableGiving}
            onChange={(v) => updateField("charitableGiving", v)}
            label="I want to leave something to charity"
          />

          {formData.charitableGiving && (
            <FormField label="Which organizations and how much?">
              <TextArea
                value={formData.charitableDetails}
                onChange={(v) => updateField("charitableDetails", v)}
                placeholder="e.g., $5,000 to local food bank, 5% to church"
                rows={2}
              />
            </FormField>
          )}
        </FormSection>

        {/* Special Considerations - Opt-in */}
        <FormSection
          title="Special Situations"
          description="Do any of these apply to you? (Optional)"
        >
          <Checkbox
            checked={formData.hasSpecialConsiderations}
            onChange={(v) => updateField("hasSpecialConsiderations", v)}
            label="I have a special situation to address"
            description="Blended family, special needs beneficiary, business ownership, or international assets"
          />

          {formData.hasSpecialConsiderations && (
            <div className="space-y-4 mt-4 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
              <Checkbox
                checked={formData.blendedFamily}
                onChange={(v) => updateField("blendedFamily", v)}
                label="Blended family"
                description="Children from different relationships, stepchildren"
              />
              {formData.blendedFamily && (
                <FormField label="Please explain">
                  <TextArea
                    value={formData.blendedFamilyDetails}
                    onChange={(v) => updateField("blendedFamilyDetails", v)}
                    placeholder="Describe your family situation"
                    rows={2}
                  />
                </FormField>
              )}

              <Checkbox
                checked={formData.specialNeedsBeneficiary}
                onChange={(v) => updateField("specialNeedsBeneficiary", v)}
                label={<>Beneficiary with special needs <GlossaryHelpIcon term="Special Needs Trust" /></>}
                description="May require a special needs trust"
              />
              {formData.specialNeedsBeneficiary && (
                <FormField label="Please explain">
                  <TextArea
                    value={formData.specialNeedsDetails}
                    onChange={(v) => updateField("specialNeedsDetails", v)}
                    placeholder="Describe the situation"
                    rows={2}
                  />
                </FormField>
              )}

              <Checkbox
                checked={formData.businessSuccession}
                onChange={(v) => updateField("businessSuccession", v)}
                label="I own a business"
                description="We'll help plan for what happens to it"
              />
              {formData.businessSuccession && (
                <FormField label="Who should take over the business?">
                  <TextArea
                    value={formData.businessSuccessionDetails}
                    onChange={(v) => updateField("businessSuccessionDetails", v)}
                    placeholder="e.g., My son John, sell to partner, close it down"
                    rows={2}
                  />
                </FormField>
              )}

              <Checkbox
                checked={formData.internationalAssets}
                onChange={(v) => updateField("internationalAssets", v)}
                label="International assets or beneficiaries"
                description="Property abroad or beneficiaries in other countries"
              />
              {formData.internationalAssets && (
                <FormField label="Please explain">
                  <TextArea
                    value={formData.internationalDetails}
                    onChange={(v) => updateField("internationalDetails", v)}
                    placeholder="Describe international considerations"
                    rows={2}
                  />
                </FormField>
              )}
            </div>
          )}
        </FormSection>

        {/* Top Priorities */}
        <FormSection
          title="Your Top Priorities"
          description="What matters most to you in your estate plan?"
        >
          <FormField label="What are your most important goals?">
            <TextArea
              value={formData.topPriorities}
              onChange={(v) => updateField("topPriorities", v)}
              placeholder="e.g., Making sure my children are cared for, minimizing taxes, keeping the family business in the family, providing for my spouse"
              rows={4}
            />
          </FormField>

          <FormField label="Anything else you'd like to share?">
            <TextArea
              value={formData.additionalGoals}
              onChange={(v) => updateField("additionalGoals", v)}
              placeholder="Any other goals, concerns, or wishes"
              rows={4}
            />
          </FormField>
        </FormSection>
      </div>

      {/* Navigation */}
      <IntakeNavigation
        currentStep="goals"
        estatePlanId={estatePlanId}
        onSaveAndExit={saveAndExit}
        onSaveAndContinue={saveAndContinue}
        isSubmitting={isSubmitting}
        canContinue={canContinue}
        saveStatus={saveStatus}
        lastSaved={lastSaved}
        nextStepLabel={nextStepLabel}
        isLastStep={true}
      />
    </div>
  );
}

export default function GoalsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <GoalsFormContent />
    </Suspense>
  );
}
