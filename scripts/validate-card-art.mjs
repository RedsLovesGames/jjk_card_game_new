#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

import config from './art-sources.config.json' with { type: 'json' };
import { detectImageMetadata, normalizeLookupKey } from './art-providers/utils.mjs';

const root = process.cwd();
const cardsPath = path.join(root, 'src/data/cards.json');
const manifestPath = path.join(root, 'src/data/card-art-manifest.json');
const publicDir = path.join(root, 'public');

const placeholders = new Set(['', '#', 'placeholder', 'todo', 'tbd', 'n/a']);
const normalize = (value) => String(value ?? '').trim().toLowerCase();

const fail = (message) => {
  console.error(message);
  process.exitCode = 1;
};

const cards = JSON.parse(await fs.readFile(cardsPath, 'utf8'));
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const manifestByCardId = new Map(manifest.map((entry) => [entry.cardId, entry]));

for (const card of cards) {
  const entry = manifestByCardId.get(card.id);
  if (!entry) {
    fail(`Missing manifest entry for card: ${card.id}`);
    continue;
  }

  const expectedKey = normalizeLookupKey(card);
  if (entry.normalizedKey !== expectedKey) {
    fail(`Invalid normalizedKey for ${card.id}. Expected ${expectedKey}, got ${entry.normalizedKey}`);
  }

  const requiredFields = ['sourceUrl', 'license', 'attribution', 'localPathOriginal', 'localPathCard', 'provider', 'fetchedAt', 'format', 'width', 'height'];
  for (const field of requiredFields) {
    if (!String(entry[field] ?? '').trim()) {
      fail(`Missing required field '${field}' for card ${card.id}`);
    }
  }

  if (entry.provider === 'local-placeholder' || normalize(entry.localPathCard) === '/placeholder.svg') {
    fail(`Card ${card.id} still uses placeholder art provider/path.`);
    continue;
  }

  const originalPath = path.join(publicDir, entry.localPathOriginal.replace(/^\//, ''));
  const cardPath = path.join(publicDir, entry.localPathCard.replace(/^\//, ''));

  for (const [label, targetPath] of [['original', originalPath], ['card', cardPath]]) {
    try {
      await fs.access(targetPath);
    } catch {
      fail(`Missing ${label} art file for card ${card.id}: ${targetPath}`);
    }
  }

  if (placeholders.has(normalize(entry.attribution))) {
    fail(`Invalid attribution for card ${card.id}: ${entry.attribution}`);
  }

  if (placeholders.has(normalize(entry.sourceUrl))) {
    fail(`Invalid sourceUrl for card ${card.id}: ${entry.sourceUrl}`);
  }

  const metadata = await detectImageMetadata(cardPath);
  if (metadata.width !== config.target.width || metadata.height !== config.target.height) {
    fail(`Invalid derivative size for card ${card.id}: ${metadata.width}x${metadata.height}`);
  }
  if (normalize(metadata.format) !== normalize(config.target.format) || normalize(entry.format) !== normalize(config.target.format)) {
    fail(`Invalid derivative format for card ${card.id}: ${metadata.format}`);
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log(`Card art validation passed for ${cards.length} cards.`);
