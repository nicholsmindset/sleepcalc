'use client';

import { useState } from 'react';
import { Check, X, Sparkles } from 'lucide-react';
import { STRIPE_CONFIG } from '@/lib/stripe/config';

const FREE_FEATURES = STRIPE_CONFIG.plans.free.features;
const PRO_FEATURES = STRIPE_CONFIG.plans.proMonthly.features;

const COMPARISON: { feature: string; free: boolean | string; pro: boolean | string }[] = [
  { feature: 'All calculators & tools', free: true, pro: true },
  { feature: 'Blog content & statistics', free: true, pro: true },
  { feature: 'Display ads', free: 'Yes', pro: 'No ads' },
  { feature: 'Device connections', free: '1 device', pro: 'Unlimited' },
  { feature: 'Sleep history', free: '7 days', pro: '90 days' },
  { feature: 'AI Sleep Coach', free: '3x/week', pro: 'Unlimited' },
  { feature: 'Personal cycle calibration', free: false, pro: true },
  { feature: 'Weekly AI digest email', free: false, pro: true },
  { feature: 'PDF sleep reports', free: false, pro: true },
  { feature: 'Personalized product recs', free: false, pro: true },
  { feature: 'Apple Health import', free: '1 import', pro: 'Unlimited' },
  { feature: 'Priority support', free: false, pro: true },
];

export default function PricingTable() {
  const [yearly, setYearly] = useState(true);

  const proPrice = yearly ? STRIPE_CONFIG.plans.proYearly.price : STRIPE_CONFIG.plans.proMonthly.price;
  const monthlyEquivalent = yearly ? (STRIPE_CONFIG.plans.proYearly.price / 12).toFixed(2) : null;
  const interval = yearly ? '/year' : '/month';

  return (
    <div>
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <span className={`text-sm font-medium transition-colors ${!yearly ? 'text-on-surface' : 'text-on-surface-variant'}`}>
          Monthly
        </span>
        <button
          onClick={() => setYearly(!yearly)}
          className={`relative w-14 h-7 rounded-full transition-colors ${yearly ? 'bg-primary' : 'bg-surface-container-high'}`}
          aria-label="Toggle yearly billing"
        >
          <span
            className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${yearly ? 'translate-x-7.5' : 'translate-x-0.5'}`}
          />
        </button>
        <span className={`text-sm font-medium transition-colors ${yearly ? 'text-on-surface' : 'text-on-surface-variant'}`}>
          Yearly
        </span>
        {yearly && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-accent/20 text-accent">
            Save 30%
          </span>
        )}
      </div>

      {/* Pricing cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Free tier */}
        <div className="glass-card rounded-3xl p-8">
          <h3 className="text-lg font-bold text-on-surface font-headline mb-1">Free</h3>
          <p className="text-on-surface-variant text-sm mb-6">Get started with the basics</p>

          <div className="mb-6">
            <span className="text-4xl font-bold text-on-surface font-mono">$0</span>
            <span className="text-on-surface-variant ml-1">/forever</span>
          </div>

          <a
            href="/signup"
            className="block w-full text-center py-3 rounded-xl border border-outline-variant/30 text-on-surface font-medium hover:bg-surface-container-high transition-colors mb-8"
          >
            Start Free
          </a>

          <ul className="space-y-3">
            {FREE_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-on-surface-variant">
                <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro tier */}
        <div className="relative rounded-3xl p-[2px] bg-gradient-to-b from-[#f9ca24] to-[#f0932b]">
          {yearly && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#f9ca24] to-[#f0932b] text-xs font-bold text-[#0a0a1a] uppercase tracking-wider">
              Most Popular
            </div>
          )}
          <div className="glass-card rounded-[22px] p-8 h-full">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-on-surface font-headline">Pro</h3>
              <Sparkles className="w-4 h-4 text-[#f9ca24]" />
            </div>
            <p className="text-on-surface-variant text-sm mb-6">Unlock your full sleep potential</p>

            <div className="mb-1">
              <span className="text-4xl font-bold text-on-surface font-mono">
                ${yearly ? proPrice : proPrice.toFixed(2)}
              </span>
              <span className="text-on-surface-variant ml-1">{interval}</span>
            </div>
            {monthlyEquivalent && (
              <p className="text-xs text-on-surface-variant mb-6">
                That&apos;s just ${monthlyEquivalent}/month
              </p>
            )}
            {!yearly && <div className="mb-6" />}

            <a
              href="/signup"
              className="block w-full text-center py-3 rounded-xl font-medium mb-8 bg-gradient-to-r from-[#f9ca24] to-[#f0932b] text-[#0a0a1a] hover:opacity-90 transition-opacity"
            >
              Go Pro
            </a>

            <ul className="space-y-3">
              {PRO_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-on-surface-variant">
                  <Check className="w-4 h-4 text-[#f9ca24] mt-0.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h3 className="text-xl font-bold text-on-surface font-headline text-center mb-8">
          Feature Comparison
        </h3>
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/15">
                <th className="text-left text-sm font-medium text-on-surface-variant px-6 py-4">Feature</th>
                <th className="text-center text-sm font-medium text-on-surface-variant px-4 py-4 w-28">Free</th>
                <th className="text-center text-sm font-medium text-[#f9ca24] px-4 py-4 w-28">Pro</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={row.feature} className={i < COMPARISON.length - 1 ? 'border-b border-outline-variant/10' : ''}>
                  <td className="text-sm text-on-surface px-6 py-3.5">{row.feature}</td>
                  <td className="text-center px-4 py-3.5">
                    {row.free === true ? (
                      <Check className="w-4 h-4 text-accent mx-auto" />
                    ) : row.free === false ? (
                      <X className="w-4 h-4 text-on-surface-variant/40 mx-auto" />
                    ) : (
                      <span className="text-xs text-on-surface-variant">{row.free}</span>
                    )}
                  </td>
                  <td className="text-center px-4 py-3.5">
                    {row.pro === true ? (
                      <Check className="w-4 h-4 text-[#f9ca24] mx-auto" />
                    ) : row.pro === false ? (
                      <X className="w-4 h-4 text-on-surface-variant/40 mx-auto" />
                    ) : (
                      <span className="text-xs text-[#f9ca24]">{row.pro}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
