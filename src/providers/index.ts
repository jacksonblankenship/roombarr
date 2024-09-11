import { List, providerSchema } from '../utils/config';
import { fetchMdblistList } from './fetch-mdblist-list';

export type Movie = {
  imdbId: string;
};

export type Provider<T extends keyof typeof providerSchema> = (
  list: Extract<List, { provider: T }>,
) => Promise<Movie[]>;

export { fetchMdblistList };
