'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Download, Trash2, Star, ChevronDown, ChevronUp, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
import { RelatedTools } from '@/components/content/RelatedTools';
import { calculateSleepScore } from '@/utils/sleep-score';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface JournalEntry {
  id: string;
  date: string;          // ISO date YYYY-MM-DD
  bedtime: string;       // HH:MM
  wakeTime: string;      // HH:MM
  fallAsleepMin: number; // minutes to fall asleep
  wakeUps: number;
  quality: number;       // 1–5
  notes: string;
  // Computed on save
  durationMin: number;
  efficiencyPct: number;
  score: number;
}

const STORAGE_KEY = 'sleepstack_journal';
const MAX_ENTRIES = 90;

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                  */
/* -------------------------------------------------------------------------- */

function timeToMin(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + (m || 0);
}

function computeDuration(bedtime: string, wakeTime: string): number {
  let bedMin = timeToMin(bedtime);
  let wakeMin = timeToMin(wakeTime);
  if (wakeMin <= bedMin) wakeMin += 1440; // overnight
  return wakeMin - bedMin;
}

function computeEfficiency(durationMin: number, fallAsleepMin: number, wakeUps: number): number {
  const sleepMin = durationMin - fallAsleepMin - wakeUps * 10;
  return Math.min(100, Math.max(0, Math.round((sleepMin / durationMin) * 100)));
}

function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function fmt12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${suffix}`;
}

/* -------------------------------------------------------------------------- */
/*  localStorage                                                             */
/* -------------------------------------------------------------------------- */

function loadEntries(): JournalEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as JournalEntry[]) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: JournalEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-MAX_ENTRIES)));
}

/* -------------------------------------------------------------------------- */
/*  CSV Export                                                               */
/* -------------------------------------------------------------------------- */

function exportCSV(entries: JournalEntry[]): void {
  const header = 'Date,Bedtime,Wake Time,Duration (min),Sleep Efficiency (%),Wake Ups,Quality (1-5),Sleep Score,Notes';
  const rows = entries.map((e) =>
    [
      e.date,
      e.bedtime,
      e.wakeTime,
      e.durationMin,
      e.efficiencyPct,
      e.wakeUps,
      e.quality,
      e.score,
      `"${e.notes.replace(/"/g, '""')}"`,
    ].join(','),
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sleep-journal-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* -------------------------------------------------------------------------- */
/*  Log Form                                                                 */
/* -------------------------------------------------------------------------- */

const DEFAULT_FORM = {
  date: new Date().toISOString().slice(0, 10),
  bedtime: '22:30',
  wakeTime: '06:30',
  fallAsleepMin: 15,
  wakeUps: 0,
  quality: 4,
  notes: '',
};

