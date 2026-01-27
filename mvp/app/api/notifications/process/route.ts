import { NextRequest, NextResponse } from "next/server";

// Notification processing endpoint - pending migration to Prisma/PostgreSQL
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Notification processing is being migrated to the new system." },
    { status: 501 }
  );
}
