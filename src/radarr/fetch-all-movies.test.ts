import { http, HttpResponse } from 'msw';
import {
  fetchAllRadarrMovies,
  FetchAllMoviesResponse,
} from './fetch-all-movies';
import { server } from '../../mocks/server';

jest.mock('../lib/env', () => ({
  env: {
    RADARR_BASE_URL: 'http://mock-radarr-url',
    RADARR_PORT: '7878',
    RADARR_API_KEY: 'mock-api-key',
  },
}));

describe('fetchAllRadarrMovies', () => {
  const mockValidResponse: FetchAllMoviesResponse = [
    {
      id: 1,
      title: 'Test Movie',
      overview: 'This is a test movie',
      year: 2023,
      imdbId: 'tt1234567',
      added: new Date('2023-01-01'),
      tags: [1, 2, 3],
      images: [{ remoteUrl: 'http://example.com/image.jpg' }],
    },
  ];

  beforeEach(() => {
    server.resetHandlers();
  });

  it('fetches and parses Radarr movies correctly', async () => {
    server.use(
      http.get('*/api/v3/movie', () => {
        return HttpResponse.json(mockValidResponse);
      }),
    );

    const result = await fetchAllRadarrMovies();

    expect(result).toEqual(mockValidResponse);
  });

  it('handles empty response correctly', async () => {
    server.use(
      http.get('*/api/v3/movie', () => {
        return HttpResponse.json([]);
      }),
    );

    const result = await fetchAllRadarrMovies();

    expect(result).toEqual([]);
  });

  it('throws an error for invalid data', async () => {
    server.use(
      http.get('*/api/v3/movie', () => {
        return HttpResponse.json([{ invalid_key: 'invalid_value' }]);
      }),
    );

    await expect(fetchAllRadarrMovies()).rejects.toThrow();
  });

  it('handles network errors', async () => {
    server.use(
      http.get('*/api/v3/movie', () => {
        return HttpResponse.error();
      }),
    );

    await expect(fetchAllRadarrMovies()).rejects.toThrow();
  });
});
