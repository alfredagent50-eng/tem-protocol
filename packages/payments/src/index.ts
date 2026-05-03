import type { MoneyAmount } from '../../core/src';

export type PaymentIntent = {
  id: string;
  amount: MoneyAmount;
  status: 'created' | 'pending' | 'paid' | 'expired' | 'refunded' | 'failed';
  paymentUrl?: string;
};

export interface PaymentRail {
  createIntent(input: { amount: MoneyAmount; metadata?: Record<string, string> }): Promise<PaymentIntent>;
  getIntent(id: string): Promise<PaymentIntent>;
}
