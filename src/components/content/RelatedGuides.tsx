import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";
import type { GuideLink } from "@/lib/blog-guides";

interface RelatedGuidesProps {
  /** Programmatic pages/hubs relevant to this article. */
  guides: GuideLink[];
  title?: string;
}

/**
 * Surfaces topically relevant programmatic pages (condition / age / profession
 * / bedtime guides) from within a blog post, passing editorial link equity from
 * long-form articles down into the programmatic cluster.
 */
export function RelatedGuides({
  guides,
  title = "Related Sleep Guides",
}: RelatedGuidesProps) {
  if (!guides || guides.length === 0) return null;

  return (
    <section className="py-8 not-prose">
      <div className="flex items-center gap-2 mb-4">
        <Compass className="w-5 h-5 text-[#46eae5]" />
        <h2 className="font-headline text-xl font-bold text-on-surface">
          {title}
        </h2>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {guides.map((guide) => (
          <li key={guide.href}>
            <Link
              href={guide.href}
              className="flex items-center justify-between gap-2 glass-card rounded-xl px-4 py-3 text-sm text-on-surface hover:text-[#46eae5] transition-colors group"
            >
              <span>{guide.label}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
