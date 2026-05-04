import type { BookingRequest } from '../domain';
import type { PaymentIntent } from './paymentMock';

const API_BASE = import.meta.env.VITE_TEM_API_URL ?? 'http://localhost:8787';

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${await response.text()}`);
  }

  return response.json() as Promise<T>;
}

export function listRequests(hostToken?: string) {
  return api<BookingRequest[]>('/requests', {
    headers: hostToken ? { authorization: `Bearer ${hostToken}` } : undefined,
  });
}

export function listPublicRequests() {
  return api<BookingRequest[]>('/public/requests');
}

export function createRequest(input: Pick<BookingRequest, 'slotId' | 'typeId' | 'guestName' | 'guestEmail' | 'note'> & { paymentIntentId: string }) {
  return api<BookingRequest>('/requests', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function createPaymentIntent(input: { slotId: string; typeId: string }) {
  return api<PaymentIntent>('/payment-intents', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function markPaymentIntentPaid(id: string) {
  return api<PaymentIntent>(`/payment-intents/${id}/simulate-paid`, {
    method: 'POST',
  });
}

export function confirmPaymentSuccess(input: { paymentIntentId: string; eventId: string }) {
  return api<{ ok: boolean; idempotent: boolean; requests: BookingRequest[] }>('/webhooks/payment-success', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateRequestStatus(id: string, status: BookingRequest['status'], hostToken?: string) {
  return api<BookingRequest[]>(`/requests/${id}/status`, {
    method: 'PATCH',
    headers: hostToken ? { authorization: `Bearer ${hostToken}` } : undefined,
    body: JSON.stringify({ status }),
  });
}
