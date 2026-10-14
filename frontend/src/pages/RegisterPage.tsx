import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';
import { Typography, tokens } from '../design-system';
import { useI18n } from '../hooks/useI18n';

export function RegisterPage() {
  const { t } = useI18n();

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: tokens.colors.background, padding: tokens.spacing.lg }}>
      <div style={{ display: 'grid', gap: tokens.spacing.md, justifyItems: 'center' }}>
        <RegisterForm />
        <Typography>
          {t('auth.alreadyRegistered')} <Link to="/login" style={{ color: tokens.colors.secondary }}>{t('auth.signIn')}</Link>
        </Typography>
      </div>
    </div>
  );
}
