import { NavLink } from 'react-router-dom';
import { tokens } from '../../design-system';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../hooks/useI18n';

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
  display: 'block',
  padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
  borderRadius: tokens.radii.md,
  color: tokens.colors.text,
  background: isActive ? tokens.colors.primary : 'transparent',
  textDecoration: 'none',
});

export function Sidebar() {
  const { isAdmin } = useAuth();
  const { t } = useI18n();

  return (
    <aside style={{ width: 240, padding: tokens.spacing.lg, borderRight: `1px solid ${tokens.colors.border}` }}>
      <nav style={{ display: 'grid', gap: tokens.spacing.sm }}>
        <NavLink to="/dashboard" style={linkStyle}>
          {t('nav.dashboard')}
        </NavLink>
        <NavLink to="/characters" style={linkStyle}>
          {t('nav.characters')}
        </NavLink>
        <NavLink to="/campaigns" style={linkStyle}>
          {t('nav.campaigns')}
        </NavLink>
        <NavLink to="/skills" style={linkStyle}>
          {t('nav.skills')}
        </NavLink>
        {isAdmin ? (
          <NavLink to="/admin" style={linkStyle}>
            {t('nav.admin')}
          </NavLink>
        ) : null}
      </nav>
    </aside>
  );
}
