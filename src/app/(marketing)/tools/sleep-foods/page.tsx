'use client';

import { useState } from 'react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
import { RelatedTools } from '@/components/content/RelatedTools';
import { CheckCircle, X, Plus, Minus } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

type Nutrient = 'tryptophan' | 'magnesium' | 'melatonin' | 'b6' | 'calcium' | 'potassium';

interface Food {
  name: string;
  emoji: string;
  amount: string;
  serving: string;
  tryptophan: number; // mg
  magnesium: number;  // mg
  melatonin: number;  // ng (nanograms)
  b6: number;         // mg
  calcium: number;    // mg
  potassium: number;  // mg
  sleepScore: number; // 1-10 overall sleep food score
}

const FOODS: Food[] = [
  { name: 'Turkey breast', emoji: '🦃', amount: '350 mg', serving: '100 g cooked', tryptophan: 350, magnesium: 28, melatonin: 0, b6: 0.7, calcium: 16, potassium: 340, sleepScore: 9 },
  { name: 'Pumpkin seeds', emoji: '🌱', amount: '576 mg', serving: '100 g', tryptophan: 576, magnesium: 592, melatonin: 0, b6: 0.1, calcium: 46, potassium: 809, sleepScore: 10 },
  { name: 'Chicken breast', emoji: '🍗', amount: '310 mg', serving: '100 g cooked', tryptophan: 310, magnesium: 27, melatonin: 0, b6: 0.9, calcium: 15, potassium: 340, sleepScore: 8 },
  { name: 'Soybeans (edamame)', emoji: '🫘', amount: '590 mg', serving: '100 g', tryptophan: 590, magnesium: 65, melatonin: 0, b6: 0.4, calcium: 277, potassium: 620, sleepScore: 9 },
  { name: 'Cheese (cheddar)', emoji: '🧀', amount: '320 mg', serving: '50 g', tryptophan: 320, magnesium: 14, melatonin: 0, b6: 0.1, calcium: 405, potassium: 56, sleepScore: 7 },
  { name: 'Sesame seeds', emoji: '🌾', amount: '340 mg', serving: '30 g', tryptophan: 340, magnesium: 105, melatonin: 0, b6: 0.2, calcium: 280, potassium: 135, sleepScore: 8 },
  { name: 'Tofu (firm)', emoji: '🫙', amount: '196 mg', serving: '100 g', tryptophan: 196, magnesium: 37, melatonin: 0, b6: 0.1, calcium: 350, potassium: 150, sleepScore: 8 },
  { name: 'Eggs', emoji: '🥚', amount: '167 mg', serving: '2 large eggs', tryptophan: 167, magnesium: 12, melatonin: 0, b6: 0.2, calcium: 56, potassium: 138, sleepScore: 7 },
  { name: 'Oats', emoji: '🥣', amount: '182 mg', serving: '100 g dry', tryptophan: 182, magnesium: 177, melatonin: 0, b6: 0.1, calcium: 54, potassium: 429, sleepScore: 8 },
  { name: 'Almonds', emoji: '🥜', amount: '214 mg', serving: '30 g', tryptophan: 214, magnesium: 76, melatonin: 0, b6: 0.04, calcium: 76, potassium: 200, sleepScore: 9 },

  // Magnesium-rich
  { name: 'Dark chocolate (70%+)', emoji: '🍫', amount: '176 mg', serving: '40 g', tryptophan: 70, magnesium: 176, melatonin: 0, b6: 0.03, calcium: 28, potassium: 365, sleepScore: 7 },
  { name: 'Cashews', emoji: '🫘', amount: '292 mg', serving: '30 g', tryptophan: 131, magnesium: 292, melatonin: 0, b6: 0.1, calcium: 37, potassium: 292, sleepScore: 8 },
  { name: 'Spinach (cooked)', emoji: '🥬', amount: '87 mg', serving: '100 g', tryptophan: 72, magnesium: 87, melatonin: 0, b6: 0.24, calcium: 136, potassium: 558, sleepScore: 9 },
  { name: 'Black beans', emoji: '🫘', amount: '70 mg', serving: '100 g cooked', tryptophan: 182, magnesium: 70, melatonin: 0, b6: 0.07, calcium: 27, potassium: 355, sleepScore: 8 },
  { name: 'Avocado', emoji: '🥑', amount: '29 mg', serving: '100 g (½ fruit)', tryptophan: 13, magnesium: 29, melatonin: 0, b6: 0.26, calcium: 12, potassium: 485, sleepScore: 8 },
  { name: 'Brown rice', emoji: '🍚', amount: '43 mg', serving: '100 g cooked', tryptophan: 90, magnesium: 43, melatonin: 0, b6: 0.1, calcium: 10, potassium: 79, sleepScore: 6 },
  { name: 'Banana', emoji: '🍌', amount: '37 mg', serving: '1 medium (118 g)', tryptophan: 11, magnesium: 37, melatonin: 2.5, b6: 0.43, calcium: 5, potassium: 422, sleepScore: 9 },
  { name: 'Lentils', emoji: '🫘', amount: '71 mg', serving: '100 g cooked', tryptophan: 77, magnesium: 71, melatonin: 0, b6: 0.18, calcium: 19, potassium: 369, sleepScore: 8 },
  { name: 'Chia seeds', emoji: '🌱', amount: '335 mg', serving: '30 g', tryptophan: 146, magnesium: 335, melatonin: 0, b6: 0.04, calcium: 189, potassium: 115, sleepScore: 9 },
  { name: 'Quinoa', emoji: '🍚', amount: '64 mg', serving: '100 g cooked', tryptophan: 52, magnesium: 64, melatonin: 0, b6: 0.12, calcium: 17, potassium: 318, sleepScore: 8 },

  // Melatonin-rich
  { name: 'Tart cherries', emoji: '🍒', amount: '13.5 ng', serving: '100 g (≈20 cherries)', tryptophan: 7, magnesium: 9, melatonin: 13.5, b6: 0.05, calcium: 13, potassium: 173, sleepScore: 10 },
  { name: 'Tart cherry juice', emoji: '🍹', amount: '17,500 ng', serving: '240 ml glass', tryptophan: 0, magnesium: 15, melatonin: 17500, b6: 0.07, calcium: 20, potassium: 270, sleepScore: 10 },
  { name: 'Walnuts', emoji: '🌰', amount: '3.5 ng', serving: '28 g (≈14 halves)', tryptophan: 60, magnesium: 45, melatonin: 3.5, b6: 0.15, calcium: 28, potassium: 125, sleepScore: 9 },
  { name: 'Grapes (red)', emoji: '🍇', amount: '8 ng', serving: '100 g', tryptophan: 6, magnesium: 7, melatonin: 8, b6: 0.09, calcium: 10, potassium: 191, sleepScore: 8 },
  { name: 'Tomatoes', emoji: '🍅', amount: '3.7 ng', serving: '100 g', tryptophan: 10, magnesium: 11, melatonin: 3.7, b6: 0.08, calcium: 10, potassium: 237, sleepScore: 7 },
  { name: 'Pistachios', emoji: '🫘', amount: '233,000 ng', serving: '28 g (≈49 kernels)', tryptophan: 73, magnesium: 34, melatonin: 233000, b6: 0.48, calcium: 30, potassium: 291, sleepScore: 10 },
  { name: 'Oats (whole grain)', emoji: '🥣', amount: '91 ng', serving: '100 g dry', tryptophan: 182, magnesium: 177, melatonin: 91, b6: 0.1, calcium: 54, potassium: 429, sleepScore: 9 },
  { name: 'Strawberries', emoji: '🍓', amount: '21 ng', serving: '100 g', tryptophan: 12, magnesium: 13, melatonin: 21, b6: 0.05, calcium: 16, potassium: 153, sleepScore: 8 },
  { name: 'Corn (sweet)', emoji: '🌽', amount: '187 ng', serving: '100 g cooked', tryptophan: 67, magnesium: 37, melatonin: 187, b6: 0.05, calcium: 2, potassium: 270, sleepScore: 7 },
  { name: 'Milk (whole)', emoji: '🥛', amount: '2 ng', serving: '240 ml glass', tryptophan: 113, magnesium: 27, melatonin: 2, b6: 0.1, calcium: 300, potassium: 349, sleepScore: 8 },

  // B6-rich
  { name: 'Salmon', emoji: '🐟', amount: '1.0 mg', serving: '100 g cooked', tryptophan: 270, magnesium: 30, melatonin: 0, b6: 1.0, calcium: 15, potassium: 490, sleepScore: 10 },
  { name: 'Sweet potato', emoji: '🍠', amount: '0.33 mg', serving: '100 g baked', tryptophan: 30, magnesium: 25, melatonin: 0, b6: 0.33, calcium: 30, potassium: 475, sleepScore: 9 },
  { name: 'Sunflower seeds', emoji: '🌻', amount: '0.77 mg', serving: '30 g', tryptophan: 127, magnesium: 91, melatonin: 0, b6: 0.77, calcium: 33, potassium: 241, sleepScore: 9 },
  { name: 'Garlic', emoji: '🧄', amount: '1.24 mg', serving: '100 g', tryptophan: 44, magnesium: 25, melatonin: 0, b6: 1.24, calcium: 181, potassium: 401, sleepScore: 7 },
  { name: 'Prunes', emoji: '🫐', amount: '0.21 mg', serving: '100 g (≈9 prunes)', tryptophan: 26, magnesium: 41, melatonin: 0, b6: 0.21, calcium: 43, potassium: 732, sleepScore: 8 },
  { name: 'Tuna (light, canned)', emoji: '🐠', amount: '0.9 mg', serving: '100 g', tryptophan: 297, magnesium: 26, melatonin: 0, b6: 0.9, calcium: 11, potassium: 237, sleepScore: 8 },

  // Calcium-rich
  { name: 'Greek yogurt', emoji: '🥛', amount: '200 mg', serving: '170 g (¾ cup)', tryptophan: 95, magnesium: 19, melatonin: 0, b6: 0.08, calcium: 200, potassium: 240, sleepScore: 9 },
  { name: 'Kale (raw)', emoji: '🥬', amount: '150 mg', serving: '100 g', tryptophan: 26, magnesium: 47, melatonin: 0, b6: 0.27, calcium: 150, potassium: 491, sleepScore: 8 },
  { name: 'Sardines (canned)', emoji: '🐟', amount: '382 mg', serving: '100 g', tryptophan: 262, magnesium: 39, melatonin: 0, b6: 0.17, calcium: 382, potassium: 397, sleepScore: 9 },
  { name: 'Collard greens', emoji: '🥬', amount: '232 mg', serving: '100 g cooked', tryptophan: 56, magnesium: 23, melatonin: 0, b6: 0.12, calcium: 232, potassium: 222, sleepScore: 8 },

  // Potassium-rich
  { name: 'Baked potato (with skin)', emoji: '🥔', amount: '926 mg', serving: '1 medium (173 g)', tryptophan: 60, magnesium: 49, melatonin: 0, b6: 0.54, calcium: 26, potassium: 926, sleepScore: 8 },
  { name: 'Dried apricots', emoji: '🍑', amount: '1160 mg', serving: '100 g', tryptophan: 15, magnesium: 32, melatonin: 0, b6: 0.14, calcium: 55, potassium: 1160, sleepScore: 7 },
  { name: 'Coconut water', emoji: '🥥', amount: '600 mg', serving: '240 ml glass', tryptophan: 0, magnesium: 60, melatonin: 0, b6: 0.1, calcium: 57, potassium: 600, sleepScore: 7 },
];

