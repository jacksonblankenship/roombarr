import axios from 'axios';
import { addDays, format } from 'date-fns';
import { RadarrMovie } from './fetch-radarr-movies';
import { logger } from './utils/pino';
import { env } from './utils/env';

export async function notifyMovies(movies: RadarrMovie[]) {
  for (const { images, title, year, overview, added } of movies) {
    try {
      // Log the beginning of the notification process for each movie
      logger.info(
        { title, year },
        'Notifying about upcoming deletion of movie',
      );

      const [image] = images;
      const discordPayload = {
        embeds: [
          {
            author: {
              name: 'Movie Scheduled for Deletion',
            },
            title: `${title} (${year})`,
            description: overview,
            fields: [
              {
                name: 'Deletion Date',
                value: format(
                  addDays(added, env.MOVIE_EXPIRY_DAYS),
                  'EEEE, MMMM do, yyyy',
                ),
                inline: true,
              },
              {
                name: 'Days Until Deletion',
                value: `${env.DAYS_BEFORE_EXPIRY_NOTICE} days`,
                inline: true,
              },
            ],
            thumbnail: {
              url: image.remoteUrl,
            },
            timestamp: new Date().toISOString(),
          },
        ],
      };

      // Send notification to Discord
      const discordResponse = await axios.post(
        env.DISCORD_WEBHOOK_URL,
        discordPayload,
      );

      logger.debug(
        { discordResponse, discordPayload },
        'Discord webhook response and payload',
      );

      // Log success after notifying
      logger.info(
        { title, year },
        'Successfully notified about upcoming deletion of movie',
      );
    } catch (error) {
      // Log the error with structured data for easier identification
      logger.error(
        { title, year, error: error instanceof Error ? error.message : error },
        'Error notifying about upcoming deletion of movie',
      );
    }
  }
}
