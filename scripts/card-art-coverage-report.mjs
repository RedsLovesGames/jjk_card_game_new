#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const cardsPath = path.join(root, 'src/data/cards.json');
const manifestPath = path.join(root, 'src/data/card-art-manifest.json');

const cards = JSON.parse(await fs.readFile(cardsPath, 'utf8'));
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const manifestByCardId = new Map(manifest.map((entry) => [entry.cardId, entry]));

const unresolved = cards
  .filter((card) => {
    const entry = manifestByCardId.get(card.id);
    return !entry || entry.provider === 'local-placeholder' || entry.localPathCard === '/placeholder.svg';
  })
  .map((card) => `${card.id}|${card.variant || 'default'}`);

console.log(`Resolved: ${cards.length - unresolved.length}/${cards.length}`);
if (unresolved.length > 0) {
  console.log('Unresolved cards:');
  unresolved.forEach((key) => console.log(` - ${key}`));
  process.exitCode = 1;
}
