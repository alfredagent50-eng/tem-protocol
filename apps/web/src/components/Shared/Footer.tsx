/**
 * Site footer. Reverse block — paper on obsidian, per the brand kit.
 */
import React from 'react';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="container">
        <div
          className="footer-brand"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)' }}
        >
          <img src="/brand/mark-dark.svg" alt="" aria-hidden="true" height={36} style={{ height: 36 }} />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.625rem',
              fontWeight: 400,
              letterSpacing: '-0.005em',
              color: 'var(--palette-paper)',
            }}
          >
            coffeesip
          </span>
        </div>
        <p className="footer-tagline">
          Not a meet. A sip. Get fifteen minutes with someone whose time matters.
        </p>
        <span className="footer-meta">© {year} CoffeeSip</span>
      </div>
    </footer>
  );
}
