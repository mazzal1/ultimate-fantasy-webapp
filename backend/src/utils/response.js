export function toPlainDocument(document) {
  if (!document) {
    return null;
  }

  return typeof document.toJSON === 'function' ? document.toJSON() : document;
}

export function appSyncError(message) {
  throw new Error(message);
}
