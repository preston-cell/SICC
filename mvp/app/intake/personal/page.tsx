"use client";

import { Suspense } from "react";
import IntakeProgress from "../../components/IntakeProgress";
import IntakeNavigation from "../../components/IntakeNavigation";
import { FormField, TextInput, Select, RadioGroup, FormSection, InfoBox } from "../../components/FormFields";
import { useIntakeForm, US_STATES } from "../useIntakeForm";
import { SkeletonForm } from "../../components/ui/Skeleton";
import { ExtractedBadge, ExtractedDataBanner } from "../../components/ExtractedBadge";

interface PersonalData {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  maritalStatus: string;
  citizenship: string;
}

const DEFAULT_DATA: PersonalData = {
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  dateOfBirth: "",
  email: "",
  phone: "",
  streetAddress: "",
  city: "",
  state: "",
  zipCode: "",
  maritalStatus: "",
  citizenship: "us_citizen",
};

const MARITAL_STATUS_OPTIONS = [
  { value: "single", label: "Single", description: "Never been married" },
  { value: "married", label: "Married", description: "Currently legally married" },
  { value: "divorced", label: "Divorced", description: "Previously married, now legally divorced" },
  { value: "widowed", label: "Widowed", description: "Spouse has passed away" },
  { value: "separated", label: "Legally Separated", description: "Married but legally separated" },
  { value: "domestic_partnership", label: "Domestic Partnership", description: "Registered domestic partnership" },
];

const SUFFIX_OPTIONS = [
  { value: "", label: "None" },
  { value: "Jr.", label: "Jr." },
  { value: "Sr.", label: "Sr." },
  { value: "II", label: "II" },
  { value: "III", label: "III" },
  { value: "IV", label: "IV" },
];

