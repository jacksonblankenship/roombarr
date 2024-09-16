import { differenceWith, filter, intersectionWith } from 'remeda';
import { AppConfig, loadAppConfig } from './config/app-config';
import { RADARR_ROOMBARR_TAG_LABEL } from './config/constants';
import { logger } from './lib/pino';
import { env } from './lib/env';
import { getImportList } from './services/radarr/endpoints/get-import-list';
import { getImportListMovies } from './services/radarr/endpoints/get-import-list-movies';
import { getImportLists } from './services/radarr/endpoints/get-import-lists';
import { getMovies } from './services/radarr/endpoints/get-movies';
import { getTags } from './services/radarr/endpoints/get-tags';
import { postTag } from './services/radarr/endpoints/post-tag';
import { putImportList } from './services/radarr/endpoints/put-import-list';

// Fetch or create the Roombarr tag
async function getOrCreateRoombarrTag() {
  const tags = await getTags();
  const existingTag = tags.find(tag => tag.label === RADARR_ROOMBARR_TAG_LABEL);

  return existingTag || (await postTag({ label: RADARR_ROOMBARR_TAG_LABEL }));
}

// Validate import lists and categorize them
async function categorizeImportLists(appConfig: AppConfig) {
  const radarrImportLists = await getImportLists();

  const missingLists = differenceWith(
    appConfig.lists,
    radarrImportLists,
    (configList, radarrList) =>
      configList.name.trim().toLowerCase() ===
      radarrList.name.trim().toLowerCase(),
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
        radarrList.name.trim().toLowerCase() ===
        configList.name.trim().toLowerCase(),
    ),
    orphaned: differenceWith(
      radarrImportLists,
      appConfig.lists,
      (radarrList, configList) =>
        radarrList.name.trim().toLowerCase() === configList.name,
    ),
  };
}

// Add or remove the Roombarr tag to/from import lists
async function updateImportListTags(
  importListId: number,
  tagId: number,
  addTag: boolean,
) {
  const importList = await getImportList(importListId);

  const updatedTags = addTag
    ? [...importList.tags, tagId]
    : importList.tags.filter(tag => tag !== tagId);

  return await putImportList(importList.id, {
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

  const importListMovies = await getImportListMovies();
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

  const allRadarrMovies = await getMovies();
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
