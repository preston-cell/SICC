"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { GlossaryButton } from "../components/Glossary";

export default function IntakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[var(--border)]">
        <div className="container h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#1D1D1F]">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-[#1D1D1F]">EstatePlan</span>
          </Link>
          <div className="flex items-center gap-4">
            <GlossaryButton variant="icon" />
            <Link
              href="/"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors"
            >
              Exit
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 md:py-12">
        <div className="container">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--off-white)] border-t border-[var(--border)] mt-auto">
        <div className="container py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <GlossaryButton variant="text" className="text-xs" />
            <p className="text-xs text-[var(--text-caption)] text-center">
              This tool provides general information for educational purposes only and does not constitute legal advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
