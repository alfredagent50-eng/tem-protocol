export const slots = [
  { id: 'sun-1500', day: 'Sun', date: 'May 3', time: '15:00', duration: '30 min', minimum: 500, currency: 'sats', status: 'requested', currentOffer: 700 },
  { id: 'sun-1630', day: 'Sun', date: 'May 3', time: '16:30', duration: '30 min', minimum: 500, currency: 'sats', status: 'available' },
  { id: 'mon-1100', day: 'Mon', date: 'May 4', time: '11:00', duration: '30 min', minimum: 2, currency: 'USDT', status: 'available' },
  { id: 'mon-1400', day: 'Mon', date: 'May 4', time: '14:00', duration: '60 min', minimum: 5, currency: 'USDT', status: 'available' },
  { id: 'tue-1000', day: 'Tue', date: 'May 5', time: '10:00', duration: '30 min', minimum: 500, currency: 'sats', status: 'available' },
  { id: 'tue-1500', day: 'Tue', date: 'May 5', time: '15:00', duration: '30 min', minimum: 500, currency: 'sats', status: 'requested', currentOffer: 1200 },
  { id: 'wed-1200', day: 'Wed', date: 'May 6', time: '12:00', duration: '30 min', minimum: 2, currency: 'USDT', status: 'available' },
  { id: 'wed-1700', day: 'Wed', date: 'May 6', time: '17:00', duration: '30 min', minimum: 2, currency: 'USDT', status: 'requested', currentOffer: 4 },
  { id: 'thu-0930', day: 'Thu', date: 'May 7', time: '09:30', duration: '30 min', minimum: 500, currency: 'sats', status: 'available' },
  { id: 'sun2-1600', day: 'Sun', date: 'May 10', time: '16:00', duration: '30 min', minimum: 500, currency: 'sats', status: 'available' },
  { id: 'mon2-1300', day: 'Mon', date: 'May 11', time: '13:00', duration: '60 min', minimum: 5, currency: 'USDT', status: 'requested', currentOffer: 8 },
  { id: 'wed2-1100', day: 'Wed', date: 'May 13', time: '11:00', duration: '30 min', minimum: 2, currency: 'USDT', status: 'available' },
  { id: 'thu2-1500', day: 'Thu', date: 'May 14', time: '15:00', duration: '30 min', minimum: 500, currency: 'sats', status: 'available' }
];

export function getSlotFloor(slot) {
  return slot.status === 'requested' ? (slot.currentOffer ?? slot.minimum) + 100 : slot.minimum;
}

export function getMarketSlots(requests) {
  return slots.map((slot) => {
    const accepted = requests.find((request) => request.slotId === slot.id && request.status === 'accepted') ?? null;
    const pending = requests
      .filter((request) => request.slotId === slot.id && request.status === 'host_review')
      .sort((a, b) => b.amount - a.amount)[0] ?? null;
    const baseFloor = getSlotFloor(slot);
    const nextBidFloor = accepted ? accepted.amount + 100 : pending ? Math.max(baseFloor, pending.amount + 100) : baseFloor;

    return {
      ...slot,
      marketStatus: accepted || slot.status === 'requested' ? 'busy' : pending ? 'requested' : 'open',
      nextBidFloor,
      acceptedRequestId: accepted?.id ?? null,
      highestPendingRequestId: pending?.id ?? null,
    };
  });
}
