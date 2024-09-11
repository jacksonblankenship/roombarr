import { env } from './env';

const PROD_CONFIG_DIR = '/config';
const DEV_CONFIG_DIR = './config';

export const CONFIG_DIR =
  env.NODE_ENV === 'production' ? PROD_CONFIG_DIR : DEV_CONFIG_DIR;

export const CONFIG_FILE = 'config.yml';

export const RADARR_ROOMBARR_TAG_LABEL: Lowercase<'roombarr'> = 'roombarr';
