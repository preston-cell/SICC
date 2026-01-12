// Glossary of estate planning terms with plain English definitions

export interface GlossaryTerm {
  term: string;
  definition: string;
  example?: string;
  category: GlossaryCategory;
  relatedTerms?: string[];
}

export type GlossaryCategory =
  | "estate-basics"
  | "documents"
  | "beneficiaries"
  | "taxes"
  | "healthcare"
  | "property";

export const GLOSSARY_CATEGORIES: Record<GlossaryCategory, { label: string; description: string }> = {
  "estate-basics": {
    label: "Estate Basics",
    description: "Fundamental concepts in estate planning",
  },
  documents: {
    label: "Documents",
    description: "Legal documents used in estate planning",
  },
  beneficiaries: {
    label: "Beneficiaries & Roles",
    description: "People involved in your estate plan",
  },
  taxes: {
    label: "Taxes & Finances",
    description: "Tax-related terms and financial concepts",
  },
  healthcare: {
    label: "Healthcare Decisions",
    description: "Medical and end-of-life planning terms",
  },
  property: {
    label: "Property & Assets",
    description: "How property is owned and transferred",
  },
};

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // Estate Basics
  {
    term: "Estate",
    definition:
      "Everything you own at the time of your death, including money, property, investments, and personal belongings.",
    example:
      "John's estate includes his house, car, bank accounts, retirement funds, and personal items.",
    category: "estate-basics",
    relatedTerms: ["Probate", "Estate Plan"],
  },
  {
    term: "Estate Plan",
    definition:
      "A collection of legal documents that specify how you want your assets distributed and medical decisions made if you can't make them yourself.",
    example:
      "A typical estate plan includes a will, power of attorney, and healthcare directive.",
    category: "estate-basics",
    relatedTerms: ["Will", "Trust", "Power of Attorney"],
  },
  {
    term: "Probate",
    definition:
      "The legal process of proving a will is valid and distributing assets after someone dies. This happens in court and can take months to years.",
    example:
      "After Mary passed, her will went through probate for 8 months before her children received their inheritance.",
    category: "estate-basics",
    relatedTerms: ["Will", "Executor", "Trust"],
  },
  {
    term: "Intestate",
    definition:
      "Dying without a valid will. When this happens, state law decides who gets your assets, which may not match your wishes.",
    example:
      "Because Tom died intestate, his assets went to his estranged brother instead of his longtime partner.",
    category: "estate-basics",
    relatedTerms: ["Will", "Probate"],
  },

  // Documents
  {
    term: "Will",
    definition:
      "A legal document that states who should receive your property after you die and who should manage your estate. Also called a 'Last Will and Testament.'",
    example:
      "In her will, Susan left her house to her daughter and her savings to be split between her grandchildren.",
    category: "documents",
    relatedTerms: ["Executor", "Beneficiary", "Probate"],
  },
  {
    term: "Trust",
    definition:
      "A legal arrangement where you transfer assets to a trustee who manages them for your beneficiaries. Trusts can avoid probate and provide more control over when and how assets are distributed.",
    example:
      "David set up a trust so his children would receive money gradually over 10 years rather than all at once.",
    category: "documents",
    relatedTerms: ["Trustee", "Beneficiary", "Revocable Living Trust"],
  },
  {
    term: "Revocable Living Trust",
    definition:
      "A trust you create during your lifetime that you can change or cancel at any time. Assets in this trust avoid probate and transfer directly to beneficiaries.",
    example:
      "Lisa put her house in a revocable living trust so it would pass to her kids without going through probate.",
    category: "documents",
    relatedTerms: ["Trust", "Irrevocable Trust", "Probate"],
  },
  {
    term: "Irrevocable Trust",
    definition:
      "A trust that generally cannot be changed or cancelled once created. Often used for tax planning or asset protection.",
    example:
      "To protect assets from potential lawsuits, Mark placed his investment property in an irrevocable trust.",
    category: "documents",
    relatedTerms: ["Trust", "Revocable Living Trust", "Estate Tax"],
  },
  {
    term: "Power of Attorney",
    definition:
      "A legal document that gives someone you trust the authority to make decisions on your behalf. Can be for financial matters, healthcare, or both.",
    example:
      "Sarah's power of attorney allows her daughter to pay bills and manage her bank accounts if she becomes incapacitated.",
    category: "documents",
    relatedTerms: ["Agent", "Healthcare Proxy"],
  },
  {
    term: "Healthcare Directive",
    definition:
      "A legal document that states your wishes for medical treatment if you can't communicate them yourself. Also called a 'Living Will' or 'Advance Directive.'",
    example:
      "Robert's healthcare directive specifies that he does not want to be kept on life support if there's no chance of recovery.",
    category: "documents",
    relatedTerms: ["Living Will", "Healthcare Proxy", "HIPAA Authorization"],
  },
  {
    term: "Living Will",
    definition:
      "A document that specifies what medical treatments you do or don't want if you're terminally ill or permanently unconscious and can't speak for yourself.",
    example:
      "Maria's living will states she wants comfort care only, not aggressive treatment, if she's in a permanent vegetative state.",
    category: "documents",
    relatedTerms: ["Healthcare Directive", "Healthcare Proxy"],
  },
  {
    term: "HIPAA Authorization",
    definition:
      "A form that allows specific people to access your medical records and speak with your doctors about your health. Without this, privacy laws prevent sharing your medical information.",
    example:
      "Thanks to the HIPAA authorization, James's wife could get updates from doctors during his hospital stay.",
    category: "documents",
    relatedTerms: ["Healthcare Directive", "Healthcare Proxy"],
  },

  // Beneficiaries & Roles
  {
    term: "Beneficiary",
    definition:
      "A person or organization you choose to receive assets from your will, trust, life insurance, or retirement accounts.",
    example:
      "Emma named her two children as equal beneficiaries of her life insurance policy.",
    category: "beneficiaries",
    relatedTerms: ["Primary Beneficiary", "Contingent Beneficiary"],
  },
  {
    term: "Primary Beneficiary",
    definition:
      "The first person or organization in line to receive your assets. They inherit first if they're alive when you pass.",
    example:
      "Tom's wife is the primary beneficiary of his 401(k) and will receive the full amount.",
    category: "beneficiaries",
    relatedTerms: ["Beneficiary", "Contingent Beneficiary"],
  },
  {
    term: "Contingent Beneficiary",
    definition:
      "A backup beneficiary who receives assets only if the primary beneficiary dies before you or can't accept the inheritance.",
    example:
      "If Tom's wife passes before him, their children are contingent beneficiaries and will split the 401(k).",
    category: "beneficiaries",
    relatedTerms: ["Beneficiary", "Primary Beneficiary"],
  },
  {
    term: "Executor",
    definition:
      "The person you name in your will to manage your estate after you die. They pay debts, file taxes, and distribute assets. Also called 'Personal Representative' in some states.",
    example:
      "As executor, Michael handled his mother's final affairs, including selling her house and distributing the proceeds.",
    category: "beneficiaries",
    relatedTerms: ["Will", "Probate", "Trustee"],
  },
  {
    term: "Trustee",
    definition:
      "The person or institution responsible for managing a trust and its assets according to the trust's instructions.",
    example:
      "The bank serves as trustee, investing the trust funds and sending monthly checks to the beneficiaries.",
    category: "beneficiaries",
    relatedTerms: ["Trust", "Beneficiary", "Successor Trustee"],
  },
  {
    term: "Successor Trustee",
    definition:
      "The person who takes over managing a trust if the original trustee can't serve anymore, due to death, incapacity, or resignation.",
    example:
      "When Dad could no longer manage his trust due to dementia, his daughter stepped in as successor trustee.",
    category: "beneficiaries",
    relatedTerms: ["Trustee", "Trust"],
  },
  {
    term: "Guardian",
    definition:
      "A person you name in your will to care for your minor children if both parents die. The guardian makes daily decisions about their upbringing.",
    example:
      "The Smiths named Sarah's sister as guardian for their young children in case something happened to both of them.",
    category: "beneficiaries",
    relatedTerms: ["Will", "Minor"],
  },
  {
    term: "Agent",
    definition:
      "The person you authorize to act on your behalf through a power of attorney. Also called 'Attorney-in-Fact.'",
    example:
      "As her agent, Jennifer can sign checks, pay bills, and make financial decisions for her elderly mother.",
    category: "beneficiaries",
    relatedTerms: ["Power of Attorney"],
  },
  {
    term: "Healthcare Proxy",
    definition:
      "A person you name to make medical decisions for you if you're unable to make them yourself.",
    example:
      "When Chris was in a coma, his healthcare proxy (his wife) made the decision to proceed with surgery.",
    category: "beneficiaries",
    relatedTerms: ["Healthcare Directive", "Agent"],
  },

  // Taxes & Finances
  {
    term: "Estate Tax",
    definition:
      "A tax on the transfer of property after death. Federal estate tax only applies to estates over $13.61 million (2024). Some states have lower thresholds.",
    example:
      "Because her estate was worth $15 million, federal estate tax was owed on the amount over the exemption.",
    category: "taxes",
    relatedTerms: ["Estate", "Inheritance Tax"],
  },
  {
    term: "Inheritance Tax",
    definition:
      "A tax paid by the person who receives an inheritance. Only some states have this tax, and rates often depend on your relationship to the deceased.",
    example:
      "In Pennsylvania, John paid 4.5% inheritance tax on money he inherited from his father.",
    category: "taxes",
    relatedTerms: ["Estate Tax", "Beneficiary"],
  },
  {
    term: "Gift Tax",
    definition:
      "A tax on giving large amounts of money or property to someone while you're alive. You can give up to $18,000 per person per year (2024) without triggering gift tax rules.",
    example:
      "Grandma gives each grandchild $18,000 annually for college, staying under the gift tax exclusion.",
    category: "taxes",
    relatedTerms: ["Estate Tax", "Annual Gift Exclusion"],
  },
  {
    term: "Stepped-Up Basis",
    definition:
      "When you inherit an asset, its value for tax purposes 'steps up' to its value at the owner's death. This can significantly reduce capital gains taxes if you sell.",
    example:
      "Dad bought stock for $10,000, worth $100,000 when he died. Thanks to stepped-up basis, if I sell for $100,000, I owe no capital gains tax.",
    category: "taxes",
    relatedTerms: ["Capital Gains", "Inheritance"],
  },

  // Healthcare
  {
    term: "DNR Order",
    definition:
      "Do Not Resuscitate - a medical order that tells healthcare providers not to perform CPR if your heart stops or you stop breathing.",
    example:
      "Given her terminal diagnosis, Grandma requested a DNR order to avoid aggressive intervention.",
    category: "healthcare",
    relatedTerms: ["Healthcare Directive", "Living Will"],
  },
  {
    term: "Incapacity",
    definition:
      "Being unable to make decisions for yourself due to illness, injury, or mental condition. This is when your power of attorney and healthcare proxy become active.",
    example:
      "After his stroke, Tom was determined to be incapacitated, and his wife began making decisions using her power of attorney.",
    category: "healthcare",
    relatedTerms: ["Power of Attorney", "Healthcare Proxy"],
  },
  {
    term: "Palliative Care",
    definition:
      "Medical care focused on comfort and quality of life rather than curing an illness. Can be provided alongside curative treatment.",
    example:
      "While continuing chemotherapy, Jane also received palliative care to manage pain and nausea.",
    category: "healthcare",
    relatedTerms: ["Hospice", "Healthcare Directive"],
  },
  {
    term: "Hospice",
    definition:
      "End-of-life care focused on comfort when curative treatment is no longer pursued. Typically for patients with less than 6 months to live.",
    example:
      "When treatment options were exhausted, the family chose hospice care so Dad could be comfortable at home.",
    category: "healthcare",
    relatedTerms: ["Palliative Care", "Healthcare Directive"],
  },

  // Property & Assets
  {
    term: "Community Property",
    definition:
      "In community property states, most assets acquired during marriage are owned 50/50 by both spouses, regardless of who earned the money.",
    example:
      "In California, even though only Mike worked, his salary and the house bought with it are community property owned equally by both spouses.",
    category: "property",
    relatedTerms: ["Separate Property", "Marital Property"],
  },
  {
    term: "Separate Property",
    definition:
      "Assets owned by one spouse alone, typically property owned before marriage or received as a gift or inheritance during marriage.",
    example:
      "The inheritance Sarah received from her parents is her separate property, not shared with her husband.",
    category: "property",
    relatedTerms: ["Community Property", "Marital Property"],
  },
  {
    term: "Joint Tenancy",
    definition:
      "A way of owning property with another person where, when one owner dies, their share automatically goes to the surviving owner(s) without probate.",
    example:
      "The couple owned their house in joint tenancy, so when the husband died, the wife automatically became sole owner.",
    category: "property",
    relatedTerms: ["Tenancy in Common", "Right of Survivorship"],
  },
  {
    term: "Tenancy in Common",
    definition:
      "A way of owning property with others where each person owns a specific share that they can leave to anyone in their will. No automatic transfer to other owners.",
    example:
      "The three siblings own the beach house as tenants in common, each with a 1/3 share they can leave to their own children.",
    category: "property",
    relatedTerms: ["Joint Tenancy", "Probate"],
  },
  {
    term: "Beneficiary Designation",
    definition:
      "The form you fill out for accounts like 401(k)s, IRAs, and life insurance that names who receives the money when you die. These override your will.",
    example:
      "Even though his will left everything to his wife, his 401(k) went to his ex-wife because he never updated the beneficiary designation.",
    category: "property",
    relatedTerms: ["Beneficiary", "Retirement Account"],
  },
  {
    term: "Transfer on Death (TOD)",
    definition:
      "A designation you can add to certain accounts or property that allows them to pass directly to a named beneficiary when you die, without probate.",
    example:
      "By adding a TOD designation to his brokerage account, Dan ensured his daughter would receive the stocks immediately without court involvement.",
    category: "property",
    relatedTerms: ["Payable on Death", "Beneficiary Designation"],
  },
  {
    term: "Payable on Death (POD)",
    definition:
      "Similar to TOD, a designation on bank accounts that names who receives the money when you die, bypassing probate.",
    example:
      "Linda added her son as POD beneficiary on her savings account so he could access the money right away after she passed.",
    category: "property",
    relatedTerms: ["Transfer on Death", "Beneficiary Designation"],
  },
  {
    term: "Pour-Over Will",
    definition:
      "A will that works with a trust, directing that any assets not already in the trust at death should 'pour over' into it.",
    example:
      "The car she forgot to transfer to her trust was caught by the pour-over will and added to the trust through a simplified probate.",
    category: "documents",
    relatedTerms: ["Trust", "Will", "Revocable Living Trust"],
  },
  {
    term: "Special Needs Trust",
    definition:
      "A trust designed to provide for a person with disabilities without disqualifying them from government benefits like Medicaid or SSI.",
    example:
      "To protect her son's disability benefits, Maria set up a special needs trust to supplement his care without counting as his assets.",
    category: "documents",
    relatedTerms: ["Trust", "Beneficiary"],
  },
];

