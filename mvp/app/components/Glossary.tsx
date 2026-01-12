"use client";

import { useState, useMemo, useCallback } from "react";
import {
  GLOSSARY_TERMS,
  GLOSSARY_CATEGORIES,
  GlossaryCategory,
  GlossaryTerm,
  searchTerms,
  getTermsByCategory,
} from "../../lib/glossaryData";
import Modal from "./ui/Modal";

interface GlossaryProps {
  isOpen: boolean;
  onClose: () => void;
  initialTerm?: string;
  initialCategory?: GlossaryCategory;
}

/**
 * Full-page glossary modal with search and category filtering
 */
export default function Glossary({
  isOpen,
  onClose,
  initialTerm,
  initialCategory,
}: GlossaryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | "all">(
    initialCategory || "all"
  );
  const [expandedTerm, setExpandedTerm] = useState<string | null>(initialTerm || null);

  // Filter terms based on search and category
  const filteredTerms = useMemo(() => {
    let terms = GLOSSARY_TERMS;

    // Filter by category
    if (selectedCategory !== "all") {
      terms = getTermsByCategory(selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const searchResults = searchTerms(searchQuery);
      terms = terms.filter((t) =>
        searchResults.some((sr) => sr.term === t.term)
      );
    }

    // Sort alphabetically
    return terms.sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery, selectedCategory]);

  // Group terms by category for display
  const groupedTerms = useMemo(() => {
    if (selectedCategory !== "all") {
      return { [selectedCategory]: filteredTerms };
    }

    const groups: Record<string, GlossaryTerm[]> = {};
    filteredTerms.forEach((term) => {
      if (!groups[term.category]) {
        groups[term.category] = [];
      }
      groups[term.category].push(term);
    });
    return groups;
  }, [filteredTerms, selectedCategory]);

  const handleTermClick = useCallback((termName: string) => {
    setExpandedTerm((prev) => (prev === termName ? null : termName));
  }, []);

  const categoryKeys = Object.keys(GLOSSARY_CATEGORIES) as GlossaryCategory[];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Estate Planning Glossary"
      size="xl"
    >
      <div className="flex flex-col h-[70vh]">
        {/* Search and Filter Bar */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 pb-4 space-y-4 border-b border-gray-200 dark:border-gray-700">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600
                         rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                selectedCategory === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              All ({GLOSSARY_TERMS.length})
            </button>
            {categoryKeys.map((cat) => {
              const count = getTermsByCategory(cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {GLOSSARY_CATEGORIES[cat].label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Terms List */}
        <div className="flex-1 overflow-y-auto py-4">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg font-medium">No terms found</p>
              <p className="text-sm mt-1">
                Try adjusting your search or filter
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedTerms).map(([category, terms]) => (
                <div key={category}>
                  {selectedCategory === "all" && (
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      {GLOSSARY_CATEGORIES[category as GlossaryCategory]?.label || category}
                    </h3>
                  )}
                  <div className="space-y-2">
                    {terms.map((term) => (
                      <GlossaryTermItem
                        key={term.term}
                        term={term}
                        isExpanded={expandedTerm === term.term}
                        onClick={() => handleTermClick(term.term)}
                        searchQuery={searchQuery}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            These definitions are for educational purposes only and do not constitute legal advice.
            Consult a licensed attorney for specific guidance.
          </p>
        </div>
      </div>
    </Modal>
  );
}

interface GlossaryTermItemProps {
  term: GlossaryTerm;
  isExpanded: boolean;
  onClick: () => void;
  searchQuery: string;
}

function GlossaryTermItem({
  term,
  isExpanded,
  onClick,
  searchQuery,
}: GlossaryTermItemProps) {
  // Highlight matching text
  const highlightText = (text: string) => {
    if (!searchQuery.trim()) return text;

    const regex = new RegExp(`(${searchQuery})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className={`border rounded-lg transition-all ${
        isExpanded
          ? "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        className="w-full px-4 py-3 text-left flex items-center justify-between"
      >
        <span className="font-medium text-gray-900 dark:text-white">
          {highlightText(term.term)}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 animate-fadeIn">
          <p className="text-gray-600 dark:text-gray-300">
            {highlightText(term.definition)}
          </p>

          {term.example && (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Example:</span> {term.example}
              </p>
            </div>
          )}

          {term.relatedTerms && term.relatedTerms.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Related terms:
              </span>
              {term.relatedTerms.map((related) => (
                <span
                  key={related}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700
                             text-gray-600 dark:text-gray-300 rounded-full"
                >
                  {related}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * A button that opens the glossary modal
 */
interface GlossaryButtonProps {
  className?: string;
  variant?: "icon" | "text" | "full";
}

export function GlossaryButton({
  className = "",
  variant = "full",
}: GlossaryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === "icon") {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400
                     dark:hover:text-blue-400 transition-colors ${className}`}
          aria-label="Open glossary"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </button>
        <Glossary isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  }

  if (variant === "text") {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`text-blue-600 hover:text-blue-700 dark:text-blue-400
                     dark:hover:text-blue-300 hover:underline ${className}`}
        >
          Glossary
        </button>
        <Glossary isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                   text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800
                   border border-gray-300 dark:border-gray-600 rounded-lg
                   hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${className}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        Estate Planning Glossary
      </button>
      <Glossary isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