const NUTRIENT_TABS: { key: Nutrient; label: string; unit: string; emoji: string; why: string }[] = [
  { key: 'tryptophan', label: 'Tryptophan', unit: 'mg', emoji: '😴', why: 'Converts to serotonin then melatonin — the core precursor for natural sleepiness' },
  { key: 'magnesium', label: 'Magnesium', unit: 'mg', emoji: '⚡', why: 'Activates GABA receptors that quiet the nervous system and reduce cortisol at night' },
  { key: 'melatonin', label: 'Melatonin', unit: 'ng', emoji: '🌙', why: 'Direct source of the sleep hormone; food-derived melatonin can measurably shift sleep onset' },
  { key: 'b6', label: 'Vitamin B6', unit: 'mg', emoji: '🔄', why: 'Essential cofactor for converting tryptophan into serotonin and melatonin' },
  { key: 'calcium', label: 'Calcium', unit: 'mg', emoji: '🦴', why: 'Helps the brain use tryptophan to synthesise melatonin; deficiency linked to disrupted REM' },
  { key: 'potassium', label: 'Potassium', unit: 'mg', emoji: '💊', why: 'Reduces nighttime leg cramps and helps maintain the sleep-linked drop in blood pressure' },
];

const HURTS_SLEEP = [
  { name: 'Sugar & refined carbs', emoji: '🍬', reason: 'Spikes and crashes in blood sugar cause night waking and cortisol release in the small hours.' },
  { name: 'Alcohol', emoji: '🍷', reason: 'Sedates initially but fragments sleep in the second half of the night, suppressing REM by up to 24%.' },
  { name: 'Spicy food', emoji: '🌶️', reason: 'Raises core body temperature and worsens acid reflux, both of which disrupt sleep onset.' },
  { name: 'High-fat meals', emoji: '🍔', reason: 'Heavy, fatty meals slow digestion and elevate body temp, pushing back sleep onset by 30+ minutes.' },
  { name: 'Hidden caffeine', emoji: '☕', reason: 'Tea, chocolate, some sodas, and "decaf" coffee all contain caffeine. Half-life is 5–7 hours.' },
  { name: 'Tyramine-rich foods', emoji: '🧀', reason: 'Aged cheeses, cured meats, and fermented foods contain tyramine which stimulates noradrenaline.' },
];

