"use client";

import { ReactNode, useState } from "react";

type Priority = "high" | "medium" | "low";
type Severity = "critical" | "high" | "medium" | "low";

interface GapAnalysisCardProps {
  type: "missing" | "outdated" | "inconsistency" | "recommendation" | "note" | "common_issue";
  title: string;
  description: string;
  priority?: Priority;
  action?: ReactNode;
  documentType?: string;
  issueType?: string;
  severity?: Severity;
  affectedAssets?: string[];
  recommendation?: string;
  showResolutionSteps?: boolean;
}

const TYPE_CONFIG = {
  missing: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    iconColor: "text-red-500",
    titleColor: "text-red-800 dark:text-red-300",
  },
  outdated: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    iconColor: "text-yellow-500",
    titleColor: "text-yellow-800 dark:text-yellow-300",
  },
  inconsistency: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    iconColor: "text-orange-500",
    titleColor: "text-orange-800 dark:text-orange-300",
  },
  recommendation: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-500",
    titleColor: "text-blue-800 dark:text-blue-300",
  },
  note: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: "bg-gray-50 dark:bg-gray-700",
    borderColor: "border-gray-200 dark:border-gray-600",
    iconColor: "text-gray-500",
    titleColor: "text-gray-800 dark:text-gray-200",
  },
  common_issue: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    iconColor: "text-purple-500",
    titleColor: "text-purple-800 dark:text-purple-300",
  },
};

