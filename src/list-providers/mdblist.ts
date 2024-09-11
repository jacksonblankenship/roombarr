import axios from 'axios';
import { ListProvider } from '.';
import { z } from 'zod';
import { map } from 'remeda';
import { generateShortHash } from '../lib/utils';

export const mdblist: ListProvider<'mdblist'> = {
  listProvider: 'mdblist',
  computeListKey: list =>
    `${mdblist.listProvider}:${generateShortHash(list.options.listUrl)}`,
  fetchListMovies: async list => {
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
};
