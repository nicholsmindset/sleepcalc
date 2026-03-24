import { BASE_URL, buildUrlset, xmlResponse } from '@/lib/sitemap-xml';
import sleepTimes from '@/content/data/sleep-times.json';

export const dynamic = 'force-static';
export const revalidate = 2592000; // 30 days

export function GET() {
  const now = new Date().toISOString();

  const urls = (sleepTimes as Array<{ slug: string; type: string }>)
    .filter((t) => t.type === 'wake')
    .map((t) => ({
      loc: `${BASE_URL}/sleep-time/${t.slug}`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.7,
    }));

  return xmlResponse(buildUrlset(urls));
}
