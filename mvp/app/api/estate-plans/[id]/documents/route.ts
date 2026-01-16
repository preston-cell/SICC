import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { DocumentType, DocumentFormat } from '@prisma/client'

// Schema for creating a document
const CreateDocumentSchema = z.object({
  type: z.enum(['will', 'trust', 'poa_financial', 'poa_healthcare', 'healthcare_directive', 'hipaa', 'other']),
  title: z.string(),
  content: z.string(),
  format: z.enum(['markdown', 'html', 'pdf']).optional(),
})

// GET /api/estate-plans/[id]/documents - Get all documents for an estate plan
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params
    const type = request.nextUrl.searchParams.get('type')

    const where: { estatePlanId: string; type?: DocumentType } = { estatePlanId }
    if (type && ['will', 'trust', 'poa_financial', 'poa_healthcare', 'healthcare_directive', 'hipaa', 'other'].includes(type)) {
      where.type = type as DocumentType
    }

    const documents = await prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Failed to get documents:', error)
    return NextResponse.json(
      { error: 'Failed to get documents' },
      { status: 500 }
    )
  }
}

// POST /api/estate-plans/[id]/documents - Create a new document
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params
    const body = await request.json()
    const { type, title, content, format } = CreateDocumentSchema.parse(body)

    // Get the next version number
    const existingDocs = await prisma.document.findMany({
      where: { estatePlanId, type: type as DocumentType },
    })
    const version = existingDocs.length + 1

    const document = await prisma.document.create({
      data: {
        estatePlanId,
        type: type as DocumentType,
        title,
        content,
        format: (format as DocumentFormat) || 'markdown',
        version,
        status: 'draft',
      },
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('Failed to create document:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    )
  }
}
