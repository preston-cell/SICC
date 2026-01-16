"use client";

import { Suspense, useState, useMemo } from "react";
import IntakeProgress from "../../components/IntakeProgress";
import IntakeNavigation from "../../components/IntakeNavigation";
import { FormField, TextInput, Select, RadioGroup, FormSection, Checkbox, TextArea, InfoBox } from "../../components/FormFields";
import { useIntakeForm, useOtherSectionData, getCurrentYear } from "../useIntakeForm";
import GlossaryTooltip, { GlossaryHelpIcon } from "../../components/GlossaryTooltip";
import { ExtractedBadge, ExtractedDataBanner } from "../../components/ExtractedBadge";

// Existing docs data interface for cross-section check
interface ExistingDocsData {
  beneficiaryDesignationsReviewed: string;
  beneficiaryDesignationsYear: string;
}

// Beneficiary designation interface
interface BeneficiaryDesignation {
  id: string;
  assetType: string;
  assetName: string;
  institution: string;
  estimatedValue: string;
  primaryBeneficiaryName: string;
  primaryBeneficiaryRelationship: string;
  primaryBeneficiaryPercentage: number;
  contingentBeneficiaryName: string;
  contingentBeneficiaryRelationship: string;
  contingentBeneficiaryPercentage: number;
  lastReviewedDate: string;
  notes: string;
}

interface AssetsData {
  // Real Estate
  hasPrimaryHome: boolean;
  primaryHomeValue: string;
  primaryHomeMortgage: boolean;
  hasOtherRealEstate: boolean;
  otherRealEstateDetails: string;

  // Financial Accounts
  hasBankAccounts: boolean;
  bankAccountsValue: string;
  hasInvestmentAccounts: boolean;
  investmentAccountsValue: string;
  hasRetirementAccounts: boolean;
  retirementAccountsValue: string;
  retirementAccountTypes: string[];
  hasCryptocurrency: boolean;
  cryptocurrencyDetails: string;
  cryptocurrencyValue: string;

  // Business Interests
  hasBusinessInterests: boolean;
  businessDetails: string;
  businessValue: string;

  // Insurance
  hasLifeInsurance: boolean;
  lifeInsuranceValue: string;
  lifeInsuranceBeneficiaries: string;

  // Other Assets
  hasVehicles: boolean;
  vehiclesDetails: string;
  hasValuables: boolean;
  valuablesDetails: string;
  hasSafeDepositBox: boolean;
  safeDepositBoxLocation: string;
  safeDepositBoxContents: string;
  hasOtherAssets: boolean;
  otherAssetsDetails: string;

  // Debts
  hasSignificantDebts: boolean;
  debtsDetails: string;

  // Total Estimate
  estimatedTotalValue: string;

  // Beneficiary Designations
  beneficiaryDesignations: BeneficiaryDesignation[];
  hasBeneficiaryDesignations: boolean;
}

const DEFAULT_DATA: AssetsData = {
  hasPrimaryHome: false,
  primaryHomeValue: "",
  primaryHomeMortgage: false,
  hasOtherRealEstate: false,
  otherRealEstateDetails: "",
  hasBankAccounts: false,
  bankAccountsValue: "",
  hasInvestmentAccounts: false,
  investmentAccountsValue: "",
  hasRetirementAccounts: false,
  retirementAccountsValue: "",
  retirementAccountTypes: [],
  hasCryptocurrency: false,
  cryptocurrencyDetails: "",
  cryptocurrencyValue: "",
  hasBusinessInterests: false,
  businessDetails: "",
  businessValue: "",
  hasLifeInsurance: false,
  lifeInsuranceValue: "",
  lifeInsuranceBeneficiaries: "",
  hasVehicles: false,
  vehiclesDetails: "",
  hasValuables: false,
  valuablesDetails: "",
  hasSafeDepositBox: false,
  safeDepositBoxLocation: "",
  safeDepositBoxContents: "",
  hasOtherAssets: false,
  otherAssetsDetails: "",
  hasSignificantDebts: false,
  debtsDetails: "",
  estimatedTotalValue: "",
  beneficiaryDesignations: [],
  hasBeneficiaryDesignations: false,
};

