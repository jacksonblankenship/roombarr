import { loadConfig } from './lib/config';
import { logger } from './lib/pino';

async function main() {
  const config = await loadConfig();

  logger.info({ config }, 'Loaded config');
}

main().catch(error => {
  logger.error(error);
  process.exit(1);
});
