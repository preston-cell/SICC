"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Link from "next/link";
import { useState, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";

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
  const estatePlanId = params.estatePlanId as Id<"estatePlans">;

  // State
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });
  const [selectedType, setSelectedType] = useState<DocumentType>("will");
  const [description, setDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<Id<"uploadedDocuments"> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries
  const estatePlan = useQuery(api.queries.getEstatePlan, { estatePlanId });
  const uploadedDocs = useQuery(api.uploadedDocuments.getUploadedDocuments, { estatePlanId });
  const analysisSummary = useQuery(api.uploadedDocuments.getDocumentAnalysisSummary, { estatePlanId });

  // Mutations & Actions
  const generateUploadUrl = useMutation(api.uploadedDocuments.generateUploadUrl);
  const saveUploadedDocument = useMutation(api.uploadedDocuments.saveUploadedDocument);
  const deleteDocument = useMutation(api.uploadedDocuments.deleteUploadedDocument);
  const analyzeDocument = useAction(api.documentAnalysis.analyzeDocument);

  // Get selected document
  const selectedDoc = uploadedDocs?.find((d) => d._id === selectedDocId);
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
        // Get upload URL
        const uploadUrl = await generateUploadUrl();
        setUploadState((prev) => ({ ...prev, progress: 30 }));

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
        setUploadState((prev) => ({ ...prev, progress: 60 }));

        // Save document metadata
        const docId = await saveUploadedDocument({
          estatePlanId,
          storageId,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          documentType: selectedType,
          description: description || undefined,
        });
        setUploadState((prev) => ({ ...prev, progress: 80 }));

        // Start analysis
        analyzeDocument({ documentId: docId });
        setUploadState({ isUploading: false, progress: 100, error: null });

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
    [estatePlanId, selectedType, description, generateUploadUrl, saveUploadedDocument, analyzeDocument]
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
    async (docId: Id<"uploadedDocuments">) => {
      if (confirm("Are you sure you want to delete this document?")) {
        await deleteDocument({ documentId: docId });
        if (selectedDocId === docId) {
          setSelectedDocId(null);
        }
      }
    },
    [deleteDocument, selectedDocId]
  );

  // Handle re-analyze
  const handleReanalyze = useCallback(
    async (docId: Id<"uploadedDocuments">) => {
      await analyzeDocument({ documentId: docId });
    },
    [analyzeDocument]
  );

  if (!estatePlan) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Estate Planning Assistant
          </Link>
          <Link
            href={`/analysis/${estatePlanId}`}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Back to Analysis
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Upload & Analyze Documents
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Upload your existing legal documents for AI-powered analysis and insights.
          </p>
        </div>

        {/* Summary Cards */}
        {analysisSummary && analysisSummary.totalDocuments > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {analysisSummary.totalDocuments}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Documents</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-green-600">{analysisSummary.completed}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Analyzed</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {analysisSummary.pendingAnalysis + analysisSummary.inProgress}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Pending</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-red-600">{analysisSummary.failed}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Failed</div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Upload New Document
            </h2>

            {/* Document Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Document Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as DocumentType)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Mom's 2019 will"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
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
                  <p className="text-gray-600 dark:text-gray-400">
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
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">PDF files up to 20MB</p>
                </>
              )}
            </div>

            {/* Error Display */}
            {uploadState.error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">{uploadState.error}</p>
              </div>
            )}

            {/* Uploaded Documents List */}
            {uploadedDocs && uploadedDocs.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Uploaded Documents
                </h3>
                <div className="space-y-3">
                  {uploadedDocs.map((doc) => (
                    <div
                      key={doc._id}
                      onClick={() => setSelectedDocId(doc._id)}
                      className={`
                        p-4 rounded-lg border cursor-pointer transition-colors
                        ${selectedDocId === doc._id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300"
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
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {doc.fileName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
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
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : doc.analysisStatus === "failed"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                  : doc.analysisStatus === "pending"
                                    ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
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
                              handleDelete(doc._id);
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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Analysis Results
            </h2>

            {!selectedDoc ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">
                  Select a document to view its analysis
                </p>
              </div>
            ) : selectedDoc.analysisStatus === "pending" || selectedDoc.analysisStatus === "extracting" || selectedDoc.analysisStatus === "analyzing" ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedDoc.analysisStatus === "pending"
                    ? "Waiting to start analysis..."
                    : selectedDoc.analysisStatus === "extracting"
                      ? "Extracting text from PDF..."
                      : "Analyzing document with AI..."}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  This may take a minute or two
                </p>
              </div>
            ) : selectedDoc.analysisStatus === "failed" ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
                <div className="text-center mb-4">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-600 dark:text-red-400 font-medium">Analysis Failed</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {selectedDoc.analysisError || "Unknown error occurred"}
                  </p>
                </div>
                <button
                  onClick={() => handleReanalyze(selectedDoc._id)}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : selectedAnalysis ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                {/* Document Summary */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Type:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        {selectedAnalysis.summary.documentType}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Date:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        {selectedAnalysis.summary.documentDate || "Not found"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Jurisdiction:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        {selectedAnalysis.summary.jurisdiction || "Not specified"}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
                    {selectedAnalysis.summary.overallPurpose}
                  </p>
                </div>

                {/* Plain English Summary */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    What This Document Does (Plain English)
                  </h3>
                  <div className="prose dark:prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{selectedAnalysis.plainEnglishSummary}</ReactMarkdown>
                  </div>
                </div>

                {/* Inconsistencies */}
                {selectedAnalysis.inconsistencies.length > 0 && (
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
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
                              ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                              : item.severity === "warning"
                                ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20"
                                : "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                          }`}
                        >
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {item.issue}
                          </p>
                          <div className="mt-2 text-xs space-y-1">
                            <p className="text-gray-600 dark:text-gray-400">
                              <strong>Document says:</strong> {item.documentSays}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              <strong>Your situation:</strong> {item.intakeSays}
                            </p>
                            <p className="text-blue-600 dark:text-blue-400">
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
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Potential Issues
                    </h3>
                    <div className="space-y-3">
                      {selectedAnalysis.potentialIssues.map((item, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg border ${
                            item.severity === "critical"
                              ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                              : item.severity === "warning"
                                ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20"
                                : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/20"
                          }`}
                        >
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {item.issue}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {item.details}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            {item.recommendation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hypothetical Scenarios */}
                {selectedAnalysis.hypotheticals.length > 0 && (
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      What If Scenarios
                    </h3>
                    <div className="space-y-4">
                      {selectedAnalysis.hypotheticals.map((item, i) => (
                        <div key={i} className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {item.scenario}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {item.outcome}
                          </p>
                          {item.considerations.length > 0 && (
                            <ul className="mt-2 text-xs text-gray-500 dark:text-gray-500 list-disc list-inside">
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
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Key Parties
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedAnalysis.keyParties.map((party, i) => (
                        <div key={i} className="text-sm">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {party.name}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 ml-1">
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
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Recommendations
                    </h3>
                    <div className="space-y-2">
                      {selectedAnalysis.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${
                              rec.priority === "high"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                : rec.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {rec.priority}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {rec.action}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{rec.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No analysis available</p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            <strong>Disclaimer:</strong> This AI analysis is for informational purposes only and does
            not constitute legal advice. Always consult with a licensed attorney for legal matters.
            Uploaded documents are stored securely and used only for analysis purposes.
          </p>
        </div>
      </main>
    </div>
  );
}
