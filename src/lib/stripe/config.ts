export const STRIPE_CONFIG = {
  prices: {
    proMonthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
    proYearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
  },
  plans: {
    free: {
      name: 'Free',
      price: 0,
      interval: null,
      features: [
        'All calculators & tools',
        'Blog content & statistics',
        'Connect 1 wearable device',
        '7-day sleep history',
        '3 AI coaching sessions/week',
        'Basic dashboard',
        '1 Apple Health import',
      ],
      limitations: [
        'Ads on all pages',
        'Limited device connections',
        'Limited history',
        'Limited AI coaching',
      ],
    },
    proMonthly: {
      name: 'Pro Monthly',
      price: 5.99,
      interval: 'month' as const,
      badge: null,
      features: [
        'Everything in Free, plus:',
        'Ad-free dashboard',
        'Unlimited device connections',
        '90-day sleep history',
        'Unlimited AI coaching',
        'Personal sleep cycle calibration',
        'Weekly AI digest email',
        'Exportable PDF reports',
        'Personalized product recommendations',
        'Unlimited Apple Health imports',
        'Priority support',
      ],
    },
    proYearly: {
      name: 'Pro Yearly',
      price: 49.99,
      interval: 'year' as const,
      badge: 'Save 30%',
      features: [
        'Everything in Free, plus:',
        'Ad-free dashboard',
        'Unlimited device connections',
        '90-day sleep history',
        'Unlimited AI coaching',
        'Personal sleep cycle calibration',
        'Weekly AI digest email',
        'Exportable PDF reports',
        'Personalized product recommendations',
        'Unlimited Apple Health imports',
        'Priority support',
      ],
    },
  },
} as const;

export type PlanKey = keyof typeof STRIPE_CONFIG.plans;
