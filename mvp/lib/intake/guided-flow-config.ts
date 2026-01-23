// Guided Intake Flow Configuration
// Defines the conversational step-by-step intake experience

export type QuestionType =
  | "text"
  | "date"
  | "email"
  | "phone"
  | "state-select"
  | "radio"
  | "checkbox"
  | "multi-select"
  | "name-group"
  | "address-group"
  | "spouse-group"
  | "child-entry"
  | "child-list"
  | "yes-no"
  | "gate"
  | "number"
  | "currency"
  | "percentage"
  | "priority-picker"
  | "person-entry"
  | "textarea";

export interface QuestionOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  label?: string;
  placeholder?: string;
  help?: string;
  required?: boolean;
  options?: QuestionOption[];
  showIf?: (data: Record<string, unknown>) => boolean;
  defaultValue?: unknown;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  // For grouping related questions on desktop
  group?: string;
}

export interface GuidedStep {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  emotionalMessage?: string;
  estimatedMinutes: number;
  questions: Question[];
  // Maps to existing intake data sections for data compatibility
  dataSection?: "personal" | "family" | "assets" | "existing_documents" | "goals";
  // Can skip this step entirely
  canSkip?: boolean;
  // Skip step if condition not met
  skipIf?: (data: Record<string, unknown>) => boolean;
}

// Relationship status options
export const RELATIONSHIP_STATUS_OPTIONS: QuestionOption[] = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
  { value: "domestic_partnership", label: "Domestic Partnership" },
  { value: "separated", label: "Separated" },
];

// Asset type options for quick selection
export const ASSET_TYPE_OPTIONS: QuestionOption[] = [
  { value: "home", label: "Home or real estate", icon: "home" },
  { value: "savings", label: "Bank accounts", icon: "bank" },
  { value: "retirement", label: "Retirement accounts (401k, IRA)", icon: "chart" },
  { value: "investments", label: "Stocks or investments", icon: "trending" },
  { value: "business", label: "Business ownership", icon: "building" },
  { value: "insurance", label: "Life insurance", icon: "shield" },
  { value: "vehicles", label: "Vehicles", icon: "car" },
  { value: "valuables", label: "Jewelry, art, or collectibles", icon: "gem" },
];

// Priority options for goals
export const PRIORITY_OPTIONS: QuestionOption[] = [
  { value: "protect_family", label: "Provide for my family", icon: "users", description: "Ensure loved ones are taken care of" },
  { value: "protect_home", label: "Protect my home", icon: "home", description: "Keep the family home secure" },
  { value: "minimize_taxes", label: "Minimize taxes", icon: "percent", description: "Reduce estate and inheritance taxes" },
  { value: "healthcare_decisions", label: "Healthcare decisions", icon: "heart", description: "Ensure medical wishes are honored" },
  { value: "charitable_giving", label: "Give to charity", icon: "gift", description: "Support causes you care about" },
  { value: "business_succession", label: "Pass on my business", icon: "building", description: "Ensure smooth business transition" },
  { value: "avoid_probate", label: "Avoid probate", icon: "shield", description: "Simplify the process for heirs" },
  { value: "protect_assets", label: "Protect assets", icon: "lock", description: "Shield assets from creditors" },
];

