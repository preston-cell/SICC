"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInButton, SignUpButton, UserButton, useUser } from "./components/ClerkComponents";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Shield,
  FileText,
  PieChart,
  Clock,
  Users,
  Flag,
  ArrowRight,
  Plus,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Check,
  Heart,
  Building2,
  CreditCard,
  ClipboardList,
} from "lucide-react";

// Cohere color
const CORAL = "#FF5833";
const CORAL_MUTED = "rgba(255, 88, 51, 0.12)";

// Subtle background gradient - Cohere uses minimal, subtle backgrounds
function SubtleGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute w-[800px] h-[800px] rounded-full opacity-30"
        style={{
          background: `radial-gradient(circle, ${CORAL_MUTED} 0%, transparent 60%)`,
          top: "-20%",
          right: "-15%",
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, rgba(255, 131, 102, 0.1) 0%, transparent 60%)`,
          bottom: "0%",
          left: "-10%",
        }}
      />
    </div>
  );
}

// Animated counter
function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    const duration = 2000;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, isInView]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// Clean card component - Cohere style (minimal, no glass effects)
function Card({
  children,
  className = "",
  delay = 0,
  hoverable = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverable?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={hoverable ? { y: -2, transition: { duration: 0.15 } } : {}}
      className={`
        relative rounded-xl
        bg-[#1A1A1A]
        border border-white/[0.08]
        ${hoverable ? "hover:border-white/[0.12] hover:bg-[#1E1E1E]" : ""}
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

// Feature card - Cohere style
function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <Card delay={index * 0.08} className="p-6">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
        style={{ backgroundColor: CORAL_MUTED }}
      >
        <span style={{ color: CORAL }}><Icon className="w-5 h-5" /></span>
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-[#9D918A] text-[15px] leading-relaxed">{description}</p>
    </Card>
  );
}

// Step component - Cohere style
function StepItem({
  number,
  title,
  description,
  isLast = false,
}: {
  number: number;
  title: string;
  description: string;
  isLast?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: number * 0.1 }}
      className="flex gap-5"
    >
      <div className="flex flex-col items-center">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-medium text-sm"
          style={{ backgroundColor: CORAL, color: "#0D0D0D" }}
        >
          {number}
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-white/[0.1] mt-3" />
        )}
      </div>
      <div className="flex-1 pb-8">
        <h4 className="text-base font-medium text-white mb-1.5">{title}</h4>
        <p className="text-[#9D918A] text-[15px]">{description}</p>
      </div>
    </motion.div>
  );
}

// Document card - Cohere style
function DocumentCard({
  icon: Icon,
  name,
  description,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  description: string;
  index: number;
}) {
  return (
    <Card delay={index * 0.05} className="p-5 group cursor-pointer">
      <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center mb-4 group-hover:bg-[rgba(255,88,51,0.08)] transition-colors">
        <Icon className="w-[18px] h-[18px] text-[#9D918A] group-hover:text-[#FF5833] transition-colors" />
      </div>
      <h4 className="font-medium text-white mb-1 text-[15px]">{name}</h4>
      <p className="text-sm text-[#73655C]">{description}</p>
    </Card>
  );
}

