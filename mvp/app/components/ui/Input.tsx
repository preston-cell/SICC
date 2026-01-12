"use client";

import { forwardRef, InputHTMLAttributes, ReactNode, useId } from "react";

type InputSize = "sm" | "md" | "lg";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helpText?: string;
  error?: string;
  size?: InputSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
}

const sizeStyles: Record<InputSize, { input: string; icon: string }> = {
  sm: {
    input: "px-3 py-1.5 text-sm",
    icon: "w-4 h-4",
  },
  md: {
    input: "px-4 py-2 text-base",
    icon: "w-5 h-5",
  },
  lg: {
    input: "px-4 py-3 text-lg",
    icon: "w-6 h-6",
  },
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helpText,
      error,
      size = "md",
      leftIcon,
      rightIcon,
      leftAddon,
      rightAddon,
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

        <div className="relative flex">
          {/* Left Addon */}
          {leftAddon && (
            <div className="flex items-center px-3 border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-l-lg text-sm">
              {leftAddon}
            </div>
          )}

          {/* Input Container */}
          <div className="relative flex-1">
            {/* Left Icon */}
            {leftIcon && (
              <div
                className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none ${styles.icon}`}
              >
                {leftIcon}
              </div>
            )}

            <input
              ref={ref}
              id={id}
              disabled={disabled}
              className={`
                w-full
                bg-white dark:bg-gray-800
                border border-gray-300 dark:border-gray-600
                text-gray-900 dark:text-white
                placeholder-gray-400 dark:placeholder-gray-500
                transition-colors duration-150
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60
                ${leftAddon ? "" : "rounded-l-lg"}
                ${rightAddon ? "" : "rounded-r-lg"}
                ${leftIcon ? "pl-10" : ""}
                ${rightIcon ? "pr-10" : ""}
                ${hasError ? "border-red-500 focus:ring-red-500" : ""}
                ${styles.input}
                ${className}
              `}
              aria-invalid={hasError}
              aria-describedby={
                hasError ? `${id}-error` : helpText ? `${id}-help` : undefined
              }
              {...props}
            />

            {/* Right Icon */}
            {rightIcon && (
              <div
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none ${styles.icon}`}
              >
                {rightIcon}
              </div>
            )}
          </div>

          {/* Right Addon */}
          {rightAddon && (
            <div className="flex items-center px-3 border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-r-lg text-sm">
              {rightAddon}
            </div>
          )}
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

Input.displayName = "Input";

export default Input;
