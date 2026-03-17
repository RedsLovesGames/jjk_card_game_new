import { promises as fs } from 'node:fs';
import path from 'node:path';

export const createLocalPlaceholderProvider = ({ placeholderPath }) => ({
  name: 'local-placeholder',
  async search({ card }) {
    return [{
      provider: 'local-placeholder',
      sourceUrl: `local-placeholder://${card.id}`,
      assetUrl: `local-placeholder://${card.id}`,
      attribution: 'JJK Card Game Placeholder Art Pipeline',
      license: 'CC0-1.0 (project-owned placeholder)',
    }];
  },
  async download(_candidate, destinationAbsolutePath) {
    await fs.mkdir(path.dirname(destinationAbsolutePath), { recursive: true });
    await fs.copyFile(placeholderPath, destinationAbsolutePath);
    return destinationAbsolutePath;
  },
});
