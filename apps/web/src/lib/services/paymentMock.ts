import type { Currency } from '../domain';

export type PaymentProvider = 'mock' | 'stripe' | 'grow' | 'payplus' | 'tranzila' | 'allpay';

export type PaymentIntent = {
  id: string;
  provider?: PaymentProvider;
  amount: number;
  currency: Currency;
  status: 'created' | 'paid' | 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  clientSecret?: string | null;
  checkoutMode?: 'simulated' | 'payment_element' | 'redirect_placeholder';
};

export type MockPaymentIntent = PaymentIntent;
