"use client";

import { Check, Home, Users, Percent, Heart, Gift, Building, Shield, Lock } from "lucide-react";

interface PriorityOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

interface PriorityPickerProps {
  options: PriorityOption[];
  value: string[];
  onChange: (values: string[]) => void;
  maxSelections?: number;
  className?: string;
}

const ICON_MAP: Record<string, typeof Home> = {
  home: Home,
  users: Users,
  percent: Percent,
  heart: Heart,
  gift: Gift,
  building: Building,
  shield: Shield,
  lock: Lock,
};

export function PriorityPicker({
  options,
  value,
  onChange,
  maxSelections = 3,
  className = "",
}: PriorityPickerProps) {
  const handleToggle = (optionValue: string) => {
    const isSelected = value.includes(optionValue);

    if (isSelected) {
      onChange(value.filter((v) => v !== optionValue));
    } else if (value.length < maxSelections) {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <p className="text-sm text-[var(--text-muted)]">
        Selected: {value.length} of {maxSelections}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {options.map((option) => {
          const isSelected = value.includes(option.value);
          const isDisabled = !isSelected && value.length >= maxSelections;
          const IconComponent = (option.icon && ICON_MAP[option.icon]) || Heart;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleToggle(option.value)}
              disabled={isDisabled}
              className={`
                relative flex flex-col items-center p-4 rounded-xl border-2 transition-all text-center
                ${isSelected
                  ? "border-[var(--accent-purple)] bg-[var(--accent-muted)]"
                  : isDisabled
                    ? "border-[var(--border)] opacity-50 cursor-not-allowed"
                    : "border-[var(--border)] hover:border-[var(--accent-purple)]/50 hover:bg-[var(--off-white)]"
                }
              `}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--accent-purple)] flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              )}

              {/* Icon */}
              <div
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center mb-2
                  ${isSelected ? "bg-[var(--accent-purple)] text-white" : "bg-[var(--off-white)] text-[var(--text-muted)]"}
                `}
              >
                <IconComponent className="w-5 h-5" />
              </div>

              {/* Label */}
              <p
                className={`
                  text-sm font-medium leading-tight
                  ${isSelected ? "text-[var(--accent-purple)]" : "text-[var(--text-heading)]"}
                `}
              >
                {option.label}
              </p>

              {/* Description */}
              {option.description && (
                <p className="text-xs text-[var(--text-caption)] mt-1 line-clamp-2">
                  {option.description}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Multi-select checkboxes for asset types
interface MultiSelectProps {
  options: PriorityOption[];
  value: string[];
  onChange: (values: string[]) => void;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  className = "",
}: MultiSelectProps) {
  const handleToggle = (optionValue: string) => {
    const isSelected = value.includes(optionValue);

    if (isSelected) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 ${className}`}>
      {options.map((option) => {
        const isSelected = value.includes(option.value);
        const IconComponent = (option.icon && ICON_MAP[option.icon]) || Heart;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleToggle(option.value)}
            className={`
              flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all
              ${isSelected
                ? "border-[var(--accent-purple)] bg-[var(--accent-muted)]"
                : "border-[var(--border)] hover:border-[var(--accent-purple)]/50"
              }
            `}
          >
            {/* Checkbox */}
            <div
              className={`
                w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all
                ${isSelected
                  ? "border-[var(--accent-purple)] bg-[var(--accent-purple)]"
                  : "border-[var(--border)]"
                }
              `}
            >
              {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
            </div>

            {/* Icon */}
            <div
              className={`
                w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                ${isSelected ? "bg-[var(--accent-purple)] text-white" : "bg-[var(--off-white)] text-[var(--text-muted)]"}
              `}
            >
              <IconComponent className="w-4 h-4" />
            </div>

            {/* Label */}
            <span
              className={`
                text-sm font-medium
                ${isSelected ? "text-[var(--accent-purple)]" : "text-[var(--text-heading)]"}
              `}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
