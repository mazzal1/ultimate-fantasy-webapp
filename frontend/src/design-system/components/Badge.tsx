import type { ReactNode } from 'react';
import { tokens } from '../tokens';

type BadgeProps = {
  children: ReactNode;
  tone?: 'default' | 'success' | 'warning';
};

const toneMap = {
  default: tokens.colors.primary,
  success: tokens.colors.success,
  warning: tokens.colors.secondary,
};

export function Badge({ children, tone = 'default' }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: `2px ${tokens.spacing.sm}px`,
        borderRadius: tokens.radii.pill,
        background: toneMap[tone],
        color: tokens.colors.text,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}
