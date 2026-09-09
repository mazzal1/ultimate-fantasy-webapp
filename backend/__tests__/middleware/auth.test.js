import { describe, expect, it } from 'vitest';
import { getAuthContext, requireAuth } from '../../src/middleware/auth.js';
import { requireAdmin } from '../../src/middleware/adminOnly.js';

describe('auth middleware', () => {
  it('extracts cognito claims and groups', () => {
    const context = getAuthContext({
      identity: {
        username: 'warden',
        claims: {
          sub: 'user-1',
          email: 'warden@example.com',
          'cognito:groups': ['Admins'],
        },
      },
    });

    expect(context).toEqual({
      id: 'user-1',
      username: 'warden',
      email: 'warden@example.com',
      groups: ['Admins'],
    });
  });

  it('throws when auth is missing', () => {
    expect(() => requireAuth({})).toThrow('Unauthorized');
  });

  it('throws when user is not an admin', () => {
    expect(() =>
      requireAdmin({
        identity: {
          username: 'player',
          claims: { sub: 'user-2', 'cognito:groups': ['Players'] },
        },
      }),
    ).toThrow('Forbidden');
  });
});