// Estate plan card - Cohere style
function EstatePlanCard({
  plan,
}: {
  plan: {
    _id: string;
    name?: string;
    status: string;
    updatedAt: number;
    stateOfResidence?: string;
  };
}) {
  const statusConfig: Record<string, { color: string; label: string }> = {
    draft: { color: "#9D918A", label: "Draft" },
    intake_in_progress: { color: "#3B82F6", label: "In Progress" },
    intake_complete: { color: "#E68A00", label: "Ready for Analysis" },
    analysis_complete: { color: "#19A582", label: "Analyzed" },
    documents_generated: { color: CORAL, label: "Documents Ready" },
    complete: { color: "#19A582", label: "Complete" },
  };

  const config = statusConfig[plan.status] || statusConfig.draft;

  return (
    <Link
      href={
        plan.status === "draft" || plan.status === "intake_in_progress"
          ? `/intake?planId=${plan._id}`
          : `/analysis/${plan._id}`
      }
    >
      <Card className="p-5 group">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-medium text-white group-hover:text-[#FF5833] transition-colors">
              {plan.name || "My Estate Plan"}
            </h4>
            {plan.stateOfResidence && (
              <p className="text-sm text-[#73655C]">{plan.stateOfResidence}</p>
            )}
          </div>
          <span
            className="px-2.5 py-1 rounded-md text-xs font-medium"
            style={{
              backgroundColor: `${config.color}15`,
              color: config.color,
            }}
          >
            {config.label}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#73655C]">
            Updated {new Date(plan.updatedAt).toLocaleDateString()}
          </span>
          <span
            className="font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
            style={{ color: CORAL }}
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </Card>
    </Link>
  );
}

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { isSignedIn, isLoaded, user } = useUser();
  const { scrollYProgress } = useScroll();
  const navOpacity = useTransform(scrollYProgress, [0, 0.1], [0.8, 1]);

  useEffect(() => {
    const storedSessionId = localStorage.getItem("estatePlanSessionId");
    if (storedSessionId) setSessionId(storedSessionId);
  }, []);

  const convexUser = useQuery(
    api.queries.getUserByEmail,
    isSignedIn && user?.primaryEmailAddress?.emailAddress
      ? { email: user.primaryEmailAddress.emailAddress }
      : "skip"
  );

  const recentPlans = useQuery(
    api.queries.listRecentEstatePlans,
    convexUser?._id
      ? { limit: 5, userId: convexUser._id }
      : sessionId
        ? { limit: 5, sessionId }
        : "skip"
  );

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white overflow-x-hidden">
      {/* Navigation - Clean, minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D]/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: CORAL }}
              >
                <Shield className="w-4 h-4 text-[#0D0D0D]" />
              </div>
              <span className="text-[15px] font-medium">EstateAI</span>
            </div>

            <div className="flex items-center gap-5">
              {recentPlans && recentPlans.length > 0 && (
                <button
                  onClick={() => setShowDashboard(!showDashboard)}
                  className="text-[#9D918A] hover:text-white font-medium transition-colors text-sm"
                >
                  My Plans
                </button>
              )}
              {isLoaded && !isSignedIn && (
                <>
                  <SignInButton mode="modal">
                    <button className="text-[#9D918A] hover:text-white font-medium transition-colors text-sm">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button
                      className="px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                      style={{ backgroundColor: CORAL, color: "#0D0D0D" }}
                    >
                      Get Started
                    </button>
                  </SignUpButton>
                </>
              )}
              {isLoaded && isSignedIn && (
                <>
                  <Link href="/intake">
                    <button
                      className="px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                      style={{ backgroundColor: CORAL, color: "#0D0D0D" }}
                    >
                      Get Started
                    </button>
                  </Link>
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{ elements: { avatarBox: "w-7 h-7" } }}
                  />
                </>
              )}
              {!isLoaded && (
                <Link href="/intake">
                  <button
                    className="px-4 py-2 rounded-lg font-medium text-sm"
                    style={{ backgroundColor: CORAL, color: "#0D0D0D" }}
                  >
                    Get Started
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Dropdown */}
      {showDashboard && recentPlans && recentPlans.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed top-14 left-0 right-0 z-40 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-white/[0.06]"
        >
          <div className="max-w-6xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium">Your Estate Plans</h3>
              <Link href="/intake">
                <span
                  className="font-medium flex items-center gap-1.5 text-sm hover:gap-2 transition-all"
                  style={{ color: CORAL }}
                >
                  <Plus className="w-4 h-4" />
                  New Plan
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentPlans.map((plan) => (
                <EstatePlanCard key={plan._id} plan={plan} />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Hero Section - Clean, confident */}
      <section className="relative pt-28 pb-20 min-h-[90vh] flex items-center">
        <SubtleGradient />

        <div className="relative max-w-6xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            {/* Label - Simple, no animation */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md mb-6 text-sm font-medium"
              style={{ backgroundColor: CORAL_MUTED, color: CORAL }}
            >
              Estate Planning
            </div>

            {/* Headline - Clean, no gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-[clamp(2.5rem,6vw,4rem)] font-semibold mb-5 leading-[1.1] tracking-[-0.02em] text-white"
            >
              Your estate plan,
              <br />
              analyzed in minutes
            </motion.h1>

            {/* Subheadline - Direct */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-lg text-[#B3AAA4] mb-8 max-w-xl leading-relaxed"
            >
              Answer a few questions. Get a gap analysis, see how assets will be distributed, and generate draft documents.
            </motion.p>

            {/* CTAs - Clean */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link href="/intake">
                <button
                  className="px-6 py-3 rounded-lg font-medium text-[15px] flex items-center gap-2 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: CORAL, color: "#0D0D0D" }}
                >
                  Start Free Analysis
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <a
                href="#features"
                className="px-6 py-3 bg-white/[0.04] border border-white/[0.08] text-white rounded-lg font-medium text-[15px] hover:bg-white/[0.06] transition-colors"
              >
                How It Works
              </a>
            </motion.div>
          </div>

          {/* Stats - Minimal */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { value: 10000, suffix: "+", label: "Plans analyzed" },
              { value: 50, suffix: "", label: "States covered" },
              { value: 98, suffix: "%", label: "Satisfaction" },
              { value: 15, suffix: " min", label: "Avg. time" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-2xl md:text-3xl font-semibold text-white">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[#73655C] text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-white">
              What you get
            </h2>
            <p className="text-[#9D918A] max-w-lg">
              A complete toolkit for understanding and improving your estate plan.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              index={0}
              icon={ClipboardList}
              title="Gap Analysis"
              description="Identify missing documents, outdated provisions, and potential issues."
            />
            <FeatureCard
              index={1}
              icon={PieChart}
              title="Asset Distribution"
              description="See how your assets will be distributed across beneficiaries."
            />
            <FeatureCard
              index={2}
              icon={FileText}
              title="Document Drafts"
              description="Generate customized documents for your state."
            />
            <FeatureCard
              index={3}
              icon={Clock}
              title="Review Reminders"
              description="Get notified when life events require updates."
            />
            <FeatureCard
              index={4}
              icon={Users}
              title="Beneficiary Tracking"
              description="Catch conflicts between your will and direct designations."
            />
            <FeatureCard
              index={5}
              icon={Flag}
              title="State-Specific"
              description="Recommendations based on your state's laws."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl font-semibold mb-3 text-white"
              >
                How it works
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-[#9D918A] mb-8"
              >
                Four steps to a complete analysis
              </motion.p>

              <div>
                <StepItem
                  number={1}
                  title="Answer questions"
                  description="Tell us about your family, assets, and goals."
                />
                <StepItem
                  number={2}
                  title="Get analysis"
                  description="We identify gaps and potential issues."
                />
                <StepItem
                  number={3}
                  title="Review distribution"
                  description="See how assets flow to beneficiaries."
                />
                <StepItem
                  number={4}
                  title="Generate documents"
                  description="Create drafts tailored to your state."
                  isLast
                />
              </div>
            </div>

            {/* Preview Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="p-6 space-y-5" hoverable={false}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: CORAL_MUTED }}
                  >
                    <CheckCircle2 className="w-5 h-5" style={{ color: CORAL }} />
                  </div>
                  <div>
                    <div className="text-xs text-[#73655C] uppercase tracking-wide">Analysis Complete</div>
                    <div className="font-medium text-white">Score: 72/100</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#9D918A]">Documents</span>
                    <span className="text-[#19A582]">4 of 6</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: CORAL }}
                      initial={{ width: 0 }}
                      whileInView={{ width: "66%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#E68A00]/[0.08] border border-[#E68A00]/[0.15]">
                    <AlertTriangle className="w-4 h-4 text-[#E68A00]" />
                    <span className="text-sm text-[#E68A00]">Healthcare Directive missing</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#19A582]/[0.08] border border-[#19A582]/[0.15]">
                    <Check className="w-4 h-4 text-[#19A582]" />
                    <span className="text-sm text-[#19A582]">Will is current</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-white">
              Documents
            </h2>
            <p className="text-[#9D918A] max-w-lg">
              Generate drafts for these essential estate planning documents.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            <DocumentCard index={0} icon={FileText} name="Will" description="Asset distribution instructions" />
            <DocumentCard index={1} icon={Building2} name="Living Trust" description="Avoid probate, smooth transfer" />
            <DocumentCard index={2} icon={CreditCard} name="Financial POA" description="Authorize financial management" />
            <DocumentCard index={3} icon={Heart} name="Healthcare POA" description="Medical decision authority" />
            <DocumentCard index={4} icon={ClipboardList} name="Living Will" description="End-of-life preferences" />
            <DocumentCard index={5} icon={Shield} name="HIPAA Authorization" description="Medical records access" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative bg-[#0A0A0A]">
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-semibold mb-4 text-white"
          >
            Get started for free
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#9D918A] mb-8"
          >
            Complete your estate plan analysis in about 15 minutes.
          </motion.p>
          <Link href="/intake">
            <button
              className="px-6 py-3 rounded-lg font-medium text-[15px] inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: CORAL, color: "#0D0D0D" }}
            >
              Start Analysis
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-5 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-[#1A1A1A] border border-white/[0.06]">
            <AlertTriangle className="w-4 h-4 text-[#E68A00] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-[#9D918A]">
                <span className="text-[#E68A00] font-medium">Disclaimer:</span> This tool provides general information for educational purposes only. It does not constitute legal advice. Generated documents should be reviewed by a licensed attorney.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ backgroundColor: CORAL }}
              >
                <Shield className="w-3.5 h-3.5 text-[#0D0D0D]" />
              </div>
              <span className="font-medium text-sm">EstateAI</span>
            </div>
            <p className="text-sm text-[#73655C]">
              This is not a law firm.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
