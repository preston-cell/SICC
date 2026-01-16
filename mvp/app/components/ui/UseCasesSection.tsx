'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useInView } from 'framer-motion';
import { FileText, Users, Home, Scale } from 'lucide-react';

interface UseCase {
  id: string;
  label: string;
  title: string;
  description: string;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const useCases: UseCase[] = [
  {
    id: 'wills',
    label: 'Wills',
    title: 'Create and analyze your will with AI precision',
    description: 'Our AI reviews your will for completeness, identifies potential issues, and ensures your wishes are clearly expressed and legally sound.',
    features: [
      'Automatic clause analysis',
      'Beneficiary conflict detection',
      'State law compliance check',
      'Plain language translation'
    ],
    icon: FileText,
    color: '#FF7759'
  },
  {
    id: 'trusts',
    label: 'Trusts',
    title: 'Understand and optimize your trust structure',
    description: 'Whether you have a revocable living trust, irrevocable trust, or special needs trust, we analyze every provision and suggest improvements.',
    features: [
      'Trust type identification',
      'Successor trustee review',
      'Distribution schedule analysis',
      'Tax optimization suggestions'
    ],
    icon: Scale,
    color: '#5B8DEF'
  },
  {
    id: 'guardianship',
    label: 'Guardianship',
    title: "Protect your children's future",
    description: 'Ensure your minor children are cared for by people you trust. We help you think through guardianship decisions and document them properly.',
    features: [
      'Guardian nomination review',
      'Backup guardian planning',
      'Special needs considerations',
      'Financial guardian separation'
    ],
    icon: Users,
    color: '#39594D'
  },
  {
    id: 'assets',
    label: 'Assets',
    title: 'Comprehensive asset inventory and planning',
    description: "Track all your assets in one place. Our system identifies what's covered by your estate plan and what might pass outside of it.",
    features: [
      'Real estate tracking',
      'Financial account analysis',
      'Beneficiary designation review',
      'Digital asset planning'
    ],
    icon: Home,
    color: '#D4A574'
  },
];

export default function UseCasesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(useCases[0].id);

  // Track scroll position to update active tab
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Update active tab based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      const index = Math.min(
        Math.floor(value * useCases.length),
        useCases.length - 1
      );
      if (index >= 0 && index < useCases.length) {
        setActiveTab(useCases[index].id);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const activeUseCase = useCases.find(uc => uc.id === activeTab) || useCases[0];

  return (
    <section ref={containerRef} className="relative bg-[#FAF9F7]">
      {/* Section header */}
      <div className="container pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#FF7759] mb-4">
            Comprehensive Coverage
          </div>
          <h2 className="text-[clamp(40px,5vw,56px)] font-normal leading-[1.1] tracking-[-0.02em] text-[#1D1D1B] mb-6">
            Every aspect of your estate,{' '}
            <span className="text-[#FF7759]">analyzed</span>
          </h2>
          <p className="text-lg text-[#6B6B5E] leading-relaxed">
            From wills to trusts, guardianship to asset planning—our AI understands the full picture of your estate.
          </p>
        </motion.div>
      </div>

      {/* Sticky tabs */}
      <div className="sticky top-16 z-30 bg-[#FAF9F7]/95 backdrop-blur-md border-y border-[rgba(29,29,27,0.08)]">
        <div className="container">
          <div className="flex items-center justify-center gap-2 py-4 overflow-x-auto">
            {useCases.map((useCase) => {
              const IconComponent = useCase.icon;
              return (
                <button
                  key={useCase.id}
                  onClick={() => {
                    setActiveTab(useCase.id);
                    document.getElementById(`usecase-${useCase.id}`)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center'
                    });
                  }}
                  className={`
                    relative px-6 py-3 rounded-full text-sm font-medium transition-all duration-300
                    ${activeTab === useCase.id
                      ? 'text-white'
                      : 'text-[#6B6B5E] hover:text-[#1D1D1B] hover:bg-white'
                    }
                  `}
                >
                  {/* Animated background pill */}
                  {activeTab === useCase.id && (
                    <motion.div
                      layoutId="activeTabBg"
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: useCase.color }}
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    {useCase.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrolling content panels */}
      <div className="container py-16">
        {useCases.map((useCase, index) => (
          <UseCasePanel key={useCase.id} useCase={useCase} index={index} />
        ))}
      </div>
    </section>
  );
}

function UseCasePanel({ useCase, index }: { useCase: UseCase; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });
  const IconComponent = useCase.icon;

  return (
    <motion.div
      id={`usecase-${useCase.id}`}
      ref={ref}
      className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-16 lg:py-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0.3 }}
      transition={{ duration: 0.5 }}
    >
      {/* Content - alternates sides */}
      <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
        <motion.div
          initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider mb-4"
            style={{ backgroundColor: `${useCase.color}15`, color: useCase.color }}
          >
            <IconComponent className="w-3.5 h-3.5" />
            {useCase.label}
          </div>

          <h3 className="text-[clamp(28px,3vw,36px)] font-normal leading-[1.2] tracking-[-0.02em] text-[#1D1D1B] mb-4">
            {useCase.title}
          </h3>

          <p className="text-lg text-[#6B6B5E] leading-relaxed mb-8">
            {useCase.description}
          </p>

          <ul className="space-y-3">
            {useCase.features.map((feature, i) => (
              <motion.li
                key={feature}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 text-[#1D1D1B]"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${useCase.color}20` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: useCase.color }} />
                </div>
                {feature}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Image */}
      <motion.div
        className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}
        initial={{ opacity: 0, scale: 0.95, x: index % 2 === 0 ? 24 : -24 }}
        whileInView={{ opacity: 1, scale: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative rounded-2xl overflow-hidden bg-white shadow-[0_8px_40px_rgba(29,29,27,0.1)]">
          {/* Gradient overlay on image */}
          <div
            className="absolute inset-0 z-10 opacity-20"
            style={{
              background: `linear-gradient(135deg, ${useCase.color}30 0%, transparent 50%)`
            }}
          />

          {/* Placeholder for image */}
          <div
            className="aspect-[4/3] flex items-center justify-center"
            style={{ backgroundColor: `${useCase.color}08` }}
          >
            <IconComponent className="w-24 h-24 text-[#1D1D1B]/10" />
          </div>
        </div>

        {/* Floating accent elements */}
        <div
          className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl -z-10"
          style={{ backgroundColor: `${useCase.color}15` }}
        />
        <div
          className="absolute -top-4 -left-4 w-16 h-16 rounded-full -z-10"
          style={{ backgroundColor: `${useCase.color}10` }}
        />
      </motion.div>
    </motion.div>
  );
}
