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
    () => slots.find((slot) => slot.id === selectedSlotId) ?? slots[0],
    [selectedSlotId],
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

  async function updateRequestStatus(id: string, status: BookingRequest['status']) {
    setApiState('loading');
    setRequests(await updateApiRequestStatus(id, status, hostToken));
    setApiState('online');
  }

  return (
    <main className={`page-shell tone-${selectedType.tone}`}>
      <div className="top-bar">
        <div className="top-brand" aria-label="CoffeeSip home">
          <span>C</span>
          <strong>CoffeeSip</strong>
        </div>
        {view === 'host' && <div className={`api-pill ${apiState}`}>API {apiState}</div>}
        {view === 'host' && (
          <div className="app-switcher" aria-label="App view">
            <button onClick={() => setView('guest')}>Guest page</button>
            <button className="active" onClick={() => setView('host')}>Host dashboard</button>
          </div>
        )}
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
        />
      ) : (
        hostToken ? (
          <HostDashboard requests={requests} onUpdate={updateRequestStatus} onLogout={() => saveHostToken('')} />
        ) : (
          <HostGate onUnlock={saveHostToken} />
        )
      )}
    </main>
  );
}

function HostGate({ onUnlock }: { onUnlock: (token: string) => void }) {
  const [token, setToken] = useState('');
  return (
    <section className="dashboard-card host-gate-card">
      <div>
        <p className="overline">Host dashboard</p>
        <h1>Private host controls</h1>
        <p className="host-copy">
          Enter the host token to review paid asks. This is a lightweight MVP gate; production still needs real auth.
        </p>
      </div>
      <form className="host-gate-form" onSubmit={(event) => { event.preventDefault(); onUnlock(token); }}>
        <label>
          Host token
          <input value={token} onChange={(event) => setToken(event.target.value)} placeholder="Paste host token" type="password" autoComplete="current-password" />
        </label>
        <button className="pay-button" disabled={token.trim().length < 4}>Unlock dashboard</button>
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
}) {
  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId) ?? slots[0];
  const selectedType = requestTypes.find((type) => type.id === selectedTypeId) ?? requestTypes[0];
  const selectedMarket = getSlotMarketState(requests, selectedSlot.id);
  const marketFloor = selectedMarket.nextBidFloor ?? getSlotFloor(selectedSlot);
  const requiredAmount = Math.ceil(marketFloor * selectedType.multiplier);
  const canContinue = name.trim().length > 1 && email.includes('@');
  function fillDemoRequest() {
    onSetName('Alex Demo');
    onSetEmail('alex@example.com');
    onSetNote('I want 20 focused minutes to pressure-test a new idea and leave with one clear next step.');
  }

  return (
    <section className="booking-card booking-card-clean">
      <section className="schedule-panel">
        <div className="booking-intro">
          <div className="intro-mark">C</div>
          <div>
            <h1>Our time’s worth a sip.</h1>
          </div>
        </div>
        <div className="panel-heading">
          <div>
            <p className="overline">Step 1</p>
            <h2>What do we want?</h2>
          </div>
          <span className="timezone">Local time</span>
        </div>

        <div className="request-types" aria-label="Request type">
          {requestTypes.map((type) => (
            <button
              className={`request-type ${type.id === selectedTypeId ? 'selected' : ''}`}
              key={type.id}
              onClick={() => onChooseType(type.id)}
            >
              <span>{type.emoji}</span>
              <strong>{type.label}</strong>
            </button>
          ))}
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
            {featuredSlots.map((slot) => (
              <SlotButton key={slot.id} slot={slot} requests={requests} selected={slot.id === selectedSlotId} onClick={() => onChooseSlot(slot.id)} />
            ))}
          </div>
        )}

        {showCalendar && (
          <div className="calendar-grid">
            {calendarDays.map((date) => {
              const daySlots = slots.filter((slot) => slot.date === date);
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
              Continue to payment
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

function HostDashboard({ requests, onUpdate, onLogout }: { requests: BookingRequest[]; onUpdate: (id: string, status: BookingRequest['status']) => void; onLogout: () => void }) {
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
          <p className="host-copy">Paid requests move from payment to review, then into the calendar or out of the queue.</p>
          <button className="ghost-button compact-action" onClick={onLogout}>Lock dashboard</button>
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

      <div className="lifecycle-strip" aria-label="Request lifecycle">
        <span>Payment</span>
        <strong>→</strong>
        <span>Host review</span>
        <strong>→</strong>
        <span>Scheduled</span>
        <strong>→</strong>
        <span>Completed</span>
      </div>

      <div className="request-board">
        <div>
          <h2>Payment</h2>
          <HostRequestList requests={moneyPending} onUpdate={onUpdate} empty="No payment holds right now." />
        </div>
        <div>
          <h2>Review</h2>
          <HostRequestList requests={needsReview} onUpdate={onUpdate} empty="No paid requests waiting." />
        </div>
        <div>
          <h2>Scheduled</h2>
          <HostRequestList requests={scheduled} onUpdate={onUpdate} empty="Accepted requests show here." />
        </div>
        <div>
          <h2>Closed</h2>
          <HostRequestList requests={done} onUpdate={onUpdate} empty="Passed and completed requests show here." />
        </div>
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

function HostRequestList({ requests, onUpdate, empty }: { requests: BookingRequest[]; onUpdate: (id: string, status: BookingRequest['status']) => void; empty: string }) {
  if (requests.length === 0) return <p className="empty-state">{empty}</p>;

  return (
    <div className="host-request-list">
      {requests.map((request) => {
        const type = requestTypes.find((item) => item.id === request.typeId) ?? requestTypes[0];
        const slot = slots.find((item) => item.id === request.slotId) ?? slots[0];
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
