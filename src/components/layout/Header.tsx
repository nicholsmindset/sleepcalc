'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, ChevronDown, LogOut, Settings, LayoutDashboard, User } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUser } from '@/hooks/use-user';

const calculatorLinks = [
  { label: 'Sleep Calculator', href: '/' },
  { label: 'Sleep Debt', href: '/calculators/sleep-debt' },
  { label: 'Nap Calculator', href: '/calculators/nap-calculator' },
  { label: 'Caffeine Cutoff', href: '/calculators/caffeine-cutoff' },
  { label: 'Shift Worker', href: '/calculators/shift-worker' },
  { label: 'Baby Sleep', href: '/calculators/baby-sleep' },
  { label: 'Chronotype Quiz', href: '/calculators/chronotype-quiz' },
];

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Statistics', href: '/statistics' },
];

function getInitials(email: string | null | undefined, name: string | null | undefined): string {
  if (name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return 'U';
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [calcDropdown, setCalcDropdown] = useState(false);
  const { user, profile, loading, signOut } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  const isPro = profile?.subscription_tier === 'pro';
  const initials = getInitials(user?.email, profile?.display_name);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#121222]/80 backdrop-blur-xl shadow-ambient">
      <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tighter text-on-surface font-headline"
        >
          Drift Sleep
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-headline font-medium text-sm tracking-tight text-on-surface/60 hover:text-on-surface transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* Calculators dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCalcDropdown(true)}
            onMouseLeave={() => setCalcDropdown(false)}
          >
            <button className="font-headline font-medium text-sm tracking-tight text-on-surface/60 hover:text-on-surface transition-colors flex items-center gap-1">
              Calculators
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {calcDropdown && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                <div className="glass-card rounded-2xl p-3 min-w-[220px] shadow-ambient">
                  {calculatorLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 rounded-xl text-sm text-on-surface/70 hover:text-on-surface hover:bg-surface-container-high/50 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-surface-container animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              {isPro && (
                <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-[#f9ca24] to-[#f0932b] text-[#0a0a1a]">
                  PRO
                </span>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-full">
                  <Avatar className="cursor-pointer ring-2 ring-outline-variant/30 hover:ring-primary/50 transition-all">
                    <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="w-56 bg-surface-container-high border border-outline-variant/20 rounded-xl p-1.5">
                  <DropdownMenuLabel className="px-3 py-2">
                    <p className="text-sm font-medium text-on-surface truncate">
                      {profile?.display_name || user.email}
                    </p>
                    {profile?.display_name && (
                      <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-outline-variant/20" />
                  <DropdownMenuItem className="px-3 py-2 rounded-lg cursor-pointer text-on-surface/80 hover:text-on-surface" onClick={() => router.push('/dashboard')}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-3 py-2 rounded-lg cursor-pointer text-on-surface/80 hover:text-on-surface" onClick={() => router.push('/dashboard/settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  {!isPro && (
                    <DropdownMenuItem className="px-3 py-2 rounded-lg cursor-pointer text-[#f9ca24] hover:text-[#f0932b]" onClick={() => router.push('/pricing')}>
                      <User className="w-4 h-4 mr-2" />
                      Upgrade to Pro
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-outline-variant/20" />
                  <DropdownMenuItem className="px-3 py-2 rounded-lg cursor-pointer text-danger hover:text-danger" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="font-headline font-medium text-sm tracking-tight text-on-surface/60 hover:text-on-surface transition-colors"
              >
                Log In
              </Link>
              <Link href="/signup" className="btn-gradient">
                Sign Up Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            className="md:hidden p-2 text-on-surface"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-surface-dim border-outline-variant/15 w-[300px]"
          >
            <SheetTitle className="text-on-surface font-headline text-lg mb-6">
              Menu
            </SheetTitle>

            {/* User info in mobile menu */}
            {user && (
              <div className="px-4 py-3 mb-4 rounded-xl bg-surface-container">
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">
                      {profile?.display_name || user.email}
                    </p>
                    {isPro && (
                      <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#f9ca24] to-[#f0932b] text-[#0a0a1a]">
                        PRO
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl text-on-surface/70 hover:text-on-surface hover:bg-surface-container-high/50 transition-colors font-medium flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <div className="border-t border-outline-variant/15 my-2" />
                </>
              )}

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-on-surface/70 hover:text-on-surface hover:bg-surface-container-high/50 transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}

              <div className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant mt-4">
                Calculators
              </div>
              {calculatorLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm text-on-surface/60 hover:text-on-surface hover:bg-surface-container-high/50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-outline-variant/15 my-4" />

              {user ? (
                <>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl text-on-surface/70 hover:text-on-surface hover:bg-surface-container-high/50 transition-colors font-medium flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleSignOut();
                    }}
                    className="px-4 py-3 rounded-xl text-danger hover:bg-danger/10 transition-colors font-medium text-left flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl text-on-surface/70 hover:text-on-surface hover:bg-surface-container-high/50 transition-colors font-medium"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="btn-gradient text-center mx-4 mt-2"
                  >
                    Sign Up Free
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
