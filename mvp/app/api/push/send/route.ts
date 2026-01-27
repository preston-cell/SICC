import { NextRequest, NextResponse } from "next/server";

// Push notification send endpoint - pending migration to Prisma/PostgreSQL
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Push notifications are being migrated to the new system." },
    { status: 501 }
  );
}

export async function GET() {
  return NextResponse.json({
    configured: false,
    message: "Push notifications are being migrated to the new system.",
  });
}
