import { BASE_URL, buildSitemapIndex, xmlResponse } from '@/lib/sitemap-xml';

export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours

const SEGMENTS = [
  { name: 'core',            label: 'Core pages & calculators' },
  { name: 'sleep-time',      label: 'Sleep-time / wake-up pages' },
  { name: 'bedtime',         label: 'Bedtime pages' },
  { name: 'age',             label: 'Age-based sleep pages' },
  { name: 'profession',      label: 'Profession sleep pages' },
  { name: 'baby-sleep',      label: 'Baby sleep schedule pages' },
  { name: 'blog',            label: 'Blog posts' },
];

export function GET() {
  const now = new Date().toISOString();

  const xml = buildSitemapIndex(
    SEGMENTS.map(({ name }) => ({
      loc: `${BASE_URL}/sitemaps/${name}.xml`,
      lastmod: now,
    }))
  );

  return xmlResponse(xml);
}
