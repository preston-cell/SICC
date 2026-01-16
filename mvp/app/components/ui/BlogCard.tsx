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
          className={`group grid md:grid-cols-2 gap-8 p-6 rounded-2xl bg-white border border-[var(--border)] hover:shadow-lg transition-all duration-200 ${className}`}
          {...props}
        >
          <div className="aspect-[16/10] rounded-xl bg-[var(--off-white)] overflow-hidden">
            {image ? (
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--medium-gray)]">
                Featured Image
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 text-sm text-[var(--medium-gray)] mb-3">
              <span>{author}</span>
              <span>•</span>
              <span>{date}</span>
            </div>
            <h3 className="text-2xl font-semibold text-[var(--foreground)] mb-3 group-hover:text-[var(--accent-purple)] transition-colors">
              {title}
            </h3>
            <p className="text-[var(--foreground-muted)] mb-4 line-clamp-2">{excerpt}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <Tag key={tag} variant="neutral" size="sm">
                  {tag}
                </Tag>
              ))}
            </div>
            <span className="inline-flex items-center gap-2 text-[var(--accent-purple)] font-medium group-hover:gap-3 transition-all">
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
        <div className="aspect-[16/10] rounded-xl bg-[var(--off-white)] overflow-hidden mb-4">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--medium-gray)]">
              Article Image
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--medium-gray)] mb-2">
          <span>{author}</span>
          <span>•</span>
          <span>{date}</span>
        </div>
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2 group-hover:text-[var(--accent-purple)] transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-[var(--foreground-muted)] text-sm mb-3 line-clamp-2 flex-1">{excerpt}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.slice(0, 2).map((tag) => (
            <Tag key={tag} variant="neutral" size="sm">
              {tag}
            </Tag>
          ))}
        </div>
        <span className="inline-flex items-center gap-2 text-[var(--accent-purple)] font-medium text-sm group-hover:gap-3 transition-all">
          Read article
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
