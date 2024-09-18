import { createHash } from 'crypto';

export function shortHash(input: string) {
  return createHash('sha256').update(input).digest('hex').slice(0, 8);
}

export function trimAndLower(str: string) {
  return str.toLowerCase().trim();
}

export function slugify(str: string) {
  return trimAndLower(str.replace(/[^a-z\s]+/g, '').replace(/\s+/g, '-'));
}
