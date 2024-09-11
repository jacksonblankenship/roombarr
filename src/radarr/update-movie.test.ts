// updateRadarrMovie.spec.ts

import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { updateRadarrMovie, UpdateMovieResponse } from './update-movie';

jest.mock('../lib/env', () => ({
  env: {
    RADARR_BASE_URL: 'http://mock-radarr-url',
    RADARR_PORT: '7878',
    RADARR_API_KEY: 'mock-api-key',
  },
}));

describe('updateRadarrMovie', () => {
  const mockValidResponse: UpdateMovieResponse = {
    id: 1,
  };

  beforeEach(() => {
    server.resetHandlers();
  });

  it('updates movie and parses response correctly', async () => {
    server.use(
      http.put('*/api/v3/movie/*', async ({ request }) => {
        const body = await request.json();
        expect(body).toEqual({ tags: [1, 2, 3] });
        return HttpResponse.json(mockValidResponse);
      }),
    );

    const result = await updateRadarrMovie(1, { tags: [1, 2, 3] });

    expect(result).toEqual(mockValidResponse);
  });

  it('sends request to correct URL', async () => {
    let requestUrl = '';
    server.use(
      http.put('*/api/v3/movie/*', ({ request }) => {
        requestUrl = request.url;
        return HttpResponse.json(mockValidResponse);
      }),
    );

    await updateRadarrMovie(5, { tags: [1] });

    expect(requestUrl).toContain('/api/v3/movie/5');
  });

  it('throws an error for invalid response data', async () => {
    server.use(
      http.put('*/api/v3/movie/*', () => {
        return HttpResponse.json({ invalid_key: 'invalid_value' });
      }),
    );

    await expect(updateRadarrMovie(1, { tags: [1] })).rejects.toThrow();
  });

  it('handles network errors', async () => {
    server.use(
      http.put('*/api/v3/movie/*', () => {
        return HttpResponse.error();
      }),
    );

    await expect(updateRadarrMovie(1, { tags: [1] })).rejects.toThrow();
  });
});
