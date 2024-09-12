import { z } from 'zod';
import { radarr } from '.';
import { radarrMovieSchema } from './schema';

/**
 * Use `.passthrough()` to allow additional properties in the API response
 * that are not defined in the schema. This is useful for Radarr's PUT requests,
 * which require all properties to be present. By using passthrough, we avoid
 * defining every possible field and ensure only the relevant properties are validated.
 */
const fetchMovieResponseSchema = radarrMovieSchema.passthrough();

export type FetchMovieResponse = z.infer<typeof fetchMovieResponseSchema>;

export async function fetchRadarrMovie(id: number) {
  const response = await radarr.get(`/api/v3/movie/${id}`);

  return fetchMovieResponseSchema.parse(response.data);
}
