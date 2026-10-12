import { Link } from 'react-router-dom';
import { Button, Typography, tokens } from '../../design-system';
import { useAuth } from '../../hooks/useAuth';

export function Navbar() {
  const { isAuthenticated, isAdmin, signOut } = useAuth();

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
        <Typography as="h2">Ultimate Fantasy TTRPG</Typography>
      </Link>
      <div style={{ display: 'flex', gap: tokens.spacing.sm, alignItems: 'center' }}>
        {isAdmin ? <Typography muted>Admin</Typography> : null}
        {isAuthenticated ? (
          <Button variant="ghost" onClick={() => void signOut()}>
            Sign out
          </Button>
        ) : (
          <Link to="/login" style={{ color: tokens.colors.text }}>
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
