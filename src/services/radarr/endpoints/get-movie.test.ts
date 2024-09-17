import { http, HttpResponse } from 'msw';
import { server } from '../../../../mocks/server';
import { getMovie } from './get-movie';
import { RadarrMovie } from '../schema';

describe('getMovie', () => {
  const testResponse: RadarrMovie = {
    id: 123,
    title: 'Test Movie',
    year: 2024,
    added: new Date(),
    images: [],
    imdbId: 'tt123',
    overview: 'Test overview',
    tags: [],
  };

  it('calls the correct API endpoint', async () => {
    let requestUrl = '';
    server.use(
      http.get('*/api/v3/movie/*', ({ request }) => {
        requestUrl = request.url;
        return HttpResponse.json(testResponse);
      }),
    );

    await getMovie(123);

    expect(requestUrl).toContain('/api/v3/movie/123');
  });

  it('returns a movie on success', async () => {
    server.use(
      http.get('*/api/v3/movie/*', () => {
        return HttpResponse.json(testResponse);
      }),
    );

    await expect(getMovie(123)).resolves.toEqual(testResponse);
  });

  it('handles network errors', async () => {
    server.use(
      http.get('*/api/v3/movie/*', () => {
        return HttpResponse.error();
      }),
    );

    await expect(getMovie(123)).rejects.toThrow();
  });
});
