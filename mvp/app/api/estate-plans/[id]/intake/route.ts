import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuthOrSessionAndOwnership } from '@/lib/auth-helper'

// GET /api/estate-plans/[id]/intake - Get all intake data for an estate plan
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params

    // Verify ownership
    const { error } = await requireAuthOrSessionAndOwnership(estatePlanId, request)
    if (error) return error

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
