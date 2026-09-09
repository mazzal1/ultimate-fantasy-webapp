import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '../../contexts/AuthContext';
import { useAuth } from '../../hooks/useAuth';

vi.mock('aws-amplify/auth', () => ({
  getCurrentUser: vi.fn().mockResolvedValue({ username: 'archmage', userId: 'user-1' }),
  fetchAuthSession: vi.fn().mockResolvedValue({
    tokens: {
      idToken: {
        payload: {
          sub: 'user-1',
          email: 'archmage@example.com',
          'cognito:groups': ['Admins'],
        },
      },
    },
  }),
  signIn: vi.fn().mockResolvedValue({}),
  signOut: vi.fn().mockResolvedValue({}),
  signUp: vi.fn().mockResolvedValue({}),
  confirmSignUp: vi.fn().mockResolvedValue({}),
}));

function AuthProbe() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  return (
    <div>
      <span data-testid="username">{user?.username}</span>
      <span data-testid="is-authenticated">{String(isAuthenticated)}</span>
      <span data-testid="is-admin">{String(isAdmin)}</span>
    </div>
  );
}

describe('useAuth', () => {
  it('hydrates the authenticated user and admin status', async () => {
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('username')).toHaveTextContent('archmage');
    });

    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('true');
  });
});
