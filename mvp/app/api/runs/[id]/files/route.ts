import { prisma } from '../../../../../lib/db'
import { NextResponse } from 'next/server'

// GET /api/runs/:id/files - Get files for a run
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  const files = await prisma.generatedFile.findMany({
    where: { runId: id },
  })

  return NextResponse.json(files)
}
