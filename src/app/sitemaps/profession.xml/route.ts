import { BASE_URL, buildUrlset, xmlResponse } from '@/lib/sitemap-xml';
import professions from '@/content/data/professions.json';

export const dynamic = 'force-static';
export const revalidate = 2592000;

export function GET() {
  const urls = (professions as Array<{ slug: string }>).map((p) => ({
    loc: `${BASE_URL}/profession/${p.slug}`,
    
    changefreq: 'monthly',
    priority: 0.7,
  }));

  return xmlResponse(buildUrlset(urls));
}
