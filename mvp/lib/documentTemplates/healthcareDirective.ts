/**
 * Healthcare Directive (Living Will) Template
 *
 * Also known as:
 * - Advance Healthcare Directive
 * - Living Will
 * - Medical Directive
 *
 * This document expresses your wishes about end-of-life medical treatment
 * when you cannot speak for yourself.
 */

export interface HealthcareDirectiveData {
  // Principal Information
  principalFullName: string;
  principalAddress: string;
  principalCity: string;
  principalState: string;
  principalCounty: string;
  principalDateOfBirth?: string;

  // Conditions Under Which This Directive Applies
  conditions: {
    terminalIllness: boolean;
    permanentUnconsciousness: boolean;
    advancedDementia: boolean;
    endStageCondition: boolean;
  };

  // Life-Sustaining Treatment Choices
  lifeSustainingTreatment: {
    cardiopulmonaryResuscitation: "yes" | "no" | "trial";
    mechanicalVentilation: "yes" | "no" | "trial";
    artificialNutrition: "yes" | "no" | "trial";
    artificialHydration: "yes" | "no" | "trial";
    dialysis: "yes" | "no" | "trial";
    antibiotics: "yes" | "no" | "trial";
    bloodTransfusions: "yes" | "no" | "trial";
  };

  // Comfort Care Preferences
  comfortCare: {
    painMedication: boolean;
    hospiceCare: boolean;
    spiritualCare: boolean;
    familyPresence: boolean;
    musicOrReadings: boolean;
  };

  // Pain Management
  painManagement: "maximum_comfort" | "balanced" | "mental_clarity_priority";

  // Where to Receive Care
  careLocation: "home" | "hospital" | "hospice" | "no_preference";

  // Organ Donation
  organDonation: "full" | "limited" | "none" | "research_only";
  organDonationLimitations?: string;

  // Autopsy
  allowAutopsy: "yes" | "no" | "if_required";

  // Body Disposition
  bodyDisposition: "burial" | "cremation" | "donation_to_science" | "agent_decides";
  specificDispositionInstructions?: string;

  // Religious/Spiritual Preferences
  religiousPreferences?: string;

  // Additional Instructions
  additionalInstructions?: string;

  // Primary Physician
  primaryPhysicianName?: string;
  primaryPhysicianPhone?: string;

  // Execution
  executionDate?: string;
}

