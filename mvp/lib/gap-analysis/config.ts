import { RunConfig, RunType, ClientContext, ParsedIntake } from "./types";

// Run type configurations
// Note: maxTurns increased significantly to allow Claude Code enough turns for:
// - Reading and understanding complex input data
// - Performing thorough analysis
// - Structuring output as JSON
// - Using the Write tool to create output files
export const RUN_CONFIGS: Record<RunType, RunConfig> = {
  // Phase 1 - Research (Sequential)
  state_law_research: {
    runType: "state_law_research",
    phase: 1,
    maxTurns: 20,  // Increased from 8 - needs to research and write file
    enableWebSearch: false, // Web search not available in E2B sandbox
    critical: true,
    estimatedDurationMs: 300000, // 5 minutes
    outputFile: "state_research.json",
  },
  client_context_analysis: {
    runType: "client_context_analysis",
    phase: 1,
    maxTurns: 20,  // Increased from 5 - complex analysis
    enableWebSearch: false,
    critical: true,
    estimatedDurationMs: 300000, // 5 minutes
    outputFile: "client_context.json",
  },
  document_inventory: {
    runType: "document_inventory",
    phase: 1,
    maxTurns: 20,  // Increased from 4 - needs thorough inventory
    enableWebSearch: false,
    critical: true,
    estimatedDurationMs: 300000, // 5 minutes
    outputFile: "document_inventory.json",
  },

  // Phase 2 - Analysis (Parallel)
  document_completeness: {
    runType: "document_completeness",
    phase: 2,
    maxTurns: 25,  // Increased from 5 - detailed compliance analysis
    enableWebSearch: false,
    critical: true,
    estimatedDurationMs: 360000, // 6 minutes
    outputFile: "document_completeness.json",
  },
  tax_optimization: {
    runType: "tax_optimization",
    phase: 2,
    maxTurns: 30,  // Increased from 6 - complex tax strategy analysis
    enableWebSearch: false,
    critical: true,
    estimatedDurationMs: 420000, // 7 minutes
    outputFile: "tax_optimization.json",
  },
  medicaid_planning: {
    runType: "medicaid_planning",
    phase: 2,
    maxTurns: 25,  // Increased from 5 - detailed planning
    enableWebSearch: false,
    critical: false, // Skip if client is young with low assets
    estimatedDurationMs: 360000, // 6 minutes
    outputFile: "medicaid_planning.json",
  },
  beneficiary_coordination: {
    runType: "beneficiary_coordination",
    phase: 2,
    maxTurns: 25,  // Increased from 4 - conflict detection
    enableWebSearch: false,
    critical: true,
    estimatedDurationMs: 360000, // 6 minutes
    outputFile: "beneficiary_coordination.json",
  },
  family_protection: {
    runType: "family_protection",
    phase: 2,
    maxTurns: 25,  // Increased from 5 - comprehensive family analysis
    enableWebSearch: false,
    critical: true,
    estimatedDurationMs: 360000, // 6 minutes
    outputFile: "family_protection.json",
  },
  asset_protection: {
    runType: "asset_protection",
    phase: 2,
    maxTurns: 25,  // Increased from 5 - vulnerability assessment
    enableWebSearch: false,
    critical: false,
    estimatedDurationMs: 360000, // 6 minutes
    outputFile: "asset_protection.json",
  },
  existing_document_review: {
    runType: "existing_document_review",
    phase: 2,
    maxTurns: 25,  // Increased from 5 - thorough document review
    enableWebSearch: false,
    critical: false, // Only if documents uploaded
    estimatedDurationMs: 360000, // 6 minutes
    outputFile: "document_review.json",
  },

  // Phase 3 - Synthesis (Sequential)
  scenario_modeling: {
    runType: "scenario_modeling",
    phase: 3,
    maxTurns: 35,  // Increased from 6 - models 8 detailed scenarios
    enableWebSearch: false,
    critical: true,
    estimatedDurationMs: 480000, // 8 minutes
    outputFile: "scenario_modeling.json",
  },
  priority_matrix: {
    runType: "priority_matrix",
    phase: 3,
    maxTurns: 30,  // Increased from 5 - complex prioritization
    enableWebSearch: false,
    critical: true,
    estimatedDurationMs: 420000, // 7 minutes
    outputFile: "priority_matrix.json",
  },
  final_report: {
    runType: "final_report",
    phase: 3,
    maxTurns: 40,  // Increased from 7 - comprehensive synthesis
    enableWebSearch: false,
    critical: true,
    estimatedDurationMs: 600000, // 10 minutes
    outputFile: "final_analysis.json",
  },
};

