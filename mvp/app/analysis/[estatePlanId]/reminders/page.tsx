"use client";

import { useState, use, ReactNode } from "react";
import {
  useEstatePlan,
  useReminders,
  useReminderStats,
  createReminder,
  createDefaultReminders,
  generateActionItems,
} from "../../../hooks/usePrismaQueries";
import Link from "next/link";
import { ReminderCard } from "../../../components/ReminderCard";
import { LifeEventsChecklist } from "../../../components/LifeEventsChecklist";
import Badge from "../../../components/ui/Badge";

interface PageProps {
  params: Promise<{ estatePlanId: string }>;
}

type ReminderType = "annual_review" | "life_event" | "document_update" | "beneficiary_review" | "custom";
type PriorityType = "low" | "medium" | "high" | "urgent";
type RecurrencePattern = "monthly" | "quarterly" | "annually" | "biannually";

interface Reminder {
  id?: string;
  _id?: string;
  type: "annual_review" | "life_event" | "document_update" | "beneficiary_review" | "custom";
  title: string;
  description?: string;
  dueDate: number | string;
  status: "pending" | "completed" | "snoozed" | "dismissed";
  priority: "low" | "medium" | "high" | "urgent";
  isRecurring: boolean;
  recurrencePattern?: string;
  completedAt?: string;
}

interface Recommendation {
  rank?: number;
  action?: string;
  category?: string;
  priority?: "critical" | "high" | "medium" | "low";
  timeline?: string;
  estimatedCost?: { low: number; high: number };
  estimatedBenefit?: string;
  detailedSteps?: string[];
  professionalNeeded?: string;
  riskOfDelay?: string;
  reason?: string;
}

