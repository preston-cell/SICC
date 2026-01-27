/**
 * SWR hooks for Prisma/PostgreSQL queries
 *
 * These hooks provide data fetching and mutations via API routes + SWR.
 */

import useSWR, { mutate } from 'swr'

/**
 * Get sessionId from localStorage (client-side only)
 */
function getSessionId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('estatePlanSessionId')
}

/**
 * Append sessionId to URL for anonymous user authentication
 */
function appendSessionId(url: string): string {
  const sessionId = getSessionId()
  if (!sessionId) return url

  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}sessionId=${sessionId}`
}

// Standard fetcher for GET requests - auto-includes sessionId for auth
const fetcher = async (url: string) => {
  const urlWithSession = appendSessionId(url)
  const res = await fetch(urlWithSession)
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || 'Request failed')
  }
  return res.json()
}

/**
 * Authenticated fetch helper - includes sessionId for all requests
 */
async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const urlWithSession = appendSessionId(url)
  return fetch(urlWithSession, options)
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
  const res = await authFetch(`/api/estate-plans/${estatePlanId}`, {
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
  const res = await authFetch(`/api/estate-plans/${estatePlanId}/intake/${section}`, {
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
    scoreBreakdown?: string
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
  const res = await authFetch(`/api/estate-plans/${estatePlanId}/gap-analysis`, {
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
  const res = await authFetch(`/api/estate-plans/${estatePlanId}/documents`, {
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
  const res = await authFetch(`/api/estate-plans/${estatePlanId}/beneficiaries`, {
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
  const res = await authFetch(`/api/estate-plans/${estatePlanId}/reminders`, {
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
  const res = await authFetch(`/api/estate-plans/${estatePlanId}/reminders`, {
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
 * Generate action items from gap analysis recommendations as reminders
 */
export async function generateActionItems({ estatePlanId }: { estatePlanId: string }) {
  const res = await authFetch(`/api/estate-plans/${estatePlanId}/reminders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ generateFromAnalysis: true }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to generate action items' }))
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
  const res = await authFetch(`/api/reminders/${reminderId}`, {
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

  return await res.json()
}

/**
 * Snooze a reminder
 */
export async function snoozeReminder(
  reminderId: string,
  estatePlanId: string,
  snoozeDays: number
) {
  const res = await authFetch(`/api/reminders/${reminderId}`, {
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

  return await res.json()
}

/**
 * Dismiss a reminder
 */
export async function dismissReminder(reminderId: string, estatePlanId: string) {
  const res = await authFetch(`/api/reminders/${reminderId}`, {
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

  return await res.json()
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
    eventDate: string | number
    requiresDocumentUpdate?: boolean
    documentsAffected?: string[]
  }
) {
  // Convert eventDate to ISO string if it's a timestamp
  const eventDate = typeof data.eventDate === 'number'
    ? new Date(data.eventDate).toISOString()
    : data.eventDate

  // Convert documentsAffected array to JSON string for storage
  const documentsAffected = data.documentsAffected
    ? JSON.stringify(data.documentsAffected)
    : undefined

  const res = await authFetch(`/api/estate-plans/${estatePlanId}/life-events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      eventDate,
      documentsAffected,
    }),
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

/**
 * Mark a life event as addressed (plan updated)
 */
export async function markLifeEventAddressed(
  estatePlanId: string,
  eventId: string
) {
  const res = await authFetch(`/api/estate-plans/${estatePlanId}/life-events`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventId }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to mark life event as addressed' }))
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

  return await res.json()
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

  return await res.json()
}

// ============================================
// UPLOADED DOCUMENTS HOOKS (PLACEHOLDER)
// ============================================

/**
 * Get uploaded documents for an estate plan
 * TODO: Implement API route when document upload feature is needed
 */
export function useUploadedDocuments(estatePlanId: string | null) {
  // Placeholder - returns empty array until document upload API is implemented
  return {
    data: [] as Array<{
      id: string
      fileName: string
      documentType: string
      analysisStatus: string
      analysisResult?: string
      description?: string
      fileUrl?: string
      fileSize?: number
      uploadedAt?: string
      analysisError?: string
    }>,
    isLoading: false,
    error: null,
    mutate: () => {},
  }
}

// ============================================
// EXTRACTED DATA HOOKS (PLACEHOLDER)
// ============================================

/**
 * Get extracted data from uploaded documents
 * TODO: Implement API route when document analysis feature is needed
 */
export function useExtractedData(estatePlanId: string | null) {
  // Placeholder - returns empty array until document analysis API is implemented
  return {
    data: [] as Array<{
      id: string
      section: string
      extractedData: string
      confidence: number
    }>,
    isLoading: false,
    error: null,
    mutate: () => {},
  }
}


/**
 * Get extracted data for a specific section
 */
export function useExtractedDataBySection(
  estatePlanId: string | null,
  section: "personal" | "family" | "assets" | "existing_documents" | "goals" | null
) {
  return useSWR(
    estatePlanId && section
      ? `/api/estate-plans/${estatePlanId}/extracted-data?section=${section}`
      : null,
    fetcher
  )
}

// ============================================
// GUIDED INTAKE HOOKS
// ============================================

export function useGuidedIntakeProgress(estatePlanId: string | null) {
  return useSWR(
    estatePlanId ? `/api/estate-plans/${estatePlanId}/guided-intake` : null,
    fetcher
  )
}

export async function initializeGuidedIntake(estatePlanId: string) {
  const res = await authFetch(`/api/estate-plans/${estatePlanId}/guided-intake`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error('Failed to initialize guided intake')
  const result = await res.json()
  mutate(`/api/estate-plans/${estatePlanId}/guided-intake`)
  return result
}

export async function saveGuidedStepData(
  estatePlanId: string,
  step: number,
  data: Record<string, unknown>,
  complete = false
) {
  const res = await authFetch(`/api/estate-plans/${estatePlanId}/guided-intake`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ step, data, complete }),
  })
  if (!res.ok) throw new Error('Failed to save step data')
  const result = await res.json()
  mutate(`/api/estate-plans/${estatePlanId}/guided-intake`)
  return result
}

// ============================================
// FAMILY CONTACTS HOOKS
// ============================================

export function useFamilyContacts(estatePlanId: string | null, role?: string) {
  const url = estatePlanId
    ? role
      ? `/api/estate-plans/${estatePlanId}/family-contacts?role=${role}`
      : `/api/estate-plans/${estatePlanId}/family-contacts`
    : null
  return useSWR(url, fetcher)
}

export function useFamilyContactCount(estatePlanId: string | null) {
  const { data: contacts } = useFamilyContacts(estatePlanId)
  return { data: contacts?.length || 0 }
}

export async function createFamilyContact(
  estatePlanId: string,
  data: { name: string; role: string; relationship?: string; phone?: string; email?: string; address?: string; notes?: string }
) {
  const res = await authFetch(`/api/estate-plans/${estatePlanId}/family-contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create contact')
  const result = await res.json()
  mutate(`/api/estate-plans/${estatePlanId}/family-contacts`)
  return result
}

export async function updateFamilyContact(
  estatePlanId: string,
  contactId: string,
  data: { name?: string; role?: string; relationship?: string; phone?: string; email?: string; address?: string; notes?: string }
) {
  const res = await authFetch(`/api/estate-plans/${estatePlanId}/family-contacts`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: contactId, ...data }),
  })
  if (!res.ok) throw new Error('Failed to update contact')
  const result = await res.json()
  mutate(`/api/estate-plans/${estatePlanId}/family-contacts`)
  return result
}

export async function deleteFamilyContact(estatePlanId: string, contactId: string) {
  const res = await authFetch(`/api/estate-plans/${estatePlanId}/family-contacts?contactId=${contactId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete contact')
  mutate(`/api/estate-plans/${estatePlanId}/family-contacts`)
  return await res.json()
}

// ============================================
// ATTORNEY QUESTIONS HOOKS
// ============================================

export function useAttorneyQuestions(estatePlanId: string | null, category?: string) {
  const url = estatePlanId
    ? category
      ? `/api/estate-plans/${estatePlanId}/attorney-questions?category=${category}`
      : `/api/estate-plans/${estatePlanId}/attorney-questions`
    : null
  return useSWR(url, fetcher)
}

export function useAttorneyQuestionCount(estatePlanId: string | null) {
  return useSWR(
    estatePlanId ? `/api/estate-plans/${estatePlanId}/attorney-questions?count=true` : null,
    fetcher
  )
}

export async function createAttorneyQuestion(estatePlanId: string, data: { question: string; category: string }) {
  const res = await authFetch(`/api/estate-plans/${estatePlanId}/attorney-questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create question')
  const result = await res.json()
  mutate(`/api/estate-plans/${estatePlanId}/attorney-questions`)
  mutate(`/api/estate-plans/${estatePlanId}/attorney-questions?count=true`)
  return result
}

export async function updateAttorneyQuestion(
  estatePlanId: string,
  questionId: string,
  data: { question?: string; category?: string; isAnswered?: boolean; answer?: string }
) {
  const res = await authFetch(`/api/estate-plans/${estatePlanId}/attorney-questions`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: questionId, ...data }),
  })
  if (!res.ok) throw new Error('Failed to update question')
  const result = await res.json()
  mutate(`/api/estate-plans/${estatePlanId}/attorney-questions`)
  mutate(`/api/estate-plans/${estatePlanId}/attorney-questions?count=true`)
  return result
}

