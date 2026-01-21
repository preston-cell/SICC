import { Id } from "../../convex/_generated/dataModel";

// Run type identifiers
export type Phase1RunType =
  | "state_law_research"
  | "client_context_analysis"
  | "document_inventory";

export type Phase2RunType =
  | "document_completeness"
  | "tax_optimization"
  | "medicaid_planning"
  | "beneficiary_coordination"
  | "family_protection"
  | "asset_protection"
  | "existing_document_review";

export type Phase3RunType =
  | "scenario_modeling"
  | "priority_matrix"
  | "final_report";

export type RunType = Phase1RunType | Phase2RunType | Phase3RunType;

// Run configuration
export interface RunConfig {
  runType: RunType;
  phase: 1 | 2 | 3;
  maxTurns: number;
  enableWebSearch: boolean;
  critical: boolean;
  estimatedDurationMs: number;
  outputFile: string;
}

// Run status
export type RunStatus = "pending" | "running" | "completed" | "failed";
export type PhaseStatus = "pending" | "running" | "completed" | "failed";
export type OverallStatus =
  | "pending"
  | "phase1_running"
  | "phase1_complete"
  | "phase2_running"
  | "phase2_complete"
  | "phase3_running"
  | "completed"
  | "failed"
  | "partial";

// Phase types
export type PhaseType = "research" | "analysis" | "synthesis";

// Parsed intake data
export interface ParsedIntake {
  state: string;
  personal: Record<string, unknown>;
  family: Record<string, unknown>;
  assets: Record<string, unknown>;
  existingDocs: Record<string, unknown>;
  goals: Record<string, unknown>;
  beneficiaries: BeneficiaryDesignation[];
}

export interface BeneficiaryDesignation {
  assetType: string;
  assetName: string;
  institution?: string;
  estimatedValue?: string;
  primaryBeneficiaryName: string;
  primaryBeneficiaryRelationship?: string;
  primaryBeneficiaryPercentage?: number;
  contingentBeneficiaryName?: string;
  contingentBeneficiaryRelationship?: string;
  contingentBeneficiaryPercentage?: number;
  lastReviewedDate?: string;
  notes?: string;
}

// Client context derived from intake
export interface ClientContext {
  hasWill: boolean;
  hasTrust: boolean;
  hasPOAFinancial: boolean;
  hasPOAHealthcare: boolean;
  hasHealthcareDirective: boolean;
  hasMinorChildren: boolean;
  estimatedValue: number;
  isMarried: boolean;
  age: number;
  spouseAge: number;
  numberOfChildren: number;
  hasBusinessInterests: boolean;
  hasRealEstate: boolean;
  hasRetirementAccounts: boolean;
}

// Phase 1 Results
export interface StateResearchResult {
  state: string;
  estateTax: {
    threshold: number;
    rates: Array<{ bracket: string; rate: number }>;
    hasCliffEffect: boolean;
  };
  inheritanceTax: {
    exists: boolean;
    rates: Array<{ relationship: string; rate: number }>;
    exemptions: string[];
  };
  medicaid: {
    assetLimit: number;
    lookbackMonths: number;
    csra: number;
  };
  willRequirements: {
    witnesses: number;
    notarization: string;
    selfProving: boolean;
  };
  trustRequirements: Record<string, unknown>;
  poaRequirements: Record<string, unknown>;
  recentChanges: Array<{ date: string; description: string }>;
  sources: Array<{ url: string; accessed: string }>;
}

export interface ClientContextResult {
  uniqueFactors: string[];
  worstCaseScenarios: Array<{
    scenario: string;
    currentOutcome: string;
    financialImpact: number;
  }>;
  immediateRedFlags: string[];
  deeperInsights: string[];
  keyInsight: string;
  riskProfile: "low" | "moderate" | "high" | "critical";
  complexityScore: number;
}

export interface DocumentInventoryResult {
  existingDocuments: Array<{
    type: string;
    date?: string;
    provisions?: string[];
    status: string;
  }>;
  missingEssential: Array<{
    document: string;
    priority: "critical" | "high" | "medium" | "low";
    reason: string;
  }>;
  outdated: Array<{
    document: string;
    age: number;
    issues: string[];
  }>;
  goalAlignment: Record<string, string>;
  coordinationIssues: string[];
}

export interface Phase1Results {
  stateResearch: StateResearchResult;
  clientContext: ClientContextResult;
  documentInventory: DocumentInventoryResult;
}

