/**
 * SWR hooks for Prisma/PostgreSQL queries
 *
 * These hooks replace Convex queries with API routes + SWR.
 * Import from this file instead of using Convex hooks during migration.
 */

import useSWR, { mutate } from 'swr'

// Standard fetcher for GET requests
const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || 'Request failed')
  }
  return res.json()
}

// ============================================
// ESTATE PLAN HOOKS
// ============================================

/**
 * Get recent estate plans for the current user/session
 */
export function useRecentEstatePlans(sessionId?: string, limit = 10) {
  const url = sessionId
    ? `/api/estate-plans?sessionId=${sessionId}&limit=${limit}`
    : `/api/estate-plans?limit=${limit}`

  return useSWR(url, fetcher, {
    refreshInterval: 5000,
  })
}

/**
 * Get a single estate plan by ID
 */
export function useEstatePlan(estatePlanId: string | null) {
  return useSWR(
    estatePlanId ? `/api/estate-plans/${estatePlanId}` : null,
    fetcher
  )
}

/**
 * Get a single estate plan with all related data (full view)
 */
export function useEstatePlanFull(estatePlanId: string | null) {
  return useSWR(
    estatePlanId ? `/api/estate-plans/${estatePlanId}?full=true` : null,
    fetcher
  )
}

/**
 * Create a new estate plan
 */
export async function createEstatePlan(data: {
  name?: string
  sessionId?: string
  stateOfResidence?: string
}) {
  const res = await fetch('/api/estate-plans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to create estate plan' }))
    throw new Error(error.error)
  }

  const plan = await res.json()

  // Invalidate the estate plans list
  mutate((key: string) => typeof key === 'string' && key.startsWith('/api/estate-plans'))

  return plan
}

/**
 * Update an estate plan
 */
export async function updateEstatePlan(
  estatePlanId: string,
  data: {
    name?: string
    stateOfResidence?: string
    status?: string
  }
) {
  const res = await fetch(`/api/estate-plans/${estatePlanId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to update estate plan' }))
    throw new Error(error.error)
  }

  const plan = await res.json()

  // Invalidate related caches
  mutate(`/api/estate-plans/${estatePlanId}`)
  mutate(`/api/estate-plans/${estatePlanId}?full=true`)

  return plan
}

// ============================================
// INTAKE DATA HOOKS
// ============================================

/**
 * Get intake progress for an estate plan
 */
export function useIntakeProgress(estatePlanId: string | null) {
  return useSWR(
    estatePlanId ? `/api/estate-plans/${estatePlanId}/intake/progress` : null,
    fetcher
  )
}

/**
 * Get all intake data for an estate plan
 */
export function useIntakeData(estatePlanId: string | null) {
  return useSWR(
    estatePlanId ? `/api/estate-plans/${estatePlanId}/intake` : null,
    fetcher
  )
}

/**
 * Get intake data for a specific section
 */
export function useIntakeSection(
  estatePlanId: string | null,
  section: 'personal' | 'family' | 'assets' | 'existing_documents' | 'goals' | null
) {
  return useSWR(
    estatePlanId && section
      ? `/api/estate-plans/${estatePlanId}/intake/${section}`
      : null,
    fetcher
  )
}

/**
 * Update intake data for a section
 */
export async function updateIntakeData(
  estatePlanId: string,
  section: string,
  data: { data: string; isComplete: boolean }
) {
  const res = await fetch(`/api/estate-plans/${estatePlanId}/intake/${section}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to update intake data' }))
    throw new Error(error.error)
  }

  const result = await res.json()

  // Invalidate related caches
  mutate(`/api/estate-plans/${estatePlanId}/intake/${section}`)
  mutate(`/api/estate-plans/${estatePlanId}/intake`)
  mutate(`/api/estate-plans/${estatePlanId}/intake/progress`)

  return result
}

// ============================================
// GAP ANALYSIS HOOKS
// ============================================

/**
 * Get latest gap analysis for an estate plan
 */
export function useLatestGapAnalysis(estatePlanId: string | null) {
  return useSWR(
    estatePlanId ? `/api/estate-plans/${estatePlanId}/gap-analysis` : null,
    fetcher
  )
}

/**
 * Get gap analysis history
 */
export function useGapAnalysisHistory(estatePlanId: string | null) {
  return useSWR(
    estatePlanId ? `/api/estate-plans/${estatePlanId}/gap-analysis?history=true` : null,
    fetcher
  )
}

/**
 * Save a gap analysis
 */
export async function saveGapAnalysis(
  estatePlanId: string,
  data: {
    score?: number
    estateComplexity?: string
    estimatedEstateTax?: string
    missingDocuments: string
    outdatedDocuments: string
    inconsistencies: string
    taxOptimization?: string
    medicaidPlanning?: string
    recommendations: string
    stateSpecificNotes: string
    rawAnalysis?: string
  }
) {
  const res = await fetch(`/api/estate-plans/${estatePlanId}/gap-analysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to save gap analysis' }))
    throw new Error(error.error)
  }

  const result = await res.json()

  // Invalidate related caches
  mutate(`/api/estate-plans/${estatePlanId}/gap-analysis`)
  mutate(`/api/estate-plans/${estatePlanId}?full=true`)

  return result
}

// ============================================
// DOCUMENT HOOKS
// ============================================

/**
 * Get all documents for an estate plan
 */
export function useDocuments(estatePlanId: string | null, type?: string) {
  const url = estatePlanId
    ? type
      ? `/api/estate-plans/${estatePlanId}/documents?type=${type}`
      : `/api/estate-plans/${estatePlanId}/documents`
    : null

  return useSWR(url, fetcher)
}

/**
 * Create a document
 */
export async function createDocument(
  estatePlanId: string,
  data: {
    type: string
    title: string
    content: string
    format?: string
  }
) {
  const res = await fetch(`/api/estate-plans/${estatePlanId}/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to create document' }))
    throw new Error(error.error)
  }

  const result = await res.json()

  // Invalidate cache
  mutate(`/api/estate-plans/${estatePlanId}/documents`)

  return result
}

