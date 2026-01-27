"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  GLOSSARY_TERMS,
  GLOSSARY_CATEGORIES,
  GlossaryCategory,
  GlossaryTerm,
  searchTerms,
  getTermsByCategory,
} from "../../lib/glossaryData";

interface GlossaryProps {
  isOpen: boolean;
  onClose: () => void;
  initialTerm?: string;
  initialCategory?: GlossaryCategory;
}

/**
 * Clean, minimal glossary modal
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
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Ensure we're on the client for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter terms based on search and category
  const filteredTerms = useMemo(() => {
    let terms = GLOSSARY_TERMS;

    if (selectedCategory !== "all") {
      terms = getTermsByCategory(selectedCategory);
    }

    if (searchQuery.trim()) {
      const searchResults = searchTerms(searchQuery);
      terms = terms.filter((t) =>
        searchResults.some((sr) => sr.term === t.term)
      );
    }

    return terms.sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery, selectedCategory]);

  // Get unique first letters for alphabet nav
  const alphabet = useMemo(() => {
    const letters = new Set(filteredTerms.map((t) => t.term[0].toUpperCase()));
    return Array.from(letters).sort();
  }, [filteredTerms]);

  // Group by letter
  const groupedByLetter = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};
    filteredTerms.forEach((term) => {
      const letter = term.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const handleTermClick = useCallback((termName: string) => {
    setExpandedTerm((prev) => (prev === termName ? null : termName));
  }, []);

  const scrollToLetter = (letter: string) => {
    const element = document.getElementById(`glossary-letter-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const categoryKeys = Object.keys(GLOSSARY_CATEGORIES) as GlossaryCategory[];

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-4 sm:inset-8 md:inset-12 lg:inset-16 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Glossary</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {filteredTerms.length} terms
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 placeholder:text-gray-400 focus:bg-white focus:border-[var(--coral)] focus:ring-1 focus:ring-[var(--coral)] outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Category Pills - Horizontal Scroll */}
          <div className="mt-3 -mx-6 px-6 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 pb-1">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                  selectedCategory === "all"
                    ? "bg-[var(--coral)] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {categoryKeys.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-[var(--coral)] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {GLOSSARY_CATEGORIES[cat].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Alphabet Sidebar */}
          <div className="hidden sm:flex flex-col items-center py-4 px-2 border-r border-gray-100 bg-gray-50/50">
            {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => {
              const hasTerms = alphabet.includes(letter);
              return (
                <button
                  key={letter}
                  onClick={() => hasTerms && scrollToLetter(letter)}
                  disabled={!hasTerms}
                  className={`w-6 h-6 text-xs font-medium rounded transition-colors ${
                    hasTerms
                      ? "text-gray-600 hover:text-[var(--coral)] hover:bg-[var(--coral)]/10"
                      : "text-gray-300 cursor-default"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          {/* Terms List */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            {filteredTerms.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-gray-900 font-medium">No terms found</p>
                <p className="text-sm text-gray-500 mt-1">Try a different search or category</p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-3 text-sm text-[var(--coral)] hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {Object.entries(groupedByLetter).map(([letter, terms]) => (
                  <div key={letter} id={`glossary-letter-${letter}`}>
                    {/* Letter Header */}
                    <div className="sticky top-0 bg-gray-50 px-6 py-2 border-b border-gray-100">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {letter}
                      </span>
                    </div>

                    {/* Terms in this letter group */}
                    <div>
                      {terms.map((term) => (
                        <GlossaryTermItem
                          key={term.term}
                          term={term}
                          isExpanded={expandedTerm === term.term}
                          onClick={() => handleTermClick(term.term)}
                          searchQuery={searchQuery}
                          onRelatedClick={(relatedTerm) => {
                            setSearchQuery("");
                            setSelectedCategory("all");
                            setExpandedTerm(relatedTerm);
                            // Scroll to the term
                            setTimeout(() => {
                              const letter = relatedTerm[0].toUpperCase();
                              scrollToLetter(letter);
                            }, 100);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-400 text-center">
            For educational purposes only. Consult a licensed attorney for legal advice.
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

interface GlossaryTermItemProps {
  term: GlossaryTerm;
  isExpanded: boolean;
  onClick: () => void;
  searchQuery: string;
  onRelatedClick: (term: string) => void;
}

function GlossaryTermItem({
  term,
  isExpanded,
  onClick,
  searchQuery,
  onRelatedClick,
}: GlossaryTermItemProps) {
  const highlightText = (text: string) => {
    if (!searchQuery.trim()) return text;
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-100 text-yellow-800 rounded px-0.5">{part}</mark>
      ) : part
    );
  };

  return (
    <div className={`border-b border-gray-50 ${isExpanded ? "bg-gray-50/50" : ""}`}>
      <button
        type="button"
        onClick={onClick}
        className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">
          {highlightText(term.term)}
        </span>
        <svg
          className={`flex-shrink-0 w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-6 pb-5 space-y-4">
          {/* Definition */}
          <p className="text-gray-600 leading-relaxed">
            {highlightText(term.definition)}
          </p>

          {/* Example */}
          {term.example && (
            <div className="pl-4 border-l-2 border-[var(--coral)]/30">
              <p className="text-sm text-gray-500 italic">
                {term.example}
              </p>
            </div>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Category */}
            <span className="inline-flex items-center text-xs text-gray-400">
              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {GLOSSARY_CATEGORIES[term.category].label}
            </span>

            {/* Related Terms */}
            {term.relatedTerms && term.relatedTerms.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-gray-400">Related:</span>
                {term.relatedTerms.map((related) => (
                  <button
                    key={related}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRelatedClick(related);
                    }}
                    className="text-xs text-[var(--coral)] hover:underline"
                  >
                    {related}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Button that opens the glossary modal
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

  const BookIcon = ({ size = "w-5 h-5" }: { size?: string }) => (
    <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );

  if (variant === "icon") {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`p-2 text-[var(--text-muted)] hover:text-[var(--coral)] hover:bg-[var(--off-white)] rounded-lg transition-colors ${className}`}
          aria-label="Open glossary"
        >
          <BookIcon />
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
          className={`text-[var(--coral)] hover:underline ${className}`}
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
        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--text-body)] bg-white border border-[var(--border)] rounded-lg hover:bg-[var(--off-white)] hover:border-[var(--border-dark)] transition-colors ${className}`}
      >
        <BookIcon size="w-4 h-4" />
        Glossary
      </button>
      <Glossary isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
