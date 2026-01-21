"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface GapAnalysisProgressProps {
  runId: Id<"gapAnalysisRuns">;
  onComplete?: () => void;
}

const phaseLabels: Record<string, string> = {
  research: "Research & Context",
  analysis: "Deep Analysis",
  synthesis: "Synthesis",
};

const runTypeLabels: Record<string, string> = {
  state_law_research: "Researching State Laws",
  client_context_analysis: "Analyzing Client Context",
  document_inventory: "Creating Document Inventory",
  document_completeness: "Checking Document Completeness",
  tax_optimization: "Identifying Tax Strategies",
  medicaid_planning: "Analyzing Medicaid Options",
  beneficiary_coordination: "Coordinating Beneficiaries",
  family_protection: "Evaluating Family Protection",
  asset_protection: "Assessing Asset Protection",
  existing_document_review: "Reviewing Existing Documents",
  scenario_modeling: "Modeling What-If Scenarios",
  priority_matrix: "Building Priority Matrix",
  final_report: "Generating Final Report",
};

export function GapAnalysisProgress({ runId, onComplete }: GapAnalysisProgressProps) {
  const progress = useQuery(api.gapAnalysisProgress.getRunProgress, { runId });

  // Call onComplete when analysis finishes
  if (progress?.status === "completed" || progress?.status === "partial") {
    onComplete?.();
  }

  if (!progress) {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-2 bg-gray-200 rounded w-full mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const isRunning = !["completed", "failed", "partial"].includes(progress.status);

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Comprehensive Analysis
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            progress.status === "completed"
              ? "bg-green-100 text-green-800"
              : progress.status === "failed"
              ? "bg-red-100 text-red-800"
              : progress.status === "partial"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {progress.status === "completed"
            ? "Complete"
            : progress.status === "failed"
            ? "Failed"
            : progress.status === "partial"
            ? "Partial"
            : "In Progress"}
        </span>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Overall Progress</span>
          <span>{progress.overallProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progress.overallProgress}%` }}
          />
        </div>
      </div>

      {/* Current Activity */}
      {isRunning && progress.currentRun && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm text-blue-800 font-medium">
              {runTypeLabels[progress.currentRun.runType] || progress.currentRun.runType}
            </span>
          </div>
        </div>
      )}

      {/* Phase Progress */}
      <div className="space-y-4">
        {progress.phases.map((phase) => (
          <PhaseCard key={phase.phaseNumber} phase={phase} />
        ))}
      </div>

      {/* Estimated Time */}
      {isRunning && progress.estimatedCompletionMs && progress.estimatedCompletionMs > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Estimated time remaining:{" "}
            <span className="font-medium">
              {formatDuration(progress.estimatedCompletionMs)}
            </span>
          </p>
        </div>
      )}

      {/* Error Message */}
      {progress.error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-800">{progress.error}</p>
        </div>
      )}
    </div>
  );
}

interface PhaseCardProps {
  phase: {
    phaseNumber: number;
    phaseType: string;
    status: string;
    totalRuns: number;
    completedRuns: number;
    failedRuns: number;
  };
}

function PhaseCard({ phase }: PhaseCardProps) {
  const isComplete = phase.status === "completed";
  const isFailed = phase.status === "failed";
  const isRunning = phase.status === "running";
  const isPending = phase.status === "pending";

  return (
    <div
      className={`p-4 rounded-lg border ${
        isComplete
          ? "bg-green-50 border-green-200"
          : isFailed
          ? "bg-red-50 border-red-200"
          : isRunning
          ? "bg-blue-50 border-blue-200"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Phase Icon */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              isComplete
                ? "bg-green-500 text-white"
                : isFailed
                ? "bg-red-500 text-white"
                : isRunning
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {isComplete ? (
              <CheckIcon />
            ) : isFailed ? (
              <XIcon />
            ) : (
              phase.phaseNumber
            )}
          </div>

          <div>
            <h4
              className={`font-medium ${
                isComplete
                  ? "text-green-800"
                  : isFailed
                  ? "text-red-800"
                  : isRunning
                  ? "text-blue-800"
                  : "text-gray-600"
              }`}
            >
              Phase {phase.phaseNumber}: {phaseLabels[phase.phaseType]}
            </h4>
            <p className="text-xs text-gray-500">
              {phase.completedRuns} of {phase.totalRuns} runs complete
              {phase.failedRuns > 0 && ` (${phase.failedRuns} failed)`}
            </p>
          </div>
        </div>

        {/* Phase Progress */}
        {isRunning && (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-blue-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{
                  width: `${(phase.completedRuns / phase.totalRuns) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}
