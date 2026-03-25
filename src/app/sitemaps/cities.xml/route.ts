import { BASE_URL, buildUrlset, xmlResponse } from '@/lib/sitemap-xml';
import cities from '@/content/data/cities-seo.json';

export const dynamic = 'force-static';
export const revalidate = 2592000; // 30 days

export function GET() {
  const now = new Date().toISOString();

  const xml = buildUrlset(
    cities.map((city) => ({
      loc: `${BASE_URL}/city/${city.slug}`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.6,
    }))
  );

  return xmlResponse(xml);
}
