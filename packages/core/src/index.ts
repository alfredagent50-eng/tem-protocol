export type MoneyAmount = {
  amount: string;
  currency: 'SATS' | 'USDT' | 'USDC' | string;
};

export type BookingStatus =
  | 'requested'
  | 'payment_pending'
  | 'paid'
  | 'confirmed'
  | 'rejected'
  | 'cancelled'
  | 'completed'
  | 'no_show';

export type BookingRequest = {
  id: string;
  hostId: string;
  guestId?: string;
  startsAt: string;
  endsAt: string;
  minimumPrice: MoneyAmount;
  offeredPrice: MoneyAmount;
  status: BookingStatus;
};
