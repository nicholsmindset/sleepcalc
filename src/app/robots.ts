import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/sitemap-xml';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/api', '/login', '/signup', '/auth'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
