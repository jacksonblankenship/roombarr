// updateRadarrImportList.spec.ts

import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import {
  updateRadarrImportList,
  UpdateImportListResponse,
} from './update-import-list';

jest.mock('../lib/env', () => ({
  env: {
    RADARR_BASE_URL: 'http://mock-radarr-url',
    RADARR_PORT: '7878',
    RADARR_API_KEY: 'mock-api-key',
  },
}));

describe('updateRadarrImportList', () => {
  const mockValidResponse: UpdateImportListResponse = {
    id: 1,
    name: 'Updated List',
  };

  beforeEach(() => {
    server.resetHandlers();
  });

  it('updates import list and parses response correctly', async () => {
    server.use(
      http.put('*/api/v3/importlist/*', async ({ request }) => {
        const body = await request.json();
        expect(body).toEqual({ tags: [1, 2, 3] });
        return HttpResponse.json(mockValidResponse);
      }),
    );

    const result = await updateRadarrImportList(1, { tags: [1, 2, 3] });

    expect(result).toEqual(mockValidResponse);
  });

  it('sends request to correct URL', async () => {
    let requestUrl = '';
    server.use(
      http.put('*/api/v3/importlist/*', ({ request }) => {
        requestUrl = request.url;
        return HttpResponse.json(mockValidResponse);
      }),
    );

    await updateRadarrImportList(5, { tags: [1] });

    expect(requestUrl).toContain('/api/v3/importlist/5');
  });

  it('throws an error for invalid response data', async () => {
    server.use(
      http.put('*/api/v3/importlist/*', () => {
        return HttpResponse.json({ invalid_key: 'invalid_value' });
      }),
    );

    await expect(updateRadarrImportList(1, { tags: [1] })).rejects.toThrow();
  });

  it('handles network errors', async () => {
    server.use(
      http.put('*/api/v3/importlist/*', () => {
        return HttpResponse.error();
      }),
    );

    await expect(updateRadarrImportList(1, { tags: [1] })).rejects.toThrow();
  });
});
