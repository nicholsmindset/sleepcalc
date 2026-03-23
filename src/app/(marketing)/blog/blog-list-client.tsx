'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BlogPostMeta } from '@/lib/blog';

interface BlogListClientProps {
  posts: BlogPostMeta[];
  categories: string[];
}

export function BlogListClient({ posts, categories }: BlogListClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? posts.filter((p) => p.category === activeCategory)
    : posts;

  return (
    <>
      {/* Category filter */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
              !activeCategory
                ? 'bg-primary text-white'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface',
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                activeCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface',
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Post grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-on-surface-variant py-12">No posts yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="glass-card rounded-2xl p-6 hover:bg-surface-container-high/50 transition-all group"
            >
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                {post.category}
              </span>
              <h2 className="text-lg font-bold text-on-surface font-headline mt-2 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h2>
              <p className="text-sm text-on-surface-variant line-clamp-3 mb-4">
                {post.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readingTime} min read
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
