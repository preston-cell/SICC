/**
 * Last Will and Testament Template
 * Based on Nolo's proven legal structure with 13 parts
 *
 * This template generates a comprehensive will document that:
 * - Follows standard legal formatting
 * - Includes all necessary clauses for validity
 * - Supports state-specific requirements
 * - Provides clear instructions for execution
 */

export interface WillData {
  // Part 1: Personal Information
  testatorFullName: string;
  testatorAddress: string;
  testatorCity: string;
  testatorState: string;
  testatorCounty: string;
  testatorAge?: number;

  // Part 3: Marital Status
  maritalStatus: "single" | "married" | "divorced" | "widowed" | "domestic_partnership";
  spouseName?: string;
  spouseExcluded?: boolean;
  spouseExclusionReason?: string;

  // Part 4: Children
  children: Array<{
    name: string;
    birthDate?: string;
    isMinor: boolean;
    isAdopted?: boolean;
    isDeceased?: boolean;
  }>;
  disinheritedChildren?: Array<{
    name: string;
    reason?: string;
  }>;

  // Part 5: Pets
  pets?: Array<{
    name: string;
    type: string;
    caretaker: string;
    alternateCaretaker?: string;
    careAmount?: number;
  }>;

  // Part 6: Property Distribution
  specificBequests: Array<{
    property: string;
    beneficiary: string;
    beneficiaryRelationship?: string;
    alternateBeneficiary?: string;
    alternateBeneficiaryRelationship?: string;
  }>;
  residuaryBeneficiary: string;
  residuaryBeneficiaryRelationship?: string;
  alternateResiduaryBeneficiary?: string;
  alternateResiduaryBeneficiaryRelationship?: string;
  survivorshipDays?: number; // Default 45 days

  // Part 7: Forgiveness of Debts
  forgivenDebts?: Array<{
    debtorName: string;
    originalAmount: number;
    dateOfLoan?: string;
    amountForgiven: number;
  }>;

  // Part 8: Executor
  executorName: string;
  executorAddress?: string;
  executorRelationship?: string;
  alternateExecutorName?: string;
  alternateExecutorAddress?: string;
  alternateExecutorRelationship?: string;
  executorCompensation?: "reasonable" | "none" | "specific";
  executorCompensationAmount?: string;

  // Part 9: Guardian for Minor Children
  guardianName?: string;
  guardianAddress?: string;
  guardianRelationship?: string;
  alternateGuardianName?: string;
  alternateGuardianAddress?: string;
  alternateGuardianRelationship?: string;
  propertyGuardianName?: string;
  propertyGuardianSameAsPersonal?: boolean;

  // Part 10: Trusts for Minors
  minorBeneficiaryAge?: number; // Age at which they receive property outright
  trusteeForMinors?: string;

  // Part 11: Payment of Debts
  debtPaymentSource?: string;
  specificDebtsToPayFirst?: string[];

  // Part 12: Payment of Taxes
  taxPaymentSource?: string;
  apportionTaxes?: boolean;

  // Part 13: Additional Provisions
  includeNoContestClause?: boolean;
  noContestPenalty?: string;
  additionalProvisions?: string[];

  // Execution details
  executionDate?: string;
  witnessState?: string;
}

export interface StateRequirements {
  witnessCount: number;
  notaryRequired: boolean;
  selfProvingAffidavitAvailable: boolean;
  holographicWillsValid: boolean;
  specialRequirements?: string[];
  ageOfMajority: number;
  communityPropertyState: boolean;
}

