"use client";

import { useSearchParams } from "next/navigation";
import { use, Suspense } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { AnalysisFloatingWidget } from "../../../../components/AnalysisFloatingWidget";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ estatePlanId: string }>;
}

function PrepareLayoutContent({
  children,
  estatePlanId,
}: {
  children: React.ReactNode;
  estatePlanId: string;
}) {
  const searchParams = useSearchParams();
  const runIdParam = searchParams.get("runId");

  return (
    <>
      {children}
      {runIdParam && (
        <AnalysisFloatingWidget
          runId={runIdParam as Id<"gapAnalysisRuns">}
          estatePlanId={estatePlanId}
        />
      )}
    </>
  );
}

export default function PrepareLayout({ children, params }: LayoutProps) {
  const { estatePlanId } = use(params);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-purple)]" />
        </div>
      }
    >
      <PrepareLayoutContent estatePlanId={estatePlanId}>
        {children}
      </PrepareLayoutContent>
    </Suspense>
  );
}
