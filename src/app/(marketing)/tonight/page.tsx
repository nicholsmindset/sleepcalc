import type { Metadata } from 'next';
import { SleepForecast } from '@/components/forecast/SleepForecast';
import { RelatedTools } from '@/components/content/RelatedTools';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
import AffiliateCard from '@/components/content/AffiliateCard';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { generateOgImageUrl } from '@/utils/seo';
import { WebApplicationSchema } from '@/components/seo/SchemaMarkup';

export const metadata: Metadata = {
  title: "Tonight's Sleep Forecast — Sleep Environment Score",
  description:
    "Get a real-time sleep environment score based on your local temperature, humidity, wind speed, and moon phase. Free tool, no sign-up required.",
  alternates: { canonical: '/tonight' },
  openGraph: {
    title: "Tonight's Sleep Forecast — Sleep Environment Score",
    description:
      "Check tonight's sleep environment score based on local weather and moon phase conditions.",
    url: '/tonight',
    siteName: 'Sleep Stack',
    images: [{ url: generateOgImageUrl("Tonight's Sleep Forecast"), width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function TonightPage() {
  return (
    <>
      <WebApplicationSchema />
      <article className="mx-auto max-w-3xl px-4 pb-20 pt-4">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: "Tonight's Forecast", href: '/tonight' },
        ]}
      />

      <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
        Tonight&apos;s Sleep Forecast
      </h1>
      <p className="text-on-surface-variant text-sm leading-relaxed mb-10 max-w-2xl">
        Your local sleep environment score, powered by real-time weather data. Temperature, humidity, wind
        speed, and moon phase all affect how well you sleep — see tonight&apos;s conditions at a glance.
      </p>

      {/* Live forecast widget */}
      <SleepForecast />

      {/* Content */}
      <section className="mt-16 space-y-10 max-w-3xl">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            How Your Sleep Environment Affects Sleep Quality
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              The bedroom environment is one of the most underappreciated factors in sleep quality. While most
              people focus on bedtime routines and screen exposure, the physical conditions of the room —
              temperature, humidity, light, and noise — directly influence the biological processes that govern
              how deeply and restoratively you sleep.
            </p>
            <p>
              Sleep researchers have identified thermoregulation as the most critical environmental factor.
              Your core body temperature must drop by 1–2°C to initiate sleep onset, and it continues to fall
              through the night, reaching its lowest point during deep slow-wave sleep. A room that is too warm
              disrupts this cooling process, shortening deep sleep and increasing the number of wake-ups.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            The Ideal Sleep Temperature
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              The consensus in sleep science points to a bedroom temperature of <strong className="text-on-surface">
              15–20°C (60–68°F)</strong> as optimal for most adults. At this range, the body can achieve its
              natural temperature drop most efficiently. Research from the National Institutes of Health
              found that thermoneutral conditions — where the body neither shivers nor sweats — produced
              significantly higher proportions of slow-wave (deep) and REM sleep compared to warmer conditions.
            </p>
            <p>
              Children and older adults may prefer slightly warmer rooms (18–21°C), as their thermoregulatory
              systems are less efficient. Babies under 12 months should never sleep in rooms below 16°C.
            </p>
            <p>
              Air conditioning and fans are the most practical tools for managing bedroom temperature. Fans
              have the added benefit of generating white noise, which masks environmental sounds that would
              otherwise cause micro-arousals. Even if the room temperature isn&apos;t perfect, a fan pointed
              away from the bed can improve perceived comfort.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Humidity and Sleep: Finding the Sweet Spot
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Relative humidity in the bedroom affects respiratory comfort and skin moisture, both of which
              influence sleep quality. The ideal range is <strong className="text-on-surface">40–60%
              relative humidity</strong>. At this level, mucous membranes stay moist, reducing snoring and
              breathing resistance, while sweat evaporates efficiently from the skin.
            </p>
            <p>
              High humidity (above 70%) feels hot and oppressive, even at moderate temperatures. It
              prevents sweat from evaporating, making the body feel warmer than the thermometer suggests.
              This is why humid summer nights feel so much worse for sleep than dry conditions at the same
              temperature.
            </p>
            <p>
              Low humidity (below 30%) dries out the nasal passages and throat, increasing snoring risk and
              causing the kind of irritation that causes night-waking. If your bedroom humidity frequently
              drops below 30% in winter, a cool-mist humidifier is one of the highest-ROI sleep investments
              you can make.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Wind, Noise, and Sleep Continuity
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              The brain never fully shuts down during sleep — it continuously monitors the environment for
              potential threats. Sudden, unpredictable sounds are particularly disruptive because they trigger
              the brain&apos;s threat-detection response, causing micro-arousals even when you don&apos;t
              consciously wake up. High wind nights increase ambient noise from creaking structures, rustling
              vegetation, and intermittent gusts — all of which can fragment sleep architecture.
            </p>
            <p>
              White noise or brown noise (a deeper, softer frequency) masks these variable sounds by raising
              the acoustic floor of the room. Studies show that white noise can reduce sleep onset time by
              38% in noisy environments and significantly decrease the number of night-waking events.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            How the Sleep Environment Score Is Calculated
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              The score weights three environmental factors based on their relative impact on sleep quality
              in peer-reviewed literature:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Temperature', weight: '50 pts', desc: 'Most impactful factor — affects core body cooling' },
                { label: 'Humidity', weight: '30 pts', desc: 'Respiratory comfort and perceived warmth' },
                { label: 'Wind Speed', weight: '20 pts', desc: 'Proxy for ambient noise disruption' },
              ].map((item) => (
                <div key={item.label} className="glass-card rounded-2xl p-4 text-center">
                  <p className="font-mono font-bold text-lg text-[#c6bfff]">{item.weight}</p>
                  <p className="text-sm font-semibold text-on-surface mb-1">{item.label}</p>
                  <p className="text-xs text-on-surface-variant">{item.desc}</p>
                </div>
              ))}
            </div>
            <p>
              Moon phase is displayed as contextual information rather than factored into the score, as its
              effect (while real) is smaller than the direct environmental conditions.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-12">
        <RelatedTools exclude="/tonight" />
      </div>

      <AffiliateCard context="environment" />
      <MedicalDisclaimer />
    </article>
    </>
  );
}
