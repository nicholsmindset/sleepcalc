'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, CreditCard, Trash2, Download, Loader2, LogOut } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const { user, profile, loading, signOut } = useUser();
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const isPro = profile?.subscription_tier === 'pro';

  // Initialize displayName when profile loads
  if (profile && !displayName && profile.display_name) {
    setDisplayName(profile.display_name);
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    await supabase
      .from('profiles')
      .update({ display_name: displayName })
      .eq('id', user.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleSignOut() {
    await signOut();
    router.push('/');
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-on-surface font-headline">Settings</h1>
      </div>

      {/* Profile section */}
      <section className="glass-card rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-on-surface font-headline mb-4">Profile</h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-on-surface-variant mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={user.email ?? ''}
              disabled
              className="h-11 bg-surface-container rounded-xl border-outline-variant/30 text-on-surface-variant opacity-60"
            />
          </div>
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-on-surface-variant mb-1">
              Display Name
            </label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="h-11 bg-surface-container rounded-xl border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/50"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="btn-gradient px-6 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </form>
      </section>

      {/* Subscription section */}
      <section className="glass-card rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-on-surface font-headline mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Subscription
        </h2>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-on-surface-variant">Current plan:</span>
          {isPro ? (
            <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-gradient-to-r from-[#f9ca24] to-[#f0932b] text-[#0a0a1a]">
              PRO
            </span>
          ) : (
            <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant">
              FREE
            </span>
          )}
        </div>

        {isPro ? (
          <p className="text-sm text-on-surface-variant mb-4">
            Manage your subscription, update payment method, or cancel through the Stripe portal.
          </p>
        ) : (
          <p className="text-sm text-on-surface-variant mb-4">
            Unlock unlimited AI coaching, 90-day history, and ad-free experience.
          </p>
        )}

        {isPro ? (
          <button
            onClick={() => {
              // In production, this would call an API route that creates a Stripe portal session
              // For now, link to pricing as a fallback
              router.push('/pricing');
            }}
            className="px-6 py-2.5 text-sm font-medium rounded-xl border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors"
          >
            Manage Subscription
          </button>
        ) : (
          <a
            href="/pricing"
            className="inline-block px-6 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-[#f9ca24] to-[#f0932b] text-[#0a0a1a] hover:opacity-90 transition-opacity"
          >
            Upgrade to Pro
          </a>
        )}
      </section>

      {/* Data section */}
      <section className="glass-card rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-on-surface font-headline mb-4 flex items-center gap-2">
          <Download className="w-5 h-5" />
          Data
        </h2>
        <p className="text-sm text-on-surface-variant mb-4">
          Export all your sleep data as a JSON file.
        </p>
        <button
          className="px-6 py-2.5 text-sm font-medium rounded-xl border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors"
          onClick={() => {
            // TODO: Implement data export
            alert('Data export coming soon!');
          }}
        >
          Export My Data
        </button>
      </section>

      {/* Danger zone */}
      <section className="rounded-2xl border border-danger/20 p-6">
        <h2 className="text-lg font-bold text-danger font-headline mb-4 flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Danger Zone
        </h2>

        <div className="space-y-4">
          <div>
            <button
              onClick={handleSignOut}
              className="px-6 py-2.5 text-sm font-medium rounded-xl border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
          <div>
            <p className="text-sm text-on-surface-variant mb-3">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button
              className="px-6 py-2.5 text-sm font-medium rounded-xl border border-danger/30 text-danger hover:bg-danger/10 transition-colors"
              onClick={() => {
                // TODO: Implement account deletion
                alert('Account deletion coming soon. Contact support for now.');
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
