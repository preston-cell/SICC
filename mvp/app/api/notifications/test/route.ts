import { NextRequest, NextResponse } from "next/server";

// Push notification test endpoint - pending migration to Prisma/PostgreSQL
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Push notification testing is being migrated to the new system." },
    { status: 501 }
  );
}
