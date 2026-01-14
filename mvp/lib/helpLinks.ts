/**
 * Configuration-based external help links for estate planning topics
 *
 * This module provides centralized management of external help resources,
 * allowing easy updates and customization of links shown throughout the app.
 */

// ============================================
// TYPES
// ============================================

export interface HelpLink {
  /** Unique identifier for the link */
  id: string;
  /** Display text for the link */
  label: string;
  /** Full URL to the external resource */
  url: string;
  /** Brief description of what the resource covers */
  description?: string;
  /** Source/organization providing the resource */
  source?: string;
  /** Categories this link belongs to */
  categories: HelpCategory[];
  /** Whether this is a government/official source */
  isOfficial?: boolean;
  /** Icon type to display (optional) */
  iconType?: "external" | "pdf" | "video" | "article" | "tool";
}

export type HelpCategory =
  | "general"
  | "will"
  | "trust"
  | "poa"
  | "healthcare"
  | "beneficiary"
  | "guardian"
  | "tax"
  | "medicaid"
  | "business"
  | "real_estate"
  | "retirement"
  | "life_insurance"
  | "digital_assets"
  | "state_specific";

export interface HelpLinkConfig {
  /** Whether to show help links in the UI */
  enabled: boolean;
  /** Whether to open links in new tab */
  openInNewTab: boolean;
  /** Maximum number of links to show per section */
  maxLinksPerSection: number;
  /** Whether to show source attribution */
  showSource: boolean;
  /** Custom disclaimer text */
  disclaimer?: string;
}

// ============================================
// DEFAULT CONFIGURATION
// ============================================

export const defaultHelpLinkConfig: HelpLinkConfig = {
  enabled: true,
  openInNewTab: true,
  maxLinksPerSection: 3,
  showSource: true,
  disclaimer: "These external resources are provided for informational purposes only and do not constitute legal advice. Consult with a qualified attorney for guidance specific to your situation.",
};

// ============================================
// HELP LINKS DATABASE
// ============================================

