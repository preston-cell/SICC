"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInButton, SignUpButton, UserButton, useUser } from "./components/ClerkComponents";
import { motion, useInView } from "framer-motion";
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
  Menu,
  X,
} from "lucide-react";
import { Button, LinkButton } from "./components/ui";
import Blob, { BlobContainer } from "./components/ui/Blob";
import Section, { SectionHeader } from "./components/ui/Section";
import Footer from "./components/ui/Footer";

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

// Feature card
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group p-6 rounded-xl bg-white border border-[var(--border)] hover:border-[var(--border-strong)] hover:shadow-lg transition-all duration-200"
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-[var(--accent-muted)]">
        <Icon className="w-6 h-6 text-[var(--accent-purple)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">{title}</h3>
      <p className="text-[var(--foreground-muted)] leading-relaxed">{description}</p>
    </motion.div>
  );
}

// Step component
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
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm bg-black text-white">
          {number}
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-[var(--border)] mt-3" />
        )}
      </div>
      <div className="flex-1 pb-8">
        <h4 className="text-base font-semibold text-[var(--foreground)] mb-1.5">{title}</h4>
        <p className="text-[var(--foreground-muted)]">{description}</p>
      </div>
    </motion.div>
  );
}

// Document card
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group p-5 rounded-xl bg-white border border-[var(--border)] hover:border-[var(--accent-purple)] hover:shadow-md cursor-pointer transition-all duration-200"
    >
      <div className="w-10 h-10 rounded-lg bg-[var(--off-white)] flex items-center justify-center mb-4 group-hover:bg-[var(--accent-muted)] transition-colors">
        <Icon className="w-5 h-5 text-[var(--medium-gray)] group-hover:text-[var(--accent-purple)] transition-colors" />
      </div>
      <h4 className="font-semibold text-[var(--foreground)] mb-1">{name}</h4>
      <p className="text-sm text-[var(--foreground-muted)]">{description}</p>
    </motion.div>
  );
}

