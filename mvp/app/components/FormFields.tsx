"use client";

import { ReactNode, useId } from "react";

interface FormFieldProps {
  label: ReactNode;
  required?: boolean;
  error?: string;
  hint?: string;
  helpText?: string;
  showSuccess?: boolean;
  children: ReactNode;
}

export function FormField({
  label,
  required,
  error,
  hint,
  helpText,
  showSuccess,
  children,
}: FormFieldProps) {
  const id = useId();
  const hasError = !!error;
  const showSuccessState = showSuccess && !hasError;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {showSuccessState && (
          <span className="flex items-center text-xs text-green-600 dark:text-green-400">
            <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Valid
          </span>
        )}
      </div>

      {/* Help text above the field */}
      {helpText && (
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1.5">
          <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {helpText}
        </p>
      )}

      {children}

      {/* Hint or error below the field */}
      {hint && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "date" | "number";
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  success?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric" | "decimal";
  pattern?: string;
  maxLength?: number;
  name?: string;
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
  required,
  error,
  success,
  autoComplete,
  inputMode,
  pattern,
  maxLength,
  name,
}: TextInputProps) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      autoComplete={autoComplete}
      inputMode={inputMode}
      pattern={pattern}
      maxLength={maxLength}
      className={`
        w-full px-3 py-2.5 border rounded-lg
        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
        placeholder-gray-400 dark:placeholder-gray-500
        transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-offset-0
        disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60
        ${error
          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
          : success
            ? "border-green-500 focus:ring-green-500 focus:border-green-500"
            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
        }
      `}
    />
  );
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  name?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  error,
  success,
  name,
}: SelectProps) {
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          w-full px-3 py-2.5 border rounded-lg appearance-none
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-offset-0
          disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60
          ${error
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : success
              ? "border-green-500 focus:ring-green-500 focus:border-green-500"
              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          }
        `}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; description?: string }[];
  name: string;
  disabled?: boolean;
  columns?: 1 | 2;
}

export function RadioGroup({
  value,
  onChange,
  options,
  name,
  disabled,
  columns = 1,
}: RadioGroupProps) {
  return (
    <div className={`grid gap-3 ${columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`
            relative flex items-start p-4 border-2 rounded-xl cursor-pointer
            transition-all duration-200
            ${value === opt.value
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500"
              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-offset-0"
          />
          <div className="ml-3 flex-1">
            <span className={`text-sm font-medium ${value === opt.value ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-white"}`}>
              {opt.label}
            </span>
            {opt.description && (
              <p className={`text-xs mt-0.5 ${value === opt.value ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                {opt.description}
              </p>
            )}
          </div>
          {value === opt.value && (
            <div className="absolute top-3 right-3">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </label>
      ))}
    </div>
  );
}

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  description?: string;
  disabled?: boolean;
}

export function Checkbox({ checked, onChange, label, description, disabled }: CheckboxProps) {
  return (
    <label
      className={`
        relative flex items-start p-4 border-2 rounded-xl cursor-pointer
        transition-all duration-200
        ${checked
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0"
      />
      <div className="ml-3 flex-1">
        <span className={`text-sm font-medium ${checked ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-white"}`}>
          {label}
        </span>
        {description && (
          <p className={`text-xs mt-0.5 ${checked ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
            {description}
          </p>
        )}
      </div>
      {checked && (
        <div className="absolute top-3 right-3">
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </label>
  );
}

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  maxLength?: number;
  showCount?: boolean;
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled,
  error,
  success,
  maxLength,
  showCount,
}: TextAreaProps) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        maxLength={maxLength}
        className={`
          w-full px-3 py-2.5 border rounded-lg resize-none
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-offset-0
          disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60
          ${error
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : success
              ? "border-green-500 focus:ring-green-500 focus:border-green-500"
              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          }
        `}
      />
      {showCount && maxLength && (
        <div className="absolute bottom-2 right-3 text-xs text-gray-400">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
}

interface FormSectionProps {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  badge?: ReactNode;
}

export function FormSection({
  title,
  description,
  children,
  badge,
}: FormSectionProps) {
  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          {badge}
        </div>
        {description && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</div>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// Currency input helper
interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = "0.00",
  disabled,
  error,
}: CurrencyInputProps) {
  const handleChange = (inputValue: string) => {
    // Remove non-numeric characters except decimal
    const cleaned = inputValue.replace(/[^0-9.]/g, "");
    // Ensure only one decimal point
    const parts = cleaned.split(".");
    if (parts.length > 2) return;
    if (parts[1]?.length > 2) return;
    onChange(cleaned);
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
        $
      </span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full pl-7 pr-3 py-2.5 border rounded-lg
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-offset-0
          disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60
          ${error
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          }
        `}
      />
    </div>
  );
}

// Info callout box
interface InfoBoxProps {
  type?: "info" | "warning" | "tip";
  title?: string;
  children: ReactNode;
}

export function InfoBox({ type = "info", title, children }: InfoBoxProps) {
  const styles = {
    info: {
      container: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
      icon: "text-blue-600 dark:text-blue-400",
      title: "text-blue-800 dark:text-blue-200",
    },
    warning: {
      container: "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
      icon: "text-amber-600 dark:text-amber-400",
      title: "text-amber-800 dark:text-amber-200",
    },
    tip: {
      container: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
      icon: "text-green-600 dark:text-green-400",
      title: "text-green-800 dark:text-green-200",
    },
  };

  const icons = {
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    tip: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  };

  return (
    <div className={`rounded-lg border p-4 ${styles[type].container}`}>
      <div className="flex gap-3">
        <div className={`flex-shrink-0 ${styles[type].icon}`}>{icons[type]}</div>
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`font-medium mb-1 ${styles[type].title}`}>{title}</h4>
          )}
          <div className="text-sm text-gray-700 dark:text-gray-300">{children}</div>
        </div>
      </div>
    </div>
  );
}
