import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Safely get Clerk user ID
 * Returns null if middleware not configured or user not authenticated
 */
export async function getClerkUserId(): Promise<string | null> {
  try {
    const { userId } = await auth()
    return userId
  } catch {
    // Clerk middleware not configured - continue with anonymous mode
    return null
  }
}

/**
 * Auth context containing user info and session
 */
export interface AuthContext {
  clerkId: string | null
  userId: string | null  // Database user ID
  sessionId: string | null
  isAuthenticated: boolean
}

/**
 * Get the full auth context including database user ID
 */
export async function getAuthContext(request?: NextRequest): Promise<AuthContext> {
  const clerkId = await getClerkUserId()
  let userId: string | null = null
  let sessionId: string | null = null

  if (clerkId) {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true }
    })
    userId = user?.id || null
  }

  // Get session ID from query params or cookies
  if (request) {
    sessionId = request.nextUrl.searchParams.get('sessionId')
      || request.cookies.get('estatePlanSessionId')?.value
      || null
  }

  return {
    clerkId,
    userId,
    sessionId,
    isAuthenticated: !!clerkId
  }
}

/**
 * Verify ownership of an estate plan
 * Returns the estate plan if the user owns it, null otherwise
 */
export async function verifyEstatePlanOwnership(
  estatePlanId: string,
  authContext: AuthContext
): Promise<{ owned: boolean; reason?: string }> {
  const plan = await prisma.estatePlan.findUnique({
    where: { id: estatePlanId },
    select: { userId: true, sessionId: true }
  })

  if (!plan) {
    return { owned: false, reason: 'Estate plan not found' }
  }

  // If user is authenticated, check userId match
  if (authContext.userId && plan.userId === authContext.userId) {
    return { owned: true }
  }

  // If user is not authenticated, check sessionId match
  // Only allow if plan has no userId (anonymous plan)
  if (!authContext.userId && authContext.sessionId && plan.sessionId === authContext.sessionId && !plan.userId) {
    return { owned: true }
  }

  return { owned: false, reason: 'You do not have permission to access this estate plan' }
}

/**
 * Require authentication - returns error response if not authenticated
 * Use this for routes that REQUIRE login
 */
export function requireAuth(authContext: AuthContext): NextResponse | null {
  if (!authContext.isAuthenticated) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }
  return null
}

/**
 * Require ownership of an estate plan
 * Returns error response if user doesn't own the plan
 */
export async function requireOwnership(
  estatePlanId: string,
  authContext: AuthContext
): Promise<NextResponse | null> {
  const { owned, reason } = await verifyEstatePlanOwnership(estatePlanId, authContext)

  if (!owned) {
    const status = reason === 'Estate plan not found' ? 404 : 403
    return NextResponse.json({ error: reason }, { status })
  }

  return null
}

/**
 * Combined auth check: require auth OR session, and verify ownership
 * This is the most common pattern for estate plan routes
 */
export async function requireAuthOrSessionAndOwnership(
  estatePlanId: string,
  request: NextRequest
): Promise<{ authContext: AuthContext; error: NextResponse | null }> {
  const authContext = await getAuthContext(request)

  // Must have either auth or session
  if (!authContext.userId && !authContext.sessionId) {
    return {
      authContext,
      error: NextResponse.json(
        { error: 'Authentication or session required' },
        { status: 401 }
      )
    }
  }

  const ownershipError = await requireOwnership(estatePlanId, authContext)
  return { authContext, error: ownershipError }
}
