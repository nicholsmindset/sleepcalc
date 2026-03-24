'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Trash2,
  Download,
  Loader2,
  LogOut,
  User,
  Moon,
  Bell,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { Input } from '@/components/ui/input';

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Phoenix',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Australia/Sydney',
  'Pacific/Auckland',
];

export default function SettingsPage() {
  const { user, profile, loading, error, signOut } = useUser();
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [ageYears, setAgeYears] = useState('');
  const [sleepGoalHours, setSleepGoalHours] = useState('8');
  const [emailDigest, setEmailDigest] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Initialize form fields when profile loads
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? '');
      setTimezone(profile.timezone ?? 'America/New_York');
      setAgeYears(profile.age_years ? String(profile.age_years) : '');
      setSleepGoalHours(
        (profile.preferences as Record<string, unknown>)?.sleep_goal_hours
          ? String((profile.preferences as Record<string, unknown>).sleep_goal_hours)
          : '8'
      );
      setEmailDigest(
        (profile.preferences as Record<string, unknown>)?.email_digest !== false
      );
    }
  }, [profile]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaveError(null);

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          display_name: displayName || null,
          timezone,
          age_years: ageYears ? parseInt(ageYears, 10) : null,
          preferences: {
            ...(profile?.preferences as object ?? {}),
            sleep_goal_hours: parseFloat(sleepGoalHours) || 8,
            email_digest: emailDigest,
          },
        })
        .eq('id', user.id);

      if (updateError) throw updateError;
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  }

  async function handleExportData() {
    if (!user) return;
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data } = await supabase
        .from('sleep_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('bedtime_start', { ascending: false });

      const blob = new Blob([JSON.stringify(data ?? [], null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `drift-sleep-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Export failed. Please try again.');
    }
  }

  async function handleSignOut() {
    await signOut();
    router.push('/');
    router.refresh();
  }

  async function handleDeleteAccount() {
    if (deleteConfirmText !== 'DELETE') return;
    if (!user) return;
    // In production: call an API route to delete all user data + cancel Stripe + delete auth user
    alert('Account deletion is handled by contacting support at privacy@driftsleep.com for now.');
    setShowDeleteConfirm(false);
    setDeleteConfirmText('');
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Skeleton loaders */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
            <div className="h-5 w-32 bg-surface-container-high rounded mb-4" />
            <div className="space-y-3">
              <div className="h-11 bg-surface-container-high rounded-xl" />
              <div className="h-11 bg-surface-container-high rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="glass-card rounded-2xl p-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#ff6b6b] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-on-surface mb-1">Could not load settings</p>
            <p className="text-xs text-on-surface-variant">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-xs text-primary hover:text-primary-light transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
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
        <h2 className="text-lg font-bold text-on-surface font-headline mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Profile
        </h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-on-surface-variant mb-1.5">
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
            <label htmlFor="displayName" className="block text-sm font-medium text-on-surface-variant mb-1.5">
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="ageYears" className="block text-sm font-medium text-on-surface-variant mb-1.5">
                Age (years)
              </label>
              <Input
                id="ageYears"
                type="number"
                min="13"
                max="120"
                value={ageYears}
                onChange={(e) => setAgeYears(e.target.value)}
                placeholder="e.g. 32"
                className="h-11 bg-surface-container rounded-xl border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/50"
              />
            </div>
            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-on-surface-variant mb-1.5">
                Timezone
              </label>
              <select
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full h-11 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz} className="bg-[#12122a]">
                    {tz.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sleep preferences */}
          <div className="pt-2 border-t border-outline-variant/15">
            <h3 className="text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">
              <Moon className="w-4 h-4 text-primary" />
              Sleep Preferences
            </h3>
            <div>
              <label htmlFor="sleepGoal" className="block text-sm font-medium text-on-surface-variant mb-1.5">
                Nightly sleep goal (hours)
              </label>
              <select
                id="sleepGoal"
                value={sleepGoalHours}
                onChange={(e) => setSleepGoalHours(e.target.value)}
                className="w-full h-11 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                {['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'].map((h) => (
                  <option key={h} value={h} className="bg-[#12122a]">
                    {h} hours
                  </option>
                ))}
              </select>
              <p className="text-xs text-on-surface-variant mt-1.5">
                Used to calculate your sleep score and recommendations
              </p>
            </div>
          </div>

          {saveError && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#ff6b6b]/10 text-[#ff6b6b] text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {saveError}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="btn-gradient px-6 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4" />
            ) : null}
            {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </section>

      {/* Notifications */}
      <section className="glass-card rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-on-surface font-headline mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Notifications
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-on-surface">Weekly sleep digest</p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              AI-powered summary sent every Monday
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEmailDigest(!emailDigest)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              emailDigest ? 'bg-primary' : 'bg-surface-container-high'
            }`}
            aria-pressed={emailDigest}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                emailDigest ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Data management */}
      <section className="glass-card rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-on-surface font-headline mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-primary" />
          Data
        </h2>
        <p className="text-sm text-on-surface-variant mb-4">
          Download all your sleep sessions as a JSON file. Includes raw data from all connected devices.
        </p>
        <button
          onClick={handleExportData}
          className="px-6 py-2.5 text-sm font-medium rounded-xl border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export My Data
        </button>
      </section>

      {/* Danger zone */}
      <section className="rounded-2xl border border-[#ff6b6b]/20 p-6">
        <h2 className="text-lg font-bold text-[#ff6b6b] font-headline mb-4 flex items-center gap-2">
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
          <div className="pt-4 border-t border-outline-variant/15">
            <p className="text-sm text-on-surface-variant mb-3">
              Permanently delete your account and all associated sleep data. This cannot be undone.
            </p>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-2.5 text-sm font-medium rounded-xl border border-[#ff6b6b]/30 text-[#ff6b6b] hover:bg-[#ff6b6b]/10 transition-colors"
              >
                Delete Account
              </button>
            ) : (
              <div className="space-y-3 p-4 rounded-xl bg-[#ff6b6b]/5 border border-[#ff6b6b]/20">
                <p className="text-sm text-[#ff6b6b] font-medium">
                  Type <strong>DELETE</strong> to confirm
                </p>
                <Input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="h-10 bg-surface-container rounded-xl border-[#ff6b6b]/30 text-on-surface"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== 'DELETE'}
                    className="px-4 py-2 text-sm font-medium rounded-xl bg-[#ff6b6b] text-white hover:bg-[#ff5252] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }}
                    className="px-4 py-2 text-sm font-medium rounded-xl border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
