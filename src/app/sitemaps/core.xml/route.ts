import { BASE_URL, buildUrlset, xmlResponse } from '@/lib/sitemap-xml';

export const dynamic = 'force-static';
export const revalidate = 86400;

export function GET() {
  const xml = buildUrlset([
    { loc: BASE_URL,                                          changefreq: 'daily',   priority: 1.0 },
    { loc: `${BASE_URL}/calculators`,                         changefreq: 'weekly',  priority: 0.9 },
    { loc: `${BASE_URL}/statistics`,                          changefreq: 'monthly', priority: 0.9 },
    { loc: `${BASE_URL}/calculators/sleep-debt`,              changefreq: 'monthly', priority: 0.8 },
    { loc: `${BASE_URL}/calculators/nap-calculator`,          changefreq: 'monthly', priority: 0.8 },
    { loc: `${BASE_URL}/calculators/caffeine-cutoff`,         changefreq: 'monthly', priority: 0.8 },
    { loc: `${BASE_URL}/calculators/shift-worker`,            changefreq: 'monthly', priority: 0.8 },
    { loc: `${BASE_URL}/calculators/baby-sleep`,              changefreq: 'monthly', priority: 0.8 },
    { loc: `${BASE_URL}/calculators/chronotype-quiz`,         changefreq: 'monthly', priority: 0.8 },
    { loc: `${BASE_URL}/tonight`,                             changefreq: 'daily',   priority: 0.8 },
    { loc: `${BASE_URL}/sleep-coach`,                         changefreq: 'monthly', priority: 0.8 },
    { loc: `${BASE_URL}/best-mattress`,                       changefreq: 'monthly', priority: 0.8 },
    { loc: `${BASE_URL}/blog`,                                changefreq: 'weekly',  priority: 0.8 },
    { loc: `${BASE_URL}/sleep-time`,                          changefreq: 'weekly',  priority: 0.8 },
    { loc: `${BASE_URL}/bedtime`,                             changefreq: 'weekly',  priority: 0.8 },
    { loc: `${BASE_URL}/age`,                                 changefreq: 'weekly',  priority: 0.8 },
    { loc: `${BASE_URL}/profession`,                          changefreq: 'weekly',  priority: 0.8 },
    { loc: `${BASE_URL}/city`,                                changefreq: 'weekly',  priority: 0.8 },
    { loc: `${BASE_URL}/baby-sleep-schedule`,                 changefreq: 'weekly',  priority: 0.8 },
    { loc: `${BASE_URL}/sleep-with`,                          changefreq: 'weekly',  priority: 0.8 },
    { loc: `${BASE_URL}/about`,                               changefreq: 'monthly', priority: 0.4 },
    { loc: `${BASE_URL}/privacy`,                             changefreq: 'yearly',  priority: 0.2 },
    { loc: `${BASE_URL}/terms`,                               changefreq: 'yearly',  priority: 0.2 },
    { loc: `${BASE_URL}/medical-disclaimer`,                  changefreq: 'yearly',  priority: 0.2 },
    { loc: `${BASE_URL}/editorial-policy`,                    changefreq: 'yearly',  priority: 0.3 },
  ]);

  return xmlResponse(xml);
}