// Estate plan card
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
  const statusConfig: Record<string, { color: string; bgColor: string; label: string }> = {
    draft: { color: "var(--medium-gray)", bgColor: "var(--off-white)", label: "Draft" },
    intake_in_progress: { color: "var(--info)", bgColor: "var(--info-muted)", label: "In Progress" },
    intake_complete: { color: "var(--warning)", bgColor: "var(--warning-muted)", label: "Ready for Analysis" },
    analysis_complete: { color: "var(--success)", bgColor: "var(--success-muted)", label: "Analyzed" },
    documents_generated: { color: "var(--accent-purple)", bgColor: "var(--accent-muted)", label: "Documents Ready" },
    complete: { color: "var(--success)", bgColor: "var(--success-muted)", label: "Complete" },
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
      <div className="group p-5 rounded-xl bg-white border border-[var(--border)] hover:border-[var(--accent-purple)] hover:shadow-md transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent-purple)] transition-colors">
              {plan.name || "My Estate Plan"}
            </h4>
            {plan.stateOfResidence && (
              <p className="text-sm text-[var(--foreground-muted)]">{plan.stateOfResidence}</p>
            )}
          </div>
          <span
            className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: config.bgColor,
              color: config.color,
            }}
          >
            {config.label}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--foreground-muted)]">
            Updated {new Date(plan.updatedAt).toLocaleDateString()}
          </span>
          <span className="font-medium text-[var(--accent-purple)] flex items-center gap-1 group-hover:gap-2 transition-all">
            Continue
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn, isLoaded, user } = useUser();

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
    <div className="min-h-screen bg-white text-[var(--foreground)] overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/95 backdrop-blur-md border-b border-[var(--border)]">
        <div className="container h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-black">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold">EstatePlan</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {recentPlans && recentPlans.length > 0 && (
              <button
                onClick={() => setShowDashboard(!showDashboard)}
                className="text-[#6B6B6B] hover:text-[#1A1A1A] font-medium transition-colors"
              >
                My Plans
              </button>
            )}
            <a href="#features" className="text-[#6B6B6B] hover:text-[#1A1A1A] font-medium transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-[#6B6B6B] hover:text-[#1A1A1A] font-medium transition-colors">
              How It Works
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isLoaded && !isSignedIn && (
              <>
                <SignInButton mode="modal">
                  <button className="text-[#6B6B6B] hover:text-[#1A1A1A] font-medium transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </SignUpButton>
              </>
            )}
            {isLoaded && isSignedIn && (
              <>
                <Link href="/intake">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{ elements: { avatarBox: "w-8 h-8" } }}
                />
              </>
            )}
            {!isLoaded && (
              <Link href="/intake">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-16">
          <div className="p-6 space-y-4">
            <a href="#features" className="block py-3 text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
              Features
            </a>
            <a href="#how-it-works" className="block py-3 text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
              How It Works
            </a>
            <div className="pt-4 border-t border-[var(--border)]">
              <Link href="/intake" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" fullWidth>
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Dropdown */}
      {showDashboard && recentPlans && recentPlans.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed top-16 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-b border-[var(--border)] shadow-lg"
        >
          <div className="container py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your Estate Plans</h3>
              <Link href="/intake">
                <span className="font-medium text-[var(--accent-purple)] flex items-center gap-1.5 hover:gap-2 transition-all">
                  <Plus className="w-4 h-4" />
                  New Plan
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentPlans.map((plan) => (
                <EstatePlanCard key={plan._id} plan={plan} />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Spacer for fixed nav */}
      <div className="h-16" />

      {/* Hero Section */}
      <BlobContainer className="relative pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Background blobs */}
        <Blob variant="purple" size={500} className="top-0 right-0 translate-x-1/3 -translate-y-1/4" delay={0} />
        <Blob variant="blue" size={400} className="top-1/3 right-1/4" delay={2} />
        <Blob variant="pink" size={350} className="bottom-0 right-0 translate-x-1/4 translate-y-1/4" delay={4} />
        <Blob variant="pink" size={300} className="top-1/2 right-1/3" opacity={0.5} delay={1} />

        <div className="container relative z-10">
          <div className="max-w-3xl">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium border border-[var(--accent-purple)] text-[var(--accent-purple)]"
            >
              AI-Powered Estate Planning
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-hero text-[#1D1D1F] mb-6"
            >
              Your estate plan,
              <br />
              <span className="text-[var(--accent-purple)]">analyzed in minutes</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-body-lg text-[#4A4A4A] mb-8 max-w-xl"
            >
              Answer a few questions. Get a comprehensive gap analysis, see how your assets will be distributed, and generate draft documents tailored to your state.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/intake">
                <Button variant="primary" size="lg" showArrow className="w-full sm:w-auto">
                  Start Free Analysis
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  How It Works
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: 10000, suffix: "+", label: "Plans analyzed" },
              { value: 50, suffix: "", label: "States covered" },
              { value: 98, suffix: "%", label: "Satisfaction rate" },
              { value: 15, suffix: " min", label: "Average time" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-semibold text-[#1D1D1F]">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[#6E6E73] text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </BlobContainer>

      {/* Features Section */}
      <Section id="features" variant="cream" size="lg">
        <SectionHeader
          label="Features"
          title="Everything you need"
          description="A complete toolkit for understanding and improving your estate plan."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            index={0}
            icon={ClipboardList}
            title="Gap Analysis"
            description="Identify missing documents, outdated provisions, and potential issues in your current plan."
          />
          <FeatureCard
            index={1}
            icon={PieChart}
            title="Asset Distribution"
            description="Visualize how your assets will be distributed across beneficiaries."
          />
          <FeatureCard
            index={2}
            icon={FileText}
            title="Document Drafts"
            description="Generate customized legal documents tailored to your state's requirements."
          />
          <FeatureCard
            index={3}
            icon={Clock}
            title="Review Reminders"
            description="Get notified when life events require updates to your estate plan."
          />
          <FeatureCard
            index={4}
            icon={Users}
            title="Beneficiary Tracking"
            description="Catch conflicts between your will and direct beneficiary designations."
          />
          <FeatureCard
            index={5}
            icon={Flag}
            title="State-Specific"
            description="Recommendations based on your state's unique laws and requirements."
          />
        </div>
      </Section>

      {/* How It Works */}
      <Section id="how-it-works" size="lg">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <SectionHeader
              label="Process"
              title="How it works"
              description="Four simple steps to a comprehensive estate plan analysis."
            />

            <div className="mt-8">
              <StepItem
                number={1}
                title="Answer questions"
                description="Tell us about your family, assets, and estate planning goals."
              />
              <StepItem
                number={2}
                title="Get your analysis"
                description="We identify gaps, conflicts, and potential issues in your plan."
              />
              <StepItem
                number={3}
                title="Review distribution"
                description="See exactly how your assets will flow to beneficiaries."
              />
              <StepItem
                number={4}
                title="Generate documents"
                description="Create draft documents tailored to your state's laws."
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
            className="bg-white rounded-2xl border border-[var(--border)] p-8 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--accent-muted)]">
                <CheckCircle2 className="w-6 h-6 text-[var(--accent-purple)]" />
              </div>
              <div>
                <div className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-medium">Analysis Complete</div>
                <div className="text-xl font-semibold">Score: 72/100</div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--foreground-muted)]">Documents reviewed</span>
                <span className="font-medium text-[var(--success)]">4 of 6</span>
              </div>
              <div className="h-2 bg-[var(--off-white)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[var(--accent-purple)]"
                  initial={{ width: 0 }}
                  whileInView={{ width: "66%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--warning-muted)] border border-[var(--warning)]/20">
                <AlertTriangle className="w-5 h-5 text-[var(--warning)]" />
                <span className="text-sm font-medium text-[var(--warning)]">Healthcare Directive missing</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--success-muted)] border border-[var(--success)]/20">
                <Check className="w-5 h-5 text-[var(--success)]" />
                <span className="text-sm font-medium text-[var(--success)]">Will is current and valid</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Documents Section */}
      <Section variant="cream" size="lg">
        <SectionHeader
          label="Documents"
          title="Essential documents"
          description="Generate drafts for these essential estate planning documents."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DocumentCard index={0} icon={FileText} name="Last Will & Testament" description="Instructions for asset distribution" />
          <DocumentCard index={1} icon={Building2} name="Living Trust" description="Avoid probate, ensure smooth transfer" />
          <DocumentCard index={2} icon={CreditCard} name="Financial Power of Attorney" description="Authorize financial management" />
          <DocumentCard index={3} icon={Heart} name="Healthcare Power of Attorney" description="Medical decision authority" />
          <DocumentCard index={4} icon={ClipboardList} name="Living Will" description="End-of-life care preferences" />
          <DocumentCard index={5} icon={Shield} name="HIPAA Authorization" description="Medical records access" />
        </div>
      </Section>

      {/* CTA Section */}
      <Section variant="dark" size="lg">
        <div className="text-center max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-section text-white mb-4"
          >
            Get started for free
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-lg mb-8"
          >
            Complete your estate plan analysis in about 15 minutes. No credit card required.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/intake">
              <button
                className="inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-medium rounded-lg bg-white text-[#1D1D1F] hover:bg-white/90 transition-all duration-200"
              >
                Start Analysis
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* Disclaimer */}
      <div className="py-6 border-b border-[var(--border)]">
        <div className="container">
          <div className="flex items-start gap-4 p-5 rounded-xl bg-[var(--off-white)] border border-[var(--border)]">
            <AlertTriangle className="w-5 h-5 text-[var(--warning)] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">
                <span className="text-[var(--warning)] font-semibold">Disclaimer:</span> This tool provides general information for educational purposes only. It does not constitute legal advice. Generated documents should be reviewed by a licensed attorney in your state.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer
        logo={
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white">
              <Shield className="w-5 h-5 text-[var(--dark-gray)]" />
            </div>
            <span className="text-lg font-semibold text-white">EstatePlan</span>
          </div>
        }
        description="AI-powered estate planning to protect what matters most."
        socialLinks={{
          twitter: "https://twitter.com",
          linkedin: "https://linkedin.com",
        }}
        copyright={`© ${new Date().getFullYear()} EstatePlan. All rights reserved. This is not a law firm.`}
      />
    </div>
  );
}
