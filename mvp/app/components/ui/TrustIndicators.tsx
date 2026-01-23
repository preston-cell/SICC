'use client';

import { motion } from 'framer-motion';
import { Shield, Clock, FileText, Lock } from 'lucide-react';

const indicators = [
  { icon: Shield, text: 'Bank-level encryption' },
  { icon: Clock, text: '~15 minutes to start' },
  { icon: FileText, text: 'State-specific guidance' },
  { icon: Lock, text: 'Your data stays private' },
];

export default function TrustIndicators() {
  return (
    <section className="py-8 border-y border-[rgba(29,29,27,0.06)] bg-white">
      <div className="container">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {indicators.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.5, 0, 0.35, 1]
                }}
                className="flex items-center gap-2.5 text-sm text-[#6B6B5E]"
              >
                <IconComponent className="w-4 h-4 text-[#FF7759]" />
                <span>{item.text}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
