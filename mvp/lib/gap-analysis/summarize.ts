/**
 * Summarization utilities for Phase 3 prompts
 * Reduces Phase 2 results from ~200KB+ to ~10-20KB while preserving essential context
 */

import {
  Phase1Results,
  Phase2Results,
  AggregatedPhase2Results,
  DocumentCompletenessResult,
  TaxOptimizationResult,
  MedicaidPlanningResult,
  BeneficiaryCoordinationResult,
  FamilyProtectionResult,
  AssetProtectionResult,
  ExistingDocumentReviewResult,
} from "./types";

/**
 * Summarized Phase 2 results for Phase 3 prompts
 * Contains only the essential findings in a condensed format
 */
export interface SummarizedPhase2Results {
  /** Critical compliance and document issues */
  documentIssues: {
    criticalCount: number;
    highCount: number;
    topIssues: Array<{ document: string; issue: string; severity: string }>;
    estimatedCostToFix: { low: number; high: number };
  };

  /** Tax exposure and top strategies */
  taxAnalysis: {
    totalExposure: number;
    federalExposure: number;
    stateExposure: number;
    totalPotentialSavings: number;
    topStrategies: Array<{
      name: string;
      savings: { low: number; high: number };
      timeline: string;
    }>;
    sunsetImpact?: number;
  };

  /** Medicaid risk summary */
  medicaidRisk?: {
    riskLevel: string;
    currentExposure: number;
    lookbackConcerns: number;
    topStrategies: string[];
  };

  /** Beneficiary coordination issues */
  beneficiaryIssues: {
    conflictCount: number;
    missingCount: number;
    outdatedCount: number;
    topIssues: Array<{ asset: string; issue: string }>;
  };

  /** Family protection gaps */
  familyProtection: {
    hasGuardian: boolean;
    hasPOAFinancial: boolean;
    hasPOAHealthcare: boolean;
    criticalGaps: string[];
    minorChildrenIssues: string[];
  };

  /** Asset protection vulnerabilities */
  assetProtection?: {
    totalVulnerableValue: number;
    topVulnerabilities: Array<{ asset: string; risk: string }>;
    businessSuccessionNeeded: boolean;
  };

  /** Existing document review findings */
  existingDocReview?: {
    issueCount: number;
    outdatedProvisions: number;
    topIssues: Array<{ document: string; issue: string }>;
  };

  /** Aggregated top recommendations across all analyses */
  topRecommendations: Array<{
    action: string;
    category: string;
    priority: "critical" | "high" | "medium" | "low";
    estimatedCost?: { low: number; high: number };
  }>;

  /** Key statistics for quick reference */
  summary: {
    totalCriticalIssues: number;
    totalHighIssues: number;
    estimatedTotalExposure: number;
    estimatedSavingsOpportunity: number;
    immediateActionCount: number;
  };
}

/**
 * Summarized Phase 1 results for Phase 3 prompts
 */
export interface SummarizedPhase1Results {
  stateResearch: {
    state?: string;
    estateTax?: unknown;
    inheritanceTax?: { exists: boolean; hasExemptions: boolean };
    medicaid?: unknown;
    willRequirements?: unknown;
  };
  clientContext: unknown;
  documentInventory: {
    existingCount: number;
    existingDocuments?: Array<{ type: string; status: string }>;
    missingEssential?: Array<unknown>;
    outdatedCount: number;
    coordinationIssues?: string[];
  };
}

/**
 * Summarize Phase 1 results - keep most but remove verbose sources
 */
export function summarizePhase1Results(phase1: Phase1Results): SummarizedPhase1Results {
  return {
    stateResearch: {
      state: phase1.stateResearch?.state,
      estateTax: phase1.stateResearch?.estateTax,
      inheritanceTax: phase1.stateResearch?.inheritanceTax
        ? {
            exists: phase1.stateResearch.inheritanceTax.exists,
            hasExemptions: (phase1.stateResearch.inheritanceTax.exemptions?.length || 0) > 0,
          }
        : undefined,
      medicaid: phase1.stateResearch?.medicaid,
      willRequirements: phase1.stateResearch?.willRequirements,
      // Omit: sources, trustRequirements, poaRequirements (verbose)
    },
    clientContext: phase1.clientContext, // Keep full - this is essential
    documentInventory: {
      existingCount: phase1.documentInventory?.existingDocuments?.length || 0,
      existingDocuments: phase1.documentInventory?.existingDocuments?.map((d) => ({
        type: d.type,
        status: d.status,
      })),
      missingEssential: phase1.documentInventory?.missingEssential?.slice(0, 5),
      outdatedCount: phase1.documentInventory?.outdated?.length || 0,
      coordinationIssues: phase1.documentInventory?.coordinationIssues?.slice(0, 3),
    },
  };
}

