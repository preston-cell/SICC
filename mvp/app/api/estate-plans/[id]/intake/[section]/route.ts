import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { IntakeSection } from '@prisma/client'

const VALID_SECTIONS: IntakeSection[] = ['personal', 'family', 'assets', 'existing_documents', 'goals']

// Schema for updating intake data
const UpdateIntakeSchema = z.object({
  data: z.string(), // JSON stringified data
  isComplete: z.boolean(),
})

// GET /api/estate-plans/[id]/intake/[section] - Get intake data for a section
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; section: string }> }
) {
  try {
    const { id: estatePlanId, section } = await params

    if (!VALID_SECTIONS.includes(section as IntakeSection)) {
      return NextResponse.json(
        { error: 'Invalid section' },
        { status: 400 }
      )
    }

    const intakeData = await prisma.intakeData.findUnique({
      where: {
        estatePlanId_section: {
          estatePlanId,
          section: section as IntakeSection,
        },
      },
    })

    return NextResponse.json(intakeData)
  } catch (error) {
    console.error('Failed to get intake section:', error)
    return NextResponse.json(
      { error: 'Failed to get intake section' },
      { status: 500 }
    )
  }
}

// PUT /api/estate-plans/[id]/intake/[section] - Update intake data for a section
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; section: string }> }
) {
  try {
    const { id: estatePlanId, section } = await params
    const body = await request.json()
    const { data, isComplete } = UpdateIntakeSchema.parse(body)

    if (!VALID_SECTIONS.includes(section as IntakeSection)) {
      return NextResponse.json(
        { error: 'Invalid section' },
        { status: 400 }
      )
    }

    const now = new Date()

    // Upsert the intake data
    const intakeData = await prisma.intakeData.upsert({
      where: {
        estatePlanId_section: {
          estatePlanId,
          section: section as IntakeSection,
        },
      },
      create: {
        estatePlanId,
        section: section as IntakeSection,
        data,
        isComplete,
        completedAt: isComplete ? now : null,
      },
      update: {
        data,
        isComplete,
        completedAt: isComplete ? now : null,
      },
    })

    // Update estate plan status if this is the first intake data
    const estatePlan = await prisma.estatePlan.findUnique({
      where: { id: estatePlanId },
    })

    if (estatePlan && estatePlan.status === 'draft') {
      await prisma.estatePlan.update({
        where: { id: estatePlanId },
        data: { status: 'intake_in_progress' },
      })
    }

    return NextResponse.json(intakeData)
  } catch (error) {
    console.error('Failed to update intake section:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update intake section' },
      { status: 500 }
    )
  }
}
