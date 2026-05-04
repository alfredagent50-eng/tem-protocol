import type { BookingRequest, RequestType, Slot } from './domain';

export const requestTypes: RequestType[] = [
  { id: 'talk', emoji: '💬', label: 'Talk', short: 'Call / advice', description: 'A focused conversation, brainstorm, or consulting-style call.', tone: 'calm', multiplier: 1 },
  { id: 'favor', emoji: '🛟', label: 'Favor', short: 'Help me out', description: 'You need someone to look, review, connect, fix, or think with you.', tone: 'help', multiplier: 1.2 },
  { id: 'meet', emoji: '☕', label: 'Meet', short: 'In-person time', description: 'Coffee, a quick intro, a focused sit-down, or showing up with context.', tone: 'fun', multiplier: 1.1 },
  { id: 'appearance', emoji: '🪩', label: 'Show up', short: 'Event / club', description: 'Invite someone somewhere and make the ask worth leaving the house.', tone: 'night', multiplier: 1.8 },
  { id: 'urgent', emoji: '⚡', label: 'Urgent', short: 'Drop everything', description: 'This is time-sensitive. Higher floor, stronger signal.', tone: 'hot', multiplier: 2.5 },
];

export const slots: Slot[] = [
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

export const seedRequests: BookingRequest[] = [
  {
    id: 'req-seed-1',
    slotId: 'tue-1500',
    typeId: 'urgent',
    guestName: 'Tal',
    guestEmail: 'tal@example.com',
    note: 'Need you for something time-sensitive. Worth interrupting the day.',
    amount: 40,
    currency: 'USD',
    status: 'host_review',
    createdAt: '2026-05-03T12:00:00Z',
  },
];

export const featuredSlotIds = ['sun-1500', 'sun-1630', 'mon-1100', 'mon-1400'];
export const calendarDays = ['May 3', 'May 4', 'May 5', 'May 6', 'May 7', 'May 10', 'May 11', 'May 13', 'May 14'];
