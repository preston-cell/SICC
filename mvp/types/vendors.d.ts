// Type declarations for notification-related packages
// These should be installed with: npm install resend web-push && npm install -D @types/web-push

declare module "resend" {
  export class Resend {
    constructor(apiKey: string | undefined);
    emails: {
      send(options: {
        from: string;
        to: string[];
        subject: string;
        html: string;
      }): Promise<{ data?: { id: string }; error?: { message: string } }>;
    };
  }
}

declare module "web-push" {
  export interface PushSubscription {
    endpoint: string;
    keys?: {
      p256dh: string;
      auth: string;
    };
  }

  export interface SendResult {
    statusCode: number;
    body: string;
  }

  export function setVapidDetails(
    subject: string,
    publicKey: string,
    privateKey: string
  ): void;

  export function sendNotification(
    subscription: PushSubscription,
    payload: string,
    options?: {
      TTL?: number;
      urgency?: "very-low" | "low" | "normal" | "high";
    }
  ): Promise<SendResult>;
}
