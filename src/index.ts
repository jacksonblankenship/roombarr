import 'reflect-metadata';

import { logger } from './lib/pino';
import { container } from './inversify/container';
import { TYPES } from './inversify/types';
import { RadarrValidationService } from './services/radarr-validation-service';

async function main() {
  try {
    // Resolve TagManagerService from the container
    const radarrValidationService = container.get<RadarrValidationService>(
      TYPES.RadarrValidationService,
    );

    // Verify that everything is properly configured in Radarr
    await radarrValidationService.validateImportListsExist();
    await radarrValidationService.syncTagsWithImportLists();
  } catch (error) {
    logger.fatal(
      error,
      error instanceof Error ? error.message : 'An unknown error occurred.',
    );
    process.exit(1);
  }
}

main();
