export const slots = [
  { id: 'sun-1500', day: 'Sun', date: 'May 3', time: '15:00', duration: '30 min', minimum: 7, currency: 'USD', status: 'requested', currentOffer: 10 },
  { id: 'sun-1630', day: 'Sun', date: 'May 3', time: '16:30', duration: '30 min', minimum: 7, currency: 'USD', status: 'available' },
  { id: 'mon-1100', day: 'Mon', date: 'May 4', time: '11:00', duration: '30 min', minimum: 9, currency: 'USD', status: 'available' },
  { id: 'mon-1400', day: 'Mon', date: 'May 4', time: '14:00', duration: '60 min', minimum: 18, currency: 'USD', status: 'available' },
  { id: 'tue-1000', day: 'Tue', date: 'May 5', time: '10:00', duration: '30 min', minimum: 9, currency: 'USD', status: 'available' },
  { id: 'tue-1500', day: 'Tue', date: 'May 5', time: '15:00', duration: '30 min', minimum: 10, currency: 'USD', status: 'requested', currentOffer: 16 },
  { id: 'wed-1200', day: 'Wed', date: 'May 6', time: '12:00', duration: '30 min', minimum: 9, currency: 'USD', status: 'available' },
  { id: 'wed-1700', day: 'Wed', date: 'May 6', time: '17:00', duration: '30 min', minimum: 10, currency: 'USD', status: 'requested', currentOffer: 13 },
  { id: 'thu-0930', day: 'Thu', date: 'May 7', time: '09:30', duration: '30 min', minimum: 9, currency: 'USD', status: 'available' },
  { id: 'sun2-1600', day: 'Sun', date: 'May 10', time: '16:00', duration: '30 min', minimum: 9, currency: 'USD', status: 'available' },
  { id: 'mon2-1300', day: 'Mon', date: 'May 11', time: '13:00', duration: '60 min', minimum: 18, currency: 'USD', status: 'requested', currentOffer: 25 },
  { id: 'wed2-1100', day: 'Wed', date: 'May 13', time: '11:00', duration: '30 min', minimum: 9, currency: 'USD', status: 'available' },
  { id: 'thu2-1500', day: 'Thu', date: 'May 14', time: '15:00', duration: '30 min', minimum: 9, currency: 'USD', status: 'available' },
];

export const requestTypes = [
  { id: 'talk', multiplier: 1 },
  { id: 'favor', multiplier: 1.2 },
  { id: 'meet', multiplier: 1.1 },
  { id: 'appearance', multiplier: 1.8 },
  { id: 'urgent', multiplier: 2.5 },
];

export function getSlotFloor(slot) {
  return slot.status === 'requested' ? (slot.currentOffer ?? slot.minimum) + 100 : slot.minimum;
}

function parseCustomSlot(slotId) {
  const match = /^custom-\d{4}-\d{2}-\d{2}-\d{4}-(\d+)-(\d+)$/.exec(slotId);
  if (!match) return null;
  return {
    id: slotId,
    minimum: Number(match[2]),
    currency: 'USD',
    status: 'available',
  };
}

export function priceRequest({ slotId, typeId }, requests = []) {
  const slot = slots.find((item) => item.id === slotId) ?? parseCustomSlot(slotId);
  const requestType = requestTypes.find((item) => item.id === typeId);
  if (!slot || !requestType) return null;

  const accepted = requests.find((request) => request.slotId === slot.id && request.status === 'accepted') ?? null;
  const pending = requests
    .filter((request) => request.slotId === slot.id && ['paid', 'host_review'].includes(request.status))
    .sort((a, b) => b.amount - a.amount)[0] ?? null;
  const baseFloor = getSlotFloor(slot);
  const floor = accepted ? accepted.amount + 100 : pending ? Math.max(baseFloor, pending.amount + 100) : baseFloor;

  return {
    amount: Math.ceil(floor * requestType.multiplier),
    currency: slot.currency,
  };
}

export function getMarketSlots(requests) {
  return slots.map((slot) => {
    const accepted = requests.find((request) => request.slotId === slot.id && request.status === 'accepted') ?? null;
    const pending = requests
      .filter((request) => request.slotId === slot.id && ['paid', 'host_review'].includes(request.status))
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
