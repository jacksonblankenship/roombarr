// createNewRadarrTag.spec.ts

import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { createNewRadarrTag } from './create-new-tag';

jest.mock('../lib/env', () => ({
  env: {
    RADARR_BASE_URL: 'http://mock-radarr-url',
    RADARR_PORT: '7878',
    RADARR_API_KEY: 'mock-api-key',
  },
}));

describe('createNewRadarrTag', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it('creates and parses a new Radarr tag correctly', async () => {
    const mockValidTag = { id: 1, label: 'Action' };

    server.use(
      http.post('*/api/v3/tag', async ({ request }) => {
        const body = await request.json();
        expect(body).toEqual({ label: 'Action' });
        return HttpResponse.json(mockValidTag);
      }),
    );

    const result = await createNewRadarrTag('Action');

    expect(result).toEqual(mockValidTag);
  });

  it('throws an error for invalid response data', async () => {
    server.use(
      http.post('*/api/v3/tag', () => {
        return HttpResponse.json({ invalid_key: 'invalid_value' });
      }),
    );

    await expect(createNewRadarrTag('Action')).rejects.toThrow();
  });

  it('handles network errors', async () => {
    server.use(
      http.post('*/api/v3/tag', () => {
        return HttpResponse.error();
      }),
    );

    await expect(createNewRadarrTag('Action')).rejects.toThrow();
  });
});
