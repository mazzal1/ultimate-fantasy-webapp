import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { tokens } from '../tokens';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  elevated?: boolean;
};

export function Card({ children, elevated = true, style, ...props }: CardProps) {
  return (
    <div
      style={{
        background: tokens.colors.surface,
        color: tokens.colors.text,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radii.lg,
        padding: tokens.spacing.lg,
        boxShadow: elevated ? tokens.shadows.card : 'none',
        ...style,
      } as CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
}
