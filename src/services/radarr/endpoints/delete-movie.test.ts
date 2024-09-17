import { server } from '../../../../mocks/server';
import { http, HttpResponse } from 'msw';
import { deleteMovie } from './delete-movie';

describe('deleteMovie', () => {
  it('calls the correct API endpoint', async () => {
    let requestUrl = '';
    server.use(
      http.delete('*/api/v3/movie/*', ({ request }) => {
        requestUrl = request.url;
        return HttpResponse.json();
      }),
    );

    await deleteMovie(123);

    expect(requestUrl).toContain('/api/v3/movie/123');
  });

  it('successfully deletes a movie', async () => {
    server.use(
      http.delete('*/api/v3/movie/*', () => {
        return HttpResponse.json();
      }),
    );

    await expect(deleteMovie(123)).resolves.not.toThrow();
  });

  it('handles network errors', async () => {
    server.use(
      http.delete('*/api/v3/movie/*', () => {
        return HttpResponse.error();
      }),
    );

    await expect(deleteMovie(123)).rejects.toThrow();
  });
});
