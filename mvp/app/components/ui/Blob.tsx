"use client";

import { HTMLAttributes } from "react";

type BlobVariant = "coral" | "lavender" | "sage" | "quartz";

interface BlobProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BlobVariant;
  size?: number;
  blur?: number;
  opacity?: number;
  animated?: boolean;
  delay?: number;
}

// Cohere-style organic blob colors - warm, natural tones
const variantGradients: Record<BlobVariant, string> = {
  coral: "from-[var(--coral)] to-[var(--coral-light)]",
  lavender: "from-[var(--soft-lavender)] to-[var(--quartz)]",
  sage: "from-[var(--sage-green)] to-[#C8DED1]",
  quartz: "from-[var(--quartz)] to-[var(--quartz-dark)]",
};

export default function Blob({
  variant = "coral",
  size = 300,
  blur = 60,
  opacity = 0.5,
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
