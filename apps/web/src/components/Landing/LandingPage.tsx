/**
 * Landing entry point. Composes the hero, the editorial sections, and the
 * embedded signup. Top of the page = price-first hero. Below = how it
 * works + FAQ. The host signup form lives in a dedicated section so the
 * "Reserve a sip" CTA in the hero scrolls to it / passes through to host.
 */
import React from 'react';
import { Hero } from './Hero';
import { HowItWorks } from './HowItWorks';
import { FAQ } from './FAQ';
import { HostOnboardingForm } from '../Host/HostOnboardingForm';
import type { HostProfile } from '../../types';

type LandingPageProps = {
  onStartHost: () => void;
  onStartGuest: () => void;
  onUnlock: (token: string) => void;
  hostProfile: HostProfile;
  onSaveHostProfile: (profile: HostProfile) => void;
};

export function LandingPage({
  onStartHost,
  onStartGuest,
  onUnlock,
  hostProfile,
  onSaveHostProfile,
}: LandingPageProps) {
  return (
    <>
      <Hero onPrimary={onStartGuest} onSecondary={onStartGuest} />

      <HowItWorks />

      <section
        className="host-signup-page"
        id="signup"
        aria-label="Become a host"
      >
        <div className="host-signup-story">
          <p className="overline">For hosts</p>
          <h1>Decide what a sip with you costs.</h1>
          <p>
            Build your public calendar, choose what you'll consider, set the
            minimum sip, and share one link. We pour the rest.
          </p>
          <div className="signup-benefits">
            <span>Public page, private inbox</span>
            <span>Funds held until you accept</span>
            <span>Bid floor enforced — no lowballs</span>
          </div>
        </div>

        <HostOnboardingForm
          compact
          onUnlock={onUnlock}
          hostProfile={hostProfile}
          onSaveHostProfile={onSaveHostProfile}
        />
      </section>

      <FAQ />
    </>
  );
}
