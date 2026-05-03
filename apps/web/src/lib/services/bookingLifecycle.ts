import type { BookingRequest } from '../domain';

export function acceptBookingRequest(requests: BookingRequest[], acceptedId: string): BookingRequest[] {
  const accepted = requests.find((request) => request.id === acceptedId);
  if (!accepted) return requests;

  return requests.map((request) => {
    if (request.id === acceptedId) return { ...request, status: 'accepted' };

    const competesForSameSlot = request.slotId === accepted.slotId && request.status === 'host_review';
    if (competesForSameSlot) return { ...request, status: 'rejected' };

    return request;
  });
}

export function rejectBookingRequest(requests: BookingRequest[], rejectedId: string): BookingRequest[] {
  return requests.map((request) => request.id === rejectedId ? { ...request, status: 'rejected' } : request);
}

export function getWinningRequestForSlot(requests: BookingRequest[], slotId: string) {
  return requests.find((request) => request.slotId === slotId && request.status === 'accepted') ?? null;
}

export function getHighestPendingOfferForSlot(requests: BookingRequest[], slotId: string) {
  const pending = requests.filter((request) => request.slotId === slotId && request.status === 'host_review');
  return pending.sort((a, b) => b.amount - a.amount)[0] ?? null;
}

export function getAcceptedRequestForSlot(requests: BookingRequest[], slotId: string) {
  return requests.find((request) => request.slotId === slotId && request.status === 'accepted') ?? null;
}

export function getSlotMarketState(requests: BookingRequest[], slotId: string) {
  const accepted = getAcceptedRequestForSlot(requests, slotId);
  const highestPending = getHighestPendingOfferForSlot(requests, slotId);

  return {
    accepted,
    highestPending,
    isTaken: Boolean(accepted),
    nextBidFloor: accepted ? accepted.amount + 100 : highestPending ? highestPending.amount + 100 : null,
  };
}