function LogForm({ onAdd }: { onAdd: (entry: JournalEntry) => void }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [open, setOpen] = useState(true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const durationMin = computeDuration(form.bedtime, form.wakeTime);
    const efficiencyPct = computeEfficiency(durationMin, form.fallAsleepMin, form.wakeUps);
    const hours = durationMin / 60;

    const score = calculateSleepScore({
      hoursSlept: hours,
      sleepOnsetMinutes: form.fallAsleepMin,
      wakeUps: form.wakeUps,
      restedFeeling: form.quality,
      sleepDepth: form.quality,
      screenMinutes: 30,       // neutral default
      caffeineAfter2pm: false, // neutral default
      consistentBedtime: true, // neutral default
    }).total;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: form.date,
      bedtime: form.bedtime,
      wakeTime: form.wakeTime,
      fallAsleepMin: form.fallAsleepMin,
      wakeUps: form.wakeUps,
      quality: form.quality,
      notes: form.notes,
      durationMin,
      efficiencyPct,
      score,
    };
    onAdd(entry);
    setForm({ ...DEFAULT_FORM, date: new Date().toISOString().slice(0, 10) });
    setOpen(false);
  }

  const set = (field: keyof typeof DEFAULT_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));
  const setNum = (field: keyof typeof DEFAULT_FORM) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: Number(e.target.value) }));

  return (
    <div className="glass-card rounded-3xl overflow-hidden mb-6">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-on-surface hover:bg-surface-container-high/30 transition-all"
      >
        <div className="flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#46eae5]" />
          <span className="font-semibold text-sm">Log Last Night&apos;s Sleep</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-on-surface-variant" /> : <ChevronDown className="w-4 h-4 text-on-surface-variant" />}
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-on-surface-variant block mb-1">Date</label>
              <input type="date" value={form.date} onChange={set('date')}
                className="w-full bg-surface-container/60 rounded-xl px-3 py-2.5 text-sm text-on-surface border border-outline-variant/30 focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-on-surface-variant block mb-1">Bedtime</label>
              <input type="time" value={form.bedtime} onChange={set('bedtime')}
                className="w-full bg-surface-container/60 rounded-xl px-3 py-2.5 text-sm text-on-surface border border-outline-variant/30 focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-on-surface-variant block mb-1">Wake Time</label>
              <input type="time" value={form.wakeTime} onChange={set('wakeTime')}
                className="w-full bg-surface-container/60 rounded-xl px-3 py-2.5 text-sm text-on-surface border border-outline-variant/30 focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-on-surface-variant block mb-1">
                Fall Asleep (min)
              </label>
              <input type="number" min={0} max={180} step={5} value={form.fallAsleepMin} onChange={setNum('fallAsleepMin')}
                className="w-full bg-surface-container/60 rounded-xl px-3 py-2.5 text-sm text-on-surface border border-outline-variant/30 focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-on-surface-variant block mb-1">Wake-ups</label>
              <input type="number" min={0} max={20} step={1} value={form.wakeUps} onChange={setNum('wakeUps')}
                className="w-full bg-surface-container/60 rounded-xl px-3 py-2.5 text-sm text-on-surface border border-outline-variant/30 focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-on-surface-variant block mb-1">Quality (1–5)</label>
              <div className="flex gap-1 mt-1.5">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, quality: v }))}
                    className="flex-1 aspect-square rounded-lg transition-all flex items-center justify-center text-lg"
                    style={{
                      background: v <= form.quality ? 'rgba(246,202,34,0.2)' : 'rgba(255,255,255,0.04)',
                    }}
                  >
                    <Star className={`w-3.5 h-3.5 ${v <= form.quality ? 'text-[#f9ca24]' : 'text-on-surface-variant/40'}`} fill={v <= form.quality ? '#f9ca24' : 'none'} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-on-surface-variant block mb-1">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={set('notes')}
              rows={2}
              placeholder="Stress, exercise, caffeine, supplements…"
              className="w-full bg-surface-container/60 rounded-xl px-3 py-2.5 text-sm text-on-surface border border-outline-variant/30 focus:border-primary focus:outline-none resize-none placeholder:text-on-surface-variant/40"
            />
          </div>

          <div className="flex justify-between items-center text-xs text-on-surface-variant">
            <span>
              Duration:{' '}
              <span className="text-on-surface font-mono font-semibold">
                {formatDuration(computeDuration(form.bedtime, form.wakeTime))}
              </span>
            </span>
            <span>
              Efficiency:{' '}
              <span className="text-on-surface font-mono font-semibold">
                {computeEfficiency(computeDuration(form.bedtime, form.wakeTime), form.fallAsleepMin, form.wakeUps)}%
              </span>
            </span>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl py-3 text-sm font-semibold transition-all"
            style={{ background: 'linear-gradient(135deg, #6c5ce7, #00cec9)', color: '#fff' }}
          >
            Save Entry
          </button>
        </form>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Trend Chart                                                              */
/* -------------------------------------------------------------------------- */