const VALUE_RANGES = [
  { value: "under_100k", label: "Under $100,000" },
  { value: "100k_250k", label: "$100,000 - $250,000" },
  { value: "250k_500k", label: "$250,000 - $500,000" },
  { value: "500k_1m", label: "$500,000 - $1 million" },
  { value: "1m_2m", label: "$1 million - $2 million" },
  { value: "2m_5m", label: "$2 million - $5 million" },
  { value: "5m_10m", label: "$5 million - $10 million" },
  { value: "over_10m", label: "Over $10 million" },
];

// Midpoint values for auto-calculation (using conservative midpoint estimates)
const VALUE_RANGE_MIDPOINTS: Record<string, number> = {
  "under_100k": 50000,
  "100k_250k": 175000,
  "250k_500k": 375000,
  "500k_1m": 750000,
  "1m_2m": 1500000,
  "2m_5m": 3500000,
  "5m_10m": 7500000,
  "over_10m": 15000000,
};

// Helper to convert value range to numeric estimate
function getValueEstimate(rangeValue: string): number {
  return VALUE_RANGE_MIDPOINTS[rangeValue] || 0;
}

// Helper to find the appropriate range for a calculated value
function getValueRangeForAmount(amount: number): string {
  if (amount <= 0) return "";
  if (amount < 100000) return "under_100k";
  if (amount < 250000) return "100k_250k";
  if (amount < 500000) return "250k_500k";
  if (amount < 1000000) return "500k_1m";
  if (amount < 2000000) return "1m_2m";
  if (amount < 5000000) return "2m_5m";
  if (amount < 10000000) return "5m_10m";
  return "over_10m";
}

// Helper to format currency
function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  return `$${(amount / 1000).toFixed(0)}K`;
}

const RETIREMENT_ACCOUNT_TYPES = [
  { value: "401k", label: "401(k)" },
  { value: "403b", label: "403(b)" },
  { value: "ira", label: "Traditional IRA" },
  { value: "roth_ira", label: "Roth IRA" },
  { value: "sep_ira", label: "SEP IRA" },
  { value: "pension", label: "Pension" },
  { value: "other", label: "Other" },
];

const BENEFICIARY_ASSET_TYPES = [
  { value: "retirement_401k", label: "401(k)", category: "Retirement" },
  { value: "retirement_ira", label: "IRA", category: "Retirement" },
  { value: "retirement_roth", label: "Roth IRA", category: "Retirement" },
  { value: "retirement_pension", label: "Pension", category: "Retirement" },
  { value: "retirement_other", label: "Other Retirement", category: "Retirement" },
  { value: "life_insurance", label: "Life Insurance", category: "Insurance" },
  { value: "annuity", label: "Annuity", category: "Insurance" },
  { value: "bank_pod", label: "Bank Account (POD)", category: "Transfer on Death" },
  { value: "brokerage_tod", label: "Brokerage (TOD)", category: "Transfer on Death" },
  { value: "real_estate_tod", label: "Real Estate (TOD)", category: "Transfer on Death" },
  { value: "other", label: "Other", category: "Other" },
];

const RELATIONSHIP_OPTIONS = [
  { value: "spouse", label: "Spouse" },
  { value: "child", label: "Child" },
  { value: "parent", label: "Parent" },
  { value: "sibling", label: "Sibling" },
  { value: "grandchild", label: "Grandchild" },
  { value: "trust", label: "Trust" },
  { value: "charity", label: "Charity" },
  { value: "estate", label: "Estate" },
  { value: "other", label: "Other" },
];

