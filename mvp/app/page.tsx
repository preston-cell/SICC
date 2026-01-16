"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import FilePreviewModal from "./components/FilePreviewModal";

type RunStatus = "pending" | "running" | "completed" | "failed";

// Helper to check if run is still active (needs polling)
const isRunActive = (status: RunStatus | undefined) =>
  status === "pending" || status === "running";

interface PreviewFile {
  path: string;
  content: string;
  isBinary: boolean;
}

interface GeneratedFile {
  id: string;
  runId: string;
  path: string;
  content: string;
  isBinary: boolean;
  size: number;
}

interface AgentRun {
  id: string;
  prompt: string;
  status: RunStatus;
  output?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [input, setInput] = useState("");
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null);

  // SWR replaces Convex useQuery - polls for recent runs every 5s
  const { data: recentRuns } = useSWR<AgentRun[]>("/api/runs", fetcher, {
    refreshInterval: 5000,
  });

  // Polls every 1s for active run status updates, stops when complete
  const { data: currentRun } = useSWR<AgentRun>(
    currentRunId ? `/api/runs/${currentRunId}` : null,
    fetcher,
    {
      refreshInterval: (latestData) =>
        isRunActive(latestData?.status as RunStatus) ? 1000 : 0,
    }
  );

  // Get files for current run - stops polling when run completes
  const { data: files } = useSWR<GeneratedFile[]>(
    currentRunId ? `/api/runs/${currentRunId}/files` : null,
    fetcher,
    {
      refreshInterval: () =>
        isRunActive(currentRun?.status) ? 2000 : 0,
    }
  );

  // Replaces Convex useAction - now a simple fetch
  const handleSubmit = useCallback(async () => {
    if (!input.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setCurrentRunId(null);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      });
      const result = await response.json();
      setCurrentRunId(result.runId);
    } catch (error) {
      console.error("Failed to run agent:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [input, isSubmitting]);

  const downloadFile = useCallback(
    (file: { path: string; content: string; isBinary: boolean }) => {
      const content = file.isBinary
        ? Uint8Array.from(atob(file.content), (c) => c.charCodeAt(0))
        : file.content;

      const blob = new Blob([content], {
        type: file.isBinary ? "application/octet-stream" : "text/plain",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.path.split("/").pop() || "file";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    []
  );

  const downloadAllFiles = useCallback(() => {
    if (!files || files.length === 0) return;
    files.forEach((file) => downloadFile(file));
  }, [files, downloadFile]);

  const getStatusColor = (status: RunStatus) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "running": return "bg-blue-500";
      case "completed": return "bg-green-500";
      case "failed": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: RunStatus) => {
    switch (status) {
      case "pending": return "Pending...";
      case "running": return "Running...";
      case "completed": return "Completed";
      case "failed": return "Failed";
      default: return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Claude Code Agent
        </h1>

        {/* Input Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Describe the files you want to generate:
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., Create a simple HTML page with a CSS file..."
            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Starting..." : "Run Agent"}
            </button>
            {currentRun?.status === "running" && (
              <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <span className="animate-spin">&#x27F3;</span>
                Agent is working...
              </span>
            )}
          </div>
        </div>

        {/* Current Run Status */}
        {currentRun && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Current Run</h2>
              <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(currentRun.status)}`}>
                {getStatusText(currentRun.status)}
              </span>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              <strong>Prompt:</strong> {currentRun.prompt.substring(0, 200)}
              {currentRun.prompt.length > 200 && "..."}
            </div>

            {/* Generated Files */}
            {files && files.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Generated Files ({files.length})
                  </h3>
                  <button onClick={downloadAllFiles} className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                    Download All
                  </button>
                </div>
                <div className="space-y-2">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.path}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)} {file.isBinary && "(binary)"}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {!file.isBinary && (
                          <button onClick={() => setPreviewFile(file)} className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-sm rounded hover:bg-gray-300">
                            Preview
                          </button>
                        )}
                        <button onClick={() => downloadFile(file)} className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agent Output */}
            {currentRun.output && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Agent Output</h3>
                <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-auto max-h-96 text-sm">{currentRun.output}</pre>
              </div>
            )}

            {/* Error Display */}
            {currentRun.error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Error</h3>
                <p className="text-red-700 dark:text-red-400 text-sm">{currentRun.error}</p>
              </div>
            )}
          </div>
        )}

        {/* Recent Runs */}
        {recentRuns && recentRuns.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Runs</h2>
            <div className="space-y-3">
              {recentRuns.slice(0, 10).map((run) => (
                <div
                  key={run.id}
                  onClick={() => setCurrentRunId(run.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    currentRunId === run.id
                      ? "bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500"
                      : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900 dark:text-white font-medium truncate max-w-md">
                      {run.prompt.substring(0, 80)}{run.prompt.length > 80 && "..."}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-white text-xs font-medium ${getStatusColor(run.status)}`}>
                      {run.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(run.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* File Preview Modal */}
      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
        onDownload={() => { if (previewFile) downloadFile(previewFile); }}
      />
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
