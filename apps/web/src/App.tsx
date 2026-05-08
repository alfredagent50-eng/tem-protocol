/**
 * Top-level container. Owns the cross-page state: which view, the host
 * token, the current booking selection, the cached request list. Renders
 * Header → page → Footer.
 *
 * Page switching is intentionally minimal — three states (home / guest /
 * host). React Router wasn't needed for this size.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Shared/Header';
import { Footer } from './components/Shared/Footer';
import { LandingPage } from './components/Landing/LandingPage';
import { HostPage } from './components/Host/HostPage';
import { GuestBookingFlow } from './components/Guest/GuestBookingFlow';
import { featuredSlotIds, requestTypes, slots } from './lib/mockData';
import { getRequiredAmount } from './lib/domain';
import {
  confirmPaymentSuccess,
  createPaymentIntent as createApiPaymentIntent,
  createRequest,
  listPublicRequests,
  listRequests,
  markPaymentIntentPaid,
  updateRequestStatus as updateApiRequestStatus,
} from './lib/services/apiClient';
import type { PaymentIntent } from './lib/services/paymentMock';
import type {
  AppView,
  BookingRequest,
  BookingStep,
  HostProfile,
  Slot,
} from './types';
import { defaultHostProfile } from './types';
import {
  getAllSlots,
  getInitialView,
  loadHostProfile,
} from './utils';

const featuredSlots = featuredSlotIds
  .map((id) => slots.find((slot) => slot.id === id))
  .filter((slot): slot is Slot => Boolean(slot));

export function App() {
  const [view, setView] = useState<AppView>(getInitialView);
  const [hostToken, setHostToken] = useState(
    () => window.localStorage.getItem('tem-host-token') ?? '',
  );
  const [selectedSlotId, setSelectedSlotId] = useState(
    featuredSlots[1]?.id ?? slots[0]?.id ?? '',
  );
  const [selectedTypeId, setSelectedTypeId] = useState(requestTypes[0].id);
  const [step, setStep] = useState<BookingStep>('details');
  const [showCalendar, setShowCalendar] = useState(false);
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [, setApiState] = useState<'loading' | 'online' | 'error'>('loading');
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [lastRequest, setLastRequest] = useState<BookingRequest | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [hostProfile, setHostProfile] = useState<HostProfile>(() =>
    loadHostProfile(defaultHostProfile),
  );

  useEffect(() => {
    void refreshRequests();
    const interval = window.setInterval(() => {
      void refreshRequests({ quiet: true });
    }, 3000);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, hostToken]);

  async function refreshRequests(options?: { quiet?: boolean }) {
    try {
      if (!options?.quiet) setApiState('loading');
      setRequests(
        view === 'host' && hostToken
          ? await listRequests(hostToken)
          : await listPublicRequests(),
      );
      setApiState('online');
    } catch {
      setApiState('error');
    }
  }

  const selectedSlot = useMemo(
    () => getAllSlots(hostProfile).find((slot) => slot.id === selectedSlotId) ?? slots[0],
    [selectedSlotId, hostProfile],
  );
  const selectedType = useMemo(
    () => requestTypes.find((type) => type.id === selectedTypeId) ?? requestTypes[0],
    [selectedTypeId],
  );
  // kept for parity with the previous single-file version; the booking
  // flow recomputes the required amount internally with full market context.
  void getRequiredAmount(selectedSlot, selectedType);

  function chooseSlot(slotId: string) {
    setSelectedSlotId(slotId);
    setStep('details');
  }

  function chooseType(typeId: string) {
    setSelectedTypeId(typeId);
    setStep('details');
  }

  async function createPaymentIntent() {
    setApiState('loading');
    setPaymentIntent(
      await createApiPaymentIntent({ slotId: selectedSlot.id, typeId: selectedType.id }),
    );
    setApiState('online');
    setStep('payment');
  }

  async function createPaidRequest() {
    const paidIntent = paymentIntent ? await markPaymentIntentPaid(paymentIntent.id) : null;
    setApiState('loading');
    const request = await createRequest({
      slotId: selectedSlot.id,
      typeId: selectedType.id,
      guestName: name.trim(),
      guestEmail: email.trim(),
      note: note.trim(),
      paymentIntentId: paidIntent?.id ?? paymentIntent?.id ?? `mock-${Date.now()}`,
    });
    const confirmed = await confirmPaymentSuccess({
      paymentIntentId: request.paymentIntentId ?? paymentIntent?.id ?? request.id,
      eventId: `mock-payment-success-${request.id}`,
    });
    setRequests(confirmed.requests);
    setLastRequest(confirmed.requests.find((item) => item.id === request.id) ?? request);
    setApiState('online');
    setPaymentIntent(null);
    setStep('confirmed');
  }

  function saveHostToken(token: string) {
    const trimmed = token.trim();
    setHostToken(trimmed);
    window.localStorage.setItem('tem-host-token', trimmed);
  }

  function saveHostProfile(profile: HostProfile) {
    const allSlotIds = getAllSlots(profile).map((slot) => slot.id);
    const cleanProfile: HostProfile = {
      ...profile,
      slug:
        profile.slug
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '') || 'coffee-host',
      customSlots: profile.customSlots ?? [],
      acceptedTypeIds: profile.acceptedTypeIds ?? defaultHostProfile.acceptedTypeIds,
      typeMinimums: { ...defaultHostProfile.typeMinimums, ...(profile.typeMinimums ?? {}) },
      typeCurrencies: { ...defaultHostProfile.typeCurrencies, ...(profile.typeCurrencies ?? {}) },
      slotIds: profile.slotIds.length
        ? profile.slotIds.filter((id) => allSlotIds.includes(id))
        : defaultHostProfile.slotIds,
      featuredSlotIds: profile.featuredSlotIds
        .filter((id) => profile.slotIds.includes(id))
        .slice(0, 5),
    };
    setHostProfile(cleanProfile);
    window.localStorage.setItem('coffeesip-host-profile', JSON.stringify(cleanProfile));
  }

  async function updateRequestStatus(id: string, status: BookingRequest['status']) {
    setApiState('loading');
    setRequests(await updateApiRequestStatus(id, status, hostToken));
    setApiState('online');
  }

  return (
    <div className={`page-shell tone-${selectedType.tone}`}>
      <Header currentView={view} onNavigate={setView} />

      <main>
        {view === 'home' ? (
          <LandingPage
            onStartHost={() => setView('host')}
            onStartGuest={() => setView('guest')}
            onUnlock={saveHostToken}
            hostProfile={hostProfile}
            onSaveHostProfile={saveHostProfile}
          />
        ) : view === 'guest' ? (
          <GuestBookingFlow
            selectedSlotId={selectedSlotId}
            selectedTypeId={selectedTypeId}
            step={step}
            showCalendar={showCalendar}
            name={name}
            email={email}
            note={note}
            onChooseSlot={chooseSlot}
            onChooseType={chooseType}
            onSetShowCalendar={setShowCalendar}
            onSetName={setName}
            onSetEmail={setEmail}
            onSetNote={setNote}
            paymentIntent={paymentIntent}
            onCreatePaymentIntent={createPaymentIntent}
            onSetStep={setStep}
            requests={requests}
            lastRequest={lastRequest}
            onCreatePaidRequest={createPaidRequest}
            hostProfile={hostProfile}
          />
        ) : (
          <HostPage
            hostToken={hostToken}
            requests={requests}
            onUpdate={updateRequestStatus}
            onUnlock={saveHostToken}
            hostProfile={hostProfile}
            onSaveHostProfile={saveHostProfile}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
