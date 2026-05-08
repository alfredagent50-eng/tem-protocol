/**
 * Cross-component shared types and the host-profile model.
 * Domain types (Slot, BookingRequest) live in `lib/domain.ts` — re-export
 * them here so component files only need one import.
 */
import type {
  BookingRequest,
  BookingStep,
  RequestType,
  Slot,
} from './lib/domain';
import { requestTypes, slots, featuredSlotIds } from './lib/mockData';

export type { BookingRequest, BookingStep, RequestType, Slot };

export type AppView = 'home' | 'guest' | 'host';

export type HostProfile = {
  name: string;
  email: string;
  slug: string;
  slotIds: string[];
  featuredSlotIds: string[];
  customSlots: Slot[];
  acceptedTypeIds: string[];
  typeMinimums: Record<string, number>;
  typeCurrencies: Record<string, string>;
};

export const defaultHostProfile: HostProfile = {
  name: 'CoffeeSip Host',
  email: '',
  slug: 'coffee-host',
  slotIds: slots.map((slot) => slot.id),
  featuredSlotIds,
  customSlots: [],
  acceptedTypeIds: [],
  typeMinimums: Object.fromEntries(
    requestTypes.map((type) => [
      type.id,
      type.id === 'urgent'
        ? 25
        : type.id === 'appearance'
        ? 18
        : type.id === 'favor'
        ? 12
        : type.id === 'meet'
        ? 11
        : 10,
    ]),
  ),
  typeCurrencies: Object.fromEntries(requestTypes.map((type) => [type.id, '$'])),
};
