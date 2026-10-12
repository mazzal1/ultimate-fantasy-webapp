export function toIsoString(value) {
  if (!value) {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
}

export function buildOrderBy(sort, allowedColumns, fallbackClause = '') {
  if (!sort || typeof sort !== 'object') {
    return fallbackClause;
  }

  const clauses = Object.entries(sort)
    .map(([field, direction]) => {
      const column = allowedColumns[field];
      if (!column) {
        return null;
      }

      return `${column} ${direction === -1 ? 'DESC' : 'ASC'}`;
    })
    .filter(Boolean);

  if (clauses.length === 0) {
    return fallbackClause;
  }

  return `ORDER BY ${clauses.join(', ')}`;
}
