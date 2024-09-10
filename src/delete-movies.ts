import axios from 'axios';
import { differenceInDays, format } from 'date-fns';
import { RadarrMovie } from './fetch-radarr-movies';
import { logger } from './utils/pino';
import { env } from './utils/env';

export async function deleteMovies(movies: RadarrMovie[]) {
  for (const { id, images, title, year, overview, added } of movies) {
    try {
      // Log the start of the deletion process
      logger.info({ id, title, year }, 'Attempting to delete movie');

      // Call Radarr API to delete the movie
      const radarrResponse = await axios.delete(
        `${env.RADARR_URL}/api/v3/movie/${id}`,
        {
          params: {
            apiKey: env.RADARR_API_KEY,
            deleteFiles: true,
          },
        },
      );

      logger.debug(
        { radarrResponse },
        'Radarr API response for movie deletion',
      );

      const [image] = images;
      const discordPayload = {
        embeds: [
          {
            author: {
              name: 'Movie Deleted',
            },
            title: `${title} (${year})`,
            description: overview,
            fields: [
              {
                name: 'Deletion Date',
                value: format(new Date(), 'EEEE, MMMM do, yyyy'),
                inline: true,
              },
              {
                name: 'Deleted After',
                value: `${differenceInDays(new Date(), added)} days`,
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

      // Send a notification to Discord
      const discordResponse = await axios.post(
        env.DISCORD_WEBHOOK_URL,
        discordPayload,
      );

      logger.debug(
        { discordResponse, discordPayload },
        'Discord webhook response and payload',
      );

      // Log success message once deletion and notification complete
      logger.info(
        { id, title, year },
        'Movie successfully deleted and notification sent',
      );
    } catch (error) {
      // Log an error message with detailed context
      logger.error(
        {
          id,
          title,
          year,
          error: error instanceof Error ? error.message : error,
        },
        'Error occurred while deleting movie or sending notification',
      );
    }
  }
}
