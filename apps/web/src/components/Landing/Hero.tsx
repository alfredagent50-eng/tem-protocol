/**
 * Landing hero. Editorial composition, per BRAND_KIT.md §6:
 *   eyebrow → display headline → body lede → CTA row.
 *
 * Lead with the price, not the calendar. The brand asserts up front
 * that this isn't free Calendly — it's monetized time.
 */
import React from 'react';
import { Button } from '../Shared/Button';

type HeroProps = {
  onPrimary: () => void;
  onSecondary: () => void;
};

export function Hero({ onPrimary, onSecondary }: HeroProps) {
  return (
    <section className="host-landing-page" aria-label="Hero">
      <div className="host-landing-hero">
        <span className="hero-eyebrow">
          <span className="live-dot" aria-hidden="true" />
          What's your time worth
        </span>
        <h1>
          <span style={{ display: 'block' }}>
            It's not a <em>meet</em>.
          </span>
          <span style={{ display: 'block' }}>
            It's a <em>sip</em>.
          </span>
        </h1>
        <p>
          Get fifteen minutes with someone whose time matters. Set the price.
          Send a real signal. We'll only take it if they accept.
        </p>
        <div className="landing-actions">
          <Button variant="primary" onClick={onPrimary}>
            Reserve a sip
          </Button>
          <Button variant="ghost" onClick={onSecondary}>
            See open hosts
          </Button>
        </div>
      </div>

      <div className="host-landing-panel" aria-hidden="false">
        <HeroAside />
      </div>
    </section>
  );
}

/**
 * Editorial aside that sits next to the hero. Three live "sips" in a stack
 * — a small visual to anchor the value prop without the hero feeling empty.
 */
function HeroAside() {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-divider)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        boxShadow: 'var(--shadow-e2)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      <span className="overline">Open right now</span>
      <SipRow name="Nyla R." role="Founder, Cadence" price="$25 / 15 min" tone="warm" />
      <SipRow name="Theo L." role="Director, Atlas" price="$40 / 30 min" />
      <SipRow name="Maya S." role="Investor" price="$80 / 15 min" tone="signal" />
      <p
        style={{
          margin: 0,
          fontSize: 'var(--fs-caption)',
          color: 'var(--color-ink-subtle)',
          letterSpacing: 'var(--tracking-caption)',
        }}
      >
        Demo data — actual hosts arrive from the link they share.
      </p>
    </div>
  );
}

function SipRow({
  name,
  role,
  price,
  tone,
}: {
  name: string;
  role: string;
  price: string;
  tone?: 'signal' | 'warm';
}) {
  const chipStyle: React.CSSProperties =
    tone === 'signal'
      ? { background: 'var(--color-signal)', color: 'var(--color-signal-ink)' }
      : tone === 'warm'
      ? { background: 'var(--color-warm)', color: 'var(--color-warm-ink)' }
      : { background: 'var(--color-surface-mist)', color: 'var(--color-ink)' };
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr auto',
        gap: 'var(--space-3)',
        alignItems: 'center',
        padding: 'var(--space-3) 0',
        borderTop: '1px solid var(--color-divider-soft)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-pill)',
          background: 'var(--color-surface-mist)',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: '1.125rem',
          color: 'var(--color-ink-muted)',
        }}
      >
        {name[0]}
      </div>
      <div>
        <strong style={{ display: 'block', fontWeight: 600 }}>{name}</strong>
        <small style={{ color: 'var(--color-ink-subtle)', fontSize: 'var(--fs-caption)' }}>
          {role}
        </small>
      </div>
      <span
        style={{
          ...chipStyle,
          padding: '6px 12px',
          borderRadius: 'var(--radius-pill)',
          fontSize: 'var(--fs-caption)',
          fontWeight: 600,
          fontFeatureSettings: '"tnum" 1',
          whiteSpace: 'nowrap',
        }}
      >
        {price}
      </span>
    </div>
  );
}
