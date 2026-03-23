import Link from 'next/link';
import { Moon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Moon className="w-16 h-16 text-primary/30 mx-auto mb-6" />
        <h1 className="text-6xl font-bold font-mono text-on-surface mb-2">404</h1>
        <h2 className="text-xl font-bold text-on-surface font-headline mb-4">
          This page is sleeping
        </h2>
        <p className="text-on-surface-variant mb-8">
          The page you are looking for does not exist or has been moved.
          Let us get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="btn-gradient px-6 py-3 text-sm font-medium"
          >
            Sleep Calculator
          </Link>
          <Link
            href="/blog"
            className="px-6 py-3 text-sm font-medium rounded-xl border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors"
          >
            Read the Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
