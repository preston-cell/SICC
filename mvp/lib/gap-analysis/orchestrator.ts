import { executeInE2B } from "../e2b-executor";
import {
  RunType,
  Phase1RunType,
  Phase2RunType,
  Phase3RunType,
  ParsedIntake,
  ClientContext,
  Phase1Results,
  BeneficiaryDesignation,
} from "./types";
import { RUN_CONFIGS, PHASE_CONFIGS, getApplicableRuns, RETRY_CONFIG } from "./config";
import { phase1Prompts } from "./prompts/phase1";
import { phase2Prompts } from "./prompts/phase2";
import { phase3Prompts } from "./prompts/phase3";
import {
  aggregatePhase2Results,
  mergePhase1Results,
  structurePhase2Results,
} from "./aggregators";

// Helper to normalize yes/no/true/false to boolean
function toBool(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const lower = value.toLowerCase();
    return lower === "yes" || lower === "true" || lower === "1";
  }
  return !!value;
}

/**
 * Parse intake data into structured format
 */
export function parseIntakeData(intakeData: {
  estatePlan: { stateOfResidence?: string };
  personal?: { data: string };
  family?: { data: string };
  assets?: { data: string };
  existingDocuments?: { data: string };
  goals?: { data: string };
  beneficiaryDesignations?: BeneficiaryDesignation[];
}): ParsedIntake {
  const state = intakeData.estatePlan?.stateOfResidence || "Unknown";
  let personal = {};
  let family = {};
  let assets = {};
  let existingDocs = {};
  let goals = {};

  try {
    if (intakeData.personal?.data) personal = JSON.parse(intakeData.personal.data);
    if (intakeData.family?.data) family = JSON.parse(intakeData.family.data);
    if (intakeData.assets?.data) assets = JSON.parse(intakeData.assets.data);
    if (intakeData.existingDocuments?.data) existingDocs = JSON.parse(intakeData.existingDocuments.data);
    if (intakeData.goals?.data) goals = JSON.parse(intakeData.goals.data);
  } catch (e) {
    console.error("Error parsing intake data:", e);
  }

  return {
    state,
    personal,
    family,
    assets,
    existingDocs,
    goals,
    beneficiaries: intakeData.beneficiaryDesignations || [],
  };
}

/**
 * Extract client context from parsed intake
 */
export function getClientContext(parsed: ParsedIntake): ClientContext {
  const existingDocs = parsed.existingDocs as Record<string, unknown>;
  const hasWill = toBool(existingDocs?.hasWill);
  const hasTrust = toBool(existingDocs?.hasTrust);
  const hasPOAFinancial = toBool(existingDocs?.hasPOAFinancial);
  const hasPOAHealthcare = toBool(existingDocs?.hasPOAHealthcare);
  const hasHealthcareDirective = toBool(existingDocs?.hasHealthcareDirective);

  const familyData = parsed.family as Record<string, unknown>;
  const children = (familyData?.children as Array<{ isMinor?: boolean }>) || [];
  const hasMinorChildren = children.some((c) => c.isMinor);
  const numberOfChildren = children.length;

  let estimatedValue = 0;
  const assetsData = parsed.assets as Record<string, unknown>;
  const rawValue = assetsData?.estimatedTotalValue || assetsData?.totalEstateValue;
  if (typeof rawValue === "number") {
    estimatedValue = rawValue;
  } else if (typeof rawValue === "string") {
    const valueMap: Record<string, number> = {
      under_100k: 50000,
      "100k_500k": 300000,
      "500k_1m": 750000,
      "1m_2m": 1500000,
      "2m_5m": 3500000,
      "5m_plus": 7500000,
    };
    estimatedValue = valueMap[rawValue] || parseInt(rawValue.replace(/[^0-9]/g, "")) || 0;
  }

  const personalData = parsed.personal as Record<string, unknown>;
  const isMarried = personalData?.maritalStatus === "married";
  const age = typeof personalData?.age === "number" ? personalData.age : 0;
  const spouseAge = typeof personalData?.spouseAge === "number" ? personalData.spouseAge : 0;

  const hasBusinessInterests = toBool(assetsData?.hasBusinessInterests) || toBool(assetsData?.ownsBusinessInterest);
  const hasRealEstate = toBool(assetsData?.hasRealEstate) || (assetsData?.realEstateProperties as unknown[])?.length > 0;
  const hasRetirementAccounts = toBool(assetsData?.hasRetirementAccounts) || (assetsData?.retirementAccounts as unknown[])?.length > 0;

  return {
    hasWill,
    hasTrust,
    hasPOAFinancial,
    hasPOAHealthcare,
    hasHealthcareDirective,
    hasMinorChildren,
    estimatedValue,
    isMarried,
    age,
    spouseAge,
    numberOfChildren,
    hasBusinessInterests,
    hasRealEstate,
    hasRetirementAccounts,
  };
}

