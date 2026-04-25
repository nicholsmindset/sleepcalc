import type { Metadata } from "next";
import Link from "next/link";
import { Globe } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MedicalDisclaimer } from "@/components/content/MedicalDisclaimer";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { generateItemListSchema } from "@/utils/schema";
import cityData from "@/content/data/cities-seo.json";

interface CityEntry {
  slug: string;
  cityName: string;
  country: string;
  countryCode: string;
  timezone: string;
  utcOffset: number;
  avgSunrise: string;
  avgSunset: string;
  avgTempC: number;
  travelHub: boolean;
}

const entries = cityData as CityEntry[];

function formatUtcOffset(offset: number): string {
  const sign = offset >= 0 ? "+" : "−";
  const abs = Math.abs(offset);
  const hours = Math.floor(abs);
  const mins = Math.round((abs - hours) * 60);
  return mins > 0
    ? `UTC${sign}${hours}:${mins.toString().padStart(2, "0")}`
    : `UTC${sign}${hours}`;
}

export const metadata: Metadata = {
  title: "Sleep by City — Bedtime & Sleep Schedules for 50+ Cities Worldwide",
  description:
    "Find the optimal sleep schedule for your city. Timezone-specific bedtimes, average sunrise & sunset, and climate-aware sleep tips for 50+ cities across 6 continents.",
  alternates: { canonical: "/city" },
  openGraph: {
    title: "Sleep by City — Bedtime & Sleep Schedules for 50+ Cities Worldwide",
    description:
      "Timezone-specific sleep schedules and climate-aware tips for 50+ cities. From New York to Tokyo, Sydney to Cape Town.",
    url: "/city",
    siteName: "Sleep Stack",
    type: "website",
  },
};

export default function CityLandingPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sleepstackapp.com";

  const itemList = generateItemListSchema(
    entries.map((e) => ({
      name: `Sleep Schedule for ${e.cityName}`,
      url: `${siteUrl}/city/${e.slug}`,
    })),
    "Sleep by City"
  );

  // Group cities by country for clean navigation
  const grouped = entries.reduce<Record<string, CityEntry[]>>((acc, city) => {
    (acc[city.country] ??= []).push(city);
    return acc;
  }, {});

  const countries = Object.keys(grouped).sort();
  const travelHubs = entries.filter((e) => e.travelHub);

  return (
    <article className="mx-auto max-w-4xl px-4 pb-20 pt-4">
      <SchemaMarkup type="ItemList" data={itemList} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Sleep by City", href: "/city" },
        ]}
      />

      <h1 className="font-headline text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
        Sleep by City
      </h1>
      <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-10 max-w-3xl">
        Your city&apos;s timezone, climate, and daylight pattern shape your sleep
        more than most people realize. Pick a city below for its average sunrise
        and sunset, climate-specific sleep tips, and a calculator tuned to its
        local schedule.
      </p>

      {travelHubs.length > 0 && (
        <section className="mb-12">
          <h2 className="font-headline text-2xl font-bold mb-6 text-on-surface">
            Major Travel Hubs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {travelHubs.map((entry) => (
              <Link
                key={entry.slug}
                href={`/city/${entry.slug}`}
                className="glass-card rounded-2xl p-5 hover:bg-surface-container-high/50 transition-all group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-[#c6bfff]" />
                  <p className="font-headline font-bold text-on-surface group-hover:text-[#c6bfff] transition-colors">
                    {entry.cityName}
                  </p>
                </div>
                <p className="text-xs text-on-surface-variant mb-2">
                  {entry.country} · {formatUtcOffset(entry.utcOffset)}
                </p>
                <p className="text-sm text-on-surface-variant">
                  Sunrise {entry.avgSunrise} · Sunset {entry.avgSunset}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mb-12">
        <h2 className="font-headline text-2xl font-bold mb-6 text-on-surface">
          All Cities by Country
        </h2>
        <div className="space-y-8">
          {countries.map((country) => (
            <div key={country}>
              <h3 className="font-headline text-lg font-bold mb-3 text-on-surface/90">
                {country}
              </h3>
              <div className="flex flex-wrap gap-2">
                {grouped[country].map((entry) => (
                  <Link
                    key={entry.slug}
                    href={`/city/${entry.slug}`}
                    className="glass-card rounded-full px-4 py-2 text-sm text-on-surface hover:bg-surface-container-high/50 transition-all hover:scale-105"
                  >
                    {entry.cityName}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <MedicalDisclaimer />
    </article>
  );
}
