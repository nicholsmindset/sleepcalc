import { BASE_URL, buildUrlset, xmlResponse } from '@/lib/sitemap-xml';
import ageRecs from '@/content/data/age-recs.json';

export const dynamic = 'force-static';
export const revalidate = 2592000;

export function GET() {
  const now = new Date().toISOString();

  const urls = (ageRecs as Array<{ slug: string }>).map((a) => ({
    loc: `${BASE_URL}/age/${a.slug}`,
    lastmod: now,
    changefreq: 'monthly',
    priority: 0.7,
  }));

  return xmlResponse(buildUrlset(urls));
}
