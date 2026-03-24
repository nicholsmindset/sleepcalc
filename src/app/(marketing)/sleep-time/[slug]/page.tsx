import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FAQ } from "@/components/content/FAQ";
import { RelatedTools } from "@/components/content/RelatedTools";
import { MedicalDisclaimer } from "@/components/content/MedicalDisclaimer";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { AdSlot } from "@/components/layout/AdSlot";
import BedtimeCalculator from "@/components/calculators/BedtimeCalculator";
import sleepTimesData from "@/content/data/sleep-times.json";

/* ─── Data Shape ─── */

interface PreCalculated {
  cycles: number;
  bedtime?: string;
  wakeTime?: string;
  totalSleep: string;
  quality: string;
}

interface SleepTimeContent {
  intro: string;
  whyThisTime: string;
  tips: string;
  science: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface SleepTimeEntry {
  slug: string;
  type: "wake" | "bedtime";
  time: string;
  hour24: number;
  minute: number;
  title: string;
  h1: string;
  metaDescription: string;
  preCalculated: PreCalculated[];
  content: SleepTimeContent;
  faq: FAQItem[];
  relatedSlugs: string[];
}

const entries = sleepTimesData as SleepTimeEntry[];

/* ─── Static Generation ─── */

export async function generateStaticParams() {
  return entries
    .filter((e) => e.type === "wake")
    .map((e) => ({ slug: e.slug }));
}

/* ─── Metadata ─── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = entries.find((e) => e.slug === slug && e.type === "wake");

  if (!entry) {
    return { title: "Page Not Found" };
  }

  return {
    title: entry.title,
    description: entry.metaDescription,
    alternates: {
      canonical: `/sleep-time/${slug}`,
    },
    openGraph: {
      title: entry.title,
      description: entry.metaDescription,
      url: `/sleep-time/${slug}`,
      siteName: "Sleep Stack",
    },
  };
}

/* ─── Quality Badge ─── */

function QualityBadge({ quality }: { quality: string }) {
  const lower = quality.toLowerCase();

  let colorClasses = "bg-on-surface-variant/10 text-on-surface-variant";
  if (lower === "optimal" || lower === "best") {
    colorClasses = "bg-[#46eae5]/15 text-[#46eae5]";
  } else if (lower === "good" || lower === "recommended") {
    colorClasses = "bg-[#6c5ce7]/15 text-[#c6bfff]";
  } else if (lower === "fair" || lower === "minimum") {
    colorClasses = "bg-[#fdcb6e]/10 text-[#fdcb6e]";
  }

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClasses}`}
    >
      {quality}
    </span>
  );
}

/* ─── Page Component ─── */

export default async function SleepTimePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = entries.find((e) => e.slug === slug && e.type === "wake");

  if (!entry) {
    notFound();
  }

  // Extract the first two sentences of intro for the subtitle
  const introSentences = entry.content.intro
    .split(/(?<=[.!?])\s+/)
    .slice(0, 2)
    .join(" ");

  // Look up related entries for link cards
  const relatedEntries = entry.relatedSlugs
    .map((rs) => entries.find((e) => e.slug === rs))
    .filter(Boolean) as SleepTimeEntry[];

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://sleepstackapp.com";

  return (
    <>
      <SchemaMarkup
        type="WebApplication"
        data={{
          name: `Sleep Calculator - ${entry.time}`,
          applicationCategory: "HealthApplication",
          operatingSystem: "Web",
          url: `${siteUrl}/sleep-time/${slug}`,
          description: entry.metaDescription,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }}
      />

      <div className="relative">
        <div className="star-field fixed inset-0 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
          {/* Breadcrumbs */}
          <div className="pt-8">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Calculators", href: "/calculators" },
                {
                  label: `Wake Up at ${entry.time}`,
                  href: `/sleep-time/${slug}`,
                },
              ]}
            />
          </div>

          {/* Hero */}
          <section className="pb-10 text-center max-w-3xl mx-auto">
            <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-on-surface to-on-surface-variant">
              {entry.h1}
            </h1>
            <p className="text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              {introSentences}
            </p>
          </section>

          {/* Quick Results Table */}
          <section className="max-w-3xl mx-auto mb-10">
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-4 h-4 text-[#46eae5]" />
                <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant">
                  Your Optimal Bedtimes
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-on-surface-variant/70 text-xs uppercase tracking-wider">
                      <th className="pb-3 pr-4 font-medium">Cycles</th>
                      <th className="pb-3 pr-4 font-medium">Bedtime</th>
                      <th className="pb-3 pr-4 font-medium">Total Sleep</th>
                      <th className="pb-3 font-medium">Quality</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entry.preCalculated.map((row, i) => {
                      const isRecommended = row.cycles === 5;
                      return (
                        <tr
                          key={row.cycles}
                          className={`border-t border-outline-variant/10 ${
                            isRecommended
                              ? "bg-[#6c5ce7]/5"
                              : i % 2 === 0
                                ? "bg-transparent"
                                : "bg-surface-container-lowest/20"
                          }`}
                        >
                          <td className="py-3.5 pr-4">
                            <span className="font-mono font-semibold text-on-surface">
                              {row.cycles}
                            </span>
                            {isRecommended && (
                              <span className="ml-2 text-[10px] uppercase tracking-wider font-semibold text-[#6c5ce7]">
                                Recommended
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 pr-4 font-mono font-semibold text-on-surface">
                            {row.bedtime ?? "--"}
                          </td>
                          <td className="py-3.5 pr-4 text-on-surface-variant">
                            {row.totalSleep}
                          </td>
                          <td className="py-3.5">
                            <QualityBadge quality={row.quality} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Interactive Calculator */}
          <section className="max-w-3xl mx-auto mb-8">
            <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-4 text-center">
              Adjust for your schedule
            </p>
            <BedtimeCalculator />
          </section>

          {/* Ad slot below calculator */}
          <AdSlot
            slot="sleep-time-below-calc"
            format="leaderboard"
            className="my-8 max-w-3xl mx-auto"
          />

          {/* Content: Why This Time */}
          <section className="py-8 max-w-3xl mx-auto">
            <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
              Why {entry.time}?
            </h2>
            <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed">
              <p>{entry.content.whyThisTime}</p>
            </div>
          </section>

          {/* Content: Tips */}
          <section className="py-8 max-w-3xl mx-auto">
            <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
              Tips for Waking Up at {entry.time}
            </h2>
            <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed">
              <p>{entry.content.tips}</p>
            </div>
          </section>

          {/* Content: Science */}
          <section className="py-8 max-w-3xl mx-auto">
            <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
              The Science of Sleep Timing
            </h2>
            <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed">
              <p>{entry.content.science}</p>
            </div>
          </section>

          {/* Related Pages */}
          {relatedEntries.length > 0 && (
            <section className="py-8 max-w-3xl mx-auto">
              <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
                See Also
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {relatedEntries.map((related) => {
                  const href =
                    related.type === "wake"
                      ? `/sleep-time/${related.slug}`
                      : `/bedtime/${related.slug}`;
                  return (
                    <Link
                      key={related.slug}
                      href={href}
                      className="glass-card rounded-2xl p-5 hover:bg-surface-container-high/50 transition-all group"
                    >
                      <p className="font-headline font-bold text-sm text-on-surface mb-1 group-hover:text-[#46eae5] transition-colors flex items-center gap-1.5">
                        {related.time}
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {related.type === "wake"
                          ? `Wake up at ${related.time}`
                          : `Go to bed at ${related.time}`}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Ad slot mid-page */}
          <AdSlot
            slot="sleep-time-mid"
            format="rectangle"
            className="my-8 flex justify-center"
          />

          {/* FAQ */}
          {entry.faq.length > 0 && (
            <div className="max-w-3xl mx-auto">
              <FAQ items={entry.faq} />
            </div>
          )}

          {/* Related Tools */}
          <RelatedTools exclude={`/sleep-time/${slug}`} />

          {/* Medical Disclaimer */}
          <MedicalDisclaimer />

          {/* Bottom spacer */}
          <div className="h-12" />
        </div>
      </div>
    </>
  );
}
