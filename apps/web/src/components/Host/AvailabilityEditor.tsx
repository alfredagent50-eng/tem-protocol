/**
 * Host availability editor — categories, prices, calendar generation,
 * and per-slot toggles. Originally `HostSetupPanel` in main.tsx.
 */
import React, { useState } from 'react';
import { requestTypes } from '../../lib/mockData';
import type { HostProfile, Slot } from '../../types';
import { generateAvailabilitySlots, getAllSlots } from '../../utils';

type Props = {
  hostProfile: HostProfile;
  onSaveHostProfile: (profile: HostProfile) => void;
};

export function AvailabilityEditor({ hostProfile, onSaveHostProfile }: Props) {
  const [isEditingCalendar, setIsEditingCalendar] = useState(false);
  const [activeTypeId, setActiveTypeId] = useState<string | null>(
    hostProfile.acceptedTypeIds[0] ?? null,
  );
  const [date, setDate] = useState('2026-05-06');
  const [from, setFrom] = useState('09:00');
  const [to, setTo] = useState('12:00');
  const [duration, setDuration] = useState(30);
  const [buffer, setBuffer] = useState(0);
  const [lastSavedSlotIds, setLastSavedSlotIds] = useState<string[]>([]);

  const shareLink = `${window.location.origin}/?host=${hostProfile.slug}`;
  const allSlots = getAllSlots(hostProfile);
  const selectedSlots = allSlots.filter((slot) => hostProfile.slotIds.includes(slot.id));
  const recentlySavedSlots = lastSavedSlotIds
    .map((id) => allSlots.find((slot) => slot.id === id))
    .filter((slot): slot is Slot => Boolean(slot));
  const visibleSetupSlots = (
    recentlySavedSlots.length
      ? recentlySavedSlots
      : selectedSlots.length
      ? selectedSlots
      : allSlots
  ).slice(0, 8);

  const selectedMinimums = hostProfile.acceptedTypeIds.map(
    (id) => hostProfile.typeMinimums[id] ?? 10,
  );
  const slotFloor = selectedMinimums.length ? Math.min(...selectedMinimums) : 10;
  const activeType =
    requestTypes.find(
      (type) => type.id === activeTypeId && hostProfile.acceptedTypeIds.includes(type.id),
    ) ?? null;

  const previewSlots = generateAvailabilitySlots({
    date,
    from,
    to,
    duration: duration + buffer,
    minimum: slotFloor,
  }).map((slot) => ({
    ...slot,
    id: slot.id.replace(`-${duration + buffer}`, `-${duration}-${slotFloor}`),
    duration: `${duration} min`,
  }));

  function toggleCategory(typeId: string) {
    const enabled = hostProfile.acceptedTypeIds.includes(typeId);
    const acceptedTypeIds = enabled
      ? hostProfile.acceptedTypeIds.filter((id) => id !== typeId)
      : [...hostProfile.acceptedTypeIds, typeId];
    onSaveHostProfile({ ...hostProfile, acceptedTypeIds });
    setActiveTypeId(enabled ? acceptedTypeIds[0] ?? null : typeId);
  }

  function updateTypeMinimum(typeId: string, value: number) {
    onSaveHostProfile({
      ...hostProfile,
      typeMinimums: {
        ...hostProfile.typeMinimums,
        [typeId]: Number.isFinite(value) && value > 0 ? value : 1,
      },
    });
  }

  function updateTypeCurrency(typeId: string, value: string) {
    onSaveHostProfile({
      ...hostProfile,
      typeCurrencies: { ...hostProfile.typeCurrencies, [typeId]: value },
    });
  }

  function toggleSlot(slotId: string) {
    const enabled = hostProfile.slotIds.includes(slotId);
    const slotIds = enabled
      ? hostProfile.slotIds.filter((id) => id !== slotId)
      : [...hostProfile.slotIds, slotId];
    onSaveHostProfile({
      ...hostProfile,
      slotIds,
      featuredSlotIds: enabled
        ? hostProfile.featuredSlotIds.filter((id) => id !== slotId)
        : hostProfile.featuredSlotIds,
    });
  }

  function toggleFeatured(slotId: string) {
    const featured = hostProfile.featuredSlotIds.includes(slotId);
    const featuredSlotIds = featured
      ? hostProfile.featuredSlotIds.filter((id) => id !== slotId)
      : [...hostProfile.featuredSlotIds, slotId].slice(-5);
    onSaveHostProfile({
      ...hostProfile,
      featuredSlotIds,
      slotIds: Array.from(new Set([...hostProfile.slotIds, slotId])),
    });
  }

  async function copyLink() {
    await navigator.clipboard?.writeText(shareLink);
  }

  function saveGeneratedSlots() {
    const previewSlotIds = previewSlots.map((slot) => slot.id);
    const existingCustomIds = new Set(hostProfile.customSlots.map((slot) => slot.id));
    const newSlots = previewSlots.filter((slot) => !existingCustomIds.has(slot.id));
    onSaveHostProfile({
      ...hostProfile,
      customSlots: [...hostProfile.customSlots, ...newSlots],
      slotIds: Array.from(new Set([...hostProfile.slotIds, ...previewSlotIds])),
      featuredSlotIds: Array.from(
        new Set([...hostProfile.featuredSlotIds, ...previewSlotIds.slice(0, 3)]),
      ).slice(-5),
    });
    setLastSavedSlotIds(previewSlotIds);
    setIsEditingCalendar(false);
  }

  return (
    <section className="host-setup-panel" aria-label="Host setup">
      <div className="host-setup-header">
        <div>
          <h2>Your public calendar</h2>
          <p>Shape your availability and turn time into sips.</p>
        </div>
        <button className="calendar-edit-button" onClick={() => setIsEditingCalendar((open) => !open)}>
          {isEditingCalendar ? 'Close calendar editor' : 'Edit your calendar'}
        </button>
        <div className="share-link-box">
          <span>{shareLink}</span>
          <button onClick={copyLink}>Copy link</button>
        </div>
      </div>

      {isEditingCalendar && (
        <div className="calendar-setup-flow">
          <section className="host-category-step">
            <div>
              <p className="overline">Step 1</p>
              <h3>What can people ask for?</h3>
            </div>
            <div className="host-category-grid">
              {requestTypes.map((type) => {
                const enabled = hostProfile.acceptedTypeIds.includes(type.id);
                return (
                  <button
                    className={enabled ? 'active' : ''}
                    key={type.id}
                    onClick={() => toggleCategory(type.id)}
                  >
                    <span>{type.emoji}</span>
                    <strong>{type.label}</strong>
                    <small>{type.short}</small>
                    {enabled && <em>✓</em>}
                  </button>
                );
              })}
            </div>

            {hostProfile.acceptedTypeIds.length > 0 && (
              <div className="category-pricing-tray">
                <div className="enabled-category-chips" aria-label="Enabled categories">
                  {hostProfile.acceptedTypeIds.map((typeId) => {
                    const type = requestTypes.find((item) => item.id === typeId) ?? requestTypes[0];
                    return (
                      <button
                        className={activeTypeId === typeId ? 'active' : ''}
                        key={typeId}
                        onClick={() => setActiveTypeId(typeId)}
                      >
                        {type.emoji} {type.label}
                      </button>
                    );
                  })}
                </div>

                {activeType && (
                  <div className="pricing-tray-editor">
                    <label>
                      Min sip for {activeType.label}
                      <div className="sip-price-row">
                        <input
                          type="number"
                          min="1"
                          value={hostProfile.typeMinimums[activeType.id] ?? 10}
                          onChange={(event) =>
                            updateTypeMinimum(activeType.id, Number(event.target.value))
                          }
                        />
                        <div className="currency-segment" role="group" aria-label="Currency">
                          {['$', '€', 'sats'].map((currency) => (
                            <button
                              className={
                                (hostProfile.typeCurrencies[activeType.id] ?? '$') === currency
                                  ? 'active'
                                  : ''
                              }
                              key={currency}
                              onClick={() => updateTypeCurrency(activeType.id, currency)}
                            >
                              {currency === 'sats' ? '₿ sats' : currency}
                            </button>
                          ))}
                        </div>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="calendar-editor-card" aria-label="Calendar editor">
            <div className="calendar-editor-copy">
              <p className="overline">Step 2</p>
              <h3>When are you open?</h3>
              <p>
                Pick a day, time range, slot length, and buffer. Minimums are
                set per category above.
              </p>
            </div>
            <div className="calendar-form-grid">
              <label>
                Date
                <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
              </label>
              <label>
                From
                <input type="time" value={from} onChange={(event) => setFrom(event.target.value)} />
              </label>
              <label>
                To
                <input type="time" value={to} onChange={(event) => setTo(event.target.value)} />
              </label>
              <label>
                Length
                <select value={duration} onChange={(event) => setDuration(Number(event.target.value))}>
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>60 min</option>
                </select>
              </label>
              <label>
                Buffer
                <select value={buffer} onChange={(event) => setBuffer(Number(event.target.value))}>
                  <option value={0}>No buffer</option>
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                </select>
              </label>
            </div>
            <div className="generated-preview">
              {previewSlots.length ? (
                previewSlots.map((slot) => (
                  <span key={slot.id}>
                    {slot.day} {slot.time} · {slot.duration} · ${slot.minimum}
                  </span>
                ))
              ) : (
                <strong>No slots in this range.</strong>
              )}
            </div>
            <button
              className="pay-button"
              disabled={previewSlots.length === 0}
              onClick={saveGeneratedSlots}
            >
              Generate and save slots
            </button>
          </section>
        </div>
      )}

      <div className="saved-slots-header">
        <div>
          <p className="overline">Saved slots</p>
          <h3>
            {recentlySavedSlots.length
              ? `${recentlySavedSlots.length} slots saved`
              : 'Your visible slots'}
          </h3>
        </div>
        {recentlySavedSlots.length > 0 && <span>Showing the slots you just generated.</span>}
      </div>

      <div className="host-slot-editor">
        {visibleSetupSlots.map((slot) => {
          const enabled = hostProfile.slotIds.includes(slot.id);
          const featured = hostProfile.featuredSlotIds.includes(slot.id);
          return (
            <article className={`host-slot-row ${enabled ? 'enabled' : ''}`} key={slot.id}>
              <div>
                <strong>
                  {slot.day}, {slot.date} · {slot.time}
                </strong>
                <span>
                  {slot.duration} · min {slot.minimum} {slot.currency}
                </span>
              </div>
              <div className="host-slot-actions">
                <button className={enabled ? 'active' : ''} onClick={() => toggleSlot(slot.id)}>
                  {enabled ? 'Available' : 'Hidden'}
                </button>
                <button
                  className={featured ? 'active warm' : ''}
                  onClick={() => toggleFeatured(slot.id)}
                >
                  Best pick
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
