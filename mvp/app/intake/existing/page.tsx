"use client";

import { Suspense } from "react";
import IntakeProgress from "../../components/IntakeProgress";
import IntakeNavigation from "../../components/IntakeNavigation";
import { FormField, TextInput, RadioGroup, FormSection, TextArea } from "../../components/FormFields";
import { useIntakeForm } from "../useIntakeForm";
import GlossaryTooltip, { GlossaryHelpIcon } from "../../components/GlossaryTooltip";
import { ExtractedBadge, ExtractedDataBanner } from "../../components/ExtractedBadge";

interface ExistingDocsData {
  // Will
  hasWill: string; // yes, no, unsure
  willYear: string;
  willState: string;
  willConcerns: string;

  // Trust
  hasTrust: string;
  trustType: string;
  trustYear: string;
  trustConcerns: string;

  // Power of Attorney - Financial
  hasPOAFinancial: string;
  poaFinancialYear: string;
  poaFinancialAgent: string;

  // Power of Attorney - Healthcare
  hasPOAHealthcare: string;
  poaHealthcareYear: string;
  poaHealthcareAgent: string;

  // Healthcare Directive / Living Will
  hasHealthcareDirective: string;
  healthcareDirectiveYear: string;

  // HIPAA Authorization
  hasHIPAA: string;

  // Beneficiary Designations
  beneficiaryDesignationsReviewed: string;
  beneficiaryDesignationsYear: string;

  // Last Update
  lastComprehensiveReview: string;

  // General Notes
  additionalNotes: string;
}

const DEFAULT_DATA: ExistingDocsData = {
  hasWill: "",
  willYear: "",
  willState: "",
  willConcerns: "",
  hasTrust: "",
  trustType: "",
  trustYear: "",
  trustConcerns: "",
  hasPOAFinancial: "",
  poaFinancialYear: "",
  poaFinancialAgent: "",
  hasPOAHealthcare: "",
  poaHealthcareYear: "",
  poaHealthcareAgent: "",
  hasHealthcareDirective: "",
  healthcareDirectiveYear: "",
  hasHIPAA: "",
  beneficiaryDesignationsReviewed: "",
  beneficiaryDesignationsYear: "",
  lastComprehensiveReview: "",
  additionalNotes: "",
};

const YES_NO_UNSURE = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
];

const TRUST_TYPES = [
  { value: "revocable_living", label: "Revocable Living Trust" },
  { value: "irrevocable", label: "Irrevocable Trust" },
  { value: "special_needs", label: "Special Needs Trust" },
  { value: "other", label: "Other / Not sure" },
];

const REVIEW_TIMEFRAMES = [
  { value: "within_1_year", label: "Within the last year" },
  { value: "1_3_years", label: "1-3 years ago" },
  { value: "3_5_years", label: "3-5 years ago" },
  { value: "5_10_years", label: "5-10 years ago" },
  { value: "over_10_years", label: "More than 10 years ago" },
  { value: "never", label: "Never had a comprehensive review" },
];