export const helpLinks: HelpLink[] = [
  // General Estate Planning
  {
    id: "irs-estate-tax-overview",
    label: "Estate and Gift Taxes",
    url: "https://www.irs.gov/businesses/small-businesses-self-employed/estate-and-gift-taxes",
    description: "IRS overview of federal estate and gift tax requirements",
    source: "IRS",
    categories: ["general", "tax"],
    isOfficial: true,
    iconType: "article",
  },
  {
    id: "aarp-estate-planning-basics",
    label: "Estate Planning Basics",
    url: "https://www.aarp.org/money/investing/info-2021/estate-planning-basics.html",
    description: "Introduction to estate planning fundamentals",
    source: "AARP",
    categories: ["general"],
    iconType: "article",
  },
  {
    id: "nolo-estate-planning",
    label: "Estate Planning Overview",
    url: "https://www.nolo.com/legal-encyclopedia/estate-planning",
    description: "Comprehensive estate planning legal guide",
    source: "Nolo",
    categories: ["general"],
    iconType: "article",
  },

  // Wills
  {
    id: "nolo-wills-guide",
    label: "How to Make a Will",
    url: "https://www.nolo.com/legal-encyclopedia/how-to-make-a-will.html",
    description: "Step-by-step guide to creating a valid will",
    source: "Nolo",
    categories: ["will"],
    iconType: "article",
  },
  {
    id: "aarp-will-basics",
    label: "Will Basics",
    url: "https://www.aarp.org/money/investing/info-2017/wills-basics.html",
    description: "Understanding the basics of wills",
    source: "AARP",
    categories: ["will"],
    iconType: "article",
  },
  {
    id: "findlaw-will-requirements",
    label: "State Will Requirements",
    url: "https://www.findlaw.com/estate/wills/state-requirements-for-wills.html",
    description: "Will requirements by state",
    source: "FindLaw",
    categories: ["will", "state_specific"],
    iconType: "article",
  },

  // Trusts
  {
    id: "nolo-living-trust",
    label: "Living Trust Guide",
    url: "https://www.nolo.com/legal-encyclopedia/living-trusts",
    description: "Comprehensive guide to revocable living trusts",
    source: "Nolo",
    categories: ["trust"],
    iconType: "article",
  },
  {
    id: "investopedia-trust-types",
    label: "Types of Trusts",
    url: "https://www.investopedia.com/terms/t/trust.asp",
    description: "Overview of different trust types and their uses",
    source: "Investopedia",
    categories: ["trust"],
    iconType: "article",
  },
  {
    id: "fidelity-trust-funding",
    label: "How to Fund a Trust",
    url: "https://www.fidelity.com/life-events/estate-planning/funding-a-trust",
    description: "Guide to properly funding your trust",
    source: "Fidelity",
    categories: ["trust"],
    iconType: "article",
  },

  // Power of Attorney
  {
    id: "aarp-poa-guide",
    label: "Power of Attorney Guide",
    url: "https://www.aarp.org/caregiving/financial-legal/info-2019/power-of-attorney-guide.html",
    description: "Understanding power of attorney documents",
    source: "AARP",
    categories: ["poa"],
    iconType: "article",
  },
  {
    id: "nolo-financial-poa",
    label: "Financial Power of Attorney",
    url: "https://www.nolo.com/legal-encyclopedia/financial-power-of-attorney.html",
    description: "Guide to financial powers of attorney",
    source: "Nolo",
    categories: ["poa"],
    iconType: "article",
  },
  {
    id: "findlaw-poa-types",
    label: "Types of Power of Attorney",
    url: "https://www.findlaw.com/estate/power-of-attorney/types-of-power-of-attorney.html",
    description: "Different types of POA and when to use them",
    source: "FindLaw",
    categories: ["poa"],
    iconType: "article",
  },

  // Healthcare Directives
  {
    id: "nih-advance-directives",
    label: "Advance Care Planning",
    url: "https://www.nia.nih.gov/health/advance-care-planning-health-care-directives",
    description: "NIH guide to advance directives",
    source: "National Institutes of Health",
    categories: ["healthcare"],
    isOfficial: true,
    iconType: "article",
  },
  {
    id: "aarp-healthcare-directive",
    label: "Healthcare Directive Guide",
    url: "https://www.aarp.org/caregiving/financial-legal/free-printable-advance-directives/",
    description: "State-by-state healthcare directive forms",
    source: "AARP",
    categories: ["healthcare", "state_specific"],
    iconType: "tool",
  },
  {
    id: "mayoclinic-living-will",
    label: "Living Wills Explained",
    url: "https://www.mayoclinic.org/healthy-lifestyle/consumer-health/in-depth/living-wills/art-20046303",
    description: "Medical perspective on living wills",
    source: "Mayo Clinic",
    categories: ["healthcare"],
    iconType: "article",
  },

  // Beneficiary Designations
  {
    id: "fidelity-beneficiary-guide",
    label: "Beneficiary Designation Guide",
    url: "https://www.fidelity.com/life-events/estate-planning/beneficiary-designations",
    description: "How to properly designate beneficiaries",
    source: "Fidelity",
    categories: ["beneficiary"],
    iconType: "article",
  },
  {
    id: "schwab-beneficiary-mistakes",
    label: "Beneficiary Mistakes to Avoid",
    url: "https://www.schwab.com/learn/story/beneficiary-mistakes-to-avoid",
    description: "Common beneficiary designation errors",
    source: "Charles Schwab",
    categories: ["beneficiary"],
    iconType: "article",
  },
  {
    id: "investopedia-per-stirpes",
    label: "Per Stirpes vs Per Capita",
    url: "https://www.investopedia.com/terms/p/perstirpes.asp",
    description: "Understanding beneficiary distribution methods",
    source: "Investopedia",
    categories: ["beneficiary"],
    iconType: "article",
  },

  // Guardian Nomination
  {
    id: "nolo-guardian-guide",
    label: "Choosing a Guardian",
    url: "https://www.nolo.com/legal-encyclopedia/choosing-guardian-your-children.html",
    description: "How to choose a guardian for your children",
    source: "Nolo",
    categories: ["guardian"],
    iconType: "article",
  },
  {
    id: "aarp-guardian-nomination",
    label: "Naming a Guardian",
    url: "https://www.aarp.org/relationships/family/info-2014/naming-a-guardian-for-children.html",
    description: "Considerations for naming a guardian",
    source: "AARP",
    categories: ["guardian"],
    iconType: "article",
  },

  // Tax Planning
  {
    id: "irs-estate-tax-faq",
    label: "Estate Tax FAQ",
    url: "https://www.irs.gov/businesses/small-businesses-self-employed/frequently-asked-questions-on-estate-taxes",
    description: "IRS frequently asked questions on estate taxes",
    source: "IRS",
    categories: ["tax"],
    isOfficial: true,
    iconType: "article",
  },
  {
    id: "irs-gift-tax",
    label: "Gift Tax Guide",
    url: "https://www.irs.gov/businesses/small-businesses-self-employed/frequently-asked-questions-on-gift-taxes",
    description: "IRS guide to gift tax rules",
    source: "IRS",
    categories: ["tax"],
    isOfficial: true,
    iconType: "article",
  },
  {
    id: "tax-foundation-estate-tax",
    label: "State Estate Tax Map",
    url: "https://taxfoundation.org/state-estate-tax-state-inheritance-tax-2023/",
    description: "Overview of state estate and inheritance taxes",
    source: "Tax Foundation",
    categories: ["tax", "state_specific"],
    iconType: "article",
  },

  // Medicaid Planning
  {
    id: "medicaid-eligibility",
    label: "Medicaid Eligibility",
    url: "https://www.medicaid.gov/medicaid/eligibility/index.html",
    description: "Official Medicaid eligibility information",
    source: "Medicaid.gov",
    categories: ["medicaid"],
    isOfficial: true,
    iconType: "article",
  },
  {
    id: "nolo-medicaid-planning",
    label: "Medicaid Planning Guide",
    url: "https://www.nolo.com/legal-encyclopedia/medicaid-planning",
    description: "Strategies for Medicaid planning",
    source: "Nolo",
    categories: ["medicaid"],
    iconType: "article",
  },
  {
    id: "aarp-medicaid-lookback",
    label: "Medicaid Look-Back Period",
    url: "https://www.aarp.org/caregiving/financial-legal/info-2019/medicaid-look-back-period.html",
    description: "Understanding Medicaid's look-back rules",
    source: "AARP",
    categories: ["medicaid"],
    iconType: "article",
  },

  // Retirement Accounts
  {
    id: "irs-retirement-plans",
    label: "Retirement Plans Overview",
    url: "https://www.irs.gov/retirement-plans",
    description: "IRS information on retirement plans",
    source: "IRS",
    categories: ["retirement"],
    isOfficial: true,
    iconType: "article",
  },
  {
    id: "fidelity-inherited-ira",
    label: "Inherited IRA Rules",
    url: "https://www.fidelity.com/building-savings/learn-about-iras/inherited-ira-rmd",
    description: "Rules for inherited retirement accounts",
    source: "Fidelity",
    categories: ["retirement", "beneficiary"],
    iconType: "article",
  },
  {
    id: "schwab-beneficiary-ira",
    label: "IRA Beneficiary Rules",
    url: "https://www.schwab.com/ira/inherited-ira",
    description: "Understanding IRA beneficiary rules",
    source: "Charles Schwab",
    categories: ["retirement", "beneficiary"],
    iconType: "article",
  },

  // Life Insurance
  {
    id: "iii-life-insurance-basics",
    label: "Life Insurance Basics",
    url: "https://www.iii.org/article/what-are-the-different-types-of-life-insurance",
    description: "Types of life insurance explained",
    source: "Insurance Information Institute",
    categories: ["life_insurance"],
    iconType: "article",
  },
  {
    id: "investopedia-ilit",
    label: "Irrevocable Life Insurance Trust",
    url: "https://www.investopedia.com/terms/i/irrevocable-life-insurance-trust.asp",
    description: "Using an ILIT for estate planning",
    source: "Investopedia",
    categories: ["life_insurance", "trust", "tax"],
    iconType: "article",
  },

  // Digital Assets
  {
    id: "nolo-digital-assets",
    label: "Digital Assets Estate Planning",
    url: "https://www.nolo.com/legal-encyclopedia/digital-assets-estate-planning.html",
    description: "Planning for digital assets after death",
    source: "Nolo",
    categories: ["digital_assets"],
    iconType: "article",
  },
  {
    id: "aarp-digital-estate",
    label: "Managing Digital Estate",
    url: "https://www.aarp.org/money/investing/info-2019/digital-estate-planning.html",
    description: "How to plan for your digital legacy",
    source: "AARP",
    categories: ["digital_assets"],
    iconType: "article",
  },

  // Business Succession
  {
    id: "sba-succession-planning",
    label: "Business Succession Planning",
    url: "https://www.sba.gov/business-guide/manage-your-business/close-or-sell-your-business",
    description: "SBA guide to business succession",
    source: "Small Business Administration",
    categories: ["business"],
    isOfficial: true,
    iconType: "article",
  },
  {
    id: "nolo-business-succession",
    label: "Business Succession Guide",
    url: "https://www.nolo.com/legal-encyclopedia/business-succession-planning",
    description: "Planning for business transfer",
    source: "Nolo",
    categories: ["business"],
    iconType: "article",
  },

  // Real Estate
  {
    id: "nolo-real-estate-transfer",
    label: "Transferring Real Estate",
    url: "https://www.nolo.com/legal-encyclopedia/transferring-real-estate-living-trust.html",
    description: "How to transfer real estate to a trust",
    source: "Nolo",
    categories: ["real_estate", "trust"],
    iconType: "article",
  },
  {
    id: "investopedia-joint-tenancy",
    label: "Joint Tenancy Explained",
    url: "https://www.investopedia.com/terms/j/joint-tenancy.asp",
    description: "Understanding joint property ownership",
    source: "Investopedia",
    categories: ["real_estate"],
    iconType: "article",
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get help links by category
 */
export function getHelpLinksByCategory(
  category: HelpCategory,
  config: HelpLinkConfig = defaultHelpLinkConfig
): HelpLink[] {
  if (!config.enabled) return [];

  return helpLinks
    .filter(link => link.categories.includes(category))
    .slice(0, config.maxLinksPerSection);
}

/**
 * Get help links by multiple categories (union)
 */
export function getHelpLinksByCategories(
  categories: HelpCategory[],
  config: HelpLinkConfig = defaultHelpLinkConfig
): HelpLink[] {
  if (!config.enabled) return [];

  const uniqueLinks = new Map<string, HelpLink>();

  for (const category of categories) {
    for (const link of helpLinks) {
      if (link.categories.includes(category)) {
        uniqueLinks.set(link.id, link);
      }
    }
  }

  return Array.from(uniqueLinks.values()).slice(0, config.maxLinksPerSection);
}

/**
 * Get help link by ID
 */
export function getHelpLinkById(id: string): HelpLink | undefined {
  return helpLinks.find(link => link.id === id);
}

/**
 * Get official (government) help links only
 */
export function getOfficialHelpLinks(
  category?: HelpCategory,
  config: HelpLinkConfig = defaultHelpLinkConfig
): HelpLink[] {
  if (!config.enabled) return [];

  let filtered = helpLinks.filter(link => link.isOfficial);

  if (category) {
    filtered = filtered.filter(link => link.categories.includes(category));
  }

  return filtered.slice(0, config.maxLinksPerSection);
}

/**
 * Get help links for a specific document type
 */
export function getHelpLinksForDocumentType(documentType: string): HelpLink[] {
  const categoryMap: Record<string, HelpCategory[]> = {
    will: ["will"],
    trust: ["trust"],
    poa_financial: ["poa"],
    poa_healthcare: ["poa", "healthcare"],
    healthcare_directive: ["healthcare"],
    hipaa: ["healthcare"],
    credit_shelter_trust: ["trust", "tax"],
    ilit: ["trust", "life_insurance", "tax"],
    homestead_declaration: ["real_estate", "state_specific"],
  };

  const categories = categoryMap[documentType] || ["general"];
  return getHelpLinksByCategories(categories);
}

/**
 * Get help links for a specific issue type
 */
export function getHelpLinksForIssueType(issueType: string): HelpLink[] {
  const categoryMap: Record<string, HelpCategory[]> = {
    missing_beneficiary: ["beneficiary", "retirement", "life_insurance"],
    unclear_trust: ["trust"],
    missing_guardian: ["guardian"],
    outdated_designation: ["beneficiary"],
    inconsistent_beneficiary: ["beneficiary"],
  };

  const categories = categoryMap[issueType] || ["general"];
  return getHelpLinksByCategories(categories);
}

// ============================================
// SECTION-SPECIFIC LINK GETTERS
// ============================================

/**
 * Get help links for the personal information intake section
 */
export function getPersonalSectionLinks(): HelpLink[] {
  return getHelpLinksByCategories(["general", "tax"]);
}

/**
 * Get help links for the assets intake section
 */
export function getAssetsSectionLinks(): HelpLink[] {
  return getHelpLinksByCategories(["real_estate", "retirement", "life_insurance", "digital_assets"]);
}

/**
 * Get help links for the family intake section
 */
export function getFamilySectionLinks(): HelpLink[] {
  return getHelpLinksByCategories(["guardian", "beneficiary"]);
}

/**
 * Get help links for the existing documents intake section
 */
export function getExistingDocumentsSectionLinks(): HelpLink[] {
  return getHelpLinksByCategories(["will", "trust", "poa", "healthcare"]);
}

/**
 * Get help links for the goals intake section
 */
export function getGoalsSectionLinks(): HelpLink[] {
  return getHelpLinksByCategories(["general", "tax", "medicaid"]);
}

/**
 * Get help links for the gap analysis results
 */
export function getGapAnalysisLinks(): HelpLink[] {
  return getHelpLinksByCategories(["general", "will", "trust", "poa", "healthcare", "beneficiary"]);
}

// ============================================
// LINK FORMATTING HELPERS
// ============================================

/**
 * Format a help link for display with appropriate attributes
 */
export function formatHelpLinkProps(
  link: HelpLink,
  config: HelpLinkConfig = defaultHelpLinkConfig
): {
  href: string;
  target?: string;
  rel?: string;
} {
  return {
    href: link.url,
    ...(config.openInNewTab && {
      target: "_blank",
      rel: "noopener noreferrer",
    }),
  };
}

/**
 * Get icon component name based on link type
 */
export function getIconTypeClass(iconType?: HelpLink["iconType"]): string {
  switch (iconType) {
    case "pdf":
      return "icon-pdf";
    case "video":
      return "icon-video";
    case "tool":
      return "icon-tool";
    case "article":
    case "external":
    default:
      return "icon-external";
  }
}

// ============================================
// EXPORTS
// ============================================

export default {
  helpLinks,
  defaultHelpLinkConfig,
  getHelpLinksByCategory,
  getHelpLinksByCategories,
  getHelpLinkById,
  getOfficialHelpLinks,
  getHelpLinksForDocumentType,
  getHelpLinksForIssueType,
  getPersonalSectionLinks,
  getAssetsSectionLinks,
  getFamilySectionLinks,
  getExistingDocumentsSectionLinks,
  getGoalsSectionLinks,
  getGapAnalysisLinks,
  formatHelpLinkProps,
  getIconTypeClass,
};
