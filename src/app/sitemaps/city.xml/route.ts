import { BASE_URL, buildUrlset, xmlResponse } from '@/lib/sitemap-xml';
import { DEFAULT_MODIFIED_DATE } from '@/utils/schema';
import cities from '@/content/data/cities-seo.json';

export const dynamic = 'force-static';
export const revalidate = 2592000; // 30 days

export function GET() {
  // Stable lastmod aligned with the pages' own JSON-LD dateModified — avoids
  // the false "modified on every build" signal that new Date() produced.
  const now = DEFAULT_MODIFIED_DATE;

  const xml = buildUrlset(
    (cities as Array<{ slug: string }>).map((city) => ({
      loc: `${BASE_URL}/city/${city.slug}`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.6,
    }))
  );

  return xmlResponse(xml);
}
