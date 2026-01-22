import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { LifeEventType } from '@prisma/client'
import { requireAuthOrSessionAndOwnership } from '@/lib/auth-helper'

// Schema for logging a life event
const LogLifeEventSchema = z.object({
  eventType: z.enum([
    'marriage', 'divorce', 'birth', 'death', 'major_asset_change',
    'relocation', 'retirement', 'business_change', 'health_change', 'other'
  ]),
  title: z.string(),
  description: z.string().optional(),
  eventDate: z.string().transform(s => new Date(s)),
  requiresDocumentUpdate: z.boolean().optional(),
  documentsAffected: z.string().optional(), // JSON array
})

// GET /api/estate-plans/[id]/life-events - Get all life events
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params

    // Verify ownership
    const { error } = await requireAuthOrSessionAndOwnership(estatePlanId, request)
    if (error) return error

    const lifeEvents = await prisma.lifeEvent.findMany({
      where: { estatePlanId },
      orderBy: { eventDate: 'desc' },
    })

    return NextResponse.json(lifeEvents)
  } catch (error) {
    console.error('Failed to get life events:', error)
    return NextResponse.json(
      { error: 'Failed to get life events' },
      { status: 500 }
    )
  }
}

// POST /api/estate-plans/[id]/life-events - Log a life event
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
    const data = LogLifeEventSchema.parse(body)

    const lifeEvent = await prisma.lifeEvent.create({
      data: {
        estatePlanId,
        eventType: data.eventType as LifeEventType,
        title: data.title,
        description: data.description,
        eventDate: data.eventDate,
        requiresDocumentUpdate: data.requiresDocumentUpdate || false,
        documentsAffected: data.documentsAffected,
        planUpdated: false,
      },
    })

    return NextResponse.json(lifeEvent, { status: 201 })
  } catch (error) {
    console.error('Failed to log life event:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to log life event' },
      { status: 500 }
    )
  }
}

// Schema for marking a life event as addressed
const MarkAddressedSchema = z.object({
  eventId: z.string(),
})

// PATCH /api/estate-plans/[id]/life-events - Mark a life event as addressed
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
    const data = MarkAddressedSchema.parse(body)

    // Verify the life event belongs to this estate plan
    const lifeEvent = await prisma.lifeEvent.findFirst({
      where: {
        id: data.eventId,
        estatePlanId,
      },
    })

    if (!lifeEvent) {
      return NextResponse.json(
        { error: 'Life event not found' },
        { status: 404 }
      )
    }

    const updatedEvent = await prisma.lifeEvent.update({
      where: { id: data.eventId },
      data: {
        planUpdated: true,
        planUpdatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error('Failed to mark life event as addressed:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to mark life event as addressed' },
      { status: 500 }
    )
  }
}