/**
 * Summarize Phase 2 results for Phase 3 consumption
 */
export function summarizePhase2Results(
  phase2Results: Phase2Results | AggregatedPhase2Results
): SummarizedPhase2Results {
  // Handle AggregatedPhase2Results differently
  if ("allMissingDocuments" in phase2Results) {
    return summarizeAggregatedResults(phase2Results);
  }

  const results = phase2Results as Phase2Results;

  // Extract document issues
  const documentIssues = summarizeDocumentCompleteness(results.documentCompleteness);

  // Extract tax analysis
  const taxAnalysis = summarizeTaxOptimization(results.taxOptimization);

  // Extract medicaid risk
  const medicaidRisk = results.medicaidPlanning
    ? summarizeMedicaidPlanning(results.medicaidPlanning)
    : undefined;

  // Extract beneficiary issues
  const beneficiaryIssues = summarizeBeneficiaryCoordination(results.beneficiaryCoordination);

  // Extract family protection
  const familyProtection = summarizeFamilyProtection(results.familyProtection);

  // Extract asset protection
  const assetProtection = results.assetProtection
    ? summarizeAssetProtection(results.assetProtection)
    : undefined;

  // Extract existing doc review
  const existingDocReview = results.existingDocumentReview
    ? summarizeExistingDocReview(results.existingDocumentReview)
    : undefined;

  // Aggregate top recommendations
  const topRecommendations = aggregateTopRecommendations(results);

  // Calculate summary stats
  const summary = calculateSummaryStats(
    documentIssues,
    taxAnalysis,
    beneficiaryIssues,
    familyProtection,
    topRecommendations
  );

  return {
    documentIssues,
    taxAnalysis,
    medicaidRisk,
    beneficiaryIssues,
    familyProtection,
    assetProtection,
    existingDocReview,
    topRecommendations,
    summary,
  };
}

function summarizeDocumentCompleteness(
  doc: DocumentCompletenessResult | undefined
): SummarizedPhase2Results["documentIssues"] {
  if (!doc) {
    return {
      criticalCount: 0,
      highCount: 0,
      topIssues: [],
      estimatedCostToFix: { low: 0, high: 0 },
    };
  }

  const criticalIssues =
    doc.complianceIssues?.filter((i) => i.severity === "critical") || [];
  const highIssues = doc.complianceIssues?.filter((i) => i.severity === "high") || [];

  return {
    criticalCount: criticalIssues.length,
    highCount: highIssues.length,
    topIssues: [...criticalIssues, ...highIssues].slice(0, 5).map((i) => ({
      document: i.document,
      issue: i.issue,
      severity: i.severity,
    })),
    estimatedCostToFix: doc.estimatedComplianceCost || { low: 0, high: 0 },
  };
}

function summarizeTaxOptimization(
  tax: TaxOptimizationResult | undefined
): SummarizedPhase2Results["taxAnalysis"] {
  if (!tax) {
    return {
      totalExposure: 0,
      federalExposure: 0,
      stateExposure: 0,
      totalPotentialSavings: 0,
      topStrategies: [],
    };
  }

  return {
    totalExposure: tax.currentExposure?.combined || 0,
    federalExposure: tax.currentExposure?.federal || 0,
    stateExposure: tax.currentExposure?.state || 0,
    totalPotentialSavings: tax.totalPotentialSavings || 0,
    topStrategies: (tax.strategies || []).slice(0, 4).map((s) => ({
      name: s.name,
      savings: s.estimatedSavings,
      timeline: s.timeline,
    })),
    sunsetImpact: tax.sunsetAnalysis?.additionalExposure,
  };
}

function summarizeMedicaidPlanning(
  med: MedicaidPlanningResult
): SummarizedPhase2Results["medicaidRisk"] {
  return {
    riskLevel: med.riskAssessment?.likelihood || "unknown",
    currentExposure: med.currentExposure || 0,
    lookbackConcerns: med.lookbackConcerns?.length || 0,
    topStrategies: (med.strategies || []).slice(0, 3).map((s) => s.name),
  };
}

