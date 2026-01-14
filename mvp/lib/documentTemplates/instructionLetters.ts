/**
 * Instruction Letters for Executors and Trustees
 *
 * These letters accompany the main legal documents and provide
 * practical guidance for the people you've named to carry out your wishes.
 */

// ============================================
// LETTER TO EXECUTOR
// ============================================

export interface ExecutorLetterData {
  testatorName: string;
  executorName: string;
  executorRelationship?: string;
  alternateExecutorName?: string;
  willLocation: string;
  estatePlanningAttorney?: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  importantContacts: Array<{
    name: string;
    role: string;
    phone?: string;
    email?: string;
  }>;
  financialAccounts?: Array<{
    institution: string;
    type: string;
    lastFourDigits?: string;
    notes?: string;
  }>;
  realPropertyLocations?: string[];
  safeDepositBoxLocation?: string;
  digitalAssets?: {
    hasPasswordManager: boolean;
    passwordManagerInfo?: string;
    importantOnlineAccounts?: string[];
  };
  insurancePolicies?: Array<{
    company: string;
    type: string;
    policyNumber?: string;
    beneficiary?: string;
  }>;
  specialInstructions?: string;
  funeralPreferences?: {
    burial: boolean;
    cremation: boolean;
    serviceType?: string;
    location?: string;
    otherWishes?: string;
  };
}

export function generateExecutorLetter(data: ExecutorLetterData): string {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let document = `
# LETTER TO MY EXECUTOR

## From ${data.testatorName}

---

**Date Prepared:** ${today}

---

Dear **${data.executorName}**,

Thank you for agreeing to serve as the Executor of my estate. This letter is meant to help you carry out your responsibilities by providing important information about my affairs. This is not a legal document, but rather a practical guide to accompany my Last Will and Testament.

Being an Executor can be a lot of work, and I appreciate your willingness to take on this role${data.executorRelationship ? ` as my ${data.executorRelationship}` : ""}.

---

## LOCATION OF IMPORTANT DOCUMENTS

### My Will
My Last Will and Testament is located at:
**${data.willLocation}**

`;

  if (data.alternateExecutorName) {
    document += `### Alternate Executor
If you are unable or unwilling to serve as Executor, I have named **${data.alternateExecutorName}** as my alternate Executor.

`;
  }

  if (data.estatePlanningAttorney) {
    document += `### Estate Planning Attorney
I recommend contacting my attorney for guidance:

**${data.estatePlanningAttorney.name}**
${data.estatePlanningAttorney.phone ? `Phone: ${data.estatePlanningAttorney.phone}` : ""}
${data.estatePlanningAttorney.email ? `Email: ${data.estatePlanningAttorney.email}` : ""}
${data.estatePlanningAttorney.address ? `Address: ${data.estatePlanningAttorney.address}` : ""}

`;
  }

  document += `---

## IMPORTANT CONTACTS

The following people should be contacted after my death:

| Name | Role | Contact Information |
|------|------|---------------------|
`;

  if (data.importantContacts && data.importantContacts.length > 0) {
    data.importantContacts.forEach((contact) => {
      const contactInfo = [contact.phone, contact.email].filter(Boolean).join(" / ");
      document += `| ${contact.name} | ${contact.role} | ${contactInfo || "See my address book"} |\n`;
    });
  }

  document += `

---

## FINANCIAL ACCOUNTS

Here is a summary of my financial accounts:

`;

  if (data.financialAccounts && data.financialAccounts.length > 0) {
    document += `| Institution | Account Type | Last 4 Digits | Notes |
|-------------|--------------|---------------|-------|
`;
    data.financialAccounts.forEach((account) => {
      document += `| ${account.institution} | ${account.type} | ${account.lastFourDigits || "N/A"} | ${account.notes || ""} |\n`;
    });
  } else {
    document += `Please review my financial records for a complete list of accounts.\n`;
  }

  document += `

**Important:** Some accounts may have named beneficiaries that will pass directly to those individuals outside of my will. Check with each institution.

`;

  if (data.safeDepositBoxLocation) {
    document += `### Safe Deposit Box
I have a safe deposit box at: **${data.safeDepositBoxLocation}**

The key is located: [Please specify where you keep the key]

`;
  }

  if (data.realPropertyLocations && data.realPropertyLocations.length > 0) {
    document += `---

## REAL PROPERTY

I own real property at the following locations:

`;
    data.realPropertyLocations.forEach((location, index) => {
      document += `${index + 1}. ${location}\n`;
    });
    document += `
Deeds and property documents are located with my important papers.

`;
  }

  if (data.insurancePolicies && data.insurancePolicies.length > 0) {
    document += `---

## INSURANCE POLICIES

| Company | Type | Policy Number | Beneficiary |
|---------|------|---------------|-------------|
`;
    data.insurancePolicies.forEach((policy) => {
      document += `| ${policy.company} | ${policy.type} | ${policy.policyNumber || "See policy"} | ${policy.beneficiary || "See policy"} |\n`;
    });
    document += `

`;
  }

  if (data.digitalAssets) {
    document += `---

## DIGITAL ASSETS

`;
    if (data.digitalAssets.hasPasswordManager) {
      document += `I use a password manager to store my login information:
**${data.digitalAssets.passwordManagerInfo || "Please see my separate digital assets document for access information."}**

`;
    }

    if (data.digitalAssets.importantOnlineAccounts && data.digitalAssets.importantOnlineAccounts.length > 0) {
      document += `Important online accounts to be aware of:
`;
      data.digitalAssets.importantOnlineAccounts.forEach((account) => {
        document += `- ${account}\n`;
      });
      document += `
`;
    }

    document += `Consider closing or memorializing social media accounts according to my preferences and the platform's policies.

`;
  }

  if (data.funeralPreferences) {
    document += `---

## FUNERAL AND MEMORIAL PREFERENCES

`;
    if (data.funeralPreferences.burial) {
      document += `I prefer to be **buried**.\n`;
    } else if (data.funeralPreferences.cremation) {
      document += `I prefer to be **cremated**.\n`;
    }

    if (data.funeralPreferences.serviceType) {
      document += `Service type: ${data.funeralPreferences.serviceType}\n`;
    }

    if (data.funeralPreferences.location) {
      document += `Preferred location: ${data.funeralPreferences.location}\n`;
    }

    if (data.funeralPreferences.otherWishes) {
      document += `
Other wishes:
${data.funeralPreferences.otherWishes}
`;
    }

    document += `
`;
  }

  if (data.specialInstructions) {
    document += `---

## SPECIAL INSTRUCTIONS

${data.specialInstructions}

`;
  }

  document += `---

## YOUR DUTIES AS EXECUTOR

As my Executor, your main responsibilities include:

1. **Locate and file my will** with the probate court (if required in your state)
2. **Notify beneficiaries** and relevant institutions of my death
3. **Inventory my assets** and have them appraised if necessary
4. **Pay my debts and taxes** from estate funds
5. **Distribute assets** according to my will
6. **File final tax returns** (personal and estate)
7. **Close accounts** and settle final affairs

### Tips for Executors

- **Keep detailed records** of all transactions and decisions
- **Open an estate bank account** to manage estate funds
- **Don't rush** - you have time to do things correctly
- **Get professional help** - hire an attorney or accountant if needed
- **Communicate** with beneficiaries regularly
- **Take care of yourself** - this can be an emotional and time-consuming task

---

## CLOSING THOUGHTS

Thank you again for taking on this responsibility. I have confidence that you will handle my affairs with care and integrity. Please don't hesitate to seek professional guidance when needed, and know that any reasonable expenses you incur can be reimbursed from my estate.

With gratitude,

**${data.testatorName}**

---

**Note:** This letter should be updated whenever there are significant changes to my financial situation, contacts, or wishes. The most recent version should be kept with my will.
`;

  return document;
}

