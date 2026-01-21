import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { getClerkUserId } from '@/lib/auth-helper'

// Schema for creating an estate plan
const CreateEstatePlanSchema = z.object({
  name: z.string().optional(),
  sessionId: z.string().optional(),
  stateOfResidence: z.string().optional(),
})

// GET /api/estate-plans - List estate plans
export async function GET(request: NextRequest) {
  try {
    const clerkId = await getClerkUserId()
    const sessionId = request.nextUrl.searchParams.get('sessionId')
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10')

    // Build where clause based on auth state
    let where: Record<string, unknown> = {}

    if (clerkId) {
      // Logged in user - get plans linked to their account
      const user = await prisma.user.findUnique({ where: { clerkId } })
      if (user) {
        where = { userId: user.id }
      }
    } else if (sessionId) {
      // Anonymous user - get plans by session ID that aren't linked to a user
      where = { sessionId, userId: null }
    } else {
      // No auth context - return empty
      return NextResponse.json([])
    }

    const plans = await prisma.estatePlan.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json(plans)
  } catch (error) {
    console.error('Failed to list estate plans:', error)
    return NextResponse.json(
      { error: 'Failed to list estate plans' },
      { status: 500 }
    )
  }
}

// POST /api/estate-plans - Create a new estate plan
export async function POST(request: NextRequest) {
  try {
    const clerkId = await getClerkUserId()
    const body = await request.json()
    const { name, sessionId, stateOfResidence } = CreateEstatePlanSchema.parse(body)

    // Get user ID if logged in
    let userId: string | null = null
    if (clerkId) {
      const user = await prisma.user.findUnique({ where: { clerkId } })
      userId = user?.id || null
    }

    const plan = await prisma.estatePlan.create({
      data: {
        name: name || 'My Estate Plan',
        userId,
        sessionId: userId ? null : sessionId, // Only use sessionId if not logged in
        stateOfResidence,
        status: 'draft',
      },
    })

    return NextResponse.json(plan, { status: 201 })
  } catch (error) {
    console.error('Failed to create estate plan:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create estate plan' },
      { status: 500 }
    )
  }
}
