import { BASE_URL, buildUrlset, xmlResponse } from '@/lib/sitemap-xml';

export const dynamic = 'force-static';
export const revalidate = 86400;

export function GET() {
  const now = new Date().toISOString();

  const xml = buildUrlset([
    { loc: BASE_URL,                                          lastmod: now, changefreq: 'daily',   priority: 1.0 },
    { loc: `${BASE_URL}/calculators`,                         lastmod: now, changefreq: 'weekly',  priority: 0.9 },
    { loc: `${BASE_URL}/statistics`,                          lastmod: now, changefreq: 'monthly', priority: 0.9 },
    { loc: `${BASE_URL}/calculators/sleep-debt`,              lastmod: now, changefreq: 'monthly', priority: 0.8 },
    { loc: `${BASE_URL}/calculators/nap-calculator`,          lastmod: now, changefreq: 'monthly', priority: 0.8 },
    { loc: `${BASE_URL}/calculators/caffeine-cutoff`,         lastmod: now, changefreq: 'monthly', priority: 0.8 },
    { loc: `${BASE_URL}/calculators/shift-worker`,            lastmod: now, changefreq: 'monthly', priority: 0.8 },
    { loc: `${BASE_URL}/calculators/baby-sleep`,              lastmod: now, changefreq: 'monthly', priority: 0.8 },
    { loc: `${BASE_URL}/calculators/chronotype-quiz`,         lastmod: now, changefreq: 'monthly', priority: 0.8 },
    { loc: `${BASE_URL}/tonight`,                             lastmod: now, changefreq: 'daily',   priority: 0.8 },
    { loc: `${BASE_URL}/blog`,                                lastmod: now, changefreq: 'weekly',  priority: 0.8 },
    { loc: `${BASE_URL}/about`,                               lastmod: now, changefreq: 'monthly', priority: 0.4 },
    { loc: `${BASE_URL}/privacy`,                             lastmod: now, changefreq: 'yearly',  priority: 0.2 },
    { loc: `${BASE_URL}/terms`,                               lastmod: now, changefreq: 'yearly',  priority: 0.2 },
    { loc: `${BASE_URL}/medical-disclaimer`,                  lastmod: now, changefreq: 'yearly',  priority: 0.2 },
  ]);

  return xmlResponse(xml);
}
