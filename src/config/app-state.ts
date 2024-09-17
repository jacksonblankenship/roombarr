import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { parse, stringify } from 'superjson';
import { CONFIG_DIR, STATE_FILE } from './constants';
import { z } from 'zod';
import { existsSync } from 'fs';
import { radarrMovieSchema } from '../services/radarr/schema';

const snapshotSchema = z.array(radarrMovieSchema);

type Snapshot = z.infer<typeof snapshotSchema>;

const pendingRemovalSchema = z.object({
  removalDate: z.date(),
  notificationDate: z.date(),
  movie: radarrMovieSchema,
});

type PendingRemoval = z.infer<typeof pendingRemovalSchema>;

const appStateSchema = z.object({
  lastSnapshot: snapshotSchema,
  pendingRemovals: z.array(pendingRemovalSchema),
});

type AppState = z.infer<typeof appStateSchema>;

export class AppStateManager {
  private filePath: string;

  private lastSnapshot: Snapshot = [];
  private pendingRemovals: Array<PendingRemoval> = [];

  constructor() {
    this.filePath = join(CONFIG_DIR, STATE_FILE);
  }

  public async init(): Promise<void> {
    if (!existsSync(this.filePath)) {
      // If the file doesn't exist, create it with an initial state
      await this.saveState(); // This will create an empty snapshot and pending removals
    } else {
      // Otherwise, read the existing file
      const data = await readFile(this.filePath, 'utf-8');
      const json = parse(data);
      const parsedState = appStateSchema.parse(json);

      this.lastSnapshot = parsedState.lastSnapshot;
      this.pendingRemovals = parsedState.pendingRemovals;
    }
  }

  private async saveState() {
    await writeFile(
      this.filePath,
      stringify({
        lastSnapshot: this.lastSnapshot,
        pendingRemovals: this.pendingRemovals,
      } satisfies AppState),
    );
  }

  public getLastSnapshot() {
    return this.lastSnapshot;
  }

  public async recordSnapshot(snapshot: Snapshot) {
    this.lastSnapshot = snapshotSchema.parse(snapshot);
    await this.saveState();
  }

  public getPendingRemovals() {
    return this.pendingRemovals;
  }

  public async schedulePendingRemoval(pendingRemoval: PendingRemoval) {
    this.pendingRemovals = [
      ...this.pendingRemovals,
      pendingRemovalSchema.parse(pendingRemoval),
    ];

    await this.saveState();
  }

  public async cancelPendingRemoval(pendingRemoval: PendingRemoval) {
    this.pendingRemovals = this.pendingRemovals.filter(
      ({ movie }) => pendingRemoval.movie.id !== movie.id,
    );

    await this.saveState();
  }
}
