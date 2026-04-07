import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Globe, Sunrise, Sunset, Thermometer, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FAQ } from "@/components/content/FAQ";
import { MedicalDisclaimer } from "@/components/content/MedicalDisclaimer";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import cityData from "@/content/data/cities-seo.json";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface CityEntry {
  slug: string;
  cityName: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utcOffset: number;
  avgSunrise: string;
  avgSunset: string;
  avgTempC: number;
  knownFor: string;
  climate: string;
  travelHub: boolean;
  popularOrigins: string[];
}

const entries = cityData as CityEntry[];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function formatUtcOffset(offset: number): string {
  const sign = offset >= 0 ? "+" : "−";
  const abs = Math.abs(offset);
  const hours = Math.floor(abs);
  const mins = Math.round((abs - hours) * 60);
  return mins > 0
    ? `UTC${sign}${hours}:${mins.toString().padStart(2, "0")}`
    : `UTC${sign}${hours}`;
}

function getClimateTips(climate: string, cityName: string, avgTempC: number): string[] {
  const common = [
    "Keep your bedroom dark with blackout curtains — light pollution significantly disrupts melatonin production.",
    "Maintain a consistent sleep and wake time seven days a week. Irregular schedules are the single biggest cause of sleep debt.",
    "Wind down 60 minutes before bed: dim lights, avoid screens, and drop the thermostat.",
  ];

  const byClimate: Record<string, string[]> = {
    "humid-continental": [
      `${cityName}'s extreme seasonal temperature swings demand different sleep strategies by season. In winter, a bedroom at 16–18°C feels ideal; in summer, use AC to stay below 20°C — even mild warmth reduces deep (N3) sleep.`,
      "Short winter daylight hours shift your circadian rhythm later. A dawn-simulation alarm clock or 10 minutes of bright light immediately after waking resets your clock faster than caffeine.",
    ],
    "mediterranean": [
      `${cityName}'s long, warm summers push sunset past 8 PM, delaying the natural melatonin signal by 1–2 hours. Blue-light blocking glasses from dusk onward compress this delay and help you fall asleep on schedule.`,
      "Summer bedroom temperatures often exceed 22°C. Target 18–19°C with AC — every degree above 20°C measurably reduces time in deep sleep.",
    ],
    "humid-subtropical": [
      `${cityName}'s year-round humidity (often 70–90%) slows the evaporative skin-cooling your body needs to initiate deep sleep. Run AC to 19–21°C and use moisture-wicking sheets to give your body the temperature drop it needs.`,
      "Avoid hot showers immediately before bed in humid climates — they add moisture to the room. A lukewarm shower 90 minutes before bed actually lowers core body temperature and speeds sleep onset.",
    ],
    "semi-arid": [
      `${cityName}'s desert climate means scorching afternoons but surprisingly cool nights. Open windows after 9 PM to flush out stored heat, then seal up before sunrise to keep the morning cool.`,
      `Dry air in arid climates causes nasal and throat dryness that fragments sleep. A bedroom humidifier set to 40–50% relative humidity significantly reduces overnight wake-ups.`,
    ],
    "subarctic": [
      `${cityName}'s near-continuous summer daylight is the number one sleep disruptor for residents and visitors. Blackout curtains rated to 99%+ light blockage are non-negotiable — even 1% light leakage suppresses melatonin.`,
      "In deep winter, weeks of minimal daylight cause circadian drift and seasonal mood changes. A 10,000-lux light therapy lamp for 20 minutes within 30 minutes of waking prevents most of this effect.",
    ],
    "tropical": [
      `In ${cityName}'s tropical climate, nighttime temperatures rarely drop below 24°C — above the threshold for deep sleep. Air conditioning targeting 19–21°C is the single most effective sleep intervention available here.`,
      "Tropical humidity makes sweating an inefficient cooling mechanism. Keep AC circulating (not just cooling), use a ceiling fan on low, and choose breathable linen or bamboo sheets over synthetic fabrics.",
    ],
    "oceanic": [
      `${cityName}'s mild, overcast climate is naturally good for sleep — cool temperatures and diffuse light levels are close to the human sleep-optimal environment. Most residents can achieve 16–18°C bedrooms without AC most of the year.`,
      "Persistent cloud cover means less bright morning light to anchor your circadian clock. Make a deliberate effort to go outdoors within 30 minutes of waking, even on cloudy days — outdoor diffuse light is still 10× brighter than indoor lighting.",
    ],
    "continental": [
      `${cityName}'s cold winters tempt residents to over-heat bedrooms. Keep your thermostat at or below 18°C at night — your brain uses body-temperature drop as a sleep trigger, and a warm room defeats that signal entirely.`,
      "Continental climates with short winter days often cause social jet lag: sleeping much later on weekends than weekdays. Keeping your wake time within 60 minutes of your weekday time, even Sundays, prevents this chronic cycle.",
    ],
  };

  const specific = byClimate[climate] ?? [
    `${cityName} averages ${avgTempC}°C annually. For deep sleep, keep your bedroom 3–5°C cooler than the daytime high, targeting 16–19°C.`,
    "Track seasonal changes in your local sunset time and shift your wind-down routine 15 minutes earlier or later to stay aligned with natural melatonin onset.",
  ];

  return [...specific, ...common];
}

