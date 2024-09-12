import { differenceWith, filter, intersectionWith } from 'remeda';
import { AppConfig, loadAppConfig } from './lib/app-config';
import { RADARR_ROOMBARR_TAG_LABEL } from './lib/constants';
import { logger } from './lib/pino';
import { createRadarrTag } from './radarr/create-tag';
import { fetchAllRadarrImportLists } from './radarr/fetch-all-import-lists';
import { fetchAllRadarrTags } from './radarr/fetch-all-tags';
import { fetchRadarrImportList } from './radarr/fetch-import-list';
import { updateRadarrImportList } from './radarr/update-import-list';
import { fetchAllRadarrImportListMovies } from './radarr/fetch-all-import-list-movies';
import { fetchAllRadarrMovies } from './radarr/fetch-all-movies';
import { env } from './lib/env';
import { compareSimilarStrings } from './lib/utils';

// Fetch or create the Roombarr tag
async function getOrCreateRoombarrTag() {
  const tags = await fetchAllRadarrTags();
  const existingTag = tags.find(tag => tag.label === RADARR_ROOMBARR_TAG_LABEL);

  return (
    existingTag || (await createRadarrTag({ label: RADARR_ROOMBARR_TAG_LABEL }))
  );
}

// Validate import lists and categorize them
async function categorizeImportLists(appConfig: AppConfig) {
  const radarrImportLists = await fetchAllRadarrImportLists();

  const missingLists = differenceWith(
    appConfig.lists,
    radarrImportLists,
    (configList, radarrList) =>
      compareSimilarStrings(configList.name, radarrList.name),
  );

  if (missingLists.length > 0) {
    throw new Error(
      `Missing import lists in Radarr: ${missingLists.map(list => list.name).join(', ')}`,
    );
  }

  return {
    monitored: intersectionWith(
      radarrImportLists,
      appConfig.lists,
      (radarrList, configList) =>
        compareSimilarStrings(radarrList.name, configList.name),
    ),
    orphaned: differenceWith(
      radarrImportLists,
      appConfig.lists,
      (radarrList, configList) =>
        compareSimilarStrings(radarrList.name, configList.name),
    ),
  };
}

// Add or remove the Roombarr tag to/from import lists
async function updateImportListTags(
  importListId: number,
  tagId: number,
  addTag: boolean,
) {
  const importList = await fetchRadarrImportList(importListId);

  const updatedTags = addTag
    ? [...importList.tags, tagId]
    : importList.tags.filter(tag => tag !== tagId);

  return await updateRadarrImportList(importList.id, {
    ...importList,
    tags: updatedTags,
  });
}

// Main function to orchestrate operations
async function main() {
  const appConfig = await loadAppConfig();
  const roombarrTag = await getOrCreateRoombarrTag();

  const { monitored, orphaned } = await categorizeImportLists(appConfig);

  // Update monitored import lists to include the Roombarr tag
  await Promise.all(
    monitored.map(async list => {
      if (!list.tags.includes(roombarrTag.id)) {
        await updateImportListTags(list.id, roombarrTag.id, true);
      }
    }),
  );

  // Remove the Roombarr tag from orphaned import lists
  await Promise.all(
    orphaned.map(async list => {
      if (list.tags.includes(roombarrTag.id)) {
        await updateImportListTags(list.id, roombarrTag.id, false);
      }
    }),
  );

  const importListMovies = await fetchAllRadarrImportListMovies();
  const monitoredListIds = monitored.map(list => list.id);

  const moviesToMonitor = filter(
    importListMovies,
    movie =>
      intersectionWith(
        movie.lists,
        monitoredListIds,
        (movieListId, monitoredListId) => movieListId === monitoredListId,
      ).length > 0,
  );

  const allRadarrMovies = await fetchAllRadarrMovies();
  const taggedMovies = filter(allRadarrMovies, movie =>
    movie.tags.includes(roombarrTag.id),
  );

  const orphanedMovies = differenceWith(
    taggedMovies,
    moviesToMonitor,
    (taggedMovie, monitoredMovie) =>
      taggedMovie.imdbId === monitoredMovie.imdbId,
  );

  logger.info({
    orphanedMovies,
    length: orphanedMovies.length,
    env: env.NODE_ENV,
  });
}

main().catch(error => {
  logger.error(error);
  process.exit(1);
});
