import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import {
  fetchAllRadarrImportLists,
  FetchAllImportListsResponse,
} from './fetch-all-import-lists';

jest.mock('../lib/env', () => ({
  env: {
    RADARR_BASE_URL: 'http://mock-radarr-url',
    RADARR_PORT: '7878',
    RADARR_API_KEY: 'mock-api-key',
  },
}));

describe('fetchAllRadarrImportLists', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it('fetches and parses Radarr import lists correctly', async () => {
    const mockValidImportLists: FetchAllImportListsResponse = [
      { id: 1, name: 'List 1' },
      { id: 2, name: 'List 2' },
    ];

    server.use(
      http.get('*/api/v3/importlist', () => {
        return HttpResponse.json(mockValidImportLists);
      }),
    );

    const result = await fetchAllRadarrImportLists();

    expect(result).toEqual(mockValidImportLists);
  });

  it('handles empty response correctly', async () => {
    server.use(
      http.get('*/api/v3/importlist', () => {
        return HttpResponse.json([]);
      }),
    );

    const result = await fetchAllRadarrImportLists();

    expect(result).toEqual([]);
  });

  it('throws an error for invalid data', async () => {
    server.use(
      http.get('*/api/v3/importlist', () => {
        return HttpResponse.json([{ invalid_key: 'invalid_value' }]);
      }),
    );

    await expect(fetchAllRadarrImportLists()).rejects.toThrow();
  });

  it('handles network errors', async () => {
    server.use(
      http.get('*/api/v3/importlist', () => {
        return HttpResponse.error();
      }),
    );

    await expect(fetchAllRadarrImportLists()).rejects.toThrow();
  });
});
