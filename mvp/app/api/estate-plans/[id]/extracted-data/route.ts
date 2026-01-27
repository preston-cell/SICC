import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { IntakeSection } from '@prisma/client'
import { requireAuthOrSessionAndOwnership } from '@/lib/auth-helper'

// GET /api/estate-plans/[id]/extracted-data - Get all extracted data
// GET /api/estate-plans/[id]/extracted-data?section=personal - Get extracted data for a section
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params

    // Verify ownership
    const { error } = await requireAuthOrSessionAndOwnership(estatePlanId, request)
    if (error) return error

    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section') as IntakeSection | null

    if (section) {
      // Get extracted data for a specific section
      const extractedData = await prisma.extractedIntakeData.findFirst({
        where: {
          estatePlanId,
          section,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      if (!extractedData) {
        return NextResponse.json(null)
      }

      // Parse the extracted data and return in the expected format
      return NextResponse.json({
        id: extractedData.id,
        section: extractedData.section,
        parsedData: JSON.parse(extractedData.extractedData),
        confidence: extractedData.confidence,
        status: extractedData.status,
        createdAt: extractedData.createdAt,
      })
    }

    // Get all extracted data for the estate plan
    const extractedData = await prisma.extractedIntakeData.findMany({
      where: {
        estatePlanId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(
      extractedData.map((data: { id: string; section: string; extractedData: string; confidence: number; status: string; createdAt: Date }) => ({
        id: data.id,
        section: data.section,
        parsedData: JSON.parse(data.extractedData),
        confidence: data.confidence,
        status: data.status,
        createdAt: data.createdAt,
      }))
    )
  } catch (error) {
    console.error('Failed to get extracted data:', error)
    return NextResponse.json(
      { error: 'Failed to get extracted data' },
      { status: 500 }
    )
  }
}
