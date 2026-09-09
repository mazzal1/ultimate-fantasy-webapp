function normalizeGroups(groups) {
  if (Array.isArray(groups)) {
    return groups.map(String);
  }

  if (typeof groups === 'string' && groups.length > 0) {
    return groups.split(',').map((group) => group.trim());
  }

  return [];
}

export function getAuthContext(event) {
  const identity = event?.identity;

  if (!identity) {
    return null;
  }

  const claims = identity.claims ?? {};
  const id = String(claims.sub ?? identity.sub ?? identity.username ?? '');
  if (!id) {
    return null;
  }

  return {
    id,
    username: identity.username ?? claims['cognito:username'] ?? claims.username ?? '',
    email: claims.email ?? '',
    groups: normalizeGroups(identity.groups ?? claims['cognito:groups']),
  };
}

export function requireAuth(event) {
  const authContext = getAuthContext(event);
  if (!authContext) {
    throw new Error('Unauthorized');
  }

  return authContext;
}
