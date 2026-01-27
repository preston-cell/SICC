"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRecentEstatePlans } from "./hooks/usePrismaQueries";
import { SignInButton, SignUpButton, UserButton, useUser } from "./components/ClerkComponents";
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
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
import { Button } from "./components/ui";
import Section, { SectionHeader } from "./components/ui/Section";
import Footer from "./components/ui/Footer";
import Navigation from "./components/ui/Navigation";
import TrustIndicators from "./components/ui/TrustIndicators";
import CapabilitiesSection from "./components/ui/CapabilitiesSection";
import UseCasesSection from "./components/ui/UseCasesSection";
import SecurityBentoGrid from "./components/ui/SecurityBentoGrid";
import TestimonialSection from "./components/ui/TestimonialSection";

// Colors - hardcoded for reliability
const COLORS = {
  coral: "#FF7759",
  coralDark: "#E85A3C",
  coralLight: "#FFB5A3",
  volcanicBlack: "#1D1D1B",
  mushroomGrey: "#6B6B5E",
  cream: "#FAF9F7",
  lavender: "#D4C8FF",
  sage: "#A8C5B5",
};

// Superpower easing
const SUPERPOWER_EASE = [0.5, 0, 0.35, 1] as const;

// Scroll Progress Indicator
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-[#FF7759] origin-left z-[100]"
      style={{ scaleX }}
    />
  );
}

