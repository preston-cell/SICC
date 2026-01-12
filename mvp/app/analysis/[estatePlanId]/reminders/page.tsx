"use client";

import { useState, use, ReactNode } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Link from "next/link";
import { ReminderCard } from "../../../components/ReminderCard";
import { LifeEventsChecklist } from "../../../components/LifeEventsChecklist";

interface PageProps {
  params: Promise<{ estatePlanId: string }>;
}

type ReminderType = "annual_review" | "life_event" | "document_update" | "beneficiary_review" | "custom";
type PriorityType = "low" | "medium" | "high" | "urgent";
type RecurrencePattern = "monthly" | "quarterly" | "annually" | "biannually";

export default function RemindersPage({ params }: PageProps) {
  const { estatePlanId } = use(params);
  const estatePlanIdTyped = estatePlanId as Id<"estatePlans">;

  const [activeTab, setActiveTab] = useState<"reminders" | "life-events" | "settings">("reminders");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    type: "custom" as ReminderType,
    title: "",
    description: "",
    dueDate: "",
    priority: "medium" as PriorityType,
    isRecurring: false,
    recurrencePattern: "annually" as RecurrencePattern,
  });

  const estatePlan = useQuery(api.queries.getEstatePlan, { estatePlanId: estatePlanIdTyped });
  const reminders = useQuery(api.reminders.getReminders, { estatePlanId: estatePlanIdTyped });
  const stats = useQuery(api.reminders.getReminderStats, { estatePlanId: estatePlanIdTyped });
  const createReminder = useMutation(api.reminders.createReminder);
  const createDefaultReminders = useMutation(api.reminders.createDefaultReminders);

  const pendingReminders = reminders?.filter(r => r.status === "pending") || [];
  const overdueReminders = reminders?.filter(r => r.status === "pending" && r.dueDate < Date.now()) || [];
  const completedReminders = reminders?.filter(r => r.status === "completed") || [];

  const handleCreateReminder = async () => {
    if (!newReminder.title || !newReminder.dueDate) return;

    await createReminder({
      estatePlanId: estatePlanIdTyped,
      type: newReminder.type,
      title: newReminder.title,
      description: newReminder.description || undefined,
      dueDate: new Date(newReminder.dueDate).getTime(),
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
    await createDefaultReminders({ estatePlanId: estatePlanIdTyped });
  };

  const StatCard = ({ icon, label, value, color }: { icon: ReactNode; label: string; value: number; color: string }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  );

  if (!estatePlan) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <Link
              href={`/analysis/${estatePlanId}`}
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Analysis
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Reminders & Updates
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
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
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Reminders
              {stats?.pending ? (
                <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                  {stats.pending}
                </span>
              ) : null}
            </button>
            <button
              onClick={() => setActiveTab("life-events")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "life-events"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Life Events
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "settings"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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
              icon={<svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              label="Pending"
              value={stats.pending}
              color="bg-blue-100 dark:bg-blue-900/30"
            />
            <StatCard
              icon={<svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
              label="Overdue"
              value={stats.overdue}
              color="bg-red-100 dark:bg-red-900/30"
            />
            <StatCard
              icon={<svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              label="Completed"
              value={stats.completed}
              color="bg-green-100 dark:bg-green-900/30"
            />
            <StatCard
              icon={<svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
              label="Urgent"
              value={stats.urgent}
              color="bg-orange-100 dark:bg-orange-900/30"
            />
          </div>
        )}

        {/* Reminders Tab */}
        {activeTab === "reminders" && (
          <div className="space-y-6">
            {/* Overdue section */}
            {overdueReminders.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Overdue ({overdueReminders.length})
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {overdueReminders.map((reminder) => (
                    <ReminderCard key={reminder._id} reminder={reminder} />
                  ))}
                </div>
              </div>
            )}

            {/* Pending section */}
            {pendingReminders.filter(r => r.dueDate >= Date.now()).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Upcoming Reminders
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pendingReminders
                    .filter(r => r.dueDate >= Date.now())
                    .sort((a, b) => a.dueDate - b.dueDate)
                    .map((reminder) => (
                      <ReminderCard key={reminder._id} reminder={reminder} />
                    ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {pendingReminders.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Reminders Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
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
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Create Custom Reminder
                  </button>
                </div>
              </div>
            )}

            {/* Completed section */}
            {completedReminders.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-4">
                  Recently Completed
                </h3>
                <div className="space-y-2">
                  {completedReminders.slice(0, 5).map((reminder) => (
                    <div
                      key={reminder._id}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                    >
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="flex-1 text-gray-600 dark:text-gray-400 line-through">
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
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <LifeEventsChecklist estatePlanId={estatePlanIdTyped} />
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Reminder Settings
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Configure how and when you receive reminders about your estate plan.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Annual Review Reminders</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Remind me to review my estate plan each year</p>
                </div>
                <button className="relative w-12 h-6 bg-blue-500 rounded-full transition-colors">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"></span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Beneficiary Review</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Remind me to check beneficiary designations every 6 months</p>
                </div>
                <button className="relative w-12 h-6 bg-blue-500 rounded-full transition-colors">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"></span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Life Event Prompts</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Create reminders when I log major life events</p>
                </div>
                <button className="relative w-12 h-6 bg-blue-500 rounded-full transition-colors">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"></span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
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
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={newReminder.type}
                  onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value as ReminderType })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="custom">Custom Reminder</option>
                  <option value="annual_review">Annual Review</option>
                  <option value="document_update">Document Update</option>
                  <option value="beneficiary_review">Beneficiary Review</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Review retirement account beneficiaries"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Add any helpful details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newReminder.dueDate}
                    onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newReminder.priority}
                    onChange={(e) => setNewReminder({ ...newReminder, priority: e.target.value as PriorityType })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isRecurring" className="text-sm text-gray-700 dark:text-gray-300">
                  Repeat this reminder
                </label>
                {newReminder.isRecurring && (
                  <select
                    value={newReminder.recurrencePattern}
                    onChange={(e) => setNewReminder({ ...newReminder, recurrencePattern: e.target.value as RecurrencePattern })}
                    className="ml-auto px-3 py-1 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