// ============================================
// BENEFICIARY HOOKS
// ============================================

/**
 * Get beneficiary designations for an estate plan
 */
export function useBeneficiaryDesignations(estatePlanId: string | null) {
  return useSWR(
    estatePlanId ? `/api/estate-plans/${estatePlanId}/beneficiaries` : null,
    fetcher
  )
}

/**
 * Save beneficiary designations (bulk)
 */
export async function saveBeneficiaryDesignations(
  estatePlanId: string,
  designations: Array<{
    id?: string
    assetType: string
    assetName: string
    primaryBeneficiaryName: string
    [key: string]: unknown
  }>
) {
  const res = await fetch(`/api/estate-plans/${estatePlanId}/beneficiaries`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ designations }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to save beneficiaries' }))
    throw new Error(error.error)
  }

  const result = await res.json()

  // Invalidate cache
  mutate(`/api/estate-plans/${estatePlanId}/beneficiaries`)

  return result
}

// ============================================
// REMINDER HOOKS
// ============================================

/**
 * Get reminders for an estate plan
 */
export function useReminders(estatePlanId: string | null) {
  return useSWR(
    estatePlanId ? `/api/estate-plans/${estatePlanId}/reminders` : null,
    fetcher
  )
}

/**
 * Get reminder stats
 */
export function useReminderStats(estatePlanId: string | null) {
  const { data: reminders } = useReminders(estatePlanId)

  if (!reminders) return { data: null }

  const pending = reminders.filter((r: { status: string }) => r.status === 'pending').length
  const completed = reminders.filter((r: { status: string }) => r.status === 'completed').length
  const overdue = reminders.filter((r: { status: string; dueDate: string }) =>
    r.status === 'pending' && new Date(r.dueDate) < new Date()
  ).length

  return {
    data: { pending, completed, overdue, total: reminders.length },
  }
}

/**
 * Create a reminder
 */
export async function createReminder(
  estatePlanId: string,
  data: {
    type: string
    title: string
    description?: string
    dueDate: string
    priority?: string
    isRecurring?: boolean
    recurrencePattern?: string
  }
) {
  const res = await fetch(`/api/estate-plans/${estatePlanId}/reminders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to create reminder' }))
    throw new Error(error.error)
  }

  const result = await res.json()

  // Invalidate cache
  mutate(`/api/estate-plans/${estatePlanId}/reminders`)

  return result
}

/**
 * Create default reminders for an estate plan
 */
export async function createDefaultReminders(estatePlanId: string) {
  const res = await fetch(`/api/estate-plans/${estatePlanId}/reminders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ createDefaults: true }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to create default reminders' }))
    throw new Error(error.error)
  }

  const result = await res.json()

  // Invalidate cache
  mutate(`/api/estate-plans/${estatePlanId}/reminders`)

  return result
}

/**
 * Complete a reminder
 */
export async function completeReminder(reminderId: string, estatePlanId: string) {
  const res = await fetch(`/api/reminders/${reminderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'complete' }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to complete reminder' }))
    throw new Error(error.error)
  }

  // Invalidate cache
  mutate(`/api/estate-plans/${estatePlanId}/reminders`)

  return res.json()
}

/**
 * Snooze a reminder
 */
export async function snoozeReminder(
  reminderId: string,
  estatePlanId: string,
  snoozeDays: number
) {
  const res = await fetch(`/api/reminders/${reminderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'snooze', snoozeDays }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to snooze reminder' }))
    throw new Error(error.error)
  }

  // Invalidate cache
  mutate(`/api/estate-plans/${estatePlanId}/reminders`)

  return res.json()
}

/**
 * Dismiss a reminder
 */
export async function dismissReminder(reminderId: string, estatePlanId: string) {
  const res = await fetch(`/api/reminders/${reminderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'dismiss' }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to dismiss reminder' }))
    throw new Error(error.error)
  }

  // Invalidate cache
  mutate(`/api/estate-plans/${estatePlanId}/reminders`)

  return res.json()
}

// ============================================
// LIFE EVENT HOOKS
// ============================================

/**
 * Get life events for an estate plan
 */
export function useLifeEvents(estatePlanId: string | null) {
  return useSWR(
    estatePlanId ? `/api/estate-plans/${estatePlanId}/life-events` : null,
    fetcher
  )
}

/**
 * Log a life event
 */
export async function logLifeEvent(
  estatePlanId: string,
  data: {
    eventType: string
    title: string
    description?: string
    eventDate: string
    requiresDocumentUpdate?: boolean
    documentsAffected?: string
  }
) {
  const res = await fetch(`/api/estate-plans/${estatePlanId}/life-events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to log life event' }))
    throw new Error(error.error)
  }

  const result = await res.json()

  // Invalidate cache
  mutate(`/api/estate-plans/${estatePlanId}/life-events`)

  return result
}

// ============================================
// USER HOOKS
// ============================================

/**
 * Get or create user on auth sync
 */
export async function getOrCreateUser(data: { email: string; name: string }) {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to get or create user' }))
    throw new Error(error.error)
  }

  return res.json()
}

/**
 * Link session to user (transfers anonymous estate plans)
 */
export async function linkSessionToUser(sessionId: string) {
  const res = await fetch('/api/users', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to link session' }))
    throw new Error(error.error)
  }

  // Invalidate estate plans cache
  mutate((key: string) => typeof key === 'string' && key.startsWith('/api/estate-plans'))

  return res.json()
}
