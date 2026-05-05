import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { calendarDays, featuredSlotIds, requestTypes, slots } from './lib/mockData';
import { getRequiredAmount, getSlotFloor, type BookingRequest, type BookingStep, type Slot } from './lib/domain';
import { getHighestPendingOfferForSlot, getSlotMarketState } from './lib/services/bookingLifecycle';
import type { PaymentIntent } from './lib/services/paymentMock';
import { confirmPaymentSuccess, createPaymentIntent as createApiPaymentIntent, createRequest, listPublicRequests, listRequests, markPaymentIntentPaid, updateRequestStatus as updateApiRequestStatus } from './lib/services/apiClient';
import './styles.css';

const featuredSlots = featuredSlotIds
  .map((id) => slots.find((slot) => slot.id === id))
  .filter((slot): slot is Slot => Boolean(slot));

type HostProfile = {
  name: string;
  email: string;
  slug: string;
  slotIds: string[];
  featuredSlotIds: string[];
  customSlots: Slot[];
  acceptedTypeIds: string[];
};

const defaultHostProfile: HostProfile = {
  name: 'CoffeeSip Host',
  email: '',
  slug: 'coffee-host',
  slotIds: slots.map((slot) => slot.id),
  featuredSlotIds,
  customSlots: [],
  acceptedTypeIds: requestTypes.map((type) => type.id),
};

function getAllSlots(profile: HostProfile) {
  return [...slots, ...(profile.customSlots ?? [])];
}

