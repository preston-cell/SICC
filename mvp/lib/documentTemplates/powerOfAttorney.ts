/**
 * Durable Power of Attorney Templates
 *
 * Includes:
 * - Durable Power of Attorney for Finances
 * - Healthcare Power of Attorney (separate from Living Will)
 */

// ============================================
// FINANCIAL POWER OF ATTORNEY
// ============================================

export interface FinancialPOAData {
  // Principal Information
  principalFullName: string;
  principalAddress: string;
  principalCity: string;
  principalState: string;
  principalCounty: string;

  // Agent (Attorney-in-Fact)
  agentName: string;
  agentAddress?: string;
  agentRelationship?: string;

  // Alternate Agents
  alternateAgentName?: string;
  alternateAgentAddress?: string;
  alternateAgentRelationship?: string;
  secondAlternateAgentName?: string;

  // Effective Date
  effectiveImmediately: boolean;
  springingPOA?: boolean; // Only effective upon incapacity

  // Powers Granted
  powers: {
    realEstate: boolean;
    financialInstitutions: boolean;
    stocks: boolean;
    bonds: boolean;
    commodities: boolean;
    tangiblePersonalProperty: boolean;
    safeDepositBoxes: boolean;
    insurance: boolean;
    retirement: boolean;
    taxes: boolean;
    gifts: boolean;
    trusts: boolean;
    businessOperations: boolean;
    claims: boolean;
    government: boolean;
    allPowers: boolean;
  };

  // Limitations
  limitations?: string[];

  // Gift Powers
  allowGifts: boolean;
  giftLimitPerPerson?: number;
  giftLimitPerYear?: number;
  allowGiftsToAgent?: boolean;

  // Special Instructions
  specialInstructions?: string;

  // Compensation
  agentCompensation: "none" | "reasonable" | "specific";
  compensationAmount?: string;

  // Execution
  executionDate?: string;
}

