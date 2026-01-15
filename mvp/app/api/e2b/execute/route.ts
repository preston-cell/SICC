import { NextResponse } from "next/server";
import { executeInE2B } from "@/lib/e2b-executor";

// Extend Vercel function timeout (max 300s on Pro plan, 60s on Hobby)
export const maxDuration = 300;

interface ExecuteRequest {
  prompt: string;
  outputFile?: string;
  timeoutMs?: number;
}

export async function POST(req: Request) {
  try {
    const body: ExecuteRequest = await req.json();
    const { prompt, outputFile, timeoutMs = 240000 } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const result = await executeInE2B({ prompt, outputFile, timeoutMs });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("E2B execution error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
