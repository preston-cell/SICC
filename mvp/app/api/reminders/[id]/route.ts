import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { requireAuthOrSessionAndOwnership } from '@/lib/auth-helper'

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

    // Get the reminder to verify ownership through the estate plan
    const existingReminder = await prisma.reminder.findUnique({
      where: { id },
      select: { estatePlanId: true }
    })

    if (!existingReminder) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 })
    }

    // Verify ownership of the estate plan
    const { error } = await requireAuthOrSessionAndOwnership(existingReminder.estatePlanId, request)
    if (error) return error

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

    const updatedReminder = await prisma.reminder.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updatedReminder)
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

    // Get the reminder to verify ownership through the estate plan
    const existingReminder = await prisma.reminder.findUnique({
      where: { id },
      select: { estatePlanId: true }
    })

    if (!existingReminder) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 })
    }

    // Verify ownership of the estate plan
    const { error } = await requireAuthOrSessionAndOwnership(existingReminder.estatePlanId, request)
    if (error) return error

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
