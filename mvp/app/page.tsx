"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

// Animated counter component
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

// Feature card with hover effects
function FeatureCard({
  icon,
  title,
  description,
  gradient
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${gradient}`}></div>
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${gradient} text-white shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

// Step card for the process
function StepCard({
  number,
  title,
  description,
  icon,
  isLast = false
}: {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <div className="relative flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
          {number}
        </div>
        {!isLast && (
          <div className="w-0.5 h-full bg-gradient-to-b from-blue-500 to-transparent mt-2"></div>
        )}
      </div>
      <div className="flex-1 pb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-blue-600 dark:text-blue-400">{icon}</div>
            <h4 className="font-bold text-gray-900 dark:text-white text-lg">{title}</h4>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
}

// Estate plan card for dashboard
function EstatePlanCard({
  plan
}: {
  plan: {
    _id: string;
    name?: string;
    status: string;
    updatedAt: number;
    stateOfResidence?: string;
  };
}) {
  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    intake_in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    intake_complete: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    analysis_complete: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    documents_generated: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    complete: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  };

  const statusLabels: Record<string, string> = {
    draft: "Draft",
    intake_in_progress: "In Progress",
    intake_complete: "Ready for Analysis",
    analysis_complete: "Analyzed",
    documents_generated: "Documents Ready",
    complete: "Complete",
  };

  return (
    <Link
      href={plan.status === "draft" || plan.status === "intake_in_progress"
        ? `/intake?planId=${plan._id}`
        : `/analysis/${plan._id}`}
      className="block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {plan.name || "My Estate Plan"}
          </h4>
          {plan.stateOfResidence && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{plan.stateOfResidence}</p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[plan.status]}`}>
          {statusLabels[plan.status]}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500 dark:text-gray-400">
          Updated {new Date(plan.updatedAt).toLocaleDateString()}
        </span>
        <span className="text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          Continue
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { isSignedIn, isLoaded, user } = useUser();

  // Get sessionId from localStorage on mount
  useEffect(() => {
    const storedSessionId = localStorage.getItem("estatePlanSessionId");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    }
  }, []);

  // Get user from Convex if signed in
  const convexUser = useQuery(
    api.queries.getUserByEmail,
    isSignedIn && user?.primaryEmailAddress?.emailAddress
      ? { email: user.primaryEmailAddress.emailAddress }
      : "skip"
  );

  // Fetch recent estate plans - filtered by user or session
  const recentPlans = useQuery(
    api.queries.listRecentEstatePlans,
    convexUser?._id
      ? { limit: 5, userId: convexUser._id }
      : sessionId
        ? { limit: 5, sessionId }
        : "skip"
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">EstateAI</span>
            </div>
            <div className="flex items-center gap-4">
              {recentPlans && recentPlans.length > 0 && (
                <button
                  onClick={() => setShowDashboard(!showDashboard)}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  My Plans
                </button>
              )}
              {isLoaded && !isSignedIn && (
                <>
                  <SignInButton mode="modal">
                    <button className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg">
                      Get Started
                    </button>
                  </SignUpButton>
                </>
              )}
              {isLoaded && isSignedIn && (
                <>
                  <Link
                    href="/intake"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Get Started
                  </Link>
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9"
                      }
                    }}
                  />
                </>
              )}
              {!isLoaded && (
                <Link
                  href="/intake"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Dropdown */}
      {showDashboard && recentPlans && recentPlans.length > 0 && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg animate-slideDown">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your Estate Plans</h3>
              <Link
                href="/intake"
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Plan
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentPlans.map((plan) => (
                <EstatePlanCard key={plan._id} plan={plan} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              AI-Powered Estate Planning
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Protect Your Legacy
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                With Confidence
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Get a comprehensive analysis of your estate plan, identify gaps, and generate
              personalized legal documents — all powered by AI and guided by legal expertise.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/intake"
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Start Free Analysis
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <a
                href="#features"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                See How It Works
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: 10000, suffix: "+", label: "Plans Analyzed" },
              { value: 50, suffix: "", label: "States Covered" },
              { value: 98, suffix: "%", label: "Satisfaction Rate" },
              { value: 15, suffix: " min", label: "Average Time" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Plan Your Estate
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our comprehensive platform guides you through every step of estate planning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              gradient="bg-gradient-to-br from-blue-500 to-blue-600"
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
              title="Gap Analysis"
              description="AI identifies missing documents, outdated provisions, and potential issues in your current estate plan."
            />
            <FeatureCard
              gradient="bg-gradient-to-br from-green-500 to-emerald-600"
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              }
              title="Estate Visualization"
              description="See exactly how your assets will be distributed with interactive charts and beneficiary breakdowns."
            />
            <FeatureCard
              gradient="bg-gradient-to-br from-purple-500 to-indigo-600"
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              title="Document Generation"
              description="Generate customized legal documents tailored to your state's requirements and your specific situation."
            />
            <FeatureCard
              gradient="bg-gradient-to-br from-amber-500 to-orange-600"
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Smart Reminders"
              description="Get notified when life events require updates to your estate plan — marriage, new child, moves, and more."
            />
            <FeatureCard
              gradient="bg-gradient-to-br from-pink-500 to-rose-600"
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              title="Beneficiary Tracking"
              description="Track beneficiaries across all accounts and catch conflicts between your will and direct designations."
            />
            <FeatureCard
              gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              }
              title="State-Specific Guidance"
              description="Get recommendations based on your state's specific laws, tax thresholds, and requirements."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple 4-Step Process
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get your estate plan analyzed and documents generated in just 15 minutes
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <StepCard
              number={1}
              title="Complete the Questionnaire"
              description="Answer guided questions about your family, assets, existing documents, and goals. Plain language — no legal jargon."
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
            />
            <StepCard
              number={2}
              title="Get Your Gap Analysis"
              description="Our AI analyzes your situation and identifies missing documents, outdated provisions, and potential issues with state-specific insights."
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
            <StepCard
              number={3}
              title="View Estate Distribution"
              description="See exactly how your assets will be distributed with visual breakdowns, beneficiary cards, and what-if scenarios."
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                </svg>
              }
            />
            <StepCard
              number={4}
              title="Generate Documents"
              description="Generate customized legal documents tailored to your state. Download drafts to review with your attorney."
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              isLast
            />
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Essential Estate Planning Documents
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Generate drafts of all the documents you need to protect your family
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Last Will & Testament",
                desc: "Specify how your assets should be distributed and name guardians for minor children.",
                icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              },
              {
                name: "Revocable Living Trust",
                desc: "Avoid probate, maintain privacy, and ensure smooth asset transfer to beneficiaries.",
                icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              },
              {
                name: "Financial Power of Attorney",
                desc: "Authorize someone you trust to manage your finances if you become incapacitated.",
                icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              },
              {
                name: "Healthcare Power of Attorney",
                desc: "Designate someone to make medical decisions on your behalf when you cannot.",
                icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              },
              {
                name: "Living Will / Healthcare Directive",
                desc: "Document your wishes for end-of-life medical care and treatment preferences.",
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              },
              {
                name: "HIPAA Authorization",
                desc: "Allow designated people to access your medical information and records.",
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              },
            ].map((doc) => (
              <div
                key={doc.name}
                className="group bg-gray-50 dark:bg-gray-900 rounded-xl p-6 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={doc.icon} />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{doc.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{doc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Protect Your Family&apos;s Future?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start your free estate plan analysis today. It only takes 15 minutes to get personalized
            recommendations and identify gaps in your current plan.
          </p>
          <Link
            href="/intake"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors shadow-xl"
          >
            Start Your Free Analysis
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">Important Disclaimer</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                This tool provides general information and generates draft documents for educational purposes only.
                It does not constitute legal advice. Generated documents should be reviewed by a licensed attorney
                in your state before signing. Estate planning laws vary by state and individual circumstances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-semibold text-white">EstateAI</span>
            </div>
            <p className="text-sm text-center md:text-right">
              AI-Powered Estate Planning Tools. This is not a law firm.
            </p>
          </div>
        </div>
      </footer>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        .bg-grid-white\/10 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
}
