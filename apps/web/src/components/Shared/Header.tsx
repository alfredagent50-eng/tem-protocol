/**
 * Sticky site header with the Meridian lockup at desktop and the bare
 * mark at mobile. The CTA on the right opens the host sign-in flow.
 */
import React from 'react';
import { Logo } from './Logo';
import { Button } from './Button';
import type { AppView } from '../../types';

type HeaderProps = {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
};

export function Header({ currentView, onNavigate }: HeaderProps) {
  return (
    <header className="site-header" aria-label="Site header">
      <div className="container">
        <a
          href="/"
          className="logo"
          aria-label="CoffeeSip — home"
          onClick={(event) => {
            event.preventDefault();
            onNavigate('home');
          }}
        >
          <img className="lockup-img" src="/brand/lockup.svg" alt="CoffeeSip" />
          <span className="mark-img">
            <Logo variant="mark" height={32} />
          </span>
        </a>

        <nav aria-label="Primary">
          <a href="#how-it-works">How it works</a>
          <a href="#faq">FAQ</a>
          <a
            href="?guest=1"
            onClick={(event) => {
              event.preventDefault();
              onNavigate('guest');
            }}
          >
            See open hosts
          </a>
        </nav>

        <div className="header-actions">
          <Button
            variant={currentView === 'host' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onNavigate('host')}
          >
            Host sign in
          </Button>
        </div>
      </div>
    </header>
  );
}
