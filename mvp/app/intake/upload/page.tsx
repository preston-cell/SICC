"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import Link from "next/link";
import { useUser } from "@/app/components/ClerkComponents";
import { useAuthSync } from "@/app/hooks/useAuthSync";

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
  _id: Id<"uploadedDocuments">;
  fileName: string;
  documentType: DocumentType;
  analysisStatus: string;
}

function UploadStepContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");

  // Auth state (only relevant when Clerk is configured)
  const { isSignedIn, isLoaded } = useUser();
  useAuthSync();

  // Get user ID from localStorage (set by useAuthSync) - only used when auth is enabled
  const storedUserId = typeof window !== "undefined" ? localStorage.getItem("estatePlanUserId") : null;
  const userId = isAuthEnabled && isSignedIn && storedUserId ? storedUserId : null;

  // State
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState<Id<"estatePlans"> | null>(
    planId ? (planId as Id<"estatePlans">) : null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<DocumentType>("will");
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionComplete, setExtractionComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mutations & Actions
  const createEstatePlan = useMutation(api.estatePlanning.createEstatePlan);
  const generateUploadUrl = useMutation(api.uploadedDocuments.generateUploadUrl);
  const saveUploadedDocument = useMutation(api.uploadedDocuments.saveUploadedDocument);
  const deleteDocument = useMutation(api.uploadedDocuments.deleteUploadedDocument);
  const analyzeDocument = useAction(api.documentAnalysis.analyzeDocument);
  const extractIntakeData = useAction(api.documentExtraction.extractIntakeData);

  // Queries
  const uploadedDocs = useQuery(
    api.uploadedDocuments.getUploadedDocuments,
    currentPlanId ? { estatePlanId: currentPlanId } : "skip"
  ) as UploadedDoc[] | undefined;

  const extractedData = useQuery(
    api.extractedData.getExtractedData,
    currentPlanId ? { estatePlanId: currentPlanId } : "skip"
  );

  // Redirect to intake if auth is enabled but not authenticated
  useEffect(() => {
    if (isAuthEnabled && isLoaded && !isSignedIn) {
      router.push("/intake");
    }
  }, [isLoaded, isSignedIn, router]);

  // Create a new estate plan if needed
  useEffect(() => {
    const initializePlan = async () => {
      // Wait for auth check if auth is enabled
      if (isAuthEnabled && !isLoaded) {
        return;
      }

      if (!planId && !currentPlanId && !isCreatingPlan) {
        // Check localStorage for existing plan
        const savedPlanId = localStorage.getItem("estatePlanId");
        if (savedPlanId) {
          setCurrentPlanId(savedPlanId as Id<"estatePlans">);
          router.replace(`/intake/upload?planId=${savedPlanId}`);
          return;
        }

        // Create new plan
        setIsCreatingPlan(true);
        try {
          let newPlanId: string;

          if (isAuthEnabled && userId) {
            // Authenticated flow
            newPlanId = await createEstatePlan({
              userId: userId as Id<"users">,
              name: "My Estate Plan",
            });
          } else {
            // Anonymous flow
            const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            newPlanId = await createEstatePlan({
              sessionId,
              name: "My Estate Plan",
            });
            localStorage.setItem("estatePlanSessionId", sessionId);
          }

          localStorage.setItem("estatePlanId", newPlanId);
          setCurrentPlanId(newPlanId as Id<"estatePlans">);
          router.replace(`/intake/upload?planId=${newPlanId}`);
        } catch (error) {
          console.error("Failed to create estate plan:", error);
        } finally {
          setIsCreatingPlan(false);
        }
      }
    };

    initializePlan();
  }, [planId, currentPlanId, isCreatingPlan, createEstatePlan, router, isLoaded, userId]);

  // Handle file upload
  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!currentPlanId) return;

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
        // Get upload URL
        const uploadUrl = await generateUploadUrl();
        setUploadProgress(30);

        // Upload file
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error("Upload failed");
        }

        const { storageId } = await result.json();
        setUploadProgress(60);

        // Save document metadata
        const docId = await saveUploadedDocument({
          estatePlanId: currentPlanId,
          storageId,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          documentType: selectedType as any,
        });
        setUploadProgress(80);

        // Start analysis (for document insights)
        analyzeDocument({ documentId: docId });
        setUploadProgress(100);

        // Reset
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : "Upload failed");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [currentPlanId, selectedType, generateUploadUrl, saveUploadedDocument, analyzeDocument]
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
    async (docId: Id<"uploadedDocuments">) => {
      if (confirm("Delete this document?")) {
        await deleteDocument({ documentId: docId });
      }
    },
    [deleteDocument]
  );

  // Handle extraction
  const handleExtractData = useCallback(async () => {
    if (!currentPlanId) return;

    setIsExtracting(true);
    try {
      const result = await extractIntakeData({ estatePlanId: currentPlanId });
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
  }, [currentPlanId, extractIntakeData]);

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

  // Loading state
  if (isCreatingPlan) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const hasDocuments = uploadedDocs && uploadedDocs.length > 0;
  const hasExtractedData = extractedData && extractedData.length > 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-blue-600"
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Do you have existing estate documents?
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-xl mx-auto">
          Upload your existing wills, trusts, or powers of attorney. We&apos;ll extract information
          to pre-fill your questionnaire and save you time.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Upload Documents
        </h2>

        {/* Document Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                  }
                `}
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {opt.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
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
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300"
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
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
            }
            ${isUploading ? "pointer-events-none opacity-50" : ""}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
          />

          {isUploading ? (
            <div>
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Uploading... {uploadProgress}%
              </p>
            </div>
          ) : (
            <>
              <svg
                className="w-10 h-10 mx-auto mb-3 text-gray-400"
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
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                PDF files up to 20MB
              </p>
            </>
          )}
        </div>

        {/* Error Display */}
        {uploadError && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300">{uploadError}</p>
          </div>
        )}

        {/* Uploaded Documents List */}
        {hasDocuments && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Uploaded ({uploadedDocs.length})
            </h3>
            <div className="space-y-2">
              {uploadedDocs.map((doc) => (
                <div
                  key={doc._id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-red-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                        {doc.fileName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {DOCUMENT_TYPE_OPTIONS.find((o) => o.value === doc.documentType)?.label}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`
                        text-xs px-2 py-0.5 rounded-full
                        ${doc.analysisStatus === "completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          : doc.analysisStatus === "failed"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
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
                      onClick={() => handleDelete(doc._id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Extract Information
          </h2>

          {isExtracting ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="text-gray-600 dark:text-gray-400">
                AI is reading your documents...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Extracting names, dates, beneficiaries, and more
              </p>
            </div>
          ) : extractionComplete || hasExtractedData ? (
            <div className="space-y-4">
              {/* Success Header */}
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">
                    Extraction Complete
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    We found information to pre-fill your questionnaire
                  </p>
                </div>
              </div>

              {/* Extraction Summary */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                        className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                      >
                        <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sectionInfo.icon} />
                        </svg>
                        <span className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                          {sectionInfo.label}
                        </span>
                        <svg className="w-4 h-4 text-green-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* What happens next */}
              <div className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Next:</span>{" "}
                  Review the pre-filled forms and make any corrections. Fields from your documents will be marked with a blue badge.
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Our AI will read your documents and extract names, addresses, beneficiaries, asset information, and more to pre-fill your questionnaire.
              </p>
              <button
                onClick={handleExtractData}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
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
            className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            Continue to Questionnaire
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : hasDocuments ? (
          <button
            onClick={handleContinue}
            className="flex-1 px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Continue Without Extraction
          </button>
        ) : (
          <button
            onClick={handleSkip}
            className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors"
          >
            I Don&apos;t Have Documents - Start Fresh
          </button>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4">
        <div className="flex gap-3">
          <svg
            className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5"
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
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
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
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <UploadStepContent />
    </Suspense>
  );
}
