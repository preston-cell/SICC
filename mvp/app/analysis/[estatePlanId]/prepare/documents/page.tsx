"use client";

import { use, useEffect } from "react";
import {
  useDocumentChecklist,
  useChecklistProgress,
  generateDocumentChecklist,
  updateChecklistItemStatus,
} from "@/app/hooks/usePrismaQueries";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PageProps {
  params: Promise<{ estatePlanId: string }>;
}

type ChecklistCategory =
  | "real_estate"
  | "financial"
  | "retirement"
  | "insurance"
  | "business"
  | "personal"
  | "existing_documents";

const CATEGORY_DISPLAY_NAMES: Record<ChecklistCategory, string> = {
  real_estate: "Real Estate",
  financial: "Financial Accounts",
  retirement: "Retirement Accounts",
  insurance: "Insurance",
  business: "Business",
  personal: "Personal Documents",
  existing_documents: "Existing Estate Documents",
};

const CATEGORY_ICONS: Record<ChecklistCategory, React.ReactNode> = {
  real_estate: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  financial: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  retirement: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  insurance: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  business: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  personal: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  existing_documents: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
};

export default function DocumentsPage({ params }: PageProps) {
  const { estatePlanId } = use(params);
  const searchParams = useSearchParams();
  const runId = searchParams.get("runId");

  const { data: checklistItems, mutate: mutateItems } = useDocumentChecklist(estatePlanId);
  const { data: checklistProgress } = useChecklistProgress(estatePlanId);

  // Auto-generate checklist if not exists
  useEffect(() => {
    if (checklistItems && checklistItems.length === 0) {
      generateDocumentChecklist(estatePlanId).then(() => mutateItems());
    }
  }, [checklistItems, estatePlanId, mutateItems]);

  if (!checklistItems) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-purple)]" />
      </div>
    );
  }

  interface ChecklistItem {
    id: string;
    title: string;
    description?: string | null;
    category: string;
    status: string;
  }

  // Group items by category
  const itemsByCategory = (checklistItems as ChecklistItem[]).reduce(
    (acc: Record<ChecklistCategory, ChecklistItem[]>, item: ChecklistItem) => {
      const category = item.category as ChecklistCategory;
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    },
    {} as Record<ChecklistCategory, ChecklistItem[]>
  );

  const handleStatusChange = async (
    itemId: string,
    status: "not_gathered" | "in_progress" | "gathered"
  ) => {
    await updateChecklistItemStatus(estatePlanId, itemId, status);
    mutateItems();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "gathered":
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "in_progress":
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href={`/analysis/${estatePlanId}/prepare${runId ? `?runId=${runId}` : ""}`}
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-body)] mb-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Tasks
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-heading)]">
                Document Gathering Checklist
              </h1>
              <p className="text-[var(--text-muted)] mt-1">
                Collect these documents to prepare for your estate plan
              </p>
            </div>
            {checklistProgress && (
              <div className="text-right">
                <p className="text-2xl font-bold text-[var(--text-heading)]">
                  {checklistProgress.gathered}/{checklistProgress.total}
                </p>
                <p className="text-sm text-[var(--text-muted)]">documents gathered</p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress bar */}
        {checklistProgress && (
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[var(--text-muted)]">Overall Progress</span>
              <span className="font-medium text-[var(--text-heading)]">
                {checklistProgress.percentComplete}%
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${checklistProgress.percentComplete}%` }}
              />
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="space-y-6">
          {(Object.keys(itemsByCategory) as ChecklistCategory[]).map((category) => (
            <div key={category} className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <div className="text-[var(--accent-purple)]">
                    {CATEGORY_ICONS[category]}
                  </div>
                  <h2 className="font-semibold text-[var(--text-heading)]">
                    {CATEGORY_DISPLAY_NAMES[category]}
                  </h2>
                  <span className="text-sm text-[var(--text-muted)]">
                    {itemsByCategory[category].filter((i) => i.status === "gathered").length}/
                    {itemsByCategory[category].length}
                  </span>
                </div>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {itemsByCategory[category].map((item) => (
                  <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                    <button
                      onClick={() => {
                        const nextStatus =
                          item.status === "not_gathered"
                            ? "in_progress"
                            : item.status === "in_progress"
                            ? "gathered"
                            : "not_gathered";
                        handleStatusChange(item.id, nextStatus);
                      }}
                      className="flex-shrink-0 hover:opacity-80 transition-opacity"
                    >
                      {getStatusIcon(item.status)}
                    </button>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          item.status === "gathered"
                            ? "text-[var(--text-muted)] line-through"
                            : "text-[var(--text-heading)]"
                        }`}
                      >
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-sm text-[var(--text-muted)]">{item.description}</p>
                      )}
                    </div>
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(
                          item.id,
                          e.target.value as "not_gathered" | "in_progress" | "gathered"
                        )
                      }
                      className="text-sm border border-[var(--border)] rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-purple)]"
                    >
                      <option value="not_gathered">Not Gathered</option>
                      <option value="in_progress">In Progress</option>
                      <option value="gathered">Gathered</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {checklistItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--text-muted)]">Loading checklist...</p>
          </div>
        )}
      </main>
    </div>
  );
}
