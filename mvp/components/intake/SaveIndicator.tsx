"use client";

import { Check, Loader2, AlertCircle, Cloud } from "lucide-react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface SaveIndicatorProps {
  status: SaveStatus;
  lastSaved?: Date | null;
  error?: string | null;
}

export function SaveIndicator({ status, lastSaved, error }: SaveIndicatorProps) {
  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (seconds < 10) return "Just now";
    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      {status === "saving" && (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--text-muted)]" />
          <span className="text-[var(--text-muted)]">Saving...</span>
        </>
      )}

      {status === "saved" && (
        <>
          <div className="flex items-center gap-1 text-[var(--success)]">
            <Cloud className="w-3.5 h-3.5" />
            <Check className="w-3 h-3" />
          </div>
          <span className="text-[var(--text-muted)]">
            Saved {lastSaved ? formatLastSaved(lastSaved) : ""}
          </span>
        </>
      )}

      {status === "error" && (
        <>
          <AlertCircle className="w-3.5 h-3.5 text-[var(--error)]" />
          <span className="text-[var(--error)]">
            {error || "Failed to save"}
          </span>
        </>
      )}

      {status === "idle" && lastSaved && (
        <>
          <Cloud className="w-3.5 h-3.5 text-[var(--text-caption)]" />
          <span className="text-[var(--text-caption)]">
            Last saved {formatLastSaved(lastSaved)}
          </span>
        </>
      )}
    </div>
  );
}