// ============================================
// LETTER TO SUCCESSOR TRUSTEE
// ============================================

export interface TrusteeLetterData {
  grantorName: string;
  trustName: string;
  trusteeName: string;
  trusteeRelationship?: string;
  alternateTrusteeName?: string;
  trustDocumentLocation: string;
  estatePlanningAttorney?: {
    name: string;
    phone?: string;
    email?: string;
  };
  trustAssets?: Array<{
    description: string;
    location?: string;
    notes?: string;
  }>;
  beneficiaries?: Array<{
    name: string;
    relationship?: string;
    whatTheyReceive: string;
  }>;
  specialDistributionInstructions?: string;
  ongoingTrustManagement?: boolean;
  minorBeneficiaries?: Array<{
    name: string;
    distributionAge: number;
    currentAge?: number;
  }>;
}

export function generateTrusteeLetter(data: TrusteeLetterData): string {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let document = `
# LETTER TO MY SUCCESSOR TRUSTEE

## ${data.trustName}

---

**Date Prepared:** ${today}

---

Dear **${data.trusteeName}**,

Thank you for agreeing to serve as the Successor Trustee of my living trust. This letter provides practical guidance to help you carry out your responsibilities. The legal terms of the trust are in the trust document itself; this letter supplements that document with practical information.

---

## TRUST DOCUMENT LOCATION

The original trust document is located at:
**${data.trustDocumentLocation}**

`;

  if (data.alternateTrusteeName) {
    document += `If you are unable or unwilling to serve as Trustee, I have named **${data.alternateTrusteeName}** as alternate Successor Trustee.

`;
  }

  if (data.estatePlanningAttorney) {
    document += `### Estate Planning Attorney
For legal guidance, please contact:

**${data.estatePlanningAttorney.name}**
${data.estatePlanningAttorney.phone ? `Phone: ${data.estatePlanningAttorney.phone}` : ""}
${data.estatePlanningAttorney.email ? `Email: ${data.estatePlanningAttorney.email}` : ""}

`;
  }

  document += `---

## WHEN YOUR ROLE BEGINS

You will become the acting Trustee in two situations:

1. **If I become incapacitated:** You will manage the trust property for my benefit until I recover or pass away.

2. **Upon my death:** You will distribute the trust property to my beneficiaries according to the trust document.

---

## TRUST ASSETS

The following property is held in the trust:

`;

  if (data.trustAssets && data.trustAssets.length > 0) {
    document += `| Asset | Location/Details | Notes |
|-------|------------------|-------|
`;
    data.trustAssets.forEach((asset) => {
      document += `| ${asset.description} | ${asset.location || "See trust Schedule A"} | ${asset.notes || ""} |\n`;
    });
  } else {
    document += `Please refer to Schedule A of the trust document for a complete list of trust assets.\n`;
  }

  document += `

**Important:** Property must be properly titled in the name of the trust to be considered a trust asset. Check the title/ownership of each asset.

`;

  if (data.beneficiaries && data.beneficiaries.length > 0) {
    document += `---

## BENEFICIARIES

Upon my death, the trust property should be distributed to:

| Beneficiary | Relationship | What They Receive |
|-------------|--------------|-------------------|
`;
    data.beneficiaries.forEach((ben) => {
      document += `| ${ben.name} | ${ben.relationship || ""} | ${ben.whatTheyReceive} |\n`;
    });
    document += `

Please refer to the trust document for complete distribution instructions, including alternate beneficiaries.

`;
  }

  if (data.minorBeneficiaries && data.minorBeneficiaries.length > 0) {
    document += `---

## MINOR BENEFICIARIES

The following beneficiaries are minors or young adults. Their inheritances will be held in subtrusts or custodial accounts:

| Beneficiary | Receives Property Outright At Age |
|-------------|-----------------------------------|
`;
    data.minorBeneficiaries.forEach((minor) => {
      document += `| ${minor.name} | ${minor.distributionAge} |\n`;
    });
    document += `

Until they reach the specified age, you or the subtrust trustee may use funds for their health, education, and support.

`;
  }

  if (data.specialDistributionInstructions) {
    document += `---

## SPECIAL DISTRIBUTION INSTRUCTIONS

${data.specialDistributionInstructions}

`;
  }

  document += `---

## YOUR DUTIES AS TRUSTEE

### If I Become Incapacitated

1. **Determine incapacity** according to the procedure in the trust document
2. **Take control of trust assets** and manage them for my benefit
3. **Pay my bills and expenses** from trust funds
4. **Keep detailed records** of all transactions
5. **Communicate with my family** about my care and finances
6. **If I recover,** return control to me

### Upon My Death

1. **Obtain certified copies** of my death certificate (at least 10-15)
2. **Locate all trust assets** and take control of them
3. **Notify beneficiaries** of their inheritance
4. **Pay any outstanding debts** and taxes from trust assets
5. **Distribute assets** according to the trust document
6. **Prepare a final accounting** for beneficiaries
7. **Close the trust** when distribution is complete

---

## IMPORTANT REMINDERS

- **The trust avoids probate** - you should be able to distribute assets without court involvement
- **You have a fiduciary duty** - you must act in the best interest of the beneficiaries
- **Keep personal and trust funds separate** - never mix trust assets with your own
- **You can be compensated** for your time and reimbursed for expenses
- **Get professional help** when needed - legal, tax, and financial advisors

---

## THINGS YOU SHOULD NOT DO

- Do NOT distribute trust property until debts and taxes are paid
- Do NOT favor one beneficiary over another (unless the trust specifically allows it)
- Do NOT use trust assets for your personal benefit (unless you're also a beneficiary)
- Do NOT make risky investments with trust funds
- Do NOT delay distribution unreasonably

---

Thank you for accepting this important responsibility. I trust your judgment and know you will handle my affairs with care.

With gratitude,

**${data.grantorName}**

---

**Note:** This letter should be updated whenever there are significant changes to trust assets or my wishes. The most recent version should be kept with the trust document.
`;

  return document;
}

export default {
  generateExecutorLetter,
  generateTrusteeLetter,
};
