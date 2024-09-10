import { env } from './utils/env';
import { differenceWith, filter } from 'remeda';
import { differenceInDays } from 'date-fns';
import { logger } from './utils/pino';
import { fetchRadarrMovies } from './fetch-radarr-movies';
import { fetchMdblistMovies } from './fetch-mdblist-movies';
import { deleteMovies } from './delete-movies';
import { notifyMovies } from './notify-movies';
import cron from 'node-cron';

async function main() {
  logger.info('Main process started');

  try {
    // Fetch all movies from Radarr and MDBList
    logger.debug('Fetching movies from Radarr and MDBList');
    const radarrMovies = await fetchRadarrMovies();
    const mdblistMovies = await fetchMdblistMovies();

    logger.info(
      {
        radarrMoviesCount: radarrMovies.length,
        mdblistMoviesCount: mdblistMovies.length,
      },
      'Fetched movies from Radarr and MDBList',
    );

    if (radarrMovies.length === 0 || mdblistMovies.length === 0) {
      logger.warn('One or both sources returned no movies');
    }

    // Compare and find orphaned movies
    logger.debug('Comparing Radarr and MDBList to find orphaned movies...');
    const orphanedMovies = differenceWith(
      radarrMovies.filter(({ tags }) =>
        tags.includes(env.RADARR_MDBLIST_TAG_ID),
      ),
      mdblistMovies,
      (radarrMovie, mdblistMovie) =>
        radarrMovie.imdbId === mdblistMovie.imdb_id,
    );

    logger.info(
      { orphanedMoviesCount: orphanedMovies.length },
      'Orphaned movies found',
    );

    // Notify about upcoming deletions
    const moviesToNotify = filter(
      orphanedMovies,
      ({ added }) =>
        differenceInDays(new Date(), added) ===
        env.MOVIE_EXPIRY_DAYS - env.DAYS_BEFORE_EXPIRY_NOTICE,
    );

    if (moviesToNotify.length > 0) {
      logger.info(
        { moviesToNotifyCount: moviesToNotify.length },
        'Movies scheduled for deletion notification',
      );
      logger.debug({ moviesToNotify }, 'Movies to be notified details');

      await notifyMovies(moviesToNotify);
      logger.info('Notification process completed');
    } else {
      logger.info('No movies require deletion notification');
    }

    // Filter and delete expired movies
    const moviesToDelete = filter(
      orphanedMovies,
      ({ added }) =>
        differenceInDays(new Date(), added) > env.MOVIE_EXPIRY_DAYS,
    );

    if (moviesToDelete.length > 0) {
      logger.info(
        { moviesToDeleteCount: moviesToDelete.length },
        'Movies marked for deletion',
      );
      logger.debug({ moviesToDelete }, 'Movies to be deleted details');

      await deleteMovies(moviesToDelete);
      logger.info('Movie deletion process completed');
    } else {
      logger.info('No movies require deletion');
    }
  } catch (error) {
    logger.error({ error }, 'An error occurred during the main process');
  } finally {
    logger.info('Main process completed');
  }
}

// Log application environment variables on startup
logger.info(
  {
    MOVIE_EXPIRY_DAYS: env.MOVIE_EXPIRY_DAYS,
    DAYS_BEFORE_EXPIRY_NOTICE: env.DAYS_BEFORE_EXPIRY_NOTICE,
    CRON_SCHEDULE: env.CRON_SCHEDULE,
    LOG_LEVEL: env.LOG_LEVEL,
  },
  'Application environment variables',
);

// Schedule the cron job and run on init
cron.schedule(
  env.CRON_SCHEDULE,
  async () => {
    logger.info('Cron job started');
    await main();
    logger.info('Cron job completed');
  },
  { runOnInit: true },
);
