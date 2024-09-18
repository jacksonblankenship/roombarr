import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import { ConfigService } from './config-service';
import { RadarrImportList } from './radarr-service.schema';

jest.mock('fs/promises');
jest.mock('yaml', () => ({
  parse: jest.fn(),
}));

describe('ConfigService', () => {
  let configService: ConfigService;

  const mockConfig = {
    lists: [
      {
        name: 'Top Rated Movies',
        options: { expiryDays: 30, expiryNoticeDays: 5 },
      },
      {
        name: 'Recent Movies',
        options: { expiryDays: 15, expiryNoticeDays: 3 },
      },
    ],
  };

  beforeEach(() => {
    configService = new ConfigService('/config', 'config.yml');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('init()', () => {
    it('should load a valid configuration file', async () => {
      // Mock successful file read
      (readFile as jest.Mock).mockResolvedValue('valid yaml string');
      (parse as jest.Mock).mockReturnValue(mockConfig); // yaml.parse is synchronous

      await configService.init();

      expect(readFile).toHaveBeenCalledWith('/config/config.yml', 'utf-8');
      expect(configService).toHaveProperty('config.lists', mockConfig.lists);
    });

    it('should throw an error if the config file is invalid', async () => {
      (readFile as jest.Mock).mockResolvedValue('invalid yaml');
      (parse as jest.Mock).mockReturnValue(new Error());

      await expect(configService.init()).rejects.toThrow();
    });

    it('should throw an error if the file cannot be read', async () => {
      (readFile as jest.Mock).mockRejectedValue(new Error());

      await expect(configService.init()).rejects.toThrow();
    });
  });

  describe('validateListsExist()', () => {
    const radarrImportLists: Array<RadarrImportList> = [
      { id: 1, name: 'Top Rated Movies', tags: [] },
      { id: 2, name: 'Recent Movies', tags: [] },
    ];

    it('should validate that all lists exist in Radarr', async () => {
      (readFile as jest.Mock).mockResolvedValue('yaml data');
      (parse as jest.Mock).mockReturnValue(mockConfig);
      await configService.init();

      expect(() =>
        configService.validateListsExist(radarrImportLists),
      ).not.toThrow();
    });

    it('should throw an error if a list is missing in Radarr', async () => {
      (readFile as jest.Mock).mockResolvedValue('yaml data');
      (parse as jest.Mock).mockReturnValue(mockConfig);
      await configService.init();

      const incompleteRadarrLists = [
        { id: 1, name: 'Top Rated Movies', tags: [] },
      ];

      expect(() =>
        configService.validateListsExist(incompleteRadarrLists),
      ).toThrow('Import list "Recent Movies" not found in Radarr.');
    });

    it('should throw an error if validateListsExist is called before init', () => {
      expect(() =>
        configService.validateListsExist(radarrImportLists),
      ).toThrow();
    });
  });
});
