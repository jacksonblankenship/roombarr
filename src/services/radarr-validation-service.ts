import { inject, injectable } from 'inversify';
import { TYPES } from '../inversify/types';
import { RadarrService } from './radarr-service';
import { ConfigService } from './config-service';
import { RadarrImportList, RadarrTag } from './radarr-service.schema';
import { createHash } from 'crypto';

@injectable()
export class RadarrValidationService {
  private radarrService: RadarrService;
  private configService: ConfigService;

  constructor(
    @inject(TYPES.RadarrService) radarrService: RadarrService,
    @inject(TYPES.ConfigService) configService: ConfigService,
  ) {
    this.radarrService = radarrService;
    this.configService = configService;
  }

  public async validateImportListsExist() {
    const config = await this.configService.getConfig();
    const radarrImportLists = await this.radarrService.getImportLists();

    for (const { name } of config.lists) {
      const list = this.findListByName(radarrImportLists, name);

      if (!list) {
        throw new Error(
          `Import list "${name}" from the configuration was not found in Radarr.`,
        );
      }
    }
  }

  public async syncTagsWithImportLists() {
    const radarrTags = await this.radarrService.getTags();
    const radarrLists = await this.radarrService.getImportLists();
    const config = await this.configService.getConfig();

    const tagMap = this.createTagMap(radarrTags);

    for (const list of config.lists) {
      const tagName = this.calculateTagName(list.name);
      const tagId = await this.ensureTagExists(tagMap, tagName);
      const associatedList = this.findListByName(radarrLists, list.name);

      if (!associatedList) {
        throw new Error(
          `Import list "${list.name}" not found in Radarr. This should not happen.`,
        );
      }

      await this.ensureListHasTag(associatedList, tagId);
    }
  }

  private createTagMap(radarrTags: Array<RadarrTag>) {
    return new Map(radarrTags.map(tag => [tag.label, tag]));
  }

  private findListByName(lists: Array<RadarrImportList>, name: string) {
    const normalizedName = this.normalizeString(name);
    return lists.find(
      list => this.normalizeString(list.name) === normalizedName,
    );
  }

  private async ensureTagExists(
    tagMap: Map<string, RadarrTag>,
    tagName: string,
  ) {
    const existingTag = tagMap.get(tagName);
    if (existingTag) return existingTag.id;

    const createdTag = await this.radarrService.postTag({ label: tagName });
    tagMap.set(tagName, createdTag);

    return createdTag.id;
  }

  private async ensureListHasTag(
    associatedList: RadarrImportList,
    tagId: number,
  ) {
    if (associatedList.tags.includes(tagId)) return;

    await this.radarrService.putImportList(associatedList.id, {
      ...associatedList,
      tags: [...associatedList.tags, tagId],
    });
  }

  private normalizeString(input: string) {
    return input.toLowerCase().trim();
  }

  private calculateTagName(listName: string) {
    const hash = createHash('sha256')
      .update(this.normalizeString(listName))
      .digest('hex')
      .slice(0, 8);

    return `roombarr-${hash}`;
  }
}
