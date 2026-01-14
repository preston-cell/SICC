"use client";

import { forwardRef, HTMLAttributes } from "react";

type SkeletonVariant = "text" | "circular" | "rectangular";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: "rounded",
  circular: "rounded-full",
  rectangular: "rounded-lg",
};

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = "text",
      width,
      height,
      lines = 1,
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    const baseStyle = {
      width: typeof width === "number" ? `${width}px` : width,
      height: typeof height === "number" ? `${height}px` : height,
      ...style,
    };

    if (lines > 1) {
      return (
        <div ref={ref} className={`space-y-2 ${className}`} {...props}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={`
                animate-shimmer
                ${variantStyles[variant]}
                ${!height ? "h-4" : ""}
                ${!width && i === lines - 1 ? "w-3/4" : !width ? "w-full" : ""}
              `}
              style={baseStyle}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`
          animate-shimmer
          ${variantStyles[variant]}
          ${!height ? "h-4" : ""}
          ${!width ? "w-full" : ""}
          ${className}
        `}
        style={baseStyle}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

// Pre-built skeleton patterns for common use cases
export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1">
          <Skeleton width="60%" height={20} className="mb-2" />
          <Skeleton width="40%" height={16} />
        </div>
      </div>
      <Skeleton lines={3} />
    </div>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1">
            <Skeleton width="70%" height={16} className="mb-1" />
            <Skeleton width="50%" height={14} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton width={80} height={16} className="mb-2" />
        <Skeleton height={40} variant="rectangular" />
      </div>
      <div>
        <Skeleton width={100} height={16} className="mb-2" />
        <Skeleton height={40} variant="rectangular" />
      </div>
      <div>
        <Skeleton width={120} height={16} className="mb-2" />
        <Skeleton height={80} variant="rectangular" />
      </div>
      <Skeleton width={120} height={44} variant="rectangular" />
    </div>
  );
}

export default Skeleton;
