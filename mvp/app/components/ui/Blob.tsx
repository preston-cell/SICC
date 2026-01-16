"use client";

import { HTMLAttributes } from "react";

type BlobVariant = "purple" | "blue" | "coral" | "pink";

interface BlobProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BlobVariant;
  size?: number;
  blur?: number;
  opacity?: number;
  animated?: boolean;
  delay?: number;
}

const variantGradients: Record<BlobVariant, string> = {
  purple: "from-[#7B68EE] to-[#5B4ACE]",
  blue: "from-[#4169E1] to-[#1E40AF]",
  coral: "from-[#E86C5F] to-[#DC2626]",
  pink: "from-[#F472B6] to-[#DB2777]",
};

export default function Blob({
  variant = "purple",
  size = 300,
  blur = 40,
  opacity = 0.7,
  animated = true,
  delay = 0,
  className = "",
  style,
  ...props
}: BlobProps) {
  return (
    <div
      className={`
        absolute
        bg-gradient-to-br ${variantGradients[variant]}
        rounded-[60%_40%_30%_70%/60%_30%_70%_40%]
        ${animated ? "animate-blob" : ""}
        pointer-events-none
        ${className}
      `}
      style={{
        width: size,
        height: size,
        filter: `blur(${blur}px)`,
        opacity,
        animationDelay: `${delay}s`,
        ...style,
      }}
      {...props}
    />
  );
}

interface BlobContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function BlobContainer({
  children,
  className = "",
  ...props
}: BlobContainerProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
