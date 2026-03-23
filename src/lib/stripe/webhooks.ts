import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function getItemPeriod(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0];
  return {
    start: item ? new Date(item.current_period_start * 1000).toISOString() : null,
    end: item ? new Date(item.current_period_end * 1000).toISOString() : null,
  };
}

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = getAdminSupabase();
  const userId = session.metadata?.userId;
  if (!userId) return;

  const subscriptionId = session.subscription as string;
  const customerId = session.customer as string;

  // Update profile with Stripe customer ID and Pro tier
  await supabase
    .from('profiles')
    .update({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      subscription_tier: 'pro',
    })
    .eq('id', userId);

  // Create subscription record
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const period = getItemPeriod(subscription);

  await supabase.from('subscriptions').upsert({
    user_id: userId,
    stripe_subscription_id: subscriptionId,
    stripe_price_id: subscription.items.data[0]?.price.id ?? null,
    status: subscription.status as 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete',
    current_period_start: period.start,
    current_period_end: period.end,
    cancel_at: subscription.cancel_at
      ? new Date(subscription.cancel_at * 1000).toISOString()
      : null,
  }, { onConflict: 'stripe_subscription_id' });
}

export async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const supabase = getAdminSupabase();
  const userId = subscription.metadata?.userId;
  const period = getItemPeriod(subscription);

  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status as 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete',
      stripe_price_id: subscription.items.data[0]?.price.id ?? null,
      current_period_start: period.start,
      current_period_end: period.end,
      cancel_at: subscription.cancel_at
        ? new Date(subscription.cancel_at * 1000).toISOString()
        : null,
    })
    .eq('stripe_subscription_id', subscription.id);

  // If canceled, downgrade to free
  if (subscription.status === 'canceled' || subscription.status === 'incomplete_expired') {
    if (userId) {
      await supabase
        .from('profiles')
        .update({ subscription_tier: 'free' })
        .eq('id', userId);
    }
  }
}

export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const supabase = getAdminSupabase();
  const userId = subscription.metadata?.userId;

  await supabase
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('stripe_subscription_id', subscription.id);

  if (userId) {
    await supabase
      .from('profiles')
      .update({ subscription_tier: 'free' })
      .eq('id', userId);
  }
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const supabase = getAdminSupabase();
  // In Stripe v20, subscription info is in parent.subscription_details
  const subscriptionId = (invoice.parent?.subscription_details as { subscription?: string } | null)?.subscription;
  if (!subscriptionId || typeof subscriptionId !== 'string') return;

  await supabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', subscriptionId);
}
