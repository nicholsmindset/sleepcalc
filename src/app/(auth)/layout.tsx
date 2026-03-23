import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-surface">
      {/* Logo */}
      <Link
        href="/"
        className="text-3xl font-bold tracking-tighter text-on-surface font-headline mb-8"
      >
        Drift Sleep
      </Link>

      {/* Auth card */}
      <div className="w-full max-w-md">
        {children}
      </div>

      {/* Back to home */}
      <p className="mt-8 text-sm text-on-surface-variant">
        <Link href="/" className="hover:text-on-surface transition-colors">
          &larr; Back to home
        </Link>
      </p>
    </div>
  );
}
