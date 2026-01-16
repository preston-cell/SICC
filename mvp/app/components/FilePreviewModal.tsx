"use client";

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
  if (!file) return null;

  // Get file extension for syntax highlighting hint
  const getFileType = (path: string) => {
    const ext = path.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "html":
        return "html";
      case "css":
        return "css";
      case "js":
        return "javascript";
      case "ts":
        return "typescript";
      case "tsx":
        return "typescript";
      case "jsx":
        return "javascript";
      case "json":
        return "json";
      case "py":
        return "python";
      case "md":
        return "markdown";
      default:
        return "text";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {file.path}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getFileType(file.path)}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Download
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-sm overflow-auto">
            <code>{file.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
