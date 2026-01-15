"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Link from "next/link";
import { useState, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";

type DocumentType = "will" | "trust" | "poa_financial" | "poa_healthcare" | "healthcare_directive" | "hipaa";

const DOCUMENT_TYPES: Array<{
  type: DocumentType;
  name: string;
  description: string;
  estimatedTime: string;
  icon: React.ReactNode;
}> = [
  {
    type: "will",
    name: "Last Will & Testament",
    description: "Specify how your assets should be distributed after death and name guardians for minor children",
    estimatedTime: "2-3 minutes",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    type: "trust",
    name: "Revocable Living Trust",
    description: "Avoid probate and maintain privacy for your estate with a flexible trust",
    estimatedTime: "3-4 minutes",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    type: "poa_financial",
    name: "Financial Power of Attorney",
    description: "Authorize someone to manage your finances if you become incapacitated",
    estimatedTime: "1-2 minutes",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    type: "poa_healthcare",
    name: "Healthcare Power of Attorney",
    description: "Designate someone to make medical decisions on your behalf",
    estimatedTime: "1-2 minutes",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    type: "healthcare_directive",
    name: "Healthcare Directive / Living Will",
    description: "Document your wishes for end-of-life medical treatment",
    estimatedTime: "2-3 minutes",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    type: "hipaa",
    name: "HIPAA Authorization",
    description: "Allow designated individuals to access your medical information",
    estimatedTime: "1 minute",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

interface GenerationState {
  isGenerating: boolean;
  generatingType: DocumentType | null;
  error: string | null;
}

interface PreviewState {
  isOpen: boolean;
  title: string;
  content: string;
  documentId: string | null;
}

export default function DocumentGeneratePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const estatePlanId = params.estatePlanId as Id<"estatePlans">;
  const highlightType = searchParams.get("type");

  // State
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    generatingType: null,
    error: null,
  });
  const [previewState, setPreviewState] = useState<PreviewState>({
    isOpen: false,
    title: "",
    content: "",
    documentId: null,
  });
  const [useAI, setUseAI] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  // Fetch estate plan
  const estatePlan = useQuery(api.queries.getEstatePlan, { estatePlanId });

  // Fetch existing documents
  const existingDocs = useQuery(api.queries.getDocuments, { estatePlanId });

  // Fetch gap analysis for recommendations
  const gapAnalysis = useQuery(api.queries.getLatestGapAnalysis, { estatePlanId });

  // Fetch intake progress
  const intakeProgress = useQuery(api.queries.getIntakeProgress, { estatePlanId });

  // Fetch full intake data for API call
  const intakeData = useQuery(api.queries.getEstatePlanFull, { estatePlanId });

  // Mutation to save generated document
  const createDocument = useMutation(api.estatePlanning.createDocument);

  // Parse missing documents from gap analysis
  const missingDocTypes = new Set<string>();
  if (gapAnalysis?.missingDocuments) {
    try {
      const missing = JSON.parse(gapAnalysis.missingDocuments);
      missing.forEach((doc: { type: string }) => missingDocTypes.add(doc.type));
    } catch {
      // Ignore parse errors
    }
  }

  // Handle document generation - calls API directly (bypasses Convex timeout)
  const handleGenerate = useCallback(async (docType: DocumentType) => {
    setGenerationState({
      isGenerating: true,
      generatingType: docType,
      error: null,
    });

    try {
      // Build intake data object for the API
      // Note: intakeData from getEstatePlanFull has the intake array at .intakeData
      const intake = intakeData?.intakeData || [];
      const apiIntakeData = {
        personal: intake.find((i: { section: string; data: string }) => i.section === "personal")?.data
          ? JSON.parse(intake.find((i: { section: string }) => i.section === "personal")?.data || "{}")
          : {},
        family: intake.find((i: { section: string; data: string }) => i.section === "family")?.data
          ? JSON.parse(intake.find((i: { section: string }) => i.section === "family")?.data || "{}")
          : {},
        assets: intake.find((i: { section: string; data: string }) => i.section === "assets")?.data
          ? JSON.parse(intake.find((i: { section: string }) => i.section === "assets")?.data || "{}")
          : {},
        goals: intake.find((i: { section: string; data: string }) => i.section === "goals")?.data
          ? JSON.parse(intake.find((i: { section: string }) => i.section === "goals")?.data || "{}")
          : {},
      };

      // Call the API route directly (bypasses Convex timeout issues)
      const response = await fetch("/api/document-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentType: docType, intakeData: apiIntakeData }),
      });

      const result = await response.json();

      if (!result.success) {
        setGenerationState(prev => ({
          ...prev,
          error: result.error || "Failed to generate document",
        }));
        return;
      }

      // Save the document to Convex
      const docInfo = DOCUMENT_TYPES.find(d => d.type === docType);
      const documentId = await createDocument({
        estatePlanId,
        type: docType,
        title: docInfo?.name || "Generated Document",
        content: result.content,
        format: "markdown",
      });

      setPreviewState({
        isOpen: true,
        title: docInfo?.name || "Generated Document",
        content: result.content,
        documentId: documentId || null,
      });
    } catch (error) {
      setGenerationState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "An error occurred",
      }));
    } finally {
      setGenerationState(prev => ({
        ...prev,
        isGenerating: false,
        generatingType: null,
      }));
    }
  }, [estatePlanId, intakeData, createDocument]);

  // Handle download
  const handleDownload = useCallback(() => {
    const blob = new Blob([previewState.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${previewState.title.replace(/\s+/g, "_")}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [previewState.content, previewState.title]);

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(previewState.content);
      // Could add a toast notification here
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }, [previewState.content]);

  // Download as PDF
  const handleDownloadPDF = useCallback(async () => {
    if (!pdfContentRef.current) return;

    setIsGeneratingPDF(true);
    try {
      // Dynamically import html2pdf to avoid SSR issues
      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = html2pdfModule.default;

      const element = pdfContentRef.current;
      const filename = `${previewState.title.replace(/\s+/g, "_")}.pdf`;

      // Temporarily apply print-friendly styles for PDF generation
      const originalStyle = element.getAttribute("style") || "";
      element.style.cssText = `
        background-color: white !important;
        color: black !important;
        font-family: 'Times New Roman', Times, serif !important;
        font-size: 12pt !important;
        line-height: 1.6 !important;
        padding: 0 !important;
      `;

      // Apply styles to all child elements
      const allElements = element.querySelectorAll("*");
      const originalStyles: string[] = [];
      allElements.forEach((el, index) => {
        const htmlEl = el as HTMLElement;
        originalStyles[index] = htmlEl.getAttribute("style") || "";
        htmlEl.style.color = "black";
        htmlEl.style.backgroundColor = "transparent";
      });

      // Style headings specifically
      element.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((heading) => {
        const h = heading as HTMLElement;
        h.style.fontWeight = "bold";
        h.style.marginTop = "1em";
        h.style.marginBottom = "0.5em";
      });

      element.querySelectorAll("h1").forEach((h) => {
        (h as HTMLElement).style.fontSize = "18pt";
      });
      element.querySelectorAll("h2").forEach((h) => {
        (h as HTMLElement).style.fontSize = "16pt";
      });
      element.querySelectorAll("h3").forEach((h) => {
        (h as HTMLElement).style.fontSize = "14pt";
      });

      const opt = {
        margin: [0.75, 0.75, 0.75, 0.75] as [number, number, number, number],
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: "#ffffff" },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" as const },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      await html2pdf().set(opt).from(element).save();

      // Restore original styles
      element.setAttribute("style", originalStyle);
      allElements.forEach((el, index) => {
        const htmlEl = el as HTMLElement;
        if (originalStyles[index]) {
          htmlEl.setAttribute("style", originalStyles[index]);
        } else {
          htmlEl.removeAttribute("style");
        }
      });
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [previewState.title]);

  if (!estatePlan) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const hasEnoughData = intakeProgress && intakeProgress.percentComplete >= 40;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Generate Documents
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Select a document type to generate a customized draft based on your information.
          </p>
        </div>

        {/* Progress Warning */}
        {!hasEnoughData && (
          <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-medium text-amber-800 dark:text-amber-200">More Information Needed</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Your intake questionnaire is only {intakeProgress?.percentComplete || 0}% complete.
                  Documents generated with incomplete information will have placeholder values.{" "}
                  <Link href={`/intake/${estatePlanId}`} className="underline hover:no-underline">
                    Complete the questionnaire
                  </Link>{" "}
                  for better results.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Enhancement Toggle */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">AI-Enhanced Generation</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Use Claude AI to generate more detailed and customized documents
              </p>
            </div>
            <button
              onClick={() => setUseAI(!useAI)}
              className={`
                relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
                transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
                ${useAI ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"}
              `}
            >
              <span
                className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
                  transition duration-200 ease-in-out
                  ${useAI ? "translate-x-5" : "translate-x-0"}
                `}
              />
            </button>
          </div>
        </div>

        {/* Error Display */}
        {generationState.error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-200">Generation Error</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{generationState.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Document Types Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {DOCUMENT_TYPES.map((doc) => {
            const isRecommended = missingDocTypes.has(doc.type);
            const isHighlighted = highlightType === doc.type;
            const existingDoc = existingDocs?.find((d) => d.type === doc.type);
            const isGenerating = generationState.isGenerating && generationState.generatingType === doc.type;

            return (
              <div
                key={doc.type}
                className={`
                  bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-2 transition-colors
                  ${isHighlighted
                    ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
                    : isRecommended
                      ? "border-red-200 dark:border-red-800"
                      : "border-transparent"
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 ${isRecommended ? "text-red-500" : "text-blue-500"}`}>
                    {doc.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {doc.name}
                      </h3>
                      {isRecommended && (
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full">
                          Recommended
                        </span>
                      )}
                      {existingDoc && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                          Draft v{existingDoc.version}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {doc.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Est. time: {doc.estimatedTime}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleGenerate(doc.type)}
                        disabled={generationState.isGenerating}
                        className={`
                          px-4 py-2 rounded-lg text-sm font-medium transition-colors
                          ${isGenerating
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 cursor-wait"
                            : generationState.isGenerating
                              ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }
                        `}
                      >
                        {isGenerating ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Generating...
                          </span>
                        ) : existingDoc ? (
                          "Regenerate"
                        ) : (
                          "Generate"
                        )}
                      </button>
                      {existingDoc && (
                        <button
                          onClick={() => {
                            setPreviewState({
                              isOpen: true,
                              title: existingDoc.title,
                              content: existingDoc.content,
                              documentId: existingDoc._id,
                            });
                          }}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                        >
                          View Draft
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            <strong>Disclaimer:</strong> Generated documents are drafts for informational purposes only and do not constitute legal advice.
            All documents should be reviewed by a licensed attorney in your state before signing or relying upon them.
          </p>
        </div>
      </main>

      {/* Document Preview Modal */}
      {previewState.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setPreviewState(prev => ({ ...prev, isOpen: false }))} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {previewState.title}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Download as Markdown"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    title="Download as PDF"
                  >
                    {isGeneratingPDF ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v6m-3-3h6" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => setPreviewState(prev => ({ ...prev, isOpen: false }))}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body - Document Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div ref={pdfContentRef} className="prose dark:prose-invert prose-sm max-w-none bg-white dark:bg-gray-800 pdf-content [&>hr]:hidden [&_hr]:hidden">
                  <ReactMarkdown>{
                    previewState.content
                      .replace(/<br\s*\/?>/gi, "\n\n")
                      .replace(/<hr\s*\/?>/gi, "\n\n")
                      .replace(/^---+$/gm, "")
                      .replace(/^\*\*\*+$/gm, "")
                      .replace(/^___+$/gm, "")
                  }</ReactMarkdown>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This is a draft document. Please review with an attorney before signing.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setPreviewState(prev => ({ ...prev, isOpen: false }))}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    Download MD
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generating...
                      </>
                    ) : (
                      "Download PDF"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
