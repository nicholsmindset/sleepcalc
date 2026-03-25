import type { Metadata } from 'next';
import AffiliateCard from '@/components/content/AffiliateCard';
import { FAQ } from '@/components/content/FAQ';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
import { RelatedTools } from '@/components/content/RelatedTools';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { generateFAQSchema } from '@/utils/schema';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';

export const metadata: Metadata = {
  title: 'Best Mattress for Better Sleep in 2026 — Sleep Stack',
  description:
    'Find the best mattress for your sleep style. Our expert guide covers firmness, materials, and top-rated options for every sleeper type and budget.',
  alternates: {
    canonical: '/best-mattress',
  },
  openGraph: {
    title: 'Best Mattress for Better Sleep in 2026 — Sleep Stack',
    description:
      'Find the best mattress for your sleep style. Our expert guide covers firmness, materials, and top-rated options for every sleeper type and budget.',
    url: '/best-mattress',
    siteName: 'Sleep Stack',
  },
};

const faqItems = [
  {
    question: 'How often should you replace a mattress?',
    answer:
      'Most mattresses should be replaced every 7 to 10 years, though this depends on the material and how well it has been cared for. Memory foam and latex mattresses tend to last longer than innerspring models. Signs it is time to replace your mattress include visible sagging, waking up with aches and pains, or noticing that you sleep better in a hotel or on a different bed. If your mattress is older than 8 years and your sleep quality has declined, replacement is worth considering.',
  },
  {
    question: 'What mattress is best for back pain?',
    answer:
      'A medium-firm mattress is generally recommended for back pain, as it provides enough support to keep the spine in a neutral alignment while still conforming to the natural curves of the body. Research published in the Lancet found that patients with chronic low back pain who slept on medium-firm mattresses reported significantly less pain than those on firm mattresses. Hybrid and latex mattresses are particularly popular for back pain because they combine pressure relief with structural support.',
  },
  {
    question: 'Is a firm mattress better for sleep?',
    answer:
      'Not necessarily — firmness preference depends heavily on your sleep position. Side sleepers typically need a softer surface that can cushion the shoulders and hips. Back sleepers usually do best on a medium to medium-firm mattress. Stomach sleepers benefit from a firmer surface to prevent the hips from sinking too deeply, which can strain the lumbar spine. Combination sleepers often prefer medium firmness that accommodates multiple positions throughout the night.',
  },
  {
    question: "What's the difference between memory foam and latex?",
    answer:
      'Memory foam contours closely to the body, providing excellent pressure relief and motion isolation. It responds slowly to movement, which makes it ideal for couples or anyone who needs deep pressure point relief. The main drawback is heat retention, though gel-infused and open-cell versions mitigate this. Latex, by contrast, is more responsive and springy. It does not trap body heat as readily, making it a popular choice for hot sleepers. Natural latex is also a more sustainable material. Both materials have excellent durability, but latex typically outlasts memory foam by several years.',
  },
  {
    question: 'Do I need a box spring?',
    answer:
      'It depends on your bed frame and mattress type. Modern memory foam and hybrid mattresses are designed to work on a solid platform base, slatted frame with slats no more than 3 inches apart, or an adjustable base. Traditional innerspring mattresses paired with older metal frames may still benefit from a box spring for added height and support. Many mattress companies will void their warranty if the mattress is used on an incompatible foundation, so check the manufacturer guidelines before purchasing.',
  },
  {
    question: 'Can a bad mattress cause sleep problems?',
    answer:
      'Yes. A worn-out or poorly matched mattress can contribute to several sleep problems. Improper spinal alignment caused by sagging or excessive firmness leads to pressure points that cause you to shift positions throughout the night, fragmenting your sleep. Temperature-trapping materials can cause overheating, which disrupts the natural drop in core body temperature needed to enter and maintain deep sleep stages. Allergens that accumulate in old mattresses, including dust mites and mould, can also worsen respiratory symptoms and reduce sleep quality over time.',
  },
];

const faqSchema = generateFAQSchema(faqItems);

