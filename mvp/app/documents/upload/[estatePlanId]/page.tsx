"use client";

import { useParams } from "next/navigation";
import { useEstatePlan, useUploadedDocuments } from "../../../hooks/usePrismaQueries";
import Link from "next/link";
import { useState, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";

// Helper to get sessionId from localStorage
function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("estatePlanSessionId");
}

// Helper to append sessionId to URL for auth
function appendSessionId(url: string): string {
  const sessionId = getSessionId();
  if (!sessionId) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}sessionId=${sessionId}`;
}

type DocumentType =
  | "will"
  | "trust"
  | "poa_financial"
  | "poa_healthcare"
  | "healthcare_directive"
  | "deed"
  | "insurance_policy"
  | "beneficiary_form"
  | "other";

const DOCUMENT_TYPE_OPTIONS: Array<{ value: DocumentType; label: string }> = [
  { value: "will", label: "Will" },
  { value: "trust", label: "Trust" },
  { value: "poa_financial", label: "Financial Power of Attorney" },
  { value: "poa_healthcare", label: "Healthcare Power of Attorney" },
  { value: "healthcare_directive", label: "Healthcare Directive / Living Will" },
  { value: "deed", label: "Deed / Property Document" },
  { value: "insurance_policy", label: "Insurance Policy" },
  { value: "beneficiary_form", label: "Beneficiary Designation Form" },
  { value: "other", label: "Other" },
];

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

interface AnalysisResult {
  summary: {
    documentType: string;
    documentDate: string | null;
    jurisdiction: string | null;
    overallPurpose: string;
  };
  keyParties: Array<{
    name: string;
    role: string;
    relationship?: string;
  }>;
  keyProvisions: Array<{
    section: string;
    title: string;
    summary: string;
    importance: "high" | "medium" | "low";
  }>;
  inconsistencies: Array<{
    issue: string;
    documentSays: string;
    intakeSays: string;
    severity: "critical" | "warning" | "info";
    recommendation: string;
  }>;
  potentialIssues: Array<{
    issue: string;
    details: string;
    severity: "critical" | "warning" | "info";
    recommendation: string;
  }>;
  hypotheticals: Array<{
    scenario: string;
    outcome: string;
    considerations: string[];
  }>;
  recommendations: Array<{
    action: string;
    priority: "high" | "medium" | "low";
    reason: string;
  }>;
  plainEnglishSummary: string;
}

export default function DocumentUploadPage() {
  const params = useParams();
  const estatePlanId = params.estatePlanId as string;

  // State
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });
  const [selectedType, setSelectedType] = useState<DocumentType>("will");
  const [description, setDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries - SWR hooks
  const { data: estatePlan, isLoading: estatePlanLoading } = useEstatePlan(estatePlanId);
  const { data: uploadedDocs, mutate: mutateUploadedDocs } = useUploadedDocuments(estatePlanId);

  // Compute analysis summary from uploadedDocs
  const analysisSummary = uploadedDocs ? {
    totalDocuments: uploadedDocs.length,
    completed: uploadedDocs.filter((d: { analysisStatus: string }) => d.analysisStatus === "completed").length,
    pendingAnalysis: uploadedDocs.filter((d: { analysisStatus: string }) => d.analysisStatus === "pending").length,
    inProgress: uploadedDocs.filter((d: { analysisStatus: string }) => ["extracting", "analyzing"].includes(d.analysisStatus)).length,
    failed: uploadedDocs.filter((d: { analysisStatus: string }) => d.analysisStatus === "failed").length,
  } : null;

  // Get selected document
  const selectedDoc = uploadedDocs?.find((d) => d.id === selectedDocId);
  const selectedAnalysis: AnalysisResult | null = selectedDoc?.analysisResult
    ? JSON.parse(selectedDoc.analysisResult)
    : null;

  // Handle file upload
  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file.type.includes("pdf")) {
        setUploadState((prev) => ({ ...prev, error: "Please upload a PDF file" }));
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        setUploadState((prev) => ({ ...prev, error: "File size must be less than 20MB" }));
        return;
      }

      setUploadState({ isUploading: true, progress: 10, error: null });

      try {
        // Upload file to /api/upload
        const formData = new FormData();
        formData.append("file", file);

        const uploadResult = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResult.ok) {
          const errorData = await uploadResult.json();
          throw new Error(errorData.error || "Upload failed");
        }

        const { storageId } = await uploadResult.json();
        setUploadState((prev) => ({ ...prev, progress: 50 }));

        // Save document metadata via API
        const saveResult = await fetch(appendSessionId(`/api/estate-plans/${estatePlanId}/uploaded-documents`), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storageId,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            documentType: selectedType,
            description: description || undefined,
          }),
        });

        if (!saveResult.ok) {
          const errorData = await saveResult.json();
          throw new Error(errorData.error || "Failed to save document");
        }

        const savedDoc = await saveResult.json();
        setUploadState((prev) => ({ ...prev, progress: 75 }));

        // Start analysis via API (fire and forget)
        fetch(appendSessionId(`/api/estate-plans/${estatePlanId}/uploaded-documents/analyze`), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentId: savedDoc.id }),
        }).then(() => {
          // Refresh the documents list after analysis starts
          mutateUploadedDocs();
        });

        setUploadState({ isUploading: false, progress: 100, error: null });

        // Refresh the documents list
        mutateUploadedDocs();

        // Reset form
        setDescription("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        setUploadState({
          isUploading: false,
          progress: 0,
          error: error instanceof Error ? error.message : "Upload failed",
        });
      }
    },
    [estatePlanId, selectedType, description, mutateUploadedDocs]
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

  // Handle delete
  const handleDelete = useCallback(
    async (docId: string) => {
      if (confirm("Are you sure you want to delete this document?")) {
        try {
          const result = await fetch(
            appendSessionId(`/api/estate-plans/${estatePlanId}/uploaded-documents?documentId=${docId}`),
            { method: "DELETE" }
          );
          if (!result.ok) {
            throw new Error("Failed to delete document");
          }
          if (selectedDocId === docId) {
            setSelectedDocId(null);
          }
          mutateUploadedDocs();
        } catch (error) {
          console.error("Delete error:", error);
        }
      }
    },
    [estatePlanId, selectedDocId, mutateUploadedDocs]
  );

  // Handle re-analyze
  const handleReanalyze = useCallback(
    async (docId: string) => {
      try {
        await fetch(appendSessionId(`/api/estate-plans/${estatePlanId}/uploaded-documents/analyze`), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentId: docId }),
        });
        mutateUploadedDocs();
      } catch (error) {
        console.error("Reanalyze error:", error);
      }
    },
    [estatePlanId, mutateUploadedDocs]
  );

  if (!estatePlan) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-[var(--text-heading)] hover:text-[var(--accent-purple)] transition-colors"
          >
            Estate Planning Assistant
          </Link>
          <Link
            href={`/analysis/${estatePlanId}`}
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-body)]"
          >
            Back to Analysis
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-heading)]">
            Upload & Analyze Documents
          </h1>
          <p className="text-[var(--text-body)] mt-2">
            Upload your existing legal documents for AI-powered analysis and insights.
          </p>
        </div>

        {/* Summary Cards */}
        {analysisSummary && analysisSummary.totalDocuments > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-[var(--text-heading)]">
                {analysisSummary.totalDocuments}
              </div>
              <div className="text-sm text-[var(--text-muted)]">Total Documents</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-green-600">{analysisSummary.completed}</div>
              <div className="text-sm text-[var(--text-muted)]">Analyzed</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {analysisSummary.pendingAnalysis + analysisSummary.inProgress}
              </div>
              <div className="text-sm text-[var(--text-muted)]">Pending</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-red-600">{analysisSummary.failed}</div>
              <div className="text-sm text-[var(--text-muted)]">Failed</div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-heading)] mb-4">
              Upload New Document
            </h2>

            {/* Document Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--text-body)] mb-2">
                Document Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as DocumentType)}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-white text-[var(--text-heading)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {DOCUMENT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--text-body)] mb-2">
                Description (optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Mom's 2019 will"
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-white text-[var(--text-heading)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
                ${uploadState.isUploading ? "pointer-events-none opacity-50" : ""}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
              />

              {uploadState.isUploading ? (
                <div>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-[var(--text-body)]">
                    Uploading... {uploadState.progress}%
                  </p>
                </div>
              ) : (
                <>
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-gray-400"
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
                  <p className="text-[var(--text-body)] mb-2">
                    <span className="font-medium text-[var(--accent-purple)]">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-sm text-[var(--text-caption)]">PDF files up to 20MB</p>
                </>
              )}
            </div>

            {/* Error Display */}
            {uploadState.error && (
              <div className="mt-4 p-3 bg-[var(--error-muted)] border border-[var(--error)] rounded-lg">
                <p className="text-sm text-[var(--error)]">{uploadState.error}</p>
              </div>
            )}

            {/* Uploaded Documents List */}
            {uploadedDocs && uploadedDocs.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-[var(--text-heading)] mb-4">
                  Uploaded Documents
                </h3>
                <div className="space-y-3">
                  {uploadedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDocId(doc.id)}
                      className={`
                        p-4 rounded-lg border cursor-pointer transition-colors
                        ${selectedDocId === doc.id
                          ? "border-[var(--accent-purple)] bg-[var(--accent-muted)]"
                          : "border-[var(--border)] bg-white hover:border-blue-300"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg
                            className="w-8 h-8 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                            <path d="M14 2v6h6" fill="none" stroke="currentColor" strokeWidth="2" />
                          </svg>
                          <div>
                            <p className="font-medium text-[var(--text-heading)] text-sm">
                              {doc.fileName}
                            </p>
                            <p className="text-xs text-[var(--text-muted)]">
                              {DOCUMENT_TYPE_OPTIONS.find((o) => o.value === doc.documentType)?.label}
                              {doc.description && ` - ${doc.description}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Status Badge */}
                          <span
                            className={`
                              text-xs px-2 py-1 rounded-full
                              ${doc.analysisStatus === "completed"
                                ? "bg-[var(--success-muted)] text-[var(--success)]"
                                : doc.analysisStatus === "failed"
                                  ? "bg-[var(--error-muted)] text-[var(--error)]"
                                  : doc.analysisStatus === "pending"
                                    ? "bg-[var(--off-white)] text-[var(--text-body)]"
                                    : "bg-[var(--warning-muted)] text-[var(--warning)]"
                              }
                            `}
                          >
                            {doc.analysisStatus === "completed"
                              ? "Analyzed"
                              : doc.analysisStatus === "failed"
                                ? "Failed"
                                : doc.analysisStatus === "pending"
                                  ? "Pending"
                                  : "Analyzing..."}
                          </span>
                          {/* Delete Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(doc.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Analysis Results Section */}
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-heading)] mb-4">
              Analysis Results
            </h2>

            {!selectedDoc ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-[var(--text-caption)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-[var(--text-muted)]">
                  Select a document to view its analysis
                </p>
              </div>
            ) : selectedDoc.analysisStatus === "pending" || selectedDoc.analysisStatus === "extracting" || selectedDoc.analysisStatus === "analyzing" ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-[var(--text-body)]">
                  {selectedDoc.analysisStatus === "pending"
                    ? "Waiting to start analysis..."
                    : selectedDoc.analysisStatus === "extracting"
                      ? "Extracting text from PDF..."
                      : "Analyzing document with AI..."}
                </p>
                <p className="text-sm text-[var(--text-caption)] mt-2">
                  This may take a minute or two
                </p>
              </div>
            ) : selectedDoc.analysisStatus === "failed" ? (
              <div className="bg-white rounded-lg shadow p-8">
                <div className="text-center mb-4">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[var(--error)] font-medium">Analysis Failed</p>
                  <p className="text-sm text-[var(--text-muted)] mt-2">
                    {selectedDoc.analysisError || "Unknown error occurred"}
                  </p>
                </div>
                <button
                  onClick={() => handleReanalyze(selectedDoc.id)}
                  className="w-full px-4 py-2 bg-[var(--accent-purple)] hover:opacity-90 text-white rounded-lg font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : selectedAnalysis ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Document Summary */}
                <div className="p-6 border-b border-[var(--border)]">
                  <h3 className="font-semibold text-[var(--text-heading)] mb-3">Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[var(--text-muted)]">Type:</span>
                      <span className="ml-2 text-[var(--text-heading)]">
                        {selectedAnalysis.summary.documentType}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)]">Date:</span>
                      <span className="ml-2 text-[var(--text-heading)]">
                        {selectedAnalysis.summary.documentDate || "Not found"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)]">Jurisdiction:</span>
                      <span className="ml-2 text-[var(--text-heading)]">
                        {selectedAnalysis.summary.jurisdiction || "Not specified"}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-[var(--text-body)] text-sm">
                    {selectedAnalysis.summary.overallPurpose}
                  </p>
                </div>

                {/* Plain English Summary */}
                <div className="p-6 border-b border-[var(--border)] bg-[var(--accent-muted)]">
                  <h3 className="font-semibold text-[var(--text-heading)] mb-3">
                    What This Document Does (Plain English)
                  </h3>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{selectedAnalysis.plainEnglishSummary}</ReactMarkdown>
                  </div>
                </div>

                {/* Inconsistencies */}
                {selectedAnalysis.inconsistencies.length > 0 && (
                  <div className="p-6 border-b border-[var(--border)]">
                    <h3 className="font-semibold text-[var(--text-heading)] mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Inconsistencies Found
                    </h3>
                    <div className="space-y-3">
                      {selectedAnalysis.inconsistencies.map((item, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg border ${
                            item.severity === "critical"
                              ? "border-[var(--error)] bg-[var(--error-muted)]"
                              : item.severity === "warning"
                                ? "border-[var(--warning)] bg-[var(--warning-muted)]"
                                : "border-[var(--info)] bg-[var(--info-muted)]"
                          }`}
                        >
                          <p className="font-medium text-[var(--text-heading)] text-sm">
                            {item.issue}
                          </p>
                          <div className="mt-2 text-xs space-y-1">
                            <p className="text-[var(--text-body)]">
                              <strong>Document says:</strong> {item.documentSays}
                            </p>
                            <p className="text-[var(--text-body)]">
                              <strong>Your situation:</strong> {item.intakeSays}
                            </p>
                            <p className="text-[var(--accent-purple)]">
                              <strong>Recommendation:</strong> {item.recommendation}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Potential Issues */}
                {selectedAnalysis.potentialIssues.length > 0 && (
                  <div className="p-6 border-b border-[var(--border)]">
                    <h3 className="font-semibold text-[var(--text-heading)] mb-3">
                      Potential Issues
                    </h3>
                    <div className="space-y-3">
                      {selectedAnalysis.potentialIssues.map((item, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg border ${
                            item.severity === "critical"
                              ? "border-[var(--error)] bg-[var(--error-muted)]"
                              : item.severity === "warning"
                                ? "border-[var(--warning)] bg-[var(--warning-muted)]"
                                : "border-[var(--border)] bg-[var(--off-white)]"
                          }`}
                        >
                          <p className="font-medium text-[var(--text-heading)] text-sm">
                            {item.issue}
                          </p>
                          <p className="text-xs text-[var(--text-body)] mt-1">
                            {item.details}
                          </p>
                          <p className="text-xs text-[var(--accent-purple)] mt-1">
                            {item.recommendation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hypothetical Scenarios */}
                {selectedAnalysis.hypotheticals.length > 0 && (
                  <div className="p-6 border-b border-[var(--border)]">
                    <h3 className="font-semibold text-[var(--text-heading)] mb-3">
                      What If Scenarios
                    </h3>
                    <div className="space-y-4">
                      {selectedAnalysis.hypotheticals.map((item, i) => (
                        <div key={i} className="p-3 bg-white/30 rounded-lg">
                          <p className="font-medium text-[var(--text-heading)] text-sm">
                            {item.scenario}
                          </p>
                          <p className="text-sm text-[var(--text-body)] mt-2">
                            {item.outcome}
                          </p>
                          {item.considerations.length > 0 && (
                            <ul className="mt-2 text-xs text-[var(--text-caption)] list-disc list-inside">
                              {item.considerations.map((c, j) => (
                                <li key={j}>{c}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Parties */}
                {selectedAnalysis.keyParties.length > 0 && (
                  <div className="p-6 border-b border-[var(--border)]">
                    <h3 className="font-semibold text-[var(--text-heading)] mb-3">
                      Key Parties
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedAnalysis.keyParties.map((party, i) => (
                        <div key={i} className="text-sm">
                          <span className="font-medium text-[var(--text-heading)]">
                            {party.name}
                          </span>
                          <span className="text-[var(--text-muted)] ml-1">
                            ({party.role})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {selectedAnalysis.recommendations.length > 0 && (
                  <div className="p-6">
                    <h3 className="font-semibold text-[var(--text-heading)] mb-3">
                      Recommendations
                    </h3>
                    <div className="space-y-2">
                      {selectedAnalysis.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${
                              rec.priority === "high"
                                ? "bg-[var(--error-muted)] text-[var(--error)]"
                                : rec.priority === "medium"
                                  ? "bg-[var(--warning-muted)] text-[var(--warning)]"
                                  : "bg-[var(--off-white)] text-[var(--text-body)]"
                            }`}
                          >
                            {rec.priority}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-[var(--text-heading)]">
                              {rec.action}
                            </p>
                            <p className="text-xs text-[var(--text-muted)]">{rec.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-[var(--text-muted)]">No analysis available</p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-[var(--warning-muted)] border border-[var(--warning)] rounded-lg p-4">
          <p className="text-sm text-[var(--warning)]">
            <strong>Disclaimer:</strong> This AI analysis is for informational purposes only and does
            not constitute legal advice. Always consult with a licensed attorney for legal matters.
            Uploaded documents are stored securely and used only for analysis purposes.
          </p>
        </div>
      </main>
    </div>
  );
}
