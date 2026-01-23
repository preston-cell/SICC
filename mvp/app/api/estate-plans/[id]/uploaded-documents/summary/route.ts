import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuthOrSessionAndOwnership } from '@/lib/auth-helper'

// GET /api/estate-plans/[id]/uploaded-documents/summary - Get analysis summary stats
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params

    // Verify ownership
    const { error } = await requireAuthOrSessionAndOwnership(estatePlanId, request)
    if (error) return error

    const documents = await prisma.uploadedDocument.findMany({
      where: { estatePlanId },
      select: { analysisStatus: true },
    })

    const summary = {
      totalDocuments: documents.length,
      completed: documents.filter((d: { analysisStatus: string }) => d.analysisStatus === 'completed')
        .length,
      pendingAnalysis: documents.filter((d: { analysisStatus: string }) => d.analysisStatus === 'pending')
        .length,
      inProgress: documents.filter((d: { analysisStatus: string }) =>
        
          d.analysisStatus === 'extracting' || d.analysisStatus === 'analyzing'
      ).length,
      failed: documents.filter((d: { analysisStatus: string }) => d.analysisStatus === 'failed').length,
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error('Failed to get document analysis summary:', error)
    return NextResponse.json(
      { error: 'Failed to get document analysis summary' },
      { status: 500 }
    )
  }
}
