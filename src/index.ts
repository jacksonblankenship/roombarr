import { CONFIG_DIR, CONFIG_FILE } from './config/constants';
import { env } from './lib/env';
import { logger } from './lib/pino';
import { ConfigService } from './services/config-service';
import { RadarrService } from './services/radarr-service';

async function main() {
  try {
    // Initialize application config
    const configService = new ConfigService(CONFIG_DIR, CONFIG_FILE);
    await configService.init();

    const radarrService = new RadarrService(
      env.RADARR_BASE_URL,
      env.RADARR_PORT,
      env.RADARR_API_KEY,
    );
    const importLists = await radarrService.getImportLists();

    // Validate that all lists in the config file exist in Radarr
    configService.validateListsExist(importLists);
  } catch (error) {
    logger.fatal(
      { error },
      error instanceof Error ? error.message : 'An unknown error occurred.',
    );
    process.exit(1);
  }
}

main();
