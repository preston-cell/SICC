"use client";

import { forwardRef } from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  size?: "sm" | "md";
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ checked, onChange, disabled = false, label, description, size = "md" }, ref) => {
    const sizeClasses = {
      sm: {
        track: "w-9 h-5",
        thumb: "w-3.5 h-3.5",
        translate: "translate-x-4",
      },
      md: {
        track: "w-12 h-6",
        thumb: "w-4 h-4",
        translate: "translate-x-6",
      },
    };

    const sizes = sizeClasses[size];

    return (
      <div className="flex items-center justify-between">
        {(label || description) && (
          <div className="flex-1 mr-4">
            {label && (
              <p className="font-medium text-[var(--text-heading)]">{label}</p>
            )}
            {description && (
              <p className="text-sm text-[var(--text-muted)]">{description}</p>
            )}
          </div>
        )}
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={`
            relative inline-flex flex-shrink-0 ${sizes.track} rounded-full cursor-pointer
            transition-colors duration-200 ease-in-out
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--coral)] focus-visible:ring-offset-2
            ${
              checked
                ? "bg-[var(--coral)]"
                : "bg-[var(--stone-grey)]"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <span
            className={`
              pointer-events-none inline-block ${sizes.thumb} rounded-full bg-white shadow-lg
              transform ring-0 transition duration-200 ease-in-out
              ${checked ? sizes.translate : "translate-x-1"}
              ${size === "sm" ? "mt-[3px]" : "mt-1"}
            `}
          />
        </button>
      </div>
    );
  }
);

Toggle.displayName = "Toggle";

export default Toggle;
