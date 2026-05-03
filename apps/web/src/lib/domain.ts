export type Currency = 'sats' | 'USDT';

export type SlotStatus = 'available' | 'requested';

export type Slot = {
  id: string;
  day: string;
  date: string;
  time: string;
  duration: string;
  minimum: number;
  currency: Currency;
  status: SlotStatus;
  currentOffer?: number;
};

export type RequestType = {
  id: string;
  emoji: string;
  label: string;
  short: string;
  description: string;
  tone: string;
  multiplier: number;
};

export type BookingStep = 'details' | 'payment' | 'confirmed';

export type BookingRequestStatus = 'pending_payment' | 'paid' | 'host_review' | 'accepted' | 'rejected';

export type BookingRequest = {
  id: string;
  slotId: string;
  typeId: string;
  guestName: string;
  guestEmail: string;
  note: string;
  amount: number;
  currency: Currency;
  status: BookingRequestStatus;
  createdAt: string;
};

export function getSlotFloor(slot: Slot) {
  return slot.status === 'requested'
    ? (slot.currentOffer ?? slot.minimum) + 100
    : slot.minimum;
}

export function getRequiredAmount(slot: Slot, requestType: RequestType) {
  return Math.ceil(getSlotFloor(slot) * requestType.multiplier);
}
