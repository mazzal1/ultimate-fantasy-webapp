export const tokens = {
  colors: {
    primary: '#4A1D96',
    secondary: '#D97706',
    background: '#0D0A1E',
    surface: '#1A1533',
    surfaceAlt: '#241D47',
    text: '#F3F0FF',
    textMuted: '#C4B5FD',
    border: '#6D28D9',
    error: '#DC2626',
    success: '#059669',
    warning: '#F59E0B',
    overlay: 'rgba(13, 10, 30, 0.8)',
  },
  fonts: {
    heading: 'Georgia, Cambria, "Times New Roman", Times, serif',
    body: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 20,
    pill: 999,
  },
  shadows: {
    card: '0 12px 30px rgba(0, 0, 0, 0.25)',
    focus: '0 0 0 3px rgba(217, 119, 6, 0.35)',
  },
};

export type Tokens = typeof tokens;
