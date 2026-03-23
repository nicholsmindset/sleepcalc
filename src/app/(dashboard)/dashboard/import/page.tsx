'use client';

import { useState, useCallback } from 'react';
import { Upload, FileArchive, Loader2, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';

export default function ImportPage() {
  const { isPro } = useSubscription();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ imported: number; skipped: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImport = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress('Reading file...');

    try {
      const { parseAppleHealthExport } = await import('@/lib/integrations/apple-health');
      const sessions = await parseAppleHealthExport(file, (p) => setProgress(`${p.phase}: ${p.percent}%`));

      setProgress(`Uploading ${sessions.length} sessions...`);

      const res = await fetch('/api/upload/apple-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessions }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Upload failed');
        return;
      }

      setResult({ imported: data.imported, skipped: data.skipped ?? 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }, [file]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Upload className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-on-surface font-headline">Import Apple Health</h1>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-on-surface font-headline mb-2">How to Export</h2>
          <ol className="space-y-2 text-sm text-on-surface-variant list-decimal list-inside">
            <li>Open the <strong>Health</strong> app on your iPhone</li>
            <li>Tap your profile picture in the top right</li>
            <li>Scroll down and tap <strong>Export All Health Data</strong></li>
            <li>Save the ZIP file and upload it here</li>
          </ol>
        </div>

        {!isPro && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f9ca24]/10 border border-[#f9ca24]/20">
            <Sparkles className="w-5 h-5 text-[#f9ca24] shrink-0" />
            <p className="text-sm text-on-surface-variant">
              Free accounts: 1 import (7 days, 50 sessions max).{' '}
              <a href="/pricing" className="text-[#f9ca24] font-medium hover:underline">
                Upgrade for unlimited imports.
              </a>
            </p>
          </div>
        )}

        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            file ? 'border-primary/50 bg-primary/5' : 'border-outline-variant/30 hover:border-outline-variant/50'
          }`}
        >
          <input
            type="file"
            accept=".zip"
            className="hidden"
            id="health-upload"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setFile(f);
            }}
          />
          <label htmlFor="health-upload" className="cursor-pointer">
            <FileArchive className="w-10 h-10 text-on-surface-variant/50 mx-auto mb-3" />
            {file ? (
              <p className="text-sm font-medium text-on-surface">{file.name}</p>
            ) : (
              <p className="text-sm text-on-surface-variant">
                Click to select your <strong>export.zip</strong> file
              </p>
            )}
          </label>
        </div>

        {progress && (
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            {progress}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#ff6b6b]/10 text-[#ff6b6b] text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {result && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#55efc4]/10 text-[#55efc4] text-sm">
            <CheckCircle className="w-4 h-4 shrink-0" />
            Imported {result.imported} sessions{result.skipped > 0 ? ` (${result.skipped} duplicates skipped)` : ''}.
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={!file || loading}
          className="w-full btn-gradient py-3 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Import Sleep Data
            </>
          )}
        </button>
      </div>
    </div>
  );
}