function summarizeBeneficiaryCoordination(
  ben: BeneficiaryCoordinationResult | undefined
): SummarizedPhase2Results["beneficiaryIssues"] {
  if (!ben) {
    return {
      conflictCount: 0,
      missingCount: 0,
      outdatedCount: 0,
      topIssues: [],
    };
  }

  const topIssues: Array<{ asset: string; issue: string }> = [];

  // Add conflicts
  (ben.conflicts || []).slice(0, 2).forEach((c) => {
    topIssues.push({ asset: `${c.asset1} vs ${c.asset2}`, issue: c.issue });
  });

  // Add missing
  (ben.missingDesignations || []).slice(0, 2).forEach((m) => {
    topIssues.push({ asset: m.asset, issue: `Missing designation - ${m.risk}` });
  });

  return {
    conflictCount: ben.conflicts?.length || 0,
    missingCount: ben.missingDesignations?.length || 0,
    outdatedCount: ben.outdatedDesignations?.length || 0,
    topIssues: topIssues.slice(0, 5),
  };
}

function summarizeFamilyProtection(
  fam: FamilyProtectionResult | undefined
): SummarizedPhase2Results["familyProtection"] {
  if (!fam) {
    return {
      hasGuardian: false,
      hasPOAFinancial: false,
      hasPOAHealthcare: false,
      criticalGaps: [],
      minorChildrenIssues: [],
    };
  }

  return {
    hasGuardian: fam.minorChildrenProtection?.guardianNamed || false,
    hasPOAFinancial: fam.incapacityProtection?.poaFinancial || false,
    hasPOAHealthcare: fam.incapacityProtection?.poaHealthcare || false,
    criticalGaps: (fam.gaps || []).slice(0, 4),
    minorChildrenIssues: (fam.minorChildrenProtection?.gaps || []).slice(0, 3),
  };
}

function summarizeAssetProtection(
  asset: AssetProtectionResult
): SummarizedPhase2Results["assetProtection"] {
  const totalVulnerable = (asset.vulnerabilities || []).reduce(
    (sum, v) => sum + (v.exposure || 0),
    0
  );

  return {
    totalVulnerableValue: totalVulnerable,
    topVulnerabilities: (asset.vulnerabilities || []).slice(0, 3).map((v) => ({
      asset: v.asset,
      risk: v.risk,
    })),
    businessSuccessionNeeded:
      asset.businessSuccession?.applicable &&
      (asset.businessSuccession?.gaps?.length || 0) > 0,
  };
}

function summarizeExistingDocReview(
  review: ExistingDocumentReviewResult
): SummarizedPhase2Results["existingDocReview"] {
  return {
    issueCount: review.documentIssues?.length || 0,
    outdatedProvisions: review.outdatedProvisions?.length || 0,
    topIssues: (review.documentIssues || []).slice(0, 4).map((i) => ({
      document: i.document,
      issue: i.issue,
    })),
  };
}

function aggregateTopRecommendations(
  results: Phase2Results
): SummarizedPhase2Results["topRecommendations"] {
  const allRecs: SummarizedPhase2Results["topRecommendations"] = [];

  // From family protection
  (results.familyProtection?.recommendations || []).forEach((r) => {
    allRecs.push({
      action: r.action,
      category: "family_protection",
      priority: r.priority <= 1 ? "critical" : r.priority <= 2 ? "high" : "medium",
      estimatedCost: r.cost,
    });
  });

  // From beneficiary coordination
  (results.beneficiaryCoordination?.recommendations || []).forEach((r) => {
    allRecs.push({
      action: r.action,
      category: "beneficiary",
      priority: r.priority <= 1 ? "critical" : r.priority <= 2 ? "high" : "medium",
    });
  });

  // From asset protection
  (results.assetProtection?.recommendations || []).forEach((r) => {
    allRecs.push({
      action: r.strategy,
      category: "asset_protection",
      priority: r.priority <= 1 ? "critical" : r.priority <= 2 ? "high" : "medium",
      estimatedCost: r.cost,
    });
  });

  // From existing doc review
  (results.existingDocumentReview?.recommendations || []).forEach((r) => {
    allRecs.push({
      action: r.action,
      category: "document_update",
      priority: r.priority <= 1 ? "critical" : r.priority <= 2 ? "high" : "medium",
    });
  });

  // Sort by priority and take top 10
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return allRecs
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .slice(0, 10);
}

