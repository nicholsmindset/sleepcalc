import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { getAllPosts, type BlogPostMeta } from "@/lib/blog";

interface RelatedReadingProps {
  /** Blog post slugs to surface, in display order. Missing slugs are skipped. */
  slugs: string[];
  title?: string;
}

/**
 * Surfaces topically relevant blog posts on programmatic pages so that
 * authority flows between the thin tool pages and the in-depth articles.
 */
export function RelatedReading({
  slugs,
  title = "Related Reading",
}: RelatedReadingProps) {
  const bySlug = new Map(getAllPosts().map((p) => [p.slug, p]));
  const posts = slugs
    .map((slug) => bySlug.get(slug))
    .filter((p): p is BlogPostMeta => Boolean(p));

  if (posts.length === 0) return null;

  return (
    <section className="py-12">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-[#c6bfff]" />
        <h2 className="font-headline text-2xl font-bold text-on-surface">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="glass-card rounded-2xl p-5 hover:bg-surface-container-high/50 transition-all group"
          >
            <p className="text-[10px] uppercase tracking-wider text-on-surface-variant/70 mb-1.5">
              {post.category} · {post.readingTime} min read
            </p>
            <h3 className="font-headline font-bold text-sm text-on-surface mb-1.5 group-hover:text-[#46eae5] transition-colors flex items-start gap-1.5">
              <span>{post.title}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-on-surface-variant line-clamp-2">
              {post.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