export function generateFinancialPOA(data: FinancialPOAData): string {
  let document = `
# DURABLE POWER OF ATTORNEY FOR FINANCES

---

**IMPORTANT NOTICE:** This document is a DRAFT for review purposes only. A Power of Attorney is a powerful legal document. Before signing, you should have this document reviewed by a licensed attorney in your state. Once signed, the Agent will have significant authority over your financial affairs.

---

## ARTICLE 1: DESIGNATION OF AGENT

I, **${data.principalFullName}**, residing at ${data.principalAddress}, ${data.principalCity}, ${data.principalState}, (the "Principal"), hereby appoint:

**${data.agentName}**${data.agentAddress ? `\n${data.agentAddress}` : ""}${data.agentRelationship ? `\n(${data.agentRelationship})` : ""}

as my Agent (Attorney-in-Fact) to act for me in any lawful way with respect to the powers designated in this document.

`;

  if (data.alternateAgentName) {
    document += `### Alternate Agent

If my primary Agent is unable or unwilling to serve, I appoint:

**${data.alternateAgentName}**${data.alternateAgentAddress ? `\n${data.alternateAgentAddress}` : ""}${data.alternateAgentRelationship ? `\n(${data.alternateAgentRelationship})` : ""}

as my alternate Agent.

`;

    if (data.secondAlternateAgentName) {
      document += `If my first alternate Agent is also unable or unwilling to serve, I appoint **${data.secondAlternateAgentName}** as my second alternate Agent.

`;
    }
  }

  document += `---

## ARTICLE 2: EFFECTIVE DATE

`;

  if (data.effectiveImmediately) {
    document += `This Power of Attorney is effective **immediately** upon my signing and shall remain in effect until I revoke it or until my death.

`;
  } else if (data.springingPOA) {
    document += `This is a **"Springing" Power of Attorney**. It shall not become effective until I become incapacitated. My incapacity shall be determined by:

- A written statement by my attending physician stating that I am unable to manage my financial affairs; OR
- A written statement by two licensed physicians stating that I am unable to manage my financial affairs.

Upon such determination, this Power of Attorney shall become immediately effective.

`;
  }

  document += `---

## ARTICLE 3: DURABILITY

This Power of Attorney shall not be affected by my subsequent disability or incapacity. This is a **Durable Power of Attorney** under the laws of ${data.principalState}.

---

## ARTICLE 4: POWERS GRANTED

`;

  if (data.powers.allPowers) {
    document += `I grant my Agent **ALL POWERS** available under the laws of ${data.principalState}, including but not limited to all powers listed below.

`;
  }

  document += `I grant my Agent the following powers:

`;

  const powerDescriptions: Record<string, string> = {
    realEstate: `**Real Estate:** To buy, sell, lease, exchange, mortgage, encumber, or otherwise manage any real property I own or may acquire.`,
    financialInstitutions: `**Banking & Financial Institutions:** To open, close, and manage checking, savings, and money market accounts; to make deposits and withdrawals; to sign checks; to access safe deposit boxes.`,
    stocks: `**Stocks and Securities:** To buy, sell, and trade stocks, mutual funds, and other securities; to exercise stock options; to vote proxies.`,
    bonds: `**Bonds:** To purchase, sell, and manage bonds, including government and corporate bonds.`,
    commodities: `**Commodities:** To buy, sell, and trade commodity contracts and options.`,
    tangiblePersonalProperty: `**Personal Property:** To buy, sell, lease, and manage personal property including vehicles, equipment, and household goods.`,
    safeDepositBoxes: `**Safe Deposit Boxes:** To rent, access, and surrender safe deposit boxes.`,
    insurance: `**Insurance:** To purchase, maintain, modify, or cancel insurance policies; to collect insurance proceeds; to designate beneficiaries.`,
    retirement: `**Retirement Accounts:** To manage IRA, 401(k), pension, and other retirement accounts; to make contributions and withdrawals; to change beneficiary designations.`,
    taxes: `**Tax Matters:** To prepare, sign, and file tax returns; to represent me before the IRS and state tax authorities; to make tax elections; to receive confidential tax information.`,
    gifts: `**Gifts:** To make gifts on my behalf as described in Article 5 below.`,
    trusts: `**Trust Transactions:** To create, amend, or revoke trusts; to transfer property to and from trusts; to serve as trustee.`,
    businessOperations: `**Business Operations:** To operate, manage, buy, sell, or dissolve any business entity in which I have an interest.`,
    claims: `**Claims and Litigation:** To settle, compromise, or pursue claims; to initiate or defend lawsuits; to hire attorneys.`,
    government: `**Government Benefits:** To apply for and manage government benefits including Social Security, Medicare, Medicaid, and veteran's benefits.`,
  };

  Object.entries(data.powers).forEach(([power, granted]) => {
    if (granted && power !== "allPowers" && powerDescriptions[power]) {
      document += `- ${powerDescriptions[power]}\n\n`;
    }
  });

  document += `---

## ARTICLE 5: GIFT-MAKING POWERS

`;

  if (data.allowGifts) {
    document += `I authorize my Agent to make gifts on my behalf, subject to the following limitations:

`;
    if (data.giftLimitPerPerson) {
      document += `- Maximum gift to any one person: **$${data.giftLimitPerPerson.toLocaleString()}** per year\n`;
    }
    if (data.giftLimitPerYear) {
      document += `- Maximum total gifts per year: **$${data.giftLimitPerYear.toLocaleString()}**\n`;
    }
    if (data.allowGiftsToAgent) {
      document += `- My Agent IS permitted to make gifts to themselves, provided such gifts are consistent with my established pattern of giving.\n`;
    } else {
      document += `- My Agent is NOT permitted to make gifts to themselves.\n`;
    }
    document += `\n`;
  } else {
    document += `My Agent is **NOT** authorized to make gifts on my behalf.\n\n`;
  }

  document += `---

## ARTICLE 6: LIMITATIONS ON AGENT'S AUTHORITY

My Agent shall NOT have the authority to:

1. Make, publish, declare, amend, or revoke my Last Will and Testament
2. Create, amend, or revoke my living trust (unless specifically authorized in Article 4)
3. Designate or change beneficiaries under my life insurance policies or retirement accounts (unless specifically authorized in Article 4)
4. Exercise powers or take actions that would disqualify me for public benefits

`;

  if (data.limitations && data.limitations.length > 0) {
    document += `Additionally, my Agent's authority is limited as follows:\n\n`;
    data.limitations.forEach((limit, index) => {
      document += `${index + 1}. ${limit}\n`;
    });
    document += `\n`;
  }

  document += `---

## ARTICLE 7: AGENT'S DUTIES

My Agent shall:

1. **Act in my best interest** and exercise the powers granted in good faith
2. **Avoid conflicts of interest** between my interests and the Agent's personal interests
3. **Keep accurate records** of all transactions made on my behalf
4. **Preserve my estate plan** to the extent known to the Agent
5. **Cooperate with my healthcare agent** if one has been appointed

---

## ARTICLE 8: AGENT'S LIABILITY

My Agent shall not be liable for any actions taken in good faith under this Power of Attorney. Any third party may rely upon the Agent's authority as set forth in this document.

---

## ARTICLE 9: COMPENSATION

`;

  if (data.agentCompensation === "none") {
    document += `My Agent shall serve without compensation.\n\n`;
  } else if (data.agentCompensation === "specific" && data.compensationAmount) {
    document += `My Agent shall receive compensation of **${data.compensationAmount}** for services rendered.\n\n`;
  } else {
    document += `My Agent shall be entitled to reasonable compensation for services rendered.\n\n`;
  }

  document += `My Agent shall be reimbursed for all reasonable expenses incurred in acting under this Power of Attorney.

---

## ARTICLE 10: THIRD-PARTY RELIANCE

Any third party who receives a copy of this Power of Attorney may rely upon it without further inquiry. No third party shall be liable for acting in good faith reliance on this Power of Attorney.

---

## ARTICLE 11: REVOCATION

I may revoke this Power of Attorney at any time by:
1. Destroying all copies of this document
2. Executing a written revocation and delivering it to my Agent
3. Executing a new Power of Attorney that expressly revokes this one

This Power of Attorney is automatically revoked upon my death.

---

`;

  if (data.specialInstructions) {
    document += `## ARTICLE 12: SPECIAL INSTRUCTIONS

${data.specialInstructions}

---

`;
  }

  document += `## SIGNATURE OF PRINCIPAL

I sign this Durable Power of Attorney for Finances on this ______ day of ______________, 20____, at ${data.principalCity}, ${data.principalState}.


_____________________________________________
**${data.principalFullName}**, Principal


---

## ACCEPTANCE BY AGENT

I, **${data.agentName}**, have read the foregoing Power of Attorney. I understand my duties as Agent, including the duty to:
- Act in the Principal's best interest
- Avoid conflicts of interest
- Keep accurate records
- Act only within the scope of authority granted

I hereby accept the appointment as Agent.

Date: ______________________


_____________________________________________
**${data.agentName}**, Agent


---

## NOTARY ACKNOWLEDGMENT

STATE OF ${data.principalState.toUpperCase()}
COUNTY OF ${data.principalCounty.toUpperCase()}

On this ______ day of ______________, 20____, before me personally appeared **${data.principalFullName}**, known to me (or proved to me on the basis of satisfactory evidence) to be the person whose name is subscribed to the within instrument and acknowledged to me that they executed the same in their authorized capacity, and that by their signature on the instrument, the person, or the entity upon behalf of which the person acted, executed the instrument.

WITNESS my hand and official seal.


_____________________________________________
Notary Public

My Commission Expires: ____________________

[NOTARY SEAL]

---

## WITNESS ATTESTATION

We, the undersigned witnesses, declare that the person who signed this document, or asked another to sign for them, did so in our presence, appeared to be of sound mind and under no duress, fraud, or undue influence.


**Witness 1:**

_____________________________________________
Signature

_____________________________________________
Printed Name

_____________________________________________
Address


**Witness 2:**

_____________________________________________
Signature

_____________________________________________
Printed Name

_____________________________________________
Address


---

**DISCLAIMER:** This document was generated for informational purposes and is a DRAFT. It does not constitute legal advice. Before signing, consult with a licensed attorney in ${data.principalState} to ensure this document meets all applicable legal requirements.
`;

  return document;
}

