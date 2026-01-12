"use client";

import { forwardRef, SelectHTMLAttributes, ReactNode, useId } from "react";

type SelectSize = "sm" | "md" | "lg";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  helpText?: string;
  error?: string;
  size?: SelectSize;
  options: SelectOption[];
  placeholder?: string;
  leftIcon?: ReactNode;
}

const sizeStyles: Record<SelectSize, { select: string; icon: string }> = {
  sm: {
    select: "px-3 py-1.5 text-sm pr-8",
    icon: "w-4 h-4",
  },
  md: {
    select: "px-4 py-2 text-base pr-10",
    icon: "w-5 h-5",
  },
  lg: {
    select: "px-4 py-3 text-lg pr-12",
    icon: "w-6 h-6",
  },
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helpText,
      error,
      size = "md",
      options,
      placeholder,
      leftIcon,
      disabled,
      className = "",
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const hasError = !!error;
    const styles = sizeStyles[size];

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div
              className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none ${styles.icon}`}
            >
              {leftIcon}
            </div>
          )}

          <select
            ref={ref}
            id={id}
            disabled={disabled}
            className={`
              w-full appearance-none
              bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-600
              text-gray-900 dark:text-white
              rounded-lg
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60
              ${leftIcon ? "pl-10" : ""}
              ${hasError ? "border-red-500 focus:ring-red-500" : ""}
              ${styles.select}
              ${className}
            `}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${id}-error` : helpText ? `${id}-help` : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown Arrow */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Help Text / Error */}
        {(helpText || error) && (
          <p
            id={error ? `${id}-error` : `${id}-help`}
            className={`mt-1.5 text-sm ${
              hasError
                ? "text-red-600 dark:text-red-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {error || helpText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
