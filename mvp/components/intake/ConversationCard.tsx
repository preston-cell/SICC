"use client";

import { ReactNode } from "react";
import { HelpCircle } from "lucide-react";
import { CONTEXTUAL_HELP } from "@/lib/intake/question-helpers";

interface ConversationCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  helpKey?: string;
  className?: string;
}

export function ConversationCard({
  children,
  title,
  subtitle,
  helpKey,
  className = "",
}: ConversationCardProps) {
  const helpContent = helpKey ? CONTEXTUAL_HELP[helpKey] : null;

  return (
    <div className={`bg-white border border-[var(--border)] rounded-2xl p-6 md:p-8 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold text-[var(--text-heading)]">
                {title}
              </h2>
              {helpContent && (
                <div className="group relative">
                  <button
                    type="button"
                    className="p-1 rounded-full hover:bg-[var(--off-white)] transition-colors"
                    aria-label={`Help for ${helpContent.term}`}
                  >
                    <HelpCircle className="w-4 h-4 text-[var(--text-caption)]" />
                  </button>
                  {/* Tooltip */}
                  <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-[var(--text-heading)] text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-lg">
                    <p className="font-medium mb-1">{helpContent.term}</p>
                    <p className="text-white/80 text-xs mb-2">{helpContent.definition}</p>
                    <p className="text-white/60 text-xs">{helpContent.why}</p>
                    <div className="absolute -top-1.5 right-4 w-3 h-3 bg-[var(--text-heading)] rotate-45" />
                  </div>
                </div>
              )}
            </div>
          )}
          {subtitle && (
            <p className="text-sm text-[var(--text-muted)] mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

// Single question wrapper for mobile one-question-at-a-time mode
interface SingleQuestionCardProps {
  question: string;
  help?: string;
  whyMatters?: string;
  children: ReactNode;
  isRequired?: boolean;
}

export function SingleQuestionCard({
  question,
  help,
  whyMatters,
  children,
  isRequired,
}: SingleQuestionCardProps) {
  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-medium text-[var(--text-heading)]">
            {question}
            {isRequired && <span className="text-[var(--error)] ml-0.5">*</span>}
          </h2>
          {help && (
            <p className="text-sm text-[var(--text-muted)]">{help}</p>
          )}
        </div>

        <div className="py-4">
          {children}
        </div>

        {whyMatters && (
          <p className="text-xs text-[var(--text-caption)] border-l-2 border-[var(--accent-purple)]/30 pl-3">
            <span className="font-medium">Why this matters:</span> {whyMatters}
          </p>
        )}
      </div>
    </div>
  );
}
