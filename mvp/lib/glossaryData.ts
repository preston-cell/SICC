// Glossary of estate planning terms with plain English definitions
// Last updated: January 2026

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
  | "property"
  | "trusts";

export const GLOSSARY_CATEGORIES: Record<GlossaryCategory, { label: string; description: string; icon: string }> = {
  "estate-basics": {
    label: "Estate Basics",
    description: "Fundamental concepts in estate planning",
    icon: "foundation",
  },
  documents: {
    label: "Legal Documents",
    description: "Essential documents in your estate plan",
    icon: "document",
  },
  trusts: {
    label: "Trusts",
    description: "Different types of trusts and how they work",
    icon: "shield",
  },
  beneficiaries: {
    label: "People & Roles",
    description: "Key people involved in your estate plan",
    icon: "people",
  },
  taxes: {
    label: "Taxes & Finances",
    description: "Tax-related terms and financial concepts",
    icon: "calculator",
  },
  healthcare: {
    label: "Healthcare Decisions",
    description: "Medical and end-of-life planning terms",
    icon: "heart",
  },
  property: {
    label: "Property & Assets",
    description: "How property is owned and transferred",
    icon: "home",
  },
};

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // ============================================
  // ESTATE BASICS
  // ============================================
  {
    term: "Estate",
    definition:
      "Everything you own at the time of your death, including money, property, investments, digital assets, and personal belongings.",
    example:
      "John's estate includes his house, car, bank accounts, retirement funds, cryptocurrency, and personal items.",
    category: "estate-basics",
    relatedTerms: ["Probate", "Estate Plan"],
  },
  {
    term: "Estate Plan",
    definition:
      "A collection of legal documents that specify how you want your assets distributed and medical decisions made if you can't make them yourself.",
    example:
      "A comprehensive estate plan typically includes a will, trust, power of attorney, and healthcare directive.",
    category: "estate-basics",
    relatedTerms: ["Will", "Trust", "Power of Attorney"],
  },
  {
    term: "Probate",
    definition:
      "The legal court process of validating a will and distributing assets after someone dies. It's public, can be costly, and typically takes 6 months to 2 years.",
    example:
      "After Mary passed, her will went through probate for 14 months before her children received their inheritance.",
    category: "estate-basics",
    relatedTerms: ["Will", "Executor", "Trust"],
  },
  {
    term: "Intestate",
    definition:
      "Dying without a valid will. When this happens, state law determines who inherits your assets, which may not match your wishes.",
    example:
      "Because Tom died intestate, his assets went to his estranged brother instead of his longtime partner.",
    category: "estate-basics",
    relatedTerms: ["Will", "Probate"],
  },
  {
    term: "Testator",
    definition:
      "The person who creates and signs a will. The female form 'testatrix' is sometimes used but 'testator' is now commonly used for all genders.",
    example:
      "As the testator, Maria has the right to change her will at any time before her death.",
    category: "estate-basics",
    relatedTerms: ["Will", "Codicil"],
  },
  {
    term: "Grantor",
    definition:
      "The person who creates a trust and transfers assets into it. Also called 'settlor,' 'trustor,' or 'trust maker.'",
    example:
      "As the grantor, David transferred his investment accounts into the trust he created.",
    category: "estate-basics",
    relatedTerms: ["Trust", "Trustee", "Beneficiary"],
  },
  {
    term: "Fiduciary Duty",
    definition:
      "A legal obligation to act in someone else's best interest, not your own. Executors, trustees, and agents all have fiduciary duties.",
    example:
      "As trustee, Jennifer has a fiduciary duty to invest the trust assets wisely and not use them for her personal benefit.",
    category: "estate-basics",
    relatedTerms: ["Trustee", "Executor", "Agent"],
  },
  {
    term: "Capacity",
    definition:
      "The mental ability to understand and make legal decisions. You need capacity to create a valid will or trust.",
    example:
      "The attorney met with Grandma privately to confirm she had the mental capacity to sign her new will.",
    category: "estate-basics",
    relatedTerms: ["Incapacity", "Will", "Trust"],
  },

  // ============================================
  // LEGAL DOCUMENTS
  // ============================================
  {
    term: "Will",
    definition:
      "A legal document that states who should receive your property after you die and who should manage your estate. Also called a 'Last Will and Testament.'",
    example:
      "In her will, Susan left her house to her daughter and her savings to be split equally among her grandchildren.",
    category: "documents",
    relatedTerms: ["Executor", "Beneficiary", "Probate", "Codicil"],
  },
  {
    term: "Codicil",
    definition:
      "A legal document that makes changes or additions to an existing will without replacing the entire will.",
    example:
      "Rather than rewrite his entire will, Robert used a codicil to add his new grandchild as a beneficiary.",
    category: "documents",
    relatedTerms: ["Will", "Testator"],
  },
  {
    term: "Pour-Over Will",
    definition:
      "A will that works with a trust, directing that any assets not already in the trust at death should 'pour over' into it.",
    example:
      "The car she forgot to transfer to her trust was caught by the pour-over will and added to the trust.",
    category: "documents",
    relatedTerms: ["Trust", "Will", "Revocable Living Trust"],
  },
  {
    term: "Power of Attorney",
    definition:
      "A legal document that gives someone you trust (your 'agent') the authority to make decisions on your behalf. Can be for financial matters, healthcare, or both.",
    example:
      "Sarah's power of attorney allows her daughter to pay bills and manage her bank accounts if she becomes incapacitated.",
    category: "documents",
    relatedTerms: ["Agent", "Durable Power of Attorney", "Healthcare Proxy"],
  },
  {
    term: "Durable Power of Attorney",
    definition:
      "A power of attorney that remains valid even if you become mentally incapacitated. Without the 'durable' language, the power ends when you can't make decisions.",
    example:
      "Because it was durable, Tom's power of attorney allowed his wife to manage his finances after his stroke.",
    category: "documents",
    relatedTerms: ["Power of Attorney", "Agent", "Incapacity"],
  },
  {
    term: "Healthcare Directive",
    definition:
      "A legal document stating your wishes for medical treatment if you can't communicate them yourself. Also called an 'Advance Directive' or 'Living Will.'",
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
    relatedTerms: ["Healthcare Directive", "Healthcare Proxy", "DNR Order"],
  },
  {
    term: "HIPAA Authorization",
    definition:
      "A form that allows specific people to access your medical records and speak with your doctors. Without this, privacy laws prevent sharing your medical information.",
    example:
      "Thanks to the HIPAA authorization, James's wife could get updates from doctors during his hospital stay.",
    category: "documents",
    relatedTerms: ["Healthcare Directive", "Healthcare Proxy"],
  },
  {
    term: "Letter of Intent",
    definition:
      "A non-binding document that provides guidance to your executor or family about your wishes, including funeral preferences or explanations for your decisions.",
    example:
      "In her letter of intent, Grandma explained why she left more to her younger son—to help with his medical expenses.",
    category: "documents",
    relatedTerms: ["Will", "Executor"],
  },

  // ============================================
  // TRUSTS
  // ============================================
  {
    term: "Trust",
    definition:
      "A legal arrangement where you transfer assets to a trustee who manages them for your beneficiaries. Trusts can avoid probate, provide tax benefits, and control how assets are distributed.",
    example:
      "David set up a trust so his children would receive money gradually over 10 years rather than all at once.",
    category: "trusts",
    relatedTerms: ["Trustee", "Beneficiary", "Grantor"],
  },
  {
    term: "Revocable Living Trust",
    definition:
      "A trust you create during your lifetime that you can change or cancel at any time. Assets in this trust avoid probate and transfer directly to beneficiaries.",
    example:
      "Lisa put her house in a revocable living trust so it would pass to her kids without going through probate.",
    category: "trusts",
    relatedTerms: ["Trust", "Irrevocable Trust", "Pour-Over Will"],
  },
  {
    term: "Irrevocable Trust",
    definition:
      "A trust that generally cannot be changed or cancelled once created. Often used for tax planning, asset protection, or qualifying for Medicaid.",
    example:
      "To protect assets from potential nursing home costs, Mark placed his investment property in an irrevocable trust.",
    category: "trusts",
    relatedTerms: ["Trust", "Revocable Living Trust", "Estate Tax"],
  },
  {
    term: "Special Needs Trust",
    definition:
      "A trust designed to provide for a person with disabilities without disqualifying them from government benefits like Medicaid or SSI.",
    example:
      "To protect her son's disability benefits, Maria set up a special needs trust to supplement his care.",
    category: "trusts",
    relatedTerms: ["Trust", "Beneficiary"],
  },
  {
    term: "Spendthrift Trust",
    definition:
      "A trust that protects assets from a beneficiary's creditors and prevents the beneficiary from assigning their interest to others.",
    example:
      "Because her son had a gambling problem, Carol created a spendthrift trust so creditors couldn't take the inheritance.",
    category: "trusts",
    relatedTerms: ["Trust", "Beneficiary", "Trustee"],
  },
  {
    term: "Charitable Trust",
    definition:
      "A trust that benefits a charity while potentially providing tax benefits. Can be structured to pay income to you during your lifetime.",
    example:
      "The charitable remainder trust pays them income for life, then the remainder goes to their favorite nonprofit.",
    category: "trusts",
    relatedTerms: ["Trust", "Estate Tax", "Gift Tax"],
  },
  {
    term: "Pet Trust",
    definition:
      "A legal arrangement that provides for the care of your pets after you die or become incapacitated, including funds for their care.",
    example:
      "Margaret's pet trust ensures her three cats will be cared for by her neighbor, with $30,000 set aside for their expenses.",
    category: "trusts",
    relatedTerms: ["Trust", "Trustee"],
  },
  {
    term: "QTIP Trust",
    definition:
      "Qualified Terminable Interest Property Trust—provides income to a surviving spouse while preserving the principal for children from a prior marriage.",
    example:
      "John's QTIP trust ensures his second wife receives income for life, but the assets ultimately go to his children from his first marriage.",
    category: "trusts",
    relatedTerms: ["Trust", "Estate Tax", "Marital Deduction"],
  },
  {
    term: "Testamentary Trust",
    definition:
      "A trust created by your will that only comes into existence after you die. Unlike a living trust, it doesn't avoid probate.",
    example:
      "Her will creates a testamentary trust for her minor children, with her brother as trustee until they turn 25.",
    category: "trusts",
    relatedTerms: ["Trust", "Will", "Trustee"],
  },

  // ============================================
  // PEOPLE & ROLES
  // ============================================
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
      "A backup beneficiary who receives assets only if the primary beneficiary dies before you or cannot accept the inheritance.",
    example:
      "If Tom's wife passes before him, their children are contingent beneficiaries and will split the 401(k).",
    category: "beneficiaries",
    relatedTerms: ["Beneficiary", "Primary Beneficiary"],
  },
  {
    term: "Executor",
    definition:
      "The person you name in your will to manage your estate after you die. They pay debts, file taxes, and distribute assets. Also called 'Personal Representative.'",
    example:
      "As executor, Michael handled his mother's final affairs, including selling her house and distributing the proceeds.",
    category: "beneficiaries",
    relatedTerms: ["Will", "Probate", "Fiduciary Duty"],
  },
  {
    term: "Trustee",
    definition:
      "The person or institution responsible for managing a trust and its assets according to the trust's terms. Has a fiduciary duty to beneficiaries.",
    example:
      "The bank serves as trustee, investing the trust funds and sending monthly distributions to the beneficiaries.",
    category: "beneficiaries",
    relatedTerms: ["Trust", "Beneficiary", "Successor Trustee", "Fiduciary Duty"],
  },
  {
    term: "Successor Trustee",
    definition:
      "The person who takes over managing a trust if the original trustee dies, becomes incapacitated, or resigns.",
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
    relatedTerms: ["Will", "Minor", "Conservator"],
  },
  {
    term: "Conservator",
    definition:
      "A person appointed by a court to manage the affairs of an adult who cannot manage them due to incapacity. Similar to a guardian, but for adults.",
    example:
      "After her stroke, the court appointed her son as conservator to manage her finances.",
    category: "beneficiaries",
    relatedTerms: ["Guardian", "Incapacity", "Power of Attorney"],
  },
  {
    term: "Agent",
    definition:
      "The person you authorize to act on your behalf through a power of attorney. Also called 'Attorney-in-Fact.'",
    example:
      "As her agent, Jennifer can sign checks, pay bills, and make financial decisions for her elderly mother.",
    category: "beneficiaries",
    relatedTerms: ["Power of Attorney", "Fiduciary Duty"],
  },
  {
    term: "Healthcare Proxy",
    definition:
      "A person you name to make medical decisions for you if you're unable to make them yourself. Also called 'Healthcare Agent.'",
    example:
      "When Chris was in a coma, his healthcare proxy (his wife) made the decision to proceed with surgery.",
    category: "beneficiaries",
    relatedTerms: ["Healthcare Directive", "Agent"],
  },

  // ============================================
  // TAXES & FINANCES
  // ============================================
  {
    term: "Estate Tax",
    definition:
      "A federal tax on transferring property after death. Only applies to estates over $14.25 million (2026). Some states have their own estate taxes with lower thresholds.",
    example:
      "Because her estate was worth $16 million, federal estate tax was owed on the amount exceeding the exemption.",
    category: "taxes",
    relatedTerms: ["Estate", "Inheritance Tax", "Portability"],
  },
  {
    term: "Inheritance Tax",
    definition:
      "A tax paid by the person who receives an inheritance. Only 6 states have this tax (Iowa, Kentucky, Maryland, Nebraska, New Jersey, Pennsylvania), and rates depend on your relationship to the deceased.",
    example:
      "In Pennsylvania, John paid 4.5% inheritance tax on money inherited from his father, but his son paid 0% inheriting from John.",
    category: "taxes",
    relatedTerms: ["Estate Tax", "Beneficiary"],
  },
  {
    term: "Gift Tax",
    definition:
      "A tax on giving large amounts of money or property while alive. You can give up to $19,000 per person per year (2026) without any tax implications.",
    example:
      "Grandma gives each of her 5 grandchildren $19,000 annually for college—$95,000 total—all tax-free.",
    category: "taxes",
    relatedTerms: ["Estate Tax", "Annual Gift Exclusion", "Lifetime Exemption"],
  },
  {
    term: "Annual Gift Exclusion",
    definition:
      "The amount you can give to any person each year without using your lifetime gift tax exemption. Currently $19,000 per recipient (2026).",
    example:
      "A married couple can give $38,000 to each grandchild annually ($19,000 each) without any gift tax implications.",
    category: "taxes",
    relatedTerms: ["Gift Tax", "Lifetime Exemption"],
  },
  {
    term: "Lifetime Exemption",
    definition:
      "The total amount you can give away during your life and at death without paying federal estate or gift tax. Currently $14.25 million (2026).",
    example:
      "She gave $2 million to her children during her life, reducing her remaining lifetime exemption to $12.25 million.",
    category: "taxes",
    relatedTerms: ["Estate Tax", "Gift Tax"],
  },
  {
    term: "Portability",
    definition:
      "A surviving spouse can use their deceased spouse's unused estate tax exemption, potentially doubling the tax-free amount they can pass on.",
    example:
      "When her husband died using only $4 million of his exemption, she 'ported' his remaining $10.25 million to add to her own.",
    category: "taxes",
    relatedTerms: ["Estate Tax", "Marital Deduction"],
  },
  {
    term: "Stepped-Up Basis",
    definition:
      "When you inherit an asset, its tax value 'steps up' to its value at the owner's death. This can eliminate capital gains taxes on appreciation during the deceased's lifetime.",
    example:
      "Dad bought stock for $10,000, worth $100,000 when he died. Thanks to stepped-up basis, if I sell for $100,000, I owe no capital gains tax.",
    category: "taxes",
    relatedTerms: ["Capital Gains", "Inheritance"],
  },
  {
    term: "Marital Deduction",
    definition:
      "An unlimited deduction allowing you to transfer any amount to your spouse without estate or gift tax, as long as they're a U.S. citizen.",
    example:
      "He left his entire $20 million estate to his wife tax-free using the unlimited marital deduction.",
    category: "taxes",
    relatedTerms: ["Estate Tax", "Portability", "QTIP Trust"],
  },

  // ============================================
  // HEALTHCARE DECISIONS
  // ============================================
  {
    term: "DNR Order",
    definition:
      "Do Not Resuscitate—a medical order telling healthcare providers not to perform CPR if your heart stops or you stop breathing.",
    example:
      "Given her terminal diagnosis, Grandma requested a DNR order to avoid aggressive intervention at the end.",
    category: "healthcare",
    relatedTerms: ["Healthcare Directive", "Living Will", "POLST"],
  },
  {
    term: "POLST",
    definition:
      "Physician Orders for Life-Sustaining Treatment—a medical form that gives specific instructions about end-of-life care. More detailed than a DNR.",
    example:
      "Her POLST form specifies she wants IV fluids but no feeding tube or ventilator if she can't eat or breathe on her own.",
    category: "healthcare",
    relatedTerms: ["DNR Order", "Living Will", "Healthcare Directive"],
  },
  {
    term: "Incapacity",
    definition:
      "Being unable to make decisions for yourself due to illness, injury, or mental condition. This is when your power of attorney and healthcare proxy become active.",
    example:
      "After his stroke, Tom was determined to be incapacitated, and his wife began making decisions using her power of attorney.",
    category: "healthcare",
    relatedTerms: ["Power of Attorney", "Healthcare Proxy", "Conservator"],
  },
  {
    term: "Palliative Care",
    definition:
      "Medical care focused on comfort and quality of life rather than curing an illness. Can be provided alongside curative treatment at any stage.",
    example:
      "While continuing chemotherapy, Jane also received palliative care to manage pain and improve her quality of life.",
    category: "healthcare",
    relatedTerms: ["Hospice", "Healthcare Directive"],
  },
  {
    term: "Hospice",
    definition:
      "End-of-life care focused on comfort when curative treatment is no longer pursued. Typically for patients with a prognosis of 6 months or less.",
    example:
      "When treatment options were exhausted, the family chose hospice care so Dad could be comfortable at home with family.",
    category: "healthcare",
    relatedTerms: ["Palliative Care", "Healthcare Directive", "DNR Order"],
  },

  // ============================================
  // PROPERTY & ASSETS
  // ============================================
  {
    term: "Community Property",
    definition:
      "In 9 community property states, most assets acquired during marriage are owned 50/50 by both spouses, regardless of who earned the money.",
    example:
      "In California, even though only Mike worked, his salary and the house bought with it are community property—half belongs to his wife.",
    category: "property",
    relatedTerms: ["Separate Property", "Marital Property"],
  },
  {
    term: "Separate Property",
    definition:
      "Assets owned by one spouse alone, typically property owned before marriage or received as a gift or inheritance during marriage.",
    example:
      "The inheritance Sarah received from her parents is her separate property, not subject to division in divorce.",
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
    term: "Right of Survivorship",
    definition:
      "A feature of joint tenancy where the surviving owner(s) automatically inherit a deceased owner's share, bypassing probate and the will.",
    example:
      "Because of the right of survivorship, the house went directly to his wife even though his will said otherwise.",
    category: "property",
    relatedTerms: ["Joint Tenancy", "Tenancy in Common"],
  },
  {
    term: "Tenancy in Common",
    definition:
      "A way of owning property with others where each person owns a specific share they can leave to anyone in their will. No automatic transfer on death.",
    example:
      "The three siblings own the beach house as tenants in common, each with a 1/3 share they can leave to their own children.",
    category: "property",
    relatedTerms: ["Joint Tenancy", "Probate"],
  },
  {
    term: "Beneficiary Designation",
    definition:
      "The form you fill out for accounts like 401(k)s, IRAs, and life insurance naming who receives the money when you die. These override your will.",
    example:
      "Even though his will left everything to his wife, his 401(k) went to his ex-wife because he never updated the beneficiary designation after his divorce.",
    category: "property",
    relatedTerms: ["Beneficiary", "Retirement Account", "Transfer on Death"],
  },
  {
    term: "Transfer on Death (TOD)",
    definition:
      "A designation you can add to certain accounts, vehicles, or real estate that passes them directly to a named beneficiary when you die, skipping probate.",
    example:
      "By adding a TOD designation to his brokerage account, Dan ensured his daughter would receive the stocks immediately without court involvement.",
    category: "property",
    relatedTerms: ["Payable on Death", "Beneficiary Designation"],
  },
  {
    term: "Payable on Death (POD)",
    definition:
      "A designation on bank accounts that names who receives the money when you die, bypassing probate. The beneficiary has no access until your death.",
    example:
      "Linda added her son as POD beneficiary on her savings account so he could access the money right away after she passed.",
    category: "property",
    relatedTerms: ["Transfer on Death", "Beneficiary Designation"],
  },
  {
    term: "Digital Assets",
    definition:
      "Online accounts, digital files, cryptocurrency, social media, email, and other electronic property. Many states now have laws addressing digital asset planning.",
    example:
      "His estate plan includes instructions for his Bitcoin wallet, online photo storage, and social media accounts.",
    category: "property",
    relatedTerms: ["Estate", "Will", "Trust"],
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
  "durable power of attorney": "Durable Power of Attorney",
  "healthcare directive": "Healthcare Directive",
  "living will": "Living Will",
  "advance directive": "Healthcare Directive",
  hipaa: "HIPAA Authorization",
  "healthcare proxy": "Healthcare Proxy",
  probate: "Probate",
  "estate tax": "Estate Tax",
  "gift tax": "Gift Tax",
  "community property": "Community Property",
  "joint tenancy": "Joint Tenancy",
  "beneficiary designation": "Beneficiary Designation",
  "special needs trust": "Special Needs Trust",
  "revocable living trust": "Revocable Living Trust",
  "revocable trust": "Revocable Living Trust",
  "irrevocable trust": "Irrevocable Trust",
  "spendthrift trust": "Spendthrift Trust",
  "pet trust": "Pet Trust",
  codicil: "Codicil",
  grantor: "Grantor",
  settlor: "Grantor",
  testator: "Testator",
  fiduciary: "Fiduciary Duty",
  "digital assets": "Digital Assets",
  tod: "Transfer on Death",
  pod: "Payable on Death",
  dnr: "DNR Order",
  polst: "POLST",
  hospice: "Hospice",
  "palliative care": "Palliative Care",
};
