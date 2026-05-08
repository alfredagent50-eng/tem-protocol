/**
 * Pill button. Primary = oxblood. Secondary = outlined. Ghost = nothing
 * but text + hover. Uses native <button> by default; pass `as="a"` and
 * an `href` to render a link instead.
 */
import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'sm';

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type AsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' };

type AsAnchor = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a'; href: string };

export type ButtonProps = AsButton | AsAnchor;

function classFor(variant: Variant, size: Size): string {
  const variantClass =
    variant === 'primary' ? 'pay-button' : variant === 'ghost' ? 'ghost-button' : 'ghost-button';
  const sizeClass = size === 'sm' ? 'btn-sm' : '';
  return [variantClass, sizeClass].filter(Boolean).join(' ');
}

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', className = '', children } = props;
  const klass = `${classFor(variant, size)} ${className}`.trim();

  if (props.as === 'a') {
    const { as: _as, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as AsAnchor & { as: 'a' };
    return (
      <a className={klass} {...rest}>
        {children}
      </a>
    );
  }

  const { as: _as, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as AsButton;
  return (
    <button className={klass} {...rest}>
      {children}
    </button>
  );
}
