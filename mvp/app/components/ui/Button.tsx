"use client";

import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "outline" | "accent" | "ghost" | "danger" | "link";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  showArrow?: boolean;
}

// Cohere-style button variants - pill-shaped, clean
const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--volcanic-black)] text-white hover:bg-[#2D2D2B] hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)] active:translate-y-0 disabled:bg-[var(--stone-grey)] disabled:cursor-not-allowed",
  secondary:
    "bg-transparent text-[var(--text-primary)] border border-[var(--border-strong)] hover:bg-[var(--cream)] hover:border-[var(--volcanic-black)] hover:-translate-y-[1px] active:translate-y-0 disabled:text-[var(--text-tertiary)] disabled:border-[var(--border)] disabled:cursor-not-allowed",
  outline:
    "bg-transparent text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--cream)] hover:border-[var(--text-primary)] hover:-translate-y-[1px] active:translate-y-0 disabled:text-[var(--text-tertiary)] disabled:border-[var(--border-light)] disabled:cursor-not-allowed",
  accent:
    "bg-[var(--coral)] text-white hover:bg-[var(--coral-dark)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--cream)] hover:text-[var(--text-primary)] disabled:text-[var(--text-tertiary)] disabled:cursor-not-allowed",
  danger:
    "bg-[var(--error)] text-white hover:opacity-90 hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed",
  link:
    "text-[var(--text-primary)] font-medium hover:opacity-70 p-0 bg-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-5 py-2.5 text-sm gap-2",
  md: "px-7 py-3.5 text-base gap-2",
  lg: "px-9 py-4 text-lg gap-3",
};

const iconSizes: Record<ButtonSize, string> = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-5 h-5",
};

const Spinner = ({ size }: { size: ButtonSize }) => (
  <svg
    className={`animate-spin ${iconSizes[size]}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      showArrow = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;
    const isLinkVariant = variant === "link";

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center
          font-medium
          transition-all duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--coral)] focus-visible:ring-offset-2
          rounded-full
          ${variantStyles[variant]}
          ${isLinkVariant ? "" : sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <Spinner size={size} />
        ) : leftIcon ? (
          <span className={iconSizes[size]}>{leftIcon}</span>
        ) : null}
        <span className="relative z-10">{children}</span>
        {!isLoading && rightIcon && (
          <span className={iconSizes[size]}>{rightIcon}</span>
        )}
        {!isLoading && showArrow && !isLinkVariant && (
          <ArrowRight className={`${iconSizes[size]} transition-transform duration-200`} />
        )}
        {!isLoading && isLinkVariant && showArrow && (
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

// Link button with arrow animation
export const LinkButton = forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { showArrow?: boolean }
>(({ children, className = "", showArrow = true, ...props }, ref) => (
  <a
    ref={ref}
    className={`
      inline-flex items-center gap-2
      text-[var(--text-primary)] font-medium
      transition-all duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)]
      hover:gap-3
      group
      ${className}
    `}
    {...props}
  >
    {children}
    {showArrow && (
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
    )}
  </a>
));

LinkButton.displayName = "LinkButton";
