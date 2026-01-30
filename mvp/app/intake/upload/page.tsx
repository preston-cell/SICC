"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR, { mutate } from "swr";
// No longer auto-creating plans - user must go through /intake to create one
import Link from "next/link";
import { useUser } from "@/app/components/ClerkComponents";
import { useAuthSyncPrisma } from "@/app/hooks/useAuthSyncPrisma";

// Check if Clerk authentication is configured
const isAuthEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

type DocumentType =
  | "will"
  | "trust"
  | "poa_financial"
  | "poa_healthcare"
  | "healthcare_directive"
  | "deed"
  | "insurance_policy"
  | "beneficiary_form"
  | "tax_return"
  | "other";

const DOCUMENT_TYPE_OPTIONS: Array<{ value: DocumentType; label: string; description: string }> = [
  { value: "will", label: "Will", description: "Last Will and Testament" },
  { value: "trust", label: "Trust", description: "Revocable or Irrevocable Trust" },
  { value: "poa_financial", label: "Financial POA", description: "Power of Attorney for Finances" },
  { value: "poa_healthcare", label: "Healthcare POA", description: "Healthcare Power of Attorney" },
  { value: "healthcare_directive", label: "Healthcare Directive", description: "Living Will / Advance Directive" },
  { value: "deed", label: "Deed", description: "Property Deed or Title" },
  { value: "insurance_policy", label: "Insurance Policy", description: "Life Insurance or Annuity" },
  { value: "beneficiary_form", label: "Beneficiary Form", description: "Beneficiary Designation" },
  { value: "tax_return", label: "Tax Return", description: "Federal or State Income Tax Return" },
  { value: "other", label: "Other", description: "Other Estate Document" },
];

interface UploadedDoc {
  id: string;
  fileName: string;
  documentType: DocumentType;
  analysisStatus: string;
}

interface ExtractedDataItem {
  id: string;
  section: string;
  parsedData: Record<string, unknown>;
  confidence: number;
  status: string;
}

// Helper to get sessionId from localStorage
function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("estatePlanSessionId");
}

