import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuthOrSessionAndOwnership } from '@/lib/auth-helper'

// Standard checklist items by category
const CHECKLIST_TEMPLATES: Record<string, Array<{ title: string; description: string }>> = {
  real_estate: [
    { title: 'Property Deeds', description: 'Deeds for all real estate properties' },
    { title: 'Mortgage Statements', description: 'Current mortgage statements for all properties' },
    { title: 'Property Tax Records', description: 'Recent property tax assessments and payments' },
    { title: 'HOA Documents', description: 'Homeowners association agreements and rules' },
  ],
  financial: [
    { title: 'Bank Statements', description: 'Recent statements for all checking and savings accounts' },
    { title: 'Investment Statements', description: 'Brokerage account statements' },
    { title: 'Stock Certificates', description: 'Physical stock certificates if any' },
    { title: 'Bond Documents', description: 'Savings bonds and municipal bond records' },
  ],
  retirement: [
    { title: '401(k) Statements', description: 'Current 401(k) account statements' },
    { title: 'IRA Statements', description: 'Traditional and Roth IRA statements' },
    { title: 'Pension Documents', description: 'Pension plan documents and benefit statements' },
    { title: 'Beneficiary Designations', description: 'Current beneficiary forms for all retirement accounts' },
  ],
  insurance: [
    { title: 'Life Insurance Policies', description: 'All life insurance policy documents' },
    { title: 'Health Insurance Cards', description: 'Current health insurance information' },
    { title: 'Long-term Care Policies', description: 'Long-term care insurance policies if applicable' },
    { title: 'Disability Insurance', description: 'Disability insurance policy documents' },
  ],
  business: [
    { title: 'Business Formation Documents', description: 'Articles of incorporation, LLC agreements, etc.' },
    { title: 'Partnership Agreements', description: 'Any partnership or shareholder agreements' },
    { title: 'Buy-Sell Agreements', description: 'Business succession planning documents' },
    { title: 'Business Valuations', description: 'Recent business appraisals or valuations' },
  ],
  personal: [
    { title: 'Birth Certificates', description: 'Birth certificates for you and dependents' },
    { title: 'Marriage Certificate', description: 'Marriage certificate or divorce decree' },
    { title: 'Social Security Cards', description: 'Social Security cards for family members' },
    { title: 'Passports', description: 'Current passports for all family members' },
  ],
  existing_documents: [
    { title: 'Current Will', description: 'Your current last will and testament' },
    { title: 'Trust Documents', description: 'Any existing trust agreements' },
    { title: 'Power of Attorney', description: 'Existing financial power of attorney' },
    { title: 'Healthcare Directive', description: 'Existing healthcare proxy or living will' },
  ],
}

// GET /api/estate-plans/[id]/document-checklist - List checklist items
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
    const category = searchParams.get('category')
    const progressOnly = searchParams.get('progress') === 'true'

    const where: { estatePlanId: string; category?: string } = { estatePlanId }
    if (category) {
      where.category = category
    }

    if (progressOnly) {
      const items = await prisma.documentChecklistItem.findMany({ where })
      const total = items.length
      const gathered = items.filter((i: { status: string }) => i.status === 'gathered').length
      const inProgress = items.filter((i: { status: string }) => i.status === 'in_progress').length
      return NextResponse.json({
        total,
        gathered,
        inProgress,
        notGathered: total - gathered - inProgress,
        percentComplete: total > 0 ? Math.round((gathered / total) * 100) : 0,
      })
    }

    const items = await prisma.documentChecklistItem.findMany({
      where,
      orderBy: [{ category: 'asc' }, { createdAt: 'asc' }],
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Failed to get document checklist:', error)
    return NextResponse.json(
      { error: 'Failed to get document checklist' },
      { status: 500 }
    )
  }
}

// POST /api/estate-plans/[id]/document-checklist - Generate checklist from intake data
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params

    // Verify ownership
    const { error } = await requireAuthOrSessionAndOwnership(estatePlanId, request)
    if (error) return error

    // Check if checklist already exists
    const existing = await prisma.documentChecklistItem.count({
      where: { estatePlanId },
    })

    if (existing > 0) {
      return NextResponse.json(
        { message: 'Checklist already exists', count: existing },
        { status: 200 }
      )
    }

    // Get intake data to determine which categories apply
    const intakeData = await prisma.intakeData.findMany({
      where: { estatePlanId },
    })

    // Determine which categories to include
    const categoriesToInclude = new Set<string>(['personal', 'existing_documents'])

    for (const section of intakeData) {
      try {
        const data = JSON.parse(section.data)

        // Check for real estate
        if (data.properties?.length > 0 || data.hasRealEstate) {
          categoriesToInclude.add('real_estate')
        }

        // Check for financial accounts
        if (data.bankAccounts?.length > 0 || data.investments?.length > 0 || data.hasFinancialAccounts) {
          categoriesToInclude.add('financial')
        }

        // Check for retirement accounts
        if (data.retirementAccounts?.length > 0 || data.hasRetirementAccounts) {
          categoriesToInclude.add('retirement')
        }

        // Check for insurance
        if (data.lifeInsurance?.length > 0 || data.hasLifeInsurance) {
          categoriesToInclude.add('insurance')
        }

        // Check for business interests
        if (data.businessInterests?.length > 0 || data.ownsBusiness) {
          categoriesToInclude.add('business')
        }
      } catch {
        // Skip unparseable data
      }
    }

    // Create checklist items
    const items: Array<{
      estatePlanId: string
      title: string
      description: string
      category: string
      status: string
    }> = []

    for (const category of categoriesToInclude) {
      const templates = CHECKLIST_TEMPLATES[category] || []
      for (const template of templates) {
        items.push({
          estatePlanId,
          title: template.title,
          description: template.description,
          category,
          status: 'not_gathered',
        })
      }
    }

    await prisma.documentChecklistItem.createMany({
      data: items,
    })

    return NextResponse.json(
      { message: 'Checklist generated', count: items.length },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to generate document checklist:', error)
    return NextResponse.json(
      { error: 'Failed to generate document checklist' },
      { status: 500 }
    )
  }
}

// PUT /api/estate-plans/[id]/document-checklist - Update item status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params

    // Verify ownership
    const { error } = await requireAuthOrSessionAndOwnership(estatePlanId, request)
    if (error) return error

    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Item ID and status are required' },
        { status: 400 }
      )
    }

    // Validate status value
    const validStatuses = ['not_gathered', 'in_progress', 'gathered']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
    }

    // Verify item belongs to this estate plan
    const existingItem = await prisma.documentChecklistItem.findFirst({
      where: { id, estatePlanId },
    })
    if (!existingItem) {
      return NextResponse.json({ error: 'Checklist item not found' }, { status: 404 })
    }

    const updated = await prisma.documentChecklistItem.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Failed to update checklist item:', error)
    return NextResponse.json(
      { error: 'Failed to update checklist item' },
      { status: 500 }
    )
  }
}

// DELETE /api/estate-plans/[id]/document-checklist - Clear checklist
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params

    // Verify ownership
    const { error } = await requireAuthOrSessionAndOwnership(estatePlanId, request)
    if (error) return error

    await prisma.documentChecklistItem.deleteMany({
      where: { estatePlanId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to clear document checklist:', error)
    return NextResponse.json(
      { error: 'Failed to clear document checklist' },
      { status: 500 }
    )
  }
}