// State-specific requirements
export const STATE_REQUIREMENTS: Record<string, StateRequirements> = {
  "Alabama": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: false, ageOfMajority: 19, communityPropertyState: false },
  "Alaska": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: false },
  "Arizona": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: true },
  "Arkansas": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: false },
  "California": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: true },
  "Colorado": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: false },
  "Connecticut": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: false, ageOfMajority: 18, communityPropertyState: false },
  "Delaware": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: false, ageOfMajority: 18, communityPropertyState: false },
  "Florida": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: false, ageOfMajority: 18, communityPropertyState: false },
  "Georgia": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: false, ageOfMajority: 18, communityPropertyState: false },
  "Hawaii": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: false },
  "Idaho": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: true },
  "Illinois": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: false, ageOfMajority: 18, communityPropertyState: false },
  "Indiana": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: false, ageOfMajority: 18, communityPropertyState: false },
  "Iowa": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: false, ageOfMajority: 18, communityPropertyState: false },
  "Kansas": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: false, ageOfMajority: 18, communityPropertyState: false },
  "Kentucky": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: false },
  "Louisiana": { witnessCount: 2, notaryRequired: true, selfProvingAffidavitAvailable: false, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: true, specialRequirements: ["Must be in notarial form or olographic form", "Notarial will requires notary and 2 witnesses present simultaneously"] },
  "Maine": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: false },
  "Maryland": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: false, ageOfMajority: 18, communityPropertyState: false },
  "Massachusetts": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: false, ageOfMajority: 18, communityPropertyState: false },
  "Michigan": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: false },
  "Minnesota": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: false, ageOfMajority: 18, communityPropertyState: false },
  "Mississippi": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 21, communityPropertyState: false },
  "Missouri": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: false, ageOfMajority: 18, communityPropertyState: false },
  "Montana": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: false },
  "Nebraska": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 19, communityPropertyState: false },
  "Nevada": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: true },
  "New Hampshire": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: false, ageOfMajority: 18, communityPropertyState: false },
  "New Jersey": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: false },
  "New Mexico": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: true },
  "New York": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: false, ageOfMajority: 18, communityPropertyState: false },
  "North Carolina": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: false },
  "North Dakota": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: false },
  "Ohio": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: false, ageOfMajority: 18, communityPropertyState: false },
  "Oklahoma": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: false },
  "Oregon": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: false, ageOfMajority: 18, communityPropertyState: false },
  "Pennsylvania": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: false },
  "Rhode Island": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: false, ageOfMajority: 18, communityPropertyState: false },
  "South Carolina": { witnessCount: 3, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: false, ageOfMajority: 18, communityPropertyState: false, specialRequirements: ["Requires 3 witnesses instead of 2"] },
  "South Dakota": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: false },
  "Tennessee": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: false },
  "Texas": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: true },
  "Utah": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: false },
  "Vermont": { witnessCount: 3, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: false, ageOfMajority: 18, communityPropertyState: false, specialRequirements: ["Requires 3 witnesses instead of 2"] },
  "Virginia": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: false },
  "Washington": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: false, ageOfMajority: 18, communityPropertyState: true },
  "West Virginia": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: false },
  "Wisconsin": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: false, ageOfMajority: 18, communityPropertyState: true },
  "Wyoming": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: true, ageOfMajority: 18, communityPropertyState: false },
  "District of Columbia": { witnessCount: 2, notaryRequired: false, selfProvingAffidavitAvailable: true, holographicWillsValid: false, ageOfMajority: 18, communityPropertyState: false },
};

