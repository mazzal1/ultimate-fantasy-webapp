import { Link } from 'react-router-dom';
import { Button, Typography, tokens } from '../../design-system';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../hooks/useI18n';

export function Navbar() {
  const { isAuthenticated, isAdmin, signOut } = useAuth();
  const { locale, setLocale, t } = useI18n();

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${tokens.spacing.md}px ${tokens.spacing.lg}px`,
        borderBottom: `1px solid ${tokens.colors.border}`,
        background: tokens.colors.surface,
      }}
    >
      <Link to="/dashboard" style={{ textDecoration: 'none' }}>
        <Typography as="h2">{t('app.title')}</Typography>
      </Link>
      <div style={{ display: 'flex', gap: tokens.spacing.sm, alignItems: 'center' }}>
        <label style={{ display: 'grid', gap: 4, fontSize: 12 }}>
          <span>{t('language.label')}</span>
          <select value={locale} onChange={(event) => setLocale(event.target.value as 'en' | 'it')} style={{ borderRadius: tokens.radii.sm }}>
            <option value="en">{t('language.en')}</option>
            <option value="it">{t('language.it')}</option>
          </select>
        </label>
        {isAdmin ? <Typography muted>{t('auth.admin')}</Typography> : null}
        {isAuthenticated ? (
          <Button variant="ghost" onClick={() => void signOut()}>
            {t('auth.signOut')}
          </Button>
        ) : (
          <Link to="/login" style={{ color: tokens.colors.text }}>
            {t('auth.signIn')}
          </Link>
        )}
      </div>
    </header>
  );
}
