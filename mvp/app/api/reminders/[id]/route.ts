import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

// Schema for updating reminder status
const UpdateReminderSchema = z.object({
  action: z.enum(['complete', 'snooze', 'dismiss']),
  snoozeDays: z.number().optional(), // Required for snooze action
})

// PATCH /api/reminders/[id] - Update reminder status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { action, snoozeDays } = UpdateReminderSchema.parse(body)

    const now = new Date()

    let updateData: Record<string, unknown> = {}

    switch (action) {
      case 'complete':
        updateData = {
          status: 'completed',
          completedAt: now,
        }
        break

      case 'snooze':
        if (!snoozeDays || snoozeDays <= 0) {
          return NextResponse.json(
            { error: 'snoozeDays is required for snooze action' },
            { status: 400 }
          )
        }
        updateData = {
          status: 'snoozed',
          snoozedUntil: new Date(now.getTime() + snoozeDays * 24 * 60 * 60 * 1000),
        }
        break

      case 'dismiss':
        updateData = {
          status: 'dismissed',
        }
        break
    }

    const reminder = await prisma.reminder.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(reminder)
  } catch (error) {
    console.error('Failed to update reminder:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update reminder' },
      { status: 500 }
    )
  }
}

// DELETE /api/reminders/[id] - Delete a reminder
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.reminder.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete reminder:', error)
    return NextResponse.json(
      { error: 'Failed to delete reminder' },
      { status: 500 }
    )
  }
}
