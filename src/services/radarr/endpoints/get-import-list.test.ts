import { http, HttpResponse } from 'msw';
import { server } from '../../../../mocks/server';
import { getImportList } from './get-import-list';
import { RadarrImportList } from '../schema';

describe('getImportList', () => {
  const testResponse: RadarrImportList = {
    id: 123,
    name: 'Test List',
    tags: [456],
  };

  it('calls the correct API endpoint', async () => {
    let requestUrl = '';
    server.use(
      http.get('*/api/v3/importlist/*', ({ request }) => {
        requestUrl = request.url;
        return HttpResponse.json(testResponse);
      }),
    );

    await getImportList(123);

    expect(requestUrl).toContain('/api/v3/importlist/123');
  });

  it('returns an import list on success', async () => {
    server.use(
      http.get('*/api/v3/importlist/*', () => {
        return HttpResponse.json(testResponse);
      }),
    );

    await expect(getImportList(123)).resolves.toEqual(testResponse);
  });

  it('handles network errors', async () => {
    server.use(
      http.get('*/api/v3/importlist/*', () => {
        return HttpResponse.error();
      }),
    );

    await expect(getImportList(123)).rejects.toThrow();
  });
});