function calculateSummaryStats(
  documentIssues: SummarizedPhase2Results["documentIssues"],
  taxAnalysis: SummarizedPhase2Results["taxAnalysis"],
  beneficiaryIssues: SummarizedPhase2Results["beneficiaryIssues"],
  familyProtection: SummarizedPhase2Results["familyProtection"],
  topRecommendations: SummarizedPhase2Results["topRecommendations"]
): SummarizedPhase2Results["summary"] {
  const criticalCount =
    documentIssues.criticalCount +
    beneficiaryIssues.conflictCount +
    topRecommendations.filter((r) => r.priority === "critical").length;

  const highCount =
    documentIssues.highCount +
    beneficiaryIssues.missingCount +
    topRecommendations.filter((r) => r.priority === "high").length;

  return {
    totalCriticalIssues: criticalCount,
    totalHighIssues: highCount,
    estimatedTotalExposure: taxAnalysis.totalExposure,
    estimatedSavingsOpportunity: taxAnalysis.totalPotentialSavings,
    immediateActionCount: topRecommendations.filter((r) => r.priority === "critical")
      .length,
  };
}

function summarizeAggregatedResults(
  agg: AggregatedPhase2Results
): SummarizedPhase2Results {
  return {
    documentIssues: {
      criticalCount: agg.allMissingDocuments?.filter((d) => d.priority === "critical")
        .length || 0,
      highCount: agg.allMissingDocuments?.filter((d) => d.priority === "high").length || 0,
      topIssues: (agg.allMissingDocuments || []).slice(0, 5).map((d) => ({
        document: d.document,
        issue: d.reason,
        severity: d.priority,
      })),
      estimatedCostToFix: { low: 0, high: 0 },
    },
    taxAnalysis: {
      totalExposure: agg.financialExposure?.total || 0,
      federalExposure: agg.financialExposure?.estateTax || 0,
      stateExposure: 0,
      totalPotentialSavings: (agg.taxStrategies || []).reduce(
        (sum, s) => sum + (s.estimatedSavings?.high || 0),
        0
      ),
      topStrategies: (agg.taxStrategies || []).slice(0, 4).map((s) => ({
        name: s.name,
        savings: s.estimatedSavings,
        timeline: s.timeline,
      })),
    },
    medicaidRisk:
      agg.financialExposure?.medicaid && agg.financialExposure.medicaid > 0
        ? {
            riskLevel: "moderate",
            currentExposure: agg.financialExposure.medicaid,
            lookbackConcerns: 0,
            topStrategies: [],
          }
        : undefined,
    beneficiaryIssues: {
      conflictCount: agg.conflicts?.length || 0,
      missingCount: 0,
      outdatedCount: 0,
      topIssues: (agg.conflicts || []).slice(0, 3).map((c) => ({
        asset: c.source1,
        issue: c.issue,
      })),
    },
    familyProtection: {
      hasGuardian: false,
      hasPOAFinancial: false,
      hasPOAHealthcare: false,
      criticalGaps: [],
      minorChildrenIssues: [],
    },
    assetProtection: undefined,
    existingDocReview: undefined,
    topRecommendations: (agg.allRecommendations || []).slice(0, 10).map((r) => ({
      action: r.action,
      category: r.category,
      priority: (r.priority as "critical" | "high" | "medium" | "low") || "medium",
    })),
    summary: {
      totalCriticalIssues: agg.allMissingDocuments?.filter(
        (d) => d.priority === "critical"
      ).length || 0,
      totalHighIssues: agg.allMissingDocuments?.filter((d) => d.priority === "high")
        .length || 0,
      estimatedTotalExposure: agg.financialExposure?.total || 0,
      estimatedSavingsOpportunity: (agg.taxStrategies || []).reduce(
        (sum, s) => sum + (s.estimatedSavings?.high || 0),
        0
      ),
      immediateActionCount: agg.allRecommendations?.filter(
        (r) => r.priority === "critical"
      ).length || 0,
    },
  };
}

/**
 * Format summarized results as a concise string for prompts
 */
