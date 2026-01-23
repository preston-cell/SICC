'use client';

import { motion } from 'framer-motion';
import { Heart, Clock, Shield, Lightbulb } from 'lucide-react';

const reasons = [
  {
    icon: Heart,
    title: "Protect what matters most",
    description: "Ensure your family is taken care of, exactly the way you want.",
  },
  {
    icon: Clock,
    title: "Get started in minutes",
    description: "No appointments needed. Answer questions at your own pace.",
  },
  {
    icon: Shield,
    title: "Understand your gaps",
    description: "See what's missing before it becomes a problem.",
  },
  {
    icon: Lightbulb,
    title: "Demystify the process",
    description: "Plain-language explanations of complex legal concepts.",
  },
];

export default function TestimonialSection() {
  return (
    <section className="py-24 bg-[#FAF9F7]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.5, 0, 0.35, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-[clamp(32px,4vw,48px)] font-normal leading-[1.1] tracking-[-0.02em] text-[#1D1D1B] mb-4">
            Why families choose us
          </h2>
          <p className="text-lg text-[#6B6B5E]">
            Estate planning doesn&apos;t have to be overwhelming.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => {
            const IconComponent = reason.icon;
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.5, 0, 0.35, 1]
                }}
                className="group text-center p-6 rounded-2xl hover:bg-white transition-all duration-300"
              >
                <motion.div
                  className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-[#FF7759]/10"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.3 }}
                >
                  <IconComponent className="w-6 h-6 text-[#FF7759]" />
                </motion.div>
                <h3 className="text-lg font-medium text-[#1D1D1B] mb-2">
                  {reason.title}
                </h3>
                <p className="text-sm text-[#6B6B5E] leading-relaxed">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
