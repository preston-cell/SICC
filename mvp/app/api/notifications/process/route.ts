import { NextRequest, NextResponse } from "next/server";

/**
 * Process pending notifications and send them
 * TODO: Migrate from Convex to Prisma
 *
 * This endpoint can be called by:
 * - Vercel Cron
 * - Scheduled action
 * - Manual trigger
 */
export async function POST(request: NextRequest) {
  // Placeholder - notification processing not yet migrated to Prisma
  return NextResponse.json({
    success: true,
    message: "Notification processing not yet migrated to Prisma",
    processed: 0,
    sent: 0,
    failed: 0,
  });
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Notification system pending migration to Prisma",
    configured: {
      vapid: false,
      database: "prisma",
    },
  });
}
