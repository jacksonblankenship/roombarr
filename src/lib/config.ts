import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import { z } from 'zod';
import {
  DEFAULT_EXPIRY_DAYS,
  DEFAULT_DAYS_BEFORE_EXPIRY_NOTICE,
} from './defaults';
import { join } from 'path';
import { CONFIG_DIR, CONFIG_FILE } from './constants';

export const appConfigSchema = z.object({
  lists: z.array(
    z
      .object({
        name: z.string().min(1),
        options: z
          .object({
            expiryDays: z
              .number()
              .min(0)
              .optional()
              .default(DEFAULT_EXPIRY_DAYS),
            expiryNoticeDays: z
              .number()
              .min(0)
              .optional()
              .default(DEFAULT_DAYS_BEFORE_EXPIRY_NOTICE),
          })
          .optional()
          .default({
            expiryDays: DEFAULT_EXPIRY_DAYS,
            expiryNoticeDays: DEFAULT_DAYS_BEFORE_EXPIRY_NOTICE,
          }),
      })
      .refine(val => val.options.expiryDays >= val.options.expiryNoticeDays),
  ),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

export async function loadConfig() {
  const data = await readFile(join(CONFIG_DIR, CONFIG_FILE), 'utf-8');
  const yaml: unknown = parse(data);
  return appConfigSchema.parse(yaml);
}
