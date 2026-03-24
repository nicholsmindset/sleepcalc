import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { AuthorBox } from '@/components/content/AuthorBox';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
import { RelatedTools } from '@/components/content/RelatedTools';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Calendar, Clock } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} — Sleep Stack Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [post.author],
    },
    alternates: {
      canonical: `https://sleepstackapp.com/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 py-16">
      <SchemaMarkup
        type="Article"
        data={{
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.updated ?? post.date,
          author: {
            '@type': 'Person',
            name: post.author,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Sleep Stack',
            url: 'https://sleepstackapp.com',
          },
        }}
      />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: post.title, href: `/blog/${slug}` },
        ]}
      />

      <header className="mb-10">
        <span className="text-xs font-medium text-primary uppercase tracking-wider">
          {post.category}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-on-surface font-headline mt-3 mb-4">
          {post.title}
        </h1>
        <p className="text-lg text-on-surface-variant mb-6">{post.description}</p>
        <div className="flex items-center gap-6 text-sm text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {new Date(post.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {post.readingTime} min read
          </span>
        </div>
      </header>

      <div className="prose prose-invert prose-lg max-w-none prose-headings:font-headline prose-headings:text-on-surface prose-p:text-on-surface-variant prose-a:text-primary prose-strong:text-on-surface prose-code:text-[#46eae5] prose-code:bg-surface-container-high prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-blockquote:border-primary prose-blockquote:text-on-surface-variant prose-li:text-on-surface-variant">
        <MDXRemote source={post.content} />
      </div>

      <AuthorBox name={post.author} />
      <MedicalDisclaimer />
      <RelatedTools />
    </article>
  );
}
