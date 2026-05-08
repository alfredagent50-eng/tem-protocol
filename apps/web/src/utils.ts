/**
 * Small helpers shared across components.
 * The big domain logic lives in `lib/domain.ts` and `lib/services/*`.
 */
import { slots } from './lib/mockData';
import type { BookingRequest, HostProfile, Slot } from './types';

export function getAllSlots(profile: HostProfile): Slot[] {
  return [...slots, ...(profile.customSlots ?? [])];
}

export function getDayLabel(dateValue: string): string {
  const date = new Date(`${dateValue}T12:00:00`);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function getDateLabel(dateValue: string): string {
  const date = new Date(`${dateValue}T12:00:00`);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function minutesFromTime(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function timeFromMinutes(total: number): string {
  const hours = Math.floor(total / 60).toString().padStart(2, '0');
  const minutes = (total % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function generateAvailabilitySlots(input: {
  date: string;
  from: string;
  to: string;
  duration: number;
  minimum: number;
}): Slot[] {
  const start = minutesFromTime(input.from);
  const end = minutesFromTime(input.to);
  if (!input.date || end <= start || input.duration <= 0) return [];
  const generated: Slot[] = [];
  for (let current = start; current + input.duration <= end; current += input.duration) {
    generated.push({
      id: `custom-${input.date}-${timeFromMinutes(current).replace(':', '')}-${input.duration}`,
      day: getDayLabel(input.date),
      date: getDateLabel(input.date),
      time: timeFromMinutes(current),
      duration: `${input.duration} min`,
      minimum: input.minimum,
      currency: 'USD',
      status: 'available',
    });
  }
  return generated;
}

export function loadHostProfile(defaultProfile: HostProfile): HostProfile {
  try {
    const stored = window.localStorage.getItem('coffeesip-host-profile');
    return stored ? { ...defaultProfile, ...JSON.parse(stored) } : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

export function getInitialView(): 'home' | 'guest' | 'host' {
  const params = new URLSearchParams(window.location.search);
  const hostParam = params.get('host');
  if (hostParam && hostParam !== '1') return 'guest';
  if (params.get('guest') === '1') return 'guest';
  return hostParam === '1' || window.location.hash === '#host' ? 'host' : 'home';
}

export function statusLabel(status: BookingRequest['status']): string {
  return status.replace('_', ' ');
}

export function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(diffMs) || diffMs < 0) return 'just now';
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
