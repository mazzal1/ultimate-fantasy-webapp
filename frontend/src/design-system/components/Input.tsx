import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { tokens } from '../tokens';

type SharedProps = {
  label: string;
  error?: string;
  helperText?: string;
};

type InputProps = SharedProps & InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = SharedProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

const fieldStyle = {
  width: '100%',
  padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
  borderRadius: tokens.radii.md,
  border: `1px solid ${tokens.colors.border}`,
  background: tokens.colors.surfaceAlt,
  color: tokens.colors.text,
  fontFamily: tokens.fonts.body,
  boxSizing: 'border-box' as const,
};

function FieldWrapper({ label, error, helperText, children }: SharedProps & { children: ReactNode }) {
  return (
    <label style={{ display: 'grid', gap: tokens.spacing.xs, fontFamily: tokens.fonts.body }}>
      <span>{label}</span>
      {children}
      {error ? <span style={{ color: tokens.colors.error, fontSize: 12 }}>{error}</span> : null}
      {!error && helperText ? <span style={{ color: tokens.colors.textMuted, fontSize: 12 }}>{helperText}</span> : null}
    </label>
  );
}

export function Input({ label, error, helperText, style, ...props }: InputProps) {
  return (
    <FieldWrapper label={label} error={error} helperText={helperText}>
      <input style={{ ...fieldStyle, ...style }} {...props} />
    </FieldWrapper>
  );
}

export function TextArea({ label, error, helperText, style, ...props }: TextareaProps) {
  return (
    <FieldWrapper label={label} error={error} helperText={helperText}>
      <textarea style={{ ...fieldStyle, minHeight: 120, resize: 'vertical', ...style }} {...props} />
    </FieldWrapper>
  );
}
