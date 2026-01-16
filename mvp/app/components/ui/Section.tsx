"use client";

import { forwardRef, HTMLAttributes } from "react";

type SectionVariant = "default" | "cream" | "lavender" | "dark" | "deep-purple";
type SectionSize = "sm" | "md" | "lg";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: SectionVariant;
  size?: SectionSize;
  container?: boolean;
  containerNarrow?: boolean;
}

const variantStyles: Record<SectionVariant, string> = {
  default: "bg-white text-[var(--foreground)]",
  cream: "bg-[var(--off-white)] text-[var(--foreground)]",
  lavender: "bg-gradient-to-b from-[var(--lavender)] to-[#A89CF5] text-[var(--foreground)]",
  dark: "bg-gradient-to-br from-[#1A1A2E] to-[#16213E] text-white",
  "deep-purple": "bg-[var(--deep-purple)] text-white",
};

const sizeStyles: Record<SectionSize, string> = {
  sm: "py-12 md:py-16",
  md: "py-16 md:py-20",
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
        <span className="text-label mb-4 block">
          {label}
        </span>
      )}
      <h2 className="text-section text-[#1D1D1F] mb-4">
        {title}
      </h2>
      {description && (
        <p className={`text-body-lg text-[var(--foreground-muted)] ${centered ? "max-w-2xl mx-auto" : "max-w-2xl"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
