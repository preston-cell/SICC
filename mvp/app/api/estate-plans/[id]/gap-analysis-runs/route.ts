import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/estate-plans/[id]/gap-analysis-runs - Get runs
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params
    const { searchParams } = new URL(request.url)
    const latest = searchParams.get('latest') === 'true'
    const active = searchParams.get('active') === 'true'
    const history = searchParams.get('history') === 'true'

    if (latest) {
      const run = await prisma.gapAnalysisRun.findFirst({
        where: { estatePlanId },
        orderBy: { createdAt: 'desc' },
        include: {
          phases: {
            include: {
              runResults: true,
            },
            orderBy: { phaseNumber: 'asc' },
          },
        },
      })
      return NextResponse.json(run)
    }

    if (active) {
      const run = await prisma.gapAnalysisRun.findFirst({
        where: {
          estatePlanId,
          status: 'running',
        },
        include: {
          phases: {
            include: {
              runResults: true,
            },
            orderBy: { phaseNumber: 'asc' },
          },
        },
      })
      return NextResponse.json(run)
    }

    if (history) {
      const runs = await prisma.gapAnalysisRun.findMany({
        where: { estatePlanId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          status: true,
          analysisType: true,
          progressPercent: true,
          startedAt: true,
          completedAt: true,
          createdAt: true,
        },
      })
      return NextResponse.json(runs)
    }

    // Default: return all runs
    const runs = await prisma.gapAnalysisRun.findMany({
      where: { estatePlanId },
      orderBy: { createdAt: 'desc' },
      include: {
        phases: {
          orderBy: { phaseNumber: 'asc' },
        },
      },
    })

    return NextResponse.json(runs)
  } catch (error) {
    console.error('Failed to get gap analysis runs:', error)
    return NextResponse.json(
      { error: 'Failed to get gap analysis runs' },
      { status: 500 }
    )
  }
}

// POST /api/estate-plans/[id]/gap-analysis-runs - Create new run
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params
    const body = await request.json()
    const { analysisType = 'comprehensive' } = body

    // Check for active run
    const activeRun = await prisma.gapAnalysisRun.findFirst({
      where: {
        estatePlanId,
        status: 'running',
      },
    })

    if (activeRun) {
      return NextResponse.json(
        { error: 'An analysis is already running', runId: activeRun.id },
        { status: 409 }
      )
    }

    // Create new run with phases
    const run = await prisma.gapAnalysisRun.create({
      data: {
        estatePlanId,
        status: 'pending',
        analysisType,
        currentPhase: 1,
        totalPhases: 3,
        progressPercent: 0,
        phases: {
          create: [
            { phaseNumber: 1, name: 'research', status: 'pending' },
            { phaseNumber: 2, name: 'analysis', status: 'pending' },
            { phaseNumber: 3, name: 'synthesis', status: 'pending' },
          ],
        },
      },
      include: {
        phases: true,
      },
    })

    return NextResponse.json(run, { status: 201 })
  } catch (error) {
    console.error('Failed to create gap analysis run:', error)
    return NextResponse.json(
      { error: 'Failed to create gap analysis run' },
      { status: 500 }
    )
  }
}

// PUT /api/estate-plans/[id]/gap-analysis-runs - Update run status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { runId, status, currentPhase, progressPercent, error: errorMsg } = body

    if (!runId) {
      return NextResponse.json(
        { error: 'Run ID is required' },
        { status: 400 }
      )
    }

    const data: {
      status?: string
      currentPhase?: number
      progressPercent?: number
      error?: string
      startedAt?: Date
      completedAt?: Date
    } = {}

    if (status) {
      data.status = status
      if (status === 'running') {
        data.startedAt = new Date()
      } else if (status === 'completed' || status === 'failed') {
        data.completedAt = new Date()
      }
    }
    if (currentPhase !== undefined) data.currentPhase = currentPhase
    if (progressPercent !== undefined) data.progressPercent = progressPercent
    if (errorMsg !== undefined) data.error = errorMsg

    const run = await prisma.gapAnalysisRun.update({
      where: { id: runId },
      data,
      include: {
        phases: {
          include: {
            runResults: true,
          },
          orderBy: { phaseNumber: 'asc' },
        },
      },
    })

    return NextResponse.json(run)
  } catch (error) {
    console.error('Failed to update gap analysis run:', error)
    return NextResponse.json(
      { error: 'Failed to update gap analysis run' },
      { status: 500 }
    )
  }
}
