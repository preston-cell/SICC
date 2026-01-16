import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { getClerkUserId } from '@/lib/auth-helper'

// Schema for getting or creating a user
const GetOrCreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
})

// Schema for linking session to user
const LinkSessionSchema = z.object({
  sessionId: z.string(),
})

// GET /api/users - Get current user
export async function GET() {
  try {
    const clerkId = await getClerkUserId()

    if (!clerkId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Failed to get user:', error)
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    )
  }
}

// POST /api/users - Get or create a user (called on auth sync)
export async function POST(request: NextRequest) {
  try {
    const clerkId = await getClerkUserId()

    if (!clerkId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { email, name } = GetOrCreateUserSchema.parse(body)

    // Try to find existing user by clerkId or email
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { clerkId },
          { email },
        ],
      },
    })

    if (user) {
      // Update with clerkId if not set
      if (!user.clerkId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { clerkId, lastLoginAt: new Date() },
        })
      } else {
        // Just update last login
        user = await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          name,
          clerkId,
          lastLoginAt: new Date(),
        },
      })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Failed to get or create user:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to get or create user' },
      { status: 500 }
    )
  }
}

// PATCH /api/users - Link session to user (transfers anonymous estate plans)
export async function PATCH(request: NextRequest) {
  try {
    const clerkId = await getClerkUserId()

    if (!clerkId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { sessionId } = LinkSessionSchema.parse(body)

    // Get the user
    const user = await prisma.user.findUnique({
      where: { clerkId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Transfer all estate plans from session to user
    const result = await prisma.estatePlan.updateMany({
      where: {
        sessionId,
        userId: null, // Only transfer unlinked plans
      },
      data: {
        userId: user.id,
        sessionId: null,
      },
    })

    return NextResponse.json({
      success: true,
      transferredCount: result.count,
    })
  } catch (error) {
    console.error('Failed to link session to user:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to link session to user' },
      { status: 500 }
    )
  }
}
