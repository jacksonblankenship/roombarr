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
  const mockValidResponse: FetchAllImportListsResponse = [
    { id: 1, name: 'List 1', tags: [1, 2] },
    { id: 2, name: 'List 2', tags: [3] },
    { id: 3, name: 'List 3', tags: [] },
  ];

  beforeEach(() => {
    server.resetHandlers();
  });

  it('fetches and parses Radarr import lists correctly', async () => {
    server.use(
      http.get('*/api/v3/importlist', () => {
        return HttpResponse.json(mockValidResponse);
      }),
    );

    const result = await fetchAllRadarrImportLists();

    expect(result).toEqual(mockValidResponse);
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

  it('validates import list properties', async () => {
    const invalidList = { id: -1, name: '', tags: ['invalid'] };
    server.use(
      http.get('*/api/v3/importlist', () => {
        return HttpResponse.json([invalidList]);
      }),
    );

    await expect(fetchAllRadarrImportLists()).rejects.toThrow();
  });

  it('handles lists with no tags', async () => {
    const listWithNoTags = { id: 1, name: 'No Tags List', tags: [] };
    server.use(
      http.get('*/api/v3/importlist', () => {
        return HttpResponse.json([listWithNoTags]);
      }),
    );

    const result = await fetchAllRadarrImportLists();

    expect(result).toEqual([listWithNoTags]);
  });

  it('handles lists with multiple tags', async () => {
    const listWithMultipleTags = {
      id: 1,
      name: 'Multi-Tag List',
      tags: [1, 2, 3, 4],
    };
    server.use(
      http.get('*/api/v3/importlist', () => {
        return HttpResponse.json([listWithMultipleTags]);
      }),
    );

    const result = await fetchAllRadarrImportLists();

    expect(result).toEqual([listWithMultipleTags]);
  });
});
