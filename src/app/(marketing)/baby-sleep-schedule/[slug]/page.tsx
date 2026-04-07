import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FAQ } from "@/components/content/FAQ";
import { RelatedTools } from "@/components/content/RelatedTools";
import { MedicalDisclaimer } from "@/components/content/MedicalDisclaimer";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import scheduleData from "@/content/data/baby-sleep-schedules.json";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface SleepRange {
  min: number;
  max: number;
}

interface ScheduleItem {
  time: string;
  activity: string;
}

interface BabyContent {
  intro: string;
  sleepNeeds: string;
  scheduleGuide: string;
  tips: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface BabyScheduleEntry {
  slug: string;
  ageLabel: string;
  ageMonths: number;
  title: string;
  h1: string;
  metaDescription: string;
  totalSleep: SleepRange;
  nightSleep: SleepRange;
  napCount: SleepRange;
  napDuration: string;
  wakeWindows: string;
  sampleSchedule: ScheduleItem[];
  content: BabyContent;
  faq: FAQItem[];
  relatedSlugs: string[];
}

const entries = scheduleData as BabyScheduleEntry[];

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
    alternates: { canonical: `/baby-sleep-schedule/${slug}` },
    openGraph: {
      title: entry.title,
      description: entry.metaDescription,
      url: `/baby-sleep-schedule/${slug}`,
      siteName: "Sleep Stack",
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Sleep Breakdown Bar                                                       */
/* -------------------------------------------------------------------------- */

function SleepBreakdownBar({
  nightMin,
  nightMax,
  totalMin,
  totalMax,
}: {
  nightMin: number;
  nightMax: number;
  totalMin: number;
  totalMax: number;
}) {
  const scaleMax = 20;
  const nightMid = (nightMin + nightMax) / 2;
  const napMid = (totalMin + totalMax) / 2 - nightMid;

  const nightPct = (nightMid / scaleMax) * 100;
  const napPct = (napMid / scaleMax) * 100;

  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-on-surface-variant mb-2">
        <span>0h</span>
        <span>{scaleMax}h</span>
      </div>
      <div className="relative h-4 rounded-full bg-surface-container-high overflow-hidden flex">
        <div
          className="h-full rounded-l-full"
          style={{
            width: `${nightPct}%`,
            background: "linear-gradient(to right, #4834d4, #6c5ce7)",
          }}
        />
        <div
          className="h-full rounded-r-full"
          style={{
            width: `${napPct}%`,
            background: "linear-gradient(to right, #00cec9, #55efc4)",
          }}
        />
      </div>
      <div className="flex gap-4 mt-2 text-xs text-on-surface-variant">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary" />
          Night: {nightMin}&ndash;{nightMax}h
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#00cec9]" />
          Naps: {Math.max(0, totalMin - nightMax)}&ndash;{totalMax - nightMin}h
        </span>
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

export default async function BabySleepSchedulePage({ params }: PageProps) {
  const { slug } = await params;
  const entry = entries.find((e) => e.slug === slug);
  if (!entry) notFound();

  const {
    ageLabel,
    totalSleep,
    nightSleep,
    napCount,
    napDuration,
    wakeWindows,
    sampleSchedule,
    content,
    faq,
    relatedSlugs,
  } = entry;

  const relatedEntries = relatedSlugs
    .map((s) => entries.find((e) => e.slug === s))
    .filter(Boolean) as BabyScheduleEntry[];

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
          url: `${siteUrl}/baby-sleep-schedule/${slug}`,
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
          { label: "Baby Sleep", href: "/calculators/baby-sleep" },
          { label: ageLabel, href: `/baby-sleep-schedule/${slug}` },
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
        <div className="pointer-events-none absolute -top-20 -left-20 h-48 w-48 rounded-full bg-primary-container/20 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-secondary-container/20 blur-[80px]" />

        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">
            {ageLabel} — Total Sleep
          </p>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-headline text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
              {totalSleep.min}&ndash;{totalSleep.max} hours
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-wide">Night Sleep</p>
              <p className="text-on-surface font-semibold text-lg">
                {nightSleep.min}&ndash;{nightSleep.max}h
              </p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-wide">Naps</p>
              <p className="text-on-surface font-semibold text-lg">
                {napCount.min}&ndash;{napCount.max} per day
              </p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-wide">Nap Length</p>
              <p className="text-on-surface font-semibold text-lg">{napDuration}</p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-wide">Wake Windows</p>
              <p className="text-on-surface font-semibold text-lg">{wakeWindows}</p>
            </div>
          </div>

          <SleepBreakdownBar
            nightMin={nightSleep.min}
            nightMax={nightSleep.max}
            totalMin={totalSleep.min}
            totalMax={totalSleep.max}
          />
        </div>
      </div>

      {/* Sample Schedule */}
      <section className="py-8 max-w-3xl mx-auto">
        <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
          Sample {ageLabel} Schedule
        </h2>
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/15">
                <th className="text-left px-5 py-3 text-xs uppercase tracking-widest text-on-surface-variant font-semibold">
                  Time
                </th>
                <th className="text-left px-5 py-3 text-xs uppercase tracking-widest text-on-surface-variant font-semibold">
                  Activity
                </th>
              </tr>
            </thead>
            <tbody>
              {sampleSchedule.map((item, i) => (
                <tr
                  key={i}
                  className="border-b border-outline-variant/10 last:border-0"
                >
                  <td className="px-5 py-3 text-on-surface font-mono font-medium whitespace-nowrap">
                    {item.time}
                  </td>
                  <td className="px-5 py-3 text-on-surface-variant">
                    {item.activity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-8 max-w-3xl mx-auto">
        <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
          How Much Sleep Does a {ageLabel} Need?
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed">
          <ContentParagraphs text={content.sleepNeeds} />
        </div>
      </section>

      <section className="py-8 max-w-3xl mx-auto">
        <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
          Schedule Guide for {ageLabel}
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed">
          <ContentParagraphs text={content.scheduleGuide} />
        </div>
      </section>

      <section className="py-8 max-w-3xl mx-auto">
        <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
          Sleep Tips for Your {ageLabel}
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed">
          <ContentParagraphs text={content.tips} />
        </div>
      </section>

      {/* Related Schedules */}
      {relatedEntries.length > 0 && (
        <section className="py-8">
          <h2 className="font-headline text-2xl font-bold mb-6 text-on-surface">
            Related Sleep Schedules
          </h2>
          <div className="flex flex-wrap gap-3">
            {relatedEntries.map((related) => (
              <Link
                key={related.slug}
                href={`/baby-sleep-schedule/${related.slug}`}
                className="glass-card rounded-full px-5 py-2.5 text-sm text-on-surface hover:bg-surface-container-high/50 transition-all hover:scale-105"
              >
                {related.ageLabel}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA to Baby Sleep Calculator */}
      <div className="glass-card rounded-2xl p-6 mb-10 border border-primary/20 text-center">
        <p className="text-on-surface font-semibold mb-2">
          Need a personalized schedule?
        </p>
        <p className="text-on-surface-variant text-sm mb-4">
          Try our Baby Sleep Calculator for age-specific recommendations.
        </p>
        <Link
          href="/calculators/baby-sleep"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-light transition-colors"
        >
          Open Baby Sleep Calculator
        </Link>
      </div>

      {/* FAQ */}
      {faq.length > 0 && <FAQ items={faq} />}

      {/* Related Tools */}
      <RelatedTools exclude={`/baby-sleep-schedule/${slug}`} />

      {/* Medical Disclaimer */}
      <MedicalDisclaimer />
    </article>
  );
}
