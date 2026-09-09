import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';
import { Typography, tokens } from '../design-system';

export function RegisterPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: tokens.colors.background, padding: tokens.spacing.lg }}>
      <div style={{ display: 'grid', gap: tokens.spacing.md, justifyItems: 'center' }}>
        <RegisterForm />
        <Typography>
          Already sworn in? <Link to="/login" style={{ color: tokens.colors.secondary }}>Sign in</Link>
        </Typography>
      </div>
    </div>
  );
}
