import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { UploadedDocumentType, AnalysisStatus } from '@prisma/client'
import { requireAuthOrSessionAndOwnership } from '@/lib/auth-helper'

// Schema for creating an uploaded document
const CreateUploadedDocumentSchema = z.object({
  storageId: z.string(),
  fileName: z.string(),
  fileSize: z.number(),
  mimeType: z.string(),
  documentType: z.enum([
    'will',
    'trust',
    'poa_financial',
    'poa_healthcare',
    'healthcare_directive',
    'deed',
    'insurance_policy',
    'beneficiary_form',
    'other',
  ]),
  description: z.string().optional(),
})

// Schema for updating analysis status
const UpdateAnalysisSchema = z.object({
  analysisStatus: z
    .enum(['pending', 'extracting', 'analyzing', 'completed', 'failed'])
    .optional(),
  extractedText: z.string().optional(),
  analysisResult: z.string().optional(),
  analysisError: z.string().optional(),
})

// GET /api/estate-plans/[id]/uploaded-documents - Get all uploaded documents for an estate plan
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
      orderBy: { uploadedAt: 'desc' },
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Failed to get uploaded documents:', error)
    return NextResponse.json(
      { error: 'Failed to get uploaded documents' },
      { status: 500 }
    )
  }
}

// POST /api/estate-plans/[id]/uploaded-documents - Create a new uploaded document
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
    const validatedData = CreateUploadedDocumentSchema.parse(body)

    const document = await prisma.uploadedDocument.create({
      data: {
        estatePlanId,
        storageId: validatedData.storageId,
        fileName: validatedData.fileName,
        fileSize: validatedData.fileSize,
        mimeType: validatedData.mimeType,
        documentType: validatedData.documentType as UploadedDocumentType,
        description: validatedData.description,
        analysisStatus: 'pending',
      },
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('Failed to create uploaded document:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create uploaded document' },
      { status: 500 }
    )
  }
}

// DELETE /api/estate-plans/[id]/uploaded-documents - Delete an uploaded document
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params

    // Verify ownership
    const { error } = await requireAuthOrSessionAndOwnership(estatePlanId, request)
    if (error) return error

    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('documentId')

    if (!documentId) {
      return NextResponse.json(
        { error: 'documentId is required' },
        { status: 400 }
      )
    }

    // Verify the document belongs to this estate plan
    const document = await prisma.uploadedDocument.findFirst({
      where: { id: documentId, estatePlanId },
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    await prisma.uploadedDocument.delete({
      where: { id: documentId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete uploaded document:', error)
    return NextResponse.json(
      { error: 'Failed to delete uploaded document' },
      { status: 500 }
    )
  }
}

// PATCH /api/estate-plans/[id]/uploaded-documents - Update analysis status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params

    // Verify ownership
    const { error } = await requireAuthOrSessionAndOwnership(estatePlanId, request)
    if (error) return error

    const body = await request.json()
    const { documentId, ...updateData } = body

    if (!documentId) {
      return NextResponse.json(
        { error: 'documentId is required' },
        { status: 400 }
      )
    }

    const validatedData = UpdateAnalysisSchema.parse(updateData)

    // Verify the document belongs to this estate plan
    const document = await prisma.uploadedDocument.findFirst({
      where: { id: documentId, estatePlanId },
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    const updatePayload: {
      analysisStatus?: AnalysisStatus
      extractedText?: string
      analysisResult?: string
      analysisError?: string
      extractedAt?: Date
      analyzedAt?: Date
    } = {}

    if (validatedData.analysisStatus) {
      updatePayload.analysisStatus =
        validatedData.analysisStatus as AnalysisStatus
    }
    if (validatedData.extractedText !== undefined) {
      updatePayload.extractedText = validatedData.extractedText
      updatePayload.extractedAt = new Date()
    }
    if (validatedData.analysisResult !== undefined) {
      updatePayload.analysisResult = validatedData.analysisResult
      updatePayload.analyzedAt = new Date()
    }
    if (validatedData.analysisError !== undefined) {
      updatePayload.analysisError = validatedData.analysisError
    }

    const updatedDocument = await prisma.uploadedDocument.update({
      where: { id: documentId },
      data: updatePayload,
    })

    return NextResponse.json(updatedDocument)
  } catch (error) {
    console.error('Failed to update uploaded document:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update uploaded document' },
      { status: 500 }
    )
  }
}