function buildFAQ(entry: CityEntry) {
  const { cityName, timezone, utcOffset, avgSunrise, avgSunset, avgTempC } = entry;
  const utcStr = formatUtcOffset(utcOffset);
  return [
    {
      question: `What is the best bedtime for someone living in ${cityName}?`,
      answer: `For most adults in ${cityName} (${utcStr}), a 10:00–11:00 PM bedtime supports 7–9 hours of sleep before a 6–7 AM start. Use the sleep calculator above with your actual wake time to find the bedtime that lands on a complete sleep cycle — waking mid-cycle causes grogginess regardless of total hours.`,
    },
    {
      question: `How does ${cityName}'s timezone affect sleep?`,
      answer: `${cityName} runs on ${timezone} (${utcStr}). Your circadian clock follows solar time, which can diverge from clock time depending on your position within the timezone. The further west you are within a timezone, the later solar noon falls relative to the clock — subtly pushing night owls even later. Awareness of this effect helps explain why some residents feel perpetually "off" on standard schedules.`,
    },
    {
      question: `When does the sun set in ${cityName} and how does that affect sleep?`,
      answer: `The annual average sunset in ${cityName} is around ${avgSunset}. Sunset is the primary trigger for melatonin production — your brain begins its sleep-onset process roughly 2 hours after darkness. Seasons shift this significantly: summer sunsets may come 2–3 hours later than winter sunsets, delaying natural sleepiness in a way that many residents don't connect to their late-summer insomnia.`,
    },
    {
      question: `Is ${cityName}'s climate good for sleep?`,
      answer: `${cityName} averages ${avgTempC}°C annually. The optimal bedroom temperature for deep sleep is 16–19°C (60–67°F). ${avgTempC > 22 ? `${cityName}'s warmth means active cooling (AC or fans) is often necessary to reach this range.` : avgTempC < 10 ? `${cityName}'s cold climate makes the ideal sleep temperature easy to achieve — but watch for over-heated bedrooms in winter.` : `${cityName}'s moderate climate generally supports good sleep conditions with seasonal adjustments.`} Sunrise in ${cityName} averages ${avgSunrise}, which drives your morning cortisol peak and sets the tone for your entire sleep-wake cycle.`,
    },
    {
      question: `What is sleep jet lag and does it affect people in ${cityName}?`,
      answer: `Social jet lag is the mismatch between your biological clock and your social schedule — essentially self-imposed jet lag from inconsistent sleep times. It affects roughly 70% of working adults in major cities like ${cityName}, where late-night entertainment, long commutes, and variable work schedules push bedtimes later on weekdays and later still on weekends. The fix is a consistent wake time 7 days a week — your biological anchor.`,
    },
  ];
}

/* -------------------------------------------------------------------------- */
/*  Static Generation                                                         */
/* -------------------------------------------------------------------------- */

export async function generateStaticParams() {
  return entries.map((entry) => ({ slug: entry.slug }));
}

