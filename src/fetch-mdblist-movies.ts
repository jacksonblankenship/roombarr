import axios from 'axios';
import { z } from 'zod';
import { logger } from './lib/pino';
import { env } from './lib/env';

const mdblistMovieSchema = z.object({
  id: z.number().min(0),
  imdb_id: z.string().startsWith('tt').nullable(),
});

export type MdblistMovie = z.infer<typeof mdblistMovieSchema>;

/**
 * Fetches all movies currently in the MDBList using the MDBList API.
 * Validates the data structure using zod for type consistency.
 */
export async function fetchMdblistMovies() {
  try {
    logger.debug('Fetching movies from MDBList...');

    const response = await axios.get(
      `https://mdblist.com/lists/${env.MDBLIST_USERNAME}/${env.MDBLIST_LIST_NAME}/json`,
    );

    logger.info(
      { count: response.data.length },
      'Movies successfully fetched from MDBList',
    );

    // Validate and parse the MDBList movie data
    const movies = z.array(mdblistMovieSchema).parse(response.data);

    logger.debug(
      { moviesCount: movies.length },
      'MDBList movies validated and parsed',
    );

    return movies;
  } catch (error) {
    logger.error(
      { error: error instanceof Error ? error.message : error },
      'Error fetching movies from MDBList',
    );
    throw error; // Re-throw the error after logging it for further handling
  }
}
