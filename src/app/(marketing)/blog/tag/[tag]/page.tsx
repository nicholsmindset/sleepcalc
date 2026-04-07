import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTags, getPostsByTag, toSlug } from '@/lib/blog';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Tag, Calendar, Clock } from 'lucide-react';

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = getTags();
  return tags.map((tag) => ({ tag: toSlug(tag) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag: tagSlug } = await params;
  const tags = getTags();
  const tag = tags.find((t) => toSlug(t) === tagSlug);

  if (!tag) return { title: 'Tag Not Found' };

  return {
    title: `"${tag}" Articles — Sleep Stack`,
    description: `Browse all articles tagged "${tag}" on Sleep Stack. Science-backed sleep guides and research.`,
    alternates: {
      canonical: `/blog/tag/${tagSlug}`,
    },
    openGraph: {
      title: `"${tag}" Articles — Sleep Stack`,
      description: `Sleep Stack articles tagged "${tag}".`,
    },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag: tagSlug } = await params;
  const tags = getTags();
  const tag = tags.find((t) => toSlug(t) === tagSlug);

  if (!tag) notFound();

  const posts = getPostsByTag(tag);

  return (
    <div className="max-w-5xl mx-auto px-4 pt-4 pb-16">
      <SchemaMarkup
        type="ItemList"
        data={{
          name: `"${tag}" — Sleep Stack Blog`,
          description: `All articles tagged "${tag}" on Sleep Stack`,
          itemListElement: posts.map((post, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `https://sleepstackapp.com/blog/${post.slug}`,
            name: post.title,
          })),
        }}
      />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: tag, href: `/blog/tag/${tagSlug}` },
        ]}
      />

      <div className="mt-8 mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-6 h-6 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface font-headline">
            {tag}
          </h1>
        </div>
        <p className="text-on-surface-variant max-w-lg">
          {posts.length} article{posts.length !== 1 ? 's' : ''} tagged &quot;{tag}&quot;.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
            <article className="glass-card rounded-2xl p-6 h-full hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-3">
                <Calendar className="w-3 h-3" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span>·</span>
                <Clock className="w-3 h-3" />
                <span>{post.readingTime} min read</span>
              </div>
              <h2 className="text-base font-bold text-on-surface font-headline mb-2 group-hover:text-primary transition-colors leading-snug">
                {post.title}
              </h2>
              <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">
                {post.description}
              </p>
            </article>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/blog"
          className="text-sm text-primary hover:text-primary-light underline underline-offset-2"
        >
          ← All articles
        </Link>
      </div>
    </div>
  );
}