/**
 * Build prompt for a specific run type
 */
export function buildPrompt(
  runType: RunType,
  parsed: ParsedIntake,
  clientContext: ClientContext,
  phase1Results?: Phase1Results,
  phase2Results?: Map<string, unknown>,
  scenarioResults?: unknown
): string {
  const config = RUN_CONFIGS[runType];

  switch (config.phase) {
    case 1:
      return buildPhase1Prompt(runType as Phase1RunType, parsed, clientContext);
    case 2:
      if (!phase1Results) throw new Error("Phase 1 results required for Phase 2");
      return buildPhase2Prompt(runType as Phase2RunType, phase1Results, clientContext, parsed);
    case 3:
      if (!phase1Results || !phase2Results)
        throw new Error("Phase 1 and 2 results required for Phase 3");
      const aggregated = aggregatePhase2Results(phase2Results);
      const structured = structurePhase2Results(phase2Results);
      return buildPhase3Prompt(
        runType as Phase3RunType,
        phase1Results,
        structured,
        aggregated,
        scenarioResults
      );
    default:
      throw new Error(`Unknown phase for run type: ${runType}`);
  }
}

function buildPhase1Prompt(
  runType: Phase1RunType,
  parsed: ParsedIntake,
  clientContext: ClientContext
): string {
  switch (runType) {
    case "state_law_research":
      return phase1Prompts.state_law_research(parsed.state);
    case "client_context_analysis":
      return phase1Prompts.client_context_analysis(parsed, clientContext);
    case "document_inventory":
      return phase1Prompts.document_inventory(parsed, clientContext);
  }
}

function buildPhase2Prompt(
  runType: Phase2RunType,
  phase1Results: Phase1Results,
  clientContext: ClientContext,
  parsed: ParsedIntake
): string {
  switch (runType) {
    case "document_completeness":
      return phase2Prompts.document_completeness(phase1Results, clientContext);
    case "tax_optimization":
      return phase2Prompts.tax_optimization(phase1Results, clientContext, parsed);
    case "medicaid_planning":
      return phase2Prompts.medicaid_planning(phase1Results, clientContext);
    case "beneficiary_coordination":
      return phase2Prompts.beneficiary_coordination(phase1Results, parsed);
    case "family_protection":
      return phase2Prompts.family_protection(phase1Results, clientContext, parsed);
    case "asset_protection":
      return phase2Prompts.asset_protection(phase1Results, clientContext, parsed);
    case "existing_document_review":
      return phase2Prompts.existing_document_review(phase1Results, clientContext);
  }
}

function buildPhase3Prompt(
  runType: Phase3RunType,
  phase1Results: Phase1Results,
  phase2Results: ReturnType<typeof structurePhase2Results>,
  aggregated: ReturnType<typeof aggregatePhase2Results>,
  scenarioResults?: unknown
): string {
  switch (runType) {
    case "scenario_modeling":
      return phase3Prompts.scenario_modeling(phase1Results, aggregated);
    case "priority_matrix":
      return phase3Prompts.priority_matrix(phase1Results, aggregated, scenarioResults);
    case "final_report":
      // Get priority matrix from scenario results context
      const priorityMatrix = scenarioResults;
      return phase3Prompts.final_report(phase1Results, aggregated, scenarioResults, priorityMatrix);
  }
}

/**
 * Execute a single run with retry logic
 */