// Phase 2 Results
export interface DocumentCompletenessResult {
  complianceIssues: Array<{
    document: string;
    issue: string;
    severity: string;
    fix: string;
  }>;
  executionDefects: string[];
  missingProvisions: Array<{
    document: string;
    provision: string;
    importance: "required" | "recommended" | "optional";
    reason: string;
  }>;
  stateSpecificGaps: string[];
  estimatedComplianceCost: { low: number; high: number };
}

export interface TaxOptimizationResult {
  currentExposure: { federal: number; state: number; combined: number };
  strategies: Array<{
    name: string;
    type: "conservative" | "moderate" | "advanced";
    estimatedSavings: { low: number; high: number };
    implementationCost: { low: number; high: number };
    timeline: string;
    prerequisites: string[];
    risks: string[];
  }>;
  sunsetAnalysis: {
    currentExemption: number;
    projectedExemption: number;
    additionalExposure: number;
    recommendations: string[];
  };
  totalPotentialSavings: number;
}

export interface MedicaidPlanningResult {
  riskAssessment: {
    likelihood: string;
    timeframe: string;
    factors: string[];
  };
  currentExposure: number;
  lookbackConcerns: string[];
  strategies: Array<{
    name: string;
    description: string;
    timeline: string;
    savings: number;
  }>;
  spousalProtection: Record<string, unknown>;
  assetProtectionOptions: string[];
}

export interface BeneficiaryCoordinationResult {
  conflicts: Array<{
    asset1: string;
    asset2: string;
    issue: string;
    resolution: string;
  }>;
  missingDesignations: Array<{
    asset: string;
    currentStatus: string;
    risk: string;
    recommendation: string;
  }>;
  outdatedDesignations: Array<{
    asset: string;
    currentBeneficiary: string;
    issue: string;
  }>;
  coordinationIssues: string[];
  recommendations: Array<{
    priority: number;
    action: string;
    reason: string;
  }>;
}

export interface FamilyProtectionResult {
  minorChildrenProtection: {
    guardianNamed: boolean;
    trustForMinors: boolean;
    ageOfDistribution: number;
    gaps: string[];
  };
  specialNeedsPlanning: {
    applicable: boolean;
    sntInPlace: boolean;
    recommendations: string[];
  };
  blendedFamilyIssues: string[];
  incapacityProtection: {
    poaFinancial: boolean;
    poaHealthcare: boolean;
    gaps: string[];
  };
  gaps: string[];
  recommendations: Array<{
    priority: number;
    action: string;
    protects: string[];
    cost: { low: number; high: number };
  }>;
}

export interface AssetProtectionResult {
  vulnerabilities: Array<{
    asset: string;
    risk: string;
    exposure: number;
  }>;
  protectionStrategies: Array<{
    strategy: string;
    applicableAssets: string[];
    protection: string;
    cost: { low: number; high: number };
  }>;
  trustOptions: string[];
  businessSuccession: {
    applicable: boolean;
    currentPlan: string;
    gaps: string[];
    recommendations: string[];
  };
  recommendations: Array<{
    priority: number;
    strategy: string;
    protects: number;
    cost: { low: number; high: number };
  }>;
}

export interface ExistingDocumentReviewResult {
  documentIssues: Array<{
    document: string;
    issue: string;
    severity: string;
  }>;
  outdatedProvisions: string[];
  ambiguousLanguage: string[];
  missingClauses: string[];
  recommendations: Array<{
    priority: number;
    document: string;
    action: string;
    reason: string;
  }>;
}

export interface Phase2Results {
  documentCompleteness: DocumentCompletenessResult;
  taxOptimization: TaxOptimizationResult;
  medicaidPlanning?: MedicaidPlanningResult;
  beneficiaryCoordination: BeneficiaryCoordinationResult;
  familyProtection: FamilyProtectionResult;
  assetProtection?: AssetProtectionResult;
  existingDocumentReview?: ExistingDocumentReviewResult;
}

// Phase 3 Results
export interface ScenarioModelingResult {
  scenarios: Array<{
    name: string;
    description: string;
    currentOutcome: string;
    desiredOutcome: string;
    gaps: string[];
    financialImpact: number;
    likelihood: "low" | "medium" | "high";
    fixes: string[];
  }>;
}

