import { server } from './mocks/server';
import type { env } from './src/lib/env';

// Establish API mocking before all tests
beforeAll(() => {
  // Start the mock server and log warnings for unhandled requests
  server.listen({
    // onUnhandledRequest: 'warn',
  });
});

// Reset any request handlers after each test (to avoid test interference)
afterEach(() => server.resetHandlers());

// Clean up once the tests are done
afterAll(() => server.close());

// Mock environment variables globally
jest.mock('./src/lib/env.ts', () => ({
  env: {
    RADARR_BASE_URL: 'http://mock-radarr-url',
    RADARR_PORT: 7878,
    RADARR_API_KEY: 'mock-api-key',
    CRON_SCHEDULE: '0 0 * * *',
    LOG_LEVEL: 'info',
    NODE_ENV: 'development',
  } satisfies typeof env,
}));