// 3D Card Tilt Effect
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-7, 7]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Magnetic Button Effect
function MagneticButton({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Section Fade Transitions
function FadeSection({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { margin: "-20% 0px -20% 0px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0.3 }}
      animate={{ opacity: isInView ? 1 : 0.3 }}
      transition={{ duration: 0.6, ease: SUPERPOWER_EASE }}
      className={className}
    >
      {children}
    </motion.section>
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
    let animationFrameId: number;
    const duration = 2000;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [end, isInView]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// Feature card - Cohere style with 3D tilt
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
      transition={{ duration: 0.4, delay: index * 0.08, ease: SUPERPOWER_EASE }}
    >
      <TiltCard className="h-full">
        <div className="card-item group p-7 rounded-2xl bg-white border border-[rgba(29,29,27,0.08)] hover:border-[#FF7759] hover:shadow-xl h-full">
          <motion.div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
            style={{ backgroundColor: "rgba(255, 119, 89, 0.1)" }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <span style={{ color: COLORS.coral }}><Icon className="w-6 h-6" /></span>
          </motion.div>
          <h4 className="text-lg font-medium mb-2" style={{ color: COLORS.volcanicBlack }}>{title}</h4>
          <p className="leading-relaxed" style={{ color: COLORS.mushroomGrey }}>{description}</p>
        </div>
      </TiltCard>
    </motion.div>
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
      transition={{ duration: 0.4, delay: number * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-5"
    >
      <div className="flex flex-col items-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm text-white"
          style={{ backgroundColor: COLORS.volcanicBlack }}
        >
          {number}
        </div>
        {!isLast && (
          <div className="w-px flex-1 mt-3" style={{ backgroundColor: "rgba(29,29,27,0.12)" }} />
        )}
      </div>
      <div className="flex-1 pb-8">
        <h4 className="text-base font-medium mb-1.5" style={{ color: COLORS.volcanicBlack }}>{title}</h4>
        <p style={{ color: COLORS.mushroomGrey }}>{description}</p>
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3, delay: index * 0.05, ease: [0.5, 0, 0.35, 1] }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="card-item group p-5 rounded-xl bg-white border border-[rgba(29,29,27,0.08)] hover:border-[#FF7759] hover:shadow-lg cursor-pointer"
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-[250ms] group-hover:bg-[rgba(255,119,89,0.1)]"
        style={{ backgroundColor: COLORS.cream }}
      >
        <Icon className="w-5 h-5 transition-colors duration-[250ms] text-[#6B6B5E] group-hover:text-[#FF7759]" />
      </div>
      <h4 className="font-medium mb-1" style={{ color: COLORS.volcanicBlack }}>{name}</h4>
      <p className="text-sm" style={{ color: COLORS.mushroomGrey }}>{description}</p>
    </motion.div>
  );
}

// Estate plan card
function EstatePlanCard({
  plan,
}: {
  plan: {
    id: string;
    name?: string;
    status: string;
    updatedAt: string | number;
    stateOfResidence?: string;
  };
}) {
  const statusConfig: Record<string, { color: string; bgColor: string; label: string }> = {
    draft: { color: COLORS.mushroomGrey, bgColor: COLORS.cream, label: "Draft" },
    intake_in_progress: { color: "#4A7DC9", bgColor: "rgba(74, 125, 201, 0.12)", label: "In Progress" },
    intake_complete: { color: "#D4A04A", bgColor: "rgba(212, 160, 74, 0.12)", label: "Ready for Analysis" },
    analysis_complete: { color: "#4A9D6B", bgColor: "rgba(74, 157, 107, 0.12)", label: "Analyzed" },
    documents_generated: { color: COLORS.coral, bgColor: "rgba(255, 119, 89, 0.12)", label: "Documents Ready" },
    complete: { color: "#4A9D6B", bgColor: "rgba(74, 157, 107, 0.12)", label: "Complete" },
  };

  const config = statusConfig[plan.status] || statusConfig.draft;

  return (
    <Link
      href={
        plan.status === "draft" || plan.status === "intake_in_progress"
          ? `/intake?planId=${plan.id}`
          : `/analysis/${plan.id}`
      }
    >
      <div className="group p-5 rounded-xl bg-white border border-[rgba(29,29,27,0.08)] hover:border-[#FF7759] hover:shadow-lg transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-medium group-hover:text-[#FF7759] transition-colors" style={{ color: COLORS.volcanicBlack }}>
              {plan.name || "My Estate Plan"}
            </h4>
            {plan.stateOfResidence && (
              <p className="text-sm" style={{ color: COLORS.mushroomGrey }}>{plan.stateOfResidence}</p>
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
          <span style={{ color: COLORS.mushroomGrey }}>
            Updated {new Date(plan.updatedAt).toLocaleDateString()}
          </span>
          <span className="font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-[250ms]" style={{ color: COLORS.coral }}>
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
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn, isLoaded, user } = useUser();

  // Parallax values for hero blobs
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -100]); // Slow
  const y2 = useTransform(scrollY, [0, 500], [0, -150]); // Medium
  const y3 = useTransform(scrollY, [0, 500], [0, -50]);  // Fast
  const y4 = useTransform(scrollY, [0, 500], [0, -80]);  // Medium-slow

  useEffect(() => {
    const storedSessionId = localStorage.getItem("estatePlanSessionId");
    if (storedSessionId) setSessionId(storedSessionId);
  }, []);

  // Use SWR hook for recent plans - handles both authenticated and session-based users
  const { data: recentPlans } = useRecentEstatePlans(sessionId || undefined, 5);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{ color: COLORS.volcanicBlack }}>
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Navigation - Cohere style with shrink effect */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? 'h-14 bg-white/95 shadow-sm border-[rgba(29,29,27,0.12)]'
            : 'h-16 bg-white/80 border-[rgba(29,29,27,0.08)]'
        } backdrop-blur-md`}
      >
        <div className="container h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: COLORS.volcanicBlack }}
            >
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-medium" style={{ color: COLORS.volcanicBlack }}>EstatePlan</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {recentPlans && recentPlans.length > 0 && (
              <button
                onClick={() => setShowDashboard(!showDashboard)}
                className="font-medium transition-colors duration-[150ms] hover:text-[#1D1D1B]"
                style={{ color: COLORS.mushroomGrey }}
              >
                My Plans
              </button>
            )}
            <a
              href="#features"
              className="font-medium transition-colors duration-[150ms] hover:text-[#1D1D1B]"
              style={{ color: COLORS.mushroomGrey }}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="font-medium transition-colors duration-[150ms] hover:text-[#1D1D1B]"
              style={{ color: COLORS.mushroomGrey }}
            >
              How It Works
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isLoaded && !isSignedIn && (
              <>
                <SignInButton mode="modal">
                  <button
                    className="font-medium transition-colors duration-[150ms] hover:text-[#1D1D1B]"
                    style={{ color: COLORS.mushroomGrey }}
                  >
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    className="px-5 py-2.5 text-sm font-medium rounded-full text-white transition-all duration-200 hover:shadow-md"
                    style={{ backgroundColor: COLORS.coral }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.coralDark}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.coral}
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
                    className="px-5 py-2.5 text-sm font-medium rounded-full text-white transition-all duration-200 hover:shadow-md"
                    style={{ backgroundColor: COLORS.coral }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.coralDark}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.coral}
                  >
                    Get Started
                  </button>
                </Link>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{ elements: { avatarBox: "w-8 h-8" } }}
                />
              </>
            )}
            {!isLoaded && (
              <Link href="/intake">
                <button
                  className="px-5 py-2.5 text-sm font-medium rounded-full text-white transition-all duration-200 hover:shadow-md"
                  style={{ backgroundColor: COLORS.coral }}
                >
                  Get Started
                </button>
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
            <div className="pt-4 border-t border-[rgba(29,29,27,0.12)]">
              <Link href="/intake" onClick={() => setMobileMenuOpen(false)}>
                <button
                  className="w-full px-6 py-3.5 text-base font-medium rounded-full text-white"
                  style={{ backgroundColor: COLORS.coral }}
                >
                  Get Started
                </button>
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
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-16 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-b border-[rgba(29,29,27,0.12)] shadow-xl"
        >
          <div className="container py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Your Estate Plans</h3>
              <Link href="/intake">
                <span
                  className="font-medium flex items-center gap-1.5 hover:gap-2 transition-all duration-[250ms]"
                  style={{ color: COLORS.coral }}
                >
                  <Plus className="w-4 h-4" />
                  New Plan
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentPlans.map((plan: { id: string; name?: string; status: string; updatedAt: string | number; stateOfResidence?: string }) => (
                <EstatePlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Spacer for fixed nav */}
      <div className="h-16" />

      {/* Hero Section - Cohere style with visible atmospheric gradient */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background gradients - VISIBLE with animated flow */}
        <div className="absolute inset-0 z-0 animate-gradient-flow" style={{ background: 'linear-gradient(-45deg, rgba(255, 119, 89, 0.05), rgba(212, 200, 255, 0.08), rgba(168, 197, 181, 0.06), rgba(255, 119, 89, 0.05))', backgroundSize: '400% 400%' }}>
          {/* Coral gradient on right side */}
          <div
            className="absolute top-0 right-0 w-[70%] h-full"
            style={{
              background: 'radial-gradient(ellipse 80% 70% at 70% 30%, rgba(255, 119, 89, 0.18) 0%, rgba(255, 119, 89, 0.08) 40%, transparent 70%)',
            }}
          />
          {/* Secondary lavender gradient */}
          <div
            className="absolute top-[20%] right-[15%] w-[50%] h-[70%]"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(212, 200, 255, 0.25) 0%, transparent 60%)',
            }}
          />
          {/* Sage accent */}
          <div
            className="absolute bottom-0 right-[5%] w-[40%] h-[50%]"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(168, 197, 181, 0.2) 0%, transparent 60%)',
            }}
          />
        </div>

        {/* Animated blobs with parallax - increased opacity */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Coral blob - top right - slowest parallax */}
          <motion.div
            className="absolute top-[-5%] right-[-5%] w-[450px] h-[450px] rounded-full animate-blob"
            style={{
              y: y1,
              background: 'radial-gradient(circle, rgba(255, 119, 89, 0.35) 0%, rgba(255, 119, 89, 0.15) 50%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
          {/* Lavender blob - medium parallax */}
          <motion.div
            className="absolute top-[25%] right-[15%] w-[400px] h-[400px] rounded-full animate-blob"
            style={{
              y: y2,
              background: 'radial-gradient(circle, rgba(212, 200, 255, 0.4) 0%, rgba(212, 200, 255, 0.15) 50%, transparent 70%)',
              filter: 'blur(50px)',
              animationDelay: '2s',
            }}
          />
          {/* Sage green blob - fast parallax */}
          <motion.div
            className="absolute bottom-[10%] right-[8%] w-[350px] h-[350px] rounded-full animate-blob"
            style={{
              y: y3,
              background: 'radial-gradient(circle, rgba(168, 197, 181, 0.35) 0%, transparent 60%)',
              filter: 'blur(40px)',
              animationDelay: '4s',
            }}
          />
          {/* Small coral accent blob - medium-slow parallax */}
          <motion.div
            className="absolute top-[50%] right-[30%] w-[200px] h-[200px] rounded-full animate-blob"
            style={{
              y: y4,
              background: 'radial-gradient(circle, rgba(255, 119, 89, 0.25) 0%, transparent 60%)',
              filter: 'blur(30px)',
              animationDelay: '1s',
            }}
          />
        </div>

        <div className="container relative z-10 py-16 md:py-24">
          <div className="max-w-3xl">
            {/* Label - Coral outline pill */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium"
              style={{
                border: `1px solid ${COLORS.coral}`,
                color: COLORS.coral,
                backgroundColor: 'transparent',
              }}
            >
              Simple. Private. AI-Assisted.
            </motion.div>

            {/* Headline - Family-focused with CORAL accent - Word-by-word reveal */}
            <h1
              className="text-[clamp(40px,5vw,64px)] font-normal leading-[1.1] tracking-[-0.025em] mb-6"
              style={{ color: COLORS.volcanicBlack }}
            >
              {/* First line - word by word animation */}
              <span className="block">
                {"Protect what matters most,".split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: SUPERPOWER_EASE }}
                    className="inline-block mr-[0.25em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              {/* Second line - coral accent with staggered delay */}
              <span className="block" style={{ color: COLORS.coral }}>
                {"with clarity and confidence".split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1, ease: SUPERPOWER_EASE }}
                    className="inline-block mr-[0.25em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </h1>

            {/* Subheadline - Approachable messaging */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg leading-relaxed mb-8 max-w-xl"
              style={{ color: COLORS.mushroomGrey }}
            >
              Estate planning doesn&apos;t have to be overwhelming. Answer a few simple questions, see exactly what you need, and take control of your family&apos;s future.
            </motion.p>

            {/* CTAs - Single focused primary CTA + soft link */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9, ease: SUPERPOWER_EASE }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              {/* PRIMARY BUTTON - CORAL with pulse animation + magnetic effect */}
              <MagneticButton>
                <Link href="/intake">
                  <motion.button
                    className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium rounded-full text-white overflow-hidden w-full sm:w-auto animate-cta-pulse"
                    style={{ backgroundColor: COLORS.coral }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.coralDark}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.coral}
                  >
                    <span className="relative z-10">Start Your Free Analysis</span>
                    <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </Link>
              </MagneticButton>

              {/* SOFT ANCHOR LINK - not competing CTA */}
              <a
                href="#how-it-works"
                className="text-sm font-medium py-4 transition-colors duration-150"
                style={{ color: COLORS.mushroomGrey }}
                onMouseEnter={(e) => e.currentTarget.style.color = COLORS.volcanicBlack}
                onMouseLeave={(e) => e.currentTarget.style.color = COLORS.mushroomGrey}
              >
                See how it works
              </a>
            </motion.div>
          </div>

          {/* Stats - Truthful, verifiable claims */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: 50, suffix: "", label: "States supported" },
              { value: 6, suffix: "", label: "Core documents" },
              { value: 15, suffix: " min", label: "To get started" },
              { displayValue: "Free", label: "To analyze" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-normal" style={{ color: COLORS.volcanicBlack }}>
                  {'displayValue' in stat ? stat.displayValue : <AnimatedCounter end={stat.value} suffix={stat.suffix} />}
                </div>
                <div className="text-sm mt-1" style={{ color: COLORS.mushroomGrey }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators - Truthful value props */}
      <TrustIndicators />

      {/* Capabilities Section - How It Works (Analyze/Create/Protect) */}
      <CapabilitiesSection />

      {/* Features Section */}
      <Section id="features" variant="cream" size="lg">
        <SectionHeader
          label="Features"
          title="Everything you need"
          description="A complete toolkit for understanding and improving your estate plan."
        />

        <div className="card-group grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl border border-[rgba(29,29,27,0.08)] p-8 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(255, 119, 89, 0.1)" }}
              >
                <CheckCircle2 className="w-6 h-6" style={{ color: COLORS.coral }} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider font-medium" style={{ color: COLORS.mushroomGrey }}>Analysis Complete</div>
                <div className="text-xl font-normal" style={{ color: COLORS.volcanicBlack }}>Score: 72/100</div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: COLORS.mushroomGrey }}>Documents reviewed</span>
                <span className="font-medium" style={{ color: "#4A9D6B" }}>4 of 6</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.cream }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: COLORS.coral }}
                  initial={{ width: 0 }}
                  whileInView={{ width: "66%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div
                className="flex items-center gap-3 p-4 rounded-xl border"
                style={{
                  backgroundColor: "rgba(212, 160, 74, 0.12)",
                  borderColor: "rgba(212, 160, 74, 0.2)"
                }}
              >
                <AlertTriangle className="w-5 h-5" style={{ color: "#D4A04A" }} />
                <span className="text-sm font-medium" style={{ color: "#D4A04A" }}>Healthcare Directive missing</span>
              </div>
              <div
                className="flex items-center gap-3 p-4 rounded-xl border"
                style={{
                  backgroundColor: "rgba(74, 157, 107, 0.12)",
                  borderColor: "rgba(74, 157, 107, 0.2)"
                }}
              >
                <Check className="w-5 h-5" style={{ color: "#4A9D6B" }} />
                <span className="text-sm font-medium" style={{ color: "#4A9D6B" }}>Will is current and valid</span>
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

        <div className="card-group grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DocumentCard index={0} icon={FileText} name="Last Will & Testament" description="Instructions for asset distribution" />
          <DocumentCard index={1} icon={Building2} name="Living Trust" description="Avoid probate, ensure smooth transfer" />
          <DocumentCard index={2} icon={CreditCard} name="Financial Power of Attorney" description="Authorize financial management" />
          <DocumentCard index={3} icon={Heart} name="Healthcare Power of Attorney" description="Medical decision authority" />
          <DocumentCard index={4} icon={ClipboardList} name="Living Will" description="End-of-life care preferences" />
          <DocumentCard index={5} icon={Shield} name="HIPAA Authorization" description="Medical records access" />
        </div>
      </Section>

      {/* Use Cases Section - Scroll-triggered animations */}
      <UseCasesSection />

      {/* Security Bento Grid */}
      <SecurityBentoGrid />

      {/* Testimonials */}
      <TestimonialSection />

      {/* Soft Closing Section - No aggressive CTA */}
      <Section variant="cream" size="md">
        <div className="text-center max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ease: [0.5, 0, 0.35, 1] }}
            className="text-lg"
            style={{ color: COLORS.mushroomGrey }}
          >
            Ready when you are. No pressure, no sales calls.
          </motion.p>
        </div>
      </Section>

      {/* Disclaimer */}
      <div className="py-6 border-b border-[rgba(29,29,27,0.12)]">
        <div className="container">
          <div
            className="flex items-start gap-4 p-5 rounded-xl border"
            style={{
              backgroundColor: COLORS.cream,
              borderColor: "rgba(29,29,27,0.08)"
            }}
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#D4A04A" }} />
            <div>
              <p className="text-sm" style={{ color: COLORS.mushroomGrey }}>
                <span className="font-medium" style={{ color: "#D4A04A" }}>Disclaimer:</span> This tool provides general information for educational purposes only. It does not constitute legal advice. Generated documents should be reviewed by a licensed attorney in your state.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer
        logo={
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white">
              <Shield className="w-5 h-5" style={{ color: COLORS.volcanicBlack }} />
            </div>
            <span className="text-lg font-medium text-white">EstatePlan</span>
          </div>
        }
        description="AI-powered estate planning to protect what matters most."
        socialLinks={{
          twitter: "https://twitter.com",
          linkedin: "https://linkedin.com",
        }}
        copyright={`${new Date().getFullYear()} EstatePlan. All rights reserved. This is not a law firm.`}
      />
    </div>
  );
}
