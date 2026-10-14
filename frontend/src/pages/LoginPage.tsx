import { Link, Navigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import { Typography, tokens } from '../design-system';

export function LoginPage() {
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: tokens.colors.background, padding: tokens.spacing.lg }}>
      <div style={{ display: 'grid', gap: tokens.spacing.md, justifyItems: 'center' }}>
        <LoginForm />
        <Typography>
          {t('auth.needAccount')} <Link to="/register" style={{ color: tokens.colors.secondary }}>{t('auth.registerHere')}</Link>
        </Typography>
      </div>
    </div>
  );
}
