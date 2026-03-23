import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, getCategories } from '@/lib/blog';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { BookOpen, Calendar, Clock } from 'lucide-react';
import { BlogListClient } from './blog-list-client';

export const metadata: Metadata = {
  title: 'Sleep Science Blog — Drift Sleep',
  description:
    'Evidence-based articles on sleep science, circadian rhythms, and practical tips to improve your sleep quality. Backed by research and real wearable data.',
  openGraph: {
    title: 'Sleep Science Blog — Drift Sleep',
    description: 'Evidence-based articles on sleep science, circadian rhythms, and practical tips.',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getCategories();

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <SchemaMarkup
        type="ItemList"
        data={{
          name: 'Drift Sleep Blog',
          description: 'Evidence-based sleep science articles',
          itemListElement: posts.map((post, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `https://sleepcyclecalc.com/blog/${post.slug}`,
            name: post.title,
          })),
        }}
      />

      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface font-headline">
            Sleep Science Blog
          </h1>
        </div>
        <p className="text-on-surface-variant max-w-lg mx-auto">
          Evidence-based articles to help you understand and improve your sleep.
        </p>
      </div>

      <BlogListClient posts={posts} categories={categories} />
    </div>
  );
}
