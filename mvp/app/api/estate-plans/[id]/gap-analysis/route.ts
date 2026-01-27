import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { requireAuthOrSessionAndOwnership } from '@/lib/auth-helper'

// Schema for saving gap analysis
const SaveGapAnalysisSchema = z.object({
  score: z.number().optional(),
  estateComplexity: z.string().optional(),
  estimatedEstateTax: z.string().optional(),
  missingDocuments: z.string(),
  outdatedDocuments: z.string(),
  inconsistencies: z.string(),
  taxOptimization: z.string().optional(),
  medicaidPlanning: z.string().optional(),
  recommendations: z.string(),
  stateSpecificNotes: z.string(),
  rawAnalysis: z.string().optional(),
})

// GET /api/estate-plans/[id]/gap-analysis - Get latest gap analysis
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params

    // Verify ownership
    const { error } = await requireAuthOrSessionAndOwnership(estatePlanId, request)
    if (error) return error

    const includeHistory = request.nextUrl.searchParams.get('history') === 'true'

    if (includeHistory) {
      // Return all gap analyses
      const analyses = await prisma.gapAnalysis.findMany({
        where: { estatePlanId },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(analyses)
    }

    // Return latest only
    const analysis = await prisma.gapAnalysis.findFirst({
      where: { estatePlanId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Failed to get gap analysis:', error)
    return NextResponse.json(
      { error: 'Failed to get gap analysis' },
      { status: 500 }
    )
  }
}

// POST /api/estate-plans/[id]/gap-analysis - Save a new gap analysis
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params

    // Verify ownership
    const { error } = await requireAuthOrSessionAndOwnership(estatePlanId, request)
    if (error) return error

    const body = await request.json()
    const data = SaveGapAnalysisSchema.parse(body)

    const analysis = await prisma.gapAnalysis.create({
      data: {
        estatePlanId,
        ...data,
      },
    })

    // Update estate plan status
    await prisma.estatePlan.update({
      where: { id: estatePlanId },
      data: { status: 'analysis_complete' },
    })

    return NextResponse.json(analysis, { status: 201 })
  } catch (error) {
    console.error('Failed to save gap analysis:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to save gap analysis' },
      { status: 500 }
    )
  }
}
