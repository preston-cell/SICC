import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { ReminderType, ReminderStatus, Priority, RecurrencePattern, LifeEventType } from '@prisma/client'

// Schema for creating a reminder
const CreateReminderSchema = z.object({
  type: z.enum(['annual_review', 'life_event', 'document_update', 'beneficiary_review', 'custom']),
  title: z.string(),
  description: z.string().optional(),
  lifeEvent: z.enum([
    'marriage', 'divorce', 'birth', 'death', 'major_asset_change',
    'relocation', 'retirement', 'business_change', 'health_change', 'other'
  ]).optional(),
  dueDate: z.string().transform(s => new Date(s)),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  isRecurring: z.boolean().optional(),
  recurrencePattern: z.enum(['monthly', 'quarterly', 'annually', 'biannually']).optional(),
})

// GET /api/estate-plans/[id]/reminders - Get all reminders
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params
    const status = request.nextUrl.searchParams.get('status')

    const where: { estatePlanId: string; status?: ReminderStatus } = { estatePlanId }
    if (status) {
      where.status = status as ReminderStatus
    }

    const reminders = await prisma.reminder.findMany({
      where,
      orderBy: { dueDate: 'asc' },
    })

    return NextResponse.json(reminders)
  } catch (error) {
    console.error('Failed to get reminders:', error)
    return NextResponse.json(
      { error: 'Failed to get reminders' },
      { status: 500 }
    )
  }
}

// POST /api/estate-plans/[id]/reminders - Create a reminder
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params
    const body = await request.json()

    // Check if this is a request to create default reminders
    if (body.createDefaults === true) {
      const now = new Date()
      const oneYear = 365 * 24 * 60 * 60 * 1000

      const reminders = await prisma.reminder.createMany({
        data: [
          {
            estatePlanId,
            type: 'annual_review',
            title: 'Annual Estate Plan Review',
            description: 'Review your estate plan to ensure it reflects your current wishes and life circumstances.',
            dueDate: new Date(now.getTime() + oneYear),
            status: 'pending',
            priority: 'medium',
            isRecurring: true,
            recurrencePattern: 'annually',
          },
          {
            estatePlanId,
            type: 'beneficiary_review',
            title: 'Review Beneficiary Designations',
            description: 'Verify that beneficiary designations on retirement accounts, life insurance, and other accounts are current.',
            dueDate: new Date(now.getTime() + (oneYear / 2)),
            status: 'pending',
            priority: 'medium',
            isRecurring: true,
            recurrencePattern: 'biannually',
          },
        ],
      })

      return NextResponse.json({ success: true, count: reminders.count }, { status: 201 })
    }

    const data = CreateReminderSchema.parse(body)

    const reminder = await prisma.reminder.create({
      data: {
        estatePlanId,
        type: data.type as ReminderType,
        title: data.title,
        description: data.description,
        lifeEvent: data.lifeEvent as LifeEventType | undefined,
        dueDate: data.dueDate,
        priority: (data.priority as Priority) || 'medium',
        isRecurring: data.isRecurring || false,
        recurrencePattern: data.recurrencePattern as RecurrencePattern | undefined,
        status: 'pending',
      },
    })

    return NextResponse.json(reminder, { status: 201 })
  } catch (error) {
    console.error('Failed to create reminder:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create reminder' },
      { status: 500 }
    )
  }
}