// ============================================
// HEALTHCARE POWER OF ATTORNEY
// ============================================

export interface HealthcarePOAData {
  // Principal Information
  principalFullName: string;
  principalAddress: string;
  principalCity: string;
  principalState: string;
  principalCounty: string;
  principalDateOfBirth?: string;

  // Healthcare Agent
  agentName: string;
  agentAddress?: string;
  agentPhone?: string;
  agentRelationship?: string;

  // Alternate Agents
  alternateAgentName?: string;
  alternateAgentAddress?: string;
  alternateAgentPhone?: string;
  alternateAgentRelationship?: string;
  secondAlternateAgentName?: string;

  // Agent Authority
  authorityStartsUpon: "signing" | "incapacity";

  // Powers Granted
  powers: {
    consentToTreatment: boolean;
    refuseTreatment: boolean;
    withdrawTreatment: boolean;
    accessMedicalRecords: boolean;
    hireDischargeMedicalPersonnel: boolean;
    admitToFacilities: boolean;
    organDonation: boolean;
    autopsy: boolean;
    dispositionOfRemains: boolean;
  };

  // Specific Instructions
  lifeSustainingTreatment?: "continue_all" | "comfort_care_only" | "agent_decides";
  artificialNutrition?: "yes" | "no" | "agent_decides";
  organDonationPreference?: "yes" | "no" | "agent_decides";
  religiousPreferences?: string;
  specificTreatmentPreferences?: string;

