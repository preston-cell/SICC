// Question Helpers - Contextual help text, defaults, and utilities

// Contextual help text for legal terms
export const CONTEXTUAL_HELP: Record<string, { term: string; definition: string; why: string }> = {
  executor: {
    term: "Executor",
    definition: "The person who carries out the instructions in your will",
    why: "They'll gather your assets, pay debts, and distribute what's left to your beneficiaries",
  },
  trustee: {
    term: "Trustee",
    definition: "The person who manages a trust on behalf of beneficiaries",
    why: "They have a legal duty to manage trust assets responsibly and distribute them according to the trust's terms",
  },
  healthcare_proxy: {
    term: "Healthcare Proxy",
    definition: "The person who makes medical decisions for you if you can't",
    why: "Also called healthcare agent or healthcare power of attorney - they speak for you when you can't",
  },
  financial_poa: {
    term: "Financial Power of Attorney",
    definition: "The person who can manage your finances if you're unable to",
    why: "They can pay bills, manage investments, and handle financial matters on your behalf",
  },
  guardian: {
    term: "Guardian",
    definition: "The person who will care for your minor children if you can't",
    why: "Without a named guardian, a court will decide who raises your children",
  },
  beneficiary: {
    term: "Beneficiary",
    definition: "A person or organization that receives assets from your estate",
    why: "Beneficiaries on accounts (like 401k or life insurance) override your will",
  },
  probate: {
    term: "Probate",
    definition: "The court process of validating a will and distributing assets",
    why: "Probate can be time-consuming and expensive - trusts can help avoid it",
  },
  revocable_trust: {
    term: "Revocable Living Trust",
    definition: "A trust you can change or cancel during your lifetime",
    why: "Avoids probate, provides privacy, and lets you manage assets while alive",
  },
  irrevocable_trust: {
    term: "Irrevocable Trust",
    definition: "A trust that generally cannot be changed once created",
    why: "Can provide tax benefits and asset protection, but gives up control",
  },
  hipaa: {
    term: "HIPAA Authorization",
    definition: "A form that lets doctors share your medical information with specific people",
    why: "Without it, healthcare providers can't discuss your condition with family members",
  },
  advance_directive: {
    term: "Advance Directive",
    definition: "A document stating your healthcare wishes if you can't communicate",
    why: "Also called a living will - guides end-of-life care decisions",
  },
};

// Smart defaults based on common patterns
export function getSmartDefaults(data: Record<string, unknown>): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};

  // If married, suggest spouse as executor
  if (data.maritalStatus === "married" || data.maritalStatus === "domestic_partnership") {
    if (data.spouseFirstName && data.spouseLastName) {
      defaults.executorName = `${data.spouseFirstName} ${data.spouseLastName}`;
      defaults.executorRelationship = "Spouse";
      defaults.healthcareProxyName = `${data.spouseFirstName} ${data.spouseLastName}`;
      defaults.healthcareProxyRelationship = "Spouse";
      defaults.financialPOAName = `${data.spouseFirstName} ${data.spouseLastName}`;
    }
  }

  // If has children and married, suggest equal distribution
  if (data.hasChildren && (data.maritalStatus === "married" || data.maritalStatus === "domestic_partnership")) {
    defaults.distributionPreference = "spouse_first";
  } else if (data.hasChildren) {
    defaults.distributionPreference = "equal_children";
  }

  return defaults;
}

// Validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  // Allow various phone formats
  const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
  return phoneRegex.test(phone);
}

export function validateDate(date: string): boolean {
  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
}

export function validateYear(year: string): boolean {
  const yearNum = parseInt(year, 10);
  const currentYear = new Date().getFullYear();
  return yearNum >= 1900 && yearNum <= currentYear;
}