function getDayLabel(dateValue: string) {
  const date = new Date(`${dateValue}T12:00:00`);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function getDateLabel(dateValue: string) {
  const date = new Date(`${dateValue}T12:00:00`);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function minutesFromTime(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours * 60) + minutes;
}

function timeFromMinutes(total: number) {
  const hours = Math.floor(total / 60).toString().padStart(2, '0');
  const minutes = (total % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function generateAvailabilitySlots(input: { date: string; from: string; to: string; duration: number; minimum: number }): Slot[] {
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

function loadHostProfile(): HostProfile {
  try {
    const stored = window.localStorage.getItem('coffeesip-host-profile');
    return stored ? { ...defaultHostProfile, ...JSON.parse(stored) } : defaultHostProfile;
  } catch {
    return defaultHostProfile;
  }
}

function getInitialView() {
  const params = new URLSearchParams(window.location.search);
  return params.get('host') === '1' || window.location.hash === '#host' ? 'host' : 'guest';
}

function App() {
  const [view, setView] = useState<'guest' | 'host'>(getInitialView);
  const [hostToken, setHostToken] = useState(() => window.localStorage.getItem('tem-host-token') ?? '');
  const [selectedSlotId, setSelectedSlotId] = useState(featuredSlots[1].id);
  const [selectedTypeId, setSelectedTypeId] = useState(requestTypes[0].id);
  const [step, setStep] = useState<BookingStep>('details');
  const [showCalendar, setShowCalendar] = useState(false);
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [apiState, setApiState] = useState<'loading' | 'online' | 'error'>('loading');
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [lastRequest, setLastRequest] = useState<BookingRequest | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [hostProfile, setHostProfile] = useState<HostProfile>(loadHostProfile);

  useEffect(() => {
    void refreshRequests();
    const interval = window.setInterval(() => {
      void refreshRequests({ quiet: true });
    }, 3000);
    return () => window.clearInterval(interval);
  }, [view, hostToken]);

  async function refreshRequests(options?: { quiet?: boolean }) {
    try {
      if (!options?.quiet) setApiState('loading');
      setRequests(view === 'host' && hostToken ? await listRequests(hostToken) : await listPublicRequests());
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
  const requiredAmount = getRequiredAmount(selectedSlot, selectedType);

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
    setPaymentIntent(await createApiPaymentIntent({ slotId: selectedSlot.id, typeId: selectedType.id }));
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
    const cleanProfile = {
      ...profile,
      slug: profile.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'coffee-host',
      customSlots: profile.customSlots ?? [],
      acceptedTypeIds: profile.acceptedTypeIds?.length ? profile.acceptedTypeIds : defaultHostProfile.acceptedTypeIds,
      slotIds: profile.slotIds.length ? profile.slotIds.filter((id) => allSlotIds.includes(id)) : defaultHostProfile.slotIds,
      featuredSlotIds: profile.featuredSlotIds.filter((id) => profile.slotIds.includes(id)).slice(0, 5),
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
    <main className={`page-shell tone-${selectedType.tone}`}>
      <div className="top-bar">
        <div className="top-brand" aria-label="CoffeeSip home">
          <span className="sip-mark" aria-hidden="true">S</span>
          <strong>CoffeeSip</strong>
        </div>
        <div className="app-switcher" aria-label="App view">
          <button className={view === 'guest' ? 'active' : ''} onClick={() => setView('guest')} aria-label="Guest page">☕ <span>Guest</span></button>
          <button className={view === 'host' ? 'active' : ''} onClick={() => setView('host')} aria-label="Host dashboard">🔐 <span>Host</span></button>
        </div>
      </div>

      {view === 'guest' ? (
        <BookingPage
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
        hostToken ? (
          <HostDashboard requests={requests} onUpdate={updateRequestStatus} onLogout={() => saveHostToken('')} hostProfile={hostProfile} onSaveHostProfile={saveHostProfile} />
        ) : (
          <HostGate onUnlock={saveHostToken} hostProfile={hostProfile} onSaveHostProfile={saveHostProfile} />
        )
      )}
    </main>
  );
}

function HostGate({ onUnlock, hostProfile, onSaveHostProfile }: { onUnlock: (token: string) => void; hostProfile: HostProfile; onSaveHostProfile: (profile: HostProfile) => void }) {
  const [name, setName] = useState(hostProfile.name);
  const [email, setEmail] = useState(hostProfile.email);
  const [slug, setSlug] = useState(hostProfile.slug);
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'coffee-host';
  const previewLink = `${window.location.origin}/?host=${cleanSlug}`;

  function createDemoHost() {
    onSaveHostProfile({ ...hostProfile, name: name.trim() || 'CoffeeSip Host', email: email.trim(), slug: cleanSlug });
    onUnlock('demo-host-token');
  }

  return (
    <section className="host-signup-page">
      <div className="host-signup-story">
        <span className="sip-mark signup-mark" aria-hidden="true">S</span>
        <p className="overline">Create host page</p>
        <h1>Your time is worth it.</h1>
        <p>Create a CoffeeSip page, choose when you’re available, set the minimum sip, and share one link with others.</p>
        <div className="signup-benefits">
          <span>Build your public page</span>
          <span>Generate bookable slots</span>
          <span>Review paid requests privately</span>
        </div>
      </div>

      <form className="host-signup-form-card" onSubmit={(event) => { event.preventDefault(); createDemoHost(); }}>
        <div>
          <p className="overline">Host signup</p>
          <h2>Start setting up your calendar.</h2>
          <p className="signup-muted">MVP demo signup. Real accounts and login come after the flow feels right.</p>
        </div>
        <label>
          Your name
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Bar Kolen" autoComplete="name" />
        </label>
        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="bar@example.com" type="email" autoComplete="email" />
        </label>
        <label>
          Public CoffeeSip link
          <div className="slug-input-row">
            <span>coffeesip.app/</span>
            <input value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="bar" />
          </div>
        </label>
        <div className="signup-preview">
          <span>Preview</span>
          <strong>{name.trim() || 'CoffeeSip Host'}</strong>
          <small>{previewLink}</small>
        </div>
        <button className="pay-button" disabled={name.trim().length < 2}>Continue to calendar setup</button>
      </form>
    </section>
  );
}

function BookingPage({
  selectedSlotId,
  selectedTypeId,
  step,
  showCalendar,
  name,
  email,
  note,
  onChooseSlot,
  onChooseType,
  onSetShowCalendar,
  onSetName,
  onSetEmail,
  onSetNote,
  paymentIntent,
  onCreatePaymentIntent,
  onSetStep,
  requests,
  lastRequest,
  onCreatePaidRequest,
  hostProfile,
}: {
  selectedSlotId: string;
  selectedTypeId: string;
  step: BookingStep;
  showCalendar: boolean;
  name: string;
  email: string;
  note: string;
  onChooseSlot: (slotId: string) => void;
  onChooseType: (typeId: string) => void;
  onSetShowCalendar: (show: boolean) => void;
  onSetName: (name: string) => void;
  onSetEmail: (email: string) => void;
  onSetNote: (note: string) => void;
  paymentIntent: PaymentIntent | null;
  onCreatePaymentIntent: () => void;
  onSetStep: (step: BookingStep) => void;
  requests: BookingRequest[];
  lastRequest: BookingRequest | null;
  onCreatePaidRequest: () => void;
  hostProfile: HostProfile;
}) {
  const allSlots = getAllSlots(hostProfile);
  const selectedSlot = allSlots.find((slot) => slot.id === selectedSlotId) ?? allSlots[0] ?? slots[0];
  const acceptedRequestTypes = requestTypes.filter((type) => hostProfile.acceptedTypeIds.includes(type.id));
  const selectedType = acceptedRequestTypes.find((type) => type.id === selectedTypeId) ?? acceptedRequestTypes[0] ?? requestTypes[0];
  const selectedMarket = getSlotMarketState(requests, selectedSlot.id);
  const marketFloor = selectedMarket.nextBidFloor ?? getSlotFloor(selectedSlot);
  const requiredAmount = Math.ceil(marketFloor * selectedType.multiplier);
  const canContinue = name.trim().length > 1 && email.includes('@');
  const visibleSlots = allSlots.filter((slot) => hostProfile.slotIds.includes(slot.id));
  const visibleFeaturedSlots = hostProfile.featuredSlotIds
    .map((id) => visibleSlots.find((slot) => slot.id === id))
    .filter((slot): slot is Slot => Boolean(slot));
  const visibleCalendarDays = calendarDays.filter((date) => visibleSlots.some((slot) => slot.date === date));
  function fillDemoRequest() {
    onSetName('Alex Demo');
    onSetEmail('alex@example.com');
    onSetNote('I want 20 focused minutes to pressure-test a new idea and leave with one clear next step.');
  }

  return (
    <section className="booking-card booking-card-clean">
      <section className="schedule-panel">
        <div className="booking-intro">
          <div className="intro-mark sip-mark" aria-hidden="true">S</div>
          <div>
            <h1>Our time’s worth a sip.</h1>
            <p>Choose what you need, pick a time, and put a real signal behind it.</p>
          </div>
        </div>

        <details className="demo-tour" aria-label="Demo walkthrough">
          <summary>First-time demo guide</summary>
          <div>
            <strong>Guest makes a paid ask → host accepts or passes.</strong>
          </div>
          <ol>
            <li className="active">Choose ask</li>
            <li className="active">Pick time</li>
            <li className={step !== 'confirmed' ? 'active' : ''}>Add context</li>
            <li className={step === 'payment' || step === 'confirmed' ? 'active' : ''}>Mock pay</li>
            <li className={step === 'confirmed' ? 'active' : ''}>Host reviews</li>
          </ol>
        </details>
        <div className="panel-heading">
          <div>
            <p className="overline">Step 1</p>
            <h2>What do we want?</h2>
          </div>
          <span className="timezone">Local time</span>
        </div>

        <div className="request-types" aria-label="Request type">
          {(acceptedRequestTypes.length ? acceptedRequestTypes : requestTypes).map((type) => (
            <button
              className={`request-type ${type.id === selectedTypeId ? 'selected' : ''}`}
              key={type.id}
              onClick={() => onChooseType(type.id)}
            >
              <span>{type.emoji}</span>
              <strong>{type.label}</strong>
              <small>{type.short}</small>
            </button>
          ))}
        </div>

        <div className="type-explainer">
          <span>{selectedType.emoji}</span>
          <div>
            <strong>{selectedType.label}</strong>
            <p>{selectedType.description}</p>
          </div>
        </div>

        <div className="panel-heading compact">
          <div>
            <p className="overline">Step 2</p>
            <h2>{showCalendar ? 'Pick from the calendar' : 'Pick a time'}</h2>
          </div>
        </div>

        <div className="schedule-tabs" aria-label="Schedule view">
          <button className={!showCalendar ? 'active' : ''} onClick={() => onSetShowCalendar(false)}>✨ Best picks</button>
          <button className={showCalendar ? 'active' : ''} onClick={() => onSetShowCalendar(true)}>🗓 Calendar</button>
        </div>

        {!showCalendar && (
          <div className="slots-list">
            {(visibleFeaturedSlots.length ? visibleFeaturedSlots : visibleSlots.slice(0, 4)).map((slot) => (
              <SlotButton key={slot.id} slot={slot} requests={requests} selected={slot.id === selectedSlotId} onClick={() => onChooseSlot(slot.id)} />
            ))}
          </div>
        )}

        {showCalendar && (
          <div className="calendar-grid">
            {visibleCalendarDays.map((date) => {
              const daySlots = visibleSlots.filter((slot) => slot.date === date);
              return (
                <div className="calendar-day" key={date}>
                  <div className="calendar-day-title">
                    <strong>{daySlots[0]?.day}</strong>
                    <span>{date}</span>
                  </div>
                  {daySlots.map((slot) => (
                    <button
                      className={`calendar-slot ${slot.status === 'requested' ? 'busy' : 'free'} ${slot.id === selectedSlotId ? 'selected' : ''}`}
                      key={slot.id}
                      onClick={() => onChooseSlot(slot.id)}
                    >
                      <span>{slot.time}</span>
                      <small>
                        {formatCalendarSlot(slot, requests)}
                      </small>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <aside className="checkout-panel">
        <p className="overline">Step 3</p>
        <h2>{step === 'confirmed' ? 'Request sent' : 'Reserve the slot'}</h2>
        <div className="summary-box">
          <span>{selectedType.emoji} {selectedType.label} request</span>
          <strong>{selectedSlot.day}, {selectedSlot.date} · {selectedSlot.time}</strong>
          <small>{selectedSlot.duration}</small>
        </div>

        {(selectedSlot.status === 'requested' || selectedMarket.isTaken) ? (
          <p className="notice">
            Busy slot. Details stay private — only the price to compete is shown.
          </p>
        ) : (
          <p className="notice success">Open slot. Pay the minimum to make the request real.</p>
        )}

        {step === 'details' && (
          <div className="form-stack">
            <div className="demo-helper">
              <div>
                <strong>Demo mode</strong>
                <span>No real charge. Creates a safe mock request.</span>
              </div>
              <button type="button" onClick={fillDemoRequest}>Fill demo</button>
            </div>
            <label>
              Name
              <input value={name} onChange={(event) => onSetName(event.target.value)} placeholder="Tal Cohen" />
            </label>
            <label>
              Email
              <input value={email} onChange={(event) => onSetEmail(event.target.value)} placeholder="tal@example.com" />
            </label>
            <label>
              What should we make happen?
              <textarea value={note} onChange={(event) => onSetNote(event.target.value)} placeholder="Add short context" rows={3} />
            </label>

            <div className="amount-row">
              <span>{(selectedSlot.status === 'requested' || selectedMarket.isTaken) ? 'Bid required' : 'Commitment'}</span>
              <strong>{requiredAmount} {selectedSlot.currency}</strong>
            </div>

            <button className="pay-button" disabled={!canContinue} onClick={onCreatePaymentIntent}>
              Continue to safe demo payment
            </button>
          </div>
        )}

        {step === 'payment' && (
          <div className="payment-state">
            <div className="qr-mock" aria-label="Mock payment QR code">
              <span /> <span /> <span /> <span /> <span /> <span /> <span /> <span /> <span />
            </div>
            <p className="payment-copy">
              Demo checkout for <strong>{paymentIntent?.amount ?? requiredAmount} {paymentIntent?.currency ?? selectedSlot.currency}</strong>. No live card is charged.
            </p>
            <button className="pay-button" onClick={onCreatePaidRequest}>Complete demo payment</button>
            <button className="ghost-button" onClick={() => onSetStep('details')}>Back</button>
          </div>
        )}

        {step === 'confirmed' && (
          <div className="confirmed-state">
            <div className="checkmark">✓</div>
            <p><strong>{name || 'Guest'}</strong>, our {selectedType.label.toLowerCase()} request is locked in.</p>
            <p className="next-step-copy">Now switch to Host to see the paid ask enter review with private details visible only behind the token.</p>
            <div className="receipt-card" aria-label="Booking receipt">
              <span>Request</span>
              <strong>{lastRequest?.id.slice(-8) ?? 'created'}</strong>
              <span>Status</span>
              <strong>{statusLabel(lastRequest?.status ?? 'host_review')}</strong>
              <span>Signal</span>
              <strong>{lastRequest?.amount ?? requiredAmount} {lastRequest?.currency ?? selectedSlot.currency}</strong>
            </div>
            <p className="fine-print">
              We sent it into host review. Public pages only show market state — private details stay private.
            </p>
            <button className="ghost-button" onClick={() => onSetStep('details')}>Create another request</button>
          </div>
        )}
      </aside>
    </section>
  );
}

function SlotButton({ slot, requests, selected, onClick }: { slot: Slot; requests: BookingRequest[]; selected: boolean; onClick: () => void }) {
  const market = getSlotMarketState(requests, slot.id);
  const pendingOffer = getHighestPendingOfferForSlot(requests, slot.id);
  const displayedFloor = market.nextBidFloor ?? Math.max(getSlotFloor(slot), pendingOffer?.amount ?? 0);
  const isBusy = slot.status === 'requested' || market.isTaken;
  return (
    <button className={`slot-card ${selected ? 'selected' : ''}`} onClick={onClick}>
      <span className="slot-date">
        <strong>{slot.day}</strong>
        <small>{slot.date}</small>
      </span>
      <span className="slot-time">
        <strong>{slot.time}</strong>
        <small>{slot.duration}</small>
      </span>
      <span className={isBusy ? 'pill warm' : 'pill'}>
        {isBusy ? `Bid ${displayedFloor} ${slot.currency}` : `Min ${slot.minimum} ${slot.currency}`}
      </span>
    </button>
  );
}

function formatCalendarSlot(slot: Slot, requests: BookingRequest[]) {
  const market = getSlotMarketState(requests, slot.id);
  if (slot.status === 'requested' || market.isTaken) {
    return `Busy · bid ${market.nextBidFloor ?? getSlotFloor(slot)} ${slot.currency}`;
  }
  const pending = getHighestPendingOfferForSlot(requests, slot.id);
  if (pending) return `Requested · bid ${pending.amount + 100} ${slot.currency}`;
  return `Open · min ${slot.minimum} ${slot.currency}`;
}

function HostDashboard({ requests, onUpdate, onLogout, hostProfile, onSaveHostProfile }: { requests: BookingRequest[]; onUpdate: (id: string, status: BookingRequest['status']) => void; onLogout: () => void; hostProfile: HostProfile; onSaveHostProfile: (profile: HostProfile) => void }) {
  const moneyPending = requests.filter((request) => request.status === 'pending_payment' || request.status === 'paid');
  const needsReview = requests.filter((request) => request.status === 'host_review');
  const scheduled = requests.filter((request) => request.status === 'accepted');
  const done = requests.filter((request) => request.status === 'completed' || request.status === 'rejected' || request.status === 'expired');
  const totalPendingValue = needsReview.reduce((sum, request) => sum + request.amount, 0);
  const acceptedCount = requests.filter((request) => request.status === 'accepted').length;
  const totalCaptured = requests
    .filter((request) => ['host_review', 'accepted', 'completed'].includes(request.status))
    .reduce((sum, request) => sum + request.amount, 0);

  return (
    <section className="dashboard-card">
      <div className="dashboard-hero">
        <div>
          <p className="overline">Host dashboard</p>
          <h1>Today’s time market</h1>
          <p className="host-copy">Manage availability, best picks, and incoming requests from one place.</p>
        </div>
        <div className="dashboard-stats">
          <div className="dashboard-stat">
            <strong>{needsReview.length}</strong>
            <span>needs review</span>
          </div>
          <div className="dashboard-stat">
            <strong>{acceptedCount}</strong>
            <span>scheduled</span>
          </div>
          <div className="dashboard-stat wide">
            <strong>{totalCaptured || totalPendingValue}</strong>
            <span>captured value</span>
          </div>
        </div>
      </div>

      <HostSetupPanel hostProfile={hostProfile} onSaveHostProfile={onSaveHostProfile} />

      <div className="request-board">
        <div>
          <h2>Payment <span>holds before review</span></h2>
          <HostRequestList requests={moneyPending} onUpdate={onUpdate} empty="No payment holds right now." hostProfile={hostProfile} />
        </div>
        <div>
          <h2>Review <span>private inbox</span></h2>
          <HostRequestList requests={needsReview} onUpdate={onUpdate} empty="No paid requests waiting." hostProfile={hostProfile} />
        </div>
        <div>
          <h2>Scheduled <span>accepted time</span></h2>
          <HostRequestList requests={scheduled} onUpdate={onUpdate} empty="Accepted requests show here." hostProfile={hostProfile} />
        </div>
        <div>
          <h2>Closed <span>history</span></h2>
          <HostRequestList requests={done} onUpdate={onUpdate} empty="Passed and completed requests show here." hostProfile={hostProfile} />
        </div>
      </div>
    </section>
  );
}

function HostSetupPanel({ hostProfile, onSaveHostProfile }: { hostProfile: HostProfile; onSaveHostProfile: (profile: HostProfile) => void }) {
  const [isEditingCalendar, setIsEditingCalendar] = useState(false);
  const [date, setDate] = useState('2026-05-06');
  const [from, setFrom] = useState('09:00');
  const [to, setTo] = useState('12:00');
  const [duration, setDuration] = useState(30);
  const [buffer, setBuffer] = useState(0);
  const [minimum, setMinimum] = useState(10);
  const shareLink = `${window.location.origin}/?host=${hostProfile.slug}`;
  const allSlots = getAllSlots(hostProfile);
  const selectedSlots = allSlots.filter((slot) => hostProfile.slotIds.includes(slot.id));
  const visibleSetupSlots = (selectedSlots.length ? selectedSlots : allSlots).slice(0, 1);
  const previewSlots = generateAvailabilitySlots({ date, from, to, duration: duration + buffer, minimum }).map((slot) => ({
    ...slot,
    id: slot.id.replace(`-${duration + buffer}`, `-${duration}-${minimum}`),
    duration: `${duration} min`,
  }));

  function toggleCategory(typeId: string) {
    const enabled = hostProfile.acceptedTypeIds.includes(typeId);
    const acceptedTypeIds = enabled
      ? hostProfile.acceptedTypeIds.filter((id) => id !== typeId)
      : [...hostProfile.acceptedTypeIds, typeId];
    onSaveHostProfile({ ...hostProfile, acceptedTypeIds: acceptedTypeIds.length ? acceptedTypeIds : [typeId] });
  }

  function toggleSlot(slotId: string) {
    const enabled = hostProfile.slotIds.includes(slotId);
    const slotIds = enabled ? hostProfile.slotIds.filter((id) => id !== slotId) : [...hostProfile.slotIds, slotId];
    onSaveHostProfile({
      ...hostProfile,
      slotIds,
      featuredSlotIds: enabled ? hostProfile.featuredSlotIds.filter((id) => id !== slotId) : hostProfile.featuredSlotIds,
    });
  }

  function toggleFeatured(slotId: string) {
    const featured = hostProfile.featuredSlotIds.includes(slotId);
    const featuredSlotIds = featured
      ? hostProfile.featuredSlotIds.filter((id) => id !== slotId)
      : [...hostProfile.featuredSlotIds, slotId].slice(-5);
    onSaveHostProfile({ ...hostProfile, featuredSlotIds, slotIds: Array.from(new Set([...hostProfile.slotIds, slotId])) });
  }

  async function copyLink() {
    await navigator.clipboard?.writeText(shareLink);
  }

  function saveGeneratedSlots() {
    const existingCustomIds = new Set(hostProfile.customSlots.map((slot) => slot.id));
    const newSlots = previewSlots.filter((slot) => !existingCustomIds.has(slot.id));
    onSaveHostProfile({
      ...hostProfile,
      customSlots: [...hostProfile.customSlots, ...newSlots],
      slotIds: Array.from(new Set([...hostProfile.slotIds, ...previewSlots.map((slot) => slot.id)])),
      featuredSlotIds: Array.from(new Set([...hostProfile.featuredSlotIds, ...previewSlots.slice(0, 3).map((slot) => slot.id)])).slice(-5),
    });
    setIsEditingCalendar(false);
  }

  return (
    <section className="host-setup-panel" aria-label="Host setup">
      <div className="host-setup-header">
        <div>
          <p className="overline">Host setup</p>
          <h2>Your public page</h2>
          <p>Choose available slots, promote best picks, then send one link.</p>
        </div>
        <button className="calendar-edit-button" onClick={() => setIsEditingCalendar((open) => !open)}>
          {isEditingCalendar ? 'Close calendar editor' : 'Edit your calendar'}
        </button>
        <div className="share-link-box">
          <span>{shareLink}</span>
          <button onClick={copyLink}>Copy link</button>
        </div>
      </div>

      <div className="host-setup-sequence">
        <section className="host-category-step">
          <div>
            <p className="overline">Step 1</p>
            <h3>What can people ask for?</h3>
          </div>
          <div className="host-category-grid">
            {requestTypes.map((type) => {
              const enabled = hostProfile.acceptedTypeIds.includes(type.id);
              return (
                <button className={enabled ? 'active' : ''} key={type.id} onClick={() => toggleCategory(type.id)}>
                  <span>{type.emoji}</span>
                  <strong>{type.label}</strong>
                  <small>{type.short}</small>
                </button>
              );
            })}
          </div>
        </section>

      </div>

      {isEditingCalendar && (
        <section className="calendar-editor-card" aria-label="Calendar editor">
          <div className="calendar-editor-copy">
            <p className="overline">Availability block</p>
            <h3>Tell CoffeeSip when you’re open.</h3>
            <p>Pick a day, time range, commitment length, and minimum sip. We’ll split it into bookable slots.</p>
          </div>
          <div className="calendar-form-grid">
            <label>Date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
            <label>From<input type="time" value={from} onChange={(event) => setFrom(event.target.value)} /></label>
            <label>To<input type="time" value={to} onChange={(event) => setTo(event.target.value)} /></label>
            <label>Length<select value={duration} onChange={(event) => setDuration(Number(event.target.value))}><option value={15}>15 min</option><option value={30}>30 min</option><option value={45}>45 min</option><option value={60}>60 min</option></select></label>
            <label>Buffer<select value={buffer} onChange={(event) => setBuffer(Number(event.target.value))}><option value={0}>No buffer</option><option value={15}>15 min</option><option value={30}>30 min</option></select></label>
            <label>Minimum $<input type="number" min="1" value={minimum} onChange={(event) => setMinimum(Number(event.target.value))} /></label>
          </div>
          <div className="price-preview-row">
            {requestTypes.filter((type) => hostProfile.acceptedTypeIds.includes(type.id)).map((type) => <span key={type.id}>{type.label}: ${Math.ceil(minimum * type.multiplier)}</span>)}
          </div>
          <div className="generated-preview">
            {previewSlots.length ? previewSlots.map((slot) => <span key={slot.id}>{slot.day} {slot.time} · {slot.duration} · ${slot.minimum}</span>) : <strong>No slots in this range.</strong>}
          </div>
          <button className="pay-button" disabled={previewSlots.length === 0} onClick={saveGeneratedSlots}>Generate and save slots</button>
        </section>
      )}

      <div className="host-slot-editor">
        {visibleSetupSlots.map((slot) => {
          const enabled = hostProfile.slotIds.includes(slot.id);
          const featured = hostProfile.featuredSlotIds.includes(slot.id);
          return (
            <article className={`host-slot-row ${enabled ? 'enabled' : ''}`} key={slot.id}>
              <div>
                <strong>{slot.day}, {slot.date} · {slot.time}</strong>
                <span>{slot.duration} · min {slot.minimum} {slot.currency}</span>
              </div>
              <div className="host-slot-actions">
                <button className={enabled ? 'active' : ''} onClick={() => toggleSlot(slot.id)}>{enabled ? 'Available' : 'Hidden'}</button>
                <button className={featured ? 'active warm' : ''} onClick={() => toggleFeatured(slot.id)}>Best pick</button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function statusLabel(status: BookingRequest['status']) {
  return status.replace('_', ' ');
}

function relativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(diffMs) || diffMs < 0) return 'just now';
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function HostRequestList({ requests, onUpdate, empty, hostProfile }: { requests: BookingRequest[]; onUpdate: (id: string, status: BookingRequest['status']) => void; empty: string; hostProfile: HostProfile }) {
  if (requests.length === 0) return <p className="empty-state"><strong>Clear.</strong><span>{empty}</span></p>;

  return (
    <div className="host-request-list">
      {requests.map((request) => {
        const type = requestTypes.find((item) => item.id === request.typeId) ?? requestTypes[0];
        const slot = getAllSlots(hostProfile).find((item) => item.id === request.slotId) ?? slots[0];
        return (
          <article className="dashboard-request" key={request.id}>
            <div className="request-main-row">
              <div>
                <strong>{type.emoji} {request.guestName}</strong>
                <small>{type.label} · {slot.date} · {slot.time} · {relativeTime(request.createdAt)}</small>
              </div>
              <span className="money-chip">{request.amount} {request.currency}</span>
            </div>
            {request.note && <p>{request.note}</p>}
            <div className="request-timeline" aria-label="Lifecycle state">
              {['pending_payment', 'host_review', 'accepted', 'completed'].map((status) => (
                <span key={status} className={request.status === status ? 'active' : ''}>{statusLabel(status as BookingRequest['status'])}</span>
              ))}
            </div>
            {request.status === 'host_review' ? (
              <div className="host-actions">
                <button onClick={() => onUpdate(request.id, 'accepted')}>Accept</button>
                <button onClick={() => onUpdate(request.id, 'rejected')}>Pass</button>
              </div>
            ) : request.status === 'accepted' ? (
              <div className="host-actions">
                <button onClick={() => onUpdate(request.id, 'completed')}>Mark done</button>
                <button onClick={() => onUpdate(request.id, 'rejected')}>Cancel</button>
              </div>
            ) : request.status === 'paid' ? (
              <div className="host-actions">
                <button onClick={() => onUpdate(request.id, 'host_review')}>Move to review</button>
              </div>
            ) : (
              <span className={`status-chip ${request.status}`}>{statusLabel(request.status)}</span>
            )}
          </article>
        );
      })}
    </div>
  );
}


createRoot(document.getElementById('root')!).render(<App />);
