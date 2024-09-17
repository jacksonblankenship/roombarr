import { http, HttpResponse } from 'msw';
import { server } from '../../../../mocks/server';
import { RadarrImportList } from '../schema';
import { getImportLists } from './get-import-lists';

describe('getImportLists', () => {
  const testResponse: RadarrImportList[] = [
    {
      id: 123,
      name: 'Test List',
      tags: [456],
    },
  ];

  it('calls the correct API endpoint', async () => {
    let requestUrl = '';
    server.use(
      http.get('*/api/v3/importlist', ({ request }) => {
        requestUrl = request.url;
        return HttpResponse.json(testResponse);
      }),
    );

    await getImportLists();

    expect(requestUrl).toContain('/api/v3/importlist');
  });

  it('returns an array of import lists on success', async () => {
    server.use(
      http.get('*/api/v3/importlist', () => {
        return HttpResponse.json(testResponse);
      }),
    );

    await expect(getImportLists()).resolves.toEqual(testResponse);
  });

  it('handles network errors', async () => {
    server.use(
      http.get('*/api/v3/importlist', () => {
        return HttpResponse.error();
      }),
    );

    await expect(getImportLists()).rejects.toThrow();
  });
});
