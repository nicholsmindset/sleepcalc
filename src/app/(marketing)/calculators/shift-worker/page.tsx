import type { Metadata } from 'next';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { generateHowToSchema } from '@/utils/schema';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { FAQ } from '@/components/content/FAQ';
import { RelatedTools } from '@/components/content/RelatedTools';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
import AffiliateCard from '@/components/content/AffiliateCard';
import ShiftWorkerCalculator from '@/components/calculators/ShiftWorkerCalculator';

export const metadata: Metadata = {
  title: 'Shift Worker Sleep Calculator — Optimize Your Sleep Schedule',
  description:
    'Calculate the best sleep schedule for your shift work pattern. Get personalized recommendations for night shifts, rotating shifts, and split sleep strategies.',
  alternates: {
    canonical: '/calculators/shift-worker',
  },
  openGraph: {
    title: 'Shift Worker Sleep Calculator — Optimize Your Sleep Schedule',
    description:
      'Calculate the best sleep schedule for night shifts, rotating shifts, and split sleep strategies.',
    url: '/calculators/shift-worker',
    siteName: 'Sleep Stack',
  },
};

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Calculators', href: '/calculators' },
  { label: 'Shift Worker Calculator', href: '/calculators/shift-worker' },
];

const faqItems = [
  {
    question: 'How much sleep do shift workers need?',
    answer:
      'Shift workers need the same 7-9 hours as everyone else, but the timing and quality are different. Night shift workers typically get 1-4 hours less sleep than day workers due to circadian misalignment. This calculator helps you maximize sleep within your available window by aligning wake times with the end of complete 90-minute sleep cycles.',
  },
  {
    question: 'What is the best sleep schedule for night shift nurses?',
    answer:
      'Most night shift nurses (7 PM - 7 AM) do best sleeping from around 8 AM to 3-4 PM after their shift. A 90-minute nap at 5 PM before the shift helps maintain alertness. The key is consistency -- stick to the same schedule on consecutive work nights and use blackout curtains, earplugs, and a cool room for daytime sleep.',
  },
  {
    question: 'Should I use the split sleep method for night shifts?',
    answer:
      'Split sleep (biphasic sleep) can work well for night shift workers. Research published in the Journal of Sleep Research found that a 5-hour main sleep plus a 1.5-hour nap provides comparable cognitive performance to a single 7-hour sleep. This approach is especially helpful when your daytime sleep environment is noisy or when you have daytime obligations.',
  },
  {
    question: 'How do I transition between day and night shifts?',
    answer:
      'The hardest transition is night-to-day. After your last night shift, limit your recovery sleep to 4-5 hours, then stay awake and go to bed at a normal evening time. For day-to-night transitions, take a prophylactic 90-minute nap in the late afternoon before your first night shift. Strategic light exposure helps: bright light at the start of your new shift schedule, and blue-light-blocking glasses before your new sleep window.',
  },
  {
    question: 'Why is rotating shift work harder on the body?',
    answer:
      'Rotating shifts constantly disrupt your circadian rhythm, which is your internal 24-hour biological clock. Unlike fixed shifts where your body can partially adapt over 5-7 days, rotating schedules prevent full adaptation. This leads to chronic circadian misalignment, which is linked to increased risks of cardiovascular disease, metabolic disorders, and mental health issues. Forward rotation (day to evening to night) is less disruptive than backward rotation.',
  },
  {
    question: 'What are the best blackout solutions for daytime sleep?',
    answer:
      'The most effective setup combines blackout curtains (with side channels to prevent light leaks) plus a sleep mask. Aluminum foil on windows is a budget option that blocks 100% of light. For sound, use a white noise machine or earplugs rated NRR 33. Keep your room at 65-68°F (18-20°C). These interventions can increase daytime sleep duration by 1-2 hours according to research on shift worker sleep quality.',
  },
  {
    question: 'How does caffeine affect shift workers differently?',
    answer:
      'Caffeine has a half-life of 5-6 hours and can disrupt sleep even when you don\'t feel its stimulating effects. For night shift workers sleeping during the day, stop caffeine intake at least 6 hours before your planned sleep time -- so if you sleep at 8 AM, your last coffee should be by 2 AM. Strategic caffeine at the start of your shift (200-400 mg) improves alertness, but avoid the "caffeine crash" pattern of continuous intake throughout the shift.',
  },
  {
    question: 'Can night shift work cause long-term health problems?',
    answer:
      'Yes, chronic shift work -- particularly night and rotating shifts -- is associated with increased risks of cardiovascular disease, type 2 diabetes, obesity, certain cancers, and depression. The World Health Organization classifies night shift work as a probable carcinogen (Group 2A). Mitigating strategies include maintaining consistent sleep schedules, getting regular health screenings, exercising regularly, and using strategic light exposure to support circadian rhythm alignment.',
  },
];

