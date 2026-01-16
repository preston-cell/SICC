"use client";

import { forwardRef, HTMLAttributes } from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info";
type BadgeSize = "sm" | "md";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  success:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  warning:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  error:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  info:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-gray-500",
  success: "bg-green-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
  info: "bg-blue-500",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

const dotSizes: Record<BadgeSize, string> = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "default",
      size = "sm",
      dot = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center gap-1.5
          font-medium rounded-full
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {dot && (
          <span
            className={`rounded-full flex-shrink-0 ${dotColors[variant]} ${dotSizes[size]}`}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;

// Tag component for filtering and categories
type TagVariant = "outline" | "filled" | "neutral";
type TagSize = "sm" | "md";

interface TagProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: TagVariant;
  size?: TagSize;
  active?: boolean;
  onClick?: () => void;
}

const tagVariantStyles: Record<TagVariant, string> = {
  outline: "border border-[var(--accent-purple)] text-[var(--accent-purple)] hover:bg-[var(--accent-purple)] hover:text-white",
  filled: "bg-[var(--accent-purple)] text-white",
  neutral: "border border-[var(--light-gray)] text-[var(--medium-gray)] hover:border-[var(--medium-gray)] hover:text-[var(--dark-gray)]",
};

const tagSizeStyles: Record<TagSize, string> = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-1.5 text-sm",
};

export const Tag = forwardRef<HTMLButtonElement, TagProps>(
  (
    {
      variant = "outline",
      size = "md",
      active = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const activeStyles = active ? "bg-[var(--accent-purple)] text-white border-[var(--accent-purple)]" : "";

    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center
          font-medium rounded-full
          transition-all duration-200
          cursor-pointer
          ${tagVariantStyles[variant]}
          ${tagSizeStyles[size]}
          ${activeStyles}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Tag.displayName = "Tag";
