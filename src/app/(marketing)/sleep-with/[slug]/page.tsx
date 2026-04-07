import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CheckCircle, Heart } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FAQ } from "@/components/content/FAQ";
import { RelatedTools } from "@/components/content/RelatedTools";
import { MedicalDisclaimer } from "@/components/content/MedicalDisclaimer";
import AffiliateCard from "@/components/content/AffiliateCard";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import conditionData from "@/content/data/conditions.json";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface ConditionContent {
  intro: string;
  howItAffects: string;
  tips: string;
  warning: string;
}

interface ConditionFAQItem {
  question: string;
  answer: string;
}

interface ConditionEntry {
  slug: string;
  conditionName: string;
  title: string;
  h1: string;
  metaDescription: string;
  howItAffectsSleep: string;
  adjustedSleepRecommendations: string;
  sleepHygieneTips: string[];
  whenToSeeDoctor: string;
  content: ConditionContent;
  faq: ConditionFAQItem[];
  relatedSlugs: string[];
}

const entries = conditionData as ConditionEntry[];

/* -------------------------------------------------------------------------- */
/*  Static Generation                                                         */
/* -------------------------------------------------------------------------- */

export const dynamicParams = false;

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
    alternates: { canonical: `/sleep-with/${slug}` },
    openGraph: {
      title: entry.title,
      description: entry.metaDescription,
      url: `/sleep-with/${slug}`,
      siteName: "Sleep Stack",
    },
  };
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

export default async function SleepWithPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = entries.find((e) => e.slug === slug);
  if (!entry) notFound();

  const {
    conditionName,
    h1,
    content,
    faq,
    relatedSlugs,
    sleepHygieneTips,
    howItAffectsSleep,
    adjustedSleepRecommendations,
    whenToSeeDoctor,
  } = entry;

  const relatedEntries = relatedSlugs
    .map((s) => entries.find((e) => e.slug === s))
    .filter(Boolean) as ConditionEntry[];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sleepstackapp.com";

  return (
    <article className="mx-auto max-w-4xl px-4 pb-20 pt-4">
      {/* Schema */}
      <SchemaMarkup
        type="WebApplication"
        data={{
          name: entry.title,
          applicationCategory: "HealthApplication",
          operatingSystem: "Web",
          url: `${siteUrl}/sleep-with/${slug}`,
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
          { label: "Sleep Conditions", href: "/sleep-with" },
          { label: conditionName, href: `/sleep-with/${slug}` },
        ]}
      />

      {/* H1 */}
      <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
        {h1}
      </h1>

      {/* Intro */}
      <div className="text-on-surface-variant text-sm leading-relaxed mb-10 max-w-3xl">
        <ContentParagraphs text={content.intro} />
      </div>

      {/* Medical notice banner */}
      <div className="flex gap-3 items-start glass-card rounded-2xl p-5 mb-10 border border-[#f9ca24]/20">
        <Heart className="w-5 h-5 text-[#f9ca24] shrink-0 mt-0.5" />
        <p className="text-sm text-on-surface-variant leading-relaxed">
          <span className="text-[#f9ca24] font-semibold">Medical note: </span>
          {content.warning}
        </p>
      </div>

      {/* How It Affects Sleep */}
      <section className="py-8 max-w-3xl mx-auto">
        <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
          How {conditionName} Affects Sleep
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed">
          <ContentParagraphs text={content.howItAffects} />
        </div>
      </section>

      {/* How It Affects Sleep — Detail */}
      <div className="relative glass-card rounded-3xl p-8 mb-10 overflow-hidden max-w-3xl mx-auto">
        <div className="pointer-events-none absolute -top-20 -left-20 h-48 w-48 rounded-full bg-primary-container/20 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-secondary-container/20 blur-[80px]" />
        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">
            Sleep Impact Summary
          </p>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            {howItAffectsSleep}
          </p>
        </div>
      </div>

      {/* Adjusted Sleep Recommendations */}
      <section className="py-8 max-w-3xl mx-auto">
        <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
          Adjusted Sleep Recommendations
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed mb-6">
          <p>{adjustedSleepRecommendations}</p>
        </div>
      </section>

      {/* Sleep Tips */}
      <section className="py-8 max-w-3xl mx-auto">
        <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
          Sleep Hygiene Tips for {conditionName}
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed mb-6">
          <ContentParagraphs text={content.tips} />
        </div>

        <div className="space-y-3 mt-6">
          {sleepHygieneTips.map((tip, i) => (
            <div
              key={i}
              className="flex gap-3 items-start glass-card rounded-xl p-4"
            >
              <CheckCircle className="w-4 h-4 text-[#46eae5] shrink-0 mt-0.5" />
              <p className="text-sm text-on-surface-variant leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* When to See a Doctor */}
      <section className="py-8 max-w-3xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl p-8"
          style={{
            background: "linear-gradient(135deg, rgba(255,107,107,0.08) 0%, rgba(253,203,110,0.06) 100%)",
            border: "1px solid rgba(255,107,107,0.2)",
          }}
        >
          <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#ff6b6b]/10 blur-[60px]" />
          <div className="relative flex gap-4">
            <AlertTriangle className="w-6 h-6 text-[#fdcb6e] shrink-0 mt-0.5" />
            <div>
              <h2 className="font-headline text-2xl font-bold mb-4 text-on-surface">
                When to See a Doctor
              </h2>
              <div className="text-sm text-on-surface-variant leading-relaxed space-y-3">
                <ContentParagraphs text={whenToSeeDoctor} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Conditions */}
      {relatedEntries.length > 0 && (
        <section className="py-8">
          <h2 className="font-headline text-2xl font-bold mb-6 text-on-surface">
            Related Conditions
          </h2>
          <div className="flex flex-wrap gap-3">
            {relatedEntries.map((related) => (
              <Link
                key={related.slug}
                href={`/sleep-with/${related.slug}`}
                className="glass-card rounded-full px-5 py-2.5 text-sm text-on-surface hover:bg-surface-container-high/50 transition-all hover:scale-105"
              >
                {related.conditionName}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faq.length > 0 && <FAQ items={faq} />}

      {/* Affiliate */}
      <AffiliateCard context="supplement" />

      {/* Related Tools */}
      <RelatedTools exclude={`/sleep-with/${slug}`} />

      {/* Medical Disclaimer — prominent for health pages */}
      <MedicalDisclaimer />
    </article>
  );
}
