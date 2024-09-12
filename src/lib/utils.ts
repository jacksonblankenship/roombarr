import { createHash } from 'crypto';

export function generateShortHash(input: string) {
  return createHash('sha256').update(input).digest('hex').slice(0, 8);
}
