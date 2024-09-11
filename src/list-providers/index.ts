import { List, listProviderSchemas } from '../utils/config';
import { fetchMdblistList } from './fetch-mdblist-list';

export type MovieDto = {
  imdbId: string;
};

export type ListProvider<T extends keyof typeof listProviderSchemas> = (
  list: Extract<List, { listProvider: T }>,
) => Promise<MovieDto[]>;

export { fetchMdblistList };
