import { BASE_URL, buildSitemapIndex, xmlResponse } from '@/lib/sitemap-xml';
import { DEFAULT_MODIFIED_DATE } from "@/utils/schema";

export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours

const SEGMENTS = [
  { name: 'core',            label: 'Core pages & calculators' },
  { name: 'tools',           label: 'Tool pages' },
  { name: 'sleep-time',      label: 'Sleep-time / wake-up pages' },
  { name: 'bedtime',         label: 'Bedtime pages' },
  { name: 'age',             label: 'Age-based sleep pages' },
  { name: 'profession',      label: 'Profession sleep pages' },
  { name: 'baby-sleep',      label: 'Baby sleep schedule pages' },
  { name: 'conditions',      label: 'Sleep condition pages' },
  { name: 'city',            label: 'Sleep-by-city pages' },
  { name: 'blog',            label: 'Blog posts' },
];

export function GET() {
  // Stable lastmod aligned with the pages own JSON-LD dateModified — avoids
  // the false "modified on every build" signal that new Date() produced.
  const now = DEFAULT_MODIFIED_DATE;

  const xml = buildSitemapIndex(
    SEGMENTS.map(({ name }) => ({
      loc: `${BASE_URL}/sitemaps/${name}.xml`,
      lastmod: now,
    }))
  );

  return xmlResponse(xml);
}
