import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuthOrSessionAndOwnership } from '@/lib/auth-helper'

const ALL_SECTIONS = ['personal', 'family', 'assets', 'existing_documents', 'goals'] as const

// GET /api/estate-plans/[id]/intake/progress - Get intake progress
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params

    // Verify ownership
    const { error } = await requireAuthOrSessionAndOwnership(estatePlanId, request)
    if (error) return error

    const intakeRecords = await prisma.intakeData.findMany({
      where: { estatePlanId },
    })

    // Build section status map
    const sectionStatus: Record<string, { exists: boolean; isComplete: boolean }> = {}

    for (const section of ALL_SECTIONS) {
      const record = intakeRecords.find((r: { section: string; isComplete: boolean }) => r.section === section)
      sectionStatus[section] = {
        exists: !!record,
        isComplete: record?.isComplete || false,
      }
    }

    const completedCount = Object.values(sectionStatus).filter(s => s.isComplete).length
    const totalCount = ALL_SECTIONS.length

    return NextResponse.json({
      sections: sectionStatus,
      completedCount,
      totalCount,
      percentComplete: Math.round((completedCount / totalCount) * 100),
      isAllComplete: completedCount === totalCount,
    })
  } catch (error) {
    console.error('Failed to get intake progress:', error)
    return NextResponse.json(
      { error: 'Failed to get intake progress' },
      { status: 500 }
    )
  }
}
