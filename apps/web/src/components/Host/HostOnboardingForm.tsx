/**
 * Host signup form. Used both on the landing page (compact) and on the
 * host gate (full-bleed). Hands a token to the parent on completion.
 */
import React, { useState } from 'react';
import type { HostProfile } from '../../types';

type Props = {
  hostProfile: HostProfile;
  onSaveHostProfile: (profile: HostProfile) => void;
  onUnlock: (token: string) => void;
  compact?: boolean;
};

export function HostOnboardingForm({
  hostProfile,
  onSaveHostProfile,
  onUnlock,
  compact = false,
}: Props) {
  const [name, setName] = useState(hostProfile.name);
  const [email, setEmail] = useState(hostProfile.email);
  const [slug, setSlug] = useState(hostProfile.slug);

  const cleanSlug =
    slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'coffee-host';
  const previewLink = `${window.location.origin}/?host=${cleanSlug}`;

  function createDemoHost() {
    onSaveHostProfile({
      ...hostProfile,
      name: name.trim() || 'CoffeeSip Host',
      email: email.trim(),
      slug: cleanSlug,
    });
    onUnlock('demo-host-token');
  }

  return (
    <form
      className={`host-signup-form-card ${compact ? 'compact' : ''}`}
      onSubmit={(event) => {
        event.preventDefault();
        createDemoHost();
      }}
    >
      <div>
        <p className="overline">Host signup</p>
        <h2>Pour your time. Set the price.</h2>
        <p className="signup-muted">
          Shape your availability, set the minimum sip, and share one calm
          link.
        </p>
      </div>

      <label>
        Your name
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Bar Kolen"
          autoComplete="name"
        />
      </label>

      <label>
        Email
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="bar@example.com"
          type="email"
          autoComplete="email"
        />
      </label>

      <label>
        Public CoffeeSip link
        <div className="slug-input-row">
          <span>coffeesip.app/</span>
          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="bar"
          />
        </div>
      </label>

      <div className="signup-preview">
        <span>Preview</span>
        <strong>{name.trim() || 'CoffeeSip Host'}</strong>
        <small>{previewLink}</small>
      </div>

      <button className="pay-button" disabled={name.trim().length < 2}>
        Continue to calendar setup
      </button>
    </form>
  );
}
