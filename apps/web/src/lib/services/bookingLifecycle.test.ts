import { describe, expect, it } from 'vitest';
import type { BookingRequest } from '../domain';
import { acceptBookingRequest, getHighestPendingOfferForSlot, rejectBookingRequest } from './bookingLifecycle';

const baseRequest: BookingRequest = {
  id: 'req-1',
  slotId: 'slot-a',
  typeId: 'talk',
  guestName: 'Guest',
  guestEmail: 'guest@example.com',
  note: '',
  amount: 100,
  currency: 'USD',
  status: 'host_review',
  createdAt: '2026-05-03T00:00:00Z',
};

describe('booking lifecycle', () => {
  it('accepts one request and rejects competing pending requests for the same slot', () => {
    const requests: BookingRequest[] = [
      baseRequest,
      { ...baseRequest, id: 'req-2', amount: 200 },
      { ...baseRequest, id: 'req-3', slotId: 'slot-b' },
    ];

    const result = acceptBookingRequest(requests, 'req-2');

    expect(result.find((request) => request.id === 'req-2')?.status).toBe('accepted');
    expect(result.find((request) => request.id === 'req-1')?.status).toBe('rejected');
    expect(result.find((request) => request.id === 'req-3')?.status).toBe('host_review');
  });

  it('rejects a single request without touching others', () => {
    const result = rejectBookingRequest([
      baseRequest,
      { ...baseRequest, id: 'req-2' },
    ], 'req-1');

    expect(result.find((request) => request.id === 'req-1')?.status).toBe('rejected');
    expect(result.find((request) => request.id === 'req-2')?.status).toBe('host_review');
  });

  it('returns the highest pending offer for a slot', () => {
    const winner = getHighestPendingOfferForSlot([
      baseRequest,
      { ...baseRequest, id: 'req-2', amount: 250 },
      { ...baseRequest, id: 'req-paid', amount: 300, status: 'paid' },
      { ...baseRequest, id: 'req-3', amount: 200, status: 'accepted' },
    ], 'slot-a');

    expect(winner?.id).toBe('req-paid');
  });
});
