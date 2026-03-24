import { BASE_URL, buildUrlset, xmlResponse } from '@/lib/sitemap-xml';
import { getAllPosts } from '@/lib/blog';

export const dynamic = 'force-static';
export const revalidate = 604800; // 7 days

export function GET() {
  const urls = getAllPosts().map((post) => ({
    loc: `${BASE_URL}/blog/${post.slug}`,
    lastmod: post.date,
    changefreq: 'monthly',
    priority: 0.6,
  }));

  return xmlResponse(buildUrlset(urls));
}
