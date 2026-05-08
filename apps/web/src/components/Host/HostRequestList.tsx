/**
 * Per-column request list for the host dashboard. Each row is a paid ask
 * waiting on review (or already moved through the lifecycle).
 */
import React from 'react';
import { requestTypes, slots } from '../../lib/mockData';
import type { BookingRequest, HostProfile } from '../../types';
import { getAllSlots, relativeTime, statusLabel } from '../../utils';

type Props = {
  requests: BookingRequest[];
  onUpdate: (id: string, status: BookingRequest['status']) => void;
  empty: string;
  hostProfile: HostProfile;
};

export function HostRequestList({ requests, onUpdate, empty, hostProfile }: Props) {
  if (requests.length === 0) {
    return (
      <p className="empty-state">
        <strong>Clear.</strong>
        <span>{empty}</span>
      </p>
    );
  }

  return (
    <div className="host-request-list">
      {requests.map((request) => {
        const type = requestTypes.find((item) => item.id === request.typeId) ?? requestTypes[0];
        const slot = getAllSlots(hostProfile).find((item) => item.id === request.slotId) ?? slots[0];
        return (
          <article className="dashboard-request" key={request.id}>
            <div className="request-main-row">
              <div>
                <strong>
                  {type.emoji} {request.guestName}
                </strong>
                <small>
                  {type.label} · {slot.date} · {slot.time} · {relativeTime(request.createdAt)}
                </small>
              </div>
              <span className="money-chip">
                {request.amount} {request.currency}
              </span>
            </div>

            {request.note && <p>{request.note}</p>}

            <div className="request-timeline" aria-label="Lifecycle state">
              {(['pending_payment', 'host_review', 'accepted', 'completed'] as const).map((status) => (
                <span key={status} className={request.status === status ? 'active' : ''}>
                  {statusLabel(status)}
                </span>
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
