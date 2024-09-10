import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import { z } from 'zod';
import {
  DEFAULT_EXPIRY_DAYS,
  DEFAULT_DAYS_BEFORE_EXPIRY_NOTICE,
} from './defaults';

const data = await readFile('/config/config.yml', 'utf-8');
const yaml: unknown = parse(data);

export const config = z
  .object({
    lists: z.array(
      z.object({
        provider: z.enum(['mdblist']),
        listUrl: z.string().url(),
        expiryDays: z.number().min(0).default(DEFAULT_EXPIRY_DAYS),
        expiryNoticeDays: z
          .number()
          .min(0)
          .default(DEFAULT_DAYS_BEFORE_EXPIRY_NOTICE),
      }),
    ),
  })
  .parse(yaml);