// Helper to create a new empty beneficiary designation
function createEmptyDesignation(): BeneficiaryDesignation {
  return {
    id: `bd_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    assetType: "",
    assetName: "",
    institution: "",
    estimatedValue: "",
    primaryBeneficiaryName: "",
    primaryBeneficiaryRelationship: "",
    primaryBeneficiaryPercentage: 100,
    contingentBeneficiaryName: "",
    contingentBeneficiaryRelationship: "",
    contingentBeneficiaryPercentage: 100,
    lastReviewedDate: "",
    notes: "",
  };
}

function AssetsFormContent() {
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
  } = useIntakeForm<AssetsData>("assets", DEFAULT_DATA);

  // Fetch existing docs data to check if beneficiaries were already confirmed
  const { data: existingDocsData } = useOtherSectionData<ExistingDocsData>(
    estatePlanId,
    "existing_documents"
  );

  // Check if beneficiary designations were already reviewed and confirmed
  const beneficiariesAlreadyConfirmed = existingDocsData?.beneficiaryDesignationsReviewed === "yes";
  const beneficiariesReviewYear = existingDocsData?.beneficiaryDesignationsYear || "";

  // Get current year for dynamic placeholders
  const currentYear = getCurrentYear();
  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });

  const toggleRetirementType = (type: string) => {
    setFormData((prev) => {
      const types = prev.retirementAccountTypes;
      if (types.includes(type)) {
        return { ...prev, retirementAccountTypes: types.filter((t) => t !== type) };
      } else {
        return { ...prev, retirementAccountTypes: [...types, type] };
      }
    });
  };

  // Beneficiary designation management
  const addBeneficiaryDesignation = () => {
    setFormData((prev) => ({
      ...prev,
      beneficiaryDesignations: [...prev.beneficiaryDesignations, createEmptyDesignation()],
    }));
  };

  const removeBeneficiaryDesignation = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      beneficiaryDesignations: prev.beneficiaryDesignations.filter((d) => d.id !== id),
    }));
  };

  const updateBeneficiaryDesignation = (id: string, field: keyof BeneficiaryDesignation, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      beneficiaryDesignations: prev.beneficiaryDesignations.map((d) =>
        d.id === id ? { ...d, [field]: value } : d
      ),
    }));
  };

  const canContinue = true;

  // Auto-calculate total estate value from individual asset values
  const calculatedEstateValue = useMemo(() => {
    let total = 0;

    // Real Estate
    if (formData.hasPrimaryHome && formData.primaryHomeValue) {
      total += getValueEstimate(formData.primaryHomeValue);
    }

    // Financial Accounts
    if (formData.hasBankAccounts && formData.bankAccountsValue) {
      total += getValueEstimate(formData.bankAccountsValue);
    }
    if (formData.hasInvestmentAccounts && formData.investmentAccountsValue) {
      total += getValueEstimate(formData.investmentAccountsValue);
    }
    if (formData.hasRetirementAccounts && formData.retirementAccountsValue) {
      total += getValueEstimate(formData.retirementAccountsValue);
    }
    if (formData.hasCryptocurrency && formData.cryptocurrencyValue) {
      total += getValueEstimate(formData.cryptocurrencyValue);
    }

    // Business
    if (formData.hasBusinessInterests && formData.businessValue) {
      total += getValueEstimate(formData.businessValue);
    }

    // Life Insurance (death benefit)
    if (formData.hasLifeInsurance && formData.lifeInsuranceValue) {
      total += getValueEstimate(formData.lifeInsuranceValue);
    }

    return total;
  }, [
    formData.hasPrimaryHome, formData.primaryHomeValue,
    formData.hasBankAccounts, formData.bankAccountsValue,
    formData.hasInvestmentAccounts, formData.investmentAccountsValue,
    formData.hasRetirementAccounts, formData.retirementAccountsValue,
    formData.hasCryptocurrency, formData.cryptocurrencyValue,
    formData.hasBusinessInterests, formData.businessValue,
    formData.hasLifeInsurance, formData.lifeInsuranceValue,
  ]);

  const suggestedValueRange = getValueRangeForAmount(calculatedEstateValue);

  // Auto-update estimated total value when calculated value changes
  const handleUseCalculatedValue = () => {
    if (suggestedValueRange) {
      updateField("estimatedTotalValue", suggestedValueRange);
    }
  };

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
        currentStep="assets"
        completedSteps={completedSteps}
        estatePlanId={estatePlanId}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Assets Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Help us understand your financial picture. Estimates are fine - we just need a general understanding of your estate.
        </p>
        {hasExtractedData && (
          <div className="mt-4">
            <ExtractedDataBanner />
          </div>
        )}
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-8">
        {/* Real Estate */}
        <FormSection
          title="Real Estate"
          description="Properties you own"
        >
          <Checkbox
            checked={formData.hasPrimaryHome}
            onChange={(v) => updateField("hasPrimaryHome", v)}
            label="I own my primary residence"
          />

          {formData.hasPrimaryHome && (
            <div className="mt-4 pl-4 border-l-2 border-blue-200 dark:border-blue-800 space-y-4">
              <FormField label="Estimated Home Value">
                <Select
                  value={formData.primaryHomeValue}
                  onChange={(v) => updateField("primaryHomeValue", v)}
                  options={VALUE_RANGES}
                  placeholder="Select range"
                />
              </FormField>
              <Checkbox
                checked={formData.primaryHomeMortgage}
                onChange={(v) => updateField("primaryHomeMortgage", v)}
                label="I have an outstanding mortgage"
              />
            </div>
          )}

          <Checkbox
            checked={formData.hasOtherRealEstate}
            onChange={(v) => updateField("hasOtherRealEstate", v)}
            label="I own other real estate"
            description="Vacation homes, rental properties, land, etc."
          />

          {formData.hasOtherRealEstate && (
            <FormField label="Describe other properties">
              <TextArea
                value={formData.otherRealEstateDetails}
                onChange={(v) => updateField("otherRealEstateDetails", v)}
                placeholder="e.g., Vacation cabin in Lake Tahoe (est. $500k), Rental property in Austin (est. $350k)"
              />
            </FormField>
          )}
        </FormSection>

        {/* Financial Accounts */}
        <FormSection
          title="Financial Accounts"
          description="Bank accounts, investments, and retirement"
        >
          {/* Bank Accounts */}
          <Checkbox
            checked={formData.hasBankAccounts}
            onChange={(v) => updateField("hasBankAccounts", v)}
            label="Bank accounts (checking, savings, CDs)"
          />
          {formData.hasBankAccounts && (
            <div className="ml-4">
              <FormField label="Combined Value">
                <Select
                  value={formData.bankAccountsValue}
                  onChange={(v) => updateField("bankAccountsValue", v)}
                  options={VALUE_RANGES}
                  placeholder="Select range"
                />
              </FormField>
            </div>
          )}

          {/* Investment Accounts */}
          <Checkbox
            checked={formData.hasInvestmentAccounts}
            onChange={(v) => updateField("hasInvestmentAccounts", v)}
            label="Investment/brokerage accounts"
          />
          {formData.hasInvestmentAccounts && (
            <div className="ml-4">
              <FormField label="Combined Value">
                <Select
                  value={formData.investmentAccountsValue}
                  onChange={(v) => updateField("investmentAccountsValue", v)}
                  options={VALUE_RANGES}
                  placeholder="Select range"
                />
              </FormField>
            </div>
          )}

          {/* Retirement Accounts */}
          <Checkbox
            checked={formData.hasRetirementAccounts}
            onChange={(v) => updateField("hasRetirementAccounts", v)}
            label="Retirement accounts"
          />
          {formData.hasRetirementAccounts && (
            <div className="ml-4 space-y-4">
              <FormField label="Types of retirement accounts">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {RETIREMENT_ACCOUNT_TYPES.map((type) => (
                    <label
                      key={type.value}
                      className={`
                        flex items-center p-2 border rounded cursor-pointer text-sm
                        ${formData.retirementAccountTypes.includes(type.value)
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-300 dark:border-gray-600"
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={formData.retirementAccountTypes.includes(type.value)}
                        onChange={() => toggleRetirementType(type.value)}
                        className="mr-2"
                      />
                      {type.label}
                    </label>
                  ))}
                </div>
              </FormField>
              <FormField label="Combined Value">
                <Select
                  value={formData.retirementAccountsValue}
                  onChange={(v) => updateField("retirementAccountsValue", v)}
                  options={VALUE_RANGES}
                  placeholder="Select range"
                />
              </FormField>
            </div>
          )}

          {/* Cryptocurrency */}
          <Checkbox
            checked={formData.hasCryptocurrency}
            onChange={(v) => updateField("hasCryptocurrency", v)}
            label="Cryptocurrency"
            description="Bitcoin, Ethereum, and other digital assets"
          />
          {formData.hasCryptocurrency && (
            <div className="ml-4 space-y-4">
              <InfoBox type="tip">
                Cryptocurrency requires special estate planning considerations. Make sure your executor knows how to access your digital wallets and private keys.
              </InfoBox>
              <FormField label="Types of cryptocurrency held">
                <TextInput
                  value={formData.cryptocurrencyDetails}
                  onChange={(v) => updateField("cryptocurrencyDetails", v)}
                  placeholder="e.g., Bitcoin, Ethereum, stored on Coinbase and Ledger hardware wallet"
                />
              </FormField>
              <FormField label="Estimated Value">
                <Select
                  value={formData.cryptocurrencyValue}
                  onChange={(v) => updateField("cryptocurrencyValue", v)}
                  options={VALUE_RANGES}
                  placeholder="Select range"
                />
              </FormField>
            </div>
          )}
        </FormSection>

        {/* Business Interests */}
        <FormSection
          title="Business Interests"
          description="Do you own a business or have partnership interests?"
        >
          <Checkbox
            checked={formData.hasBusinessInterests}
            onChange={(v) => updateField("hasBusinessInterests", v)}
            label="I have business ownership or partnership interests"
          />
          {formData.hasBusinessInterests && (
            <div className="space-y-4 mt-4">
              <FormField label="Describe your business interests">
                <TextArea
                  value={formData.businessDetails}
                  onChange={(v) => updateField("businessDetails", v)}
                  placeholder="e.g., 50% owner of Smith Consulting LLC, 10% partner in real estate investment group"
                />
              </FormField>
              <FormField label="Estimated Value">
                <Select
                  value={formData.businessValue}
                  onChange={(v) => updateField("businessValue", v)}
                  options={VALUE_RANGES}
                  placeholder="Select range"
                />
              </FormField>
            </div>
          )}
        </FormSection>

        {/* Life Insurance */}
        <FormSection
          title="Life Insurance"
          description="Life insurance policies you own"
        >
          <Checkbox
            checked={formData.hasLifeInsurance}
            onChange={(v) => updateField("hasLifeInsurance", v)}
            label="I have life insurance"
          />
          {formData.hasLifeInsurance && (
            <div className="space-y-4 mt-4">
              <FormField label="Total Death Benefit">
                <Select
                  value={formData.lifeInsuranceValue}
                  onChange={(v) => updateField("lifeInsuranceValue", v)}
                  options={VALUE_RANGES}
                  placeholder="Select range"
                />
              </FormField>
              <FormField
                label={<>Current <GlossaryTooltip term="Beneficiary">Beneficiaries</GlossaryTooltip></>}
                helpText="Life insurance beneficiaries receive funds directly, bypassing your will"
              >
                <TextInput
                  value={formData.lifeInsuranceBeneficiaries}
                  onChange={(v) => updateField("lifeInsuranceBeneficiaries", v)}
                  placeholder="e.g., Spouse (primary), Children (contingent)"
                />
              </FormField>
            </div>
          )}
        </FormSection>

        {/* Beneficiary Designations - Only show if user has relevant assets or owns a business */}
        {(formData.hasRetirementAccounts || formData.hasLifeInsurance || formData.hasBusinessInterests) && (
        <FormSection
          title={<><GlossaryTooltip term="Beneficiary Designation">Beneficiary Designations</GlossaryTooltip> Tracker</>}
          description="Track beneficiaries on accounts that bypass your will"
        >
          <InfoBox type="warning" title="Important: These Assets Bypass Your Will">
            <p className="mb-2">
              <strong>Retirement accounts, life insurance, and TOD/POD accounts pass directly to named beneficiaries</strong> -
              they do not go through your will or trust.
            </p>
          </InfoBox>
          {beneficiariesAlreadyConfirmed ? (
            <InfoBox type="info" title="Beneficiary Designations Already Reviewed">
              <p className="mb-2">
                You indicated in the Existing Documents section that your beneficiary designations are current
                {beneficiariesReviewYear && ` (last reviewed: ${beneficiariesReviewYear})`}.
              </p>
              <p className="text-sm">
                If you&apos;d still like to document your beneficiaries for reference, you can enable tracking below.
              </p>
            </InfoBox>
          ) : (
            <InfoBox type="warning" title="Important: These Assets Bypass Your Will">
              <p className="mb-2">
                <strong>Retirement accounts, life insurance, and TOD/POD accounts pass directly to named beneficiaries</strong> -
                they do not go through your will or trust. This means:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>A beneficiary named on your 401(k) will receive it, even if your will says otherwise</li>
                <li>Outdated beneficiaries (like an ex-spouse) may still receive assets if not updated</li>
                <li>These designations should be reviewed regularly and kept consistent with your estate plan</li>
              </ul>
            </InfoBox>
          )}

          <div className="mt-6">
            <Checkbox
              checked={formData.hasBeneficiaryDesignations}
              onChange={(v) => {
                updateField("hasBeneficiaryDesignations", v);
                if (v && formData.beneficiaryDesignations.length === 0) {
                  addBeneficiaryDesignation();
                }
              }}
              label="I want to track my beneficiary designations"
              description="Optional: Track which beneficiaries are on each account"
              label={beneficiariesAlreadyConfirmed
                ? "I still want to document my beneficiary designations for reference"
                : "I want to track my beneficiary designations"
              }
              description={beneficiariesAlreadyConfirmed
                ? "Optional: Create a record of your beneficiary designations"
                : "We'll help ensure your beneficiaries are consistent with your estate plan"
              }
            />
          </div>

          {formData.hasBeneficiaryDesignations && (
            <div className="mt-6 space-y-6">
              <InfoBox type="tip">
                Add each account that has a beneficiary designation. Common examples include 401(k)s, IRAs, life insurance policies,
                and bank accounts with POD (Payable on Death) designations.
              </InfoBox>

              {formData.beneficiaryDesignations.map((designation, index) => (
                <div
                  key={designation.id}
                  className="relative border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50"
                >
                  {/* Header with remove button */}
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Account #{index + 1}
                      {designation.assetName && `: ${designation.assetName}`}
                    </h4>
                    {formData.beneficiaryDesignations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBeneficiaryDesignation(designation.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Account Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Account Type">
                      <Select
                        value={designation.assetType}
                        onChange={(v) => updateBeneficiaryDesignation(designation.id, "assetType", v)}
                        options={BENEFICIARY_ASSET_TYPES.map((t) => ({
                          value: t.value,
                          label: `${t.label} (${t.category})`,
                        }))}
                        placeholder="Select type"
                      />
                    </FormField>
                    <FormField label="Account Name/Description">
                      <TextInput
                        value={designation.assetName}
                        onChange={(v) => updateBeneficiaryDesignation(designation.id, "assetName", v)}
                        placeholder="e.g., Fidelity 401(k), Northwestern Mutual Life"
                      />
                    </FormField>
                    <FormField label="Institution/Company">
                      <TextInput
                        value={designation.institution}
                        onChange={(v) => updateBeneficiaryDesignation(designation.id, "institution", v)}
                        placeholder="e.g., Fidelity, Vanguard, MetLife"
                      />
                    </FormField>
                    <FormField label="Estimated Value">
                      <Select
                        value={designation.estimatedValue}
                        onChange={(v) => updateBeneficiaryDesignation(designation.id, "estimatedValue", v)}
                        options={VALUE_RANGES}
                        placeholder="Select range"
                      />
                    </FormField>
                  </div>

                  {/* Primary Beneficiary */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Primary <GlossaryTooltip term="Beneficiary">Beneficiary</GlossaryTooltip>
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField label="Name">
                        <TextInput
                          value={designation.primaryBeneficiaryName}
                          onChange={(v) => updateBeneficiaryDesignation(designation.id, "primaryBeneficiaryName", v)}
                          placeholder="Full legal name"
                        />
                      </FormField>
                      <FormField label="Relationship">
                        <Select
                          value={designation.primaryBeneficiaryRelationship}
                          onChange={(v) => updateBeneficiaryDesignation(designation.id, "primaryBeneficiaryRelationship", v)}
                          options={RELATIONSHIP_OPTIONS}
                          placeholder="Select"
                        />
                      </FormField>
                      <FormField label="Percentage">
                        <TextInput
                          value={String(designation.primaryBeneficiaryPercentage)}
                          onChange={(v) => updateBeneficiaryDesignation(designation.id, "primaryBeneficiaryPercentage", parseInt(v) || 0)}
                          placeholder="100"
                          type="number"
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Contingent Beneficiary */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      <GlossaryTooltip term="Contingent Beneficiary">Contingent (Backup) Beneficiary</GlossaryTooltip>
                      <span className="text-gray-500 font-normal ml-2">(optional)</span>
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField label="Name">
                        <TextInput
                          value={designation.contingentBeneficiaryName}
                          onChange={(v) => updateBeneficiaryDesignation(designation.id, "contingentBeneficiaryName", v)}
                          placeholder="Full legal name"
                        />
                      </FormField>
                      <FormField label="Relationship">
                        <Select
                          value={designation.contingentBeneficiaryRelationship}
                          onChange={(v) => updateBeneficiaryDesignation(designation.id, "contingentBeneficiaryRelationship", v)}
                          options={RELATIONSHIP_OPTIONS}
                          placeholder="Select"
                        />
                      </FormField>
                      <FormField label="Percentage">
                        <TextInput
                          value={String(designation.contingentBeneficiaryPercentage)}
                          onChange={(v) => updateBeneficiaryDesignation(designation.id, "contingentBeneficiaryPercentage", parseInt(v) || 0)}
                          placeholder="100"
                          type="number"
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Notes & Last Reviewed */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Last Reviewed">
                      <TextInput
                        value={designation.lastReviewedDate}
                        onChange={(v) => updateBeneficiaryDesignation(designation.id, "lastReviewedDate", v)}
                        placeholder={`e.g., ${currentMonth} ${currentYear}`}
                        type="text"
                      />
                    </FormField>
                    <FormField label="Notes">
                      <TextInput
                        value={designation.notes}
                        onChange={(v) => updateBeneficiaryDesignation(designation.id, "notes", v)}
                        placeholder="Any additional notes"
                      />
                    </FormField>
                  </div>
                </div>
              ))}

              {/* Add Another Button */}
              <button
                type="button"
                onClick={addBeneficiaryDesignation}
                className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors"
              >
                + Add Another Account
              </button>
            </div>
          )}
        </FormSection>
        )}

        {/* Other Assets */}
        <FormSection
          title="Other Assets"
          description="Vehicles, valuables, and other property"
        >
          <Checkbox
            checked={formData.hasVehicles}
            onChange={(v) => updateField("hasVehicles", v)}
            label="Vehicles (cars, boats, RVs, etc.)"
          />
          {formData.hasVehicles && (
            <FormField label="Describe vehicles">
              <TextInput
                value={formData.vehiclesDetails}
                onChange={(v) => updateField("vehiclesDetails", v)}
                placeholder={`e.g., ${currentYear} Tesla Model 3, ${currentYear - 2} Ford F-150`}
              />
            </FormField>
          )}

          <Checkbox
            checked={formData.hasValuables}
            onChange={(v) => updateField("hasValuables", v)}
            label="Valuable personal property"
            description="Jewelry, art, collectibles, etc."
          />
          {formData.hasValuables && (
            <FormField label="Describe valuable items">
              <TextInput
                value={formData.valuablesDetails}
                onChange={(v) => updateField("valuablesDetails", v)}
                placeholder="e.g., Engagement ring ($15k), Art collection ($50k)"
              />
            </FormField>
          )}

          <Checkbox
            checked={formData.hasSafeDepositBox}
            onChange={(v) => updateField("hasSafeDepositBox", v)}
            label="Safe deposit box"
            description="Bank safe deposit boxes containing important items or documents"
          />
          {formData.hasSafeDepositBox && (
            <div className="ml-4 space-y-4">
              <InfoBox type="info">
                Make sure your executor or a trusted family member knows the location of your safe deposit box and has access authorization. Consider adding them as a co-renter.
              </InfoBox>
              <FormField label="Bank and branch location">
                <TextInput
                  value={formData.safeDepositBoxLocation}
                  onChange={(v) => updateField("safeDepositBoxLocation", v)}
                  placeholder="e.g., Chase Bank, Main Street Branch, Box #1234"
                />
              </FormField>
              <FormField label="Contents (general description)">
                <TextArea
                  value={formData.safeDepositBoxContents}
                  onChange={(v) => updateField("safeDepositBoxContents", v)}
                  placeholder="e.g., Original will, property deeds, jewelry, gold coins, important documents"
                />
              </FormField>
            </div>
          )}

          <Checkbox
            checked={formData.hasOtherAssets}
            onChange={(v) => updateField("hasOtherAssets", v)}
            label="Other significant assets"
          />
          {formData.hasOtherAssets && (
            <FormField label="Describe other assets">
              <TextArea
                value={formData.otherAssetsDetails}
                onChange={(v) => updateField("otherAssetsDetails", v)}
                placeholder="Any other assets not mentioned above"
              />
            </FormField>
          )}
        </FormSection>

        {/* Debts */}
        <FormSection
          title="Debts & Liabilities"
          description="Significant debts (excluding primary mortgage already mentioned)"
        >
          <Checkbox
            checked={formData.hasSignificantDebts}
            onChange={(v) => updateField("hasSignificantDebts", v)}
            label="I have significant debts"
            description="Student loans, car loans, credit cards, business loans, etc."
          />
          {formData.hasSignificantDebts && (
            <FormField label="Describe debts">
              <TextArea
                value={formData.debtsDetails}
                onChange={(v) => updateField("debtsDetails", v)}
                placeholder="e.g., Student loans ($50k), Car loan ($25k)"
              />
            </FormField>
          )}
        </FormSection>

        {/* Total Estate Value */}
        <FormSection
          title="Total Estate Value"
          description="Your best estimate of total estate value (assets minus debts)"
        >
          {/* Auto-calculated estimate */}
          {calculatedEstateValue > 0 && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    Calculated Estimate: {formatCurrency(calculatedEstateValue)}
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Based on the asset values you provided above
                  </p>
                </div>
                {suggestedValueRange && formData.estimatedTotalValue !== suggestedValueRange && (
                  <button
                    type="button"
                    onClick={handleUseCalculatedValue}
                    className="px-3 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 rounded-md transition-colors"
                  >
                    Use This Value
                  </button>
                )}
              </div>
            </div>
          )}

          <FormField label="Estimated Total Value" hint="This helps us determine if estate tax planning is relevant">
            <RadioGroup
              name="estimatedTotalValue"
              value={formData.estimatedTotalValue}
              onChange={(v) => updateField("estimatedTotalValue", v)}
              options={VALUE_RANGES.map((r) => ({ ...r, description: undefined }))}
            />
          </FormField>

          {/* Disclaimer */}
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-xs text-amber-800 dark:text-amber-200">
              <strong>Disclaimer:</strong> The calculated estimate above is based on midpoint values of the ranges you selected and is provided for general guidance only.
              It does not include assets without specified values (vehicles, valuables, other real estate) or account for debts and liabilities.
              This estimate is not intended as financial, tax, or legal advice. For accurate estate valuation, please consult with a qualified financial advisor or estate planning attorney.
            </p>
          </div>
        </FormSection>
      </div>

      {/* Navigation */}
      <IntakeNavigation
        currentStep="assets"
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

export default function AssetsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <AssetsFormContent />
    </Suspense>
  );
}
