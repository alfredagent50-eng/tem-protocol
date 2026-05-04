import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-12-17.clover' })
  : null;

function toMinorUnits(amount) {
  return Math.round(amount * 100);
}

function toProviderCurrency(currency) {
  return currency.toLowerCase();
}

function createMockIntent(input) {
  return {
    id: `pay-${Date.now()}`,
    provider: 'mock',
    status: 'created',
    amount: input.amount,
    currency: input.currency,
    checkoutMode: 'simulated',
  };
}

async function createStripeIntent(input) {
  if (!stripe) return createMockIntent(input);

  const intent = await stripe.paymentIntents.create({
    amount: toMinorUnits(input.amount),
    currency: toProviderCurrency(input.currency),
    automatic_payment_methods: { enabled: true },
    metadata: {
      product: 'coffeesip',
      paymentFlow: 'guest_to_host_time_request',
    },
  });

  return {
    id: intent.id,
    provider: 'stripe',
    status: intent.status,
    amount: input.amount,
    currency: input.currency,
    clientSecret: intent.client_secret,
    checkoutMode: 'payment_element',
  };
}

function getProviderName() {
  if (process.env.PAYMENT_PROVIDER) return process.env.PAYMENT_PROVIDER;
  return stripe ? 'stripe' : 'mock';
}

export async function createPaymentIntent(input) {
  const provider = getProviderName();

  if (provider === 'stripe') return createStripeIntent(input);

  // Placeholder for Israel/local PSP integration. Keep API contract stable while
  // we evaluate Grow/Meshulam, PayPlus, Tranzila, Allpay, or a US Stripe entity.
  if (['grow', 'payplus', 'tranzila', 'allpay'].includes(provider)) {
    return {
      ...createMockIntent(input),
      provider,
      checkoutMode: 'redirect_placeholder',
    };
  }

  return createMockIntent(input);
}

export async function simulatePaymentPaid(id) {
  return {
    id,
    provider: getProviderName() === 'stripe' ? 'mock' : getProviderName(),
    status: 'paid',
  };
}