function PersonalFormContent() {
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
  } = useIntakeForm<PersonalData>("personal", DEFAULT_DATA);

  // Validate required fields
  const canContinue =
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    formData.dateOfBirth !== "" &&
    formData.state !== "" &&
    formData.maritalStatus !== "";

  if (!estatePlanId) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg className="w-16 h-16 mx-auto text-[var(--text-caption)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-xl font-semibold text-[var(--text-heading)] mb-2">
            No Estate Plan Found
          </h2>
          <p className="text-[var(--text-muted)] mb-4">
            Please start from the beginning to create your estate plan.
          </p>
          <a
            href="/intake"
            className="inline-flex items-center px-4 py-2 bg-[var(--accent-purple)] text-white rounded-lg hover:opacity-90 transition-colors"
          >
            Start New Estate Plan
          </a>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-20 bg-[var(--off-white)] rounded-lg animate-pulse" />
        <div className="bg-white rounded-xl shadow-sm p-6">
          <SkeletonForm />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Progress */}
      <IntakeProgress
        currentStep="personal"
        completedSteps={completedSteps}
        estatePlanId={estatePlanId}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-heading)]">
          Personal Information
        </h1>
        <p className="text-[var(--text-body)] mt-2">
          Let&apos;s start with your basic information. This will be used to personalize your estate planning documents.
        </p>
        {hasExtractedData && (
          <div className="mt-4">
            <ExtractedDataBanner />
          </div>
        )}
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-6 md:p-8 space-y-8">
        {/* Legal Name */}
        <FormSection
          title="Legal Name"
          description="Enter your full legal name exactly as it appears on official documents like your driver's license or passport"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label={<span className="flex items-center gap-2">First Name {isFieldExtracted("firstName") && <ExtractedBadge />}</span>}
              required
            >
              <TextInput
                value={formData.firstName}
                onChange={(v) => updateField("firstName", v)}
                placeholder="John"
                autoComplete="given-name"
              />
            </FormField>
            <FormField label="Middle Name" hint="Optional">
              <TextInput
                value={formData.middleName}
                onChange={(v) => updateField("middleName", v)}
                placeholder="William"
                autoComplete="additional-name"
              />
            </FormField>
            <FormField
              label={<span className="flex items-center gap-2">Last Name {isFieldExtracted("lastName") && <ExtractedBadge />}</span>}
              required
            >
              <TextInput
                value={formData.lastName}
                onChange={(v) => updateField("lastName", v)}
                placeholder="Smith"
                autoComplete="family-name"
              />
            </FormField>
            <FormField label="Suffix" hint="Jr., Sr., III, etc.">
              <Select
                value={formData.suffix}
                onChange={(v) => updateField("suffix", v)}
                options={SUFFIX_OPTIONS}
                placeholder="Select suffix (if any)"
              />
            </FormField>
          </div>
        </FormSection>

        {/* Date of Birth */}
        <FormSection
          title="Date of Birth"
          description="Your age may affect certain estate planning strategies"
        >
          <div className="max-w-xs">
            <FormField label="Date of Birth" required>
              <TextInput
                type="date"
                value={formData.dateOfBirth}
                onChange={(v) => updateField("dateOfBirth", v)}
              />
            </FormField>
          </div>
        </FormSection>

        {/* Contact Information */}
        <FormSection
          title="Contact Information"
          description="How can we reach you regarding your estate plan?"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Email Address" helpText="We'll use this to send you important updates">
              <TextInput
                type="email"
                value={formData.email}
                onChange={(v) => updateField("email", v)}
                placeholder="john.smith@email.com"
                autoComplete="email"
                inputMode="email"
              />
            </FormField>
            <FormField label="Phone Number">
              <TextInput
                type="tel"
                value={formData.phone}
                onChange={(v) => updateField("phone", v)}
                placeholder="(555) 123-4567"
                autoComplete="tel"
                inputMode="tel"
              />
            </FormField>
          </div>
        </FormSection>

        {/* Address */}
        <FormSection
          title="Current Address"
          description="Your state of residence determines which laws apply to your estate plan"
        >
          <FormField label="Street Address">
            <TextInput
              value={formData.streetAddress}
              onChange={(v) => updateField("streetAddress", v)}
              placeholder="123 Main Street"
              autoComplete="street-address"
            />
          </FormField>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="City">
              <TextInput
                value={formData.city}
                onChange={(v) => updateField("city", v)}
                placeholder="San Francisco"
                autoComplete="address-level2"
              />
            </FormField>
            <FormField
              label={<span className="flex items-center gap-2">State {isFieldExtracted("state") && <ExtractedBadge />}</span>}
              required
              helpText="This determines which state laws apply to your estate"
            >
              <Select
                value={formData.state}
                onChange={(v) => updateField("state", v)}
                options={US_STATES}
                placeholder="Select state"
              />
            </FormField>
            <FormField label="ZIP Code">
              <TextInput
                value={formData.zipCode}
                onChange={(v) => updateField("zipCode", v)}
                placeholder="94102"
                autoComplete="postal-code"
                inputMode="numeric"
                maxLength={10}
              />
            </FormField>
          </div>
        </FormSection>

        {/* Marital Status */}
        <FormSection
          title="Marital Status"
          description="Your marital status significantly impacts how your estate is distributed"
        >
          <FormField
            label={<span className="flex items-center gap-2">Current Marital Status {isFieldExtracted("maritalStatus") && <ExtractedBadge />}</span>}
            required
          >
            <RadioGroup
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={(v) => updateField("maritalStatus", v)}
              options={MARITAL_STATUS_OPTIONS}
              columns={2}
            />
          </FormField>

          {formData.maritalStatus === "married" && (
            <InfoBox type="info" title="Married Couples">
              In the next section, we&apos;ll ask about your spouse. Many estate planning documents require spousal information, and some states have community property laws that affect asset distribution.
            </InfoBox>
          )}
        </FormSection>
      </div>

      {/* Navigation */}
      <IntakeNavigation
        currentStep="personal"
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

export default function PersonalPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <div className="h-20 bg-[var(--off-white)] rounded-lg animate-pulse" />
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <SkeletonForm />
          </div>
        </div>
      }
    >
      <PersonalFormContent />
    </Suspense>
  );
}
