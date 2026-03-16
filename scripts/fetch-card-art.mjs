#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const cardsPath = path.join(projectRoot, 'src/data/cards.json');
const manifestPath = path.join(projectRoot, 'src/data/card-art-manifest.json');
const publicDir = path.join(projectRoot, 'public');
const placeholderPath = path.join(publicDir, 'placeholder.svg');

const timestamp = new Date().toISOString();
const argv = new Set(process.argv.slice(2));
const shouldRefresh = argv.has('--refresh');
const shouldWriteFiles = !argv.has('--dry-run');
const shouldMaterialize = argv.has('--materialize');

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const normalizeLookupKey = ({ id, name, variant }) => `${slugify(id)}__${slugify(name)}__${slugify(variant || 'default')}`;
const deterministicOutputPath = (cardId) => `/images/${cardId}/${cardId}.svg`;

const exists = async (target) => {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
};

const localPlaceholderProvider = {
  name: 'local-placeholder',
  async search({ card, outputPath }) {
    return [`local-placeholder://${card.id}?target=${encodeURIComponent(outputPath)}`];
  },
  async download(_url, destinationAbsolutePath) {
    await fs.mkdir(path.dirname(destinationAbsolutePath), { recursive: true });
    await fs.copyFile(placeholderPath, destinationAbsolutePath);
    return { localPath: destinationAbsolutePath };
  },
  async extractAttribution(url) {
    return {
      provider: this.name,
      sourceUrl: url,
      license: 'CC0-1.0 (project-owned placeholder)',
      attribution: 'JJK Card Game Placeholder Art Pipeline',
    };
  },
};

const cards = JSON.parse(await fs.readFile(cardsPath, 'utf8'));
const existingManifest = await (await exists(manifestPath)) ? JSON.parse(await fs.readFile(manifestPath, 'utf8')) : [];
const existingByCardId = new Map(existingManifest.map((entry) => [entry.cardId, entry]));

const manifest = [];
for (const card of cards) {
  const normalizedKey = normalizeLookupKey(card);
  const outputPath = deterministicOutputPath(card.id);
  const outputAbsolutePath = path.join(publicDir, outputPath.replace(/^\//, ''));
  const outputExists = await exists(outputAbsolutePath);
  const existingEntry = existingByCardId.get(card.id);

  if (existingEntry && !shouldRefresh && (outputExists || existingEntry.localPath === '/placeholder.svg')) {
    manifest.push({ ...existingEntry, normalizedKey });
    continue;
  }

  if (outputExists) {
    manifest.push({
      cardId: card.id,
      normalizedKey,
      localPath: outputPath,
      attribution: 'JJK Card Game Local Asset',
      sourceUrl: `local://public${outputPath}`,
      license: 'Project Internal',
      provider: 'local-existing',
      fetchedAt: timestamp,
    });
    continue;
  }

  const candidates = await localPlaceholderProvider.search({ card, normalizedKey, outputPath });
  const sourceUrl = candidates[0];
  const metadata = await localPlaceholderProvider.extractAttribution(sourceUrl, card);

  if (shouldMaterialize && shouldWriteFiles) {
    await localPlaceholderProvider.download(sourceUrl, outputAbsolutePath);
  }

  manifest.push({
    cardId: card.id,
    normalizedKey,
    localPath: shouldMaterialize ? outputPath : '/placeholder.svg',
    attribution: metadata.attribution,
    sourceUrl: metadata.sourceUrl,
    license: metadata.license,
    provider: metadata.provider,
    fetchedAt: timestamp,
  });
}

manifest.sort((a, b) => a.cardId.localeCompare(b.cardId));
if (shouldWriteFiles) {
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

console.log(`Prepared manifest entries: ${manifest.length}`);
