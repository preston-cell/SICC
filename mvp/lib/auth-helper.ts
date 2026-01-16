import { auth } from '@clerk/nextjs/server'

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
