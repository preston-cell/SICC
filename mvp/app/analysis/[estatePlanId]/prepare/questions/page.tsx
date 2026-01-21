"use client";

import { use, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PageProps {
  params: Promise<{ estatePlanId: string }>;
}

type QuestionCategory = "documents" | "assets" | "beneficiaries" | "tax" | "general";

const CATEGORY_DISPLAY_NAMES: Record<QuestionCategory, string> = {
  documents: "Documents",
  assets: "Assets & Property",
  beneficiaries: "Beneficiaries",
  tax: "Tax Planning",
  general: "General",
};

const CATEGORY_COLORS: Record<QuestionCategory, string> = {
  documents: "bg-blue-100 text-blue-700",
  assets: "bg-green-100 text-green-700",
  beneficiaries: "bg-purple-100 text-purple-700",
  tax: "bg-yellow-100 text-yellow-700",
  general: "bg-gray-100 text-gray-700",
};

const SUGGESTED_QUESTIONS: { question: string; category: QuestionCategory }[] = [
  { question: "What type of trust would be best for my situation?", category: "documents" },
  { question: "How can I minimize estate taxes for my heirs?", category: "tax" },
  { question: "Should I add my children to my home's deed?", category: "assets" },
  { question: "How do beneficiary designations work with my will?", category: "beneficiaries" },
  { question: "What happens if my executor can't serve?", category: "documents" },
  { question: "How often should I update my estate plan?", category: "general" },
];

export default function QuestionsPage({ params }: PageProps) {
  const { estatePlanId } = use(params);
  const estatePlanIdTyped = estatePlanId as Id<"estatePlans">;
  const searchParams = useSearchParams();
  const runId = searchParams.get("runId");

  const [newQuestion, setNewQuestion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>("general");
  const [filter, setFilter] = useState<"all" | "unanswered" | "answered">("all");

  const questions = useQuery(api.attorneyQuestions.getQuestions, {
    estatePlanId: estatePlanIdTyped,
  });
  const questionCount = useQuery(api.attorneyQuestions.getQuestionCount, {
    estatePlanId: estatePlanIdTyped,
  });

  const createQuestion = useMutation(api.attorneyQuestions.createQuestion);
  const updateQuestion = useMutation(api.attorneyQuestions.updateQuestion);
  const markAnswered = useMutation(api.attorneyQuestions.markAnswered);
  const markUnanswered = useMutation(api.attorneyQuestions.markUnanswered);
  const deleteQuestion = useMutation(api.attorneyQuestions.deleteQuestion);

  const handleAddQuestion = async () => {
    if (!newQuestion.trim()) return;

    await createQuestion({
      estatePlanId: estatePlanIdTyped,
      question: newQuestion.trim(),
      category: selectedCategory,
    });

    setNewQuestion("");
  };

  const handleAddSuggested = async (question: string, category: QuestionCategory) => {
    await createQuestion({
      estatePlanId: estatePlanIdTyped,
      question,
      category,
    });
  };

  const handleToggleAnswered = async (questionId: Id<"attorneyQuestions">, isAnswered: boolean) => {
    if (isAnswered) {
      await markUnanswered({ questionId });
    } else {
      await markAnswered({ questionId });
    }
  };

  const handleDelete = async (questionId: Id<"attorneyQuestions">) => {
    if (confirm("Delete this question?")) {
      await deleteQuestion({ questionId });
    }
  };

  if (!questions) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-purple)]" />
      </div>
    );
  }

  const filteredQuestions = questions.filter((q) => {
    if (filter === "unanswered") return !q.isAnswered;
    if (filter === "answered") return q.isAnswered;
    return true;
  });

  // Get questions that haven't been added yet
  const unusedSuggestions = SUGGESTED_QUESTIONS.filter(
    (s) => !questions.some((q) => q.question.toLowerCase() === s.question.toLowerCase())
  );

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
                Questions for Your Attorney
              </h1>
              <p className="text-[var(--text-muted)] mt-1">
                Write down questions to ask during your consultation
              </p>
            </div>
            {questionCount && (
              <div className="text-right">
                <p className="text-2xl font-bold text-[var(--text-heading)]">
                  {questionCount.total}
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  {questionCount.unanswered} unanswered
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add question form */}
        <div className="mb-8 bg-white rounded-xl border border-[var(--border)] p-6">
          <h3 className="font-semibold text-[var(--text-heading)] mb-4">Add a Question</h3>
          <div className="space-y-4">
            <div>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-purple)] focus:border-transparent resize-none"
                placeholder="What would you like to ask your attorney?"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddQuestion();
                  }
                }}
              />
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as QuestionCategory)}
                className="px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-purple)] focus:border-transparent"
              >
                {(Object.keys(CATEGORY_DISPLAY_NAMES) as QuestionCategory[]).map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_DISPLAY_NAMES[cat]}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddQuestion}
                disabled={!newQuestion.trim()}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Add Question
              </button>
            </div>
          </div>
        </div>

        {/* Suggested questions */}
        {unusedSuggestions.length > 0 && questions.length < 5 && (
          <div className="mb-8 bg-[var(--accent-muted)] rounded-xl p-6">
            <h3 className="font-semibold text-[var(--text-heading)] mb-3">Suggested Questions</h3>
            <div className="space-y-2">
              {unusedSuggestions.slice(0, 4).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleAddSuggested(suggestion.question, suggestion.category)}
                  className="flex items-center gap-3 w-full p-3 bg-white rounded-lg border border-[var(--border)] hover:border-[var(--accent-purple)] hover:shadow-sm transition-all text-left"
                >
                  <svg className="w-5 h-5 text-[var(--accent-purple)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm text-[var(--text-body)] flex-1">{suggestion.question}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[suggestion.category]}`}>
                    {CATEGORY_DISPLAY_NAMES[suggestion.category]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filter tabs */}
        {questions.length > 0 && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-[var(--accent-muted)] text-[var(--accent-purple)]"
                  : "text-[var(--text-muted)] hover:bg-gray-100"
              }`}
            >
              All ({questions.length})
            </button>
            <button
              onClick={() => setFilter("unanswered")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "unanswered"
                  ? "bg-[var(--accent-muted)] text-[var(--accent-purple)]"
                  : "text-[var(--text-muted)] hover:bg-gray-100"
              }`}
            >
              Unanswered ({questionCount?.unanswered || 0})
            </button>
            <button
              onClick={() => setFilter("answered")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "answered"
                  ? "bg-[var(--accent-muted)] text-[var(--accent-purple)]"
                  : "text-[var(--text-muted)] hover:bg-gray-100"
              }`}
            >
              Answered ({questionCount?.answered || 0})
            </button>
          </div>
        )}

        {/* Questions list */}
        {filteredQuestions.length > 0 ? (
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <div
                key={question._id}
                className={`bg-white rounded-xl border p-5 ${
                  question.isAnswered ? "border-green-200 bg-green-50/30" : "border-[var(--border)]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleToggleAnswered(question._id, question.isAnswered)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      question.isAnswered
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 hover:border-[var(--accent-purple)]"
                    }`}
                  >
                    {question.isAnswered && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1">
                    <p
                      className={`text-[var(--text-heading)] ${
                        question.isAnswered ? "line-through text-[var(--text-muted)]" : ""
                      }`}
                    >
                      {question.question}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          CATEGORY_COLORS[(question.category as QuestionCategory) || "general"]
                        }`}
                      >
                        {CATEGORY_DISPLAY_NAMES[(question.category as QuestionCategory) || "general"]}
                      </span>
                      {question.answer && (
                        <span className="text-xs text-green-600">Has notes</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(question._id)}
                    className="p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-[var(--border)]">
            <div className="w-16 h-16 mx-auto mb-4 bg-[var(--accent-muted)] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--accent-purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[var(--text-heading)] mb-2">
              No Questions Yet
            </h3>
            <p className="text-[var(--text-muted)] max-w-md mx-auto">
              Write down questions as you think of them. You&apos;ll have them ready for your attorney consultation.
            </p>
          </div>
        ) : (
          <div className="text-center py-8 text-[var(--text-muted)]">
            No {filter === "answered" ? "answered" : "unanswered"} questions
          </div>
        )}

        {/* Tips box */}
        {questions.length > 0 && (
          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-heading)] mb-1">
                  Tip: Bring This List
                </h3>
                <p className="text-sm text-[var(--text-body)]">
                  Print or save this list before meeting with your attorney. Mark questions as
                  answered during your consultation to track what you&apos;ve discussed.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
