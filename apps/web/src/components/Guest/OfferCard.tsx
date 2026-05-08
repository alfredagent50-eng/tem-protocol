/**
 * A single bookable slot, rendered as a selectable card. Shows the day,
 * the time, and the bid floor or minimum sip — whichever applies given
 * current market state.
 */
import React from 'react';
import { getSlotFloor } from '../../lib/domain';
import { getHighestPendingOfferForSlot, getSlotMarketState } from '../../lib/services/bookingLifecycle';
import type { BookingRequest, Slot } from '../../types';

type OfferCardProps = {
  slot: Slot;
  requests: BookingRequest[];
  selected: boolean;
  onClick: () => void;
};

export function OfferCard({ slot, requests, selected, onClick }: OfferCardProps) {
  const market = getSlotMarketState(requests, slot.id);
  const pendingOffer = getHighestPendingOfferForSlot(requests, slot.id);
  const displayedFloor =
    market.nextBidFloor ?? Math.max(getSlotFloor(slot), pendingOffer?.amount ?? 0);
  const isBusy = slot.status === 'requested' || market.isTaken;
  return (
    <button className={`slot-card ${selected ? 'selected' : ''}`} onClick={onClick}>
      <span className="slot-date">
        <strong>{slot.day}</strong>
        <small>{slot.date}</small>
      </span>
      <span className="slot-time">
        <strong>{slot.time}</strong>
        <small>{slot.duration}</small>
      </span>
      <span className={isBusy ? 'pill warm' : 'pill'}>
        {isBusy
          ? `Bid ${displayedFloor} ${slot.currency}`
          : `Min ${slot.minimum} ${slot.currency}`}
      </span>
    </button>
  );
}

export function formatCalendarSlot(slot: Slot, requests: BookingRequest[]): string {
  const market = getSlotMarketState(requests, slot.id);
  if (slot.status === 'requested' || market.isTaken) {
    return `Busy · bid ${market.nextBidFloor ?? getSlotFloor(slot)} ${slot.currency}`;
  }
  const pending = getHighestPendingOfferForSlot(requests, slot.id);
  if (pending) return `Requested · bid ${pending.amount + 100} ${slot.currency}`;
  return `Open · min ${slot.minimum} ${slot.currency}`;
}
