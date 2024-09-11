import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { fetchAllRadarrTags, FetchAllTagsResponse } from './fetch-all-tags';

jest.mock('../lib/env', () => ({
  env: {
    RADARR_BASE_URL: 'http://mock-radarr-url',
    RADARR_PORT: '7878',
    RADARR_API_KEY: 'mock-api-key',
  },
}));

describe('fetchAllRadarrTags', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it('fetches and parses Radarr tags correctly', async () => {
    const mockValidResponse: FetchAllTagsResponse = [
      { id: 1, label: 'Action' },
    ];

    server.use(
      http.get('*/api/v3/tag', () => {
        return HttpResponse.json(mockValidResponse);
      }),
    );

    const result = await fetchAllRadarrTags();

    expect(result).toEqual(mockValidResponse);
  });

  it('handles empty response correctly', async () => {
    server.use(
      http.get('*/api/v3/tag', () => {
        return HttpResponse.json([]);
      }),
    );

    const result = await fetchAllRadarrTags();

    expect(result).toEqual([]);
  });

  it('throws an error for invalid data', async () => {
    server.use(
      http.get('*/api/v3/tag', () => {
        return HttpResponse.json([{ invalid_key: 'invalid_value' }]);
      }),
    );

    await expect(fetchAllRadarrTags()).rejects.toThrow();
  });

  it('handles network errors', async () => {
    server.use(
      http.get('*/api/v3/tag', () => {
        return HttpResponse.error();
      }),
    );

    await expect(fetchAllRadarrTags()).rejects.toThrow();
  });
});
