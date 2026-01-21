import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { BeneficiaryAssetType } from '@prisma/client'

// Schema for creating/updating beneficiary designations
const BeneficiarySchema = z.object({
  assetType: z.enum([
    'retirement_401k', 'retirement_ira', 'retirement_roth', 'retirement_pension',
    'retirement_other', 'life_insurance', 'annuity', 'bank_pod', 'brokerage_tod',
    'real_estate_tod', 'other'
  ]),
  assetName: z.string(),
  institution: z.string().optional(),
  accountNumber: z.string().optional(),
  estimatedValue: z.string().optional(),
  primaryBeneficiaryName: z.string(),
  primaryBeneficiaryRelationship: z.string().optional(),
  primaryBeneficiaryPercentage: z.number().optional(),
  contingentBeneficiaryName: z.string().optional(),
  contingentBeneficiaryRelationship: z.string().optional(),
  contingentBeneficiaryPercentage: z.number().optional(),
  lastReviewedDate: z.string().optional(),
  notes: z.string().optional(),
})

const BulkSaveSchema = z.object({
  designations: z.array(BeneficiarySchema.extend({
    id: z.string().optional(),
  })),
})

// GET /api/estate-plans/[id]/beneficiaries - Get all beneficiary designations
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params
    const assetType = request.nextUrl.searchParams.get('assetType')

    const where: { estatePlanId: string; assetType?: BeneficiaryAssetType } = { estatePlanId }
    if (assetType) {
      where.assetType = assetType as BeneficiaryAssetType
    }

    const designations = await prisma.beneficiaryDesignation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(designations)
  } catch (error) {
    console.error('Failed to get beneficiary designations:', error)
    return NextResponse.json(
      { error: 'Failed to get beneficiary designations' },
      { status: 500 }
    )
  }
}

// POST /api/estate-plans/[id]/beneficiaries - Create a beneficiary designation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params
    const body = await request.json()
    const data = BeneficiarySchema.parse(body)

    const designation = await prisma.beneficiaryDesignation.create({
      data: {
        estatePlanId,
        ...data,
        assetType: data.assetType as BeneficiaryAssetType,
      },
    })

    return NextResponse.json(designation, { status: 201 })
  } catch (error) {
    console.error('Failed to create beneficiary designation:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create beneficiary designation' },
      { status: 500 }
    )
  }
}

// PUT /api/estate-plans/[id]/beneficiaries - Bulk save beneficiary designations
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params
    const body = await request.json()
    const { designations } = BulkSaveSchema.parse(body)

    // Get existing designations
    const existing = await prisma.beneficiaryDesignation.findMany({
      where: { estatePlanId },
    })
    const existingIds = new Set(existing.map((d: { id: string }) => d.id))
    const submittedIds = new Set(designations.filter((d: { id?: string }) => d.id).map(d => d.id))

    // Delete removed designations
    for (const existingDesignation of existing) {
      if (!submittedIds.has(existingDesignation.id)) {
        await prisma.beneficiaryDesignation.delete({
          where: { id: existingDesignation.id },
        })
      }
    }

    // Create or update designations
    const results = []
    for (const designation of designations) {
      const { id, ...data } = designation

      if (id && existingIds.has(id)) {
        // Update existing
        const updated = await prisma.beneficiaryDesignation.update({
          where: { id },
          data: {
            ...data,
            assetType: data.assetType as BeneficiaryAssetType,
          },
        })
        results.push(updated)
      } else {
        // Create new
        const created = await prisma.beneficiaryDesignation.create({
          data: {
            estatePlanId,
            ...data,
            assetType: data.assetType as BeneficiaryAssetType,
          },
        })
        results.push(created)
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Failed to save beneficiary designations:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to save beneficiary designations' },
      { status: 500 }
    )
  }
}