// Helper to append sessionId to URL
function appendSessionId(url: string): string {
  const sessionId = getSessionId();
  if (!sessionId) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}sessionId=${sessionId}`;
}

// Fetcher for SWR - includes sessionId for auth
const fetcher = async (url: string) => {
  const res = await fetch(appendSessionId(url));
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }
  return res.json();
};

// API functions for document upload operations
async function uploadDocument(
  estatePlanId: string,
  file: File,
  documentType: DocumentType
): Promise<{ id: string }> {
  // Create FormData for file upload
  const formData = new FormData();
  formData.append("file", file);
  formData.append("documentType", documentType);

  const res = await fetch(appendSessionId(`/api/estate-plans/${estatePlanId}/uploaded-documents`), {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(error.error || "Upload failed");
  }

  const result = await res.json();

  // Invalidate the uploaded documents cache
  mutate(`/api/estate-plans/${estatePlanId}/uploaded-documents`);

  return result;
}

async function deleteUploadedDocument(
  estatePlanId: string,
  documentId: string
): Promise<void> {
  const res = await fetch(appendSessionId(`/api/estate-plans/${estatePlanId}/uploaded-documents?documentId=${documentId}`), {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Delete failed" }));
    throw new Error(error.error || "Delete failed");
  }

  // Invalidate the uploaded documents cache
  mutate(`/api/estate-plans/${estatePlanId}/uploaded-documents`);
}

async function extractIntakeData(
  estatePlanId: string
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(appendSessionId(`/api/estate-plans/${estatePlanId}/extract-intake`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Extraction failed" }));
    return { success: false, error: error.error || "Extraction failed" };
  }

  const result = await res.json();

  // Invalidate the extracted data cache
  mutate(`/api/estate-plans/${estatePlanId}/extracted-data`);

  return result;
}

function UploadStepContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");

  // Auth state (only relevant when Clerk is configured)
  const { isSignedIn, isLoaded } = useUser();
  useAuthSyncPrisma();

  // Get user ID from localStorage (set by useAuthSyncPrisma) - only used when auth is enabled
  const storedUserId = typeof window !== "undefined" ? localStorage.getItem("estatePlanUserId") : null;
  const userId = isAuthEnabled && isSignedIn && storedUserId ? storedUserId : null;

  // State
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(
    planId || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<DocumentType>("will");
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionComplete, setExtractionComplete] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // SWR Queries
  const { data: uploadedDocs } = useSWR<UploadedDoc[]>(
    currentPlanId ? `/api/estate-plans/${currentPlanId}/uploaded-documents` : null,
    fetcher
  );

  const { data: extractedData } = useSWR<ExtractedDataItem[]>(
    currentPlanId ? `/api/estate-plans/${currentPlanId}/extracted-data` : null,
    fetcher
  );

  // Redirect to intake if auth is enabled but not authenticated
  useEffect(() => {
    if (isAuthEnabled && isLoaded && !isSignedIn) {
      router.push("/intake");
    }
  }, [isLoaded, isSignedIn, router]);

  // Initialize plan from URL or localStorage - NO auto-creation
  useEffect(() => {
    const initializePlan = async () => {
      // Wait for auth check if auth is enabled
      if (isAuthEnabled && !isLoaded) {
        return;
      }

      if (!planId && !currentPlanId) {
        // Check localStorage for existing plan
        const savedPlanId = localStorage.getItem("estatePlanId");
        if (savedPlanId) {
          setCurrentPlanId(savedPlanId);
          router.replace(`/intake/upload?planId=${savedPlanId}`);
          return;
        }

        // NO AUTO-CREATION: Redirect to intake landing to create plan explicitly
        // This prevents orphaned plans and ensures user goes through proper flow
        router.replace("/intake");
        return;
      }

      // Set current plan ID from URL if present
      if (planId && !currentPlanId) {
        setCurrentPlanId(planId);
      }
    };

    initializePlan();
  }, [planId, currentPlanId, router, isLoaded]);

  // Handle file upload
  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!currentPlanId) {
        setUploadError("No estate plan found. Please refresh the page or start a new plan.");
        console.error("Upload failed: currentPlanId is null");
        return;
      }

      if (!file.type.includes("pdf")) {
        setUploadError("Please upload a PDF file");
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        setUploadError("File size must be less than 20MB");
        return;
      }

      setIsUploading(true);
      setUploadProgress(10);
      setUploadError(null);

      try {
        setUploadProgress(30);

        // Upload file directly to API
        await uploadDocument(currentPlanId, file, selectedType);
        setUploadProgress(100);

        // Reset file input by remounting it (key change)
        setFileInputKey((k) => k + 1);
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : "Upload failed");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [currentPlanId, selectedType]
  );

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  // Handle document deletion
  const handleDelete = useCallback(
    async (docId: string) => {
      if (!currentPlanId) return;
      if (confirm("Delete this document?")) {
        try {
          await deleteUploadedDocument(currentPlanId, docId);
        } catch (error) {
          setUploadError(error instanceof Error ? error.message : "Delete failed");
        }
      }
    },
    [currentPlanId]
  );

  // Handle extraction
  const handleExtractData = useCallback(async () => {
    if (!currentPlanId) return;

    setIsExtracting(true);
    try {
      const result = await extractIntakeData(currentPlanId);
      if (result.success) {
        setExtractionComplete(true);
      } else {
        setUploadError(result.error || "Extraction failed");
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Extraction failed");
    } finally {
      setIsExtracting(false);
    }
  }, [currentPlanId]);

  // Continue to questionnaire
  const handleContinue = () => {
    if (currentPlanId) {
      router.push(`/intake/personal?planId=${currentPlanId}`);
    }
  };

  // Skip upload step
  const handleSkip = () => {
    if (currentPlanId) {
      router.push(`/intake/personal?planId=${currentPlanId}`);
    }
  };

  // Loading state - wait for plan to be determined
  if (!currentPlanId && !planId) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-purple)]"></div>
      </div>
    );
  }

  const hasDocuments = uploadedDocs && uploadedDocs.length > 0;
  const hasExtractedData = extractedData && extractedData.length > 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--accent-muted)] rounded-full mb-4">
          <svg
            className="w-8 h-8 text-[var(--accent-purple)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h1 className="text-section text-[var(--text-heading)]">
          Do you have existing estate documents?
        </h1>
        <p className="text-[var(--text-muted)] mt-2 max-w-xl mx-auto">
          Upload your existing wills, trusts, or powers of attorney. We&apos;ll extract information
          to pre-fill your questionnaire and save you time.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white border border-[var(--border)] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[var(--text-heading)] mb-4">
          Upload Documents
        </h2>

        {/* Document Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[var(--text-heading)] mb-2">
            Document Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DOCUMENT_TYPE_OPTIONS.slice(0, 6).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedType(opt.value)}
                className={`
                  p-3 rounded-lg border text-left transition-colors text-sm
                  ${selectedType === opt.value
                    ? "border-[var(--accent-purple)] bg-[var(--accent-muted)]"
                    : "border-[var(--border)] hover:border-[var(--accent-purple)]"
                  }
                `}
              >
                <div className="font-medium text-[var(--text-heading)]">
                  {opt.label}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">
                  {opt.description}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            {DOCUMENT_TYPE_OPTIONS.slice(6).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedType(opt.value)}
                className={`
                  px-3 py-1.5 rounded-lg border text-sm transition-colors
                  ${selectedType === opt.value
                    ? "border-[var(--accent-purple)] bg-[var(--accent-muted)] text-[var(--accent-purple)]"
                    : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent-purple)]"
                  }
                `}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragging
              ? "border-[var(--accent-purple)] bg-[var(--accent-muted)]"
              : "border-[var(--border)] hover:border-[var(--accent-purple)]"
            }
            ${isUploading ? "pointer-events-none opacity-50" : ""}
          `}
        >
          <input
            key={fileInputKey}
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
          />

          {isUploading ? (
            <div>
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--accent-purple)] mx-auto mb-3"></div>
              <p className="text-[var(--text-muted)]">
                Uploading... {uploadProgress}%
              </p>
            </div>
          ) : (
            <>
              <svg
                className="w-10 h-10 mx-auto mb-3 text-[var(--text-muted)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-[var(--text-muted)]">
                <span className="font-medium text-[var(--accent-purple)]">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-sm text-[var(--text-caption)] mt-1">
                PDF files up to 20MB
              </p>
            </>
          )}
        </div>

        {/* Error Display */}
        {uploadError && (
          <div className="mt-4 p-3 bg-[var(--error-muted)] border border-[var(--error)] rounded-lg">
            <p className="text-sm text-[var(--error)]">{uploadError}</p>
          </div>
        )}

        {/* Uploaded Documents List */}
        {hasDocuments && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-[var(--text-heading)] mb-3">
              Uploaded ({uploadedDocs.length})
            </h3>
            <div className="space-y-2">
              {uploadedDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-[var(--off-white)] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-[var(--error)] flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-heading)] truncate max-w-[200px]">
                        {doc.fileName}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {DOCUMENT_TYPE_OPTIONS.find((o) => o.value === doc.documentType)?.label}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`
                        text-xs px-2 py-0.5 rounded-full
                        ${doc.analysisStatus === "completed"
                          ? "bg-[var(--success-muted)] text-[var(--success)]"
                          : doc.analysisStatus === "failed"
                            ? "bg-[var(--error-muted)] text-[var(--error)]"
                            : "bg-[var(--warning-muted)] text-[var(--warning)]"
                        }
                      `}
                    >
                      {doc.analysisStatus === "completed"
                        ? "Ready"
                        : doc.analysisStatus === "failed"
                          ? "Error"
                          : "Processing..."}
                    </span>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1 text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Extraction Status */}
      {hasDocuments && (
        <div className="bg-white border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[var(--text-heading)] mb-4">
            Extract Information
          </h2>

          {isExtracting ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--accent-purple)] mx-auto mb-3"></div>
              <p className="text-[var(--text-muted)]">
                AI is reading your documents...
              </p>
              <p className="text-sm text-[var(--text-caption)] mt-1">
                Extracting names, dates, beneficiaries, and more
              </p>
            </div>
          ) : extractionComplete || hasExtractedData ? (
            <div className="space-y-4">
              {/* Success Header */}
              <div className="flex items-center gap-3 p-4 bg-[var(--success-muted)] rounded-lg">
                <div className="w-10 h-10 bg-[var(--success-muted)] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-[var(--success)]">
                    Extraction Complete
                  </p>
                  <p className="text-sm text-[var(--success)]">
                    We found information to pre-fill your questionnaire
                  </p>
                </div>
              </div>

              {/* Extraction Summary */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-[var(--text-heading)]">
                  Data extracted for:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {extractedData?.map((item) => {
                    const sectionLabels: Record<string, { label: string; icon: string }> = {
                      personal: { label: "Personal Info", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                      family: { label: "Family Details", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
                      assets: { label: "Assets", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
                      existing_documents: { label: "Existing Docs", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
                      goals: { label: "Goals & Wishes", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
                    };
                    const sectionInfo = sectionLabels[item.section] || { label: item.section, icon: "" };
                    return (
                      <div
                        key={item.section}
                        className="flex items-center gap-2 p-2 bg-[var(--accent-muted)] rounded-lg"
                      >
                        <svg className="w-4 h-4 text-[var(--accent-purple)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sectionInfo.icon} />
                        </svg>
                        <span className="text-sm text-[var(--accent-purple)] font-medium">
                          {sectionInfo.label}
                        </span>
                        <svg className="w-4 h-4 text-[var(--success)] ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* What happens next */}
              <div className="p-3 bg-[var(--off-white)] rounded-lg">
                <p className="text-sm text-[var(--text-muted)]">
                  <span className="font-medium text-[var(--text-heading)]">Next:</span>{" "}
                  Review the pre-filled forms and make any corrections. Fields from your documents will be marked with a badge.
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Our AI will read your documents and extract names, addresses, beneficiaries, asset information, and more to pre-fill your questionnaire.
              </p>
              <button
                onClick={handleExtractData}
                className="w-full px-4 py-3 bg-[var(--accent-purple)] text-white rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Extract with AI
              </button>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {hasDocuments && (extractionComplete || hasExtractedData) ? (
          <button
            onClick={handleContinue}
            className="flex-1 px-6 py-4 bg-[var(--accent-purple)] text-white rounded-lg font-medium text-lg hover:bg-[var(--accent-hover)] transition-colors flex items-center justify-center gap-2"
          >
            Continue to Questionnaire
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : hasDocuments ? (
          <button
            onClick={handleContinue}
            className="flex-1 px-6 py-4 bg-[var(--off-white)] text-[var(--text-heading)] rounded-lg font-medium text-lg hover:bg-[var(--light-gray)] transition-colors border border-[var(--border)]"
          >
            Continue Without Extraction
          </button>
        ) : (
          <button
            onClick={handleSkip}
            className="flex-1 px-6 py-4 bg-[var(--accent-purple)] text-white rounded-lg font-medium text-lg hover:bg-[var(--accent-hover)] transition-colors"
          >
            I Don&apos;t Have Documents - Start Fresh
          </button>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-[var(--off-white)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex gap-3">
          <svg
            className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-[var(--text-muted)]">
            <p className="font-medium text-[var(--text-heading)] mb-1">
              Why upload documents?
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Auto-fill your questionnaire with existing information</li>
              <li>Identify gaps in your current estate plan</li>
              <li>Get AI-powered analysis of your documents</li>
              <li>Compare your documents against best practices</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Back Link */}
      <div className="text-center">
        <Link
          href="/intake"
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text-heading)]"
        >
          Back to overview
        </Link>
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-purple)]"></div>
        </div>
      }
    >
      <UploadStepContent />
    </Suspense>
  );
}