// Format helpers
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Estimate estate value range from selections
export function estimateEstateValue(data: Record<string, unknown>): string {
  let minValue = 0;
  let maxValue = 0;

  // Home value
  const homeValues: Record<string, [number, number]> = {
    under_250k: [0, 250000],
    "250k_500k": [250000, 500000],
    "500k_1m": [500000, 1000000],
    "1m_2m": [1000000, 2000000],
    over_2m: [2000000, 5000000],
  };
  if (data.homeValue && homeValues[data.homeValue as string]) {
    const [min, max] = homeValues[data.homeValue as string];
    minValue += min;
    maxValue += max;
  }

  // Retirement value
  const retirementValues: Record<string, [number, number]> = {
    under_100k: [0, 100000],
    "100k_500k": [100000, 500000],
    "500k_1m": [500000, 1000000],
    over_1m: [1000000, 3000000],
  };
  if (data.retirementValue && retirementValues[data.retirementValue as string]) {
    const [min, max] = retirementValues[data.retirementValue as string];
    minValue += min;
    maxValue += max;
  }

  // Liquid assets
  const liquidValues: Record<string, [number, number]> = {
    under_50k: [0, 50000],
    "50k_250k": [50000, 250000],
    "250k_500k": [250000, 500000],
    "500k_1m": [500000, 1000000],
    over_1m: [1000000, 3000000],
  };
  if (data.liquidAssetsValue && liquidValues[data.liquidAssetsValue as string]) {
    const [min, max] = liquidValues[data.liquidAssetsValue as string];
    minValue += min;
    maxValue += max;
  }

  // Business value
  const businessValues: Record<string, [number, number]> = {
    under_100k: [0, 100000],
    "100k_500k": [100000, 500000],
    "500k_1m": [500000, 1000000],
    "1m_5m": [1000000, 5000000],
    over_5m: [5000000, 20000000],
  };
  if (data.businessValue && businessValues[data.businessValue as string]) {
    const [min, max] = businessValues[data.businessValue as string];
    minValue += min;
    maxValue += max;
  }

  // Life insurance
  const insuranceValues: Record<string, [number, number]> = {
    under_100k: [0, 100000],
    "100k_500k": [100000, 500000],
    "500k_1m": [500000, 1000000],
    over_1m: [1000000, 3000000],
  };
  if (data.lifeInsuranceValue && insuranceValues[data.lifeInsuranceValue as string]) {
    const [min, max] = insuranceValues[data.lifeInsuranceValue as string];
    minValue += min;
    maxValue += max;
  }

  if (maxValue === 0) {
    return "Not yet estimated";
  }

  // Return a range description
  if (maxValue < 500000) {
    return "Under $500,000";
  } else if (maxValue < 1000000) {
    return "$500,000 - $1,000,000";
  } else if (maxValue < 5000000) {
    return "$1,000,000 - $5,000,000";
  } else if (maxValue < 10000000) {
    return "$5,000,000 - $10,000,000";
  } else {
    return "Over $10,000,000";
  }
}

// Check if step should be skipped based on data
export function shouldSkipStep(stepId: number, data: Record<string, unknown>): boolean {
  // Step 6 guardian questions should show if has minor children
  // Step 7 is optional and can always be skipped
  // Step 8 (review) should never be skipped

  // For now, no automatic skipping - all steps are available
  return false;
}

// Get completion percentage for a step
export function getStepCompletionPercentage(stepId: number, data: Record<string, unknown>, questions: { id: string; required?: boolean; showIf?: (data: Record<string, unknown>) => boolean }[]): number {
  const visibleQuestions = questions.filter((q) => !q.showIf || q.showIf(data));
  const requiredQuestions = visibleQuestions.filter((q) => q.required !== false);

  if (requiredQuestions.length === 0) {
    return 100;
  }

  const answeredQuestions = requiredQuestions.filter((q) => {
    const value = data[q.id];
    return value !== undefined && value !== null && value !== "";
  });

  return Math.round((answeredQuestions.length / requiredQuestions.length) * 100);
}

// Emotional messages for encouragement
export const EMOTIONAL_MESSAGES = [
  "Taking this step shows you care about your loved ones.",
  "There's no rush - save your progress and return anytime.",
  "Family is at the heart of estate planning.",
  "Understanding your assets helps create a complete plan.",
  "It's okay if you don't have any documents yet - that's why we're here.",
  "Your values guide your estate plan.",
  "Choosing trusted people ensures your wishes are carried out.",
  "These details can provide guidance and comfort to your family.",
  "You're almost done - great work taking this important step!",
];

// Get message for current step
export function getEmotionalMessage(stepId: number): string {
  if (stepId <= EMOTIONAL_MESSAGES.length) {
    return EMOTIONAL_MESSAGES[stepId - 1];
  }
  return EMOTIONAL_MESSAGES[EMOTIONAL_MESSAGES.length - 1];
}

// Common "why this matters" explanations
export const WHY_THIS_MATTERS: Record<string, string> = {
  stateOfResidence: "Your state's laws determine how estates are handled, what documents are valid, and what taxes may apply.",
  dateOfBirth: "Age affects tax planning strategies, especially for retirement accounts and trusts.",
  maritalStatus: "Marriage significantly affects how assets pass, spousal rights, and tax planning options.",
  hasChildren: "Children are typically primary beneficiaries and may need guardians if minor.",
  hasMinorChildren: "Minor children need a designated guardian to care for them if you can't.",
  assetTypes: "Different assets have different planning needs - retirement accounts need beneficiary designations, real estate may need deeds updated.",
  hasWill: "A will is the foundation of most estate plans, directing where assets go and who's in charge.",
  hasTrust: "Trusts can avoid probate, provide privacy, and offer more control over asset distribution.",
  executorName: "Your executor handles the administrative work of settling your estate - choose someone organized and trustworthy.",
  healthcareProxyName: "This person advocates for your medical care when you can't speak for yourself.",
  guardianName: "Without a named guardian, a court decides who raises your children.",
  topPriorities: "Your priorities help us focus on what matters most in your plan.",
};

// Get "why this matters" text for a field
export function getWhyThisMatters(fieldId: string): string | undefined {
  return WHY_THIS_MATTERS[fieldId];
}
