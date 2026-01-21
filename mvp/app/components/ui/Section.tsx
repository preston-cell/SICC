"use client";

import { forwardRef, HTMLAttributes } from "react";

type SectionVariant = "default" | "cream" | "lavender" | "dark" | "gradient";
type SectionSize = "sm" | "md" | "lg";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: SectionVariant;
  size?: SectionSize;
  container?: boolean;
  containerNarrow?: boolean;
}

// Cohere-style section backgrounds
const variantStyles: Record<SectionVariant, string> = {
  default: "bg-white text-[var(--text-primary)]",
  cream: "bg-[var(--cream)] text-[var(--text-primary)]",
  lavender: "bg-[var(--soft-lavender)] text-[var(--text-primary)]",
  dark: "bg-[var(--volcanic-black)] text-white",
  gradient: "bg-[var(--gradient-hero)] text-[var(--text-primary)]",
};

const sizeStyles: Record<SectionSize, string> = {
  sm: "py-12 md:py-16",
  md: "py-16 md:py-24",
  lg: "py-20 md:py-32",
};

const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      variant = "default",
      size = "md",
      container = true,
      containerNarrow = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={`
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {container ? (
          <div className={`container ${containerNarrow ? "container-narrow" : ""}`}>
            {children}
          </div>
        ) : (
          children
        )}
      </section>
    );
  }
);

Section.displayName = "Section";

export default Section;

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  label,
  title,
  description,
  centered = false,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`${centered ? "text-center" : ""} mb-12 md:mb-16 ${className}`}>
      {label && (
        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider border border-[var(--coral)] text-[var(--coral)] mb-6">
          {label}
        </span>
      )}
      <h2 className="text-section text-[var(--text-primary)] mb-4">
        {title}
      </h2>
      {description && (
        <p className={`text-body-lg text-[var(--text-secondary)] ${centered ? "max-w-2xl mx-auto" : "max-w-2xl"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
