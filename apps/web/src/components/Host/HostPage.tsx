/**
 * Host page wrapper — gates on token.
 *   No token → onboarding form on a story page.
 *   Token  → full dashboard.
 */
import React from 'react';
import { HostOnboardingForm } from './HostOnboardingForm';
import { HostDashboard } from './HostDashboard';
import type { BookingRequest, HostProfile } from '../../types';

type Props = {
  hostToken: string;
  requests: BookingRequest[];
  onUpdate: (id: string, status: BookingRequest['status']) => void;
  onUnlock: (token: string) => void;
  hostProfile: HostProfile;
  onSaveHostProfile: (profile: HostProfile) => void;
};

export function HostPage({
  hostToken,
  requests,
  onUpdate,
  onUnlock,
  hostProfile,
  onSaveHostProfile,
}: Props) {
  if (hostToken) {
    return (
      <HostDashboard
        requests={requests}
        onUpdate={onUpdate}
        onLogout={() => onUnlock('')}
        hostProfile={hostProfile}
        onSaveHostProfile={onSaveHostProfile}
      />
    );
  }

  return (
    <section className="host-signup-page" aria-label="Host sign in">
      <div className="host-signup-story">
        <p className="overline">Host sign in</p>
        <h1>Your time is worth a sip.</h1>
        <p>
          Create or enter your CoffeeSip calendar. Guests arrive from the link
          you share with them.
        </p>
        <div className="signup-benefits">
          <span>Build your public page</span>
          <span>Generate bookable slots</span>
          <span>Review paid requests privately</span>
        </div>
      </div>

      <HostOnboardingForm
        onUnlock={onUnlock}
        hostProfile={hostProfile}
        onSaveHostProfile={onSaveHostProfile}
      />
    </section>
  );
}
