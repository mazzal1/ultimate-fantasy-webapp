import { Link, Navigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { Typography, tokens } from '../design-system';

export function LoginPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: tokens.colors.background, padding: tokens.spacing.lg }}>
      <div style={{ display: 'grid', gap: tokens.spacing.md, justifyItems: 'center' }}>
        <LoginForm />
        <Typography>
          Need an account? <Link to="/register" style={{ color: tokens.colors.secondary }}>Register here</Link>
        </Typography>
      </div>
    </div>
  );
}