export default function ShiftWorkerPage() {
  return (
    <>
      <SchemaMarkup
        type="WebApplication"
        data={{
          name: 'Shift Worker Sleep Calculator',
          applicationCategory: 'HealthApplication',
          operatingSystem: 'Web',
          description:
            'Calculate optimal sleep schedules for day, evening, night, and rotating shift workers.',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        }}
      />
      <SchemaMarkup
        type="HowTo"
        data={generateHowToSchema({
          name: 'How to plan sleep around a shift schedule',
          description:
            'Build a sleep plan that protects deep sleep across day, evening, night, and rotating shifts.',
          totalTime: 'PT2M',
          steps: [
            {
              name: 'Choose your shift type',
              text: 'Select day, evening, night, or rotating to load the right sleep template.',
            },
            {
              name: 'Enter your shift hours',
              text: 'Set your shift start and end times so we can find your circadian sleep window.',
            },
            {
              name: 'Review the suggested schedule',
              text: 'See your recommended main sleep block plus an optional anchor or split-sleep nap.',
            },
            {
              name: 'Apply the recovery tips',
              text: 'Use the light, caffeine, and meal timing guidance to keep your circadian rhythm stable.',
            },
          ],
        })}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        <div className="pt-4">
          <Breadcrumbs items={breadcrumbs} />

          {/* Hero */}
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-on-surface to-on-surface-variant">
              Shift Worker Sleep Calculator
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Built for nurses, first responders, factory workers, and anyone whose work
              schedule does not follow a 9-to-5. Get cycle-aligned sleep recommendations
              tailored to{' '}
              <span className="text-[#46eae5] font-semibold">your exact shift pattern</span>.
            </p>
          </div>

          {/* Calculator */}
          <ShiftWorkerCalculator />

          {/* Educational content */}
          <div className="max-w-3xl mx-auto">
            {/* Section 1: The Challenge */}
            <section className="py-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-on-surface">
                The Challenge of Shift Work Sleep
              </h2>
              <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
                <p>
                  Approximately 20% of the global workforce performs some form of shift work,
                  and the sleep challenges they face are fundamentally different from those of
                  day workers. Shift work sleep disorder (SWSD) affects an estimated 10-40% of
                  shift workers, causing chronic insomnia, excessive sleepiness, and a cascade
                  of health consequences that extend far beyond feeling tired.
                </p>
                <p>
                  The core problem is circadian misalignment. Your internal body clock is
                  hardwired to promote wakefulness during daylight and sleep during darkness.
                  When your work schedule demands the opposite, your biology fights back. Core
                  body temperature, melatonin secretion, cortisol production, and cognitive
                  alertness all follow circadian patterns that cannot be instantly reprogrammed
                  by an alarm clock.
                </p>
                <p>
                  Night shift workers lose an average of 1 to 4 hours of sleep per 24-hour
                  period compared to day workers. This is not just a matter of discipline or
                  willpower. Daytime sleep is lighter, shorter, and more fragmented because it
                  occurs when your circadian drive for wakefulness is strong. Ambient light,
                  household noise, and social obligations all conspire against quality rest.
                </p>
                <p>
                  The consequences are measurable. A 2023 meta-analysis in <em>Sleep Medicine
                  Reviews</em> found that shift workers have a 17% higher risk of cardiovascular
                  events, a 9% increase in type 2 diabetes risk, and significantly elevated
                  rates of depression and anxiety compared to day workers. Fatigue-related
                  errors in healthcare and transportation are directly linked to inadequate
                  shift worker sleep.
                </p>
                <p>
                  The good news is that evidence-based strategies can significantly improve
                  shift worker sleep quality. Strategic napping, light exposure timing, sleep
                  environment optimization, and cycle-aligned scheduling all contribute to
                  better outcomes. This calculator applies these principles to your specific
                  shift pattern.
                </p>
              </div>
            </section>

            {/* Section 2: Strategies by Shift Type */}
            <section className="py-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-on-surface">
                Sleep Strategies by Shift Type
              </h2>

              {/* Day shift */}
              <div className="mb-10">
                <h3 className="font-headline text-xl font-bold text-on-surface mb-3">
                  Day Shift (6 AM - 6 PM)
                </h3>
                <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
                  <p>
                    Day shift workers face the most natural sleep schedule, but early starts
                    (5-6 AM) create their own challenges. Many day workers chronically
                    under-sleep by going to bed too late while maintaining an early alarm.
                    The key is protecting your bedtime as strictly as you protect your alarm.
                  </p>
                  <p>
                    For a 6 AM start with a 30-minute commute, your target bedtime is
                    9:45-10:15 PM to achieve 5 full sleep cycles. Avoid the trap of staying
                    up for "me time" after a long shift. That stolen hour costs you an entire
                    sleep cycle. Instead, build your personal time into the afternoon, when
                    alertness naturally peaks.
                  </p>
                  <p>
                    Morning light exposure within 30 minutes of waking is critical for
                    anchoring your circadian rhythm. A 10-minute walk outside or a
                    10,000-lux light therapy box in winter can advance your sleep phase by
                    up to 1 hour over a week, making it easier to fall asleep at your target
                    bedtime.
                  </p>
                </div>
              </div>

              {/* Evening shift */}
              <div className="mb-10">
                <h3 className="font-headline text-xl font-bold text-on-surface mb-3">
                  Evening Shift (3 PM - 11 PM)
                </h3>
                <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
                  <p>
                    Evening shift workers often report the highest overall sleep satisfaction
                    among shift types, because their sleep window (midnight to 8-9 AM) partly
                    aligns with the natural circadian sleep drive. The primary challenge is
                    falling asleep quickly after an active shift.
                  </p>
                  <p>
                    The wind-down period matters most for evening workers. After clocking out,
                    your adrenaline and cortisol may still be elevated. Build a 30-60 minute
                    decompression routine: dim your home lights (or use smart bulbs set to
                    warm tones), avoid news and stimulating content, and consider a warm shower
                    to leverage the thermoregulatory sleepiness that follows body cooling.
                  </p>
                  <p>
                    Social isolation is the underappreciated risk. Evening workers miss dinners,
                    children&apos;s bedtimes, and social gatherings. Prioritize morning connections
                    and weekend socializing to maintain relationships and mental health, which
                    indirectly support better sleep quality.
                  </p>
                </div>
              </div>

              {/* Night shift */}
              <div className="mb-10">
                <h3 className="font-headline text-xl font-bold text-on-surface mb-3">
                  Night Shift (7 PM - 7 AM)
                </h3>
                <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
                  <p>
                    Night shift represents the most severe form of circadian disruption. Your
                    body&apos;s circadian low point (the nadir) occurs between 3-5 AM, when
                    alertness, body temperature, and cognitive function are at their lowest.
                    This is when errors peak and drowsiness is most dangerous.
                  </p>
                  <p>
                    The critical window for night workers is the commute home. Drowsy driving
                    after a night shift carries comparable risk to driving intoxicated. Wear
                    blue-light-blocking glasses (amber or orange lenses) during your drive to
                    prevent the morning sunlight from suppressing melatonin, which you need
                    for imminent sleep. If possible, use public transport or arrange a ride.
                  </p>
                  <p>
                    The anchor sleep model is the most effective approach: maintain a core
                    sleep period of at least 4 hours that stays consistent between work days
                    and days off. For most night workers, this anchor period is roughly 8 AM
                    to noon. On days off, you extend sleep in either direction rather than
                    completely flipping your schedule.
                  </p>
                  <p>
                    Bright light exposure during the first half of your shift (7 PM - 1 AM)
                    helps shift your circadian clock toward nocturnal wakefulness. The second
                    half of your shift should have dimmer lighting to begin melatonin
                    production. A 2020 randomized controlled trial found this timed light
                    protocol improved night worker sleep duration by 45 minutes per day.
                  </p>
                </div>
              </div>

              {/* Rotating shift */}
              <div>
                <h3 className="font-headline text-xl font-bold text-on-surface mb-3">
                  Rotating Shifts
                </h3>
                <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
                  <p>
                    Rotating shift workers face the most difficult challenge: their circadian
                    system never fully adapts because the schedule keeps changing. Research
                    consistently shows that rotating shifts produce worse sleep and health
                    outcomes than fixed night shifts, because at least fixed night workers
                    can achieve partial circadian adaptation over 5-7 consecutive nights.
                  </p>
                  <p>
                    If you have any influence over your rotation direction, advocate for
                    forward rotation (day &rarr; evening &rarr; night). This follows the
                    natural tendency of the circadian clock to drift later (the human clock
                    runs slightly longer than 24 hours), making forward adaptation 30-50%
                    faster than backward rotation according to occupational health research.
                  </p>
                  <p>
                    On transition days, the priority is minimizing sleep debt rather than
                    achieving perfect timing. A 90-minute prophylactic nap before your first
                    shift of a new rotation can reduce performance impairment by up to 30%.
                    This is not optional for safety-critical roles.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Split Sleep */}
            <section className="py-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-on-surface">
                Split Sleep: An Evidence-Based Approach
              </h2>
              <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
                <p>
                  Split sleep (also called biphasic or polyphasic sleep) divides the total
                  sleep period into two or more blocks within a 24-hour period. While
                  monophasic sleep (one continuous block) is the cultural norm, split sleep
                  has a strong historical and biological basis. Before artificial lighting,
                  many cultures practiced &quot;first sleep&quot; and &quot;second sleep&quot; with a period
                  of wakefulness between.
                </p>
                <p>
                  For shift workers, the most studied split sleep protocol is 5+1.5 hours or
                  6+2 hours. A landmark 2014 study by Kosmadopoulos and colleagues found that
                  a split sleep schedule (5 hours of daytime sleep plus a 1.5-hour evening nap)
                  produced equivalent alertness, reaction time, and cognitive performance
                  compared to a single 7.5-hour consolidated sleep when total sleep time was
                  matched.
                </p>
                <p>
                  The benefits of split sleep for shift workers include greater scheduling
                  flexibility, the ability to attend to daytime obligations (school pickups,
                  appointments, errands), and improved pre-shift alertness from the second
                  sleep block. The main sleep period captures the majority of deep sleep,
                  while the supplementary nap provides additional REM sleep.
                </p>
                <p>
                  Split sleep is not ideal for everyone. If you can achieve 7-8 hours of
                  uninterrupted daytime sleep, consolidated sleep is generally preferred.
                  Split sleep is most beneficial when environmental factors (noise, light,
                  social demands) prevent quality consolidated sleep, or when your available
                  window between shifts is too short for a full sleep period.
                </p>
                <p>
                  To implement split sleep effectively, align each block with complete 90-minute
                  sleep cycles. A 5-hour main sleep accommodates approximately 3 full cycles
                  (with sleep latency), and a 1.5-hour nap equals exactly 1 cycle. Set alarms
                  at cycle-end points to avoid waking from deep sleep.
                </p>
              </div>
            </section>

            {/* Section 4: Managing Transitions */}
            <section className="py-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-on-surface">
                Managing Shift Transitions
              </h2>
              <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
                <p>
                  Transition days -- when you switch from one shift type to another -- are the
                  highest-risk periods for shift workers. Sleep debt accumulates rapidly, and
                  the temptation to power through on caffeine creates a dangerous cycle.
                  Evidence-based transition strategies can reduce the impact significantly.
                </p>
                <p>
                  <strong className="text-on-surface">Night to Day transition</strong> (the hardest):
                  After your last night shift, sleep for no more than 4-5 hours during the
                  morning. Force yourself to stay awake during the afternoon (mild exercise and
                  bright light exposure help). Go to bed at your normal evening time (10-11 PM).
                  This single day of partial sleep deprivation rapidly resets your circadian
                  phase. Melatonin (0.5-3 mg) taken 30 minutes before your target bedtime
                  can accelerate the transition.
                </p>
                <p>
                  <strong className="text-on-surface">Day to Night transition</strong>:
                  On the day before your first night shift, sleep in later than usual (if possible)
                  and take a 90-minute nap in the late afternoon (4-5:30 PM). This &quot;prophylactic
                  nap&quot; provides a buffer of alertness for your first night. Use bright light
                  exposure during the first half of your night shift and begin wearing
                  blue-blocking glasses 2 hours before your planned daytime sleep.
                </p>
                <p>
                  <strong className="text-on-surface">Days off after night shifts</strong>:
                  The biggest mistake is completely flipping your schedule on days off. Instead,
                  maintain your anchor sleep period (the 4-hour block that stays consistent)
                  and gradually shift the remaining sleep hours. A 2-hour daily shift toward
                  your preferred off-day schedule is the maximum recommended rate to avoid
                  re-inducing jet lag symptoms.
                </p>
              </div>
            </section>

            {/* Section 5: Light Exposure */}
            <section className="py-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-on-surface">
                Light Exposure and Circadian Reset
              </h2>
              <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
                <p>
                  Light is the most powerful zeitgeber (time-giver) for your circadian
                  system. The timing, intensity, and spectrum of light exposure can advance
                  or delay your body clock by 1-3 hours per day when used strategically.
                  For shift workers, light is both the primary obstacle and the most
                  effective tool for adaptation.
                </p>
                <p>
                  <strong className="text-on-surface">Bright light exposure</strong> during
                  the desired wake period signals your brain to suppress melatonin and
                  promote alertness. For night workers, this means getting bright light
                  (preferably 10,000 lux from a light therapy box or overhead fluorescent
                  lights) during the first 4-6 hours of your shift. Portable light therapy
                  visors allow continuous exposure without disrupting your work.
                </p>
                <p>
                  <strong className="text-on-surface">Light avoidance</strong> before sleep is
                  equally important. Night workers should put on blue-light-blocking glasses
                  (amber or orange lenses, not clear &quot;blue light&quot; glasses from computer
                  brands) at least 1-2 hours before their intended sleep time. This means
                  wearing them during the last portion of your shift and on your commute home.
                  Research from the University of Quebec found that blue-blocking glasses worn
                  for 2 hours before daytime sleep increased melatonin levels by 50% and
                  extended sleep duration by 30 minutes.
                </p>
                <p>
                  <strong className="text-on-surface">Sunlight at the wrong time</strong> is
                  the most common mistake. Morning sunlight after a night shift powerfully
                  suppresses melatonin and delays circadian adaptation. Even 15 minutes of
                  direct sunlight can reduce daytime sleep quality. Invest in quality
                  wraparound sunglasses (orange or amber tint is ideal) for the commute
                  home. Park in a garage if possible. Close blackout curtains before you
                  leave for work so you return to a dark bedroom.
                </p>
                <p>
                  For rotating shift workers, light exposure timing must change with each
                  rotation. A simple rule: get bright light during the first half of every
                  shift (whatever type), and avoid bright light for 2 hours before every
                  sleep period. This consistent approach provides circadian support without
                  requiring complex scheduling.
                </p>
              </div>
            </section>

            {/* FAQ */}
            <FAQ items={faqItems} />

            {/* Related Tools */}
            <RelatedTools exclude="/calculators/shift-worker" />

            {/* Medical Disclaimer */}
            <AffiliateCard context="supplement" />

            <MedicalDisclaimer />

            {/* Bottom spacer */}
            <div className="h-12" />
          </div>
        </div>
      </div>
    </>
  );
}
