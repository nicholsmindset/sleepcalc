import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
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

interface ScheduleEvent {
  time: string;
  activity: string;
}

interface SampleSchedule {
  wakeTime: string;
  bedtime: string;
  totalSleep: string;
  events: ScheduleEvent[];
}

interface AgeEntry {
  slug: string;
  ageGroup: string;
  ageRange: string;
  type?: string;
  title: string;
  h1: string;
  metaDescription: string;
  recommendedHours: AgeRecommendedHours;
  napInfo: string;
  sampleSchedule?: SampleSchedule;
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
/*  Sample Schedule Component                                                 */
/* -------------------------------------------------------------------------- */

function SampleScheduleCard({ schedule, ageGroup }: { schedule: SampleSchedule; ageGroup: string }) {
  return (
    <section className="py-8 max-w-3xl mx-auto">
      <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
        Sample Daily Schedule for a {ageGroup}
      </h2>
      <div className="glass-card rounded-2xl p-6 md:p-8">
        {/* Summary row */}
        <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b border-outline-variant/20">
          <div>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Wake Time</p>
            <p className="font-mono font-semibold text-[#46eae5]">{schedule.wakeTime}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Bedtime</p>
            <p className="font-mono font-semibold text-[#c6bfff]">{schedule.bedtime}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Total Sleep</p>
            <p className="font-mono font-semibold text-on-surface">{schedule.totalSleep}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-0">
          {schedule.events.map((event, i) => (
            <div key={i} className="flex gap-4 group">
              {/* Time column */}
              <div className="w-28 shrink-0 pt-3">
                <p className="font-mono text-xs text-on-surface-variant group-first:text-[#46eae5] group-last:text-[#c6bfff]">
                  {event.time}
                </p>
              </div>
              {/* Connector */}
              <div className="flex flex-col items-center">
                <div className={`w-2 h-2 rounded-full mt-3.5 shrink-0 ${i === 0 ? "bg-[#46eae5]" : i === schedule.events.length - 1 ? "bg-[#c6bfff]" : "bg-outline-variant"}`} />
                {i < schedule.events.length - 1 && (
                  <div className="w-px flex-1 bg-outline-variant/30 mt-1" />
                )}
              </div>
              {/* Activity */}
              <div className="pb-3 pt-2 min-w-0">
                <p className="text-sm text-on-surface-variant leading-snug">{event.activity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default async function AgePage({ params }: PageProps) {
  const { slug } = await params;
  const entry = entries.find((e) => e.slug === slug);
  if (!entry) notFound();

  const { recommendedHours, content, faq, relatedSlugs, ageGroup, ageRange, napInfo, sampleSchedule } = entry;

  // Use a wider scale for children/teens (0-20h), narrower for adults (0-12h)
  const scaleMax = recommendedHours.max > 12 ? 20 : 12;

  const relatedEntries = relatedSlugs
    .map((s) => entries.find((e) => e.slug === s))
    .filter(Boolean) as AgeEntry[];

  // Prev/next: for individual-year entries, navigate within that group only
  const isIndividualYear = entry.type === "individual-year";
  const navPool = isIndividualYear
    ? entries.filter((e) => e.type === "individual-year")
    : entries.filter((e) => e.type !== "individual-year");

  const currentIdx = navPool.findIndex((e) => e.slug === slug);
  const prevEntry = currentIdx > 0 ? navPool[currentIdx - 1] : null;
  const nextEntry = currentIdx < navPool.length - 1 ? navPool[currentIdx + 1] : null;

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

      {/* Sample Schedule (individual-year pages only) */}
      {sampleSchedule && (
        <SampleScheduleCard schedule={sampleSchedule} ageGroup={ageGroup} />
      )}

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

      {/* Prev / Next navigation */}
      {(prevEntry || nextEntry) && (
        <nav
          aria-label={isIndividualYear ? "Previous and next age years" : "Previous and next age groups"}
          className="max-w-3xl mx-auto py-8 flex items-center justify-between gap-4"
        >
          {prevEntry ? (
            <Link
              href={`/age/${prevEntry.slug}`}
              className="glass-card rounded-2xl px-5 py-4 flex items-center gap-3 hover:bg-surface-container-high/50 transition-all group flex-1 max-w-[48%]"
            >
              <ArrowLeft className="w-4 h-4 text-[#46eae5] shrink-0 group-hover:-translate-x-0.5 transition-transform" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant/60 mb-0.5">Previous</p>
                <p className="text-sm font-semibold text-on-surface truncate">{prevEntry.ageGroup}</p>
                <p className="text-xs text-on-surface-variant truncate">{prevEntry.ageRange}</p>
              </div>
            </Link>
          ) : (
            <div className="flex-1 max-w-[48%]" />
          )}

          {nextEntry ? (
            <Link
              href={`/age/${nextEntry.slug}`}
              className="glass-card rounded-2xl px-5 py-4 flex items-center gap-3 justify-end hover:bg-surface-container-high/50 transition-all group flex-1 max-w-[48%]"
            >
              <div className="min-w-0 text-right">
                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant/60 mb-0.5">Next</p>
                <p className="text-sm font-semibold text-on-surface truncate">{nextEntry.ageGroup}</p>
                <p className="text-xs text-on-surface-variant truncate">{nextEntry.ageRange}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#46eae5] shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <div className="flex-1 max-w-[48%]" />
          )}
        </nav>
      )}

      {/* Related Tools */}
      <RelatedTools exclude={`/age/${slug}`} />

      {/* Medical Disclaimer */}
      <MedicalDisclaimer />
    </article>
  );
}
