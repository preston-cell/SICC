"use client";

import { useCallback, useEffect } from "react";

interface FilePreviewModalProps {
  file: {
    path: string;
    content: string;
    isBinary: boolean;
  } | null;
  onClose: () => void;
  onDownload: () => void;
}

export default function FilePreviewModal({
  file,
  onClose,
  onDownload,
}: FilePreviewModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!file) return null;

  const getFileExtension = (path: string) => {
    const ext = path.split(".").pop()?.toLowerCase();
    return ext || "";
  };

  const getLanguage = (path: string) => {
    const ext = getFileExtension(path);
    const langMap: Record<string, string> = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      html: "html",
      css: "css",
      json: "json",
      md: "markdown",
      yaml: "yaml",
      yml: "yaml",
      sh: "bash",
      bash: "bash",
    };
    return langMap[ext] || "plaintext";
  };

  const fileName = file.path.split("/").pop() || file.path;
  const language = getLanguage(file.path);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {fileName}
            </span>
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
              {language}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg
                         hover:bg-blue-700 transition-colors"
            >
              Download
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400
                         dark:hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {file.isBinary ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Binary file - cannot preview
            </div>
          ) : (
            <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words font-mono">
              <code>{file.content}</code>
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
          {file.path} &bull; {file.content.length.toLocaleString()} characters
        </div>
      </div>
    </div>
  );
}