function TrendChart({ entries }: { entries: JournalEntry[] }) {
  const data = useMemo(
    () =>
      entries
        .slice(-30)
        .map((e) => ({
          date: e.date.slice(5), // MM-DD
          duration: Math.round((e.durationMin / 60) * 10) / 10,
          score: e.score,
        })),
    [entries],
  );

  if (data.length < 2) return null;

  return (
    <div className="glass-card rounded-3xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-4 h-4 text-[#46eae5]" />
        <h2 className="font-headline text-lg font-bold text-on-surface">30-Day Trend</h2>
      </div>
      <div className="flex gap-4 text-xs text-on-surface-variant mb-4">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5 bg-[#c6bfff] rounded" /> Duration (h)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5 bg-[#46eae5] rounded" /> Sleep Score
        </span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <XAxis dataKey="date" tick={{ fill: '#8b8ba7', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fill: '#8b8ba7', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: '#12122a', border: '1px solid #2d2d6e', borderRadius: 12, fontSize: 12 }}
            labelStyle={{ color: '#8b8ba7' }}
            itemStyle={{ color: '#f1f1f7' }}
          />
          <Line type="monotone" dataKey="duration" stroke="#c6bfff" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="score" stroke="#46eae5" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Weekly/Monthly Summary                                                  */
/* -------------------------------------------------------------------------- */

function summarise(entries: JournalEntry[], days: number) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const recent = entries.filter((e) => new Date(e.date) >= cutoff);
  if (!recent.length) return null;
  const avgDuration = recent.reduce((s, e) => s + e.durationMin, 0) / recent.length;
  const avgScore = recent.reduce((s, e) => s + e.score, 0) / recent.length;
  const avgEff = recent.reduce((s, e) => s + e.efficiencyPct, 0) / recent.length;
  return {
    n: recent.length,
    avgDuration: Math.round(avgDuration),
    avgScore: Math.round(avgScore),
    avgEff: Math.round(avgEff),
  };
}

/* -------------------------------------------------------------------------- */
/*  Entry Row                                                                */
/* -------------------------------------------------------------------------- */

function EntryRow({ entry, onDelete }: { entry: JournalEntry; onDelete: (id: string) => void }) {
  const scoreColor = entry.score >= 85 ? '#46eae5' : entry.score >= 70 ? '#55efc4' : entry.score >= 55 ? '#f9ca24' : entry.score >= 40 ? '#fdcb6e' : '#ff6b6b';
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-surface-container-high/30 transition-all group">
      <div className="w-14 shrink-0 text-center">
        <p className="font-mono font-bold text-lg" style={{ color: scoreColor }}>{entry.score}</p>
        <p className="text-[10px] text-on-surface-variant">score</p>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex gap-3 flex-wrap items-baseline">
          <span className="text-xs font-semibold text-on-surface">{entry.date}</span>
          <span className="font-mono text-xs text-[#c6bfff]">{fmt12(entry.bedtime)} – {fmt12(entry.wakeTime)}</span>
          <span className="text-xs text-on-surface-variant">{formatDuration(entry.durationMin)}</span>
          <span className="text-xs text-on-surface-variant">{entry.efficiencyPct}% eff.</span>
          <span className="flex">
            {[1,2,3,4,5].map((v) => (
              <Star key={v} className={`w-2.5 h-2.5 ${v <= entry.quality ? 'text-[#f9ca24]' : 'text-on-surface-variant/20'}`} fill={v <= entry.quality ? '#f9ca24' : 'none'} />
            ))}
          </span>
        </div>
        {entry.notes && (
          <p className="text-[11px] text-on-surface-variant/70 mt-0.5 truncate">{entry.notes}</p>
        )}
      </div>
      <button
        onClick={() => onDelete(entry.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-[#ff6b6b]/20 text-on-surface-variant hover:text-[#ff6b6b]"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                     */
/* -------------------------------------------------------------------------- */

export default function SleepJournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEntries(loadEntries());
    setHydrated(true);
  }, []);

  const addEntry = useCallback((entry: JournalEntry) => {
    setEntries((prev) => {
      const updated = [...prev.filter((e) => e.id !== entry.id), entry].sort((a, b) =>
        a.date.localeCompare(b.date),
      );
      saveEntries(updated);
      return updated;
    });
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      saveEntries(updated);
      return updated;
    });
  }, []);

  const weekly = useMemo(() => summarise(entries, 7), [entries]);
  const monthly = useMemo(() => summarise(entries, 30), [entries]);

  const sortedEntries = useMemo(() => [...entries].reverse(), [entries]);

  if (!hydrated) return null;

  return (
    <main className="mx-auto max-w-2xl px-4 pb-20 pt-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">Free Tool</p>
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
          Sleep Journal
        </h1>
        <p className="text-on-surface-variant text-sm leading-relaxed max-w-lg">
          Track your sleep daily, spot patterns over time, and export your data to CSV. Everything
          stays private — stored only in your browser.
        </p>
      </div>

      {/* Log form */}
      <LogForm onAdd={addEntry} />

      {/* Summary stats */}
      {(weekly || monthly) && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {weekly && (
            <div className="glass-card rounded-2xl p-4 text-center">
              <p className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-2">7-Day Avg</p>
              <p className="font-mono text-2xl font-bold text-[#46eae5]">{weekly.avgScore}</p>
              <p className="text-xs text-on-surface-variant">sleep score</p>
              <p className="text-xs text-on-surface-variant mt-1">
                {formatDuration(weekly.avgDuration)} · {weekly.avgEff}% eff.
              </p>
            </div>
          )}
          {monthly && (
            <div className="glass-card rounded-2xl p-4 text-center">
              <p className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-2">30-Day Avg</p>
              <p className="font-mono text-2xl font-bold text-[#c6bfff]">{monthly.avgScore}</p>
              <p className="text-xs text-on-surface-variant">sleep score</p>
              <p className="text-xs text-on-surface-variant mt-1">
                {formatDuration(monthly.avgDuration)} · {monthly.avgEff}% eff.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Trend chart */}
      <TrendChart entries={entries} />

      {/* History */}
      {sortedEntries.length > 0 ? (
        <div className="glass-card rounded-3xl overflow-hidden mb-6">
          <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/20">
            <h2 className="font-semibold text-sm text-on-surface">History ({entries.length} entries)</h2>
            <button
              onClick={() => exportCSV(entries)}
              className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
          <div className="divide-y divide-outline-variant/10">
            {sortedEntries.map((entry) => (
              <EntryRow key={entry.id} entry={entry} onDelete={deleteEntry} />
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-10 text-center mb-6">
          <p className="text-3xl mb-3">😴</p>
          <p className="text-sm text-on-surface-variant">No entries yet. Log your first night above.</p>
        </div>
      )}

      {/* Long-form content */}
      <section className="space-y-8 mt-8">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Why Keep a Sleep Journal?
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Sleep tracking is one of the most evidence-backed behavioural interventions for improving
              sleep quality. Simply recording your sleep — even manually — activates metacognitive
              awareness that tends to motivate better habits. Cognitive-Behavioural Therapy for Insomnia
              (CBT-I), the gold-standard treatment for chronic insomnia, uses sleep diary data as the
              foundation for all adjustments to sleep schedules and stimulus control.
            </p>
            <p>
              Unlike wearable devices, a manual journal captures nuanced information that sensors
              miss: what you ate or drank, stress levels, exercise timing, and subjective experiences like
              vivid dreams or mid-night anxiety. Over weeks, patterns emerge that explain persistent
              sleep problems in ways that raw duration data alone cannot.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Understanding Your Sleep Efficiency Score
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Sleep efficiency is the percentage of time in bed that you actually spend asleep. It&apos;s
              calculated as: (time asleep ÷ time in bed) × 100. A healthy sleep efficiency is 85% or
              higher. Chronic insomniacs often show efficiencies below 70%, meaning they spend significant
              time in bed lying awake.
            </p>
            <p>
              CBT-I uses a technique called <strong className="text-on-surface">sleep restriction
              therapy</strong> — temporarily limiting time in bed to match actual sleep time — to rapidly
              improve efficiency. As efficiency climbs above 85%, time in bed is gradually extended. This
              is one of the most effective insomnia treatments available, though it requires guidance to
              implement safely.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-12">
        <RelatedTools exclude="/tools/sleep-journal" />
      </div>

      <MedicalDisclaimer />
    </main>
  );
}
