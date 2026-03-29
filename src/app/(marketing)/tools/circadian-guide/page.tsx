import type { Metadata } from 'next';
import { generateOgImageUrl } from '@/utils/seo';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
import AffiliateCard from '@/components/content/AffiliateCard';
import { RelatedTools } from '@/components/content/RelatedTools';
import CircadianGuideTool from './components/CircadianGuideTool';

export const metadata: Metadata = {
  title: 'Circadian Rhythm Schedule — Your Personalised Light & Sleep Timeline',
  description:
    'Generate a personalised circadian rhythm schedule based on your local sunrise and sunset times. Discover the ideal times for morning light, peak focus, afternoon nap, and bedtime.',
  alternates: { canonical: '/tools/circadian-guide' },
  openGraph: {
    title: 'Circadian Rhythm Schedule — Your Personalised Light & Sleep Timeline',
    description:
      'Generate a personalised circadian rhythm schedule based on your local sunrise and sunset. Morning light, peak alertness, nap window, and bedtime — all timed to your location.',
    url: '/tools/circadian-guide',
    siteName: 'Sleep Stack',
    images: [{ url: generateOgImageUrl('Circadian Rhythm Schedule — Light & Sleep Timeline'), width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function CircadianGuidePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-20 pt-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">Free Tool</p>
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#f9ca24] to-[#c6bfff] bg-clip-text text-transparent">
          Circadian Light Guide
        </h1>
        <p className="text-on-surface-variant text-sm leading-relaxed max-w-lg">
          A personalised daily schedule based on your local sunrise and sunset — showing exactly when to
          get light, when to dim it, and when your body is primed for sleep.
        </p>
      </div>

      <CircadianGuideTool />

      {/* Long-form content */}
      <section className="mt-16 space-y-10">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            What Is the Circadian Rhythm?
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              The circadian rhythm is a roughly 24-hour internal clock that governs nearly every biological
              process in the human body — from sleep-wake cycles and hormone secretion to body temperature,
              metabolism, immune function, and cell repair. The word comes from the Latin <em>circa dies</em>,
              meaning &quot;about a day.&quot;
            </p>
            <p>
              The master clock lives in the suprachiasmatic nucleus (SCN), a tiny region in the hypothalamus
              containing about 20,000 neurons. This structure receives direct light input from specialised
              retinal cells called intrinsically photosensitive retinal ganglion cells (ipRGCs), which are
              most sensitive to short-wavelength (blue) light at around 480nm.
            </p>
            <p>
              Light is by far the most powerful zeitgeber (time-giver) for the circadian clock. Morning
              sunlight triggers the cortisol awakening response, suppresses residual melatonin, and advances
              the clock. Evening light does the opposite — it delays the clock and suppresses the onset of
              melatonin production. This is why artificial light exposure at night is one of the greatest
              disruptors of sleep in the modern world.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            The Science of Morning Sunlight
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Dr. Andrew Huberman&apos;s work at Stanford and the research of Dr. Satchin Panda at the Salk
              Institute have highlighted the outsized importance of morning light exposure. Getting bright
              natural light — ideally sunlight — within 30–60 minutes of waking triggers a cascade of
              biological events:
            </p>
            <ul className="space-y-2 list-none">
              {[
                'Cortisol secretion peaks sharply (the cortisol awakening response), boosting alertness and metabolism.',
                'The circadian clock is anchored to the local light-dark cycle.',
                'A timer is set for melatonin onset ~12–14 hours later.',
                'Serotonin synthesis is stimulated in the raphe nuclei, improving mood and daytime energy.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[#f9ca24]">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              Even on overcast days, outdoor light provides 10–100x more lux intensity than indoor lighting.
              A bright indoor room provides ~400–500 lux; an overcast day outdoors provides 10,000+ lux;
              direct sunlight exceeds 100,000 lux. The difference in circadian signal strength is enormous.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Caffeine and Your Circadian Clock
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Caffeine works by blocking adenosine receptors — adenosine is the sleep-pressure molecule that
              builds up during waking hours. The problem with early-morning coffee is that cortisol is already
              at its daily peak in the first hour after waking, doing most of caffeine&apos;s job naturally.
              Caffeine consumed during this window provides minimal additional alertness but still delivers
              its full adenosine-blocking effect, which means when cortisol drops, the accumulated adenosine
              hits harder.
            </p>
            <p>
              Research suggests delaying your first coffee by 90–120 minutes after waking allows cortisol
              to peak naturally and begin its decline before caffeine takes over. This protocol tends to
              produce more sustained alertness with less mid-afternoon crash than early-morning caffeine use.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-12">
        <RelatedTools exclude="/tools/circadian-guide" />
      </div>

      <AffiliateCard context="supplement" />
      <MedicalDisclaimer />
    </main>
  );
}
