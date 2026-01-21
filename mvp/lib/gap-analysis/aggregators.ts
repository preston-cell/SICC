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
 * Aggregate Phase 2 results from parallel runs
 */
export function aggregatePhase2Results(
  results: Map<string, unknown>
): AggregatedPhase2Results {
  const documentCompleteness = results.get("document_completeness") as DocumentCompletenessResult | undefined;
  const taxOptimization = results.get("tax_optimization") as TaxOptimizationResult | undefined;
  const medicaidPlanning = results.get("medicaid_planning") as MedicaidPlanningResult | undefined;
  const beneficiaryCoordination = results.get("beneficiary_coordination") as BeneficiaryCoordinationResult | undefined;
  const familyProtection = results.get("family_protection") as FamilyProtectionResult | undefined;
  const assetProtection = results.get("asset_protection") as AssetProtectionResult | undefined;
  const documentReview = results.get("existing_document_review") as ExistingDocumentReviewResult | undefined;

  // Aggregate all missing documents
  const allMissingDocuments = aggregateMissingDocuments(
    documentCompleteness,
    familyProtection,
    beneficiaryCoordination
  );

  // Aggregate all recommendations
  const allRecommendations = aggregateRecommendations(
    taxOptimization,
    medicaidPlanning,
    familyProtection,
    assetProtection,
    beneficiaryCoordination,
    documentReview
  );

  // Calculate financial exposure
  const financialExposure = calculateFinancialExposure(
    taxOptimization,
    medicaidPlanning
  );

  // Detect conflicts
  const conflicts = detectConflicts(results);

  // Calculate aggregate score
  const aggregateScore = calculateAggregateScore(
    documentCompleteness,
    taxOptimization,
    familyProtection,
    assetProtection
  );

  return {
    allMissingDocuments,
    allRecommendations,
    taxStrategies: taxOptimization?.strategies || [],
    financialExposure,
    conflicts,
    aggregateScore,
  };
}

function aggregateMissingDocuments(
  documentCompleteness?: DocumentCompletenessResult,
  familyProtection?: FamilyProtectionResult,
  beneficiaryCoordination?: BeneficiaryCoordinationResult
): AggregatedPhase2Results["allMissingDocuments"] {
  const documents: AggregatedPhase2Results["allMissingDocuments"] = [];
  const seen = new Set<string>();

  // From document completeness - missing provisions often indicate missing documents
  if (documentCompleteness?.missingProvisions) {
    for (const provision of documentCompleteness.missingProvisions) {
      const key = `provision:${provision.document}:${provision.provision}`;
      if (!seen.has(key)) {
        seen.add(key);
        documents.push({
          document: provision.provision,
          priority: provision.importance === "required" ? "critical" : "medium",
          source: "document_completeness",
          reason: provision.reason,
        });
      }
    }
  }

  // From family protection - gaps indicate missing documents
  if (familyProtection?.gaps) {
    for (const gap of familyProtection.gaps) {
      const key = `family:${gap}`;
      if (!seen.has(key)) {
        seen.add(key);
        documents.push({
          document: gap,
          priority: "high",
          source: "family_protection",
          reason: "Family protection gap",
        });
      }
    }
  }

  // From beneficiary coordination - missing designations
  if (beneficiaryCoordination?.missingDesignations) {
    for (const missing of beneficiaryCoordination.missingDesignations) {
      const key = `beneficiary:${missing.asset}`;
      if (!seen.has(key)) {
        seen.add(key);
        documents.push({
          document: `Beneficiary designation for ${missing.asset}`,
          priority: "high",
          source: "beneficiary_coordination",
          reason: missing.risk,
        });
      }
    }
  }

  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return documents.sort(
    (a, b) =>
      priorityOrder[a.priority as keyof typeof priorityOrder] -
      priorityOrder[b.priority as keyof typeof priorityOrder]
  );
}

function aggregateRecommendations(
  taxOptimization?: TaxOptimizationResult,
  medicaidPlanning?: MedicaidPlanningResult,
  familyProtection?: FamilyProtectionResult,
  assetProtection?: AssetProtectionResult,
  beneficiaryCoordination?: BeneficiaryCoordinationResult,
  documentReview?: ExistingDocumentReviewResult
): AggregatedPhase2Results["allRecommendations"] {
  const recommendations: AggregatedPhase2Results["allRecommendations"] = [];

  // Tax optimization strategies
  if (taxOptimization?.strategies) {
    for (const strategy of taxOptimization.strategies) {
      recommendations.push({
        action: strategy.name,
        category: "tax",
        source: "tax_optimization",
        priority: strategy.type === "conservative" ? "high" : "medium",
      });
    }
  }

  // Medicaid planning strategies
  if (medicaidPlanning?.strategies) {
    for (const strategy of medicaidPlanning.strategies) {
      recommendations.push({
        action: strategy.name,
        category: "medicaid",
        source: "medicaid_planning",
        priority: "medium",
      });
    }
  }

  // Family protection recommendations
  if (familyProtection?.recommendations) {
    for (const rec of familyProtection.recommendations) {
      recommendations.push({
        action: rec.action,
        category: "family",
        source: "family_protection",
        priority: rec.priority <= 2 ? "critical" : "high",
      });
    }
  }

  // Asset protection recommendations
  if (assetProtection?.recommendations) {
    for (const rec of assetProtection.recommendations) {
      recommendations.push({
        action: rec.strategy,
        category: "asset",
        source: "asset_protection",
        priority: rec.priority <= 2 ? "high" : "medium",
      });
    }
  }

  // Beneficiary coordination recommendations
  if (beneficiaryCoordination?.recommendations) {
    for (const rec of beneficiaryCoordination.recommendations) {
      recommendations.push({
        action: rec.action,
        category: "beneficiary",
        source: "beneficiary_coordination",
        priority: rec.priority <= 2 ? "critical" : "high",
      });
    }
  }

  // Document review recommendations
  if (documentReview?.recommendations) {
    for (const rec of documentReview.recommendations) {
      recommendations.push({
        action: rec.action,
        category: "document",
        source: "existing_document_review",
        priority: rec.priority <= 2 ? "high" : "medium",
      });
    }
  }

  return recommendations;
}

