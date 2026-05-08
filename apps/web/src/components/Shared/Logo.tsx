/**
 * Meridian mark / wordmark / lockup, served from /public/brand.
 * Single component with three variants so callers don't have to guess paths.
 */
import React from 'react';

type LogoVariant = 'mark' | 'wordmark' | 'lockup';
type LogoTheme = 'default' | 'mono' | 'dark';

type LogoProps = {
  variant?: LogoVariant;
  theme?: LogoTheme;
  /** Pixel height. Width auto-scales. Default 32 for marks, 40 for lockups. */
  height?: number;
  className?: string;
  alt?: string;
};

function srcFor(variant: LogoVariant, theme: LogoTheme): string {
  if (variant === 'wordmark') return '/brand/wordmark.svg';
  if (variant === 'lockup') return '/brand/lockup.svg';
  if (theme === 'mono') return '/brand/mark-mono.svg';
  if (theme === 'dark') return '/brand/mark-dark.svg';
  return '/brand/mark.svg';
}

export function Logo({
  variant = 'mark',
  theme = 'default',
  height,
  className,
  alt = 'CoffeeSip',
}: LogoProps) {
  const resolvedHeight = height ?? (variant === 'lockup' ? 40 : 32);
  return (
    <img
      src={srcFor(variant, theme)}
      alt={alt}
      height={resolvedHeight}
      className={className}
      style={{ height: resolvedHeight, width: 'auto' }}
      draggable={false}
    />
  );
}
