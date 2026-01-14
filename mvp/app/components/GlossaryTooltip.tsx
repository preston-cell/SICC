"use client";

import { ReactNode, useState } from "react";
import { getTermByName, GlossaryTerm } from "../../lib/glossaryData";
import Tooltip from "./ui/Tooltip";

interface GlossaryTooltipProps {
  /** The term to look up in the glossary */
  term: string;
  /** Content to display (defaults to the term itself) */
  children?: ReactNode;
  /** Whether to show the example in the tooltip */
  showExample?: boolean;
  /** Custom class name for the trigger element */
  className?: string;
}

/**
 * A tooltip component that displays glossary definitions for legal terms.
 * Automatically looks up the term in the glossary database.
 *
 * Usage:
 * <GlossaryTooltip term="Beneficiary">beneficiary</GlossaryTooltip>
 * <GlossaryTooltip term="Executor" />
 */
export default function GlossaryTooltip({
  term,
  children,
  showExample = false,
  className = "",
}: GlossaryTooltipProps) {
  const glossaryTerm = getTermByName(term);

  // If term not found, just render children without tooltip
  if (!glossaryTerm) {
    return <span className={className}>{children || term}</span>;
  }

  const tooltipContent = (
    <div className="space-y-2">
      <div className="font-semibold text-blue-300">{glossaryTerm.term}</div>
      <div className="text-gray-100">{glossaryTerm.definition}</div>
      {showExample && glossaryTerm.example && (
        <div className="text-gray-300 text-xs italic border-t border-gray-600 pt-2 mt-2">
          Example: {glossaryTerm.example}
        </div>
      )}
    </div>
  );

  return (
    <Tooltip content={tooltipContent} position="top" delay={300}>
      <span
        className={`
          border-b border-dotted border-gray-400 dark:border-gray-500
          cursor-help hover:border-blue-500 dark:hover:border-blue-400
          transition-colors
          ${className}
        `}
      >
        {children || term}
      </span>
    </Tooltip>
  );
}

/**
 * A more detailed glossary tooltip that can be clicked to see more info.
 * Shows a popup card instead of a simple tooltip.
 */
interface GlossaryTermCardProps {
  term: string;
  children?: ReactNode;
  className?: string;
  onLearnMore?: (term: GlossaryTerm) => void;
}

export function GlossaryTermCard({
  term,
  children,
  className = "",
  onLearnMore,
}: GlossaryTermCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const glossaryTerm = getTermByName(term);

  if (!glossaryTerm) {
    return <span className={className}>{children || term}</span>;
  }

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className={`
          border-b border-dotted border-gray-400 dark:border-gray-500
          cursor-help hover:border-blue-500 dark:hover:border-blue-400
          transition-colors focus:outline-none focus:border-blue-500
          ${className}
        `}
      >
        {children || term}
      </button>

      {isOpen && (
        <div
          className="absolute z-50 w-80 p-4 mt-2 left-0 bg-white dark:bg-gray-800
                     rounded-lg shadow-xl border border-gray-200 dark:border-gray-700
                     animate-fadeIn"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {glossaryTerm.term}
              </h4>
              <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                {glossaryTerm.category.replace("-", " ")}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300">
              {glossaryTerm.definition}
            </p>

            {glossaryTerm.example && (
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-2 rounded">
                <span className="font-medium">Example:</span> {glossaryTerm.example}
              </div>
            )}

            {glossaryTerm.relatedTerms && glossaryTerm.relatedTerms.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-gray-400">Related:</span>
                {glossaryTerm.relatedTerms.map((related) => (
                  <span
                    key={related}
                    className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                  >
                    {related}
                  </span>
                ))}
              </div>
            )}

            {onLearnMore && (
              <button
                type="button"
                onClick={() => onLearnMore(glossaryTerm)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                View in glossary →
              </button>
            )}
          </div>
        </div>
      )}
    </span>
  );
}

/**
 * Inline help icon that shows a glossary tooltip
 */
interface GlossaryHelpIconProps {
  term: string;
  showExample?: boolean;
}

export function GlossaryHelpIcon({ term, showExample = false }: GlossaryHelpIconProps) {
  const glossaryTerm = getTermByName(term);

  if (!glossaryTerm) {
    return null;
  }

  const tooltipContent = (
    <div className="space-y-2 max-w-xs">
      <div className="font-semibold text-blue-300">{glossaryTerm.term}</div>
      <div className="text-gray-100 text-sm">{glossaryTerm.definition}</div>
      {showExample && glossaryTerm.example && (
        <div className="text-gray-300 text-xs italic border-t border-gray-600 pt-2 mt-2">
          Example: {glossaryTerm.example}
        </div>
      )}
    </div>
  );

  return (
    <Tooltip content={tooltipContent} position="top" delay={200}>
      <button
        type="button"
        className="inline-flex items-center justify-center w-4 h-4 ml-1 text-gray-400
                   hover:text-blue-500 dark:hover:text-blue-400 transition-colors
                   focus:outline-none focus:text-blue-500"
        aria-label={`Learn more about ${term}`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </Tooltip>
  );
}
