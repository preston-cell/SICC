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

// Category colors matching the theme
const CATEGORY_COLORS: Record<GlossaryCategory, { bg: string; text: string; border: string; icon: string }> = {
  "estate-basics": { bg: "bg-gradient-to-br from-coral-light/20 to-coral/10", text: "text-coral-dark", border: "border-coral/30", icon: "from-coral to-coral-dark" },
  documents: { bg: "bg-gradient-to-br from-quartz/20 to-quartz-dark/10", text: "text-quartz-dark", border: "border-quartz/30", icon: "from-quartz-dark to-purple-600" },
  beneficiaries: { bg: "bg-gradient-to-br from-sage-green/20 to-green-500/10", text: "text-green-700", border: "border-sage-green/30", icon: "from-sage-green to-green-600" },
  taxes: { bg: "bg-gradient-to-br from-amber-100 to-amber-200/50", text: "text-amber-700", border: "border-amber-200", icon: "from-amber-400 to-amber-600" },
  healthcare: { bg: "bg-gradient-to-br from-blue-100 to-blue-200/50", text: "text-blue-700", border: "border-blue-200", icon: "from-blue-400 to-blue-600" },
  property: { bg: "bg-gradient-to-br from-stone-100 to-stone-200/50", text: "text-stone-700", border: "border-stone-200", icon: "from-stone-400 to-stone-600" },
};

// Category icons
const CATEGORY_ICONS: Record<GlossaryCategory, React.ReactNode> = {
  "estate-basics": (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  documents: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  beneficiaries: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  taxes: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  healthcare: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  property: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
};

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
      title=""
      size="xl"
    >
      <div className="flex flex-col h-[80vh] p-2">
        {/* Header */}
        <div className="text-center pb-8 pt-4">
          <h2 className="text-3xl font-semibold text-volcanic-black tracking-tight">
            Estate Planning Glossary
          </h2>
          <p className="text-mushroom-grey text-base mt-2">
            Understanding key terms made simple
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm pb-6 space-y-5 border-b border-stone-grey/20">
          {/* Search Input */}
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 border-2 border-stone-grey/30 rounded-2xl
                         bg-cream/50 text-volcanic-black placeholder-warm-grey
                         focus:ring-0 focus:border-coral/50 focus:bg-white
                         transition-all duration-200 text-base"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-grey">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center
                           rounded-full bg-stone-grey/20 text-mushroom-grey hover:bg-coral/20 hover:text-coral
                           transition-all duration-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Category Filter - Centered */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-coral to-coral-dark text-white shadow-md shadow-coral/25"
                  : "bg-cream text-mushroom-grey hover:bg-stone-grey/20 border border-stone-grey/20"
              }`}
            >
              All ({GLOSSARY_TERMS.length})
            </button>
            {categoryKeys.map((cat) => {
              const count = getTermsByCategory(cat).length;
              const colors = CATEGORY_COLORS[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2 ${
                    selectedCategory === cat
                      ? `bg-gradient-to-r ${colors.icon} text-white shadow-md`
                      : `${colors.bg} ${colors.text} border ${colors.border} hover:shadow-sm`
                  }`}
                >
                  {CATEGORY_ICONS[cat]}
                  <span>{GLOSSARY_CATEGORIES[cat].label}</span>
                  <span className={`text-xs ${selectedCategory === cat ? "text-white/80" : "opacity-60"}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Terms List */}
        <div className="flex-1 overflow-y-auto py-8 px-4">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-cream flex items-center justify-center">
                <svg className="w-12 h-12 text-stone-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xl font-medium text-volcanic-black">No terms found</p>
              <p className="text-base text-mushroom-grey mt-3">
                Try adjusting your search or filter
              </p>
            </div>
          ) : (
            <div className="space-y-10 max-w-3xl mx-auto">
              {Object.entries(groupedTerms).map(([category, terms]) => {
                const catKey = category as GlossaryCategory;
                const colors = CATEGORY_COLORS[catKey];
                return (
                  <div key={category}>
                    {selectedCategory === "all" && (
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.icon} flex items-center justify-center text-white shadow-sm`}>
                          {CATEGORY_ICONS[catKey]}
                        </div>
                        <h3 className="text-base font-semibold text-volcanic-black uppercase tracking-wide">
                          {GLOSSARY_CATEGORIES[catKey]?.label || category}
                        </h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-stone-grey/20 to-transparent" />
                      </div>
                    )}
                    <div className="space-y-4">
                      {terms.map((term) => (
                        <GlossaryTermItem
                          key={term.term}
                          term={term}
                          isExpanded={expandedTerm === term.term}
                          onClick={() => handleTermClick(term.term)}
                          searchQuery={searchQuery}
                          categoryColors={colors}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-grey/20 pt-4 mt-4">
          <p className="text-xs text-warm-grey text-center leading-relaxed">
            These definitions are for educational purposes only and do not constitute legal advice.
            <br />Consult a licensed attorney for specific guidance.
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
  categoryColors: { bg: string; text: string; border: string; icon: string };
}

function GlossaryTermItem({
  term,
  isExpanded,
  onClick,
  searchQuery,
  categoryColors,
}: GlossaryTermItemProps) {
  // Highlight matching text
  const highlightText = (text: string) => {
    if (!searchQuery.trim()) return text;

    const regex = new RegExp(`(${searchQuery})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-coral-light/50 text-coral-dark rounded px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className={`rounded-2xl transition-all duration-300 overflow-hidden ${
        isExpanded
          ? `${categoryColors.bg} border-2 ${categoryColors.border} shadow-lg`
          : "bg-white border-2 border-stone-grey/20 hover:border-stone-grey/40 hover:shadow-md"
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
      >
        <span className={`font-semibold text-lg ${isExpanded ? categoryColors.text : "text-volcanic-black"}`}>
          {highlightText(term.term)}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
          isExpanded
            ? `bg-gradient-to-br ${categoryColors.icon} text-white shadow-sm`
            : "bg-cream text-warm-grey"
        }`}>
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-5 animate-fadeIn">
          <p className="text-mushroom-grey leading-relaxed text-base">
            {highlightText(term.definition)}
          </p>

          {term.example && (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/50">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-coral/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <span className="text-sm font-semibold text-coral uppercase tracking-wide">Example</span>
                  <p className="text-base text-mushroom-grey mt-2">{term.example}</p>
                </div>
              </div>
            </div>
          )}

          {term.relatedTerms && term.relatedTerms.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <span className="text-sm font-medium text-warm-grey uppercase tracking-wide">
                Related:
              </span>
              {term.relatedTerms.map((related) => (
                <span
                  key={related}
                  className="text-sm px-4 py-2 bg-white/80 text-mushroom-grey rounded-full
                             border border-stone-grey/20 hover:border-coral/30 hover:text-coral
                             transition-colors cursor-default"
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
          className={`p-2.5 rounded-xl text-mushroom-grey hover:text-coral
                     bg-cream hover:bg-coral/10 transition-all duration-200 ${className}`}
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
          className={`text-coral hover:text-coral-dark font-medium
                     hover:underline underline-offset-2 transition-colors ${className}`}
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
        className={`inline-flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium
                   text-volcanic-black bg-white border-2 border-stone-grey/30 rounded-xl
                   hover:border-coral/30 hover:bg-coral/5 hover:text-coral
                   transition-all duration-200 shadow-sm hover:shadow-md ${className}`}
      >
        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
