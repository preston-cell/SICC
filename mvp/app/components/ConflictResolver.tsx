"use client";

import { useState, useCallback } from "react";

interface ConflictItem {
  field: string;
  label: string;
  extractedValue: string | undefined | null;
  manualValue: string | undefined | null;
  source?: string; // Document name where extracted from
  confidence?: number;
}

interface ConflictResolverProps {
  title: string;
  conflicts: ConflictItem[];
  onResolve: (resolvedValues: Record<string, string | undefined>) => void;
  onCancel?: () => void;
}

type Resolution = "extracted" | "manual" | "skip";

export default function ConflictResolver({
  title,
  conflicts,
  onResolve,
  onCancel,
}: ConflictResolverProps) {
  // Track resolution choice for each field
  const [resolutions, setResolutions] = useState<Record<string, Resolution>>(() => {
    const initial: Record<string, Resolution> = {};
    conflicts.forEach((c) => {
      // Default to extracted if available and has higher confidence, else manual
      if (c.extractedValue && (c.confidence ?? 0) >= 50) {
        initial[c.field] = "extracted";
      } else if (c.manualValue) {
        initial[c.field] = "manual";
      } else if (c.extractedValue) {
        initial[c.field] = "extracted";
      } else {
        initial[c.field] = "skip";
      }
    });
    return initial;
  });

  const handleResolutionChange = useCallback((field: string, resolution: Resolution) => {
    setResolutions((prev) => ({ ...prev, [field]: resolution }));
  }, []);

  const handleAcceptAll = useCallback((type: "extracted" | "manual") => {
    const newResolutions: Record<string, Resolution> = {};
    conflicts.forEach((c) => {
      if (type === "extracted" && c.extractedValue) {
        newResolutions[c.field] = "extracted";
      } else if (type === "manual" && c.manualValue) {
        newResolutions[c.field] = "manual";
      } else if (c.extractedValue) {
        newResolutions[c.field] = "extracted";
      } else if (c.manualValue) {
        newResolutions[c.field] = "manual";
      } else {
        newResolutions[c.field] = "skip";
      }
    });
    setResolutions(newResolutions);
  }, [conflicts]);

  const handleSubmit = useCallback(() => {
    const resolvedValues: Record<string, string | undefined> = {};
    conflicts.forEach((c) => {
      const resolution = resolutions[c.field];
      if (resolution === "extracted") {
        resolvedValues[c.field] = c.extractedValue ?? undefined;
      } else if (resolution === "manual") {
        resolvedValues[c.field] = c.manualValue ?? undefined;
      }
      // Skip means don't include the field
    });
    onResolve(resolvedValues);
  }, [conflicts, resolutions, onResolve]);

  // Count resolutions
  const extractedCount = Object.values(resolutions).filter((r) => r === "extracted").length;
  const manualCount = Object.values(resolutions).filter((r) => r === "manual").length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-amber-50 dark:bg-amber-900/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              We found differences between your uploaded documents and what you entered. Please
              choose which values to keep.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
        <button
          onClick={() => handleAcceptAll("extracted")}
          className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
        >
          Accept All from Documents
        </button>
        <button
          onClick={() => handleAcceptAll("manual")}
          className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Keep All Manual Entries
        </button>
        <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
          {extractedCount} from docs, {manualCount} manual
        </div>
      </div>

      {/* Conflicts List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[400px] overflow-y-auto">
        {conflicts.map((conflict) => {
          const resolution = resolutions[conflict.field];
          const hasExtracted = conflict.extractedValue !== undefined && conflict.extractedValue !== null;
          const hasManual = conflict.manualValue !== undefined && conflict.manualValue !== null;

          return (
            <div key={conflict.field} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-900 dark:text-white">
                  {conflict.label}
                </span>
                {conflict.confidence !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      conflict.confidence >= 80
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : conflict.confidence >= 50
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    }`}
                  >
                    {conflict.confidence}% confidence
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Extracted Value */}
                <button
                  type="button"
                  onClick={() => hasExtracted && handleResolutionChange(conflict.field, "extracted")}
                  disabled={!hasExtracted}
                  className={`
                    p-3 rounded-lg border-2 text-left transition-all
                    ${!hasExtracted
                      ? "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 opacity-50 cursor-not-allowed"
                      : resolution === "extracted"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200 dark:ring-blue-800"
                        : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700"
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        resolution === "extracted"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {resolution === "extracted" && (
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      From Document
                    </span>
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white font-medium truncate">
                    {hasExtracted ? String(conflict.extractedValue) : "Not found"}
                  </div>
                  {conflict.source && hasExtracted && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                      Source: {conflict.source}
                    </div>
                  )}
                </button>

                {/* Manual Value */}
                <button
                  type="button"
                  onClick={() => hasManual && handleResolutionChange(conflict.field, "manual")}
                  disabled={!hasManual}
                  className={`
                    p-3 rounded-lg border-2 text-left transition-all
                    ${!hasManual
                      ? "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 opacity-50 cursor-not-allowed"
                      : resolution === "manual"
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20 ring-2 ring-green-200 dark:ring-green-800"
                        : "border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700"
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        resolution === "manual"
                          ? "border-green-500 bg-green-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {resolution === "manual" && (
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      You Entered
                    </span>
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white font-medium truncate">
                    {hasManual ? String(conflict.manualValue) : "Not entered"}
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 flex gap-3">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Apply Selections
        </button>
      </div>
    </div>
  );
}

/**
 * Helper component to show extracted data badges on form fields
 */
interface ExtractedBadgeProps {
  source?: string;
  confidence?: number;
  onClick?: () => void;
}

export function ExtractedBadge({ source, confidence, onClick }: ExtractedBadgeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span>From Document</span>
      {confidence !== undefined && (
        <span className="text-blue-500 dark:text-blue-400">({confidence}%)</span>
      )}
    </button>
  );
}

/**
 * Utility function to find conflicts between extracted and manual data
 */
export function findConflicts(
  extractedData: Record<string, unknown> | null | undefined,
  manualData: Record<string, unknown> | null | undefined,
  fieldLabels: Record<string, string>,
  source?: string,
  confidence?: number
): ConflictItem[] {
  if (!extractedData) return [];

  const conflicts: ConflictItem[] = [];
  const allFields = new Set([
    ...Object.keys(extractedData || {}),
    ...Object.keys(manualData || {}),
  ]);

  allFields.forEach((field) => {
    const extractedValue = extractedData?.[field];
    const manualValue = manualData?.[field];

    // Skip if both are empty/null/undefined
    if (
      (extractedValue === undefined || extractedValue === null || extractedValue === "") &&
      (manualValue === undefined || manualValue === null || manualValue === "")
    ) {
      return;
    }

    // Skip if values are the same
    if (String(extractedValue || "") === String(manualValue || "")) {
      return;
    }

    // Skip complex objects/arrays for now
    if (typeof extractedValue === "object" || typeof manualValue === "object") {
      return;
    }

    conflicts.push({
      field,
      label: fieldLabels[field] || field,
      extractedValue: extractedValue !== undefined && extractedValue !== null ? String(extractedValue) : null,
      manualValue: manualValue !== undefined && manualValue !== null ? String(manualValue) : null,
      source,
      confidence,
    });
  });

  return conflicts;
}
