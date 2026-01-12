"use client";

import { forwardRef, HTMLAttributes, ReactNode } from "react";

type AlertType = "info" | "success" | "warning" | "error";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  type?: AlertType;
  title?: string;
  onDismiss?: () => void;
  action?: ReactNode;
}

const typeStyles: Record<AlertType, { container: string; icon: string }> = {
  info: {
    container:
      "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
    icon: "text-blue-600 dark:text-blue-400",
  },
  success: {
    container:
      "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
    icon: "text-green-600 dark:text-green-400",
  },
  warning: {
    container:
      "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
    icon: "text-amber-600 dark:text-amber-400",
  },
  error: {
    container:
      "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
    icon: "text-red-600 dark:text-red-400",
  },
};

const typeIcons: Record<AlertType, ReactNode> = {
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  success: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      type = "info",
      title,
      onDismiss,
      action,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const styles = typeStyles[type];

    return (
      <div
        ref={ref}
        role="alert"
        className={`
          rounded-lg border p-4
          ${styles.container}
          ${className}
        `}
        {...props}
      >
        <div className="flex gap-3">
          <div className={`flex-shrink-0 ${styles.icon}`}>
            {typeIcons[type]}
          </div>
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                {title}
              </h4>
            )}
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {children}
            </div>
            {action && <div className="mt-3">{action}</div>}
          </div>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="flex-shrink-0 p-1 -m-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded"
              aria-label="Dismiss"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = "Alert";

export default Alert;
