import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { ReminderType, ReminderStatus, Priority, RecurrencePattern, LifeEventType } from '@prisma/client'
import { requireAuthOrSessionAndOwnership } from '@/lib/auth-helper'

// Priority to days mapping for smart due dates
const PRIORITY_TO_DAYS = {
  urgent: 7,
  high: 14,
  medium: 30,
  low: 90,
} as const

// Calculate due date based on priority
function calculateDueDateFromPriority(priority: 'urgent' | 'high' | 'medium' | 'low'): Date {
  const days = PRIORITY_TO_DAYS[priority]
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
}

// Task breakdown templates for common document types
const TASK_BREAKDOWNS: Record<string, string[]> = {
  will: [
    'Choose an executor and backup executor',
    'List all beneficiaries and their shares',
    'Identify specific bequests (jewelry, heirlooms, etc.)',
    'Designate guardians for minor children if applicable',
    'Schedule consultation with estate planning attorney',
  ],
  trust: [
    'Determine the type of trust needed',
    'Identify trustee and successor trustee',
    'List assets to transfer into the trust',
    'Define distribution terms and conditions',
    'Review trust document with attorney',
  ],
  poa_financial: [
    'Choose a trusted agent for financial matters',
    'Decide on powers to grant (broad vs. limited)',
    'Choose a successor agent',
    'Review with attorney and have properly witnessed',
  ],
  poa_healthcare: [
    'Choose a healthcare proxy/agent',
    'Discuss your healthcare wishes with your agent',
    'Choose a successor healthcare agent',
    'Have document properly executed per state law',
  ],
  healthcare_directive: [
    'Consider end-of-life care preferences',
    'Document preferences for life-sustaining treatment',
    'Specify organ donation preferences',
    'Discuss wishes with family members',
    'Have document properly executed',
  ],
}

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

    // Verify ownership
    const { error } = await requireAuthOrSessionAndOwnership(estatePlanId, request)
    if (error) return error

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

    // Verify ownership
    const { error } = await requireAuthOrSessionAndOwnership(estatePlanId, request)
    if (error) return error

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

    // Check if this is a request to generate action items from gap analysis
    if (body.generateFromAnalysis === true) {
      // Get the latest gap analysis
      const analysis = await prisma.gapAnalysis.findFirst({
        where: { estatePlanId },
        orderBy: { createdAt: 'desc' },
      })

      if (!analysis) {
        return NextResponse.json(
          { error: 'No gap analysis found', created: 0 },
          { status: 404 }
        )
      }

      // Get existing reminders to avoid duplicates (by sourceId)
      const existingReminders = await prisma.reminder.findMany({
        where: { estatePlanId },
        select: { sourceId: true },
      })
      const existingSourceIds = new Set(
        existingReminders.filter((r: { sourceId: string | null }) => r.sourceId).map((r: { sourceId: string | null }) => r.sourceId)
      )

      let createdCount = 0

      // Parse and process missing documents
      const missingDocs: Array<{ type: string; priority?: string; reason?: string }> =
        JSON.parse(analysis.missingDocuments || '[]')

      for (const doc of missingDocs) {
        const sourceId = `missing_doc_${doc.type}`
        if (existingSourceIds.has(sourceId)) continue

        const priority = (doc.priority as 'urgent' | 'high' | 'medium' | 'low') || 'medium'
        const dueDate = calculateDueDateFromPriority(priority)

        // Create parent reminder
        const parentReminder = await prisma.reminder.create({
          data: {
            estatePlanId,
            type: 'document_update',
            title: `Create ${doc.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
            description: doc.reason || `Missing document: ${doc.type}`,
            dueDate,
            status: 'pending',
            priority: priority as Priority,
            isRecurring: false,
            sourceType: 'gap_analysis',
            sourceId,
            isAutoGenerated: true,
          },
        })
        createdCount++

        // Create sub-tasks if template exists
        if (TASK_BREAKDOWNS[doc.type]) {
          const subTasks = TASK_BREAKDOWNS[doc.type]
          for (let i = 0; i < subTasks.length; i++) {
            await prisma.reminder.create({
              data: {
                estatePlanId,
                type: 'document_update',
                title: subTasks[i],
                dueDate: new Date(dueDate.getTime() + i * 24 * 60 * 60 * 1000),
                status: 'pending',
                priority: 'medium',
                isRecurring: false,
                parentReminderId: parentReminder.id,
                sourceType: 'gap_analysis',
                sourceId: `${sourceId}_step_${i}`,
                isAutoGenerated: true,
              },
            })
            createdCount++
          }
        }
      }

      // Parse and process recommendations
      const recommendations: Array<{ action: string; priority?: string; reason?: string }> =
        JSON.parse(analysis.recommendations || '[]')

      for (let i = 0; i < recommendations.length; i++) {
        const rec = recommendations[i]
        const sourceId = `recommendation_${i}`
        if (existingSourceIds.has(sourceId)) continue

        const priority = (rec.priority as 'urgent' | 'high' | 'medium' | 'low') || 'medium'
        const dueDate = calculateDueDateFromPriority(priority)

        await prisma.reminder.create({
          data: {
            estatePlanId,
            type: 'custom',
            title: rec.action,
            description: rec.reason,
            dueDate,
            status: 'pending',
            priority: priority as Priority,
            isRecurring: false,
            sourceType: 'gap_analysis',
            sourceId,
            isAutoGenerated: true,
          },
        })
        createdCount++
      }

      // Parse and process inconsistencies
      const inconsistencies: Array<{ issue: string; details?: string; recommendation?: string }> =
        JSON.parse(analysis.inconsistencies || '[]')

      for (let i = 0; i < inconsistencies.length; i++) {
        const issue = inconsistencies[i]
        const sourceId = `inconsistency_${i}`
        if (existingSourceIds.has(sourceId)) continue

        // Inconsistencies are usually high priority
        const priority: 'high' = 'high'
        const dueDate = calculateDueDateFromPriority(priority)

        await prisma.reminder.create({
          data: {
            estatePlanId,
            type: 'document_update',
            title: `Resolve: ${issue.issue}`,
            description: issue.details
              ? `${issue.details}${issue.recommendation ? `\n\nRecommendation: ${issue.recommendation}` : ''}`
              : issue.recommendation,
            dueDate,
            status: 'pending',
            priority,
            isRecurring: false,
            sourceType: 'gap_analysis',
            sourceId,
            isAutoGenerated: true,
          },
        })
        createdCount++
      }

      return NextResponse.json(
        { success: true, created: createdCount, message: `Created ${createdCount} action items` },
        { status: 201 }
      )
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
        { error: 'Invalid request body', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create reminder' },
      { status: 500 }
    )
  }
}
