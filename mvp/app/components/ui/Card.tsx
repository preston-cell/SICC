"use client";

import { forwardRef, HTMLAttributes, ReactNode } from "react";

type CardVariant = "default" | "elevated" | "outlined";

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

const variantStyles: Record<CardVariant, string> = {
  default:
    "bg-white dark:bg-gray-800 shadow-sm",
  elevated:
    "bg-white dark:bg-gray-800 shadow-lg",
  outlined:
    "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
};

const paddingStyles = {
  none: "",
  sm: "p-4",
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
          rounded-xl
          transition-all duration-200
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${interactive ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:translate-y-0" : ""}
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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
          ${bordered ? "border-t border-gray-200 dark:border-gray-700" : ""}
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
