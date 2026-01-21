"use client";

import { Heart } from "lucide-react";

interface EmotionalBannerProps {
  message: string;
  variant?: "default" | "encouragement" | "completion";
}

export function EmotionalBanner({ message, variant = "default" }: EmotionalBannerProps) {
  const variants = {
    default: {
      bg: "bg-[var(--accent-muted)]",
      border: "border-[var(--accent-purple)]/20",
      icon: "text-[var(--accent-purple)]",
      text: "text-[var(--accent-purple)]",
    },
    encouragement: {
      bg: "bg-[var(--info-muted)]",
      border: "border-[var(--info)]/20",
      icon: "text-[var(--info)]",
      text: "text-[var(--info)]",
    },
    completion: {
      bg: "bg-[var(--success-muted)]",
      border: "border-[var(--success)]/20",
      icon: "text-[var(--success)]",
      text: "text-[var(--success)]",
    },
  };

  const style = variants[variant];

  return (
    <div className={`${style.bg} border ${style.border} rounded-xl p-4`}>
      <div className="flex items-start gap-3">
        <Heart className={`w-5 h-5 flex-shrink-0 mt-0.5 ${style.icon}`} />
        <p className={`text-sm ${style.text}`}>
          {message}
          {variant === "default" && (
            <span className="block mt-1 opacity-80">
              There&apos;s no rush - save your progress and return anytime.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
