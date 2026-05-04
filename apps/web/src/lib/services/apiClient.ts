import type { BookingRequest } from '../domain';

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

export function listRequests() {
  return api<BookingRequest[]>('/requests');
}

export function createRequest(input: Omit<BookingRequest, 'id' | 'status' | 'createdAt'>) {
  return api<BookingRequest>('/requests', {
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