function ExistingDocsFormContent() {
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
  } = useIntakeForm<ExistingDocsData>("existing", DEFAULT_DATA);

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
        currentStep="existing"
        completedSteps={completedSteps}
        estatePlanId={estatePlanId}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Existing Documents
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Tell us about any estate planning documents you already have. This helps us identify gaps and documents that may need updating.
        </p>
        {hasExtractedData && (
          <div className="mt-4">
            <ExtractedDataBanner />
          </div>
        )}
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-8">
        {/* Will */}
        <FormSection
          title={<>Last <GlossaryTooltip term="Will">Will</GlossaryTooltip> and Testament</>}
          description="A legal document that specifies how your assets should be distributed after death"
        >
          <FormField label="Do you have a will?">
            <RadioGroup
              name="hasWill"
              value={formData.hasWill}
              onChange={(v) => updateField("hasWill", v)}
              options={YES_NO_UNSURE}
            />
          </FormField>

          {formData.hasWill === "yes" && (
            <div className="space-y-4 mt-4 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="What year was it created/updated?">
                  <TextInput
                    value={formData.willYear}
                    onChange={(v) => updateField("willYear", v)}
                    placeholder="e.g., 2020"
                  />
                </FormField>
                <FormField label="Which state was it created in?">
                  <TextInput
                    value={formData.willState}
                    onChange={(v) => updateField("willState", v)}
                    placeholder="e.g., California"
                  />
                </FormField>
              </div>
              <FormField label="Any concerns or changes needed?">
                <TextInput
                  value={formData.willConcerns}
                  onChange={(v) => updateField("willConcerns", v)}
                  placeholder="e.g., Need to update executor, add new child"
                />
              </FormField>
            </div>
          )}
        </FormSection>

        {/* Trust */}
        <FormSection
          title={<GlossaryTooltip term="Trust">Trust</GlossaryTooltip>}
          description="A legal arrangement where a trustee holds and manages assets for beneficiaries"
        >
          <FormField label="Do you have a trust?">
            <RadioGroup
              name="hasTrust"
              value={formData.hasTrust}
              onChange={(v) => updateField("hasTrust", v)}
              options={YES_NO_UNSURE}
            />
          </FormField>

          {formData.hasTrust === "yes" && (
            <div className="space-y-4 mt-4 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
              <FormField label="Type of trust">
                <RadioGroup
                  name="trustType"
                  value={formData.trustType}
                  onChange={(v) => updateField("trustType", v)}
                  options={TRUST_TYPES}
                />
              </FormField>
              <FormField label="What year was it created/updated?">
                <TextInput
                  value={formData.trustYear}
                  onChange={(v) => updateField("trustYear", v)}
                  placeholder="e.g., 2019"
                />
              </FormField>
              <FormField label="Any concerns or changes needed?">
                <TextInput
                  value={formData.trustConcerns}
                  onChange={(v) => updateField("trustConcerns", v)}
                  placeholder="e.g., Need to add new assets, update trustees"
                />
              </FormField>
            </div>
          )}
        </FormSection>

        {/* POA Financial */}
        <FormSection
          title={<><GlossaryTooltip term="Power of Attorney">Power of Attorney</GlossaryTooltip> - Financial</>}
          description="Authorizes someone to make financial decisions on your behalf if you're unable to"
        >
          <FormField label="Do you have a financial power of attorney?">
            <RadioGroup
              name="hasPOAFinancial"
              value={formData.hasPOAFinancial}
              onChange={(v) => updateField("hasPOAFinancial", v)}
              options={YES_NO_UNSURE}
            />
          </FormField>

          {formData.hasPOAFinancial === "yes" && (
            <div className="space-y-4 mt-4 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="When was it created?">
                  <TextInput
                    value={formData.poaFinancialYear}
                    onChange={(v) => updateField("poaFinancialYear", v)}
                    placeholder="e.g., 2021"
                  />
                </FormField>
                <FormField label="Who is your agent?">
                  <TextInput
                    value={formData.poaFinancialAgent}
                    onChange={(v) => updateField("poaFinancialAgent", v)}
                    placeholder="e.g., Jane Smith (spouse)"
                  />
                </FormField>
              </div>
            </div>
          )}
        </FormSection>

        {/* POA Healthcare */}
        <FormSection
          title={<><GlossaryTooltip term="Power of Attorney">Power of Attorney</GlossaryTooltip> - Healthcare</>}
          description={<>Authorizes someone (your <GlossaryTooltip term="Healthcare Proxy">healthcare proxy</GlossaryTooltip>) to make medical decisions on your behalf if you&apos;re unable to</>}
        >
          <FormField label="Do you have a healthcare power of attorney?">
            <RadioGroup
              name="hasPOAHealthcare"
              value={formData.hasPOAHealthcare}
              onChange={(v) => updateField("hasPOAHealthcare", v)}
              options={YES_NO_UNSURE}
            />
          </FormField>

          {formData.hasPOAHealthcare === "yes" && (
            <div className="space-y-4 mt-4 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="When was it created?">
                  <TextInput
                    value={formData.poaHealthcareYear}
                    onChange={(v) => updateField("poaHealthcareYear", v)}
                    placeholder="e.g., 2021"
                  />
                </FormField>
                <FormField label="Who is your agent?">
                  <TextInput
                    value={formData.poaHealthcareAgent}
                    onChange={(v) => updateField("poaHealthcareAgent", v)}
                    placeholder="e.g., Jane Smith (spouse)"
                  />
                </FormField>
              </div>
            </div>
          )}
        </FormSection>

        {/* Healthcare Directive */}
        <FormSection
          title={<><GlossaryTooltip term="Healthcare Directive">Healthcare Directive</GlossaryTooltip> / <GlossaryTooltip term="Living Will">Living Will</GlossaryTooltip></>}
          description="Documents your wishes for medical treatment if you're unable to communicate"
        >
          <FormField label="Do you have a healthcare directive or living will?">
            <RadioGroup
              name="hasHealthcareDirective"
              value={formData.hasHealthcareDirective}
              onChange={(v) => updateField("hasHealthcareDirective", v)}
              options={YES_NO_UNSURE}
            />
          </FormField>

          {formData.hasHealthcareDirective === "yes" && (
            <div className="mt-4 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
              <FormField label="When was it created?">
                <TextInput
                  value={formData.healthcareDirectiveYear}
                  onChange={(v) => updateField("healthcareDirectiveYear", v)}
                  placeholder="e.g., 2020"
                />
              </FormField>
            </div>
          )}
        </FormSection>

        {/* HIPAA */}
        <FormSection
          title={<><GlossaryTooltip term="HIPAA Authorization">HIPAA Authorization</GlossaryTooltip></>}
          description="Allows designated people to access your medical information"
        >
          <FormField label="Do you have a HIPAA authorization?">
            <RadioGroup
              name="hasHIPAA"
              value={formData.hasHIPAA}
              onChange={(v) => updateField("hasHIPAA", v)}
              options={YES_NO_UNSURE}
            />
          </FormField>
        </FormSection>

        {/* Beneficiary Designations */}
        <FormSection
          title={<><GlossaryTooltip term="Beneficiary Designation">Beneficiary Designations</GlossaryTooltip></>}
          description={<><GlossaryTooltip term="Beneficiary">Beneficiaries</GlossaryTooltip> named on retirement accounts, life insurance, etc. These override your will.</>}
        >
          <FormField label="Have you reviewed your beneficiary designations recently?">
            <RadioGroup
              name="beneficiaryDesignationsReviewed"
              value={formData.beneficiaryDesignationsReviewed}
              onChange={(v) => updateField("beneficiaryDesignationsReviewed", v)}
              options={[
                { value: "yes", label: "Yes, they are current" },
                { value: "no", label: "No, they may be outdated" },
                { value: "unsure", label: "Not sure" },
              ]}
            />
          </FormField>

          {formData.beneficiaryDesignationsReviewed === "yes" && (
            <div className="mt-4 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
              <FormField label="When did you last review them?">
                <TextInput
                  value={formData.beneficiaryDesignationsYear}
                  onChange={(v) => updateField("beneficiaryDesignationsYear", v)}
                  placeholder="e.g., 2023"
                />
              </FormField>
            </div>
          )}
        </FormSection>

        {/* Last Review */}
        <FormSection
          title="Last Comprehensive Review"
          description="When did you last have a complete review of your estate plan?"
        >
          <FormField label="Last comprehensive review">
            <RadioGroup
              name="lastComprehensiveReview"
              value={formData.lastComprehensiveReview}
              onChange={(v) => updateField("lastComprehensiveReview", v)}
              options={REVIEW_TIMEFRAMES}
            />
          </FormField>
        </FormSection>

        {/* Additional Notes */}
        <FormSection
          title="Additional Notes"
          description="Anything else we should know about your existing documents?"
        >
          <FormField label="Additional information">
            <TextArea
              value={formData.additionalNotes}
              onChange={(v) => updateField("additionalNotes", v)}
              placeholder="e.g., I had documents prepared by an attorney in 2018 but never signed them, my spouse has separate documents, etc."
              rows={4}
            />
          </FormField>
        </FormSection>
      </div>

      {/* Navigation */}
      <IntakeNavigation
        currentStep="existing"
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

export default function ExistingDocsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ExistingDocsFormContent />
    </Suspense>
  );
}
