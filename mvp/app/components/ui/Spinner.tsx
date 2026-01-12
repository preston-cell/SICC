"use client";

import { forwardRef, HTMLAttributes } from "react";

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  color?: "primary" | "white" | "gray";
}

const sizeStyles: Record<SpinnerSize, string> = {
  xs: "w-3 h-3 border",
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-2",
  xl: "w-12 h-12 border-3",
};

const colorStyles = {
  primary: "border-blue-600 border-t-transparent",
  white: "border-white border-t-transparent",
  gray: "border-gray-400 border-t-transparent dark:border-gray-500",
};

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = "md", color = "primary", className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={`
          inline-block rounded-full animate-spin
          ${sizeStyles[size]}
          ${colorStyles[color]}
          ${className}
        `}
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

Spinner.displayName = "Spinner";

export default Spinner;