export default function BestMattressPage() {
  return (
    <>
      <SchemaMarkup type="FAQPage" data={faqSchema} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Best Mattress', href: '/best-mattress' },
          ]}
        />

        {/* Page Header */}
        <header className="mb-10">
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-on-surface to-on-surface-variant">
            Best Mattress for Better Sleep (2026 Guide)
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
            The quality of your sleep is directly tied to the surface you sleep on. A mattress that
            does not match your body type, sleep position, or temperature preferences can silently
            erode your sleep quality night after night — often without you realising it is the cause.
            This guide cuts through the marketing noise and focuses on what the sleep science
            actually supports.
          </p>
        </header>

        {/* Top picks immediately visible */}
        <AffiliateCard context="mattress" />

        {/* How to Choose Section */}
        <section className="py-12 max-w-3xl mx-auto">
          <h2 className="font-headline text-2xl md:text-3xl font-bold mb-8 text-on-surface">
            How to Choose the Right Mattress
          </h2>

          <div className="space-y-5">
            {/* Firmness by Sleep Position */}
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 p-6">
              <h3 className="font-headline text-xl font-bold mb-3 text-on-surface">
                Firmness by Sleep Position
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                Firmness is not a universal preference — it is determined by how your body loads the
                mattress surface. Getting this wrong is the most common cause of waking up stiff or
                sore.
              </p>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                <li className="flex gap-2">
                  <span className="text-primary font-bold shrink-0">Side sleeper</span>
                  <span>
                    Medium-soft (4–5 out of 10). Your shoulders and hips need to sink in enough to
                    keep the spine level.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold shrink-0">Back sleeper</span>
                  <span>
                    Medium-firm (5–7). Enough give for the lumbar curve, enough support to prevent
                    the hips from dropping.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold shrink-0">Stomach sleeper</span>
                  <span>
                    Firm (7–9). A softer surface lets the hips sink below the shoulders, hyperextending
                    the lumbar spine overnight.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold shrink-0">Combination sleeper</span>
                  <span>
                    Medium (5–6). A balanced feel with a responsive top layer that allows easy position
                    changes without feeling stuck.
                  </span>
                </li>
              </ul>
            </div>

            {/* Mattress Materials */}
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 p-6">
              <h3 className="font-headline text-xl font-bold mb-3 text-on-surface">
                Mattress Materials
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                The construction of a mattress determines how it feels, how long it lasts, and whether
                it will sleep hot or cool. Each material has a distinct performance profile.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-on-surface-variant">
                <div className="rounded-xl border border-outline-variant/15 bg-surface-container p-4">
                  <p className="font-bold text-on-surface mb-1">Memory Foam</p>
                  <p>
                    Excels at pressure relief and motion isolation. Ideal for side sleepers and
                    couples. Can sleep warm — look for gel-infused or open-cell variants.
                  </p>
                </div>
                <div className="rounded-xl border border-outline-variant/15 bg-surface-container p-4">
                  <p className="font-bold text-on-surface mb-1">Latex</p>
                  <p>
                    Naturally responsive and cooling. Bounces back quickly so you do not feel stuck.
                    Durable — natural latex mattresses often last 15+ years.
                  </p>
                </div>
                <div className="rounded-xl border border-outline-variant/15 bg-surface-container p-4">
                  <p className="font-bold text-on-surface mb-1">Hybrid</p>
                  <p>
                    Pocketed coils beneath a foam or latex comfort layer. Balanced feel with better
                    airflow than all-foam. A good middle-ground for most sleepers.
                  </p>
                </div>
                <div className="rounded-xl border border-outline-variant/15 bg-surface-container p-4">
                  <p className="font-bold text-on-surface mb-1">Innerspring</p>
                  <p>
                    The original coil design. Bouncy, cool-sleeping, and widely available. Less
                    pressure relief than foam but preferred by those who like a traditional feel.
                  </p>
                </div>
              </div>
            </div>

            {/* Motion Isolation */}
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 p-6">
              <h3 className="font-headline text-xl font-bold mb-3 text-on-surface">
                Motion Isolation
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-3">
                If you share a bed, motion transfer can be a significant source of sleep disruption.
                Every time your partner shifts position or gets up, vibrations travel through the
                mattress and can pull you out of a lighter sleep stage.
              </p>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Memory foam absorbs movement at the point of contact, making it the best choice for
                motion isolation. Natural latex performs similarly well. Hybrid mattresses with
                individually pocketed coils — where each spring moves independently — offer a good
                balance of motion isolation and responsiveness. Interconnected innerspring coils
                transfer motion most readily and are generally not recommended for couples with
                different sleep schedules.
              </p>
            </div>

            {/* Budget Guide */}
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 p-6">
              <h3 className="font-headline text-xl font-bold mb-3 text-on-surface">
                Budget Guide
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                Price does not always correlate with quality, but it does correlate with material
                composition and durability. Here is what to expect at each tier.
              </p>
              <div className="space-y-3 text-sm text-on-surface-variant">
                <div className="flex gap-3 items-start">
                  <span className="font-bold text-on-surface shrink-0 min-w-[120px]">
                    Budget (under $800)
                  </span>
                  <span>
                    All-foam construction is common at this price point. Look for CertiPUR-US
                    certified foam. Expect a 5–7 year lifespan. Fine for guest rooms or shorter-term
                    use.
                  </span>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="font-bold text-on-surface shrink-0 min-w-[120px]">
                    Mid-range ($800–$1,500)
                  </span>
                  <span>
                    Hybrid options become available with better edge support and airflow. This is the
                    sweet spot for most sleepers — good quality materials with 8–10 year durability.
                  </span>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="font-bold text-on-surface shrink-0 min-w-[120px]">
                    Premium ($1,500+)
                  </span>
                  <span>
                    Natural latex, luxury hybrid coil systems, and advanced cooling technologies.
                    Longer warranties (10–25 years) and better craftsmanship. Worth it if you plan
                    to keep the mattress a decade or more.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <FAQ items={faqItems} />
        </div>

        {/* Related Tools */}
        <div className="max-w-3xl mx-auto">
          <RelatedTools exclude="/best-mattress" />
        </div>

        {/* Medical Disclaimer */}
        <div className="max-w-3xl mx-auto">
          <MedicalDisclaimer />
        </div>
      </div>
    </>
  );
}
