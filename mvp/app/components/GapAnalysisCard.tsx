"use client";

import { ReactNode } from "react";

type Priority = "high" | "medium" | "low";

interface GapAnalysisCardProps {
  type: "missing" | "outdated" | "inconsistency" | "recommendation" | "note";
  title: string;
  description: string;
  priority?: Priority;
  action?: ReactNode;
}

const TYPE_CONFIG = {
  missing: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    iconColor: "text-red-500",
    titleColor: "text-red-800 dark:text-red-300",
  },
  outdated: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    iconColor: "text-yellow-500",
    titleColor: "text-yellow-800 dark:text-yellow-300",
  },
  inconsistency: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    iconColor: "text-orange-500",
    titleColor: "text-orange-800 dark:text-orange-300",
  },
  recommendation: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-500",
    titleColor: "text-blue-800 dark:text-blue-300",
  },
  note: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: "bg-gray-50 dark:bg-gray-700",
    borderColor: "border-gray-200 dark:border-gray-600",
    iconColor: "text-gray-500",
    titleColor: "text-gray-800 dark:text-gray-200",
  },
};

const PRIORITY_BADGE = {
  high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

export default function GapAnalysisCard({
  type,
  title,
  description,
  priority,
  action,
}: GapAnalysisCardProps) {
  const config = TYPE_CONFIG[type];

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${config.iconColor}`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className={`font-medium ${config.titleColor}`}>{title}</h4>
            {priority && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_BADGE[priority]}`}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
          {action && <div className="mt-3">{action}</div>}
        </div>
      </div>
    </div>
  );
}

// Score ring component
interface ScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function ScoreRing({ score, size = "md" }: ScoreRingProps) {
  const sizeConfig = {
    sm: { ring: 60, stroke: 6, text: "text-lg" },
    md: { ring: 100, stroke: 8, text: "text-2xl" },
    lg: { ring: 140, stroke: 10, text: "text-4xl" },
  };

  const config = sizeConfig[size];
  const radius = (config.ring - config.stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={config.ring} height={config.ring} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={config.ring / 2}
          cy={config.ring / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.stroke}
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={config.ring / 2}
          cy={config.ring / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${getColor(score)} transition-all duration-500`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-bold ${config.text} ${getColor(score)}`}>{score}</span>
      </div>
    </div>
  );
}

// Document type display names
export const DOCUMENT_TYPE_NAMES: Record<string, string> = {
  will: "Last Will & Testament",
  trust: "Revocable Living Trust",
  poa_financial: "Financial Power of Attorney",
  poa_healthcare: "Healthcare Power of Attorney",
  healthcare_directive: "Healthcare Directive / Living Will",
  hipaa: "HIPAA Authorization",
  other: "Other Document",
};
