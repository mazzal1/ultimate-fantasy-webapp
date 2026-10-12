import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { confirmUserSignUp, getAuthenticatedUser, signInUser, signOutUser, signUpUser } from '../api/auth';
import type { AuthUser, ConfirmSignUpPayload, SignInPayload, SignUpPayload } from '../types/auth';

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  signIn: (payload: SignInPayload) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<void>;
  confirmSignUp: (payload: ConfirmSignUpPayload) => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getAuthenticatedUser().then((nextUser) => {
      if (active) {
        setUser(nextUser);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const handleSignIn = useCallback(async (payload: SignInPayload) => {
    const nextUser = await signInUser(payload);
    setUser(nextUser);
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOutUser();
    setUser(null);
  }, []);

  const handleSignUp = useCallback(async (payload: SignUpPayload) => {
    await signUpUser(payload);
  }, []);

  const handleConfirmSignUp = useCallback(async (payload: ConfirmSignUpPayload) => {
    await confirmUserSignUp(payload);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.groups.includes('Admins') ?? false,
      loading,
      signIn: handleSignIn,
      signOut: handleSignOut,
      signUp: handleSignUp,
      confirmSignUp: handleConfirmSignUp,
    }),
    [handleConfirmSignUp, handleSignIn, handleSignOut, handleSignUp, loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
}
