import { ListConfig, providerSchemas } from '../lib/config';
import { mdblist } from './mdblist';

export type MovieDto = {
  imdbId: string;
};

/**
 * Defines the contract for a list provider, which interacts with specific list configurations.
 *
 * @template T - The provider identifier, constrained to keys of `providerSchemas`.
 */
export type ListProvider<T extends keyof typeof providerSchemas> = {
  /**
   * The identifier for the list provider.
   */
  listProvider: T;

  /**
   * Generates a unique and consistent key for the list, ensuring that lists with the same provider
   * never have the same key value.
   *
   * This function must produce the same output for the same input every time it is called, and
   * it should ensure uniqueness across different lists with the same provider.
   *
   * @param listConfig - The configuration for the list provider.
   * @returns A string that combines the provider identifier with additional information.
   */
  computeListKey: (
    listConfig: Extract<ListConfig, { listProvider: T }>,
  ) => `${T}:${string}`;

  /**
   * Fetches the list of movies based on the provided configuration.
   *
   * @param listConfig - The configuration for the list provider.
   * @returns A promise that resolves to an array of `MovieDto` objects.
   */
  fetchListMovies: (
    listConfig: Extract<ListConfig, { listProvider: T }>,
  ) => Promise<MovieDto[]>;
};

export { mdblist };
