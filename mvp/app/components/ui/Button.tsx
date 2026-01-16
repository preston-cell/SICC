"use client";

import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "cta" | "link";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  pill?: boolean;
  showArrow?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#1D1D1F] text-white relative overflow-hidden hover:-translate-y-[1px] active:translate-y-0 disabled:bg-gray-300 disabled:opacity-100 btn-gradient-primary",
  secondary:
    "bg-transparent text-[#1D1D1F] border border-[var(--light-gray)] relative overflow-hidden hover:-translate-y-[1px] hover:border-transparent active:translate-y-0 disabled:bg-transparent disabled:text-gray-400 disabled:border-gray-200 btn-gradient-secondary",
  outline:
    "border border-[var(--light-gray)] text-[#1D1D1F] hover:bg-[var(--off-white)] hover:-translate-y-[1px] active:translate-y-0 disabled:border-gray-200 disabled:text-gray-400",
  ghost:
    "text-[var(--foreground)] hover:bg-[var(--off-white)] hover:-translate-y-[1px] active:translate-y-0 disabled:text-gray-400",
  danger:
    "bg-[var(--error)] text-white hover:opacity-90 hover:-translate-y-[1px] active:translate-y-0 disabled:bg-red-300",
  cta:
    "bg-[#1D1D1F] text-white relative overflow-hidden hover:-translate-y-[1px] active:translate-y-0 disabled:bg-gray-400 btn-gradient-primary",
  link:
    "text-[#1D1D1F] font-medium hover:opacity-70 p-0 bg-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm gap-2",
  md: "px-6 py-3 text-base gap-2",
  lg: "px-8 py-4 text-lg gap-3",
};

const iconSizes: Record<ButtonSize, string> = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
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
      pill = false,
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
    const showCtaArrow = variant === "cta" && showArrow;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center
          font-medium
          transition-all duration-200 ease-in-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
          disabled:cursor-not-allowed
          ${pill ? "rounded-[50px]" : "rounded-lg"}
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
        {children}
        {!isLoading && rightIcon && (
          <span className={iconSizes[size]}>{rightIcon}</span>
        )}
        {!isLoading && showCtaArrow && (
          <span className="inline-flex items-center justify-center w-7 h-7 bg-white/10 rounded">
            <ArrowRight className="w-4 h-4" />
          </span>
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

export const LinkButton = forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { showArrow?: boolean }
>(({ children, className = "", showArrow = true, ...props }, ref) => (
  <a
    ref={ref}
    className={`
      inline-flex items-center gap-2
      text-black font-medium
      transition-all duration-200 ease-in-out
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
