import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import {
  fetchAllRadarrImportListMovies,
  FetchAllImportListMoviesResponse,
} from './fetch-all-import-list-movies';

jest.mock('../lib/env', () => ({
  env: {
    RADARR_BASE_URL: 'http://mock-radarr-url',
    RADARR_PORT: '7878',
    RADARR_API_KEY: 'mock-api-key',
  },
}));

describe('fetchAllRadarrImportListMovies', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it('fetches and parses import list movies correctly', async () => {
    const mockValidImportListMoviesResponse: FetchAllImportListMoviesResponse =
      [
        { imdbId: 'tt1234567' },
        { imdbId: 'tt2345678' },
        { imdbId: 'tt3456789' },
      ];

    server.use(
      http.get('*/api/v3/importlist/movie', () => {
        return HttpResponse.json(mockValidImportListMoviesResponse);
      }),
    );

    const result = await fetchAllRadarrImportListMovies();

    expect(result).toEqual(mockValidImportListMoviesResponse);
  });

  it('handles empty response correctly', async () => {
    server.use(
      http.get('*/api/v3/importlist/movie', () => {
        return HttpResponse.json([]);
      }),
    );

    const result = await fetchAllRadarrImportListMovies();

    expect(result).toEqual([]);
  });

  it('throws an error for invalid data', async () => {
    server.use(
      http.get('*/api/v3/importlist/movie', () => {
        return HttpResponse.json([{ invalid_key: 'invalid_value' }]);
      }),
    );

    await expect(fetchAllRadarrImportListMovies()).rejects.toThrow();
  });

  it('handles network errors', async () => {
    server.use(
      http.get('*/api/v3/importlist/movie', () => {
        return HttpResponse.error();
      }),
    );

    await expect(fetchAllRadarrImportListMovies()).rejects.toThrow();
  });
});
