'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, ChevronDown } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';

const calculatorLinks = [
  { label: 'Sleep Calculator', href: '/' },
  { label: 'Sleep Debt', href: '/calculators/sleep-debt' },
  { label: 'Nap Calculator', href: '/calculators/nap-calculator' },
  { label: 'Caffeine Cutoff', href: '/calculators/caffeine-cutoff' },
  { label: 'Shift Worker', href: '/calculators/shift-worker' },
  { label: 'Baby Sleep', href: '/calculators/baby-sleep' },
  { label: 'Chronotype Quiz', href: '/calculators/chronotype-quiz' },
];

const toolLinks = [
  { label: "Tonight's Forecast", href: '/tonight' },
  { label: 'Circadian Light Guide', href: '/tools/circadian-guide' },
  { label: 'Jet Lag Calculator', href: '/tools/jet-lag-calculator' },
  { label: 'Sleep Score', href: '/tools/sleep-score' },
  { label: 'Moon & Sleep', href: '/tools/moon-sleep' },
  { label: 'DST Calculator', href: '/tools/dst-calculator' },
  { label: 'Sleep Journal', href: '/tools/sleep-journal' },
  { label: 'Sleep-Friendly Foods', href: '/tools/sleep-foods' },
  { label: 'AI Sleep Coach', href: '/sleep-coach' },
  { label: 'Best Mattress Guide', href: '/best-mattress' },
  { label: 'White Noise', href: '/tools/white-noise' },
];

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Statistics', href: '/statistics' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [calcDropdown, setCalcDropdown] = useState(false);
  const [toolsDropdown, setToolsDropdown] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#121222]/80 backdrop-blur-xl shadow-ambient">
      <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tighter text-on-surface font-headline"
        >
          Sleep Stack
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

          {/* Tools dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setToolsDropdown(true)}
            onMouseLeave={() => setToolsDropdown(false)}
          >
            <button className="font-headline font-medium text-sm tracking-tight text-on-surface/60 hover:text-on-surface transition-colors flex items-center gap-1">
              Tools
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {toolsDropdown && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                <div className="glass-card rounded-2xl p-3 min-w-[220px] shadow-ambient">
                  {toolLinks.map((link) => (
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

            <div className="flex flex-col gap-2">
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

              <div className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant mt-4">
                Tools
              </div>
              {toolLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm text-on-surface/60 hover:text-on-surface hover:bg-surface-container-high/50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
