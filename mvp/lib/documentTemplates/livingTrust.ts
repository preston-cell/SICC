/**
 * Revocable Living Trust Template
 * Based on Nolo's proven legal structure with 14 parts
 *
 * This template generates a comprehensive living trust that:
 * - Avoids probate for trust assets
 * - Provides for incapacity management
 * - Allows seamless transfer of assets upon death
 * - Supports both individual and shared (married couples) trusts
 */

export interface TrustData {
  // Trust Identification
  trustName: string;
  trustType: "individual" | "shared";

  // Part 1: Grantor Information
  grantorFullName: string;
  grantorAddress: string;
  grantorCity: string;
  grantorState: string;
  grantorCounty: string;

  // For shared trusts
  coGrantorFullName?: string;
  coGrantorAddress?: string;

  // Part 2: Initial Trustee
  initialTrusteeName: string; // Usually the grantor(s)
  initialTrusteeIsSameAsGrantor?: boolean;

  // Part 3: Successor Trustee
  successorTrusteeName: string;
  successorTrusteeAddress?: string;
  successorTrusteeRelationship?: string;
  alternateSuccessorTrusteeName?: string;
  alternateSuccessorTrusteeRelationship?: string;

  // Part 4: Incapacity Determination
  incapacityDeterminer: "physician" | "two_physicians" | "named_person";
  incapacityDeterminerName?: string;
  incapacityDeterminerRelationship?: string;

  // Part 5: Trust Property (Schedule A)
  trustProperty: Array<{
    description: string;
    type: "real_estate" | "bank_account" | "investment" | "vehicle" | "business" | "personal_property" | "other";
    estimatedValue?: number;
    accountNumber?: string; // Last 4 digits for reference
  }>;

  // Part 6: Beneficiaries
  beneficiaries: Array<{
    name: string;
    relationship?: string;
    propertyDescription: string; // What they receive
    sharePercentage?: number; // For residuary
    alternateBeneficiary?: string;
    alternateBeneficiaryRelationship?: string;
  }>;

  // Part 7: Residuary Beneficiary
  residuaryBeneficiary: string;
  residuaryBeneficiaryRelationship?: string;
  alternateResiduaryBeneficiary?: string;
  alternateResiduaryBeneficiaryRelationship?: string;

  // Part 8: Survivorship
  survivorshipDays?: number; // Default 120 hours (5 days)

  // Part 9: Property Management for Young Beneficiaries
  youngBeneficiaries?: Array<{
    name: string;
    distributionAge: number; // Age at which they receive property outright
    custodianName?: string;
    useUTMA?: boolean; // Use Uniform Transfers to Minors Act
  }>;

  // Part 10: Children's Subtrusts
  createChildrensSubtrusts?: boolean;
  subtrustDistributionAge?: number;
  subtrustTrusteeName?: string;

  // Part 11: Spendthrift Provision
  includeSpendthriftProvision?: boolean;

  // Part 12: Homestead Exemption
  preserveHomesteadExemption?: boolean;
  homesteadPropertyDescription?: string;

  // Part 13: Powers of Trustee
  grantBroadTrusteePowers?: boolean;

  // Part 14: Miscellaneous
  governingLaw: string; // State
  allowAmendment?: boolean;
  allowRevocation?: boolean;

  // Execution
  executionDate?: string;
}

