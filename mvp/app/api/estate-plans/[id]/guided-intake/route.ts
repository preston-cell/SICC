import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuthOrSessionAndOwnership } from '@/lib/auth-helper'

// GET /api/estate-plans/[id]/guided-intake - Get guided intake progress
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params

    // Verify ownership
    const { error } = await requireAuthOrSessionAndOwnership(estatePlanId, request)
    if (error) return error

    const progress = await prisma.guidedIntakeProgress.findUnique({
      where: { estatePlanId },
    })

    if (!progress) {
      return NextResponse.json({
        currentStep: 1,
        completedSteps: [],
        stepData: {},
        flowMode: 'guided',
      })
    }

    return NextResponse.json(progress)
  } catch (error) {
    console.error('Failed to get guided intake progress:', error)
    return NextResponse.json(
      { error: 'Failed to get guided intake progress' },
      { status: 500 }
    )
  }
}

// POST /api/estate-plans/[id]/guided-intake - Initialize guided intake
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params

    // Verify ownership
    const { error } = await requireAuthOrSessionAndOwnership(estatePlanId, request)
    if (error) return error

    // Check if already exists
    const existing = await prisma.guidedIntakeProgress.findUnique({
      where: { estatePlanId },
    })

    if (existing) {
      return NextResponse.json(existing)
    }

    // Create new progress record
    const progress = await prisma.guidedIntakeProgress.create({
      data: {
        estatePlanId,
        currentStep: 1,
        completedSteps: [],
        stepData: {},
        flowMode: 'guided',
      },
    })

    // Update estate plan status
    await prisma.estatePlan.update({
      where: { id: estatePlanId },
      data: { status: 'intake_in_progress' },
    })

    return NextResponse.json(progress, { status: 201 })
  } catch (error) {
    console.error('Failed to initialize guided intake:', error)
    return NextResponse.json(
      { error: 'Failed to initialize guided intake' },
      { status: 500 }
    )
  }
}

// PUT /api/estate-plans/[id]/guided-intake - Update step data or complete step
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params

    // Verify ownership
    const { error } = await requireAuthOrSessionAndOwnership(estatePlanId, request)
    if (error) return error

    const body = await request.json()
    const { step, data, complete } = body

    // Get current progress
    let progress = await prisma.guidedIntakeProgress.findUnique({
      where: { estatePlanId },
    })

    if (!progress) {
      // Initialize if not exists
      progress = await prisma.guidedIntakeProgress.create({
        data: {
          estatePlanId,
          currentStep: 1,
          completedSteps: [],
          stepData: {},
          flowMode: 'guided',
        },
      })
    }

    // Update step data
    const currentStepData = progress.stepData as Record<string, unknown>
    const updatedStepData = {
      ...currentStepData,
      [step]: data,
    }

    // Calculate completed steps
    let completedSteps = progress.completedSteps
    if (complete && !completedSteps.includes(step)) {
      completedSteps = [...completedSteps, step].sort((a, b) => a - b)
    }

    // Calculate next step
    const nextStep = complete ? step + 1 : progress.currentStep

    const updated = await prisma.guidedIntakeProgress.update({
      where: { estatePlanId },
      data: {
        stepData: updatedStepData,
        completedSteps,
        currentStep: nextStep,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Failed to update guided intake:', error)
    return NextResponse.json(
      { error: 'Failed to update guided intake' },
      { status: 500 }
    )
  }
}
