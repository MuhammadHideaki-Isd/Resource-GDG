/**
 * generateId.js — Lightweight UUID-like ID generator for localStorage MVP.
 *
 * Produces a RFC 4122 v4-style UUID string without requiring the Web Crypto
 * API to be available (though it uses crypto.randomUUID when available).
 *
 * @returns {string} A UUID string, e.g. "3b9dc814-6a7f-4c2e-8d3f-1a0e7b5f9c12"
 */
function generateId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  // Fallback: manual RFC 4122 v4 construction
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
