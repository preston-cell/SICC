"use client";

/**
 * Badge component to indicate a field was pre-filled from document extraction.
 * Used in intake forms to show which data came from uploaded documents.
 */
export function ExtractedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span>From Document</span>
    </span>
  );
}

/**
 * Banner to show when a form has pre-filled data from documents.
 * Should be displayed at the top of the form.
 */
export function ExtractedDataBanner() {
  return (
    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          Some fields have been pre-filled from your uploaded documents. Look for the{" "}
          <ExtractedBadge /> badge. Review and update as needed.
        </span>
      </div>
    </div>
  );
}
