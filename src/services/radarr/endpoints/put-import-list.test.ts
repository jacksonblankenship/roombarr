import { http, HttpResponse } from 'msw';
import { server } from '../../../../mocks/server';
import { putImportList } from './put-import-list';
import { RadarrImportList } from '../schema';

describe('putImportList', () => {
  const testRequest: RadarrImportList = {
    id: 123,
    name: 'Test List',
    tags: [],
  };

  const testResponse: RadarrImportList = {
    id: 123,
    name: 'Test List',
    tags: [],
  };

  it('calls the correct API endpoint', async () => {
    let requestUrl = '';
    server.use(
      http.put('*/api/v3/importlist/*', ({ request }) => {
        requestUrl = request.url;
        return HttpResponse.json(testResponse);
      }),
    );

    await putImportList(123, testRequest);

    expect(requestUrl).toContain('/api/v3/importlist/123');
  });

  it('returns an import list on success', async () => {
    server.use(
      http.put('*/api/v3/importlist/*', () => {
        return HttpResponse.json(testResponse);
      }),
    );

    await expect(putImportList(123, testRequest)).resolves.toEqual(
      testResponse,
    );
  });

  it('handles network errors', async () => {
    server.use(
      http.put('*/api/v3/importlist/*', () => {
        return HttpResponse.error();
      }),
    );

    await expect(putImportList(123, testRequest)).rejects.toThrow();
  });
});