export function generateLivingTrust(data: TrustData): string {
  const survivorshipHours = (data.survivorshipDays || 5) * 24;
  const isShared = data.trustType === "shared" && data.coGrantorFullName;

  let document = `
# REVOCABLE LIVING TRUST

## ${data.trustName.toUpperCase()}

---

**IMPORTANT NOTICE:** This document is a DRAFT for review purposes only. It does not constitute legal advice. Before signing, you should have this document reviewed by a licensed attorney in your state. Additionally, you must properly transfer assets into the trust for it to be effective.

---

## PART 1: TRUST NAME AND DECLARATION

This Revocable Living Trust shall be known as the **"${data.trustName}"**.

`;

  if (isShared) {
    document += `We, **${data.grantorFullName}** and **${data.coGrantorFullName}**, residents of ${data.grantorCity}, ${data.grantorCounty} County, ${data.grantorState}, referred to as "Grantors" or "Trustees," declare that we have transferred and delivered to the Trustees all of our interest in the property described in Schedule A attached hereto.

The Trustees acknowledge receipt of this property and agree to hold, manage, and distribute the trust property according to this trust document.

`;
  } else {
    document += `I, **${data.grantorFullName}**, a resident of ${data.grantorCity}, ${data.grantorCounty} County, ${data.grantorState}, referred to as "Grantor" or "Trustee," declare that I have transferred and delivered to the Trustee all of my interest in the property described in Schedule A attached hereto.

The Trustee acknowledges receipt of this property and agrees to hold, manage, and distribute the trust property according to this trust document.

`;
  }

  document += `The Grantor${isShared ? "s" : ""} may add property to this trust at any time.

---

## PART 2: TERMINOLOGY

In this trust document:

- **"Grantor"** refers to ${isShared ? `${data.grantorFullName} and ${data.coGrantorFullName}` : data.grantorFullName}.
- **"Trustee"** refers to the person or institution managing the trust property.
- **"Beneficiary"** refers to any person or entity entitled to receive trust property.
- **"Trust property"** refers to all property transferred to and held in this trust.
- **"Incapacitated"** means unable to manage one's own financial affairs.

Any reference to this trust document includes any amendments made to it.

---

## PART 3: AMENDMENT AND REVOCATION

`;

  if (isShared) {
    document += `### A. During Both Grantors' Lifetimes

Either Grantor may amend or revoke this trust at any time, without the consent of any beneficiary. Amendments must be in writing and signed by the amending Grantor.

### B. After One Grantor's Death

After the death of one Grantor, the surviving Grantor may amend or revoke only the surviving Grantor's share of the trust property. The deceased Grantor's share becomes irrevocable.

### C. Method of Revocation

To revoke this trust, the Grantor must:
1. Execute a written document clearly expressing the intent to revoke, and
2. Deliver the revocation document to the Trustee.

`;
  } else {
    document += `The Grantor may amend or revoke this trust at any time, without notifying any beneficiary. Only the Grantor has this power; no conservator, guardian, or agent may exercise this power unless specifically authorized in a durable power of attorney.

Amendments must be in writing and signed by the Grantor.

To revoke this trust, the Grantor must:
1. Execute a written document clearly expressing the intent to revoke, and
2. Deliver the revocation document to the Trustee.

`;
  }

  document += `---

## PART 4: TRUSTEES

### A. Initial Trustee

`;

  if (data.initialTrusteeIsSameAsGrantor) {
    if (isShared) {
      document += `**${data.grantorFullName}** and **${data.coGrantorFullName}** shall serve as the initial Co-Trustees of this trust.

`;
    } else {
      document += `**${data.grantorFullName}** shall serve as the initial Trustee of this trust.

`;
    }
  } else {
    document += `**${data.initialTrusteeName}** shall serve as the initial Trustee of this trust.

`;
  }

  document += `### B. Successor Trustee

`;

  if (isShared) {
    document += `Upon the death or incapacity of both Grantors, or upon the death or incapacity of the surviving Grantor, **${data.successorTrusteeName}**${data.successorTrusteeRelationship ? ` (${data.successorTrusteeRelationship})` : ""} shall serve as Successor Trustee.

`;
  } else {
    document += `Upon the death or incapacity of the Grantor, **${data.successorTrusteeName}**${data.successorTrusteeRelationship ? ` (${data.successorTrusteeRelationship})` : ""} shall serve as Successor Trustee.

`;
  }

  if (data.alternateSuccessorTrusteeName) {
    document += `If **${data.successorTrusteeName}** is unable or unwilling to serve as Successor Trustee, **${data.alternateSuccessorTrusteeName}**${data.alternateSuccessorTrusteeRelationship ? ` (${data.alternateSuccessorTrusteeRelationship})` : ""} shall serve as Alternate Successor Trustee.

`;
  }

  document += `### C. Trustee Resignation

Any Trustee may resign by giving 30 days' written notice to the Grantor (if living and not incapacitated) or to the adult beneficiaries.

### D. Appointment of Successor

If no successor trustee named in this document is able and willing to serve, the last acting Trustee may appoint a successor trustee. The appointment must be in writing and may require the posting of a reasonable bond.

### E. Compensation

The Trustee shall be entitled to reasonable compensation for services rendered in administering this trust.

### F. Bond

No bond shall be required of any Trustee serving under this trust document.

---

## PART 5: PAYMENTS DURING GRANTOR'S LIFETIME

`;

  if (isShared) {
    document += `During the lifetime of both Grantors, the Trustees shall pay to or apply for the benefit of the Grantors as much of the net income and principal of the trust as the Grantors request.

The Trustees shall pay the Grantors all of the net income of the trust at least annually.

`;
  } else {
    document += `During the Grantor's lifetime, the Trustee shall pay to or apply for the benefit of the Grantor as much of the net income and principal of the trust as the Grantor requests.

The Trustee shall pay the Grantor all of the net income of the trust at least annually.

`;
  }

  document += `---

## PART 6: INCAPACITY OF GRANTOR

### A. Determination of Incapacity

`;

  if (data.incapacityDeterminer === "physician") {
    document += `The Grantor shall be considered incapacitated when a licensed physician signs a document stating that the Grantor is unable to manage their financial affairs.

`;
  } else if (data.incapacityDeterminer === "two_physicians") {
    document += `The Grantor shall be considered incapacitated when two licensed physicians sign documents stating that the Grantor is unable to manage their financial affairs.

`;
  } else if (data.incapacityDeterminer === "named_person" && data.incapacityDeterminerName) {
    document += `The Grantor shall be considered incapacitated when **${data.incapacityDeterminerName}**${data.incapacityDeterminerRelationship ? ` (${data.incapacityDeterminerRelationship})` : ""} determines, based on consultation with the Grantor's physician, that the Grantor is unable to manage their financial affairs.

`;
  }

  document += `### B. Management During Incapacity

If the Grantor becomes incapacitated:

1. The Successor Trustee shall manage the trust property for the Grantor's benefit.
2. The Successor Trustee shall use trust income and principal as necessary for the Grantor's health, support, maintenance, and welfare.
3. The Successor Trustee may make gifts on the Grantor's behalf consistent with the Grantor's prior gifting patterns.

### C. Termination of Incapacity

If the Grantor regains capacity (as determined by a licensed physician), the Grantor shall resume serving as Trustee.

---

## PART 7: DEATH OF GRANTOR

`;

  if (isShared) {
    document += `### A. Death of First Grantor

Upon the death of the first Grantor, this trust shall be divided into two separate trusts:

1. **Deceased Grantor's Trust:** This trust shall become irrevocable and shall hold the deceased Grantor's share of the trust property.
2. **Surviving Grantor's Trust:** This trust shall remain revocable and shall hold the surviving Grantor's share of the trust property.

### B. Death of Surviving Grantor

Upon the death of the surviving Grantor (or upon the death of both Grantors simultaneously):

`;
  } else {
    document += `Upon the death of the Grantor:

`;
  }

  document += `1. This trust shall become irrevocable.
2. The Trustee may pay from trust property the deceased Grantor's debts, estate taxes, and funeral expenses.
3. The Trustee shall distribute the trust property to the beneficiaries as specified in this trust document.

---

## PART 8: BENEFICIARIES

Upon the death of the Grantor${isShared ? "s" : ""}, the Trustee shall distribute the trust property as follows:

### A. Specific Distributions

`;

  if (data.beneficiaries && data.beneficiaries.length > 0) {
    data.beneficiaries.forEach((beneficiary, index) => {
      document += `**${index + 1}.** ${beneficiary.propertyDescription} shall be distributed to **${beneficiary.name}**${beneficiary.relationship ? ` (${beneficiary.relationship})` : ""}`;
      if (beneficiary.alternateBeneficiary) {
        document += `, or if ${beneficiary.name} does not survive the Grantor by ${survivorshipHours} hours, to **${beneficiary.alternateBeneficiary}**${beneficiary.alternateBeneficiaryRelationship ? ` (${beneficiary.alternateBeneficiaryRelationship})` : ""}`;
      }
      document += `.\n\n`;
    });
  }

  document += `### B. Residuary Distribution

All remaining trust property not distributed above shall be distributed to **${data.residuaryBeneficiary}**${data.residuaryBeneficiaryRelationship ? ` (${data.residuaryBeneficiaryRelationship})` : ""}.

`;

  if (data.alternateResiduaryBeneficiary) {
    document += `If **${data.residuaryBeneficiary}** does not survive the Grantor by ${survivorshipHours} hours, the remaining trust property shall be distributed to **${data.alternateResiduaryBeneficiary}**${data.alternateResiduaryBeneficiaryRelationship ? ` (${data.alternateResiduaryBeneficiaryRelationship})` : ""}.

`;
  }

  document += `---

## PART 9: TERMS OF PROPERTY DISTRIBUTION

### A. Survivorship Requirement

Any beneficiary must survive the Grantor by at least **${survivorshipHours} hours** (${data.survivorshipDays || 5} days) to receive any property under this trust.

### B. Shared Gifts

If property is to be distributed to two or more beneficiaries without specifying percentages, the property shall be distributed in equal shares.

### C. Death of Beneficiary

If a beneficiary dies before the Grantor and no alternate beneficiary is named, that beneficiary's share shall be distributed to the residuary beneficiary.

---

`;

  // Part 10: Property Management for Young Beneficiaries
  if (data.youngBeneficiaries && data.youngBeneficiaries.length > 0) {
    document += `## PART 10: CUSTODIANSHIPS UNDER THE UNIFORM TRANSFERS TO MINORS ACT

`;

    data.youngBeneficiaries.forEach((yb, index) => {
      if (yb.useUTMA) {
        document += `**${index + 1}.** Property distributed to **${yb.name}** shall be held by **${yb.custodianName || data.successorTrusteeName}** as custodian under the ${data.grantorState} Uniform Transfers to Minors Act until ${yb.name} reaches the age of **${yb.distributionAge}**.

`;
      }
    });

    document += `---

`;
  }

  // Part 11: Children's Subtrusts
  if (data.createChildrensSubtrusts) {
    document += `## PART 11: CHILDREN'S SUBTRUSTS

### A. Creation of Subtrust

If any beneficiary is under the age of **${data.subtrustDistributionAge || 25}** at the time of distribution, that beneficiary's share shall be held in a separate subtrust for their benefit.

### B. Subtrust Trustee

**${data.subtrustTrusteeName || data.successorTrusteeName}** shall serve as Trustee of any subtrust created under this provision.

### C. Subtrust Distributions

The Subtrust Trustee may distribute as much of the subtrust income and principal as the Trustee deems necessary for the beneficiary's:
- Health
- Education (including college and graduate school)
- Support and maintenance

### D. Termination of Subtrust

When the beneficiary reaches the age of **${data.subtrustDistributionAge || 25}**, the Subtrust Trustee shall distribute the remaining subtrust property to the beneficiary outright.

### E. Death of Beneficiary Before Termination

If the beneficiary dies before the subtrust terminates, the remaining subtrust property shall be distributed to the beneficiary's surviving children, or if none, to the residuary beneficiaries of this trust.

---

`;
  }

  // Part 12: Spendthrift Provision
  if (data.includeSpendthriftProvision) {
    document += `## PART 12: SPENDTHRIFT PROVISION

No beneficiary may assign, anticipate, encumber, alienate, or otherwise voluntarily transfer their interest in the trust or the income from it. The interest of any beneficiary shall not be subject to the claims of the beneficiary's creditors or liable to attachment, execution, or other legal process.

---

`;
  }

  // Part 13: Homestead Exemption
  if (data.preserveHomesteadExemption && data.homesteadPropertyDescription) {
    document += `## PART 13: GRANTOR'S RIGHT TO HOMESTEAD TAX EXEMPTION

The Grantor retains a beneficial interest in the principal residence held in this trust (${data.homesteadPropertyDescription}). This beneficial interest qualifies the Grantor for any homestead tax exemption to which the Grantor would otherwise be entitled.

---

`;
  }

  // Part 14: Trustee's Powers
  document += `## PART 14: TRUSTEE'S MANAGEMENT POWERS AND DUTIES

The Trustee shall have all powers necessary or appropriate for the proper management and distribution of the trust property, including but not limited to:

### A. Property Transactions

1. **Retain Property:** To retain any property transferred to the trust.
2. **Sell Property:** To sell, exchange, or dispose of trust property at public or private sale.
3. **Acquire Property:** To acquire real or personal property.
4. **Lease Property:** To lease trust property for any term.
5. **Partition Property:** To partition or divide trust property.

### B. Financial Management

1. **Invest:** To invest in stocks, bonds, mutual funds, real estate, and other investments.
2. **Bank Accounts:** To open and maintain bank accounts.
3. **Borrow:** To borrow money for trust purposes and to encumber trust property as security.
4. **Lend:** To make loans, including loans to beneficiaries.

### C. Real Estate

1. **Manage:** To manage, improve, and maintain real property.
2. **Insure:** To insure trust property.
3. **Subdivide:** To subdivide, develop, or dedicate real property.
4. **Grant Easements:** To grant easements and rights-of-way.

### D. Business Interests

1. **Continue Business:** To continue any business interest transferred to the trust.
2. **Form Entities:** To form or participate in corporations, partnerships, or LLCs.

### E. Legal and Tax Matters

1. **Settle Claims:** To compromise, contest, or settle claims.
2. **Employ Professionals:** To employ attorneys, accountants, and other professionals.
3. **Tax Elections:** To make any tax elections permitted by law.

### F. Distributions

1. **Distribute in Kind:** To distribute property in kind or in cash.
2. **Make Advances:** To make advances to beneficiaries.
3. **Accumulate Income:** To accumulate or distribute income.

---

## PART 15: SEVERABILITY

If any provision of this trust is held to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.

---

## PART 16: GOVERNING LAW

This trust shall be governed by and interpreted according to the laws of the State of **${data.governingLaw || data.grantorState}**.

---

## CERTIFICATION OF GRANTOR

`;

  if (isShared) {
    document += `We, **${data.grantorFullName}** and **${data.coGrantorFullName}**, the Grantors, hereby certify that we have read this trust document and that it correctly states the terms and conditions under which the trust property is to be held, managed, and distributed.

Executed on this ______ day of ______________, 20____, at ${data.grantorCity}, ${data.grantorState}.


_____________________________________________
**${data.grantorFullName}**, Grantor and Trustee


_____________________________________________
**${data.coGrantorFullName}**, Grantor and Trustee

`;
  } else {
    document += `I, **${data.grantorFullName}**, the Grantor, hereby certify that I have read this trust document and that it correctly states the terms and conditions under which the trust property is to be held, managed, and distributed.

Executed on this ______ day of ______________, 20____, at ${data.grantorCity}, ${data.grantorState}.


_____________________________________________
**${data.grantorFullName}**, Grantor and Trustee

`;
  }

  document += `
---

## CERTIFICATE OF ACKNOWLEDGMENT OF NOTARY PUBLIC

STATE OF ${data.grantorState.toUpperCase()}
COUNTY OF ${data.grantorCounty.toUpperCase()}

On this ______ day of ______________, 20____, before me personally appeared:

`;

  if (isShared) {
    document += `**${data.grantorFullName}** and **${data.coGrantorFullName}**

`;
  } else {
    document += `**${data.grantorFullName}**

`;
  }

  document += `known to me (or proved to me on the basis of satisfactory evidence) to be the person(s) whose name(s) is/are subscribed to the within instrument and acknowledged to me that they executed the same in their authorized capacity(ies), and that by their signature(s) on the instrument, the person(s), or the entity upon behalf of which the person(s) acted, executed the instrument.

WITNESS my hand and official seal.


_____________________________________________
Notary Public

My Commission Expires: ____________________

[NOTARY SEAL]

---

## SCHEDULE A: PROPERTY PLACED IN TRUST

The following property is transferred to and held in the ${data.trustName}:

| # | Description | Type | Est. Value |
|---|-------------|------|------------|
`;

  if (data.trustProperty && data.trustProperty.length > 0) {
    data.trustProperty.forEach((prop, index) => {
      document += `| ${index + 1} | ${prop.description} | ${prop.type.replace(/_/g, " ")} | ${prop.estimatedValue ? `$${prop.estimatedValue.toLocaleString()}` : "N/A"} |\n`;
    });
  } else {
    document += `| 1 | [Property to be listed] | [Type] | [Value] |\n`;
  }

  document += `

**Note:** Additional property may be added to this trust by:
1. Adding items to this Schedule A
2. Executing a separate assignment document
3. Changing title/ownership documents to the name of the trust

---

## IMPORTANT NEXT STEPS

To make this trust effective, you must **fund the trust** by transferring property into it:

### Real Estate
- Record a new deed transferring property to "${data.trustName}" or "Trustee of the ${data.trustName}"
- Contact your county recorder's office

### Bank & Investment Accounts
- Contact each institution to retitle accounts in the name of the trust
- Provide them with a copy of the trust (or Certificate of Trust)

### Vehicles
- Check your state's requirements for transferring vehicle titles to trusts

### Personal Property
- Execute an assignment document transferring personal property to the trust

---

**DISCLAIMER:** This document was generated for informational purposes and is a DRAFT. It does not constitute legal advice. Before signing:

1. Have this document reviewed by a licensed attorney in ${data.grantorState}
2. Properly transfer assets into the trust
3. Consider whether you need a "pour-over" will to catch assets not transferred to the trust
4. Review and update this trust whenever you experience major life changes
`;

  return document;
}

export default generateLivingTrust;
