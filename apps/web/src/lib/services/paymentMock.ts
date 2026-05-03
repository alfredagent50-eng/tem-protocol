import type { Currency } from '../domain';

export type MockPaymentIntent = {
  id: string;
  amount: number;
  currency: Currency;
  status: 'created' | 'paid';
};

export function createMockPaymentIntent(input: { amount: number; currency: Currency }): MockPaymentIntent {
  return {
    id: `pay-${Date.now()}`,
    amount: input.amount,
    currency: input.currency,
    status: 'created',
  };
}

export function markMockPaymentPaid(intent: MockPaymentIntent): MockPaymentIntent {
  return { ...intent, status: 'paid' };
}
