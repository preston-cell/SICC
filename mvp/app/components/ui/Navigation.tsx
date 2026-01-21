'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Shield, ChevronDown, FileText, Users, Scale, Home, Calculator, BookOpen } from 'lucide-react';

interface NavSubItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  isNew?: boolean;
}

interface NavSection {
  title: string;
  items: NavSubItem[];
}

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  sections?: NavSection[];
}

const navItems: NavItem[] = [
  {
    label: 'Services',
    href: '/services',
    hasDropdown: true,
    sections: [
      {
        title: 'Document Analysis',
        items: [
          { label: 'Will Analysis', href: '/services/will-analysis', icon: FileText, description: 'Review and analyze your existing will', isNew: true },
          { label: 'Trust Review', href: '/services/trust-review', icon: Scale, description: 'Comprehensive trust document analysis' },
          { label: 'Power of Attorney', href: '/services/poa', icon: Users, description: 'Healthcare & financial POA review' },
        ]
      },
      {
        title: 'Planning Tools',
        items: [
          { label: 'Asset Inventory', href: '/tools/assets', icon: Home, description: 'Track and organize your assets' },
          { label: 'Estate Calculator', href: '/tools/calculator', icon: Calculator, description: 'Estimate estate taxes and fees' },
          { label: 'Learning Center', href: '/learn', icon: BookOpen, description: 'Estate planning education' },
        ]
      }
    ]
  },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Resources', href: '/resources' },
];

export default function Navigation() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(false);

  const handleNavEnter = useCallback((label: string, hasDropdown?: boolean) => {
    if (hasDropdown) {
      setActiveDropdown(label);
    }
  }, []);

  const handleNavLeave = useCallback(() => {
    // Small delay to allow moving to dropdown
    setTimeout(() => {
      if (!isHoveringDropdown) {
        setActiveDropdown(null);
      }
    }, 100);
  }, [isHoveringDropdown]);

  const handleDropdownEnter = useCallback(() => {
    setIsHoveringDropdown(true);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    setIsHoveringDropdown(false);
    setActiveDropdown(null);
  }, []);

  return (
    <>
      {/* Blur overlay - appears when dropdown is open */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/5 backdrop-blur-sm"
            onClick={() => setActiveDropdown(null)}
          />
        )}
      </AnimatePresence>

      {/* Navigation bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16">
        {/* Glass background */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-[rgba(29,29,27,0.08)]" />

        <div className="relative container h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#1D1D1B] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-medium text-[#1D1D1B]">EstatePlan</span>
          </Link>

          {/* Center navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => handleNavEnter(item.label, item.hasDropdown)}
                onMouseLeave={handleNavLeave}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#6B6B5E] hover:text-[#1D1D1B] transition-colors rounded-lg hover:bg-[rgba(29,29,27,0.04)]"
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                  )}
                </Link>

                {/* Mega menu dropdown */}
                <AnimatePresence>
                  {item.hasDropdown && activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-full left-0 mt-2 w-[560px] p-6 bg-white rounded-2xl shadow-[0_20px_60px_rgba(29,29,27,0.15)] border border-[rgba(29,29,27,0.08)]"
                      onMouseEnter={handleDropdownEnter}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <div className="grid grid-cols-2 gap-6">
                        {item.sections?.map((section) => (
                          <div key={section.title}>
                            <div className="text-xs font-medium uppercase tracking-[0.08em] text-[#6B6B5E] mb-3">
                              {section.title}
                            </div>
                            <div className="space-y-1">
                              {section.items.map((subItem) => {
                                const IconComponent = subItem.icon;
                                return (
                                  <Link
                                    key={subItem.label}
                                    href={subItem.href}
                                    className="group flex items-start gap-3 p-3 rounded-xl hover:bg-[#FAF9F7] transition-colors"
                                    onClick={() => setActiveDropdown(null)}
                                  >
                                    <div className="w-10 h-10 rounded-lg bg-[#FAF9F7] group-hover:bg-white flex items-center justify-center transition-colors">
                                      <IconComponent className="w-5 h-5 text-[#1D1D1B]" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-[#1D1D1B]">{subItem.label}</span>
                                        {subItem.isNew && (
                                          <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-[#FF7759] text-white rounded">
                                            New
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-xs text-[#6B6B5E] mt-0.5 block">{subItem.description}</span>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right side - Auth + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/sign-in" className="px-4 py-2 text-sm font-medium text-[#6B6B5E] hover:text-[#1D1D1B] transition-colors">
              Sign In
            </Link>
            <Link href="/intake">
              <button className="px-5 py-2.5 text-sm font-medium rounded-full bg-[#FF7759] text-white hover:bg-[#E85A3C] transition-all duration-200 hover:shadow-lg hover:shadow-[#FF7759]/20">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[rgba(29,29,27,0.04)] transition-colors">
            <div className="flex flex-col gap-1.5">
              <span className="w-5 h-0.5 bg-[#1D1D1B]" />
              <span className="w-5 h-0.5 bg-[#1D1D1B]" />
              <span className="w-5 h-0.5 bg-[#1D1D1B]" />
            </div>
          </button>
        </div>
      </nav>
    </>
  );
}
