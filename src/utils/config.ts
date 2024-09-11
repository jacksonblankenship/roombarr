import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import { z } from 'zod';
import {
  DEFAULT_EXPIRY_DAYS,
  DEFAULT_DAYS_BEFORE_EXPIRY_NOTICE,
} from './defaults';
import { join } from 'path';
import { CONFIG_DIR, CONFIG_FILE } from './constants';

export const createListSchema = <T extends z.Primitive, U>(
  provider: T,
  options: z.ZodType<U>,
) =>
  z.object({
    provider: z.literal(provider),
    expiryDays: z.number().min(0).default(DEFAULT_EXPIRY_DAYS),
    expiryNoticeDays: z
      .number()
      .min(0)
      .default(DEFAULT_DAYS_BEFORE_EXPIRY_NOTICE),
    options,
  });

export const providerSchema = {
  mdblist: createListSchema(
    'mdblist',
    z.object({
      listUrl: z.string(),
    }),
  ),
} as const;

const listSchema = z.discriminatedUnion('provider', [providerSchema.mdblist]);
export type List = z.infer<typeof listSchema>;

export const configSchema = z.object({
  lists: z.array(listSchema),
});
export type Config = z.infer<typeof configSchema>;

export async function loadConfig() {
  const data = await readFile(join(CONFIG_DIR, CONFIG_FILE), 'utf-8');
  const yaml: unknown = parse(data);
  return configSchema.parse(yaml);
}
