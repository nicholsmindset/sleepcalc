import { BASE_URL, buildUrlset, xmlResponse } from '@/lib/sitemap-xml';
import conditions from '@/content/data/conditions.json';

export const dynamic = 'force-static';
export const revalidate = 2592000; // 30 days

export function GET() {
  const now = new Date().toISOString();

  const xml = buildUrlset(
    conditions.map((condition) => ({
      loc: `${BASE_URL}/sleep-with/${condition.slug}`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.6,
    }))
  );

  return xmlResponse(xml);
}