export async function deleteAttorneyQuestion(estatePlanId: string, questionId: string) {
  const res = await authFetch(`/api/estate-plans/${estatePlanId}/attorney-questions?questionId=${questionId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete question')
  mutate(`/api/estate-plans/${estatePlanId}/attorney-questions`)
  mutate(`/api/estate-plans/${estatePlanId}/attorney-questions?count=true`)
  return await res.json()
}

// ============================================
// DOCUMENT CHECKLIST HOOKS
// ============================================

export function useDocumentChecklist(estatePlanId: string | null, category?: string) {
  const url = estatePlanId
    ? category
      ? `/api/estate-plans/${estatePlanId}/document-checklist?category=${category}`
      : `/api/estate-plans/${estatePlanId}/document-checklist`
    : null
  return useSWR(url, fetcher)
}

export function useChecklistProgress(estatePlanId: string | null) {
  return useSWR(
    estatePlanId ? `/api/estate-plans/${estatePlanId}/document-checklist?progress=true` : null,
    fetcher
  )
}

export async function generateDocumentChecklist(estatePlanId: string) {
  const res = await authFetch(`/api/estate-plans/${estatePlanId}/document-checklist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error('Failed to generate checklist')
  const result = await res.json()
  mutate(`/api/estate-plans/${estatePlanId}/document-checklist`)
  mutate(`/api/estate-plans/${estatePlanId}/document-checklist?progress=true`)
  return result
}

export async function updateChecklistItemStatus(
  estatePlanId: string,
  itemId: string,
  status: 'not_gathered' | 'in_progress' | 'gathered'
) {
  const res = await authFetch(`/api/estate-plans/${estatePlanId}/document-checklist`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: itemId, status }),
  })
  if (!res.ok) throw new Error('Failed to update item status')
  const result = await res.json()
  mutate(`/api/estate-plans/${estatePlanId}/document-checklist`)
  mutate(`/api/estate-plans/${estatePlanId}/document-checklist?progress=true`)
  return result
}

