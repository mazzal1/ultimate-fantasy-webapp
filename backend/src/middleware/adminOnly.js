import { requireAuth } from './auth.js';

export function requireAdmin(event) {
  const authContext = requireAuth(event);
  if (!authContext.groups.includes('Admins')) {
    throw new Error('Forbidden');
  }

  return authContext;
}
