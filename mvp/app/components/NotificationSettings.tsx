"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import Toggle from "./ui/Toggle";
import { useToast } from "./ui/Toast";
import {
  isPushSupported,
  getNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
  serializeSubscription,
} from "../../lib/push/subscription";

interface NotificationSettingsProps {
  estatePlanId: Id<"estatePlans">;
  onSetupDefaultReminders: () => void;
}

export function NotificationSettings({
  estatePlanId,
  onSetupDefaultReminders,
}: NotificationSettingsProps) {
  const { addToast } = useToast();
  const [emailInput, setEmailInput] = useState("");
  const [isRequestingPush, setIsRequestingPush] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);
  const [pushPermission, setPushPermission] = useState<string>("default");

  const preferences = useQuery(api.notifications.getNotificationPreferences, {
    estatePlanId,
  });

  const updatePreferences = useMutation(
    api.notifications.updateNotificationPreferences
  );
  const savePushSubscription = useMutation(
    api.notifications.savePushSubscription
  );

  // Check push support on mount
  useEffect(() => {
    setPushSupported(isPushSupported());
    const permission = getNotificationPermission();
    setPushPermission(permission === "unsupported" ? "default" : permission);
  }, []);

  // Initialize email input from preferences
  useEffect(() => {
    if (preferences?.emailAddress && !emailInput) {
      setEmailInput(preferences.emailAddress);
    }
  }, [preferences?.emailAddress, emailInput]);

  const handleToggle = async (
    field: string,
    value: boolean
  ) => {
    try {
      const updatePayload: Record<string, boolean | string> = {
        estatePlanId: estatePlanId as unknown as string,
      };
      updatePayload[field] = value;

      await updatePreferences({
        estatePlanId,
        emailEnabled: field === "emailEnabled" ? value : undefined,
        pushEnabled: field === "pushEnabled" ? value : undefined,
        digestEnabled: field === "digestEnabled" ? value : undefined,
        annualReviewReminders: field === "annualReviewReminders" ? value : undefined,
        beneficiaryReviewReminders: field === "beneficiaryReviewReminders" ? value : undefined,
        lifeEventPrompts: field === "lifeEventPrompts" ? value : undefined,
        overdueAlerts: field === "overdueAlerts" ? value : undefined,
      });
      addToast({
        type: "success",
        title: "Settings updated",
        message: "Your notification preferences have been saved.",
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to update",
        message: "Please try again.",
      });
    }
  };

  const handleEmailSave = async () => {
    if (!emailInput) return;

    try {
      await updatePreferences({
        estatePlanId,
        emailEnabled: true,
        emailAddress: emailInput,
      });
      addToast({
        type: "success",
        title: "Email saved",
        message: "You'll receive reminders at this address.",
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to save email",
        message: "Please try again.",
      });
    }
  };

  const handleEnablePush = async () => {
    if (!pushSupported) {
      addToast({
        type: "warning",
        title: "Not supported",
        message: "Push notifications aren't supported in this browser.",
      });
      return;
    }

    setIsRequestingPush(true);
    try {
      const subscription = await subscribeToPush();
      if (subscription) {
        // Save subscription to database
        await savePushSubscription({
          estatePlanId,
          subscription: serializeSubscription(subscription),
        });
        setPushPermission("granted");
        addToast({
          type: "success",
          title: "Push enabled",
          message: "You'll receive push notifications for reminders.",
        });
      } else {
        addToast({
          type: "warning",
          title: "Permission denied",
          message: "Please allow notifications in your browser settings.",
        });
      }
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to enable push",
        message: "Please try again.",
      });
    } finally {
      setIsRequestingPush(false);
    }
  };

  const handleDisablePush = async () => {
    try {
      await unsubscribeFromPush();
      await updatePreferences({
        estatePlanId,
        pushEnabled: false,
        pushSubscription: undefined,
      });
      addToast({
        type: "info",
        title: "Push disabled",
        message: "You won't receive push notifications.",
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to disable push",
        message: "Please try again.",
      });
    }
  };

  const handleTestPush = async () => {
    if (!preferences?.pushSubscription) {
      addToast({
        type: "warning",
        title: "Push not enabled",
        message: "Please enable push notifications first.",
      });
      return;
    }

    setIsSendingTest(true);
    try {
      const response = await fetch("/api/notifications/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: preferences.pushSubscription,
          title: "Test Notification",
          message: "Your push notifications are working correctly! 🎉",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        addToast({
          type: "success",
          title: "Test sent",
          message: "Check for the notification on your device.",
        });
      } else {
        throw new Error(data.error || "Failed to send test");
      }
    } catch (error) {
      const err = error as Error;
      addToast({
        type: "error",
        title: "Test failed",
        message: err.message || "Could not send test notification.",
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  if (!preferences) {
    return (
      <div className="bg-white rounded-xl border border-[var(--border)] p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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

      {/* Email Notifications */}
      <div className="space-y-4">
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
              className="flex-1 px-3 py-2 bg-white border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--coral)] focus:border-transparent"
            />
            <button
              onClick={handleEmailSave}
              disabled={!emailInput || emailInput === preferences.emailAddress}
              className="px-4 py-2 bg-[var(--coral)] text-white font-medium rounded-lg hover:bg-[var(--coral-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Save
            </button>
          </div>
          {preferences.emailAddress && (
            <div className="flex items-center gap-2 text-sm">
              {preferences.emailVerified ? (
                <>
                  <svg
                    className="w-4 h-4 text-[var(--success)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-[var(--success)]">Email verified</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 text-[var(--warning)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01"
                    />
                  </svg>
                  <span className="text-[var(--warning)]">
                    Verification pending
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="p-4 bg-white/50 rounded-lg">
          <Toggle
            label="Enable email notifications"
            description="Receive reminder emails at the address above"
            checked={preferences.emailEnabled}
            onChange={(checked) => handleToggle("emailEnabled", checked)}
            disabled={!preferences.emailAddress}
          />
        </div>
      </div>

      {/* Push Notifications */}
      <div className="space-y-4">
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
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          Push Notifications
        </h4>

        <div className="p-4 bg-[var(--cream)] rounded-lg">
          {!pushSupported ? (
            <p className="text-sm text-[var(--text-muted)]">
              Push notifications are not supported in your browser.
            </p>
          ) : preferences.pushEnabled ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--text-heading)]">
                    Push notifications enabled
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    You'll receive browser notifications
                  </p>
                </div>
                <button
                  onClick={handleDisablePush}
                  className="px-4 py-2 text-sm text-[var(--error)] hover:bg-[var(--error-muted)] rounded-lg transition-colors"
                >
                  Disable
                </button>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]">
                <button
                  onClick={handleTestPush}
                  disabled={isSendingTest}
                  className="px-3 py-1.5 text-sm bg-[var(--off-white)] text-[var(--text-body)] font-medium rounded-lg hover:bg-[var(--stone-grey)] disabled:opacity-50 transition-colors"
                >
                  {isSendingTest ? "Sending..." : "Send Test Notification"}
                </button>
                <span className="text-xs text-[var(--text-muted)]">
                  Verify your setup is working
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[var(--text-heading)]">
                  Enable push notifications
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  Get instant reminders in your browser
                </p>
              </div>
              <button
                onClick={handleEnablePush}
                disabled={isRequestingPush}
                className="px-4 py-2 bg-[var(--coral)] text-white font-medium rounded-lg hover:bg-[var(--coral-dark)] disabled:opacity-50 transition-all"
              >
                {isRequestingPush ? "Enabling..." : "Enable"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Digest */}
      <div className="space-y-4">
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          Weekly Digest
        </h4>

        <div className="p-4 bg-white/50 rounded-lg">
          <Toggle
            label="Weekly summary email"
            description="Receive a summary of pending reminders every Sunday"
            checked={preferences.digestEnabled}
            onChange={(checked) => handleToggle("digestEnabled", checked)}
            disabled={!preferences.emailAddress}
          />
        </div>
      </div>

      {/* Reminder Type Preferences */}
      <div className="space-y-4">
        <h4 className="font-medium text-[var(--text-heading)]">
          Reminder Types
        </h4>

        <div className="space-y-3">
          <div className="p-4 bg-white/50 rounded-lg">
            <Toggle
              label="Annual Review Reminders"
              description="Remind me to review my estate plan each year"
              checked={preferences.annualReviewReminders}
              onChange={(checked) =>
                handleToggle("annualReviewReminders", checked)
              }
            />
          </div>

          <div className="p-4 bg-white/50 rounded-lg">
            <Toggle
              label="Beneficiary Review"
              description="Remind me to check beneficiary designations"
              checked={preferences.beneficiaryReviewReminders}
              onChange={(checked) =>
                handleToggle("beneficiaryReviewReminders", checked)
              }
            />
          </div>

          <div className="p-4 bg-white/50 rounded-lg">
            <Toggle
              label="Life Event Prompts"
              description="Create reminders when I log major life events"
              checked={preferences.lifeEventPrompts}
              onChange={(checked) => handleToggle("lifeEventPrompts", checked)}
            />
          </div>

          <div className="p-4 bg-white/50 rounded-lg">
            <Toggle
              label="Overdue Alerts"
              description="Send alerts when reminders become overdue"
              checked={preferences.overdueAlerts}
              onChange={(checked) => handleToggle("overdueAlerts", checked)}
            />
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
