'use client';

import { motion } from 'framer-motion';

const trustIndicators = [
  { name: 'Forbes' },
  { name: 'Wall Street Journal' },
  { name: 'New York Times' },
  { name: 'TechCrunch' },
  { name: 'Bloomberg' },
  { name: 'CNBC' },
  { name: 'Reuters' },
  { name: 'AP News' },
];

export default function LogoMarquee() {
  return (
    <section className="py-12 border-y border-[rgba(29,29,27,0.06)] bg-white overflow-hidden">
      <div className="container mb-8">
        <p className="text-center text-sm text-[#6B6B5E]">
          Featured in leading publications
        </p>
      </div>

      {/* Marquee container with mask */}
      <div
        className="relative"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <motion.div
          className="flex gap-16 items-center"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 30,
              ease: 'linear',
            },
          }}
        >
          {/* Double the logos for seamless loop */}
          {[...trustIndicators, ...trustIndicators].map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex-shrink-0 h-8 w-32 flex items-center justify-center opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
            >
              {/* Placeholder - replace with actual logos */}
              <span className="text-sm font-medium text-[#1D1D1B] whitespace-nowrap">
                {item.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
