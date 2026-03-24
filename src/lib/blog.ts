/**
 * Blog utilities — reads MDX files from src/content/blog/ and provides
 * frontmatter parsing, listing, and slug resolution.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  author: string;
  category: string;
  tags: string[];
  readingTime: number;
  image?: string;
  content: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  readingTime: number;
  image?: string;
}

function estimateReadingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.ceil(words / 230);
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '');
    const filePath = path.join(BLOG_DIR, filename);
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title ?? slug,
      description: data.description ?? '',
      date: data.date ?? new Date().toISOString(),
      author: data.author ?? 'Drift Sleep Team',
      category: data.category ?? 'Sleep Science',
      tags: data.tags ?? [],
      readingTime: estimateReadingTime(content),
      image: data.image,
    } satisfies BlogPostMeta;
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? '',
    date: data.date ?? new Date().toISOString(),
    updated: data.updated,
    author: data.author ?? 'Drift Sleep Team',
    category: data.category ?? 'Sleep Science',
    tags: data.tags ?? [],
    readingTime: estimateReadingTime(content),
    image: data.image,
    content,
  };
}

export function getCategories(): string[] {
  const posts = getAllPosts();
  return [...new Set(posts.map((p) => p.category))].sort();
}

export function getTags(): string[] {
  const posts = getAllPosts();
  return [...new Set(posts.flatMap((p) => p.tags))].sort();
}

export function getPostsByCategory(category: string): BlogPostMeta[] {
  return getAllPosts().filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

export function getPostsByTag(tag: string): BlogPostMeta[] {
  return getAllPosts().filter((p) =>
    p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

/** Convert a category or tag string to a URL-safe slug */
export function toSlug(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}
