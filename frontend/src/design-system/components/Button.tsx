import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { tokens } from '../tokens';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: tokens.colors.primary,
    color: tokens.colors.text,
    border: `1px solid ${tokens.colors.primary}`,
  },
  secondary: {
    background: tokens.colors.secondary,
    color: tokens.colors.background,
    border: `1px solid ${tokens.colors.secondary}`,
  },
  ghost: {
    background: 'transparent',
    color: tokens.colors.text,
    border: `1px solid ${tokens.colors.border}`,
  },
  danger: {
    background: tokens.colors.error,
    color: tokens.colors.text,
    border: `1px solid ${tokens.colors.error}`,
  },
};

export function Button({ children, variant = 'primary', fullWidth, style, ...props }: ButtonProps) {
  return (
    <button
      style={{
        ...variantStyles[variant],
        width: fullWidth ? '100%' : 'auto',
        padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
        borderRadius: tokens.radii.md,
        fontFamily: tokens.fonts.body,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'transform 0.15s ease, opacity 0.15s ease',
        boxShadow: tokens.shadows.card,
        opacity: props.disabled ? 0.6 : 1,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
