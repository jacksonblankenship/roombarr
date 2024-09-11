// deleteRadarrMovie.spec.ts

import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { deleteRadarrMovie, DeleteMovieResponse } from './delete-movie';

jest.mock('../lib/env', () => ({
  env: {
    RADARR_BASE_URL: 'http://mock-radarr-url',
    RADARR_PORT: '7878',
    RADARR_API_KEY: 'mock-api-key',
  },
}));

describe('deleteRadarrMovie', () => {
  const mockValidResponse: DeleteMovieResponse = {
    id: 1,
  };

  beforeEach(() => {
    server.resetHandlers();
  });

  it('deletes movie and parses response correctly', async () => {
    server.use(
      http.delete('*/api/v3/movie/*', () => {
        return HttpResponse.json(mockValidResponse);
      }),
    );

    const result = await deleteRadarrMovie(1);

    expect(result).toEqual(mockValidResponse);
  });

  it('sends request to correct URL', async () => {
    let requestUrl = '';
    server.use(
      http.delete('*/api/v3/movie/*', ({ request }) => {
        requestUrl = request.url;
        return HttpResponse.json(mockValidResponse);
      }),
    );

    await deleteRadarrMovie(5);

    expect(requestUrl).toContain('/api/v3/movie/5');
  });

  it('throws an error for invalid response data', async () => {
    server.use(
      http.delete('*/api/v3/movie/*', () => {
        return HttpResponse.json({ invalid_key: 'invalid_value' });
      }),
    );

    await expect(deleteRadarrMovie(1)).rejects.toThrow();
  });

  it('handles network errors', async () => {
    server.use(
      http.delete('*/api/v3/movie/*', () => {
        return HttpResponse.error();
      }),
    );

    await expect(deleteRadarrMovie(1)).rejects.toThrow();
  });
});
