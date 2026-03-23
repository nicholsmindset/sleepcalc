'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const callbackError = searchParams.get('error');

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  async function handleOAuthLogin(provider: 'google') {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  if (sent) {
    return (
      <div className="glass-card rounded-3xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-on-surface font-headline mb-3">
          Check your email
        </h1>
        <p className="text-on-surface-variant mb-6">
          We sent a magic link to <strong className="text-on-surface">{email}</strong>.
          Click the link in the email to sign in.
        </p>
        <button
          onClick={() => setSent(false)}
          className="text-sm text-primary hover:text-primary-light transition-colors"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-8">
      <h1 className="text-2xl font-bold text-on-surface font-headline text-center mb-2">
        Welcome back
      </h1>
      <p className="text-on-surface-variant text-center mb-8">
        Sign in to access your sleep dashboard
      </p>

      {(callbackError || error) && (
        <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 mb-6 text-sm text-danger">
          {error || 'Authentication failed. Please try again.'}
        </div>
      )}

      {/* Magic link form */}
      <form onSubmit={handleMagicLink} className="space-y-4 mb-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-on-surface mb-1.5">
            Email address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 bg-surface-container rounded-xl border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/50"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !email}
          className="btn-gradient w-full h-12 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Mail className="w-4 h-4" />
          )}
          Send Magic Link
        </button>
      </form>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant/20" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-surface-container-high px-3 text-on-surface-variant">
            or continue with
          </span>
        </div>
      </div>

      {/* OAuth buttons */}
      <div className="space-y-3 mb-8">
        <button
          onClick={() => handleOAuthLogin('google')}
          className="w-full h-12 rounded-xl border border-outline-variant/30 bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-center gap-3 text-sm font-medium text-on-surface"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>
      </div>

      {/* Device OAuth hint */}
      <div className="rounded-xl bg-surface-container p-4 mb-6">
        <p className="text-xs text-on-surface-variant text-center">
          Connect your <strong className="text-on-surface">Oura</strong>,{' '}
          <strong className="text-on-surface">Fitbit</strong>, or{' '}
          <strong className="text-on-surface">WHOOP</strong> after signing in to unlock
          personalized sleep insights.
        </p>
      </div>

      {/* Sign up link */}
      <p className="text-center text-sm text-on-surface-variant">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-primary hover:text-primary-light transition-colors font-medium">
          Sign up free
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="glass-card rounded-3xl p-8 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
