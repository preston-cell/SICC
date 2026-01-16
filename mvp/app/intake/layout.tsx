"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GlossaryButton } from "../components/Glossary";

export default function IntakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Estate Planning Assistant
          </Link>
          <div className="flex items-center gap-4">
            <GlossaryButton variant="icon" />
            <Link
              href="/"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Exit Wizard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer with Glossary Link */}
      <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <GlossaryButton variant="text" className="text-xs" />
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              This tool provides general information for educational purposes only and does not constitute legal advice.
              Consult with a licensed attorney in your state for professional guidance.
            </p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
