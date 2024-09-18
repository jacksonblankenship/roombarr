import { Container } from 'inversify';
import { TYPES } from './types';
import { ConfigService } from '../services/config-service';
import { RadarrService } from '../services/radarr-service';
import { env } from '../lib/env';
import { CONFIG_DIR, CONFIG_FILE } from '../config/constants';
import { RadarrValidationService } from '../services/radarr-validation-service';

const container = new Container();

container.bind<ConfigService>(TYPES.ConfigService).toDynamicValue(() => {
  return new ConfigService(CONFIG_DIR, CONFIG_FILE);
});

container.bind<RadarrService>(TYPES.RadarrService).toDynamicValue(() => {
  return new RadarrService(
    env.RADARR_BASE_URL,
    env.RADARR_PORT,
    env.RADARR_API_KEY,
  );
});

container
  .bind<RadarrValidationService>(TYPES.RadarrValidationService)
  .to(RadarrValidationService);

export { container };
