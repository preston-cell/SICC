"use client";

import { useState } from "react";

interface NotificationSettingsProps {
  estatePlanId: string;
  onSetupDefaultReminders: () => void;
}

export function NotificationSettings({
  estatePlanId,
  onSetupDefaultReminders,
}: NotificationSettingsProps) {
  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-heading)] mb-2">
          Notification Settings
        </h3>
        <p className="text-[var(--text-muted)]">
          Configure how and when you receive reminders about your estate plan.
        </p>
      </div>

      <div className="bg-[var(--warning-muted)] border border-[var(--warning)] rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h4 className="font-medium text-[var(--warning)]">Coming Soon</h4>
            <p className="text-sm text-[var(--warning)] mt-1">
              Email and push notification settings are being migrated to the new system.
              In the meantime, you can still set up default reminders below.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[var(--border)]">
        <button
          onClick={onSetupDefaultReminders}
          className="px-4 py-2 bg-[var(--accent-purple)] text-white font-medium rounded-lg hover:opacity-90 transition-all"
        >
          Set Up Default Reminders
        </button>
      </div>
    </div>
  );
}

export default NotificationSettings;
