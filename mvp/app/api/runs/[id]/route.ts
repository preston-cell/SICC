import { prisma } from '../../../../lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Input validation schema for PATCH
const updateRunSchema = z.object({
  status: z.enum(['pending', 'running', 'completed', 'failed']).optional(),
  output: z.string().max(100000).optional(),
  error: z.string().max(10000).optional(),
}).strict() // Reject unknown fields

// GET /api/runs/:id - Get a single run
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Validate ID format (cuid)
  if (!id || typeof id !== 'string' || id.length < 20) {
    return NextResponse.json({ error: 'Invalid run ID' }, { status: 400 })
  }

  const run = await prisma.agentRun.findUnique({
    where: { id },
  })

  if (!run) {
    return NextResponse.json({ error: 'Run not found' }, { status: 404 })
  }

  return NextResponse.json(run)
}

// PATCH /api/runs/:id - Update a run
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Validate ID format
  if (!id || typeof id !== 'string' || id.length < 20) {
    return NextResponse.json({ error: 'Invalid run ID' }, { status: 400 })
  }

  // Parse and validate input
  let validatedData: z.infer<typeof updateRunSchema>
  try {
    const body = await request.json()
    validatedData = updateRunSchema.parse(body)
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

  const run = await prisma.agentRun.update({
    where: { id },
    data: {
      ...validatedData,
      ...(validatedData.status === 'completed' || validatedData.status === 'failed'
        ? { completedAt: new Date() }
        : {}),
    },
  })

  return NextResponse.json(run)
}