export function formatSummarizedPhase2ForPrompt(
  summarized: SummarizedPhase2Results
): string {
  const lines: string[] = [];

  lines.push("## Phase 2 Analysis Summary\n");

  // Summary stats
  lines.push("### Key Statistics");
  lines.push(`- Critical Issues: ${summarized.summary.totalCriticalIssues}`);
  lines.push(`- High Priority Issues: ${summarized.summary.totalHighIssues}`);
  lines.push(
    `- Total Tax Exposure: $${summarized.taxAnalysis.totalExposure.toLocaleString()}`
  );
  lines.push(
    `- Potential Savings: $${summarized.summary.estimatedSavingsOpportunity.toLocaleString()}`
  );
  lines.push(`- Immediate Actions Needed: ${summarized.summary.immediateActionCount}\n`);

  // Document issues
  if (summarized.documentIssues.topIssues.length > 0) {
    lines.push("### Document Compliance Issues");
    summarized.documentIssues.topIssues.forEach((i) => {
      lines.push(`- [${i.severity.toUpperCase()}] ${i.document}: ${i.issue}`);
    });
    lines.push("");
  }

  // Tax analysis
  lines.push("### Tax Analysis");
  lines.push(`- Federal Exposure: $${summarized.taxAnalysis.federalExposure.toLocaleString()}`);
  lines.push(`- State Exposure: $${summarized.taxAnalysis.stateExposure.toLocaleString()}`);
  if (summarized.taxAnalysis.sunsetImpact) {
    lines.push(
      `- 2026 Sunset Impact: +$${summarized.taxAnalysis.sunsetImpact.toLocaleString()}`
    );
  }
  if (summarized.taxAnalysis.topStrategies.length > 0) {
    lines.push("- Top Strategies:");
    summarized.taxAnalysis.topStrategies.forEach((s) => {
      lines.push(
        `  - ${s.name}: $${s.savings.low.toLocaleString()}-$${s.savings.high.toLocaleString()} savings (${s.timeline})`
      );
    });
  }
  lines.push("");

  // Medicaid risk
  if (summarized.medicaidRisk) {
    lines.push("### Medicaid Planning");
    lines.push(`- Risk Level: ${summarized.medicaidRisk.riskLevel}`);
    lines.push(
      `- Current Exposure: $${summarized.medicaidRisk.currentExposure.toLocaleString()}`
    );
    if (summarized.medicaidRisk.topStrategies.length > 0) {
      lines.push(`- Strategies: ${summarized.medicaidRisk.topStrategies.join(", ")}`);
    }
    lines.push("");
  }

  // Beneficiary issues
  if (
    summarized.beneficiaryIssues.conflictCount > 0 ||
    summarized.beneficiaryIssues.missingCount > 0
  ) {
    lines.push("### Beneficiary Coordination");
    lines.push(`- Conflicts: ${summarized.beneficiaryIssues.conflictCount}`);
    lines.push(`- Missing Designations: ${summarized.beneficiaryIssues.missingCount}`);
    lines.push(`- Outdated: ${summarized.beneficiaryIssues.outdatedCount}`);
    if (summarized.beneficiaryIssues.topIssues.length > 0) {
      lines.push("- Issues:");
      summarized.beneficiaryIssues.topIssues.forEach((i) => {
        lines.push(`  - ${i.asset}: ${i.issue}`);
      });
    }
    lines.push("");
  }

  // Family protection
  lines.push("### Family Protection Status");
  lines.push(`- Guardian Named: ${summarized.familyProtection.hasGuardian ? "Yes" : "No"}`);
  lines.push(
    `- Financial POA: ${summarized.familyProtection.hasPOAFinancial ? "Yes" : "No"}`
  );
  lines.push(
    `- Healthcare POA: ${summarized.familyProtection.hasPOAHealthcare ? "Yes" : "No"}`
  );
  if (summarized.familyProtection.criticalGaps.length > 0) {
    lines.push("- Critical Gaps:");
    summarized.familyProtection.criticalGaps.forEach((g) => {
      lines.push(`  - ${g}`);
    });
  }
  lines.push("");

  // Asset protection
  if (summarized.assetProtection) {
    lines.push("### Asset Protection");
    lines.push(
      `- Vulnerable Assets Value: $${summarized.assetProtection.totalVulnerableValue.toLocaleString()}`
    );
    lines.push(
      `- Business Succession Needed: ${summarized.assetProtection.businessSuccessionNeeded ? "Yes" : "No"}`
    );
    if (summarized.assetProtection.topVulnerabilities.length > 0) {
      lines.push("- Top Vulnerabilities:");
      summarized.assetProtection.topVulnerabilities.forEach((v) => {
        lines.push(`  - ${v.asset}: ${v.risk}`);
      });
    }
    lines.push("");
  }

  // Top recommendations
  if (summarized.topRecommendations.length > 0) {
    lines.push("### Top 10 Prioritized Recommendations");
    summarized.topRecommendations.forEach((r, i) => {
      const cost = r.estimatedCost
        ? ` ($${r.estimatedCost.low.toLocaleString()}-$${r.estimatedCost.high.toLocaleString()})`
        : "";
      lines.push(`${i + 1}. [${r.priority.toUpperCase()}] ${r.action} (${r.category})${cost}`);
    });
  }

  return lines.join("\n");
}
