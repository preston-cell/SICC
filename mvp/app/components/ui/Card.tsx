"use client";

import { forwardRef, HTMLAttributes, ReactNode } from "react";

type CardVariant = "default" | "elevated" | "outlined" | "feature";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: ReactNode;
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
}

// Cohere-style card variants - soft shadows, hover lift
const variantStyles: Record<CardVariant, string> = {
  default:
    "bg-white border border-[var(--border-light)] rounded-[var(--radius-lg)]",
  elevated:
    "bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-md)]",
  outlined:
    "bg-white border border-[var(--border)] rounded-[var(--radius-lg)]",
  feature:
    "bg-white border border-[var(--border-light)] rounded-[var(--radius-lg)] hover:border-[var(--coral)]",
};

const paddingStyles = {
  none: "",
  sm: "p-5",
  md: "p-6",
  lg: "p-8",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      interactive = false,
      padding = "md",
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${interactive ? "cursor-pointer hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, description, action, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-start justify-between gap-4 mb-4 ${className}`}
        {...props}
      >
        {(title || description) ? (
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="text-lg font-medium text-[var(--text-primary)] truncate">
                {title}
              </h4>
            )}
            {description && (
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {description}
              </p>
            )}
          </div>
        ) : children}
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ bordered = false, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          mt-4 pt-4 flex items-center gap-3
          ${bordered ? "border-t border-[var(--border-light)]" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter };
export default Card;
