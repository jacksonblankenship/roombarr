import { http, HttpResponse } from 'msw';
import { server } from '../../../../mocks/server';
import { getMovies } from './get-movies';
import { RadarrMovie } from '../schema';

describe('getMovies', () => {
  const testResponse: RadarrMovie[] = [
    {
      id: 123,
      title: 'Test Movie',
      year: 2024,
      added: new Date(),
      images: [],
      imdbId: 'tt123',
      overview: 'Test overview',
      tags: [],
    },
  ];

  it('calls the correct API endpoint', async () => {
    let requestUrl = '';
    server.use(
      http.get('*/api/v3/movie', ({ request }) => {
        requestUrl = request.url;
        return HttpResponse.json(testResponse);
      }),
    );

    await getMovies();

    expect(requestUrl).toContain('/api/v3/movie');
  });

  it('returns an array of movies on success', async () => {
    server.use(
      http.get('*/api/v3/movie', () => {
        return HttpResponse.json(testResponse);
      }),
    );

    await expect(getMovies()).resolves.toEqual(testResponse);
  });

  it('handles network errors', async () => {
    server.use(
      http.get('*/api/v3/movie', () => {
        return HttpResponse.error();
      }),
    );

    await expect(getMovies()).rejects.toThrow();
  });
});
