import { prisma } from '../../../lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Input validation schema
const createRunSchema = z.object({
  prompt: z
    .string()
    .min(1, 'Prompt is required')
    .max(10000, 'Prompt too long (max 10,000 characters)')
    .trim(),
})

// GET /api/runs - List recent agent runs
export async function GET() {
  const runs = await prisma.agentRun.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  })
  return NextResponse.json(runs)
}

// POST /api/runs - Create a new agent run
export async function POST(request: Request) {
  // Parse and validate input
  let validatedPrompt: string
  try {
    const body = await request.json()
    const parsed = createRunSchema.parse(body)
    validatedPrompt = parsed.prompt
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }

  const run = await prisma.agentRun.create({
    data: {
      prompt: validatedPrompt,
      status: 'pending',
    },
  })

  return NextResponse.json(run)
}
