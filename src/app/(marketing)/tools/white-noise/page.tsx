import type { Metadata } from 'next';
import { generateOgImageUrl } from '@/utils/seo';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
import { RelatedTools } from '@/components/content/RelatedTools';
import { WhiteNoiseTool } from './components/WhiteNoiseTool';

/* -------------------------------------------------------------------------- */
/*  Metadata                                                                  */
/* -------------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: 'Free White Noise & Sleep Sounds — Brown Noise, Rain, Ocean & More',
  description:
    'Play free ambient sleep sounds including white noise, brown noise, pink noise, rain, ocean waves, and binaural beats. Set a sleep timer and drift off faster.',
  alternates: { canonical: '/tools/white-noise' },
  openGraph: {
    title: 'Free White Noise & Sleep Sounds',
    description:
      'Play free ambient sleep sounds including white noise, brown noise, pink noise, rain, ocean waves, and binaural beats. Set a sleep timer and drift off faster.',
    url: '/tools/white-noise',
    siteName: 'Sleep Stack',
    images: [{ url: generateOgImageUrl('Free White Noise & Sleep Sounds'), width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

/* -------------------------------------------------------------------------- */
/*  Page (Server Component)                                                   */
/* -------------------------------------------------------------------------- */

export default function WhiteNoisePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-20 pt-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">Free Tool</p>
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
          White Noise & Sleep Sounds
        </h1>
        <p className="text-on-surface-variant text-sm leading-relaxed max-w-lg">
          Free ambient sounds to help you fall asleep faster. Choose a sound, set a sleep timer, and drift off.
        </p>
      </div>

      {/* Interactive player (Client Component) */}
      <WhiteNoiseTool />

      {/* Long-form content */}
      <section className="mt-16 space-y-10 max-w-2xl">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            What Is White Noise and Why Does It Help Sleep?
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              White noise is a random signal that contains all audible frequencies at equal intensity — like static from an untuned radio. When played at a moderate volume during sleep, it creates a consistent acoustic &ldquo;mask&rdquo; that prevents sudden sounds (traffic, neighbours, notifications) from spiking above background levels and triggering arousal responses.
            </p>
            <p>
              Research published in <em>Sleep Medicine Reviews</em> found that continuous white noise reduced sleep onset latency by an average of 38% in hospital environments. In home settings with typical urban noise, studies show it can reduce nighttime awakenings by masking transient sounds that would otherwise interrupt sleep cycles.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            White vs Pink vs Brown Noise: What&apos;s the Difference?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-4">
            {[
              { label: 'White Noise', emoji: '⬜', color: '#f1f1f7', desc: 'Equal energy across all frequencies. Sounds like TV static or a strong fan. Best for masking a wide range of sounds.' },
              { label: 'Pink Noise', emoji: '🩷', color: '#f9c4d4', desc: 'More energy in low frequencies. Sounds like steady rain or rustling leaves. Studies suggest it may enhance deep sleep.' },
              { label: 'Brown Noise', emoji: '🟤', color: '#d4956a', desc: 'Concentrated in very low frequencies. Sounds like a deep waterfall or strong wind. Preferred by many ADHD users for focus and relaxation.' },
            ].map((n) => (
              <div key={n.label} className="glass-card rounded-2xl p-4">
                <div className="text-2xl mb-2">{n.emoji}</div>
                <p className="font-bold text-on-surface mb-1" style={{ color: n.color }}>{n.label}</p>
                <p className="text-xs text-on-surface-variant">{n.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            The &ldquo;best&rdquo; noise colour is highly individual. If you find white noise too harsh or clinical, try pink or brown noise first. Many people prefer brown noise because it more closely resembles the low-frequency sounds found in nature.
          </p>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Binaural Beats for Sleep: Does the Science Hold Up?
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Binaural beats work by playing slightly different frequencies in each ear — the brain perceives the difference as a low-frequency pulse. For sleep, delta frequencies (0.5–4 Hz) are used to encourage the slow-wave brainwaves associated with deep, restorative sleep.
            </p>
            <p>
              A 2020 meta-analysis in <em>Psychological Research</em> found that delta binaural beats significantly improved subjective sleep quality in healthy adults. However, they require stereo headphones and work best when combined with a relaxing environment — they are not a substitute for good sleep hygiene.
            </p>
            <p>
              <strong className="text-on-surface">Important:</strong> Do not use binaural beats while driving or operating machinery. Some people with epilepsy should consult a doctor before use.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            How to Use the Sleep Timer
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Playing ambient sound continuously all night is generally safe, but some sleep researchers recommend using a timer to allow your brain to experience natural silence during later sleep cycles when sleep is lighter. A 90-minute timer aligns with one full sleep cycle.
            </p>
            <p>
              For most people, 30–60 minutes is sufficient — long enough to fall asleep but short enough to prevent any dependency on continuous noise. If you find yourself waking when the sound stops, try a 90-minute timer instead.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-12">
        <RelatedTools exclude="/tools/white-noise" />
      </div>
      <MedicalDisclaimer />
    </main>
  );
}
