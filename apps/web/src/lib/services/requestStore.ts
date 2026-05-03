import { seedRequests } from '../mockData';
import type { BookingRequest } from '../domain';

const STORAGE_KEY = 'tem.requests';

export function loadRequests(): BookingRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as BookingRequest[] : seedRequests;
  } catch {
    return seedRequests;
  }
}

export function saveRequests(requests: BookingRequest[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export function createBookingRequest(input: Omit<BookingRequest, 'id' | 'status' | 'createdAt'>): BookingRequest {
  return {
    ...input,
    id: `req-${Date.now()}`,
    status: 'host_review',
    createdAt: new Date().toISOString(),
  };
}

export function updateBookingRequestStatus(
  requests: BookingRequest[],
  id: string,
  status: BookingRequest['status'],
) {
  return requests.map((request) => request.id === id ? { ...request, status } : request);
}
