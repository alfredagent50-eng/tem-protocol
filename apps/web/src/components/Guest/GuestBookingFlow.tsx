/**
 * Full guest-facing booking flow: pick a request type, pick a slot,
 * fill in details, mock-pay, confirm. The heaviest single screen in the
 * app — composed of OfferCard for slot rendering and PaymentStep for the
 * terminal states.
 */
import React from 'react';
import { calendarDays, requestTypes, slots } from '../../lib/mockData';
import { getSlotFloor } from '../../lib/domain';
import { getSlotMarketState } from '../../lib/services/bookingLifecycle';
import type { PaymentIntent } from '../../lib/services/paymentMock';
import type { BookingRequest, BookingStep, HostProfile, Slot } from '../../types';
import { getAllSlots } from '../../utils';
import { OfferCard, formatCalendarSlot } from './OfferCard';
import { PaymentStep } from './PaymentStep';

type Props = {
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
};

export function GuestBookingFlow({
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
}: Props) {
  const allSlots = getAllSlots(hostProfile);
  const selectedSlot: Slot =
    allSlots.find((slot) => slot.id === selectedSlotId) ?? allSlots[0] ?? slots[0];
  const acceptedRequestTypes = requestTypes.filter((type) =>
    hostProfile.acceptedTypeIds.includes(type.id),
  );
  const selectedType =
    acceptedRequestTypes.find((type) => type.id === selectedTypeId) ??
    acceptedRequestTypes[0] ??
    requestTypes[0];
  const selectedMarket = getSlotMarketState(requests, selectedSlot.id);
  const marketFloor = selectedMarket.nextBidFloor ?? getSlotFloor(selectedSlot);
  const requiredAmount = Math.ceil(marketFloor * selectedType.multiplier);
  const canContinue = name.trim().length > 1 && email.includes('@');
  const visibleSlots = allSlots.filter((slot) => hostProfile.slotIds.includes(slot.id));
  const visibleFeaturedSlots = hostProfile.featuredSlotIds
    .map((id) => visibleSlots.find((slot) => slot.id === id))
    .filter((slot): slot is Slot => Boolean(slot));
  const visibleCalendarDays = calendarDays.filter((date) =>
    visibleSlots.some((slot) => slot.date === date),
  );

  function fillDemoRequest() {
    onSetName('Alex Demo');
    onSetEmail('alex@example.com');
    onSetNote(
      'I want 20 focused minutes to pressure-test a new idea and leave with one clear next step.',
    );
  }

  return (
    <section className="booking-card booking-card-clean">
      <section className="schedule-panel">
        <div className="booking-intro">
          <img
            className="intro-mark"
            src="/brand/mark.svg"
            alt=""
            aria-hidden="true"
            width={56}
            height={67}
          />
          <div>
            <h1>Pay for a sip.</h1>
            <p>Choose what you need, pick a time, put a real signal behind it.</p>
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
            <li className={step === 'payment' || step === 'confirmed' ? 'active' : ''}>
              Mock pay
            </li>
            <li className={step === 'confirmed' ? 'active' : ''}>Host reviews</li>
          </ol>
        </details>

        <div className="panel-heading">
          <div>
            <p className="overline">Step 1</p>
            <h2>What do you need?</h2>
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
          <button className={!showCalendar ? 'active' : ''} onClick={() => onSetShowCalendar(false)}>
            ✨ Best picks
          </button>
          <button className={showCalendar ? 'active' : ''} onClick={() => onSetShowCalendar(true)}>
            🗓 Calendar
          </button>
        </div>

        {!showCalendar && (
          <div className="slots-list">
            {(visibleFeaturedSlots.length ? visibleFeaturedSlots : visibleSlots.slice(0, 4)).map(
              (slot) => (
                <OfferCard
                  key={slot.id}
                  slot={slot}
                  requests={requests}
                  selected={slot.id === selectedSlotId}
                  onClick={() => onChooseSlot(slot.id)}
                />
              ),
            )}
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
                      className={`calendar-slot ${
                        slot.status === 'requested' ? 'busy' : 'free'
                      } ${slot.id === selectedSlotId ? 'selected' : ''}`}
                      key={slot.id}
                      onClick={() => onChooseSlot(slot.id)}
                    >
                      <span>{slot.time}</span>
                      <small>{formatCalendarSlot(slot, requests)}</small>
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
          <span>
            {selectedType.emoji} {selectedType.label} request
          </span>
          <strong>
            {selectedSlot.day}, {selectedSlot.date} · {selectedSlot.time}
          </strong>
          <small>{selectedSlot.duration}</small>
        </div>

        {selectedSlot.status === 'requested' || selectedMarket.isTaken ? (
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
              <button type="button" onClick={fillDemoRequest}>
                Fill demo
              </button>
            </div>
            <label>
              Name
              <input
                value={name}
                onChange={(event) => onSetName(event.target.value)}
                placeholder="Tal Cohen"
              />
            </label>
            <label>
              Email
              <input
                value={email}
                onChange={(event) => onSetEmail(event.target.value)}
                placeholder="tal@example.com"
              />
            </label>
            <label>
              What should we make happen?
              <textarea
                value={note}
                onChange={(event) => onSetNote(event.target.value)}
                placeholder="Add short context"
                rows={3}
              />
            </label>

            <div className="amount-row">
              <span>
                {selectedSlot.status === 'requested' || selectedMarket.isTaken
                  ? 'Bid required'
                  : 'Commitment'}
              </span>
              <strong className="tabular-nums">
                {requiredAmount} {selectedSlot.currency}
              </strong>
            </div>

            <button className="pay-button" disabled={!canContinue} onClick={onCreatePaymentIntent}>
              Continue to safe demo payment
            </button>
          </div>
        )}

        <PaymentStep
          step={step}
          paymentIntent={paymentIntent}
          requiredAmount={requiredAmount}
          selectedSlot={selectedSlot}
          selectedType={selectedType}
          lastRequest={lastRequest}
          guestName={name}
          onCreatePaidRequest={onCreatePaidRequest}
          onSetStep={onSetStep}
        />
      </aside>
    </section>
  );
}
