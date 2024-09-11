import { differenceInDays, format } from 'date-fns';
import { RadarrMovie } from './fetch-radarr-movies';
import { logger } from './lib/pino';
import { radarr } from './radarr';
import { discord } from './lib/discord';

export async function deleteMovies(movies: RadarrMovie[]) {
  for (const { id, images, title, year, overview, added } of movies) {
    try {
      // Log the start of the deletion process
      logger.info({ id, title, year }, 'Attempting to delete movie');

      // Call Radarr API to delete the movie
      const radarrResponse = await radarr.delete(`/api/v3/movie/${id}`, {
        params: {
          deleteFiles: true,
        },
      });

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
      const discordResponse = await discord?.send(discordPayload);

      if (discordResponse) {
        logger.debug(
          { discordResponse, discordPayload },
          'Discord webhook response and payload',
        );
      }

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
