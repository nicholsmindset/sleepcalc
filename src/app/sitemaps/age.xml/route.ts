import { BASE_URL, buildUrlset, xmlResponse } from '@/lib/sitemap-xml';
import { DEFAULT_MODIFIED_DATE } from "@/utils/schema";
import ageRecs from '@/content/data/age-recs.json';

export const dynamic = 'force-static';
export const revalidate = 2592000;

export function GET() {
  // Stable lastmod aligned with the pages own JSON-LD dateModified — avoids
  // the false "modified on every build" signal that new Date() produced.
  const now = DEFAULT_MODIFIED_DATE;

  const urls = (ageRecs as Array<{ slug: string }>).map((a) => ({
    loc: `${BASE_URL}/age/${a.slug}`,
    lastmod: now,
    changefreq: 'monthly',
    priority: 0.7,
  }));

  return xmlResponse(buildUrlset(urls));
}
