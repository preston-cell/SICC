/**
 * Plan Storage Utility
 * Centralized management of estate plan IDs and session storage
 *
 * Uses sessionStorage for current session's active plan (prevents cross-tab issues)
 * Uses localStorage for persistent recovery across browser sessions
 */

const SESSION_PLAN_KEY = 'currentSessionPlanId';
const PERSISTENT_PLAN_KEY = 'estatePlanId';
const SESSION_ID_KEY = 'estatePlanSessionId';

/**
 * Get the current plan ID, preferring session storage over local storage
 */
export function getCurrentPlanId(): string | null {
  if (typeof window === 'undefined') return null;

  // First check sessionStorage for current session's plan (more reliable for single session)
  const sessionPlan = sessionStorage.getItem(SESSION_PLAN_KEY);
  if (sessionPlan) return sessionPlan;

  // Fall back to localStorage for persistence across browser sessions
  return localStorage.getItem(PERSISTENT_PLAN_KEY);
}

/**
 * Set the current plan ID in both session and local storage
 */
export function setCurrentPlanId(planId: string): void {
  if (typeof window === 'undefined') return;

  // Set in both storages for reliability
  sessionStorage.setItem(SESSION_PLAN_KEY, planId);
  localStorage.setItem(PERSISTENT_PLAN_KEY, planId);
}

/**
 * Get the session ID for anonymous authentication
 */
export function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_ID_KEY);
}

/**
 * Set the session ID for anonymous authentication
 */
export function setSessionId(sessionId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_ID_KEY, sessionId);
}

/**
 * Clear all plan-related storage (used when starting fresh)
 */
export function clearCurrentPlan(): void {
  if (typeof window === 'undefined') return;

  sessionStorage.removeItem(SESSION_PLAN_KEY);
  localStorage.removeItem(PERSISTENT_PLAN_KEY);
  localStorage.removeItem(SESSION_ID_KEY);
}

/**
 * Switch to preparing for a new plan without losing recovery data
 * Only clears session storage, keeps localStorage for potential recovery
 */
export function switchToNewPlan(): void {
  if (typeof window === 'undefined') return;

  sessionStorage.removeItem(SESSION_PLAN_KEY);
}

/**
 * Generate a new session ID
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

/**
 * Initialize a new plan's storage
 */
export function initializePlanStorage(planId: string, sessionId: string): void {
  setCurrentPlanId(planId);
  setSessionId(sessionId);
}

/**
 * Validate that a planId from URL matches what we expect
 * Useful for detecting when user manually edits URL
 */
export function validatePlanIdForSession(urlPlanId: string | null): boolean {
  if (!urlPlanId) return true; // No URL planId is fine

  const currentPlanId = getCurrentPlanId();
  if (!currentPlanId) return true; // No stored plan is fine

  // Mismatch could indicate user navigating to different plan
  // This is informational - the URL planId should take precedence
  return urlPlanId === currentPlanId;
}
