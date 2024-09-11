import { ListConfig, providerSchemas } from '../lib/config';
import { mdblist } from './mdblist';

export type MovieDto = {
  imdbId: string;
};

export type ListProvider<T extends keyof typeof providerSchemas> = {
  id: T;
  fetchList: (
    listConfig: Extract<ListConfig, { listProvider: T }>,
  ) => Promise<MovieDto[]>;
  generateTag: (
    listConfig: Extract<ListConfig, { listProvider: T }>,
  ) => `${T}:${string}`;
};

export { mdblist };
