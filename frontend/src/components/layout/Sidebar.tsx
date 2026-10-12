import { NavLink } from 'react-router-dom';
import { tokens } from '../../design-system';
import { useAuth } from '../../hooks/useAuth';

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

  return (
    <aside style={{ width: 240, padding: tokens.spacing.lg, borderRight: `1px solid ${tokens.colors.border}` }}>
      <nav style={{ display: 'grid', gap: tokens.spacing.sm }}>
        <NavLink to="/dashboard" style={linkStyle}>
          Dashboard
        </NavLink>
        <NavLink to="/characters" style={linkStyle}>
          Characters
        </NavLink>
        <NavLink to="/campaigns" style={linkStyle}>
          Campaigns
        </NavLink>
        <NavLink to="/skills" style={linkStyle}>
          Skills
        </NavLink>
        {isAdmin ? (
          <NavLink to="/admin" style={linkStyle}>
            Admin
          </NavLink>
        ) : null}
      </nav>
    </aside>
  );
}
