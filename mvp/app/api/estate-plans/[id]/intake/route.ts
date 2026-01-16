import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/estate-plans/[id]/intake - Get all intake data for an estate plan
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params

    const intakeData = await prisma.intakeData.findMany({
      where: { estatePlanId },
    })

    return NextResponse.json(intakeData)
  } catch (error) {
    console.error('Failed to get intake data:', error)
    return NextResponse.json(
      { error: 'Failed to get intake data' },
      { status: 500 }
    )
  }
}