const PRIORITY_BADGE = {
  high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

const SEVERITY_BADGE = {
  critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

// Document type display names
export const DOCUMENT_TYPE_NAMES: Record<string, string> = {
  will: "Last Will & Testament",
  trust: "Revocable Living Trust",
  poa_financial: "Financial Power of Attorney",
  poa_healthcare: "Healthcare Power of Attorney",
  healthcare_directive: "Healthcare Directive / Living Will",
  hipaa: "HIPAA Authorization",
  credit_shelter_trust: "Credit Shelter Trust",
  ilit: "Irrevocable Life Insurance Trust",
  homestead_declaration: "Homestead Declaration",
  other: "Other Document",
};

// ============================================
// PLAIN-LANGUAGE EXPLANATIONS
// ============================================

/**
 * Get a plain-language explanation of what a document does and why it matters
 */
export function getDocumentExplanation(documentType: string): {
  whatItIs: string;
  whyYouNeedIt: string;
  whatHappensWithout: string;
} {
  const explanations: Record<string, { whatItIs: string; whyYouNeedIt: string; whatHappensWithout: string }> = {
    will: {
      whatItIs: "A Last Will & Testament is a legal document that spells out your wishes for how your belongings (property, money, possessions) should be distributed after you pass away. It also lets you name a guardian for any minor children.",
      whyYouNeedIt: "Without a will, you have no say in who gets your assets or who raises your children. A will gives you control and makes things much easier for your loved ones during a difficult time.",
      whatHappensWithout: "Your state's laws will decide who inherits your assets (called 'intestate succession'). This may not match your wishes. For example, your assets might go to distant relatives instead of close friends, or be split in ways you wouldn't want.",
    },
    trust: {
      whatItIs: "A Revocable Living Trust is like a container that holds your assets during your lifetime. You control everything while you're alive, but when you pass away, your chosen trustee distributes assets according to your instructions - without going through probate court.",
      whyYouNeedIt: "A trust helps your family avoid the lengthy and expensive probate process. It also keeps your affairs private (wills become public record) and can help if you become incapacitated.",
      whatHappensWithout: "Your assets may need to go through probate, which can take months or years, cost thousands in legal fees, and become part of the public record. Your family may face delays in accessing funds they need.",
    },
    poa_financial: {
      whatItIs: "A Financial Power of Attorney lets you name someone you trust (called your 'agent') to handle your financial matters if you can't do it yourself - like paying bills, managing investments, or selling property.",
      whyYouNeedIt: "If you're in an accident, have a medical emergency, or develop dementia, someone needs to be able to pay your bills and manage your finances. Without this document, your family may need to go to court to get that authority.",
      whatHappensWithout: "Your family may need to petition a court to become your conservator - a process that's expensive, time-consuming, and emotionally draining. Meanwhile, bills go unpaid and financial matters pile up.",
    },
    poa_healthcare: {
      whatItIs: "A Healthcare Power of Attorney (also called a Healthcare Proxy) names someone to make medical decisions for you if you're unable to communicate or make decisions yourself.",
      whyYouNeedIt: "Medical emergencies can happen suddenly. Having someone legally authorized to speak with doctors and make decisions ensures your care isn't delayed and your wishes are respected.",
      whatHappensWithout: "Doctors may not know who to consult about your care. Family members may disagree about treatment, causing delays and conflict. In worst cases, a court may need to appoint a guardian.",
    },
    healthcare_directive: {
      whatItIs: "A Healthcare Directive (or Living Will) documents your wishes for end-of-life medical care - like whether you want to be kept on life support, receive CPR, or have a feeding tube. It speaks for you when you can't.",
      whyYouNeedIt: "This document takes the burden of difficult decisions off your loved ones. Instead of guessing what you'd want, they can follow your clearly stated wishes during an incredibly stressful time.",
      whatHappensWithout: "Your family may face agonizing decisions without knowing your wishes. Family members may disagree, leading to conflict and guilt. Medical staff may default to aggressive treatment you wouldn't have wanted.",
    },
    hipaa: {
      whatItIs: "A HIPAA Authorization allows specific people to access your medical records and speak with your healthcare providers about your health information.",
      whyYouNeedIt: "Due to privacy laws, doctors and hospitals can't share your medical information - even with close family - without your permission. This form ensures your loved ones can stay informed about your health.",
      whatHappensWithout: "Even your spouse or adult children may be unable to get information about your condition, test results, or treatment plans. This can cause enormous frustration during health crises.",
    },
    credit_shelter_trust: {
      whatItIs: "A Credit Shelter Trust (also called a Bypass Trust or Family Trust) is a special trust for married couples that can reduce estate taxes by using both spouses' tax exemptions.",
      whyYouNeedIt: "For larger estates, this trust can save hundreds of thousands of dollars in estate taxes while still providing for your surviving spouse and ultimately passing assets to your children.",
      whatHappensWithout: "You may pay more estate taxes than necessary. Your spouse might not be able to use your estate tax exemption, essentially wasting a valuable tax benefit.",
    },
    ilit: {
      whatItIs: "An Irrevocable Life Insurance Trust (ILIT) owns your life insurance policy outside of your estate. This means the death benefit isn't counted as part of your estate for tax purposes.",
      whyYouNeedIt: "For people with large estates, life insurance can push you over the estate tax threshold. An ILIT keeps those proceeds out of your taxable estate, potentially saving your heirs significant taxes.",
      whatHappensWithout: "Life insurance proceeds become part of your taxable estate. For large estates, this could mean 40% or more of your insurance payout goes to taxes instead of your beneficiaries.",
    },
    homestead_declaration: {
      whatItIs: "A Homestead Declaration is a document filed with your county that protects your home from certain creditors. It creates a legal shield around the equity in your primary residence.",
      whyYouNeedIt: "If you face a lawsuit or financial trouble, a homestead declaration can protect your home equity (up to state limits) from being seized to pay creditors. It's an important layer of asset protection.",
      whatHappensWithout: "Your home equity could be vulnerable to creditor claims from lawsuits, medical bills, or business debts. You might lose your home or be forced to sell it to pay creditors.",
    },
  };

  return explanations[documentType] || {
    whatItIs: "This is an important estate planning document.",
    whyYouNeedIt: "It helps protect you and your family.",
    whatHappensWithout: "You may not have proper legal protections in place.",
  };
}

/**
 * Get plain-language explanation for common issue types
 */
export function getIssueTypeExplanation(issueType: string): string {
  const explanations: Record<string, string> = {
    missing_beneficiary: "A beneficiary is the person (or people) you've named to receive assets from accounts like retirement plans, life insurance, or bank accounts. These assets pass directly to beneficiaries - they don't go through your will.",
    unclear_trust: "This means there's something about your trust that could cause problems - maybe it's not properly funded (assets haven't been transferred into it), or key details like who manages it after you're gone aren't clear.",
    missing_guardian: "A guardian is the person you want to raise your children if something happens to you. Without naming one in your will, a court will decide - and it might not be who you'd choose.",
    outdated_designation: "Beneficiary designations should be reviewed regularly. Life changes - marriages, divorces, births, deaths - can make old designations problematic or even give assets to the wrong people.",
    inconsistent_beneficiary: "Your beneficiary designations on accounts may not match what's in your will or what you actually want. This can cause confusion, family conflict, or assets going to unintended recipients.",
  };

  return explanations[issueType] || "This issue may need your attention to ensure your estate plan works as intended.";
}

// ============================================
// RESOLUTION STEPS
// ============================================

/**
 * Get step-by-step resolution instructions for missing documents
 */
export function getDocumentResolutionSteps(documentType: string): string[] {
  const steps: Record<string, string[]> = {
    will: [
      "Decide who you want to inherit your assets and in what proportions",
      "Choose an executor - someone responsible to carry out your wishes",
      "If you have minor children, decide who should be their guardian",
      "Consult with an estate planning attorney to draft your will",
      "Sign your will in front of witnesses (requirements vary by state)",
      "Store the original in a safe place and tell your executor where it is",
    ],
    trust: [
      "Decide what type of trust best fits your needs (revocable is most common)",
      "Choose a successor trustee to manage the trust after you",
      "List the beneficiaries and their shares",
      "Work with an estate planning attorney to create the trust document",
      "Fund the trust by transferring assets into it (retitling property, accounts)",
      "Update beneficiary designations on retirement accounts to align with your plan",
    ],
    poa_financial: [
      "Choose someone you trust completely to handle your finances if needed",
      "Consider naming a backup agent in case your first choice can't serve",
      "Decide when the power should take effect (immediately or only if incapacitated)",
      "Work with an attorney to draft the document with appropriate powers",
      "Sign the document according to your state's requirements (notarization usually required)",
      "Give a copy to your agent and keep the original in a safe place",
    ],
    poa_healthcare: [
      "Choose someone who understands your healthcare wishes and can advocate for you",
      "Have a conversation with them about your preferences for medical care",
      "Consider naming an alternate agent as a backup",
      "Work with an attorney or use your state's official form",
      "Sign the document with proper witnesses/notarization as required",
      "Give copies to your agent, your doctor, and the hospital where you'd likely receive care",
    ],
    healthcare_directive: [
      "Think carefully about your wishes for end-of-life care",
      "Consider: life support, CPR, feeding tubes, pain management preferences",
      "Discuss your values and wishes with your family and healthcare proxy",
      "Complete your state's official advance directive form or work with an attorney",
      "Sign the document with proper witnesses as required by your state",
      "Distribute copies to your healthcare agent, doctors, and family members",
    ],
    hipaa: [
      "Decide who should be able to access your medical information",
      "Obtain a HIPAA authorization form (from your doctor or attorney)",
      "List each person by name with their relationship to you",
      "Specify what information they can access (usually 'all' is recommended)",
      "Sign and date the form",
      "Give copies to each authorized person and your healthcare providers",
    ],
    credit_shelter_trust: [
      "Evaluate your estate size to see if this trust would provide tax benefits",
      "Discuss the strategy with your spouse - both must understand the implications",
      "Consult with an estate planning attorney who specializes in tax planning",
      "Coordinate the trust with your will and other estate documents",
      "Fund the trust appropriately after the first spouse passes",
      "Review periodically as estate tax laws change",
    ],
    ilit: [
      "Determine if your estate is large enough to benefit from an ILIT",
      "Choose a trustee (cannot be you or your spouse)",
      "Work with an attorney to create the irrevocable trust",
      "Transfer existing policy ownership to the trust OR have the trust purchase a new policy",
      "Make annual gifts to the trust to pay premiums (using Crummey notices)",
      "Understand this trust cannot be changed once created - it's permanent",
    ],
    homestead_declaration: [
      "Verify your state offers homestead protection (not all do)",
      "Obtain the homestead declaration form from your county recorder's office",
      "Fill out the form with your property information",
      "Sign the form (notarization may be required)",
      "File the form with your county recorder's office and pay any filing fee",
      "Keep a copy with your important documents",
    ],
  };

  return steps[documentType] || [
    "Identify what document you need",
    "Gather information about your wishes and situation",
    "Consult with an estate planning attorney",
    "Sign the document according to your state's requirements",
    "Store it safely and inform relevant parties",
  ];
}

/**
 * Get resolution steps for common issues
 */
export function getIssueResolutionSteps(issueType: string): string[] {
  const steps: Record<string, string[]> = {
    missing_beneficiary: [
      "Gather account statements for all retirement accounts, life insurance, and bank accounts",
      "Contact each financial institution to request current beneficiary information",
      "Review each designation - does it still reflect your wishes?",
      "Update any outdated designations with new beneficiary forms",
      "Name both primary AND contingent (backup) beneficiaries on every account",
      "Keep copies of all beneficiary designation forms with your estate documents",
    ],
    unclear_trust: [
      "Locate your original trust document and any amendments",
      "Review who is named as successor trustee - are they still the right choice?",
      "Check if the trust has been funded - are assets actually titled in the trust's name?",
      "Verify beneficiary designations are clear and percentages add up to 100%",
      "Meet with an estate planning attorney to address any gaps or unclear provisions",
      "Create a trust funding checklist and transfer any assets still in your personal name",
    ],
    missing_guardian: [
      "Have a conversation with your spouse/partner about who you'd want to raise your children",
      "Consider the potential guardian's values, parenting style, and financial stability",
      "Think about location - would your children need to move schools?",
      "Talk to your chosen guardian to make sure they're willing and able",
      "Name an alternate guardian in case your first choice can't serve",
      "Add guardian nominations to your will and have it properly signed",
    ],
    outdated_designation: [
      "Pull recent statements for all accounts with beneficiary designations",
      "Make a list showing current beneficiaries for each account",
      "Compare against your current wishes and family situation",
      "Contact financial institutions to update any that need changing",
      "Set a calendar reminder to review beneficiaries annually",
      "Review after any major life event (marriage, divorce, birth, death)",
    ],
    inconsistent_beneficiary: [
      "Create a spreadsheet listing all your accounts and their current beneficiaries",
      "Compare this list with your will and/or trust beneficiaries",
      "Identify any inconsistencies that could cause confusion or conflict",
      "Decide what the correct beneficiary should be for each account",
      "Update beneficiary forms to match your intended plan",
      "Keep everything consistent - your will, trust, and beneficiary designations should tell the same story",
    ],
  };

  return steps[issueType] || [
    "Review your current estate planning documents",
    "Identify what needs to be updated or created",
    "Consult with an estate planning professional",
    "Make the necessary changes",
    "Document everything and store safely",
  ];
}

// ============================================
// COMPONENTS
// ============================================

export default function GapAnalysisCard({
  type,
  title,
  description,
  priority,
  action,
  documentType,
  issueType,
  severity,
  affectedAssets,
  recommendation,
  showResolutionSteps = false,
}: GapAnalysisCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = TYPE_CONFIG[type];

  // Get explanation and steps based on context
  const docExplanation = documentType ? getDocumentExplanation(documentType) : null;
  const issueExplanation = issueType ? getIssueTypeExplanation(issueType) : null;
  const resolutionSteps = documentType
    ? getDocumentResolutionSteps(documentType)
    : issueType
      ? getIssueResolutionSteps(issueType)
      : [];

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${config.iconColor}`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className={`font-medium ${config.titleColor}`}>{title}</h4>
            {priority && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_BADGE[priority]}`}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
              </span>
            )}
            {severity && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SEVERITY_BADGE[severity]}`}>
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>

          {/* Affected Assets */}
          {affectedAssets && affectedAssets.length > 0 && (
            <div className="mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Affected: </span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {affectedAssets.join(", ")}
              </span>
            </div>
          )}

          {/* Recommendation */}
          {recommendation && (
            <div className="mt-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">Recommendation: </span>
              <span className="text-gray-600 dark:text-gray-400">{recommendation}</span>
            </div>
          )}

          {/* Expandable Details */}
          {(docExplanation || issueExplanation || showResolutionSteps) && (
            <div className="mt-3">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {isExpanded ? 'Hide details' : 'Learn more & how to fix'}
              </button>

              {isExpanded && (
                <div className="mt-3 space-y-4 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg">
                  {/* Plain Language Explanation */}
                  {docExplanation && (
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          What is this document?
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {docExplanation.whatItIs}
                        </p>
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          Why do you need it?
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {docExplanation.whyYouNeedIt}
                        </p>
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                          What happens without it?
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {docExplanation.whatHappensWithout}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Issue Type Explanation */}
                  {issueExplanation && !docExplanation && (
                    <div>
                      <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        What does this mean?
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {issueExplanation}
                      </p>
                    </div>
                  )}

                  {/* Resolution Steps */}
                  {resolutionSteps.length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                        How to resolve this:
                      </h5>
                      <ol className="space-y-2">
                        {resolutionSteps.map((step, index) => (
                          <li key={index} className="flex gap-2 text-sm">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {action && <div className="mt-3">{action}</div>}
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMMON ISSUE CARD (Specialized component)
// ============================================

interface CommonIssueCardProps {
  type: "missing_beneficiary" | "unclear_trust" | "missing_guardian" | "outdated_designation" | "inconsistent_beneficiary";
  severity: Severity;
  title: string;
  description: string;
  affectedAssets?: string[];
  recommendation: string;
}

export function CommonIssueCard({
  type,
  severity,
  title,
  description,
  affectedAssets,
  recommendation,
}: CommonIssueCardProps) {
  return (
    <GapAnalysisCard
      type="common_issue"
      title={title}
      description={description}
      severity={severity}
      issueType={type}
      affectedAssets={affectedAssets}
      recommendation={recommendation}
      showResolutionSteps={true}
    />
  );
}

// Score ring component
interface ScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function ScoreRing({ score, size = "md" }: ScoreRingProps) {
  const sizeConfig = {
    sm: { ring: 60, stroke: 6, text: "text-lg" },
    md: { ring: 100, stroke: 8, text: "text-2xl" },
    lg: { ring: 140, stroke: 10, text: "text-4xl" },
  };

  const config = sizeConfig[size];
  const radius = (config.ring - config.stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getLabel = (score: number) => {
    if (score >= 80) return "Good";
    if (score >= 60) return "Fair";
    if (score >= 40) return "Needs Work";
    return "Critical";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative inline-flex items-center justify-center">
        <svg width={config.ring} height={config.ring} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.stroke}
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${getColor(score)} transition-all duration-500`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${config.text} ${getColor(score)}`}>{score}</span>
        </div>
      </div>
      {size !== "sm" && (
        <span className={`mt-1 text-sm font-medium ${getColor(score)}`}>
          {getLabel(score)}
        </span>
      )}
    </div>
  );
}

// ============================================
// SUMMARY COMPONENTS
// ============================================

interface GapSummaryProps {
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
}

export function GapSummary({ criticalCount, highCount, mediumCount, lowCount }: GapSummaryProps) {
  const total = criticalCount + highCount + mediumCount + lowCount;

  if (total === 0) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
        <svg className="w-8 h-8 mx-auto text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-green-800 dark:text-green-200 font-medium">No issues found!</p>
        <p className="text-sm text-green-600 dark:text-green-400 mt-1">Your estate plan looks complete.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Issues Found</h3>
      <div className="grid grid-cols-4 gap-2 text-center">
        {criticalCount > 0 && (
          <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-2">
            <div className="text-xl font-bold text-red-700 dark:text-red-400">{criticalCount}</div>
            <div className="text-xs text-red-600 dark:text-red-500">Critical</div>
          </div>
        )}
        {highCount > 0 && (
          <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-2">
            <div className="text-xl font-bold text-orange-700 dark:text-orange-400">{highCount}</div>
            <div className="text-xs text-orange-600 dark:text-orange-500">High</div>
          </div>
        )}
        {mediumCount > 0 && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-2">
            <div className="text-xl font-bold text-yellow-700 dark:text-yellow-400">{mediumCount}</div>
            <div className="text-xs text-yellow-600 dark:text-yellow-500">Medium</div>
          </div>
        )}
        {lowCount > 0 && (
          <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-2">
            <div className="text-xl font-bold text-green-700 dark:text-green-400">{lowCount}</div>
            <div className="text-xs text-green-600 dark:text-green-500">Low</div>
          </div>
        )}
      </div>
      {criticalCount > 0 && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-3 text-center">
          Address critical issues first - they have the biggest impact on your estate plan.
        </p>
      )}
    </div>
  );
}
