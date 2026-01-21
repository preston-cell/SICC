"use client";

import { HTMLAttributes } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Tag } from "./index";

interface BlogCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  excerpt: string;
  image?: string;
  author: string;
  date: string;
  tags: string[];
  href: string;
  featured?: boolean;
}

export default function BlogCard({
  title,
  excerpt,
  image,
  author,
  date,
  tags,
  href,
  featured = false,
  className = "",
  ...props
}: BlogCardProps) {
  if (featured) {
    return (
      <Link href={href}>
        <div
          className={`group grid md:grid-cols-2 gap-8 p-6 rounded-2xl bg-white border border-[var(--border-light)] hover:shadow-[var(--shadow-hover)] transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
          {...props}
        >
          <div className="aspect-[16/10] rounded-xl bg-[var(--cream)] overflow-hidden">
            {image ? (
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)]">
                Featured Image
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] mb-3">
              <span>{author}</span>
              <span>•</span>
              <span>{date}</span>
            </div>
            <h3 className="text-2xl font-normal text-[var(--text-primary)] mb-3 group-hover:text-[var(--coral)] transition-colors duration-[250ms]">
              {title}
            </h3>
            <p className="text-[var(--text-secondary)] mb-4 line-clamp-2">{excerpt}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <Tag key={tag} variant="muted" size="sm">
                  {tag}
                </Tag>
              ))}
            </div>
            <span className="inline-flex items-center gap-2 text-[var(--coral)] font-medium group-hover:gap-3 transition-all duration-[250ms]">
              Read full article
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href}>
      <div
        className={`group flex flex-col h-full ${className}`}
        {...props}
      >
        <div className="aspect-[16/10] rounded-xl bg-[var(--cream)] overflow-hidden mb-4">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)]">
              Article Image
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] mb-2">
          <span>{author}</span>
          <span>•</span>
          <span>{date}</span>
        </div>
        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2 group-hover:text-[var(--coral)] transition-colors duration-[250ms] line-clamp-2">
          {title}
        </h3>
        <p className="text-[var(--text-secondary)] text-sm mb-3 line-clamp-2 flex-1">{excerpt}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.slice(0, 2).map((tag) => (
            <Tag key={tag} variant="muted" size="sm">
              {tag}
            </Tag>
          ))}
        </div>
        <span className="inline-flex items-center gap-2 text-[var(--coral)] font-medium text-sm group-hover:gap-3 transition-all duration-[250ms]">
          Read article
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
