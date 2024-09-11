import { z } from 'zod';
import { radarr } from '.';

const fetchAllImportListMoviesResponseSchema = z.array(
  z.object({
    imdbId: z.string().startsWith('tt'),
  }),
);

export type FetchAllImportListMoviesResponse = z.infer<
  typeof fetchAllImportListMoviesResponseSchema
>;

export async function fetchAllRadarrImportListMovies() {
  const response = await radarr.get('/api/v3/importlist/movie');

  return fetchAllImportListMoviesResponseSchema.parse(response.data);
}