/* -------------------------------------------------------------------------- */
/*  Snack Builder                                                              */
/* -------------------------------------------------------------------------- */

function SnackBuilder() {
  const [selected, setSelected] = useState<string[]>([]);

  const snackFoods = FOODS.filter((f) =>
    ['Banana', 'Almonds', 'Greek yogurt', 'Tart cherries', 'Walnuts', 'Dark chocolate (70%+)',
      'Milk (whole)', 'Pumpkin seeds', 'Pistachios', 'Oats (whole grain)'].includes(f.name)
  );

  const toggle = (name: string) => {
    setSelected((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : prev.length < 3
          ? [...prev, name]
          : prev,
    );
  };

  const totals = selected.reduce(
    (acc, name) => {
      const food = FOODS.find((f) => f.name === name);
      if (!food) return acc;
      return {
        tryptophan: acc.tryptophan + food.tryptophan,
        magnesium: acc.magnesium + food.magnesium,
        b6: acc.b6 + food.b6,
        calcium: acc.calcium + food.calcium,
      };
    },
    { tryptophan: 0, magnesium: 0, b6: 0, calcium: 0 },
  );

  const overallScore = selected.length
    ? Math.round(
      selected.reduce((sum, name) => {
        const food = FOODS.find((f) => f.name === name);
        return sum + (food?.sleepScore ?? 5);
      }, 0) / selected.length,
    )
    : 0;

  const scoreColor = overallScore >= 9 ? '#46eae5' : overallScore >= 7 ? '#55efc4' : '#f9ca24';

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 mb-12">
      <h2 className="font-headline text-xl font-bold text-on-surface mb-1">
        Build Your Evening Snack
      </h2>
      <p className="text-xs text-on-surface-variant mb-6">
        Choose up to 3 sleep-friendly foods to see your combined nutrient profile.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-6">
        {snackFoods.map((food) => {
          const isSelected = selected.includes(food.name);
          const isDisabled = !isSelected && selected.length >= 3;
          return (
            <button
              key={food.name}
              type="button"
              disabled={isDisabled}
              onClick={() => toggle(food.name)}
              className={`rounded-2xl p-3 text-center transition-all border ${
                isSelected
                  ? 'border-[#46eae5] bg-[#46eae5]/10'
                  : isDisabled
                    ? 'border-white/5 opacity-40 cursor-not-allowed'
                    : 'border-white/10 hover:border-white/30'
              }`}
            >
              <p className="text-2xl mb-1">{food.emoji}</p>
              <p className="text-[11px] text-on-surface leading-tight">{food.name}</p>
            </button>
          );
        })}
      </div>

      {selected.length > 0 ? (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-mono font-bold text-xl shrink-0"
              style={{ background: `conic-gradient(${scoreColor} ${overallScore * 10}%, rgba(255,255,255,0.05) 0)` }}
            >
              <span className="text-on-surface text-sm">{overallScore}/10</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">Sleep Snack Score</p>
              <p className="text-xs text-on-surface-variant">
                {overallScore >= 9 ? 'Excellent — optimal pre-sleep combination' :
                  overallScore >= 7 ? 'Good — solid sleep-supporting snack' :
                    'Decent — consider swapping one item'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Tryptophan', value: `${totals.tryptophan} mg`, target: '350 mg' },
              { label: 'Magnesium', value: `${totals.magnesium} mg`, target: '400 mg' },
              { label: 'Vitamin B6', value: `${totals.b6.toFixed(2)} mg`, target: '1.3 mg' },
              { label: 'Calcium', value: `${totals.calcium} mg`, target: '1000 mg' },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface-container/40 rounded-xl p-3 text-center">
                <p className="font-mono text-sm font-bold text-[#c6bfff]">{stat.value}</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">{stat.label}</p>
                <p className="text-[9px] text-on-surface-variant/60 mt-0.5">RDA: {stat.target}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-sm text-on-surface-variant">
          Select 1–3 foods above to see your combined sleep-nutrient profile.
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Nutrient Tab                                                              */
/* -------------------------------------------------------------------------- */

function NutrientTab({ nutrient }: { nutrient: typeof NUTRIENT_TABS[0] }) {
  const sorted = [...FOODS]
    .filter((f) => f[nutrient.key] > 0)
    .sort((a, b) => b[nutrient.key] - a[nutrient.key])
    .slice(0, 10);

  const max = sorted[0]?.[nutrient.key] ?? 1;

  return (
    <div>
      <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
        <span className="text-on-surface font-semibold">{nutrient.emoji} Why it matters: </span>
        {nutrient.why}
      </p>
      <div className="space-y-3">
        {sorted.map((food, i) => {
          const val = food[nutrient.key];
          const pct = (val / max) * 100;
          return (
            <div key={food.name} className="flex items-center gap-3">
              <span className="text-xs font-mono text-on-surface-variant w-4 shrink-0">{i + 1}</span>
              <span className="text-lg shrink-0">{food.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1">
                  <p className="text-sm font-semibold text-on-surface truncate">{food.name}</p>
                  <p className="text-xs font-mono text-[#c6bfff] shrink-0 ml-2">
                    {nutrient.key === 'melatonin' && val >= 1000
                      ? `${(val / 1000).toFixed(1)} μg`
                      : `${val} ${nutrient.unit}`}
                  </p>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg, #6c5ce7, #46eae5)',
                    }}
                  />
                </div>
                <p className="text-[10px] text-on-surface-variant mt-1">{food.serving}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function SleepFoodsPage() {
  const [activeTab, setActiveTab] = useState<Nutrient>('tryptophan');
  const active = NUTRIENT_TABS.find((t) => t.key === activeTab)!;

  return (
    <article className="mx-auto max-w-3xl px-4 pb-20 pt-8">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/calculators' },
          { label: 'Sleep-Friendly Foods', href: '/tools/sleep-foods' },
        ]}
      />

      <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
        Foods That Help You Sleep
      </h1>
      <p className="text-on-surface-variant text-sm leading-relaxed mb-10 max-w-2xl">
        The best sleep-supporting foods ranked by key nutrients — tryptophan, magnesium, melatonin,
        vitamin B6, calcium, and potassium. Build the perfect evening snack below.
      </p>

      {/* Snack Builder */}
      <SnackBuilder />

      {/* Nutrient Tabs */}
      <div className="mb-12">
        <h2 className="font-headline text-2xl font-bold text-on-surface mb-5">
          Top Foods by Sleep Nutrient
        </h2>

        {/* Tab bar */}
        <div className="flex gap-2 flex-wrap mb-8">
          {NUTRIENT_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-primary text-white'
                  : 'glass-card text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>

        <NutrientTab nutrient={active} />
      </div>

      {/* Foods That Hurt Sleep */}
      <div className="mb-12">
        <h2 className="font-headline text-2xl font-bold text-on-surface mb-5">
          Foods That Hurt Sleep
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {HURTS_SLEEP.map((item) => (
            <div key={item.name} className="glass-card rounded-2xl p-4 flex gap-3">
              <span className="text-2xl shrink-0">{item.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-on-surface mb-1">{item.name}</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">{item.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <section className="space-y-10 max-w-3xl">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            How Food Affects Sleep Quality
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Sleep and nutrition are more tightly linked than most people realise. The brain requires
              specific raw materials to synthesise sleep-regulating neurotransmitters — and many of these
              come directly from the food you eat in the hours before bed. Understanding the sleep-nutrient
              pathway can be the difference between lying awake at midnight and drifting off in minutes.
            </p>
            <p>
              The most important sleep-nutrition pathway starts with{' '}
              <strong className="text-on-surface">tryptophan</strong> — an essential amino acid found in
              protein-rich foods. Once consumed, tryptophan crosses the blood-brain barrier and is
              converted to serotonin (the mood and calm neurotransmitter), which is then converted to
              melatonin (the primary sleep hormone) when light levels fall. Without adequate dietary
              tryptophan, this cascade is limited regardless of how dark and cool your bedroom is.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            The Tryptophan–Carbohydrate Trick
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Tryptophan competes with other large amino acids to cross the blood-brain barrier via the
              same transporter. When you eat protein alone, tryptophan faces heavy competition and little
              reaches the brain. But when you pair tryptophan-rich foods with a small amount of complex
              carbohydrates, insulin is released — and insulin drives the competing amino acids into
              muscle, clearing the pathway for tryptophan.
            </p>
            <p>
              This is why the classic{' '}
              <strong className="text-on-surface">warm milk + small banana</strong> combination has
              genuine scientific backing as a sleep aid: the milk provides tryptophan and calcium, the
              banana provides the carbohydrate trigger plus B6 (needed to convert tryptophan) and a
              small amount of melatonin. Pair turkey with a few crackers, or Greek yogurt with a handful
              of oats, for the same synergistic effect.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Magnesium: The Relaxation Mineral
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Magnesium deficiency is more common than most people think — surveys suggest up to 50% of
              people in developed countries don&apos;t get adequate dietary magnesium. This matters
              enormously for sleep because magnesium activates the parasympathetic nervous system
              (rest-and-digest) and binds to GABA receptors in the brain, producing the same calming
              effect as the nervous system&apos;s natural brake.
            </p>
            <p>
              Magnesium also suppresses the stress hormone cortisol during the overnight period. Low
              magnesium correlates with elevated nocturnal cortisol, which increases arousals and
              prevents entry into slow-wave (deep) sleep. Pumpkin seeds, chia seeds, and dark chocolate
              are among the highest food sources, making a small portion of any of these a genuinely
              therapeutic pre-sleep choice.
            </p>
            <p>
              If you choose to supplement, <strong className="text-on-surface">magnesium glycinate</strong>{' '}
              or <strong className="text-on-surface">magnesium threonate</strong> are the most
              bioavailable forms for sleep support (200–400 mg, 30 minutes before bed). Magnesium oxide —
              the cheapest form — has poor absorption and is best avoided.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Tart Cherry Juice: The Most Studied Sleep Food
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Tart (Montmorency) cherries and their juice are the most rigorously studied sleep foods.
              They contain an exceptionally high concentration of naturally occurring melatonin — a 240 ml
              glass of tart cherry juice delivers approximately 17,500 nanograms of melatonin, compared
              to 3–5 ng in typical melatonin supplements.
            </p>
            <p>
              A 2011 randomised crossover trial published in the{' '}
              <em>European Journal of Nutrition</em> found that adults who drank two glasses of tart
              cherry juice daily for one week increased total sleep time by 25 minutes and sleep
              efficiency by 5–6% compared to placebo. A 2014 follow-up in older adults (who are more
              prone to insomnia) confirmed the findings.
            </p>
            <p>
              The mechanism involves both direct melatonin delivery and inhibition of an enzyme
              (indoleamine 2,3-dioxygenase) that breaks down tryptophan, increasing the pool available
              for melatonin synthesis. Pistachios, meanwhile, contain the highest melatonin content of
              any tested whole food — up to 233,000 ng per 28 g serving.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Timing Your Pre-Sleep Meal
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              When you eat is as important as what you eat. Large meals within 2–3 hours of bedtime
              elevate core body temperature (as the digestive system processes food) and can trigger acid
              reflux — both of which directly interfere with sleep onset. Ideally, your last main meal
              should be 3–4 hours before bedtime.
            </p>
            <p>
              A small sleep-supporting snack (200–300 calories) 30–60 minutes before bed is fine and
              may actually be beneficial if it contains the right nutrient combination. The key constraints
              are low fat (slow to digest), low fibre (reduces GI activity), and modest portion size.
              A banana with a small handful of walnuts, a small bowl of oats, or a cup of warm milk
              with a teaspoon of honey are ideal.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              {[
                { time: '4–3 hrs before bed', label: 'Last main meal', tip: 'Avoid heavy fats and spices' },
                { time: '1 hr before bed', label: 'Optional small snack', tip: 'Tryptophan + small carb' },
                { time: '30 min before bed', label: 'Warm drink', tip: 'Chamomile, warm milk, or tart cherry juice' },
              ].map((item) => (
                <div key={item.time} className="glass-card rounded-2xl p-4 text-center">
                  <p className="font-mono text-xs text-[#c6bfff] mb-1">{item.time}</p>
                  <p className="text-sm font-semibold text-on-surface mb-1">{item.label}</p>
                  <p className="text-xs text-on-surface-variant">{item.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-12">
        <RelatedTools exclude="/tools/sleep-foods" />
      </div>

      <MedicalDisclaimer />
    </article>
  );
}
