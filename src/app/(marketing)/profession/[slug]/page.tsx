import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FAQ } from "@/components/content/FAQ";
import { RelatedTools } from "@/components/content/RelatedTools";
import { MedicalDisclaimer } from "@/components/content/MedicalDisclaimer";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import professionData from "@/content/data/professions.json";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface ProfessionContent {
  intro: string;
  challenges: string;
  strategy: string;
  tips: string;
}

interface ProfessionFAQItem {
  question: string;
  answer: string;
}

interface ProfessionEntry {
  slug: string;
  profession: string;
  title: string;
  h1: string;
  metaDescription: string;
  typicalSchedule: string;
  challenges: string[];
  recommendedBedtime: string;
  recommendedWakeTime: string;
  content: ProfessionContent;
  faq: ProfessionFAQItem[];
  relatedSlugs: string[];
}

const entries = professionData as ProfessionEntry[];

/* -------------------------------------------------------------------------- */
/*  Badge accent colors — cycles through muted accent shades                  */
/* -------------------------------------------------------------------------- */

const BADGE_COLORS = [
  "bg-primary-container/30 text-[#c6bfff]",
  "bg-secondary-container/30 text-[#46eae5]",
  "bg-tertiary-container/30 text-[#c5c0ff]",
  "bg-error-container/30 text-[#ffb4ab]",
  "bg-surface-container-high text-[#fdcb6e]",
] as const;

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
    alternates: { canonical: `/profession/${slug}` },
    openGraph: {
      title: entry.title,
      description: entry.metaDescription,
      url: `/profession/${slug}`,
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

export default async function ProfessionPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = entries.find((e) => e.slug === slug);
  if (!entry) notFound();

  const {
    profession,
    typicalSchedule,
    challenges,
    recommendedBedtime,
    recommendedWakeTime,
    content,
    faq,
    relatedSlugs,
  } = entry;

  const relatedEntries = relatedSlugs
    .map((s) => entries.find((e) => e.slug === s))
    .filter(Boolean) as ProfessionEntry[];

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
          url: `${siteUrl}/profession/${slug}`,
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
          { label: "Sleep by Profession", href: "/profession" },
          { label: profession, href: `/profession/${slug}` },
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

      {/* Schedule Overview Card */}
      <div className="relative glass-card rounded-3xl p-8 mb-10 overflow-hidden">
        {/* Ambient glow blobs */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-48 w-48 rounded-full bg-primary-container/20 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-secondary-container/20 blur-[80px]" />

        <div className="relative">
          {/* Typical Schedule */}
          <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">
            Typical Schedule
          </p>
          <p className="text-sm text-on-surface mb-6">{typicalSchedule}</p>

          {/* Recommended Sleep Window */}
          <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">
            Recommended Sleep Window
          </p>
          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            <div>
              <p className="text-xs text-on-surface-variant mb-1">Bedtime</p>
              <span className="font-headline text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#c6bfff] to-[#6c5ce7] bg-clip-text text-transparent">
                {recommendedBedtime}
              </span>
            </div>
            <div className="hidden sm:flex items-center text-on-surface-variant/40 text-2xl">
              &rarr;
            </div>
            <div>
              <p className="text-xs text-on-surface-variant mb-1">Wake Time</p>
              <span className="font-headline text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#46eae5] to-[#00cec9] bg-clip-text text-transparent">
                {recommendedWakeTime}
              </span>
            </div>
          </div>

          {/* Challenge Badges */}
          {challenges.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">
                Key Challenges
              </p>
              <div className="flex flex-wrap gap-2">
                {challenges.map((challenge, i) => (
                  <span
                    key={i}
                    className={`glass-card rounded-full px-3 py-1 text-xs font-medium ${BADGE_COLORS[i % BADGE_COLORS.length]}`}
                  >
                    {challenge}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Sections */}
      <section className="py-8 max-w-3xl mx-auto">
        <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
          Sleep Challenges for {profession}s
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed">
          <ContentParagraphs text={content.challenges} />
        </div>
      </section>

      <section className="py-8 max-w-3xl mx-auto">
        <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
          Optimal Sleep Strategy
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed">
          <ContentParagraphs text={content.strategy} />
        </div>
      </section>

      <section className="py-8 max-w-3xl mx-auto">
        <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
          {profession} Sleep Tips
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed">
          <ContentParagraphs text={content.tips} />
        </div>
      </section>

      {/* Related Professions */}
      {relatedEntries.length > 0 && (
        <section className="py-8">
          <h2 className="font-headline text-2xl font-bold mb-6 text-on-surface">
            Related Professions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {relatedEntries.map((related) => (
              <Link
                key={related.slug}
                href={`/profession/${related.slug}`}
                className="glass-card rounded-2xl p-4 hover:bg-surface-container-high/50 transition-all hover:scale-[1.02] text-center"
              >
                <span className="text-sm font-medium text-on-surface">
                  {related.profession}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faq.length > 0 && <FAQ items={faq} />}

      {/* Related Tools */}
      <RelatedTools exclude={`/profession/${slug}`} />

      {/* Medical Disclaimer */}
      <MedicalDisclaimer />
    </article>
  );
}
