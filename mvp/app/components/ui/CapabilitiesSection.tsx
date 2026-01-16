'use client';

import { motion } from 'framer-motion';
import { Search, FileEdit, Zap } from 'lucide-react';

interface Capability {
  label: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}

const capabilities: Capability[] = [
  {
    label: 'INTELLIGENT ANALYSIS',
    title: 'Analyze',
    description: "Upload your documents and get instant, comprehensive analysis powered by AI trained on estate law.",
    icon: Search,
    gradient: 'from-[#FF7759]/20 to-transparent'
  },
  {
    label: 'DOCUMENT GENERATION',
    title: 'Create',
    description: "Generate draft documents tailored to your state's requirements and your specific situation.",
    icon: FileEdit,
    gradient: 'from-[#5B8DEF]/20 to-transparent'
  },
  {
    label: 'CONTINUOUS MONITORING',
    title: 'Protect',
    description: 'Stay informed of law changes that affect your plan, with automatic alerts and recommendations.',
    icon: Zap,
    gradient: 'from-[#39594D]/20 to-transparent'
  },
];

export default function CapabilitiesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#FF7759] mb-4">
            How It Works
          </div>
          <h2 className="text-[clamp(40px,5vw,56px)] font-normal leading-[1.1] tracking-[-0.02em] text-[#1D1D1B]">
            Accelerate your estate planning
          </h2>
        </motion.div>

        {/* Capability cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {capabilities.map((cap, index) => {
            const IconComponent = cap.icon;
            return (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <motion.div
                  className="group relative h-full bg-[#FAF9F7] rounded-2xl overflow-hidden cursor-pointer"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Image area */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${cap.gradient} z-10 transition-opacity duration-300 group-hover:opacity-70`} />

                    {/* Placeholder image */}
                    <motion.div
                      className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1D1D1B]/5 to-transparent"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <IconComponent className="w-16 h-16 text-[#1D1D1B]/20" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6B6B5E] mb-2">
                      {cap.label}
                    </div>
                    <h3 className="text-2xl font-normal text-[#1D1D1B] mb-2">
                      {cap.title}
                    </h3>
                    <p className="text-sm text-[#6B6B5E] leading-relaxed">
                      {cap.description}
                    </p>
                  </div>

                  {/* Hover border effect */}
                  <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[rgba(29,29,27,0.1)] transition-colors duration-300" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
