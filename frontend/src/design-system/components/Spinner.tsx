import { tokens } from '../tokens';

export function Spinner() {
  return (
    <div
      aria-label="Loading"
      style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        border: `3px solid ${tokens.colors.surfaceAlt}`,
        borderTopColor: tokens.colors.secondary,
        animation: 'spin 0.8s linear infinite',
      }}
    >
      <style>{'@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }'}</style>
    </div>
  );
}
