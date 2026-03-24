import { BASE_URL, buildUrlset, xmlResponse } from '@/lib/sitemap-xml';
import babySleepSchedules from '@/content/data/baby-sleep-schedules.json';

export const dynamic = 'force-static';
export const revalidate = 2592000;

export function GET() {
  const now = new Date().toISOString();

  const urls = (babySleepSchedules as Array<{ slug: string }>).map((b) => ({
    loc: `${BASE_URL}/baby-sleep-schedule/${b.slug}`,
    lastmod: now,
    changefreq: 'monthly',
    priority: 0.7,
  }));

  return xmlResponse(buildUrlset(urls));
}
