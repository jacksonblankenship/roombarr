import { z } from 'zod';
import { radarr } from '.';
import { radarrMovieSchema } from './schema';

const fetchAllMoviesResponseSchema = z.array(radarrMovieSchema);

export type FetchAllMoviesResponse = z.infer<
  typeof fetchAllMoviesResponseSchema
>;

export async function fetchAllRadarrMovies() {
  const response = await radarr.get('/api/v3/movie');

  return fetchAllMoviesResponseSchema.parse(response.data);
}
