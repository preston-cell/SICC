'use client';

import { motion } from 'framer-motion';
import { Lock, Eye, Server, FileCheck, Users } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  size: 'large' | 'medium' | 'small';
  gradient: string;
}

const features: Feature[] = [
  {
    title: 'Bank-Level Encryption',
    description: 'Your documents are encrypted at rest and in transit with AES-256 encryption.',
    icon: Lock,
    size: 'large',
    gradient: 'from-[#39594D] to-[#2A3F38]',
  },
  {
    title: 'SOC 2 Type II Certified',
    description: 'Independently audited security controls.',
    icon: FileCheck,
    size: 'small',
    gradient: 'from-[#4A5568] to-[#2D3748]',
  },
  {
    title: 'No Data Training',
    description: 'Your documents are never used to train AI models.',
    icon: Eye,
    size: 'small',
    gradient: 'from-[#FF7759] to-[#E85A3C]',
  },
  {
    title: 'Private Infrastructure',
    description: 'Dedicated processing with no shared resources. Your data stays in your region.',
    icon: Server,
    size: 'medium',
    gradient: 'from-[#5B8DEF] to-[#4A7BD9]',
  },
  {
    title: 'Access Controls',
    description: 'Granular permissions for family members and advisors.',
    icon: Users,
    size: 'medium',
    gradient: 'from-[#D4A574] to-[#C49464]',
  },
];

export default function SecurityBentoGrid() {
  return (
    <section className="py-24" style={{ backgroundColor: '#1D1D1B' }}>
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2
            className="text-[clamp(40px,5vw,56px)] font-normal leading-[1.1] tracking-[-0.02em] mb-6"
            style={{ color: '#FFFFFF' }}
          >
            Private. Secure.{' '}
            <span style={{ color: '#FF7759' }}>Protected.</span>
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Your estate documents contain your most sensitive information. We treat them that way.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className={`
                  relative overflow-hidden rounded-2xl
                  ${feature.size === 'large' ? 'sm:col-span-2 sm:row-span-2' : ''}
                  ${feature.size === 'medium' ? 'sm:col-span-2 lg:col-span-2' : ''}
                  ${feature.size === 'small' ? 'col-span-1' : ''}
                `}
              >
                <motion.div
                  className={`
                    h-full p-8 bg-gradient-to-br ${feature.gradient}
                    ${feature.size === 'large' ? 'min-h-[320px]' : 'min-h-[160px]'}
                  `}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                  >
                    <span style={{ color: '#FFFFFF' }}>
                      <IconComponent className="w-6 h-6" />
                    </span>
                  </div>

                  {/* Content */}
                  <h3
                    className={`font-medium mb-2 ${feature.size === 'large' ? 'text-2xl' : 'text-lg'}`}
                    style={{ color: '#FFFFFF' }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={feature.size === 'small' ? 'text-sm' : ''}
                    style={{ color: 'rgba(255,255,255,0.8)' }}
                  >
                    {feature.description}
                  </p>

                  {/* Animated background pattern */}
                  <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                      }}
                      animate={{
                        backgroundPosition: ['0px 0px', '24px 24px'],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