export function generateHealthcareDirective(data: HealthcareDirectiveData): string {
  let document = `
# ADVANCE HEALTHCARE DIRECTIVE

## (Living Will)

---

**IMPORTANT NOTICE:** This document is a DRAFT for review purposes only. Before signing, you should have this document reviewed by a licensed attorney and discuss it with your physician. This document expresses your wishes about medical treatment if you become unable to make decisions for yourself.

---

## DECLARATION

I, **${data.principalFullName}**${data.principalDateOfBirth ? `, born ${data.principalDateOfBirth}` : ""}, being of sound mind, willfully and voluntarily make this declaration to be followed if I become unable to make or communicate my own healthcare decisions.

**Address:** ${data.principalAddress}, ${data.principalCity}, ${data.principalState}

---

## PART 1: CONDITIONS WHEN THIS DIRECTIVE APPLIES

This directive shall apply when I have been diagnosed with **one or more** of the following conditions, AND when two physicians (including my attending physician) have determined that I lack the capacity to make my own healthcare decisions:

`;

  if (data.conditions.terminalIllness) {
    document += `- **Terminal Illness:** An incurable condition from which there is no reasonable medical expectation of recovery and which will cause my death within a relatively short time.

`;
  }

  if (data.conditions.permanentUnconsciousness) {
    document += `- **Permanent Unconsciousness:** A condition, including persistent vegetative state or irreversible coma, in which I am permanently unaware of myself and my environment.

`;
  }

  if (data.conditions.advancedDementia) {
    document += `- **Advanced Dementia:** A progressive and irreversible condition in which I can no longer recognize family members, communicate coherently, or perform basic activities of daily living.

`;
  }

  if (data.conditions.endStageCondition) {
    document += `- **End-Stage Condition:** An irreversible condition caused by injury, disease, or illness that has resulted in severe and permanent deterioration, and for which treatment would be ineffective.

`;
  }

  document += `---

## PART 2: LIFE-SUSTAINING TREATMENT

If I am in any of the conditions described above, I make the following choices about life-sustaining treatment:

### Treatment Legend
- **YES** = I want this treatment to be provided
- **NO** = I do not want this treatment
- **TRIAL** = I want this treatment tried for a reasonable time; if it does not improve my condition, it should be stopped

| Treatment | My Choice |
|-----------|-----------|
`;

  const treatmentLabels: Record<string, string> = {
    cardiopulmonaryResuscitation: "Cardiopulmonary Resuscitation (CPR)",
    mechanicalVentilation: "Mechanical Ventilation (Breathing Machine)",
    artificialNutrition: "Artificial Nutrition (Tube Feeding)",
    artificialHydration: "Artificial Hydration (IV Fluids)",
    dialysis: "Kidney Dialysis",
    antibiotics: "Antibiotics for Life-Threatening Infections",
    bloodTransfusions: "Blood Transfusions",
  };

  Object.entries(data.lifeSustainingTreatment).forEach(([treatment, choice]) => {
    const label = treatmentLabels[treatment];
    const choiceText = choice.toUpperCase();
    document += `| ${label} | **${choiceText}** |\n`;
  });

  document += `

### Explanation of Treatments

- **CPR (Cardiopulmonary Resuscitation):** Chest compressions and artificial breathing to restart the heart and lungs if they stop.

- **Mechanical Ventilation:** A breathing machine that breathes for you if you cannot breathe on your own.

- **Artificial Nutrition:** Nutrients delivered through a tube placed in the stomach or intestines.

- **Artificial Hydration:** Fluids delivered through an IV line or tube.

- **Dialysis:** A machine that filters waste from the blood when the kidneys fail.

- **Antibiotics:** Medications to fight bacterial infections.

- **Blood Transfusions:** Receiving blood or blood products through an IV.

---

## PART 3: COMFORT CARE

**Regardless of my choices above, I ALWAYS want to receive comfort care** to relieve pain and keep me as comfortable as possible. This includes:

`;

  if (data.comfortCare.painMedication) {
    document += `- **Pain Medication:** Medications to relieve pain and discomfort, even if they may have the unintended effect of shortening my life.

`;
  }

  if (data.comfortCare.hospiceCare) {
    document += `- **Hospice Care:** If I am terminally ill, I want to receive hospice care focused on comfort rather than curative treatment.

`;
  }

  if (data.comfortCare.spiritualCare) {
    document += `- **Spiritual Care:** I want access to spiritual or religious support according to my beliefs.

`;
  }

  if (data.comfortCare.familyPresence) {
    document += `- **Family Presence:** I want my family and loved ones to be able to be with me.

`;
  }

  if (data.comfortCare.musicOrReadings) {
    document += `- **Music and Readings:** I want to have music played or readings from meaningful texts.

`;
  }

  document += `---

## PART 4: PAIN MANAGEMENT

`;

  if (data.painManagement === "maximum_comfort") {
    document += `I want **maximum comfort**. I want to receive enough pain medication to be comfortable, even if it may affect my alertness or potentially hasten my death.

`;
  } else if (data.painManagement === "mental_clarity_priority") {
    document += `I want to **maintain mental clarity** as much as possible. I prefer less pain medication if it allows me to remain more alert and aware, even if this means more discomfort.

`;
  } else {
    document += `I want a **balanced approach**. I want to be comfortable while maintaining as much alertness as possible. My healthcare providers should adjust medications as needed to achieve this balance.

`;
  }

  document += `---

## PART 5: LOCATION OF CARE

`;

  if (data.careLocation === "home") {
    document += `If possible, I prefer to receive care and **die at home** rather than in a hospital or other facility.

`;
  } else if (data.careLocation === "hospital") {
    document += `I prefer to receive care in a **hospital** where advanced medical treatment is available.

`;
  } else if (data.careLocation === "hospice") {
    document += `I prefer to receive care in a **hospice facility** where the focus is on comfort.

`;
  } else {
    document += `I have no preference about where I receive care. My Healthcare Agent may decide based on what is best for my comfort and my family.

`;
  }

  document += `---

## PART 6: ORGAN AND TISSUE DONATION

`;

  if (data.organDonation === "full") {
    document += `Upon my death, I **AUTHORIZE** the donation of any organs and tissues that may be used for transplant, therapy, medical research, or education.

`;
  } else if (data.organDonation === "limited") {
    document += `Upon my death, I authorize donation of organs and tissues **with the following limitations:**

${data.organDonationLimitations || "[Specify limitations]"}

`;
  } else if (data.organDonation === "research_only") {
    document += `Upon my death, I authorize the use of my organs and tissues for **medical research and education only**, not for transplant.

`;
  } else {
    document += `I **DO NOT** authorize the donation of my organs or tissues.

`;
  }

  document += `---

## PART 7: AUTOPSY

`;

  if (data.allowAutopsy === "yes") {
    document += `I **AUTHORIZE** an autopsy to be performed if my family or physicians wish it.

`;
  } else if (data.allowAutopsy === "no") {
    document += `I **DO NOT** authorize an autopsy unless required by law.

`;
  } else {
    document += `I authorize an autopsy **only if required by law** or if it may help determine the cause of death for my family's benefit.

`;
  }

  document += `---

## PART 8: DISPOSITION OF MY BODY

`;

  if (data.bodyDisposition === "burial") {
    document += `I wish to be **buried**.

`;
  } else if (data.bodyDisposition === "cremation") {
    document += `I wish to be **cremated**.

`;
  } else if (data.bodyDisposition === "donation_to_science") {
    document += `I wish to donate my body to **medical science** for research and education.

`;
  } else {
    document += `I leave the decision about disposition of my body to my Healthcare Agent or family.

`;
  }

  if (data.specificDispositionInstructions) {
    document += `### Specific Instructions

${data.specificDispositionInstructions}

`;
  }

  document += `---

`;

  if (data.religiousPreferences) {
    document += `## PART 9: RELIGIOUS AND SPIRITUAL PREFERENCES

${data.religiousPreferences}

---

`;
  }

  if (data.additionalInstructions) {
    document += `## ADDITIONAL INSTRUCTIONS

${data.additionalInstructions}

---

`;
  }

  if (data.primaryPhysicianName) {
    document += `## PRIMARY PHYSICIAN

**Name:** ${data.primaryPhysicianName}
${data.primaryPhysicianPhone ? `**Phone:** ${data.primaryPhysicianPhone}` : ""}

I have discussed this directive with my physician and have provided them with a copy.

---

`;
  }

  document += `## RELATIONSHIP TO HEALTHCARE POWER OF ATTORNEY

If I have also executed a Healthcare Power of Attorney, my Healthcare Agent should follow the instructions in this directive. If my Healthcare Agent believes circumstances have changed such that my stated wishes should be reconsidered, my Agent may authorize treatment that differs from this directive if they believe it would be in my best interest.

---

## REVOCATION

I may revoke this directive at any time by:
1. Destroying all copies of this document
2. Executing a written revocation
3. Verbally revoking it in the presence of witnesses

---

## SIGNATURE OF DECLARANT

I sign this Advance Healthcare Directive voluntarily and with full understanding of its contents. I am emotionally and mentally competent to make this document. This directive reflects my wishes about medical treatment if I become unable to make or communicate decisions for myself.

Date: ______________________


_____________________________________________
**${data.principalFullName}**, Declarant


---

## WITNESS STATEMENT

We, the undersigned witnesses, declare under penalty of perjury that:

1. The Declarant is personally known to us (or proved their identity to us)
2. The Declarant signed this document in our presence
3. The Declarant appears to be of sound mind and under no duress, fraud, or undue influence
4. We are each 18 years of age or older
5. Neither of us is the Declarant's healthcare provider or an employee of the Declarant's healthcare provider
6. Neither of us is entitled to any portion of the Declarant's estate
7. Neither of us is directly financially responsible for the Declarant's healthcare


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

## NOTARY ACKNOWLEDGMENT

STATE OF ${data.principalState.toUpperCase()}
COUNTY OF ${data.principalCounty.toUpperCase()}

On this ______ day of ______________, 20____, before me personally appeared **${data.principalFullName}**, known to me (or proved to me on the basis of satisfactory evidence) to be the person whose name is subscribed to the within instrument and acknowledged to me that they executed the same voluntarily and for the purposes therein expressed.

WITNESS my hand and official seal.


_____________________________________________
Notary Public

My Commission Expires: ____________________

[NOTARY SEAL]

---

## IMPORTANT INFORMATION

1. **Give copies of this document to:**
   - Your Healthcare Agent (if you have one)
   - Your primary physician
   - Your family members
   - Your hospital or care facility

2. **Keep a copy** in an accessible location

3. **Carry a wallet card** indicating you have this document and where it can be found

4. **Review and update** this document whenever your wishes change

5. **Discuss your wishes** with your family and healthcare providers

---

**DISCLAIMER:** This document was generated for informational purposes and is a DRAFT. It does not constitute legal advice. Before signing, consult with a licensed attorney in ${data.principalState} and discuss this document with your physician to ensure it meets all applicable legal requirements and accurately reflects your wishes.

---

## STATE-SPECIFIC NOTES

Different states have different requirements for healthcare directives. In ${data.principalState}, you should verify:

- The number of witnesses required
- Whether notarization is required or recommended
- Any specific language requirements
- Whether this form is accepted by healthcare providers in your area

Consult with a local attorney to ensure this document will be honored in ${data.principalState}.
`;

  return document;
}

export default generateHealthcareDirective;
