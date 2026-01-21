"use client";

import { ReactNode } from "react";
import { Check, X } from "lucide-react";

interface GateQuestionProps {
  question: string;
  value: boolean | null | undefined;
  onChange: (value: boolean) => void;
  help?: string;
  children?: ReactNode; // Content to show when "yes" is selected
}

export function GateQuestion({
  question,
  value,
  onChange,
  help,
  children,
}: GateQuestionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-base font-medium text-[var(--text-heading)]">
          {question}
        </p>
        {help && (
          <p className="text-sm text-[var(--text-muted)]">{help}</p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`
            flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all
            ${value === true
              ? "border-[var(--accent-purple)] bg-[var(--accent-muted)] text-[var(--accent-purple)]"
              : "border-[var(--border)] hover:border-[var(--accent-purple)]/50 text-[var(--text-body)]"
            }
          `}
        >
          <Check className="w-4 h-4" />
          <span className="font-medium">Yes</span>
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`
            flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all
            ${value === false
              ? "border-[var(--text-muted)] bg-[var(--off-white)] text-[var(--text-heading)]"
              : "border-[var(--border)] hover:border-[var(--text-muted)]/50 text-[var(--text-body)]"
            }
          `}
        >
          <X className="w-4 h-4" />
          <span className="font-medium">No</span>
        </button>
      </div>

      {/* Conditional content reveal */}
      {value === true && children && (
        <div className="mt-6 pt-6 border-t border-[var(--border)] animate-in fade-in slide-in-from-top-2 duration-300">
          {children}
        </div>
      )}
    </div>
  );
}

// Yes/No field component for use in forms
interface YesNoFieldProps {
  label: string;
  value: boolean | null | undefined;
  onChange: (value: boolean) => void;
  help?: string;
  inline?: boolean;
}

export function YesNoField({
  label,
  value,
  onChange,
  help,
  inline = false,
}: YesNoFieldProps) {
  if (inline) {
    return (
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--text-heading)]">{label}</p>
          {help && <p className="text-xs text-[var(--text-muted)]">{help}</p>}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange(true)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${value === true
                ? "bg-[var(--accent-purple)] text-white"
                : "bg-[var(--off-white)] text-[var(--text-muted)] hover:bg-[var(--light-gray)]"
              }
            `}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => onChange(false)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${value === false
                ? "bg-[var(--text-heading)] text-white"
                : "bg-[var(--off-white)] text-[var(--text-muted)] hover:bg-[var(--light-gray)]"
              }
            `}
          >
            No
          </button>
        </div>
      </div>
    );
  }

  return (
    <GateQuestion question={label} value={value} onChange={onChange} help={help} />
  );
}
