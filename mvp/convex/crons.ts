import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Check for due reminders every hour and queue notifications
crons.hourly(
  "check-due-reminders",
  { minuteUTC: 0 },
  internal.notificationActions.checkAndSendReminders
);

// Send weekly digest on Sundays at 9 AM UTC (which is ~4-5 AM EST/PST)
// Adjusts to 9 AM local for most US users
crons.weekly(
  "send-weekly-digest",
  { dayOfWeek: "sunday", hourUTC: 14, minuteUTC: 0 },
  internal.notificationActions.sendWeeklyDigests
);

export default crons;
