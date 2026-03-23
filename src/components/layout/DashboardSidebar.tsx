'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Clock,
  TrendingUp,
  MessageSquare,
  Smartphone,
  Upload,
  Settings,
  Sparkles,
  Crown,
} from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/history', label: 'History', icon: Clock },
  { href: '/dashboard/trends', label: 'Trends', icon: TrendingUp },
  { href: '/dashboard/coach', label: 'AI Coach', icon: MessageSquare },
  { href: '/dashboard/devices', label: 'Devices', icon: Smartphone },
  { href: '/dashboard/import', label: 'Import', icon: Upload },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isPro, loading } = useSubscription();

  return (
    <aside className="w-64 shrink-0 border-r border-outline-variant/15 bg-surface-container/50 hidden lg:flex flex-col">
      {/* Plan badge */}
      <div className="p-4 border-b border-outline-variant/15">
        {!loading && (
          isPro ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-[#f9ca24]/15 to-[#f0932b]/15">
              <Crown className="w-4 h-4 text-[#f9ca24]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#f9ca24]">
                Pro Plan
              </span>
            </div>
          ) : (
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest transition-colors group"
            >
              <Sparkles className="w-4 h-4 text-[#f9ca24] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-on-surface-variant">
                Upgrade to Pro
              </span>
            </Link>
          )
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
              )}
            >
              <Icon className="w-4.5 h-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-outline-variant/15">
        <p className="text-xs text-on-surface-variant/50 text-center">
          Drift Sleep Dashboard
        </p>
      </div>
    </aside>
  );
}