function calculateFinancialExposure(
  taxOptimization?: TaxOptimizationResult,
  medicaidPlanning?: MedicaidPlanningResult
): AggregatedPhase2Results["financialExposure"] {
  const probate = 0; // Would need estate value to calculate
  const estateTax = taxOptimization?.currentExposure?.combined || 0;
  const medicaid = medicaidPlanning?.currentExposure || 0;

  return {
    probate,
    estateTax,
    medicaid,
    total: probate + estateTax + medicaid,
  };
}

function detectConflicts(
  results: Map<string, unknown>
): AggregatedPhase2Results["conflicts"] {
  const conflicts: AggregatedPhase2Results["conflicts"] = [];

  const beneficiaryCoordination = results.get("beneficiary_coordination") as BeneficiaryCoordinationResult | undefined;

  // Beneficiary conflicts
  if (beneficiaryCoordination?.conflicts) {
    for (const conflict of beneficiaryCoordination.conflicts) {
      conflicts.push({
        source1: "beneficiary_coordination",
        source2: "document_inventory",
        issue: conflict.issue,
        resolution: conflict.resolution,
      });
    }
  }

  return conflicts;
}

function calculateAggregateScore(
  documentCompleteness?: DocumentCompletenessResult,
  taxOptimization?: TaxOptimizationResult,
  familyProtection?: FamilyProtectionResult,
  assetProtection?: AssetProtectionResult
): number {
  let score = 100;

  // Deduct for compliance issues
  if (documentCompleteness?.complianceIssues) {
    for (const issue of documentCompleteness.complianceIssues) {
      if (issue.severity === "critical") score -= 15;
      else if (issue.severity === "high") score -= 10;
      else score -= 5;
    }
  }

  // Deduct for tax exposure (relative to savings opportunity)
  if (taxOptimization) {
    const savingsOpportunity = taxOptimization.totalPotentialSavings || 0;
    if (savingsOpportunity > 500000) score -= 10;
    else if (savingsOpportunity > 100000) score -= 5;
  }

  // Deduct for family protection gaps
  if (familyProtection?.gaps) {
    score -= Math.min(familyProtection.gaps.length * 5, 20);
  }

  // Deduct for asset vulnerabilities
  if (assetProtection?.vulnerabilities) {
    score -= Math.min(assetProtection.vulnerabilities.length * 3, 15);
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Convert Phase 2 map to structured object
 */
export function structurePhase2Results(
  results: Map<string, unknown>
): Phase2Results {
  return {
    documentCompleteness: results.get("document_completeness") as DocumentCompletenessResult,
    taxOptimization: results.get("tax_optimization") as TaxOptimizationResult,
    medicaidPlanning: results.get("medicaid_planning") as MedicaidPlanningResult | undefined,
    beneficiaryCoordination: results.get("beneficiary_coordination") as BeneficiaryCoordinationResult,
    familyProtection: results.get("family_protection") as FamilyProtectionResult,
    assetProtection: results.get("asset_protection") as AssetProtectionResult | undefined,
    existingDocumentReview: results.get("existing_document_review") as ExistingDocumentReviewResult | undefined,
  };
}

/**
 * Merge Phase 1 results from sequential runs
 */
export function mergePhase1Results(
  results: Map<string, unknown>
): Phase1Results {
  return {
    stateResearch: results.get("state_law_research") as Phase1Results["stateResearch"],
    clientContext: results.get("client_context_analysis") as Phase1Results["clientContext"],
    documentInventory: results.get("document_inventory") as Phase1Results["documentInventory"],
  };
}

/**
 * Calculate final score from all phases
 */
export function calculateFinalScore(
  phase1: Phase1Results,
  phase2: Phase2Results | AggregatedPhase2Results,
  scenarioResults: unknown,
  priorityMatrix: unknown
): number {
  // Base score
  let score = 100;

  // Phase 1 deductions
  if (phase1.clientContext.riskProfile === "critical") score -= 20;
  else if (phase1.clientContext.riskProfile === "high") score -= 15;
  else if (phase1.clientContext.riskProfile === "moderate") score -= 10;

  // Document inventory deductions
  const missingCritical = phase1.documentInventory.missingEssential?.filter(
    (d) => d.priority === "critical"
  ).length || 0;
  score -= missingCritical * 10;

  // Phase 2 aggregate score (if available)
  if ("aggregateScore" in phase2) {
    // Blend with aggregate score
    score = Math.round(score * 0.4 + phase2.aggregateScore * 0.6);
  }

  return Math.max(0, Math.min(100, score));
}
