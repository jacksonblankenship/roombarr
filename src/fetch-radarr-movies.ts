import { logger } from './utils/pino';
import { z } from 'zod';
import { radarr } from './utils/radarr';

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

/**
 * Fetches all movies currently stored in Radarr using the Radarr API.
 * Validates the data structure using zod for strict type checking.
 */
export async function fetchRadarrMovies() {
  try {
    logger.debug('Fetching movies from Radarr...');

    const response = await radarr.get('/api/v3/movie');

    logger.info(
      { count: response.data.length },
      'Movies successfully fetched from Radarr',
    );

    // Validate and parse the movie data to ensure expected structure
    const movies = z.array(radarrMovieSchema).parse(response.data);

    logger.debug(
      { moviesCount: movies.length },
      'Radarr movies validated and parsed',
    );

    return movies;
  } catch (error) {
    logger.error(
      { error: error instanceof Error ? error.message : error },
      'Error fetching movies from Radarr',
    );
    throw error;
  }
}
