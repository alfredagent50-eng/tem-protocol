/**
 * The two terminal steps of the booking flow: "payment" (mock checkout)
 * and "confirmed" (success state with receipt). Pulled out of the larger
 * GuestBookingFlow so it's easier to skim.
 */
import React from 'react';
import type { BookingRequest, BookingStep, RequestType, Slot } from '../../types';
import { statusLabel } from '../../utils';
import type { PaymentIntent } from '../../lib/services/paymentMock';

type PaymentStepProps = {
  step: BookingStep;
  paymentIntent: PaymentIntent | null;
  requiredAmount: number;
  selectedSlot: Slot;
  selectedType: RequestType;
  lastRequest: BookingRequest | null;
  guestName: string;
  onCreatePaidRequest: () => void;
  onSetStep: (step: BookingStep) => void;
};

export function PaymentStep({
  step,
  paymentIntent,
  requiredAmount,
  selectedSlot,
  selectedType,
  lastRequest,
  guestName,
  onCreatePaidRequest,
  onSetStep,
}: PaymentStepProps) {
  if (step === 'payment') {
    return (
      <div className="payment-state">
        <div className="qr-mock" aria-label="Mock payment QR code">
          <span /><span /><span /><span /><span /><span /><span /><span /><span />
        </div>
        <p className="payment-copy">
          Demo checkout for{' '}
          <strong>
            {paymentIntent?.amount ?? requiredAmount}{' '}
            {paymentIntent?.currency ?? selectedSlot.currency}
          </strong>
          . No live card is charged.
        </p>
        <button className="pay-button" onClick={onCreatePaidRequest}>
          Complete demo payment
        </button>
        <button className="ghost-button" onClick={() => onSetStep('details')}>
          Back
        </button>
      </div>
    );
  }

  if (step === 'confirmed') {
    return (
      <div className="confirmed-state">
        <div className="checkmark">✓</div>
        <p>
          <strong>{guestName || 'Guest'}</strong>, the {selectedType.label.toLowerCase()}{' '}
          request is locked in.
        </p>
        <p className="next-step-copy">
          Switch to Host to see the paid ask enter review with private details
          visible only behind the token.
        </p>
        <div className="receipt-card" aria-label="Booking receipt">
          <span>Request</span>
          <strong>{lastRequest?.id.slice(-8) ?? 'created'}</strong>
          <span>Status</span>
          <strong>{statusLabel(lastRequest?.status ?? 'host_review')}</strong>
          <span>Signal</span>
          <strong>
            {lastRequest?.amount ?? requiredAmount} {lastRequest?.currency ?? selectedSlot.currency}
          </strong>
        </div>
        <p className="fine-print">
          Sent into host review. Public pages only show market state — private
          details stay private.
        </p>
        <button className="ghost-button" onClick={() => onSetStep('details')}>
          Create another request
        </button>
      </div>
    );
  }

  return null;
}