// Phase configurations
export const PHASE_CONFIGS = {
  1: {
    name: "Research & Context",
    type: "research" as const,
    runs: ["state_law_research", "client_context_analysis", "document_inventory"] as RunType[],
    sequential: true,
    progressRange: [0, 30] as [number, number],
  },
  2: {
    name: "Deep Analysis",
    type: "analysis" as const,
    runs: [
      "document_completeness",
      "tax_optimization",
      "medicaid_planning",
      "beneficiary_coordination",
      "family_protection",
      "asset_protection",
      "existing_document_review",
    ] as RunType[],
    sequential: false, // Parallel execution
    progressRange: [30, 70] as [number, number],
  },
  3: {
    name: "Synthesis",
    type: "synthesis" as const,
    runs: ["scenario_modeling", "priority_matrix", "final_report"] as RunType[],
    sequential: true,
    progressRange: [70, 100] as [number, number],
  },
};

// Determine which runs to skip based on client context
export function getApplicableRuns(
  phase: 1 | 2 | 3,
  clientContext: ClientContext,
  parsed: ParsedIntake
): RunType[] {
  const phaseConfig = PHASE_CONFIGS[phase];
  const runs = phaseConfig.runs;

  if (phase !== 2) {
    return runs;
  }

  // Phase 2: Filter based on client context
  return runs.filter((runType) => {
    const config = RUN_CONFIGS[runType];

    switch (runType) {
      case "medicaid_planning":
        // Skip if client is young (under 50) with modest assets
        if (clientContext.age < 50 && clientContext.estimatedValue < 2000000) {
          return false;
        }
        return true;

      case "asset_protection":
        // Skip if no significant assets to protect
        if (
          clientContext.estimatedValue < 500000 &&
          !clientContext.hasBusinessInterests
        ) {
          return false;
        }
        return true;

      case "existing_document_review":
        // Skip if no existing documents
        const hasAnyDocs =
          clientContext.hasWill ||
          clientContext.hasTrust ||
          clientContext.hasPOAFinancial ||
          clientContext.hasPOAHealthcare ||
          clientContext.hasHealthcareDirective;
        return hasAnyDocs;

      default:
        return true;
    }
  });
}

// Calculate progress within a phase
export function calculatePhaseProgress(
  phase: 1 | 2 | 3,
  completedRuns: number,
  totalRuns: number
): number {
  const [min, max] = PHASE_CONFIGS[phase].progressRange;
  const phaseProgress = totalRuns > 0 ? completedRuns / totalRuns : 0;
  return Math.round(min + phaseProgress * (max - min));
}

// Estimate total duration
export function estimateTotalDuration(
  applicableRuns: Record<1 | 2 | 3, RunType[]>
): number {
  let total = 0;

  // Phase 1: Sequential
  for (const runType of applicableRuns[1]) {
    total += RUN_CONFIGS[runType].estimatedDurationMs;
  }

  // Phase 2: Parallel - use max duration
  const phase2Durations = applicableRuns[2].map(
    (rt) => RUN_CONFIGS[rt].estimatedDurationMs
  );
  total += Math.max(...phase2Durations, 0);

  // Phase 3: Sequential
  for (const runType of applicableRuns[3]) {
    total += RUN_CONFIGS[runType].estimatedDurationMs;
  }

  // Add 20% buffer for overhead
  return Math.round(total * 1.2);
}

// Retry configuration - increased for reliability
export const RETRY_CONFIG = {
  maxRetries: 3,  // Increased from 2 - give more chances for transient failures
  baseDelayMs: 2000,  // Increased from 1000 - more breathing room
  maxDelayMs: 30000,  // Increased from 10000
  backoffMultiplier: 2,
};

// Timeout configuration - increased for quality over speed
export const TIMEOUT_CONFIG = {
  perRunMs: 900000, // 15 minutes per run (comprehensive analysis needs more time)
  perPhaseMs: 2400000, // 40 minutes per phase
  sandboxLifetimeMs: 3600000, // 60 minutes sandbox lifetime
  vercelMaxMs: 900000, // 15 minutes - using Vercel Pro/Enterprise limits
};