export default function RemindersPage({ params }: PageProps) {
  const { estatePlanId } = use(params);
  const estatePlanIdTyped = estatePlanId as string;

  const [activeTab, setActiveTab] = useState<"reminders" | "life-events" | "settings">("reminders");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [newReminder, setNewReminder] = useState({
    type: "custom" as ReminderType,
    title: "",
    description: "",
    dueDate: "",
    priority: "medium" as PriorityType,
    isRecurring: false,
    recurrencePattern: "annually" as RecurrencePattern,
  });

  const { data: estatePlan, isLoading: estatePlanLoading } = useEstatePlan(estatePlanIdTyped);
  const { data: reminders, isLoading: remindersLoading } = useReminders(estatePlanIdTyped);
  const { data: stats } = useReminderStats(estatePlanIdTyped);

  // Parse recommendations from gap analysis (for future use when gap analysis API is integrated)
  const recommendations: Recommendation[] = [];
  const hasImportedRecommendations = reminders?.some((r: { sourceType?: string }) => r.sourceType === "gap_analysis") ?? false;

  const pendingReminders = reminders?.filter((r: { status: string; dueDate: number }) => r.status === "pending") || [];
  const overdueReminders = reminders?.filter((r: { status: string; dueDate: number }) => r.status === "pending" && new Date(r.dueDate) < new Date()) || [];
  const completedReminders = reminders?.filter((r: { status: string; dueDate: number }) => r.status === "completed") || [];

  const handleCreateReminder = async () => {
    if (!newReminder.title || !newReminder.dueDate) return;

    await createReminder(estatePlanIdTyped, {
      type: newReminder.type,
      title: newReminder.title,
      description: newReminder.description || undefined,
      dueDate: new Date(newReminder.dueDate).toISOString(),
      priority: newReminder.priority,
      isRecurring: newReminder.isRecurring,
      recurrencePattern: newReminder.isRecurring ? newReminder.recurrencePattern : undefined,
    });

    setShowAddForm(false);
    setNewReminder({
      type: "custom",
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      isRecurring: false,
      recurrencePattern: "annually",
    });
  };

  const handleSetupDefaultReminders = async () => {
    await createDefaultReminders(estatePlanIdTyped);
  };

  const StatCard = ({ icon, label, value, color }: { icon: ReactNode; label: string; value: number; color: string }) => (
    <div className="bg-white rounded-xl p-4 border border-[var(--border)]">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--text-heading)]">{value}</p>
          <p className="text-sm text-[var(--text-muted)]">{label}</p>
        </div>
      </div>
    </div>
  );

  if (!estatePlan) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <Link
              href={`/analysis/${estatePlanId}`}
              className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-body)] mb-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Analysis
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-heading)]">
                  Reminders & Updates
                </h1>
                <p className="text-[var(--text-muted)] mt-1">
                  Stay on top of your estate plan with timely reminders
                </p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Reminder
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("reminders")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "reminders"
                  ? "border-blue-500 text-[var(--accent-purple)]"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-body)]"
              }`}
            >
              Reminders
              {stats?.pending ? (
                <span className="ml-2 px-2 py-0.5 text-xs bg-[var(--accent-muted)] text-blue-700 dark:text-blue-400 rounded-full">
                  {stats.pending}
                </span>
              ) : null}
            </button>
            <button
              onClick={() => setActiveTab("life-events")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "life-events"
                  ? "border-blue-500 text-[var(--accent-purple)]"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-body)]"
              }`}
            >
              Life Events
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "settings"
                  ? "border-blue-500 text-[var(--accent-purple)]"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-body)]"
              }`}
            >
              Settings
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats cards */}
        {activeTab === "reminders" && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<svg className="w-5 h-5 text-[var(--accent-purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              label="Pending"
              value={stats.pending}
              color="bg-[var(--accent-muted)]"
            />
            <StatCard
              icon={<svg className="w-5 h-5 text-[var(--error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
              label="Overdue"
              value={stats.overdue}
              color="bg-[var(--error-muted)]"
            />
            <StatCard
              icon={<svg className="w-5 h-5 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              label="Completed"
              value={stats.completed}
              color="bg-[var(--success-muted)]"
            />
            <StatCard
              icon={<svg className="w-5 h-5 text-[var(--warning)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
              label="Urgent"
              value={0}
              color="bg-[var(--warning-muted)]"
            />
          </div>
        )}

        {/* Reminders Tab */}
        {activeTab === "reminders" && (
          <div className="space-y-6">
            {/* Recommended Actions from Gap Analysis */}
            {recommendations.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[var(--text-heading)] flex items-center gap-2">
                    <svg className="w-5 h-5 text-[var(--accent-purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Recommended Actions ({recommendations.length})
                  </h3>
                  {!hasImportedRecommendations && (
                    <button
                      onClick={async () => {
                        setIsImporting(true);
                        try {
                          await generateActionItems({ estatePlanId: estatePlanIdTyped });
                        } finally {
                          setIsImporting(false);
                        }
                      }}
                      disabled={isImporting}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-[var(--accent-muted)] text-[var(--accent-purple)] font-medium rounded-lg hover:bg-[var(--accent-purple)] hover:text-white transition-all disabled:opacity-50"
                    >
                      {isImporting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          Importing...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add to Reminders
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {recommendations.map((rec, idx) => {
                    const priority = rec.priority || "medium";
                    const priorityColors = {
                      critical: "border-red-500 bg-red-50",
                      high: "border-red-400 bg-red-50",
                      medium: "border-yellow-400 bg-yellow-50",
                      low: "border-green-400 bg-green-50",
                    };
                    return (
                      <div
                        key={idx}
                        className={`rounded-xl border-l-4 p-4 bg-white shadow-sm ${priorityColors[priority]}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-[var(--text-heading)] text-sm">
                            {rec.action || "Recommendation"}
                          </h4>
                          <Badge
                            variant={priority === "critical" || priority === "high" ? "error" : priority === "medium" ? "warning" : "success"}
                            size="sm"
                          >
                            {priority}
                          </Badge>
                        </div>
                        {rec.reason && (
                          <p className="text-xs text-[var(--text-muted)] mb-2 line-clamp-2">{rec.reason}</p>
                        )}
                        {rec.timeline && (
                          <p className="text-xs text-[var(--text-body)]">
                            <span className="font-medium">Timeline:</span> {rec.timeline}
                          </p>
                        )}
                        {rec.estimatedCost && (
                          <p className="text-xs text-[var(--text-muted)] mt-1">
                            Est. cost: ${rec.estimatedCost.low?.toLocaleString()} - ${rec.estimatedCost.high?.toLocaleString()}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
                {hasImportedRecommendations && (
                  <p className="text-xs text-[var(--text-muted)] mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    These recommendations have been added to your reminders below
                  </p>
                )}
              </div>
            )}

            {/* Overdue section */}
            {overdueReminders.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-[var(--error)] mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Overdue ({overdueReminders.length})
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {overdueReminders.map((reminder: Reminder) => (
                    <ReminderCard key={reminder.id || reminder._id} reminder={reminder} estatePlanId={estatePlanIdTyped} />
                  ))}
                </div>
              </div>
            )}

            {/* Pending section */}
            {pendingReminders.filter((r: Reminder) => new Date(r.dueDate) >= new Date()).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-heading)] mb-4">
                  Upcoming Reminders
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {(pendingReminders as Reminder[])
                    .filter(r => new Date(r.dueDate) >= new Date())
                    .sort((a: Reminder, b: Reminder) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .map((reminder) => (
                      <ReminderCard key={reminder.id || reminder._id} reminder={reminder} estatePlanId={estatePlanIdTyped} />
                    ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {pendingReminders.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-[var(--border)]">
                <div className="w-16 h-16 mx-auto mb-4 bg-[var(--off-white)] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-[var(--text-heading)] mb-2">
                  No Reminders Yet
                </h3>
                <p className="text-[var(--text-muted)] max-w-md mx-auto mb-6">
                  Set up reminders to stay on top of your estate plan reviews and important updates.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleSetupDefaultReminders}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
                  >
                    Set Up Default Reminders
                  </button>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-[var(--off-white)] text-[var(--text-body)] font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Create Custom Reminder
                  </button>
                </div>
              </div>
            )}

            {/* Completed section */}
            {completedReminders.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-muted)] mb-4">
                  Recently Completed
                </h3>
                <div className="space-y-2">
                  {completedReminders.slice(0, 5).map((reminder: Reminder) => (
                    <div
                      key={reminder.id || reminder._id}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                    >
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="flex-1 text-[var(--text-body)] line-through">
                        {reminder.title}
                      </span>
                      <span className="text-xs text-gray-400">
                        {reminder.completedAt && new Date(reminder.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Life Events Tab */}
        {activeTab === "life-events" && (
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <LifeEventsChecklist estatePlanId={estatePlanIdTyped} />
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-xl border border-[var(--border)] p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-heading)] mb-2">
                Reminder Settings
              </h3>
              <p className="text-[var(--text-muted)]">
                Configure how and when you receive reminders about your estate plan.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                <div>
                  <p className="font-medium text-[var(--text-heading)]">Annual Review Reminders</p>
                  <p className="text-sm text-[var(--text-muted)]">Remind me to review my estate plan each year</p>
                </div>
                <button className="relative w-12 h-6 bg-blue-500 rounded-full transition-colors">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"></span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                <div>
                  <p className="font-medium text-[var(--text-heading)]">Beneficiary Review</p>
                  <p className="text-sm text-[var(--text-muted)]">Remind me to check beneficiary designations every 6 months</p>
                </div>
                <button className="relative w-12 h-6 bg-blue-500 rounded-full transition-colors">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"></span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                <div>
                  <p className="font-medium text-[var(--text-heading)]">Life Event Prompts</p>
                  <p className="text-sm text-[var(--text-muted)]">Create reminders when I log major life events</p>
                </div>
                <button className="relative w-12 h-6 bg-blue-500 rounded-full transition-colors">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"></span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border)]">
              <button
                onClick={handleSetupDefaultReminders}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
              >
                Reset to Default Reminders
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Add Reminder Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--text-heading)]">
                Add New Reminder
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-body)] mb-1">
                  Type
                </label>
                <select
                  value={newReminder.type}
                  onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value as ReminderType })}
                  className="w-full px-3 py-2 bg-white border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="custom">Custom Reminder</option>
                  <option value="annual_review">Annual Review</option>
                  <option value="document_update">Document Update</option>
                  <option value="beneficiary_review">Beneficiary Review</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-body)] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Review retirement account beneficiaries"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-body)] mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-white border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Add any helpful details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-body)] mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newReminder.dueDate}
                    onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-body)] mb-1">
                    Priority
                  </label>
                  <select
                    value={newReminder.priority}
                    onChange={(e) => setNewReminder({ ...newReminder, priority: e.target.value as PriorityType })}
                    className="w-full px-3 py-2 bg-white border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={newReminder.isRecurring}
                  onChange={(e) => setNewReminder({ ...newReminder, isRecurring: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-white border-[var(--border)] rounded focus:ring-blue-500"
                />
                <label htmlFor="isRecurring" className="text-sm text-[var(--text-body)]">
                  Repeat this reminder
                </label>
                {newReminder.isRecurring && (
                  <select
                    value={newReminder.recurrencePattern}
                    onChange={(e) => setNewReminder({ ...newReminder, recurrencePattern: e.target.value as RecurrencePattern })}
                    className="ml-auto px-3 py-1 text-sm bg-white border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="biannually">Every 6 months</option>
                    <option value="annually">Yearly</option>
                  </select>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCreateReminder}
                disabled={!newReminder.title || !newReminder.dueDate}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Create Reminder
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-[var(--off-white)] text-[var(--text-body)] font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
