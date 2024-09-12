import { createHash } from 'crypto';

export function generateShortHash(input: string) {
  return createHash('sha256').update(input).digest('hex').slice(0, 8);
}

export function sanitizeString(value: string) {
  return value
    .replace(/[^ -~]+/g, ' ') // Remove all non-standard keyboard characters
    .replace(/\s+/g, ' ') // Normalize whitespace to single spaces
    .replace(/\\+/g, '') // Remove all backslashes
    .trim();
}

export function compareSimilarStrings(a: string, b: string) {
  return (
    sanitizeString(a).trim().toLowerCase() ===
    sanitizeString(b).trim().toLowerCase()
  );
}
