"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Twitter, Linkedin } from "lucide-react";

interface FooterProps {
  logo: ReactNode;
  description?: string;
  links?: {
    title: string;
    items: { label: string; href: string }[];
  }[];
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
  };
  copyright?: string;
}

export default function Footer({
  logo,
  description,
  links,
  socialLinks,
  copyright,
}: FooterProps) {
  return (
    <footer className="bg-[var(--volcanic-black)] text-white py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            {logo}
            {description && (
              <p className="mt-4 text-white/60 max-w-sm leading-relaxed">{description}</p>
            )}
            {socialLinks && (
              <div className="flex gap-3 mt-6">
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>
          {links?.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-medium uppercase tracking-wider text-white/40 mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-white/70 hover:text-white transition-colors duration-[150ms]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {copyright && (
          <div className="pt-8 border-t border-white/10 text-white/40 text-sm">
            {copyright}
          </div>
        )}
      </div>
    </footer>
  );
}
