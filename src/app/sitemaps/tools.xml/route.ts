import { BASE_URL, buildUrlset, xmlResponse } from '@/lib/sitemap-xml';
import { DEFAULT_MODIFIED_DATE } from "@/utils/schema";

export const dynamic = 'force-static';
export const revalidate = 86400;

const TOOL_PATHS = [
  '/tools/circadian-guide',
  '/tools/jet-lag-calculator',
  '/tools/sleep-score',
  '/tools/moon-sleep',
  '/tools/dst-calculator',
  '/tools/sleep-journal',
  '/tools/sleep-foods',
  '/tools/white-noise',
];

export function GET() {
  // Stable lastmod aligned with the pages own JSON-LD dateModified — avoids
  // the false "modified on every build" signal that new Date() produced.
  const now = DEFAULT_MODIFIED_DATE;

  const xml = buildUrlset(
    TOOL_PATHS.map((path) => ({
      loc: `${BASE_URL}${path}`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.8,
    }))
  );

  return xmlResponse(xml);
}
