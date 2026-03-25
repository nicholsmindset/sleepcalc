import Link from 'next/link';
import { ExternalLink, Star } from 'lucide-react';

interface Product {
  name: string;
  category: string;
  description: string;
  rating: number;
  price: string;
  href: string;
  badge?: string;
}

const PRODUCTS: Record<string, Product[]> = {
  mattress: [
    {
      name: 'Saatva Classic',
      category: 'Mattress',
      description: 'Luxury innerspring with lumbar support. Best for back pain and side sleepers who run warm.',
      rating: 4.8,
      price: 'From $887',
      href: 'https://www.saatva.com',
      badge: 'Editor\'s Pick',
    },
    {
      name: 'Casper Original',
      category: 'Mattress',
      description: 'Zoned support foam that relieves pressure at the shoulders and hips. Great for most sleep positions.',
      rating: 4.6,
      price: 'From $695',
      href: 'https://casper.com',
    },
    {
      name: 'Purple RestorePlus',
      category: 'Mattress',
      description: 'Unique grid technology keeps you cool and adapts to your body shape in real time.',
      rating: 4.7,
      price: 'From $1,299',
      href: 'https://purple.com',
      badge: 'Best for Hot Sleepers',
    },
  ],
  supplement: [
    {
      name: 'Magnesium Glycinate',
      category: 'Supplement',
      description: 'The most bioavailable form of magnesium. Promotes deep sleep without next-day grogginess.',
      rating: 4.7,
      price: '~$20–30/mo',
      href: 'https://www.amazon.com/s?k=magnesium+glycinate+sleep',
      badge: 'Most Recommended',
    },
    {
      name: 'Low-Dose Melatonin (0.5mg)',
      category: 'Supplement',
      description: 'Research supports 0.3–0.5mg — far less than most products sell. Shifts your clock, doesn\'t sedate.',
      rating: 4.5,
      price: '~$10–15/mo',
      href: 'https://www.amazon.com/s?k=melatonin+0.5mg',
    },
    {
      name: 'Tart Cherry Extract',
      category: 'Supplement',
      description: 'Natural melatonin source. Studies show it extends sleep by 84 minutes and improves quality.',
      rating: 4.4,
      price: '~$15–25/mo',
      href: 'https://www.amazon.com/s?k=tart+cherry+extract+sleep',
    },
  ],
  tracker: [
    {
      name: 'Oura Ring Gen 3',
      category: 'Sleep Tracker',
      description: 'The most accurate consumer sleep tracker. Measures sleep stages, HRV, temp, and readiness daily.',
      rating: 4.8,
      price: 'From $299',
      href: 'https://ouraring.com',
      badge: 'Most Accurate',
    },
    {
      name: 'Whoop 4.0',
      category: 'Sleep Tracker',
      description: 'Subscription-based wearable focused on recovery and strain. No display — pure data.',
      rating: 4.5,
      price: '$30/mo (free device)',
      href: 'https://www.whoop.com',
    },
  ],
  environment: [
    {
      name: 'Hatch Restore 2',
      category: 'Sleep Device',
      description: 'Sunrise alarm, white noise, and meditation combined. Wakes you gently at the end of a sleep cycle.',
      rating: 4.7,
      price: '$199',
      href: 'https://www.hatch.co',
      badge: 'Best Alarm Clock',
    },
    {
      name: 'LectroFan Evo',
      category: 'White Noise Machine',
      description: 'Twenty-two non-looping sounds including fan, white, pink, and brown noise. Sleep lab tested.',
      rating: 4.6,
      price: '$45',
      href: 'https://www.amazon.com/s?k=lectrofan+evo',
    },
  ],
};

type Context = 'mattress' | 'supplement' | 'tracker' | 'environment' | 'general';

const CONTEXT_MAP: Record<Context, (keyof typeof PRODUCTS)[]> = {
  mattress: ['mattress'],
  supplement: ['supplement'],
  tracker: ['tracker'],
  environment: ['environment'],
  general: ['mattress', 'supplement'],
};

const CONTEXT_TITLES: Record<Context, string> = {
  mattress: 'Top-Rated Mattresses for Better Sleep',
  supplement: 'Sleep Supplements Worth Trying',
  tracker: 'Sleep Trackers That Actually Work',
  environment: 'Sleep Environment Upgrades',
  general: 'Sleep Products Worth Trying',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="w-3 h-3 fill-[#f9ca24] text-[#f9ca24]" />
      <span className="text-xs text-on-surface-variant font-mono">{rating.toFixed(1)}</span>
    </div>
  );
}

interface AffiliateCardProps {
  context?: Context;
}

export default function AffiliateCard({ context = 'general' }: AffiliateCardProps) {
  const categories = CONTEXT_MAP[context];
  const products = categories.flatMap((cat) => PRODUCTS[cat]).slice(0, 3);
  const title = CONTEXT_TITLES[context];

  return (
    <aside className="my-10 rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 p-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
          Affiliate
        </span>
      </div>
      <h3 className="font-headline text-lg font-bold text-on-surface mb-4">{title}</h3>

      <div className="grid gap-3 sm:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.name}
            href={product.href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="group relative flex flex-col rounded-xl border border-outline-variant/15 bg-surface-container p-4 hover:border-primary/40 hover:bg-surface-container-high transition-all"
          >
            {product.badge && (
              <span className="absolute -top-2 left-3 text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                {product.badge}
              </span>
            )}
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60 mb-1">
                {product.category}
              </p>
              <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors mb-1">
                {product.name}
              </p>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                {product.description}
              </p>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                <StarRating rating={product.rating} />
                <span className="text-xs text-on-surface-variant">{product.price}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-on-surface-variant/50 group-hover:text-primary transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-3 text-[10px] text-on-surface-variant/40 leading-relaxed">
        Sleep Stack may earn a commission if you purchase through these links. We only recommend products we&apos;d use ourselves.
      </p>
    </aside>
  );
}
