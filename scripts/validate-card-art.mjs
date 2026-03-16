#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

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

  const localPath = path.join(publicDir, entry.localPath.replace(/^\//, ''));
  try {
    await fs.access(localPath);
  } catch {
    fail(`Missing local art file for card ${card.id}: ${entry.localPath}`);
  }

  if (placeholders.has(normalize(entry.attribution))) {
    fail(`Invalid attribution for card ${card.id}: ${entry.attribution}`);
  }

  if (placeholders.has(normalize(entry.sourceUrl))) {
    fail(`Invalid sourceUrl for card ${card.id}: ${entry.sourceUrl}`);
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log(`Card art validation passed for ${cards.length} cards.`);
