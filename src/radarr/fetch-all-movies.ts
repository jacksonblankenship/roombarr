import { z } from 'zod';
import { radarr } from '../lib/radarr';

const radarrMovieSchema = z.object({
  id: z.number().min(0),
  title: z.string(),
  overview: z.string(),
  year: z.number().min(0),
  imdbId: z.string().startsWith('tt'),
  added: z.coerce.date(),
  tags: z.array(z.number()),
  images: z.array(z.object({ remoteUrl: z.string() })),
});

export type RadarrMovie = z.infer<typeof radarrMovieSchema>;

export async function fetchAllRadarrMovies() {
  const response = await radarr.get('/api/v3/movie');

  return z.array(radarrMovieSchema).parse(response.data);
}
