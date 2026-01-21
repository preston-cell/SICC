import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

// Schema for updating an estate plan
const UpdateEstatePlanSchema = z.object({
  name: z.string().optional(),
  stateOfResidence: z.string().optional(),
  status: z.enum([
    'draft',
    'intake_in_progress',
    'intake_complete',
    'analysis_complete',
    'documents_generated',
    'complete'
  ]).optional(),
})

// GET /api/estate-plans/[id] - Get a single estate plan
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const includeFull = request.nextUrl.searchParams.get('full') === 'true'

    if (includeFull) {
      // Get estate plan with all related data (getEstatePlanFull equivalent)
      const plan = await prisma.estatePlan.findUnique({
        where: { id },
        include: {
          intakeData: true,
          documents: true,
          gapAnalyses: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          beneficiaryDesignations: true,
        },
      })

      if (!plan) {
        return NextResponse.json(
          { error: 'Estate plan not found' },
          { status: 404 }
        )
      }

      // Format to match Convex response structure
      return NextResponse.json({
        ...plan,
        latestGapAnalysis: plan.gapAnalyses[0] || null,
      })
    }

    // Simple get
    const plan = await prisma.estatePlan.findUnique({
      where: { id },
    })

    if (!plan) {
      return NextResponse.json(
        { error: 'Estate plan not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Failed to get estate plan:', error)
    return NextResponse.json(
      { error: 'Failed to get estate plan' },
      { status: 500 }
    )
  }
}

// PATCH /api/estate-plans/[id] - Update an estate plan
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updates = UpdateEstatePlanSchema.parse(body)

    const plan = await prisma.estatePlan.update({
      where: { id },
      data: updates,
    })

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Failed to update estate plan:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update estate plan' },
      { status: 500 }
    )
  }
}

// DELETE /api/estate-plans/[id] - Delete an estate plan
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Prisma will cascade delete related records due to onDelete: Cascade
    await prisma.estatePlan.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete estate plan:', error)
    return NextResponse.json(
      { error: 'Failed to delete estate plan' },
      { status: 500 }
    )
  }
}