// The complete guided flow configuration
export const GUIDED_STEPS: GuidedStep[] = [
  // Step 1: About You
  {
    id: 1,
    slug: "about-you",
    title: "About You",
    subtitle: "Let's start with the basics",
    emotionalMessage: "Taking this step shows you care about your loved ones.",
    estimatedMinutes: 2,
    dataSection: "personal",
    questions: [
      {
        id: "firstName",
        type: "text",
        label: "First name",
        placeholder: "First name",
        required: true,
        group: "name",
      },
      {
        id: "middleName",
        type: "text",
        label: "Middle name",
        placeholder: "Middle name (optional)",
        group: "name",
      },
      {
        id: "lastName",
        type: "text",
        label: "Last name",
        placeholder: "Last name",
        required: true,
        group: "name",
      },
      {
        id: "dateOfBirth",
        type: "date",
        label: "Date of birth",
        help: "Helps determine tax planning strategies",
        required: true,
      },
      {
        id: "stateOfResidence",
        type: "state-select",
        label: "State of residence",
        help: "Determines which laws apply to your estate plan",
        required: true,
      },
      {
        id: "maritalStatus",
        type: "radio",
        label: "Current relationship status",
        options: RELATIONSHIP_STATUS_OPTIONS,
        required: true,
      },
    ],
  },

  // Step 2: Your Family
  {
    id: 2,
    slug: "family",
    title: "Your Family",
    subtitle: "Tell me about your loved ones",
    emotionalMessage: "Family is at the heart of estate planning.",
    estimatedMinutes: 3,
    dataSection: "family",
    questions: [
      // Spouse info (conditional on married/domestic partnership)
      {
        id: "spouseFirstName",
        type: "text",
        label: "Spouse's first name",
        placeholder: "First name",
        showIf: (data) => ["married", "domestic_partnership"].includes(data.maritalStatus as string),
        group: "spouse",
      },
      {
        id: "spouseLastName",
        type: "text",
        label: "Spouse's last name",
        placeholder: "Last name",
        showIf: (data) => ["married", "domestic_partnership"].includes(data.maritalStatus as string),
        group: "spouse",
      },
      {
        id: "spouseDateOfBirth",
        type: "date",
        label: "Spouse's date of birth",
        showIf: (data) => ["married", "domestic_partnership"].includes(data.maritalStatus as string),
        group: "spouse",
      },
      // Children gate
      {
        id: "hasChildren",
        type: "yes-no",
        label: "Do you have children?",
        help: "Including biological, adopted, and stepchildren",
      },
      // Children list (conditional)
      {
        id: "children",
        type: "child-list",
        label: "Your children",
        showIf: (data) => data.hasChildren === true,
      },
      // Minor children follow-up
      {
        id: "hasMinorChildren",
        type: "yes-no",
        label: "Are any of your children under 18?",
        showIf: (data) => data.hasChildren === true && Array.isArray(data.children) && data.children.length > 0,
      },
      // Dependents gate
      {
        id: "hasDependents",
        type: "yes-no",
        label: "Does anyone else depend on you financially?",
        help: "Parents, siblings, or other family members",
      },
      // Dependents list (conditional)
      {
        id: "dependents",
        type: "child-list",
        label: "Your dependents",
        showIf: (data) => data.hasDependents === true,
      },
    ],
  },

  // Step 3: What You Own
  {
    id: 3,
    slug: "assets",
    title: "What You Own",
    subtitle: "A quick overview of your assets",
    emotionalMessage: "Understanding your assets helps create a complete plan.",
    estimatedMinutes: 4,
    dataSection: "assets",
    questions: [
      // Quick asset selection
      {
        id: "assetTypes",
        type: "multi-select",
        label: "Check all that apply",
        options: ASSET_TYPE_OPTIONS,
        help: "Select the types of assets you own - we'll ask for details only on what you select",
      },
      // Home details (conditional)
      {
        id: "homeValue",
        type: "radio",
        label: "Estimated home value",
        showIf: (data) => Array.isArray(data.assetTypes) && data.assetTypes.includes("home"),
        options: [
          { value: "under_250k", label: "Under $250,000" },
          { value: "250k_500k", label: "$250,000 - $500,000" },
          { value: "500k_1m", label: "$500,000 - $1,000,000" },
          { value: "1m_2m", label: "$1,000,000 - $2,000,000" },
          { value: "over_2m", label: "Over $2,000,000" },
        ],
        group: "home",
      },
      {
        id: "hasMortgage",
        type: "yes-no",
        label: "Do you have a mortgage?",
        showIf: (data) => Array.isArray(data.assetTypes) && data.assetTypes.includes("home"),
        group: "home",
      },
      // Retirement details (conditional)
      {
        id: "retirementValue",
        type: "radio",
        label: "Total retirement account value",
        showIf: (data) => Array.isArray(data.assetTypes) && data.assetTypes.includes("retirement"),
        options: [
          { value: "under_100k", label: "Under $100,000" },
          { value: "100k_500k", label: "$100,000 - $500,000" },
          { value: "500k_1m", label: "$500,000 - $1,000,000" },
          { value: "over_1m", label: "Over $1,000,000" },
        ],
        group: "retirement",
      },
      // Savings/investments value
      {
        id: "liquidAssetsValue",
        type: "radio",
        label: "Total savings and investment value",
        showIf: (data) => {
          const types = data.assetTypes as string[] | undefined;
          return Array.isArray(types) && (types.includes("savings") || types.includes("investments"));
        },
        options: [
          { value: "under_50k", label: "Under $50,000" },
          { value: "50k_250k", label: "$50,000 - $250,000" },
          { value: "250k_500k", label: "$250,000 - $500,000" },
          { value: "500k_1m", label: "$500,000 - $1,000,000" },
          { value: "over_1m", label: "Over $1,000,000" },
        ],
        group: "liquid",
      },
      // Business details (conditional)
      {
        id: "businessType",
        type: "radio",
        label: "Type of business",
        showIf: (data) => Array.isArray(data.assetTypes) && data.assetTypes.includes("business"),
        options: [
          { value: "sole_proprietor", label: "Sole Proprietorship" },
          { value: "llc", label: "LLC" },
          { value: "partnership", label: "Partnership" },
          { value: "s_corp", label: "S Corporation" },
          { value: "c_corp", label: "C Corporation" },
          { value: "other", label: "Other" },
        ],
        group: "business",
      },
      {
        id: "businessValue",
        type: "radio",
        label: "Estimated business value",
        showIf: (data) => Array.isArray(data.assetTypes) && data.assetTypes.includes("business"),
        options: [
          { value: "under_100k", label: "Under $100,000" },
          { value: "100k_500k", label: "$100,000 - $500,000" },
          { value: "500k_1m", label: "$500,000 - $1,000,000" },
          { value: "1m_5m", label: "$1,000,000 - $5,000,000" },
          { value: "over_5m", label: "Over $5,000,000" },
        ],
        group: "business",
      },
      // Life insurance (conditional)
      {
        id: "lifeInsuranceValue",
        type: "radio",
        label: "Total life insurance coverage",
        showIf: (data) => Array.isArray(data.assetTypes) && data.assetTypes.includes("insurance"),
        options: [
          { value: "under_100k", label: "Under $100,000" },
          { value: "100k_500k", label: "$100,000 - $500,000" },
          { value: "500k_1m", label: "$500,000 - $1,000,000" },
          { value: "over_1m", label: "Over $1,000,000" },
        ],
        group: "insurance",
      },
      // Estimated total estate value (auto-calculated note)
      {
        id: "totalEstateEstimate",
        type: "radio",
        label: "Estimated total estate value",
        help: "Your best estimate of everything you own minus what you owe",
        options: [
          { value: "under_500k", label: "Under $500,000" },
          { value: "500k_1m", label: "$500,000 - $1,000,000" },
          { value: "1m_5m", label: "$1,000,000 - $5,000,000" },
          { value: "5m_10m", label: "$5,000,000 - $10,000,000" },
          { value: "over_10m", label: "Over $10,000,000" },
        ],
      },
    ],
  },

  // Step 4: Current Documents
  {
    id: 4,
    slug: "documents",
    title: "Your Current Documents",
    subtitle: "What estate planning have you done?",
    emotionalMessage: "It's okay if you don't have any documents yet - that's why we're here.",
    estimatedMinutes: 2,
    dataSection: "existing_documents",
    questions: [
      // Will
      {
        id: "hasWill",
        type: "yes-no",
        label: "Do you have a will?",
      },
      {
        id: "willYear",
        type: "text",
        label: "When was it created or last updated?",
        placeholder: "Year (e.g., 2020)",
        showIf: (data) => data.hasWill === true,
        group: "will",
      },
      {
        id: "willConcerns",
        type: "textarea",
        label: "Any concerns about your current will?",
        placeholder: "Optional - e.g., needs updating, beneficiaries changed",
        showIf: (data) => data.hasWill === true,
        group: "will",
      },
      // Trust
      {
        id: "hasTrust",
        type: "yes-no",
        label: "Do you have a trust?",
      },
      {
        id: "trustType",
        type: "radio",
        label: "What type of trust?",
        showIf: (data) => data.hasTrust === true,
        options: [
          { value: "revocable_living", label: "Revocable Living Trust" },
          { value: "irrevocable", label: "Irrevocable Trust" },
          { value: "special_needs", label: "Special Needs Trust" },
          { value: "other", label: "Other / Not sure" },
        ],
        group: "trust",
      },
      {
        id: "trustYear",
        type: "text",
        label: "When was it created?",
        placeholder: "Year (e.g., 2019)",
        showIf: (data) => data.hasTrust === true,
        group: "trust",
      },
      // Power of Attorney
      {
        id: "hasFinancialPOA",
        type: "yes-no",
        label: "Do you have a financial power of attorney?",
        help: "Allows someone to manage your finances if you can't",
      },
      {
        id: "hasHealthcarePOA",
        type: "yes-no",
        label: "Do you have a healthcare power of attorney?",
        help: "Also called healthcare proxy or healthcare directive",
      },
      // HIPAA
      {
        id: "hasHIPAA",
        type: "yes-no",
        label: "Do you have a HIPAA authorization?",
        help: "Allows doctors to share your health info with family members",
      },
    ],
  },

  // Step 5: What Matters Most
  {
    id: 5,
    slug: "priorities",
    title: "What Matters Most",
    subtitle: "Help us understand your priorities",
    emotionalMessage: "Your values guide your estate plan.",
    estimatedMinutes: 2,
    dataSection: "goals",
    questions: [
      // Priority picker (visual cards)
      {
        id: "topPriorities",
        type: "priority-picker",
        label: "What are your top priorities? (Select up to 3)",
        options: PRIORITY_OPTIONS,
      },
      // Distribution preference
      {
        id: "distributionPreference",
        type: "radio",
        label: "How would you like your assets distributed?",
        options: [
          { value: "equal_children", label: "Equally among my children", description: "Each child receives the same share" },
          { value: "spouse_first", label: "All to spouse, then to children", description: "Spouse inherits everything, children receive remainder" },
          { value: "specific_gifts", label: "Specific gifts to specific people", description: "I have particular items for particular people" },
          { value: "charitable", label: "Include charitable giving", description: "A portion goes to charity" },
          { value: "custom", label: "Custom arrangement", description: "I need something more complex" },
        ],
        showIf: (data) => {
          const status = data.maritalStatus as string;
          return status === "married" || status === "domestic_partnership" || data.hasChildren === true;
        },
      },
      // Single/no children distribution
      {
        id: "singleDistributionPreference",
        type: "radio",
        label: "Who should receive your assets?",
        options: [
          { value: "family", label: "Family members", description: "Parents, siblings, nieces/nephews" },
          { value: "friends", label: "Close friends", description: "People I've chosen as family" },
          { value: "charity", label: "Charitable organizations", description: "Causes I care about" },
          { value: "mixed", label: "A combination", description: "Mix of family, friends, and charity" },
        ],
        showIf: (data) => {
          const status = data.maritalStatus as string;
          return status === "single" && data.hasChildren !== true;
        },
      },
    ],
  },

  // Step 6: Who Should Be In Charge
  {
    id: 6,
    slug: "people",
    title: "Who Should Be In Charge",
    subtitle: "Designate your key decision-makers",
    emotionalMessage: "Choosing trusted people ensures your wishes are carried out.",
    estimatedMinutes: 3,
    dataSection: "goals",
    questions: [
      // Executor
      {
        id: "executorName",
        type: "text",
        label: "Executor (carries out your will)",
        placeholder: "Full name",
        help: "This person will manage your estate and distribute assets according to your wishes",
      },
      {
        id: "executorRelationship",
        type: "text",
        label: "Relationship to you",
        placeholder: "e.g., Spouse, Adult child, Friend",
      },
      {
        id: "backupExecutorName",
        type: "text",
        label: "Backup executor",
        placeholder: "Full name",
        help: "In case your primary executor is unable to serve",
      },
      // Healthcare proxy
      {
        id: "healthcareProxyName",
        type: "text",
        label: "Healthcare proxy (makes medical decisions)",
        placeholder: "Full name",
        help: "This person will make healthcare decisions if you can't",
      },
      {
        id: "healthcareProxyRelationship",
        type: "text",
        label: "Relationship to you",
        placeholder: "e.g., Spouse, Adult child, Friend",
      },
      // Financial POA
      {
        id: "financialPOAName",
        type: "text",
        label: "Financial power of attorney",
        placeholder: "Full name",
        help: "This person can manage your finances if you're incapacitated",
      },
      // Guardian (conditional on minor children)
      {
        id: "guardianName",
        type: "text",
        label: "Guardian for minor children",
        placeholder: "Full name",
        help: "This person will care for your children if you can't",
        showIf: (data) => data.hasMinorChildren === true,
      },
      {
        id: "guardianRelationship",
        type: "text",
        label: "Guardian's relationship to your children",
        placeholder: "e.g., Aunt, Uncle, Godparent",
        showIf: (data) => data.hasMinorChildren === true,
      },
      {
        id: "backupGuardianName",
        type: "text",
        label: "Backup guardian",
        placeholder: "Full name",
        help: "In case your primary guardian is unable to serve",
        showIf: (data) => data.hasMinorChildren === true,
      },
    ],
  },

  // Step 7: Final Wishes (Optional)
  {
    id: 7,
    slug: "final-wishes",
    title: "Final Wishes",
    subtitle: "Optional preferences",
    emotionalMessage: "These details can provide guidance and comfort to your family.",
    estimatedMinutes: 2,
    dataSection: "goals",
    canSkip: true,
    questions: [
      // Healthcare preferences
      {
        id: "lifeSupportPreference",
        type: "radio",
        label: "End-of-life care preference",
        options: [
          { value: "all_measures", label: "Use all available measures to prolong life" },
          { value: "comfort_only", label: "Focus on comfort, no extraordinary measures" },
          { value: "case_by_case", label: "Depends on the situation" },
          { value: "undecided", label: "I haven't decided yet" },
        ],
      },
      {
        id: "organDonation",
        type: "radio",
        label: "Organ donation preference",
        options: [
          { value: "yes_all", label: "Yes, donate any needed organs" },
          { value: "yes_limited", label: "Yes, but with limitations" },
          { value: "no", label: "No organ donation" },
          { value: "undecided", label: "I haven't decided yet" },
        ],
      },
      // Funeral preferences
      {
        id: "funeralPreference",
        type: "radio",
        label: "Funeral/burial preference",
        options: [
          { value: "burial", label: "Traditional burial" },
          { value: "cremation", label: "Cremation" },
          { value: "green_burial", label: "Green/natural burial" },
          { value: "family_decides", label: "Let my family decide" },
          { value: "undecided", label: "I haven't decided yet" },
        ],
      },
      // Charitable giving
      {
        id: "wantsCharitableGiving",
        type: "yes-no",
        label: "Would you like to include charitable giving in your plan?",
      },
      {
        id: "charitableNotes",
        type: "textarea",
        label: "Any specific charities or causes?",
        placeholder: "Optional - list organizations or causes you'd like to support",
        showIf: (data) => data.wantsCharitableGiving === true,
      },
      // Digital assets
      {
        id: "hasDigitalAssets",
        type: "yes-no",
        label: "Do you have significant digital assets?",
        help: "Cryptocurrency, online accounts with value, digital businesses",
      },
      {
        id: "digitalAssetsNotes",
        type: "textarea",
        label: "Notes about digital assets",
        placeholder: "List types of digital assets and where access credentials are stored (e.g., 'Bitcoin wallet - seed phrase in safe deposit box at First National Bank', 'PayPal business account - password in LastPass shared vault')",
        help: "Important: Don't enter actual passwords here. Instead, describe what assets you have and tell your executor WHERE to find credentials (safe deposit box, password manager, sealed envelope, etc.)",
        showIf: (data) => data.hasDigitalAssets === true,
      },
    ],
  },

  // Step 8: Review & Complete
  {
    id: 8,
    slug: "review",
    title: "Review & Complete",
    subtitle: "Let's make sure everything looks right",
    emotionalMessage: "You're almost done - great work taking this important step!",
    estimatedMinutes: 2,
    questions: [
      // This step will render a summary view, not questions
      // The questions array here is empty or contains a special "summary" type
    ],
  },
];

// Helper functions

export function getStepBySlug(slug: string): GuidedStep | undefined {
  return GUIDED_STEPS.find((step) => step.slug === slug);
}

export function getStepById(id: number): GuidedStep | undefined {
  return GUIDED_STEPS.find((step) => step.id === id);
}

export function getNextStep(currentId: number): GuidedStep | undefined {
  return GUIDED_STEPS.find((step) => step.id === currentId + 1);
}

export function getPreviousStep(currentId: number): GuidedStep | undefined {
  return GUIDED_STEPS.find((step) => step.id === currentId - 1);
}

export function getVisibleQuestions(step: GuidedStep, data: Record<string, unknown>): Question[] {
  return step.questions.filter((q) => !q.showIf || q.showIf(data));
}

export function getTotalSteps(): number {
  return GUIDED_STEPS.length;
}

export function calculateProgress(completedSteps: number[]): number {
  return Math.round((completedSteps.length / GUIDED_STEPS.length) * 100);
}

// Data section mapping for saving to existing intake data structure
export function getDataSectionForStep(stepId: number): "personal" | "family" | "assets" | "existing_documents" | "goals" | null {
  const step = getStepById(stepId);
  return step?.dataSection || null;
}
