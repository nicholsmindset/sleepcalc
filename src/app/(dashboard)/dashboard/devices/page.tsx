'use client';

import { ConnectedDevices } from '@/components/dashboard/ConnectedDevices';
import { Smartphone } from 'lucide-react';

export default function DevicesPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Smartphone className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-on-surface font-headline">Connected Devices</h1>
      </div>

      <ConnectedDevices />

      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-lg font-bold text-on-surface font-headline mb-3">How It Works</h2>
        <ol className="space-y-3 text-sm text-on-surface-variant list-decimal list-inside">
          <li>Click &quot;Connect&quot; on your device above</li>
          <li>Authorize Drift Sleep to read your sleep data</li>
          <li>Your data syncs automatically every day</li>
          <li>View insights on your dashboard and get AI coaching</li>
        </ol>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-lg font-bold text-on-surface font-headline mb-3">Privacy</h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          We only read your sleep data — never write to your device. Your OAuth tokens are
          encrypted at rest using AES-256-GCM. You can disconnect at any time and we&apos;ll
          remove all stored tokens.
        </p>
      </div>
    </div>
  );
}
