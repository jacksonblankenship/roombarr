import axios from 'axios';
import { ListProvider } from '.';
import { z } from 'zod';
import { map } from 'remeda';
import { generateShortHash } from '../lib/utils';

export const mdblist: ListProvider<'mdblist'> = {
  id: 'mdblist',
  fetchList: async list => {
    const response = await axios.get(`${list.options.listUrl}/json`);

    const data = z
      .array(
        z.object({
          imdb_id: z.string().startsWith('tt'),
        }),
      )
      .parse(response.data);

    return map(data, movie => ({
      imdbId: movie.imdb_id,
    }));
  },
  generateTag: list =>
    `${mdblist.id}:${generateShortHash(list.options.listUrl)}`,
};