// Helper function to get term by name (case-insensitive)
export function getTermByName(termName: string): GlossaryTerm | undefined {
  return GLOSSARY_TERMS.find(
    (t) => t.term.toLowerCase() === termName.toLowerCase()
  );
}

// Helper function to get terms by category
export function getTermsByCategory(category: GlossaryCategory): GlossaryTerm[] {
  return GLOSSARY_TERMS.filter((t) => t.category === category);
}

// Helper function to search terms
export function searchTerms(query: string): GlossaryTerm[] {
  const lowerQuery = query.toLowerCase();
  return GLOSSARY_TERMS.filter(
    (t) =>
      t.term.toLowerCase().includes(lowerQuery) ||
      t.definition.toLowerCase().includes(lowerQuery)
  );
}

// Map of common terms used in forms to their glossary terms
export const FORM_TERM_MAPPINGS: Record<string, string> = {
  beneficiary: "Beneficiary",
  "primary beneficiary": "Primary Beneficiary",
  "contingent beneficiary": "Contingent Beneficiary",
  executor: "Executor",
  trustee: "Trustee",
  guardian: "Guardian",
  trust: "Trust",
  will: "Will",
  "power of attorney": "Power of Attorney",
  "healthcare directive": "Healthcare Directive",
  "living will": "Living Will",
  hipaa: "HIPAA Authorization",
  "healthcare proxy": "Healthcare Proxy",
  probate: "Probate",
  "estate tax": "Estate Tax",
  "community property": "Community Property",
  "joint tenancy": "Joint Tenancy",
  "beneficiary designation": "Beneficiary Designation",
  "special needs trust": "Special Needs Trust",
  "revocable living trust": "Revocable Living Trust",
  "irrevocable trust": "Irrevocable Trust",
};