export async function executeRunWithRetry(
  runType: RunType,
  prompt: string,
  maxRetries: number = RETRY_CONFIG.maxRetries
): Promise<{
  success: boolean;
  result: unknown;
  error?: string;
  metadata?: {
    numTurns?: number;
    durationMs?: number;
    totalCostUsd?: number;
  };
}> {
  const config = RUN_CONFIGS[runType];
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await executeInE2B({
        prompt,
        outputFile: config.outputFile,
        maxTurns: config.maxTurns,
        enableWebSearch: config.enableWebSearch,
        runType,
        timeoutMs: 0, // Use max timeout - quality is the priority
      });

      if (!result.success) {
        throw new Error(result.error || "E2B execution failed");
      }

      // Parse the result
      let parsedResult: unknown;
      if (result.fileContent) {
        try {
          parsedResult = JSON.parse(result.fileContent);
        } catch {
          // Try to extract JSON from stdout
          parsedResult = extractJSON(result.stdout || "");
        }
      } else {
        parsedResult = extractJSON(result.stdout || "");
      }

      // Treat empty/null results as failures
      if (!parsedResult || (typeof parsedResult === 'object' && Object.keys(parsedResult as object).length === 0)) {
        throw new Error("No valid result generated - output file was empty or not created");
      }

      // Log success with details
      console.log(`[GAP-ANALYSIS] Run ${runType} SUCCEEDED:`, {
        runType,
        attempt: attempt + 1,
        metadata: result.metadata,
        resultKeys: typeof parsedResult === 'object' ? Object.keys(parsedResult as object) : [],
      });

      return {
        success: true,
        result: parsedResult,
        metadata: result.metadata,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`[GAP-ANALYSIS] Run ${runType} attempt ${attempt + 1}/${maxRetries + 1} FAILED:`, {
        error: lastError.message,
        runType,
        attempt: attempt + 1,
        maxRetries: maxRetries + 1,
        config: {
          maxTurns: config.maxTurns,
          outputFile: config.outputFile,
        },
      });

      if (attempt < maxRetries) {
        // Exponential backoff
        const delay = Math.min(
          RETRY_CONFIG.baseDelayMs * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt),
          RETRY_CONFIG.maxDelayMs
        );
        console.log(`[GAP-ANALYSIS] Retrying ${runType} in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // Log final failure with details
  console.error(`[GAP-ANALYSIS] Run ${runType} FAILED after all retries:`, {
    runType,
    totalAttempts: maxRetries + 1,
    lastError: lastError?.message,
    usingFallback: true,
  });

  // Return failure with fallback result
  return {
    success: false,
    result: createFallbackResult(runType),
    error: lastError?.message || "Unknown error",
  };
}

/**
 * Extract JSON from text output
 * Handles Claude Code CLI's output format where the actual result is in the "result" field
 */
function extractJSON(text: string): unknown {
  // First, try to parse Claude Code CLI's JSON output format
  // Claude Code with --output-format json returns: { "type": "result", "is_error": boolean, "result": "...", ... }
  try {
    const claudeOutputMatch = text.match(/\{"type"[\s\S]*?"is_error"[\s\S]*?"result"[\s\S]*?\}/);
    if (claudeOutputMatch) {
      const claudeOutput = JSON.parse(claudeOutputMatch[0]);

      // Check if Claude Code reported an error
      if (claudeOutput.is_error) {
        console.error("[extractJSON] Claude Code returned error:", claudeOutput.result);
        return null;
      }

      // The actual content is in the "result" field
      const resultContent = claudeOutput.result;
      if (typeof resultContent === "string" && resultContent.trim()) {
        // Try to extract JSON from Claude's result text
        const extracted = extractJSONFromText(resultContent);
        if (extracted) {
          return extracted;
        }
      }
    }
  } catch (e) {
    // Not Claude Code format, continue with other methods
  }

  // Fall back to extracting JSON directly from text
  return extractJSONFromText(text);
}

/**
 * Extract JSON from raw text (markdown blocks or raw JSON)
 */
function extractJSONFromText(text: string): unknown {
  // Try to find JSON in markdown code block
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch {
      // Continue to other methods
    }
  }

  // Try to find raw JSON object (but not Claude Code metadata)
  // Look for objects that don't start with "type":"result" (Claude Code's format)
  const allJsonMatches = text.matchAll(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
  for (const match of allJsonMatches) {
    try {
      const parsed = JSON.parse(match[0]);
      // Skip Claude Code's metadata objects
      if (parsed.type === "result" && "is_error" in parsed) {
        continue;
      }
      // Found a valid non-metadata JSON object
      return parsed;
    } catch {
      // Try next match
    }
  }

  // Last resort: try to find any JSON object and repair if truncated
  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    try {
      return JSON.parse(objectMatch[0]);
    } catch {
      return repairTruncatedJSON(objectMatch[0]);
    }
  }

  return null;
}

/**
 * Attempt to repair truncated JSON
 */
function repairTruncatedJSON(text: string): unknown {
  let repaired = text;

  // Count open/close braces and brackets
  const openBraces = (repaired.match(/\{/g) || []).length;
  const closeBraces = (repaired.match(/\}/g) || []).length;
  const openBrackets = (repaired.match(/\[/g) || []).length;
  const closeBrackets = (repaired.match(/\]/g) || []).length;

  // Add missing closing brackets
  for (let i = 0; i < openBrackets - closeBrackets; i++) {
    repaired += "]";
  }

  // Add missing closing braces
  for (let i = 0; i < openBraces - closeBraces; i++) {
    repaired += "}";
  }

  try {
    return JSON.parse(repaired);
  } catch {
    return null;
  }
}

/**
 * Create fallback result for failed runs
 */
function createFallbackResult(runType: RunType): Record<string, unknown> {
  const config = RUN_CONFIGS[runType];

  // Return minimal structure based on run type
  const fallbacks: Record<RunType, Record<string, unknown>> = {
    state_law_research: {
      state: "Unknown",
      estateTax: { threshold: 0, rates: [], hasCliffEffect: false },
      error: "Analysis failed - using defaults",
    },
    client_context_analysis: {
      uniqueFactors: [],
      worstCaseScenarios: [],
      immediateRedFlags: [],
      deeperInsights: [],
      keyInsight: "Analysis incomplete",
      riskProfile: "unknown",
      complexityScore: 0,
    },
    document_inventory: {
      existingDocuments: [],
      missingEssential: [],
      outdated: [],
      goalAlignment: {},
      coordinationIssues: [],
    },
    document_completeness: {
      complianceIssues: [],
      executionDefects: [],
      missingProvisions: [],
      stateSpecificGaps: [],
      estimatedComplianceCost: { low: 0, high: 0 },
    },
    tax_optimization: {
      currentExposure: { federal: 0, state: 0, combined: 0 },
      strategies: [],
      sunsetAnalysis: { currentExemption: 0, projectedExemption2026: 0, additionalExposure: 0, urgentActions: [] },
      totalPotentialSavings: { low: 0, high: 0 },
    },
    medicaid_planning: {
      riskAssessment: { likelihood: "unknown", timeframe: "", factors: [] },
      currentExposure: 0,
      lookbackConcerns: [],
      strategies: [],
      spousalProtection: {},
      assetProtectionOptions: [],
    },
    beneficiary_coordination: {
      conflicts: [],
      missingDesignations: [],
      outdatedDesignations: [],
      coordinationIssues: [],
      recommendations: [],
    },
    family_protection: {
      minorChildrenProtection: { guardianNamed: false, trustForMinors: false, ageOfDistribution: 0, gaps: [] },
      specialNeedsPlanning: { applicable: false, sntInPlace: false, recommendations: [] },
      blendedFamilyIssues: [],
      incapacityProtection: { poaFinancial: false, poaHealthcare: false, gaps: [] },
      gaps: [],
      recommendations: [],
    },
    asset_protection: {
      vulnerabilities: [],
      protectionStrategies: [],
      trustOptions: [],
      businessSuccession: { applicable: false, currentPlan: "", gaps: [], recommendations: [] },
      recommendations: [],
    },
    existing_document_review: {
      documentIssues: [],
      outdatedProvisions: [],
      ambiguousLanguage: [],
      missingClauses: [],
      recommendations: [],
    },
    scenario_modeling: {
      scenarios: [],
      crossScenarioInsights: [],
      mostCriticalScenario: null,
      overallPreparedness: { score: 0, grade: "F", summary: "Analysis incomplete" },
    },
    priority_matrix: {
      priorityMatrix: [],
      quickWins: [],
      criticalPath: [],
      budgetTiers: { essential: { totalCost: { low: 0, high: 0 }, actions: [] } },
      timeline: { immediate: [], "30days": [], "90days": [], "12months": [] },
    },
    final_report: {
      score: 0,
      overallScore: { score: 0, grade: "F", summary: "Analysis incomplete" },
      executiveSummary: { oneLineInsight: "Analysis failed", criticalIssues: [], immediateActions: [], opportunities: [] },
      missingDocuments: [],
      outdatedDocuments: [],
      inconsistencies: [],
      financialExposure: { probate: 0, estateTax: 0, total: 0 },
      taxStrategies: [],
      stateSpecificNotes: [],
      recommendations: [],
      scenarioAnalysis: [],
      priorityMatrix: [],
      uncertaintyLog: { assumptions: [], limitations: ["Analysis incomplete"], needsVerification: [] },
      targetStateSummary: { currentState: "Unknown", targetState: "Unknown", gapCount: 0, estimatedCostToClose: { low: 0, high: 0 }, estimatedTimeline: "Unknown" },
    },
  };

  return fallbacks[runType] || { error: "Unknown run type" };
}

/**
 * Execute Phase 1 (sequential)
 */
export async function executePhase1(
  parsed: ParsedIntake,
  clientContext: ClientContext,
  onProgress?: (runType: RunType, status: "running" | "completed" | "failed") => void
): Promise<{
  results: Phase1Results;
  metadata: { totalDurationMs: number; totalCostUsd: number };
}> {
  const runs = getApplicableRuns(1, clientContext, parsed);
  const results = new Map<string, unknown>();
  let totalDurationMs = 0;
  let totalCostUsd = 0;

  for (const runType of runs) {
    onProgress?.(runType, "running");

    const prompt = buildPrompt(runType, parsed, clientContext);
    const result = await executeRunWithRetry(runType, prompt);

    if (result.success) {
      results.set(runType, result.result);
      totalDurationMs += result.metadata?.durationMs || 0;
      totalCostUsd += result.metadata?.totalCostUsd || 0;
      onProgress?.(runType, "completed");
    } else {
      results.set(runType, result.result); // Use fallback
      onProgress?.(runType, "failed");
    }
  }

  return {
    results: mergePhase1Results(results),
    metadata: { totalDurationMs, totalCostUsd },
  };
}

/**
 * Execute Phase 2 (parallel)
 */
export async function executePhase2(
  parsed: ParsedIntake,
  clientContext: ClientContext,
  phase1Results: Phase1Results,
  onProgress?: (runType: RunType, status: "running" | "completed" | "failed") => void
): Promise<{
  results: Map<string, unknown>;
  metadata: { totalDurationMs: number; totalCostUsd: number };
}> {
  const runs = getApplicableRuns(2, clientContext, parsed);
  const results = new Map<string, unknown>();
  let totalDurationMs = 0;
  let totalCostUsd = 0;

  // Mark all as running
  for (const runType of runs) {
    onProgress?.(runType, "running");
  }

  // Execute in parallel
  const promises = runs.map(async (runType) => {
    const prompt = buildPrompt(runType, parsed, clientContext, phase1Results);
    const result = await executeRunWithRetry(runType, prompt);
    return { runType, result };
  });

  const settled = await Promise.allSettled(promises);

  for (const outcome of settled) {
    if (outcome.status === "fulfilled") {
      const { runType, result } = outcome.value;
      results.set(runType, result.result);
      totalDurationMs = Math.max(totalDurationMs, result.metadata?.durationMs || 0);
      totalCostUsd += result.metadata?.totalCostUsd || 0;
      onProgress?.(runType, result.success ? "completed" : "failed");
    }
  }

  return {
    results,
    metadata: { totalDurationMs, totalCostUsd },
  };
}

/**
 * Execute Phase 3 (sequential)
 */
export async function executePhase3(
  parsed: ParsedIntake,
  clientContext: ClientContext,
  phase1Results: Phase1Results,
  phase2Results: Map<string, unknown>,
  onProgress?: (runType: RunType, status: "running" | "completed" | "failed") => void
): Promise<{
  results: Map<string, unknown>;
  metadata: { totalDurationMs: number; totalCostUsd: number };
}> {
  const runs = getApplicableRuns(3, clientContext, parsed);
  const results = new Map<string, unknown>();
  let totalDurationMs = 0;
  let totalCostUsd = 0;
  let scenarioResults: unknown;

  for (const runType of runs) {
    onProgress?.(runType, "running");

    const prompt = buildPrompt(
      runType,
      parsed,
      clientContext,
      phase1Results,
      phase2Results,
      runType === "priority_matrix" || runType === "final_report" ? scenarioResults : undefined
    );

    const result = await executeRunWithRetry(runType, prompt);

    if (result.success) {
      results.set(runType, result.result);
      totalDurationMs += result.metadata?.durationMs || 0;
      totalCostUsd += result.metadata?.totalCostUsd || 0;
      onProgress?.(runType, "completed");

      // Store scenario results for next runs
      if (runType === "scenario_modeling") {
        scenarioResults = result.result;
      }
    } else {
      results.set(runType, result.result);
      onProgress?.(runType, "failed");
    }
  }

  return {
    results,
    metadata: { totalDurationMs, totalCostUsd },
  };
}