  // End of Life Wishes
  hospiceCare?: boolean;
  dieAtHome?: boolean;
  painManagement?: "comfort_priority" | "consciousness_priority" | "balanced";

  // Execution
  executionDate?: string;
}

export function generateHealthcarePOA(data: HealthcarePOAData): string {
  let document = `
# HEALTHCARE POWER OF ATTORNEY

## (Health Care Proxy / Medical Power of Attorney)

---

**IMPORTANT NOTICE:** This document is a DRAFT for review purposes only. Before signing, you should have this document reviewed by a licensed attorney in your state. This document gives your Agent authority to make medical decisions for you if you cannot make them yourself.

---

## PART 1: DESIGNATION OF HEALTHCARE AGENT

I, **${data.principalFullName}**${data.principalDateOfBirth ? `, born ${data.principalDateOfBirth}` : ""}, residing at:

${data.principalAddress}
${data.principalCity}, ${data.principalState}

hereby designate the following person as my Healthcare Agent (also known as Health Care Proxy or Medical Power of Attorney):

### Primary Healthcare Agent

**Name:** ${data.agentName}
${data.agentAddress ? `**Address:** ${data.agentAddress}` : ""}
${data.agentPhone ? `**Phone:** ${data.agentPhone}` : ""}
${data.agentRelationship ? `**Relationship:** ${data.agentRelationship}` : ""}

`;

  if (data.alternateAgentName) {
    document += `### Alternate Healthcare Agent

If my primary Healthcare Agent is unavailable, unwilling, or unable to serve, I designate:

**Name:** ${data.alternateAgentName}
${data.alternateAgentAddress ? `**Address:** ${data.alternateAgentAddress}` : ""}
${data.alternateAgentPhone ? `**Phone:** ${data.alternateAgentPhone}` : ""}
${data.alternateAgentRelationship ? `**Relationship:** ${data.alternateAgentRelationship}` : ""}

`;

    if (data.secondAlternateAgentName) {
      document += `If my first alternate is also unavailable, I designate **${data.secondAlternateAgentName}** as my second alternate Healthcare Agent.

`;
    }
  }

  document += `---

## PART 2: WHEN AUTHORITY BEGINS

`;

  if (data.authorityStartsUpon === "signing") {
    document += `My Healthcare Agent's authority to make healthcare decisions for me is effective **immediately upon signing** this document and continues until I revoke it.

`;
  } else {
    document += `My Healthcare Agent's authority to make healthcare decisions for me becomes effective **only if I become unable to make my own healthcare decisions**, as determined by my attending physician.

`;
  }

  document += `---

## PART 3: POWERS GRANTED TO MY HEALTHCARE AGENT

I grant my Healthcare Agent the authority to make healthcare decisions for me, including but not limited to:

`;

  if (data.powers.consentToTreatment) {
    document += `- **Consent to Treatment:** To consent to any medical treatment, procedure, or diagnostic test that my physicians recommend.

`;
  }

  if (data.powers.refuseTreatment) {
    document += `- **Refuse Treatment:** To refuse any medical treatment, even if such refusal may result in my death.

`;
  }

  if (data.powers.withdrawTreatment) {
    document += `- **Withdraw Treatment:** To withdraw or discontinue any treatment, including life-sustaining treatment, in accordance with my wishes as expressed below or as my Agent determines is in my best interest.

`;
  }

  if (data.powers.accessMedicalRecords) {
    document += `- **Access Medical Records:** To access, receive, and review all of my medical records and health information, including information protected under HIPAA.

`;
  }

  if (data.powers.hireDischargeMedicalPersonnel) {
    document += `- **Medical Personnel:** To hire and discharge physicians, nurses, and other healthcare providers.

`;
  }

  if (data.powers.admitToFacilities) {
    document += `- **Facility Decisions:** To admit me to or discharge me from hospitals, nursing homes, assisted living facilities, or hospice programs.

`;
  }

  if (data.powers.organDonation) {
    document += `- **Organ Donation:** To make decisions regarding organ, tissue, or body donation.

`;
  }

  if (data.powers.autopsy) {
    document += `- **Autopsy:** To consent to or refuse an autopsy.

`;
  }

  if (data.powers.dispositionOfRemains) {
    document += `- **Disposition of Remains:** To make decisions regarding the disposition of my remains, including burial, cremation, and funeral arrangements.

`;
  }

  document += `---

## PART 4: LIFE-SUSTAINING TREATMENT

`;

  if (data.lifeSustainingTreatment === "continue_all") {
    document += `I direct that **all life-sustaining treatment** be provided to me regardless of my condition, unless my death is imminent and such treatment would only prolong the dying process.

`;
  } else if (data.lifeSustainingTreatment === "comfort_care_only") {
    document += `If I have a terminal condition or am in a persistent vegetative state, and two physicians determine that there is no reasonable medical probability of my recovery, I direct that:

- Life-sustaining treatment be **withheld or withdrawn**
- I be provided with **comfort care** to relieve pain and suffering
- Treatment be provided to keep me comfortable and maintain my dignity

`;
  } else {
    document += `I authorize my Healthcare Agent to make decisions about life-sustaining treatment based on their knowledge of my values and their assessment of my best interests.

`;
  }

  document += `### Artificial Nutrition and Hydration

`;

  if (data.artificialNutrition === "yes") {
    document += `I **DO** want artificial nutrition and hydration (tube feeding) to be provided even if other life-sustaining treatments are withheld or withdrawn.

`;
  } else if (data.artificialNutrition === "no") {
    document += `I **DO NOT** want artificial nutrition and hydration (tube feeding) if I am in a terminal condition or persistent vegetative state.

`;
  } else {
    document += `I authorize my Healthcare Agent to decide whether to provide, withhold, or withdraw artificial nutrition and hydration.

`;
  }

  document += `---

## PART 5: SPECIFIC TREATMENT PREFERENCES

`;

  if (data.painManagement === "comfort_priority") {
    document += `### Pain Management
I want my comfort to be the **highest priority**. I want to receive adequate pain relief even if it may hasten my death.

`;
  } else if (data.painManagement === "consciousness_priority") {
    document += `### Pain Management
I prefer to remain as **conscious and alert as possible**, even if this means less pain medication.

`;
  } else {
    document += `### Pain Management
I want a **balanced approach** to pain management that keeps me comfortable while maintaining as much alertness as possible.

`;
  }

  if (data.hospiceCare) {
    document += `### Hospice Care
If I am terminally ill, I **DO** want to receive hospice care focused on comfort rather than curative treatment.

`;
  }

  if (data.dieAtHome) {
    document += `### Place of Death
If possible, I prefer to **die at home** rather than in a hospital or other facility.

`;
  }

  if (data.religiousPreferences) {
    document += `### Religious/Spiritual Preferences
${data.religiousPreferences}

`;
  }

  if (data.specificTreatmentPreferences) {
    document += `### Additional Treatment Preferences
${data.specificTreatmentPreferences}

`;
  }

  document += `---

## PART 6: ORGAN AND TISSUE DONATION

`;

  if (data.organDonationPreference === "yes") {
    document += `Upon my death, I **AUTHORIZE** the donation of my organs and tissues for transplant, therapy, research, or education.

`;
  } else if (data.organDonationPreference === "no") {
    document += `Upon my death, I **DO NOT** authorize the donation of my organs or tissues.

`;
  } else {
    document += `I authorize my Healthcare Agent to make decisions about organ and tissue donation.

`;
  }

  document += `---

## PART 7: AGENT'S DUTIES

My Healthcare Agent shall:

1. Make healthcare decisions for me **in accordance with my wishes** as expressed in this document
2. If my wishes are not known, make decisions **in my best interest**, considering my values and beliefs
3. **Consult with my physicians** and other healthcare providers
4. Keep other family members informed of my condition (unless I have indicated otherwise)

My Healthcare Agent is **NOT** authorized to:
- Admit me to a mental health facility for more than 10 days without court approval
- Authorize psychosurgery, electroconvulsive therapy, or sterilization
- Override my decisions while I am competent to make them

---

## PART 8: CONFLICTING DOCUMENTS

This Healthcare Power of Attorney supersedes any prior healthcare directives I have made. However, if I have also executed a Living Will or Advance Healthcare Directive, my Healthcare Agent should follow the instructions in that document to the extent they are consistent with this Power of Attorney.

---

## PART 9: REVOCATION

I may revoke this Healthcare Power of Attorney at any time by:
1. Destroying all copies of this document
2. Executing a written revocation
3. Verbally revoking it in the presence of witnesses
4. Executing a new Healthcare Power of Attorney

---

## SIGNATURE OF PRINCIPAL

I sign this Healthcare Power of Attorney voluntarily and with full understanding of its contents. I am emotionally and mentally competent to make this document.

Date: ______________________


_____________________________________________
**${data.principalFullName}**, Principal


---

## WITNESS ATTESTATION

We, the undersigned witnesses, declare under penalty of perjury that:

1. The person who signed this document is personally known to us (or proved their identity to us)
2. The Principal signed this document in our presence
3. The Principal appears to be of sound mind and under no duress, fraud, or undue influence
4. We are each 18 years of age or older
5. Neither of us is the designated Healthcare Agent or alternate
6. Neither of us is the Principal's healthcare provider or an employee of the Principal's healthcare provider


**Witness 1:**

_____________________________________________
Signature

_____________________________________________
Printed Name

_____________________________________________
Address


**Witness 2:**

_____________________________________________
Signature

_____________________________________________
Printed Name

_____________________________________________
Address


---

## NOTARY ACKNOWLEDGMENT (RECOMMENDED)

STATE OF ${data.principalState.toUpperCase()}
COUNTY OF ${data.principalCounty.toUpperCase()}

On this ______ day of ______________, 20____, before me personally appeared **${data.principalFullName}**, known to me (or proved to me on the basis of satisfactory evidence) to be the person whose name is subscribed to the within instrument and acknowledged to me that they executed the same in their authorized capacity.

WITNESS my hand and official seal.


_____________________________________________
Notary Public

My Commission Expires: ____________________

[NOTARY SEAL]

---

## ACCEPTANCE BY HEALTHCARE AGENT

I, **${data.agentName}**, accept the appointment as Healthcare Agent for **${data.principalFullName}**. I have read this document and understand my duties and the Principal's wishes.

Date: ______________________


_____________________________________________
**${data.agentName}**, Healthcare Agent


---

**DISCLAIMER:** This document was generated for informational purposes and is a DRAFT. It does not constitute legal advice. Before signing, consult with a licensed attorney in ${data.principalState} to ensure this document meets all applicable legal requirements.

**IMPORTANT:**
- Give a copy of this document to your Healthcare Agent and your physicians
- Keep a copy in an accessible location
- Consider carrying a wallet card indicating you have this document
- Review and update this document periodically
`;

  return document;
}

export default {
  generateFinancialPOA,
  generateHealthcarePOA,
};
