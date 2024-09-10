import { List, providerSchema } from '../utils/config';
import { fetchMdblistList } from './fetch-mdblist-list';
import { fetchImdbList } from './fetch-imdb-list';

export type Provider<T extends keyof typeof providerSchema> = (
  list: Extract<List, { provider: T }>,
) => Promise<void>;

export { fetchMdblistList, fetchImdbList };