export function generateWill(data: WillData): string {
  const state = data.testatorState;
  const stateReqs = STATE_REQUIREMENTS[state] || STATE_REQUIREMENTS["California"];
  const survivorshipDays = data.survivorshipDays || 45;
  const executionDate = data.executionDate || "[DATE]";

  let document = `
# LAST WILL AND TESTAMENT

## OF ${data.testatorFullName.toUpperCase()}

---

**IMPORTANT NOTICE:** This document is a DRAFT for review purposes only. It does not constitute legal advice. Before signing, you should have this document reviewed by a licensed attorney in your state to ensure it meets all legal requirements and properly reflects your wishes.

---

## PART 1: DECLARATION

I, **${data.testatorFullName}**, a resident of ${data.testatorCity}, ${data.testatorCounty} County, ${state}, being of sound mind and memory, and not acting under duress, menace, fraud, or undue influence of any person, do hereby declare this to be my Last Will and Testament, hereby revoking all previous wills and codicils made by me.

---

## PART 2: REVOCATION OF PRIOR WILLS

I hereby revoke all wills and codicils that I have previously made.

---

## PART 3: MARITAL STATUS AND FAMILY

`;

  // Marital Status Section
  if (data.maritalStatus === "married" && data.spouseName) {
    document += `I am married to **${data.spouseName}**, who is referred to in this Will as "my spouse."\n\n`;
    if (data.spouseExcluded) {
      document += `I have intentionally made no provision for my spouse in this Will${data.spouseExclusionReason ? ` for the following reason: ${data.spouseExclusionReason}` : ""}.\n\n`;
    }
  } else if (data.maritalStatus === "domestic_partnership" && data.spouseName) {
    document += `I am in a registered domestic partnership with **${data.spouseName}**, who is referred to in this Will as "my partner."\n\n`;
  } else if (data.maritalStatus === "single") {
    document += `I am not married.\n\n`;
  } else if (data.maritalStatus === "divorced") {
    document += `I am divorced. Any former spouse is intentionally excluded from this Will.\n\n`;
  } else if (data.maritalStatus === "widowed") {
    document += `I am widowed.\n\n`;
  }

  // Children Section
  if (data.children && data.children.length > 0) {
    document += `### Children\n\n`;
    document += `I have the following children:\n\n`;
    data.children.forEach((child, index) => {
      if (!child.isDeceased) {
        document += `${index + 1}. **${child.name}**${child.birthDate ? `, born ${child.birthDate}` : ""}${child.isAdopted ? " (adopted)" : ""}\n`;
      }
    });
    document += `\n`;

    const deceasedChildren = data.children.filter(c => c.isDeceased);
    if (deceasedChildren.length > 0) {
      document += `The following children of mine are deceased: ${deceasedChildren.map(c => c.name).join(", ")}.\n\n`;
    }
  } else {
    document += `I have no children.\n\n`;
  }

  // Disinherited Children
  if (data.disinheritedChildren && data.disinheritedChildren.length > 0) {
    document += `### Intentional Omissions\n\n`;
    data.disinheritedChildren.forEach(child => {
      document += `I have intentionally made no provision for **${child.name}** in this Will${child.reason ? `. Reason: ${child.reason}` : ""}.\n`;
    });
    document += `\n`;
  }

  document += `---\n\n`;

  // Part 4: Guardianship (if there are minor children)
  const minorChildren = data.children?.filter(c => c.isMinor && !c.isDeceased) || [];
  if (minorChildren.length > 0 && data.guardianName) {
    document += `## PART 4: GUARDIAN FOR MINOR CHILDREN

If at my death any of my children are minors, I nominate **${data.guardianName}**${data.guardianRelationship ? ` (${data.guardianRelationship})` : ""} to serve as guardian of the person of my minor children.

`;
    if (data.alternateGuardianName) {
      document += `If **${data.guardianName}** is unable or unwilling to serve as guardian, I nominate **${data.alternateGuardianName}**${data.alternateGuardianRelationship ? ` (${data.alternateGuardianRelationship})` : ""} to serve as alternate guardian.\n\n`;
    }

    if (data.propertyGuardianName && !data.propertyGuardianSameAsPersonal) {
      document += `I nominate **${data.propertyGuardianName}** to serve as guardian of the property of my minor children.\n\n`;
    } else if (data.propertyGuardianSameAsPersonal) {
      document += `The guardian of the person shall also serve as guardian of the property of my minor children.\n\n`;
    }

    document += `No bond shall be required of any guardian nominated in this Will.\n\n---\n\n`;
  }

  // Part 5: Pets
  if (data.pets && data.pets.length > 0) {
    document += `## PART 5: CARE OF PETS

`;
    data.pets.forEach(pet => {
      document += `I leave my ${pet.type} named **${pet.name}** to **${pet.caretaker}**`;
      if (pet.careAmount) {
        document += `, together with the sum of **$${pet.careAmount.toLocaleString()}** to be used for ${pet.name}'s care`;
      }
      document += `.\n\n`;
      if (pet.alternateCaretaker) {
        document += `If ${pet.caretaker} is unable or unwilling to care for ${pet.name}, I leave ${pet.name} to **${pet.alternateCaretaker}**.\n\n`;
      }
    });
    document += `---\n\n`;
  }

  // Part 6: Disposition of Property
  document += `## PART 6: DISPOSITION OF PROPERTY

### A. Survivorship Requirement

Any beneficiary must survive me by at least **${survivorshipDays} days** to receive any property under this Will. If a beneficiary does not survive me by ${survivorshipDays} days, the gift to that beneficiary shall lapse and be distributed as if that beneficiary had predeceased me.

### B. Specific Bequests

I make the following specific bequests:

`;

  if (data.specificBequests && data.specificBequests.length > 0) {
    data.specificBequests.forEach((bequest, index) => {
      document += `**${index + 1}.** I give **${bequest.property}** to **${bequest.beneficiary}**${bequest.beneficiaryRelationship ? ` (${bequest.beneficiaryRelationship})` : ""}`;
      if (bequest.alternateBeneficiary) {
        document += `, or if ${bequest.beneficiary} does not survive me by ${survivorshipDays} days, to **${bequest.alternateBeneficiary}**${bequest.alternateBeneficiaryRelationship ? ` (${bequest.alternateBeneficiaryRelationship})` : ""}`;
      }
      document += `.\n\n`;
    });
  } else {
    document += `*No specific bequests.*\n\n`;
  }

  document += `### C. Residuary Estate

I give all the rest, residue, and remainder of my estate, including all property not otherwise disposed of by this Will or by other means (the "Residuary Estate"), to **${data.residuaryBeneficiary}**${data.residuaryBeneficiaryRelationship ? ` (${data.residuaryBeneficiaryRelationship})` : ""}.

`;

  if (data.alternateResiduaryBeneficiary) {
    document += `If **${data.residuaryBeneficiary}** does not survive me by ${survivorshipDays} days, I give my Residuary Estate to **${data.alternateResiduaryBeneficiary}**${data.alternateResiduaryBeneficiaryRelationship ? ` (${data.alternateResiduaryBeneficiaryRelationship})` : ""}.\n\n`;
  }

  document += `### D. Encumbrances

All property shall pass subject to any encumbrances, mortgages, or liens existing at the time of my death.

---

`;

  // Part 7: Forgiveness of Debts
  if (data.forgivenDebts && data.forgivenDebts.length > 0) {
    document += `## PART 7: FORGIVENESS OF DEBTS

I forgive the following debts owed to me:

`;
    data.forgivenDebts.forEach((debt, index) => {
      document += `**${index + 1}.** I forgive the debt of **$${debt.amountForgiven.toLocaleString()}** owed to me by **${debt.debtorName}**`;
      if (debt.dateOfLoan) {
        document += ` arising from a loan made on ${debt.dateOfLoan}`;
      }
      document += `.\n\n`;
    });
    document += `---\n\n`;
  }

  // Part 8: Executor
  document += `## PART 8: EXECUTOR

I nominate **${data.executorName}**${data.executorRelationship ? ` (${data.executorRelationship})` : ""} to serve as Executor of this Will.

`;

  if (data.alternateExecutorName) {
    document += `If **${data.executorName}** is unable or unwilling to serve as Executor, I nominate **${data.alternateExecutorName}**${data.alternateExecutorRelationship ? ` (${data.alternateExecutorRelationship})` : ""} to serve as alternate Executor.\n\n`;
  }

  // Executor compensation
  if (data.executorCompensation === "none") {
    document += `My Executor shall serve without compensation.\n\n`;
  } else if (data.executorCompensation === "specific" && data.executorCompensationAmount) {
    document += `My Executor shall receive compensation of ${data.executorCompensationAmount} for services rendered.\n\n`;
  } else {
    document += `My Executor shall be entitled to reasonable compensation for services rendered.\n\n`;
  }

  document += `No bond shall be required of any Executor nominated in this Will.\n\n---\n\n`;

  // Part 9: Executor's Powers
  document += `## PART 9: EXECUTOR'S POWERS

I grant my Executor the following powers, to be exercised in the Executor's discretion, without court approval:

1. **Retain Property:** To retain any property owned by me at my death for as long as the Executor deems advisable.

2. **Sell Property:** To sell, lease, exchange, or otherwise dispose of any property, real or personal, at public or private sale, with or without notice, and on such terms as the Executor deems advisable.

3. **Invest:** To invest and reinvest in any type of property, including stocks, bonds, mutual funds, and real estate.

4. **Borrow:** To borrow money for any estate purpose and to encumber estate property as security for any loan.

5. **Settle Claims:** To compromise, contest, or otherwise settle any claims for or against my estate.

6. **Distribute in Kind:** To distribute property in kind, in cash, or partly in kind and partly in cash.

7. **Employ Professionals:** To employ attorneys, accountants, investment advisors, and other professionals as needed.

8. **Continue Business:** To continue any business I own at my death for such time as the Executor deems advisable.

9. **Make Tax Elections:** To make any tax elections permitted under law.

10. **General Authority:** To perform any other acts the Executor deems necessary or appropriate for the proper administration of my estate.

---

`;

  // Part 10: Payment of Debts
  document += `## PART 10: PAYMENT OF DEBTS

I direct my Executor to pay all of my legally enforceable debts, including funeral expenses and costs of last illness, from my estate.`;

  if (data.debtPaymentSource) {
    document += ` These debts shall be paid first from ${data.debtPaymentSource}.`;
  }

  document += `\n\n---\n\n`;

  // Part 11: Payment of Taxes
  document += `## PART 11: PAYMENT OF TAXES

I direct my Executor to pay all estate, inheritance, and similar taxes that may be assessed against my estate or any beneficiary`;

  if (data.taxPaymentSource) {
    document += `, using funds from ${data.taxPaymentSource}`;
  }

  if (data.apportionTaxes) {
    document += `. Taxes shall be apportioned among the beneficiaries in proportion to the value of property each receives`;
  } else {
    document += `. These taxes shall be paid from the residuary estate without apportionment`;
  }

  document += `.\n\n---\n\n`;

  // Part 12: No-Contest Clause
  if (data.includeNoContestClause) {
    document += `## PART 12: NO-CONTEST CLAUSE

If any beneficiary under this Will, directly or indirectly, contests or attacks this Will or any of its provisions, or conspires with or voluntarily assists anyone attempting to contest or attack this Will or any of its provisions, then:

${data.noContestPenalty || "That beneficiary shall forfeit any interest given to them under this Will, and their share shall be distributed as if that beneficiary had predeceased me."}

---

`;
  }

  // Part 13: Severability
  document += `## PART 13: SEVERABILITY

If any provision of this Will is held to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.

---

`;

  // Additional Provisions
  if (data.additionalProvisions && data.additionalProvisions.length > 0) {
    document += `## ADDITIONAL PROVISIONS

`;
    data.additionalProvisions.forEach((provision, index) => {
      document += `**${index + 1}.** ${provision}\n\n`;
    });
    document += `---\n\n`;
  }

  // Signature Section
  document += `## SIGNATURE

IN WITNESS WHEREOF, I have signed this Will on this ______ day of ______________, 20____, at ${data.testatorCity}, ${state}.


_____________________________________________
**${data.testatorFullName}**, Testator


---

## ATTESTATION CLAUSE

On the date written above, **${data.testatorFullName}**, known to us to be the Testator, declared to us, the undersigned, that the foregoing instrument was their Last Will and Testament, and requested that we serve as witnesses thereto. The Testator then signed this Will in our presence, and we, at the Testator's request and in the Testator's presence and in the presence of each other, have signed our names as witnesses.

We declare under penalty of perjury that the Testator signed this document willingly, that the Testator appeared to be of sound mind and memory, and that to the best of our knowledge the Testator was not acting under duress, menace, fraud, misrepresentation, or undue influence.

`;

  // Witness signatures based on state requirements
  for (let i = 1; i <= stateReqs.witnessCount; i++) {
    document += `
**Witness ${i}:**

_____________________________________________
Signature

_____________________________________________
Printed Name

_____________________________________________
Address

_____________________________________________
City, State, ZIP

`;
  }

  // Self-Proving Affidavit
  if (stateReqs.selfProvingAffidavitAvailable) {
    document += `
---

## SELF-PROVING AFFIDAVIT

STATE OF ${state.toUpperCase()}
COUNTY OF ____________________

Before me, the undersigned authority, personally appeared **${data.testatorFullName}** (Testator), and the witnesses whose names are signed to the foregoing instrument, and all being duly sworn, the Testator declared to me and to the witnesses that the foregoing instrument is the Testator's Last Will and Testament, and that the Testator had willingly signed and executed it as the Testator's free and voluntary act for the purposes therein expressed.

Each of the witnesses stated that they signed the Will as witness in the presence and at the request of the Testator, and in the presence of each other witness, and that to the best of their knowledge the Testator was at that time eighteen (18) years of age or older, of sound mind, and under no constraint or undue influence.


_____________________________________________
${data.testatorFullName}, Testator


`;

    for (let i = 1; i <= stateReqs.witnessCount; i++) {
      document += `_____________________________________________
Witness ${i}

`;
    }

    document += `
Subscribed and sworn to before me by **${data.testatorFullName}**, the Testator, and by the witnesses, on this ______ day of ______________, 20____.


_____________________________________________
Notary Public

My Commission Expires: ____________________

[NOTARY SEAL]

`;
  }

  // State-Specific Notes
  if (stateReqs.specialRequirements && stateReqs.specialRequirements.length > 0) {
    document += `
---

## STATE-SPECIFIC NOTES FOR ${state.toUpperCase()}

`;
    stateReqs.specialRequirements.forEach(req => {
      document += `- ${req}\n`;
    });
  }

  // Final Disclaimer
  document += `
---

## IMPORTANT REMINDERS

1. **Sign this Will** in front of all witnesses (${stateReqs.witnessCount} witnesses required in ${state}).
2. **Have all witnesses sign** in your presence and in the presence of each other.
${stateReqs.selfProvingAffidavitAvailable ? `3. **Consider completing the self-proving affidavit** before a notary public to simplify the probate process.` : ""}
4. **Store this Will safely** and inform your Executor of its location.
5. **Review and update this Will** whenever you experience a major life change (marriage, divorce, birth of child, significant change in assets, etc.).

**DISCLAIMER:** This document was generated for informational purposes and is a DRAFT. It does not constitute legal advice. Before signing, consult with a licensed attorney in ${state} to review this document and ensure it meets all applicable legal requirements.
`;

  return document;
}

export default generateWill;