export interface PriorityMatrixResult {
  priorityMatrix: Array<{
    rank: number;
    action: string;
    category: string;
    impact: "critical" | "high" | "medium" | "low";
    urgency: "immediate" | "30-days" | "90-days" | "12-months";
    estimatedCost: { low: number; high: number };
    complexity: "simple" | "moderate" | "complex";
    professionalNeeded: string;
    dependencies: string[];
    riskOfDelay: string;
  }>;
  quickWins: string[];
  criticalPath: string[];
}

export interface FinalReportResult {
  score: number;
  overallScore: {
    score: number;
    grade: string;
    summary: string;
  };
  executiveSummary: {
    oneLineInsight: string;
    criticalIssues: string[];
    immediateActions: string[];
    opportunities: string[];
  };
  preAnalysisInsights: Record<string, unknown>;
  missingDocuments: Array<{
    document: string;
    priority: string;
    reason: string;
    consequences: string[];
    stateRequirements?: string;
  }>;
  outdatedDocuments: Array<{
    document: string;
    issue: string;
    risk: string;
    recommendation: string;
  }>;
  inconsistencies: Array<{
    type: string;
    severity: string;
    issue: string;
    resolution: string;
  }>;
  financialExposure: {
    probate: number;
    estateTax: number;
    total: number;
  };
  taxStrategies: Array<{
    strategy: string;
    estimatedSavings: number;
    complexity: string;
  }>;
  medicaidPlanning: Record<string, unknown>;
  stateSpecificNotes: Array<{
    topic: string;
    rule: string;
    impact: string;
    action: string;
    citation?: string;
  }>;
  recommendations: Array<{
    rank: number;
    action: string;
    category: string;
    timeline: string;
    cost: { low: number; high: number };
    steps: string[];
  }>;
  scenarioAnalysis: ScenarioModelingResult["scenarios"];
  priorityMatrix: PriorityMatrixResult["priorityMatrix"];
  uncertaintyLog: {
    assumptions: string[];
    limitations: string[];
    needsVerification: string[];
  };
  targetStateSummary: {
    currentState: string;
    targetState: string;
    gapCount: number;
    estimatedCost: { low: number; high: number };
    timeline: string;
  };
}

export interface Phase3Results {
  scenarioModeling: ScenarioModelingResult;
  priorityMatrix: PriorityMatrixResult;
  finalReport: FinalReportResult;
}

// Orchestration types
export interface OrchestrationRequest {
  estatePlanId: Id<"estatePlans">;
  intakeData: {
    estatePlan: { stateOfResidence?: string };
    personal?: { data: string };
    family?: { data: string };
    assets?: { data: string };
    existingDocuments?: { data: string };
    goals?: { data: string };
    beneficiaryDesignations?: BeneficiaryDesignation[];
  };
}

export interface OrchestrationResponse {
  runId: Id<"gapAnalysisRuns">;
  status: OverallStatus;
}

export interface SingleRunRequest {
  runId: Id<"gapAnalysisRuns">;
  phaseId: Id<"gapAnalysisPhases">;
  runType: RunType;
  prompt: string;
  maxTurns: number;
  enableWebSearch?: boolean;
  context?: Record<string, unknown>;
}

export interface SingleRunResponse {
  success: boolean;
  result: unknown;
  error?: string;
  metadata?: {
    numTurns?: number;
    durationMs?: number;
    totalCostUsd?: number;
  };
}

// Aggregated results
export interface AggregatedPhase2Results {
  allMissingDocuments: Array<{
    document: string;
    priority: string;
    source: string;
    reason: string;
  }>;
  allRecommendations: Array<{
    action: string;
    category: string;
    source: string;
    priority: string;
  }>;
  taxStrategies: TaxOptimizationResult["strategies"];
  financialExposure: {
    probate: number;
    estateTax: number;
    medicaid: number;
    total: number;
  };
  conflicts: Array<{
    source1: string;
    source2: string;
    issue: string;
    resolution: string;
  }>;
  aggregateScore: number;
}

// Progress tracking
export interface RunProgress {
  runId: Id<"gapAnalysisRuns">;
  status: OverallStatus;
  overallProgress: number;
  currentPhase?: number;
  phases: Array<{
    phaseNumber: number;
    phaseType: PhaseType;
    status: PhaseStatus;
    totalRuns: number;
    completedRuns: number;
    failedRuns: number;
  }>;
  currentRun?: {
    runType: RunType;
    status: RunStatus;
  };
  startedAt: number;
  estimatedCompletionMs?: number;
}
