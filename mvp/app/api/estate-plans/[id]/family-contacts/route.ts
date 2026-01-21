import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/estate-plans/[id]/family-contacts - List all contacts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')

    const where: { estatePlanId: string; role?: string } = { estatePlanId }
    if (role) {
      where.role = role
    }

    const contacts = await prisma.familyContact.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Failed to get family contacts:', error)
    return NextResponse.json(
      { error: 'Failed to get family contacts' },
      { status: 500 }
    )
  }
}

// POST /api/estate-plans/[id]/family-contacts - Create contact
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params
    const body = await request.json()
    const { name, relationship, role, phone, email, address, notes } = body

    if (!name || !role) {
      return NextResponse.json(
        { error: 'Name and role are required' },
        { status: 400 }
      )
    }

    const contact = await prisma.familyContact.create({
      data: {
        estatePlanId,
        name,
        relationship,
        role,
        phone,
        email,
        address,
        notes,
      },
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    console.error('Failed to create family contact:', error)
    return NextResponse.json(
      { error: 'Failed to create family contact' },
      { status: 500 }
    )
  }
}

// PUT /api/estate-plans/[id]/family-contacts - Update contact
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { id, name, relationship, role, phone, email, address, notes } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      )
    }

    const contact = await prisma.familyContact.update({
      where: { id },
      data: {
        name,
        relationship,
        role,
        phone,
        email,
        address,
        notes,
      },
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Failed to update family contact:', error)
    return NextResponse.json(
      { error: 'Failed to update family contact' },
      { status: 500 }
    )
  }
}

// DELETE /api/estate-plans/[id]/family-contacts - Delete contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const contactId = searchParams.get('contactId')

    if (!contactId) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      )
    }

    await prisma.familyContact.delete({
      where: { id: contactId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete family contact:', error)
    return NextResponse.json(
      { error: 'Failed to delete family contact' },
      { status: 500 }
    )
  }
}
