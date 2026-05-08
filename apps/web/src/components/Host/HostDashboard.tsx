/**
 * Host dashboard. Top hero with stats, then the availability editor,
 * then four request columns by lifecycle state.
 */
import React from 'react';
import type { BookingRequest, HostProfile } from '../../types';
import { AvailabilityEditor } from './AvailabilityEditor';
import { HostRequestList } from './HostRequestList';

type Props = {
  requests: BookingRequest[];
  onUpdate: (id: string, status: BookingRequest['status']) => void;
  onLogout: () => void;
  hostProfile: HostProfile;
  onSaveHostProfile: (profile: HostProfile) => void;
};

export function HostDashboard({
  requests,
  onUpdate,
  onLogout,
  hostProfile,
  onSaveHostProfile,
}: Props) {
  const moneyPending = requests.filter(
    (request) => request.status === 'pending_payment' || request.status === 'paid',
  );
  const needsReview = requests.filter((request) => request.status === 'host_review');
  const scheduled = requests.filter((request) => request.status === 'accepted');
  const done = requests.filter((request) =>
    ['completed', 'rejected', 'expired'].includes(request.status),
  );
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
          <h1>Today's time market.</h1>
          <p className="host-copy">
            Manage availability, minimum sips, best picks, and incoming
            requests from one place.
          </p>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button
              className="ghost-button btn-sm"
              onClick={onLogout}
              aria-label="Sign out"
            >
              Sign out
            </button>
          </div>
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

      <AvailabilityEditor hostProfile={hostProfile} onSaveHostProfile={onSaveHostProfile} />

      <div className="request-board">
        <div>
          <h2>
            Payment <span>holds before review</span>
          </h2>
          <HostRequestList
            requests={moneyPending}
            onUpdate={onUpdate}
            empty="No payment holds right now."
            hostProfile={hostProfile}
          />
        </div>
        <div>
          <h2>
            Review <span>private inbox</span>
          </h2>
          <HostRequestList
            requests={needsReview}
            onUpdate={onUpdate}
            empty="No paid requests waiting."
            hostProfile={hostProfile}
          />
        </div>
        <div>
          <h2>
            Scheduled <span>accepted time</span>
          </h2>
          <HostRequestList
            requests={scheduled}
            onUpdate={onUpdate}
            empty="Accepted requests show here."
            hostProfile={hostProfile}
          />
        </div>
        <div>
          <h2>
            Closed <span>history</span>
          </h2>
          <HostRequestList
            requests={done}
            onUpdate={onUpdate}
            empty="Passed and completed requests show here."
            hostProfile={hostProfile}
          />
        </div>
      </div>
    </section>
  );
}
