"use client";

import { ReactNode } from "react";
import { HelpCircle, Sparkles } from "lucide-react";

interface QuestionGroupProps {
  title?: string;
  description?: string;
  children: ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

export function QuestionGroup({
  title,
  description,
  children,
  columns = 1,
  className = "",
}: QuestionGroupProps) {
  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
  }[columns];

  return (
    <div className={`space-y-4 ${className}`}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-sm font-medium text-[var(--text-heading)]">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-[var(--text-muted)]">{description}</p>
          )}
        </div>
      )}
      <div className={`grid ${gridClass} gap-4`}>
        {children}
      </div>
    </div>
  );
}

// Form field wrapper with label and help text
interface FormFieldProps {
  label: string;
  help?: string;
  required?: boolean;
  error?: string;
  isExtracted?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  help,
  required,
  error,
  isExtracted,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-[var(--text-heading)]">
          {label}
          {required && <span className="text-[var(--error)] ml-0.5">*</span>}
        </label>
        {isExtracted && (
          <span className="inline-flex items-center gap-1 text-xs text-[var(--info)] bg-[var(--info-muted)] px-1.5 py-0.5 rounded">
            <Sparkles className="w-3 h-3" />
            Auto-filled
          </span>
        )}
        {help && !error && (
          <div className="group relative ml-auto">
            <HelpCircle className="w-3.5 h-3.5 text-[var(--text-caption)] cursor-help" />
            <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-[var(--text-heading)] text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              {help}
              <div className="absolute -bottom-1 right-3 w-2 h-2 bg-[var(--text-heading)] rotate-45" />
            </div>
          </div>
        )}
      </div>
      {children}
      {error && (
        <p className="text-xs text-[var(--error)]">{error}</p>
      )}
      {help && !error && (
        <p className="text-xs text-[var(--text-caption)] md:hidden">{help}</p>
      )}
    </div>
  );
}

// Input components with consistent styling
interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "date";
  className?: string;
  disabled?: boolean;
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
  disabled,
}: TextInputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`
        w-full px-4 py-2.5 rounded-lg border border-[var(--border)]
        bg-white text-[var(--text-heading)] placeholder:text-[var(--text-caption)]
        focus:outline-none focus:ring-2 focus:ring-[var(--accent-purple)]/20 focus:border-[var(--accent-purple)]
        disabled:bg-[var(--off-white)] disabled:cursor-not-allowed
        transition-all
        ${className}
      `}
    />
  );
}

interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
  className = "",
}: TextareaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`
        w-full px-4 py-2.5 rounded-lg border border-[var(--border)]
        bg-white text-[var(--text-heading)] placeholder:text-[var(--text-caption)]
        focus:outline-none focus:ring-2 focus:ring-[var(--accent-purple)]/20 focus:border-[var(--accent-purple)]
        resize-none
        transition-all
        ${className}
      `}
    />
  );
}

interface SelectInputProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

export function SelectInput({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
}: SelectInputProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full px-4 py-2.5 rounded-lg border border-[var(--border)]
        bg-white text-[var(--text-heading)]
        focus:outline-none focus:ring-2 focus:ring-[var(--accent-purple)]/20 focus:border-[var(--accent-purple)]
        transition-all cursor-pointer appearance-none
        bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')]
        bg-no-repeat bg-[right_1rem_center]
        ${!value ? "text-[var(--text-caption)]" : ""}
        ${className}
      `}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

// Radio group component
interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; description?: string }[];
  columns?: 1 | 2;
  className?: string;
}

export function RadioGroup({
  value,
  onChange,
  options,
  columns = 1,
  className = "",
}: RadioGroupProps) {
  const gridClass = columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1";

  return (
    <div className={`grid ${gridClass} gap-2 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`
            flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all
            ${value === option.value
              ? "border-[var(--accent-purple)] bg-[var(--accent-muted)]"
              : "border-[var(--border)] hover:border-[var(--accent-purple)]/50"
            }
          `}
        >
          <div
            className={`
              w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all
              ${value === option.value
                ? "border-[var(--accent-purple)] bg-[var(--accent-purple)]"
                : "border-[var(--border)]"
              }
            `}
          >
            {value === option.value && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${value === option.value ? "text-[var(--accent-purple)]" : "text-[var(--text-heading)]"}`}>
              {option.label}
            </p>
            {option.description && (
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {option.description}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
