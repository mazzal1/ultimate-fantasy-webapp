import { confirmSignUp, fetchAuthSession, getCurrentUser, signIn, signOut, signUp } from 'aws-amplify/auth';
import type { AuthUser, ConfirmSignUpPayload, SignInPayload, SignUpPayload } from '../types/auth';

function normalizeGroups(groups: unknown) {
  if (Array.isArray(groups)) {
    return groups.map(String);
  }

  if (typeof groups === 'string' && groups.length > 0) {
    return groups.split(',').map((value) => value.trim());
  }

  return [] as string[];
}

export async function getAuthenticatedUser(): Promise<AuthUser | null> {
  try {
    const [currentUser, session] = await Promise.all([getCurrentUser(), fetchAuthSession()]);
    const tokenPayload = session.tokens?.idToken?.payload ?? {};

    return {
      id: String(tokenPayload.sub ?? currentUser.userId ?? currentUser.username),
      username: currentUser.username,
      email: typeof tokenPayload.email === 'string' ? tokenPayload.email : undefined,
      groups: normalizeGroups(tokenPayload['cognito:groups']),
    };
  } catch {
    return null;
  }
}

export async function signInUser(payload: SignInPayload) {
  await signIn(payload);
  return getAuthenticatedUser();
}

export async function signOutUser() {
  await signOut();
}

export async function signUpUser(payload: SignUpPayload) {
  return signUp({
    username: payload.username,
    password: payload.password,
    options: {
      userAttributes: {
        email: payload.email,
      },
    },
  });
}

export async function confirmUserSignUp(payload: ConfirmSignUpPayload) {
  return confirmSignUp({
    username: payload.username,
    confirmationCode: payload.confirmationCode,
  });
}
