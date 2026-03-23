'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { DeviceConnection } from '@/lib/supabase/types';

interface UseDeviceSyncReturn {
  devices: DeviceConnection[];
  loading: boolean;
  syncing: string | null;
  error: string | null;
  syncDevice: (provider: string) => Promise<void>;
  disconnectDevice: (provider: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useDeviceSync(): UseDeviceSyncReturn {
  const [devices, setDevices] = useState<DeviceConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('device_connections')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setDevices((data as DeviceConnection[]) ?? []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const syncDevice = useCallback(async (provider: string) => {
    setSyncing(provider);
    setError(null);

    try {
      const res = await fetch(`/api/sync/${provider}`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Sync failed');
      }
      await fetchDevices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setSyncing(null);
    }
  }, [fetchDevices]);

  const disconnectDevice = useCallback(async (provider: string) => {
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('device_connections')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('provider', provider);

      await fetchDevices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Disconnect failed');
    }
  }, [fetchDevices]);

  return {
    devices,
    loading,
    syncing,
    error,
    syncDevice,
    disconnectDevice,
    refresh: fetchDevices,
  };
}
