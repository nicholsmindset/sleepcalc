'use client';

import { Smartphone, RefreshCw, Unplug, Plus, Loader2, AlertCircle } from 'lucide-react';
import { useDeviceSync } from '@/hooks/use-device-sync';
import { formatDistanceToNow } from 'date-fns';

const PROVIDER_META: Record<string, { name: string; color: string }> = {
  oura: { name: 'Oura Ring', color: '#d4a574' },
  fitbit: { name: 'Fitbit', color: '#00b0b9' },
  whoop: { name: 'WHOOP', color: '#ff3b3b' },
};

export function ConnectedDevices() {
  const { devices, loading, syncing, error, syncDevice, disconnectDevice } = useDeviceSync();

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-on-surface font-headline">Devices</h3>
        </div>
        <a
          href="/dashboard/devices"
          className="text-xs text-primary hover:text-primary-light transition-colors"
        >
          Manage
        </a>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#ff6b6b]/10 text-[#ff6b6b] text-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </div>
      )}

      {devices.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-on-surface-variant mb-3">No devices connected yet.</p>
          <a
            href="/dashboard/devices"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary/15 text-primary hover:bg-primary/25 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Connect Device
          </a>
        </div>
      ) : (
        <div className="space-y-2">
          {devices.map((device) => {
            const meta = PROVIDER_META[device.provider] ?? { name: device.provider, color: '#8b8ba7' };
            const isSyncing = syncing === device.provider;

            return (
              <div key={device.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-surface-container-high">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: meta.color }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{meta.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      {device.last_sync_at
                        ? `Synced ${formatDistanceToNow(new Date(device.last_sync_at), { addSuffix: true })}`
                        : 'Never synced'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => syncDevice(device.provider)}
                    disabled={isSyncing}
                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                    aria-label={`Sync ${device.provider} now`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => disconnectDevice(device.provider)}
                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-[#ff6b6b] hover:bg-[#ff6b6b]/10 transition-colors"
                    aria-label={`Disconnect ${device.provider}`}
                  >
                    <Unplug className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
