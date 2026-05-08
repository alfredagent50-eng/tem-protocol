/**
 * Lightweight card surface with the Meridian token defaults.
 * Pass `tone="warm"` to swap to a clay-tinted callout card.
 */
import React from 'react';

type CardProps = {
  tone?: 'default' | 'warm' | 'mist';
  elevation?: 'flat' | 'lift';
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function Card({
  tone = 'default',
  elevation = 'flat',
  className = '',
  children,
  ...rest
}: CardProps) {
  const style: React.CSSProperties = {
    background:
      tone === 'warm'
        ? 'var(--color-warm)'
        : tone === 'mist'
        ? 'var(--color-surface-mist)'
        : 'var(--color-surface)',
    color: tone === 'warm' ? 'var(--color-warm-ink)' : 'var(--color-ink)',
    border: tone === 'mist' ? 'none' : '1px solid var(--color-divider)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-6)',
    boxShadow:
      elevation === 'lift' ? 'var(--shadow-e2)' : 'var(--shadow-e1)',
  };
  return (
    <div className={className} style={style} {...rest}>
      {children}
    </div>
  );
}
