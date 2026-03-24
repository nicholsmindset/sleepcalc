import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AdSlot } from "@/components/layout/AdSlot";
import { FAQ } from "@/components/content/FAQ";
import { RelatedTools } from "@/components/content/RelatedTools";
import { MedicalDisclaimer } from "@/components/content/MedicalDisclaimer";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import ageData from "@/content/data/age-recs.json";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface AgeRecommendedHours {
  min: number;
  max: number;
  ideal: number;
}

interface AgeContent {
  intro: string;
  sleepNeeds: string;
  tips: string;
  signs: string;
}

interface AgeFAQItem {
  question: string;
  answer: string;
}

interface AgeEntry {
  slug: string;
  ageGroup: string;
  ageRange: string;
  title: string;
  h1: string;
  metaDescription: string;
  recommendedHours: AgeRecommendedHours;
  napInfo: string;
  content: AgeContent;
  faq: AgeFAQItem[];
  relatedSlugs: string[];
}

const entries = ageData as AgeEntry[];

/* -------------------------------------------------------------------------- */
/*  Static Generation                                                         */
/* -------------------------------------------------------------------------- */

export async function generateStaticParams() {
  return entries.map((entry) => ({ slug: entry.slug }));
}

/* -------------------------------------------------------------------------- */
/*  Metadata                                                                  */
/* -------------------------------------------------------------------------- */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = entries.find((e) => e.slug === slug);
  if (!entry) return {};

  return {
    title: entry.title,
    description: entry.metaDescription,
    alternates: { canonical: `/age/${slug}` },
    openGraph: {
      title: entry.title,
      description: entry.metaDescription,
      url: `/age/${slug}`,
      siteName: "Sleep Stack",
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Range Bar Component                                                       */
/* -------------------------------------------------------------------------- */

function SleepRangeBar({
  min,
  max,
  ideal,
  scaleMax,
}: {
  min: number;
  max: number;
  ideal: number;
  scaleMax: number;
}) {
  const leftPct = (min / scaleMax) * 100;
  const widthPct = ((max - min) / scaleMax) * 100;
  const idealPct = (ideal / scaleMax) * 100;

  return (
    <div className="mt-6">
      <div className="flex justify-between text-xs text-on-surface-variant mb-2">
        <span>0h</span>
        <span>{scaleMax}h</span>
      </div>
      <div className="relative h-3 rounded-full bg-surface-container-high overflow-hidden">
        {/* Filled range */}
        <div
          className="absolute inset-y-0 rounded-full"
          style={{
            left: `${leftPct}%`,
            width: `${widthPct}%`,
            background: "linear-gradient(to right, #6c5ce7, #00cec9)",
          }}
        />
        {/* Ideal marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-on-surface bg-primary-container shadow-lg"
          style={{ left: `${idealPct}%` }}
          aria-label={`Ideal: ${ideal} hours`}
        />
      </div>
      <div className="flex justify-between text-[11px] text-on-surface-variant mt-2">
        <span style={{ marginLeft: `${leftPct}%` }}>{min}h</span>
        <span style={{ marginRight: `${100 - leftPct - widthPct}%` }}>{max}h</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Content Renderer                                                          */
/* -------------------------------------------------------------------------- */

function ContentParagraphs({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className="mb-4 last:mb-0">
          {p}
        </p>
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default async function AgePage({ params }: PageProps) {
  const { slug } = await params;
  const entry = entries.find((e) => e.slug === slug);
  if (!entry) notFound();

  const { recommendedHours, content, faq, relatedSlugs, ageGroup, ageRange, napInfo } = entry;

  // Use a wider scale for children/teens (0-20h), narrower for adults (0-12h)
  const scaleMax = recommendedHours.max > 12 ? 20 : 12;

  const relatedEntries = relatedSlugs
    .map((s) => entries.find((e) => e.slug === s))
    .filter(Boolean) as AgeEntry[];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sleepstackapp.com";

  return (
    <article className="mx-auto max-w-4xl px-4 pb-20 pt-8">
      {/* Schema */}
      <SchemaMarkup
        type="WebApplication"
        data={{
          name: entry.title,
          applicationCategory: "HealthApplication",
          operatingSystem: "Web",
          url: `${siteUrl}/age/${slug}`,
          description: entry.metaDescription,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Sleep by Age", href: "/age" },
          { label: `${ageGroup} (${ageRange})`, href: `/age/${slug}` },
        ]}
      />

      {/* H1 */}
      <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
        {entry.h1}
      </h1>

      {/* Intro */}
      <div className="text-on-surface-variant text-sm leading-relaxed mb-10 max-w-3xl">
        <ContentParagraphs text={content.intro} />
      </div>

      {/* Sleep Summary Card */}
      <div className="relative glass-card rounded-3xl p-8 mb-10 overflow-hidden">
        {/* Ambient glow blobs */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-48 w-48 rounded-full bg-primary-container/20 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-secondary-container/20 blur-[80px]" />

        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">
            Recommended Sleep
          </p>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-headline text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
              {recommendedHours.ideal} hours
            </span>
          </div>

          <p className="text-sm text-on-surface-variant mb-2">
            Recommended range:{" "}
            <span className="text-on-surface font-medium">
              {recommendedHours.min}&ndash;{recommendedHours.max} hours
            </span>
          </p>

          {napInfo && (
            <p className="text-sm text-on-surface-variant">
              <span className="text-ds-secondary font-medium">Nap info:</span>{" "}
              {napInfo}
            </p>
          )}

          <SleepRangeBar
            min={recommendedHours.min}
            max={recommendedHours.max}
            ideal={recommendedHours.ideal}
            scaleMax={scaleMax}
          />
        </div>
      </div>

      {/* Ad Slot */}
      <AdSlot slot="age-leaderboard" format="leaderboard" className="mb-10" />

      {/* Content Sections */}
      <section className="py-8 max-w-3xl mx-auto">
        <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
          How Much Sleep Does a {ageGroup} Need?
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed">
          <ContentParagraphs text={content.sleepNeeds} />
        </div>
      </section>

      <section className="py-8 max-w-3xl mx-auto">
        <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
          Sleep Tips for {ageGroup}s
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed">
          <ContentParagraphs text={content.tips} />
        </div>
      </section>

      <section className="py-8 max-w-3xl mx-auto">
        <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
          Signs of Poor Sleep in {ageGroup}s
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed">
          <ContentParagraphs text={content.signs} />
        </div>
      </section>

      {/* Related Age Groups */}
      {relatedEntries.length > 0 && (
        <section className="py-8">
          <h2 className="font-headline text-2xl font-bold mb-6 text-on-surface">
            Related Age Groups
          </h2>
          <div className="flex flex-wrap gap-3">
            {relatedEntries.map((related) => (
              <Link
                key={related.slug}
                href={`/age/${related.slug}`}
                className="glass-card rounded-full px-5 py-2.5 text-sm text-on-surface hover:bg-surface-container-high/50 transition-all hover:scale-105"
              >
                {related.ageGroup}{" "}
                <span className="text-on-surface-variant text-xs">
                  ({related.ageRange})
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faq.length > 0 && <FAQ items={faq} />}

      {/* Related Tools */}
      <RelatedTools exclude={`/age/${slug}`} />

      {/* Medical Disclaimer */}
      <MedicalDisclaimer />
    </article>
  );
}
