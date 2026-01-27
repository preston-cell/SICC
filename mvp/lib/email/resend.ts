import { Resend } from "resend";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Estate Planning <notifications@estate-plan.app>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface SendReminderEmailParams {
  to: string;
  reminderTitle: string;
  reminderDescription?: string;
  dueDate: Date;
  priority: "low" | "medium" | "high" | "urgent";
  estatePlanId: string;
  reminderId: string;
  isOverdue?: boolean;
}

interface SendDigestEmailParams {
  to: string;
  estatePlanId: string;
  pendingReminders: Array<{
    title: string;
    dueDate: Date;
    priority: string;
    isOverdue: boolean;
  }>;
  overdueCount: number;
}

// Gentle, empathetic copy for different reminder stages
const REMINDER_COPY = {
  first: {
    subject: (title: string) => `A gentle reminder about your estate plan`,
    preheader: "Your estate plan needs attention",
  },
  followUp: {
    subject: (title: string) => `Your "${title}" is waiting for you`,
    preheader: "Don't forget this important task",
  },
  overdue: {
    subject: (title: string) => `Don't let "${title}" slip`,
    preheader: "This task is now overdue",
  },
  urgent: {
    subject: (title: string) => `Urgent: ${title}`,
    preheader: "This requires your immediate attention",
  },
};

/**
 * Send a reminder email to a user
 */
export async function sendReminderEmail(params: SendReminderEmailParams) {
  const {
    to,
    reminderTitle,
    reminderDescription,
    dueDate,
    priority,
    estatePlanId,
    reminderId,
    isOverdue = false,
  } = params;

  // Determine which copy to use
  const copyType = isOverdue
    ? "overdue"
    : priority === "urgent"
      ? "urgent"
      : "first";
  const copy = REMINDER_COPY[copyType];

  const viewUrl = `${APP_URL}/analysis/${estatePlanId}/reminders`;
  const snoozeUrl = `${APP_URL}/api/reminders/snooze?id=${reminderId}&days=3`;

  const formattedDate = dueDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const priorityColors = {
    low: "#4A9D6B",
    medium: "#D4A04A",
    high: "#C94A4A",
    urgent: "#C94A4A",
  };

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: copy.subject(reminderTitle),
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${copy.subject(reminderTitle)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF9F7; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #FAF9F7;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(29, 29, 27, 0.08);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; background-color: #1D1D1B;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 400;">Estate Planning Assistant</h1>
            </td>
          </tr>

          <!-- Priority Badge -->
          <tr>
            <td style="padding: 24px 32px 0; text-align: center;">
              <span style="display: inline-block; padding: 6px 16px; background-color: ${priorityColors[priority]}20; color: ${priorityColors[priority]}; font-size: 12px; font-weight: 600; text-transform: uppercase; border-radius: 100px;">
                ${isOverdue ? "Overdue" : priority} Priority
              </span>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 24px 32px 32px;">
              <h2 style="margin: 0 0 16px; color: #1D1D1B; font-size: 22px; font-weight: 500; line-height: 1.3;">
                ${reminderTitle}
              </h2>

              ${reminderDescription ? `<p style="margin: 0 0 20px; color: #6B6B5E; font-size: 16px; line-height: 1.6;">${reminderDescription}</p>` : ""}

              <p style="margin: 0 0 24px; color: #6B6B5E; font-size: 15px;">
                <strong style="color: #1D1D1B;">Due:</strong> ${formattedDate}
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 100px; background-color: #FF7759;">
                    <a href="${viewUrl}" style="display: block; padding: 14px 32px; color: #FFFFFF; text-decoration: none; font-size: 16px; font-weight: 500;">
                      View Reminder
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Snooze Link -->
              <p style="margin: 24px 0 0; text-align: center;">
                <a href="${snoozeUrl}" style="color: #6B6B5E; font-size: 14px; text-decoration: underline;">
                  Snooze for 3 days
                </a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #FAF9F7; border-top: 1px solid rgba(29, 29, 27, 0.08);">
              <p style="margin: 0; color: #8A8A7A; font-size: 13px; text-align: center; line-height: 1.5;">
                You're receiving this because you enabled email reminders for your estate plan.
                <br>
                <a href="${APP_URL}/analysis/${estatePlanId}/reminders?tab=settings" style="color: #6B6B5E;">Manage notification preferences</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    if (error) {
      console.error("Failed to send reminder email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending reminder email:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Send a weekly digest email summarizing pending reminders
 */
export async function sendDigestEmail(params: SendDigestEmailParams) {
  const { to, estatePlanId, pendingReminders, overdueCount } = params;

  const viewUrl = `${APP_URL}/analysis/${estatePlanId}/reminders`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Your Weekly Estate Plan Summary${overdueCount > 0 ? ` (${overdueCount} overdue)` : ""}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Estate Plan Summary</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF9F7; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #FAF9F7;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(29, 29, 27, 0.08);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; background-color: #1D1D1B;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 400;">Weekly Summary</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 24px 32px 32px;">
              <p style="margin: 0 0 24px; color: #6B6B5E; font-size: 16px; line-height: 1.6;">
                Here's what needs your attention this week:
              </p>

              <!-- Reminders List -->
              ${pendingReminders
                .map(
                  (r) => `
                <div style="padding: 16px; margin-bottom: 12px; background-color: ${r.isOverdue ? "#C94A4A10" : "#FAF9F7"}; border-radius: 12px; border-left: 4px solid ${r.isOverdue ? "#C94A4A" : "#FF7759"};">
                  <p style="margin: 0 0 4px; color: #1D1D1B; font-size: 15px; font-weight: 500;">
                    ${r.title}
                  </p>
                  <p style="margin: 0; color: #6B6B5E; font-size: 13px;">
                    ${r.isOverdue ? "Overdue" : `Due ${r.dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                  </p>
                </div>
              `
                )
                .join("")}

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 24px auto 0;">
                <tr>
                  <td style="border-radius: 100px; background-color: #FF7759;">
                    <a href="${viewUrl}" style="display: block; padding: 14px 32px; color: #FFFFFF; text-decoration: none; font-size: 16px; font-weight: 500;">
                      View All Reminders
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #FAF9F7; border-top: 1px solid rgba(29, 29, 27, 0.08);">
              <p style="margin: 0; color: #8A8A7A; font-size: 13px; text-align: center; line-height: 1.5;">
                You're receiving this weekly digest because you enabled it in your notification settings.
                <br>
                <a href="${APP_URL}/analysis/${estatePlanId}/reminders?tab=settings" style="color: #6B6B5E;">Manage preferences</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    if (error) {
      console.error("Failed to send digest email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending digest email:", error);
    return { success: false, error: String(error) };
  }
}
