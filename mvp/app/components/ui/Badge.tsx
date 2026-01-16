"use client";

import { forwardRef, HTMLAttributes } from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "accent";
type BadgeSize = "sm" | "md";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

// Cohere-style badge variants - warm colors, pill-shaped
const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--cream)] text-[var(--text-secondary)]",
  success:
    "bg-[var(--success-muted)] text-[var(--success)]",
  warning:
    "bg-[var(--warning-muted)] text-[var(--warning)]",
  error:
    "bg-[var(--error-muted)] text-[var(--error)]",
  info:
    "bg-[var(--info-muted)] text-[var(--info)]",
  accent:
    "bg-[var(--coral-muted)] text-[var(--coral)]",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-[var(--mushroom-grey)]",
  success: "bg-[var(--success)]",
  warning: "bg-[var(--warning)]",
  error: "bg-[var(--error)]",
  info: "bg-[var(--info)]",
  accent: "bg-[var(--coral)]",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
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

// Tag component for filtering and categories - Cohere style pill tags
type TagVariant = "outline" | "filled" | "muted";
type TagSize = "sm" | "md";

interface TagProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: TagVariant;
  size?: TagSize;
  active?: boolean;
  onClick?: () => void;
}

const tagVariantStyles: Record<TagVariant, string> = {
  outline: "border border-[var(--coral)] text-[var(--coral)] hover:bg-[var(--coral)] hover:text-white",
  filled: "bg-[var(--coral)] text-white",
  muted: "bg-[var(--cream)] text-[var(--text-secondary)] hover:bg-[var(--stone-grey)] hover:text-[var(--text-primary)]",
};

const tagSizeStyles: Record<TagSize, string> = {
  sm: "px-4 py-1.5 text-xs",
  md: "px-5 py-2 text-sm",
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
    const activeStyles = active ? "bg-[var(--coral)] text-white border-[var(--coral)]" : "";

    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center
          font-medium rounded-full
          transition-all duration-[150ms] ease-out
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
