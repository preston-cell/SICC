"use client";

import { use, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PreparationTaskCard } from "../../../../components/PreparationTaskCard";

interface PageProps {
  params: Promise<{ estatePlanId: string }>;
}

export default function PreparePage({ params }: PageProps) {
  const { estatePlanId } = use(params);
  const estatePlanIdTyped = estatePlanId as Id<"estatePlans">;
  const searchParams = useSearchParams();
  const runId = searchParams.get("runId");

  const estatePlan = useQuery(api.queries.getEstatePlan, { estatePlanId: estatePlanIdTyped });
  const preparationProgress = useQuery(api.preparationTasks.getPreparationProgress, {
    estatePlanId: estatePlanIdTyped,
  });
  const contactCount = useQuery(api.familyContacts.getContactCount, {
    estatePlanId: estatePlanIdTyped,
  });
  const questionCount = useQuery(api.attorneyQuestions.getQuestionCount, {
    estatePlanId: estatePlanIdTyped,
  });

  const generateChecklist = useMutation(api.preparationTasks.generateChecklist);

  // Auto-generate checklist if not exists
  useEffect(() => {
    if (preparationProgress && preparationProgress.documents.total === 0) {
      generateChecklist({ estatePlanId: estatePlanIdTyped });
    }
  }, [preparationProgress, estatePlanIdTyped, generateChecklist]);

  if (!estatePlan) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-purple)]" />
      </div>
    );
  }

  const documentsComplete =
    preparationProgress &&
    preparationProgress.documents.total > 0 &&
    preparationProgress.documents.completed === preparationProgress.documents.total;

  const contactsComplete = contactCount !== undefined && contactCount >= 2;
  const questionsAdded = questionCount !== undefined && questionCount.total > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href={`/analysis/${estatePlanId}`}
                className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-body)] mb-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Analysis
              </Link>
              <h1 className="text-2xl font-bold text-[var(--text-heading)]">
                While Your Analysis Runs...
              </h1>
              <p className="text-[var(--text-muted)] mt-1">
                Complete these tasks to prepare for your estate plan
              </p>
            </div>
            <Link
              href={`/analysis/${estatePlanId}`}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-purple)]"
            >
              Skip to Results →
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Task cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <PreparationTaskCard
            title="Gather Important Documents"
            description="Collect key documents needed for your estate plan"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            href={`/analysis/${estatePlanId}/prepare/documents${runId ? `?runId=${runId}` : ""}`}
            progress={
              preparationProgress
                ? {
                    current: preparationProgress.documents.completed,
                    total: preparationProgress.documents.total,
                    unit: "gathered",
                  }
                : undefined
            }
            estimatedTime="~10 minutes"
            isComplete={documentsComplete}
          />

          <PreparationTaskCard
            title="Family & Advisor Contacts"
            description="Add contact info for key people in your plan"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            href={`/analysis/${estatePlanId}/prepare/contacts${runId ? `?runId=${runId}` : ""}`}
            progress={
              contactCount !== undefined
                ? {
                    current: contactCount,
                    total: 6,
                    unit: "contacts",
                  }
                : undefined
            }
            estimatedTime="~8 minutes"
            isComplete={contactsComplete}
          />

          <PreparationTaskCard
            title="Questions for Your Attorney"
            description="Write down questions to ask during your consultation"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            href={`/analysis/${estatePlanId}/prepare/questions${runId ? `?runId=${runId}` : ""}`}
            progress={
              questionCount !== undefined
                ? {
                    current: questionCount.total,
                    total: 5,
                    unit: "questions",
                  }
                : undefined
            }
            estimatedTime="~5 minutes"
            isComplete={questionsAdded}
          />
        </div>

        {/* Info box */}
        <div className="mt-8 bg-[var(--accent-muted)] rounded-xl p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-[var(--accent-purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-heading)] mb-1">
                Why complete these tasks?
              </h3>
              <p className="text-sm text-[var(--text-body)]">
                Having your documents organized, contacts ready, and questions prepared will make
                your consultation with an estate planning attorney much more productive. These
                tasks take advantage of the time while your comprehensive analysis runs.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