// ============================================
// GAP ANALYSIS RUNS HOOKS
// ============================================

export function useLatestGapAnalysisRun(estatePlanId: string | null) {
  return useSWR(
    estatePlanId ? `/api/estate-plans/${estatePlanId}/gap-analysis-runs?latest=true` : null,
    fetcher,
    { refreshInterval: 2000 }
  )
}

/**
 * Get gap analysis run progress by runId
 * Returns run data with phases for tracking progress
 */
export function useGapAnalysisRunProgress(estatePlanId: string | null, runId: string | null) {
  return useSWR(
    estatePlanId && runId ? `/api/estate-plans/${estatePlanId}/gap-analysis-runs?runId=${runId}` : null,
    fetcher,
    { refreshInterval: 1000 }
  )
}

export function useActiveGapAnalysisRun(estatePlanId: string | null) {
  return useSWR(
    estatePlanId ? `/api/estate-plans/${estatePlanId}/gap-analysis-runs?active=true` : null,
    fetcher,
    { refreshInterval: 1000 }
  )
}

export function useGapAnalysisRunHistory(estatePlanId: string | null) {
  return useSWR(
    estatePlanId ? `/api/estate-plans/${estatePlanId}/gap-analysis-runs?history=true` : null,
    fetcher
  )
}

export async function createGapAnalysisRun(estatePlanId: string, analysisType: 'quick' | 'comprehensive' = 'comprehensive') {
  const res = await authFetch(`/api/estate-plans/${estatePlanId}/gap-analysis-runs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ analysisType }),
  })
  if (!res.ok) throw new Error('Failed to create analysis run')
  const result = await res.json()
  mutate(`/api/estate-plans/${estatePlanId}/gap-analysis-runs?latest=true`)
  mutate(`/api/estate-plans/${estatePlanId}/gap-analysis-runs?active=true`)
  return result
}

export async function updateGapAnalysisRun(
  estatePlanId: string,
  runId: string,
  data: { status?: string; currentPhase?: number; progressPercent?: number; error?: string }
) {
  const res = await authFetch(`/api/estate-plans/${estatePlanId}/gap-analysis-runs`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ runId, ...data }),
  })
  if (!res.ok) throw new Error('Failed to update analysis run')
  const result = await res.json()
  mutate(`/api/estate-plans/${estatePlanId}/gap-analysis-runs?latest=true`)
  mutate(`/api/estate-plans/${estatePlanId}/gap-analysis-runs?active=true`)
  return result
}

/**
 * Cancel a running gap analysis
 */
export async function cancelGapAnalysisRun(estatePlanId: string, runId: string) {
  const res = await authFetch(`/api/estate-plans/${estatePlanId}/gap-analysis-runs`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      runId,
      status: 'failed',
      error: 'Cancelled by user'
    }),
  })
  if (!res.ok) throw new Error('Failed to cancel analysis')
  const result = await res.json()
  mutate(`/api/estate-plans/${estatePlanId}/gap-analysis-runs?latest=true`)
  mutate(`/api/estate-plans/${estatePlanId}/gap-analysis-runs?active=true`)
  mutate(`/api/estate-plans/${estatePlanId}/gap-analysis-runs?runId=${runId}`)
  return result
}

// ============================================
// PREPARATION PROGRESS (AGGREGATE)
// ============================================

export function usePreparationProgress(estatePlanId: string | null) {
  const { data: checklistProgress } = useChecklistProgress(estatePlanId)
  const { data: contactCount } = useFamilyContactCount(estatePlanId)
  const { data: questionCount } = useAttorneyQuestionCount(estatePlanId)

  if (!estatePlanId) return { data: null, isLoading: false }
  const isLoading = !checklistProgress && !contactCount && !questionCount
  if (isLoading) return { data: null, isLoading: true }

  return {
    data: {
      documents: {
        total: checklistProgress?.total || 0,
        completed: checklistProgress?.gathered || 0,
        percentComplete: checklistProgress?.percentComplete || 0,
      },
      contacts: {
        total: contactCount || 0,
        required: 2,
        isComplete: (contactCount || 0) >= 2,
      },
      questions: {
        total: questionCount?.total || 0,
        answered: questionCount?.answered || 0,
        percentComplete: questionCount?.total ? Math.round((questionCount.answered / questionCount.total) * 100) : 0,
      },
    },
    isLoading: false,
  }
}
