import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { tokens } from '../tokens';

type TypographyProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  muted?: boolean;
};

export function Typography({ children, as = 'p', muted = false, style, ...props }: TypographyProps) {
  const Component = as;
  const isHeading = as.startsWith('h');

  return (
    <Component
      style={{
        margin: 0,
        fontFamily: isHeading ? tokens.fonts.heading : tokens.fonts.body,
        color: muted ? tokens.colors.textMuted : tokens.colors.text,
        lineHeight: 1.5,
        ...style,
      } as CSSProperties}
      {...props}
    >
      {children}
    </Component>
  );
}
