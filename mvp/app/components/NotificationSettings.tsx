"use client";

import { useState } from "react";
import Toggle from "./ui/Toggle";

interface NotificationSettingsProps {
  estatePlanId: string;
  onSetupDefaultReminders: () => void;
}

export function NotificationSettings({
  estatePlanId,
  onSetupDefaultReminders,
}: NotificationSettingsProps) {
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  // TODO: Migrate to Prisma - this is a placeholder after Convex removal
  const handleEmailSave = async () => {
    // Placeholder - notification preferences not yet migrated to Prisma
    console.log("Email preferences would be saved:", emailInput);
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-heading)] mb-2">
          Notification Settings
        </h3>
        <p className="text-[var(--text-muted)]">
          Configure how and when you receive reminders about your estate plan.
        </p>
      </div>

      {/* Coming Soon Notice */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium text-blue-800">Notification Settings Coming Soon</p>
            <p className="text-sm text-blue-700 mt-1">
              Email and push notification preferences are being migrated. For now, you can set up reminders on the Reminders tab.
            </p>
          </div>
        </div>
      </div>

      {/* Email Notifications - Disabled placeholder */}
      <div className="space-y-4 opacity-50 pointer-events-none">
        <h4 className="font-medium text-[var(--text-heading)] flex items-center gap-2">
          <svg
            className="w-5 h-5 text-[var(--coral)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Email Notifications
        </h4>

        <div className="p-4 bg-[var(--cream)] rounded-lg space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="your@email.com"
              disabled
              className="flex-1 px-3 py-2 bg-white border border-[var(--border)] rounded-lg"
            />
            <button
              disabled
              className="px-4 py-2 bg-[var(--coral)] text-white font-medium rounded-lg opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="pt-4 border-t border-[var(--border)]">
        <button
          onClick={onSetupDefaultReminders}
          className="px-4 py-2 bg-[var(--coral)] text-white font-medium rounded-lg hover:bg-[var(--coral-dark)] transition-all"
        >
          Reset to Default Reminders
        </button>
      </div>
    </div>
  );
}

export default NotificationSettings;