export const dynamicParams = false;

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

  const utcStr = formatUtcOffset(entry.utcOffset);
  const title = `Sleep Schedule for ${entry.cityName} — Best Bedtime in ${utcStr}`;
  const description = `Calculate your optimal bedtime for ${entry.cityName}, ${entry.country}. Timezone ${entry.timezone} (${utcStr}). Avg sunrise ${entry.avgSunrise}, sunset ${entry.avgSunset}. Science-backed sleep schedule + climate tips.`;

  return {
    title,
    description,
    alternates: { canonical: `/city/${slug}` },
    openGraph: {
      title,
      description,
      url: `/city/${slug}`,
      siteName: "Sleep Stack",
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default async function CityPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = entries.find((e) => e.slug === slug);
  if (!entry) notFound();

  const {
    cityName,
    country,
    timezone,
    utcOffset,
    avgSunrise,
    avgSunset,
    avgTempC,
    knownFor,
    climate,
    travelHub,
    popularOrigins,
  } = entry;

  const utcStr = formatUtcOffset(utcOffset);
  const tips = getClimateTips(climate, cityName, avgTempC);
  const faq = buildFAQ(entry);

  const nearbyCities = entries
    .filter(
      (e) =>
        e.slug !== slug &&
        (e.country === country || Math.abs(e.utcOffset - utcOffset) <= 1)
    )
    .slice(0, 6);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sleepstackapp.com";

  return (
    <article className="mx-auto max-w-4xl px-4 pb-20 pt-8">
      {/* Schema */}
      <SchemaMarkup
        type="WebApplication"
        data={{
          name: `Sleep Schedule Calculator for ${cityName}`,
          applicationCategory: "HealthApplication",
          operatingSystem: "Web",
          url: `${siteUrl}/city/${slug}`,
          description: `Optimal sleep schedule for ${cityName}, ${country} (${utcStr})`,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Sleep by City", href: "/city" },
          { label: cityName, href: `/city/${slug}` },
        ]}
      />

      {/* H1 */}
      <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
        Best Sleep Schedule for {cityName}
      </h1>

      <p className="text-on-surface-variant text-sm leading-relaxed mb-10 max-w-3xl">
        {knownFor}
      </p>

      {/* Stats Card */}
      <div className="relative glass-card rounded-3xl p-8 mb-10 overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -left-20 h-48 w-48 rounded-full bg-primary-container/20 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-secondary-container/20 blur-[80px]" />

        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center gap-1.5 text-on-surface-variant text-xs uppercase tracking-widest mb-1">
              <Globe className="w-3.5 h-3.5" /> Timezone
            </div>
            <p className="font-headline text-xl font-bold text-on-surface">{utcStr}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {timezone.split("/")[1]?.replace(/_/g, " ") ?? timezone}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-on-surface-variant text-xs uppercase tracking-widest mb-1">
              <Sunrise className="w-3.5 h-3.5" /> Avg Sunrise
            </div>
            <p className="font-headline text-xl font-bold bg-gradient-to-r from-[#fdcb6e] to-[#f0932b] bg-clip-text text-transparent">
              {avgSunrise}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-on-surface-variant text-xs uppercase tracking-widest mb-1">
              <Sunset className="w-3.5 h-3.5" /> Avg Sunset
            </div>
            <p className="font-headline text-xl font-bold bg-gradient-to-r from-[#c6bfff] to-[#6c5ce7] bg-clip-text text-transparent">
              {avgSunset}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-on-surface-variant text-xs uppercase tracking-widest mb-1">
              <Thermometer className="w-3.5 h-3.5" /> Avg Temp
            </div>
            <p className="font-headline text-xl font-bold text-on-surface">{avgTempC}°C</p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {Math.round((avgTempC * 9) / 5 + 32)}°F
            </p>
          </div>
        </div>
      </div>

      {/* Calculator CTA */}
      <div className="glass-card rounded-3xl p-8 mb-10 border border-primary/30">
        <h2 className="font-headline text-2xl font-bold mb-3 text-on-surface">
          Calculate Your Bedtime for {cityName}
        </h2>
        <p className="text-on-surface-variant text-sm mb-6">
          Enter your required wake time and the calculator will find bedtimes that land on complete
          90-minute sleep cycles — so you wake feeling refreshed, not groggy.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-all hover:bg-primary-light active:scale-95"
          >
            <Clock className="w-4 h-4" />
            Open Sleep Calculator
          </Link>
          <Link
            href="/calculators/shift-worker"
            className="inline-flex items-center justify-center gap-2 rounded-2xl glass-card border border-border px-6 py-3 text-sm font-semibold text-on-surface transition-all hover:border-border-bright"
          >
            Shift Worker Calculator
          </Link>
        </div>
      </div>

      {/* Sleep in City */}
      <section className="py-8 max-w-3xl mx-auto">
        <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
          Sleep in {cityName}
        </h2>
        <div className="text-on-surface-variant text-sm leading-relaxed space-y-4">
          <p>
            {cityName} sits in the <strong className="text-on-surface">{timezone}</strong> timezone
            ({utcStr}). Your body&rsquo;s master circadian clock — located in the suprachiasmatic
            nucleus of the hypothalamus — runs on solar time, not clock time. When the two diverge,
            as they do at the edges of any timezone, chronic sleep timing misalignment is the
            invisible result.
          </p>
          <p>
            The average sunrise in {cityName} is <strong className="text-on-surface">{avgSunrise}</strong>{" "}
            and sunset falls around <strong className="text-on-surface">{avgSunset}</strong> annually.
            These times shift by up to 4–6 hours between the summer solstice and winter solstice at{" "}
            {cityName}&rsquo;s latitude. Each seasonal shift moves your natural melatonin onset time with it
            — which is why sleep quality often changes noticeably between summer and winter without any
            change in your actual bedtime habits.
          </p>
          <p>
            Morning light exposure within 30 minutes of waking is the most powerful tool for anchoring
            your circadian clock. In {cityName}, the character of morning light changes dramatically by
            season: bright and early in summer, dim and late in winter. Being intentional about light
            exposure — getting outdoors or using a bright lamp regardless of season — is the foundation
            of consistent sleep quality in this city.
          </p>
          <p>
            For adults, the National Sleep Foundation recommends 7–9 hours per night. With{" "}
            {cityName}&rsquo;s annual average temperature of{" "}
            <strong className="text-on-surface">{avgTempC}°C</strong>, the local environment plays a
            direct role in sleep quality.{" "}
            {avgTempC > 22
              ? `Warm nights in ${cityName} mean active cooling is necessary to reach the 16–19°C bedroom temperature optimal for deep sleep.`
              : avgTempC < 10
              ? `${cityName}'s cold climate makes the ideal sleep temperature achievable naturally, but over-heated rooms in winter are a common mistake.`
              : `${cityName}'s moderate climate generally supports good sleep without major intervention, though seasonal adjustments remain important.`}
          </p>
        </div>
      </section>

      {/* Climate Tips */}
      <section className="py-8 max-w-3xl mx-auto">
        <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
          Sleep Tips for {cityName}&rsquo;s Climate
        </h2>
        <div className="flex flex-col gap-4">
          {tips.map((tip, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 flex gap-4">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-[#c6bfff]">
                {i + 1}
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Jet Lag — travel hubs only */}
      {travelHub && popularOrigins.length > 0 && (
        <section className="py-8 max-w-3xl mx-auto">
          <div className="glass-card rounded-3xl p-8 border border-secondary-container/30">
            <h2 className="font-headline text-2xl font-bold mb-4 text-on-surface">
              Arriving in {cityName} from Abroad?
            </h2>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              {cityName} is a major international gateway. Travelers arriving from different timezones
              need approximately 1 day of recovery per hour of timezone difference eastward, and slightly
              less when traveling west. Expose yourself to bright outdoor light at {cityName}&rsquo;s local
              morning — even on overcast days — within 30 minutes of waking to accelerate your body&rsquo;s
              resynchronization.
            </p>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">
              Common Arrival Routes
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {popularOrigins.map((origin) => {
                const originCity = entries.find((e) => e.cityName === origin);
                const diff = originCity ? Math.abs(originCity.utcOffset - utcOffset) : null;
                return (
                  <div key={origin} className="glass-card rounded-2xl px-4 py-2">
                    <span className="text-on-surface text-sm font-medium">{origin}</span>
                    {diff !== null && (
                      <span className="text-on-surface-variant text-xs ml-2">
                        {diff}h shift
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <Link
              href="/calculators"
              className="text-sm text-[#c6bfff] hover:text-[#a29bfe] transition-colors"
            >
              Browse all sleep calculators →
            </Link>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-8 max-w-3xl mx-auto">
        <h2 className="font-headline text-2xl font-bold mb-6 text-on-surface">
          Frequently Asked Questions
        </h2>
        <FAQ items={faq} />
      </section>

      {/* Nearby Cities */}
      {nearbyCities.length > 0 && (
        <section className="py-8">
          <h2 className="font-headline text-xl font-bold mb-4 text-on-surface">
            Sleep Schedules for Nearby Cities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {nearbyCities.map((city) => (
              <Link
                key={city.slug}
                href={`/city/${city.slug}`}
                className="glass-card rounded-2xl px-4 py-3 group hover:border-border-bright transition-colors"
              >
                <p className="text-sm font-semibold text-on-surface group-hover:text-[#c6bfff] transition-colors">
                  {city.cityName}
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {city.country} · {formatUtcOffset(city.utcOffset)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <MedicalDisclaimer />
    </article>
  );
}
