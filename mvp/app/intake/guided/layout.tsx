"use client";

import Link from "next/link";
import { Shield, X } from "lucide-react";
import { GlossaryButton } from "@/app/components/Glossary";

export default function GuidedIntakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--off-white)] flex flex-col">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[var(--border)]">
        <div className="container h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#1D1D1F]">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-semibold text-[#1D1D1F]">EstatePlan</span>
          </Link>
          <div className="flex items-center gap-3">
            <GlossaryButton variant="icon" />
            <Link
              href="/intake"
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--off-white)] transition-all"
              title="Exit guided intake"
            >
              <X className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - Centered with max width */}
      <main className="flex-1 py-6 md:py-10">
        <div className="container max-w-2xl">
          {children}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-[var(--border)] mt-auto">
        <div className="container py-3">
          <p className="text-xs text-[var(--text-caption)] text-center">
            This tool provides general information and does not constitute legal advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
