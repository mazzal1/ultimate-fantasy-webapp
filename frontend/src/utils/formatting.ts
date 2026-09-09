export function formatDate(value?: string) {
  if (!value) {
    return 'Unknown';
  }

  return new Date(value).toLocaleDateString();
}

export function formatResource(current: number, max: number) {
  return `${current}/${max}`;
}

export function titleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}
