import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { createRadarrTag, CreateTagResponse } from './create-tag';

jest.mock('../lib/env', () => ({
  env: {
    RADARR_BASE_URL: 'http://mock-radarr-url',
    RADARR_PORT: '7878',
    RADARR_API_KEY: 'mock-api-key',
  },
}));

describe('createRadarrTag', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it('creates and parses a Radarr tag correctly', async () => {
    const mockValidResponse: CreateTagResponse = { id: 1, label: 'Action' };

    server.use(
      http.post('*/api/v3/tag', async ({ request }) => {
        const body = await request.json();
        expect(body).toEqual({ label: 'Action' });
        return HttpResponse.json(mockValidResponse);
      }),
    );

    const result = await createRadarrTag({
      label: 'Action',
    });

    expect(result).toEqual(mockValidResponse);
  });

  it('throws an error for invalid response data', async () => {
    server.use(
      http.post('*/api/v3/tag', () => {
        return HttpResponse.json({ invalid_key: 'invalid_value' });
      }),
    );

    await expect(
      createRadarrTag({
        label: 'Action',
      }),
    ).rejects.toThrow();
  });

  it('handles network errors', async () => {
    server.use(
      http.post('*/api/v3/tag', () => {
        return HttpResponse.error();
      }),
    );

    await expect(
      createRadarrTag({
        label: 'Action',
      }),
    ).rejects.toThrow();
  });
});
