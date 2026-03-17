#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { createLocalPlaceholderProvider } from './art-providers/local-placeholder.mjs';
import { createWikimediaCommonsProvider } from './art-providers/wikimedia-commons.mjs';
import {
  normalizeLookupKey,
  ensureRequiredAttribution,
  createCardDerivativeFromUrl,
  detectImageMetadata,
} from './art-providers/utils.mjs';

const projectRoot = process.cwd();
const cardsPath = path.join(projectRoot, 'src/data/cards.json');
const manifestPath = path.join(projectRoot, 'src/data/card-art-manifest.json');
const publicDir = path.join(projectRoot, 'public');
const placeholderPath = path.join(publicDir, 'placeholder.svg');
const configPath = path.join(projectRoot, 'scripts/art-sources.config.json');

const timestamp = new Date().toISOString();
const argv = new Set(process.argv.slice(2));
const shouldRefresh = argv.has('--refresh');
const shouldWriteFiles = !argv.has('--dry-run');

const exists = async (target) => {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
};

const buildProviderRegistry = (config) => {
  const providers = {
    'wikimedia-commons': createWikimediaCommonsProvider({ userAgent: config.providers.find((p) => p.id === 'wikimedia-commons')?.userAgent }),
    'local-placeholder': createLocalPlaceholderProvider({ placeholderPath }),
  };

  const enabledProviders = config.providers
    .filter((provider) => provider.enabled)
    .map((provider) => ({ ...provider, adapter: providers[provider.id] }))
    .filter((provider) => provider.adapter);

  const fallbackProvider = enabledProviders.find((provider) => provider.fallback);
  return { enabledProviders, fallbackProvider };
};

const cards = JSON.parse(await fs.readFile(cardsPath, 'utf8'));
const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
const existingManifest = await exists(manifestPath) ? JSON.parse(await fs.readFile(manifestPath, 'utf8')) : [];
const existingByCardId = new Map(existingManifest.map((entry) => [entry.cardId, entry]));
const { enabledProviders, fallbackProvider } = buildProviderRegistry(config);

if (!fallbackProvider || fallbackProvider.id !== 'local-placeholder') {
  throw new Error('Policy violation: local-placeholder must be the only fallback provider.');
}

const manifest = [];
for (const card of cards) {
  const normalizedKey = normalizeLookupKey(card);
  const rawDirPath = `/images/raw/${card.id}`;
  const rawFilename = `${card.id}-original`;
  const cardPath = `/images/cards/${card.id}/${card.id}.png`;
  const rawAbsoluteDir = path.join(publicDir, rawDirPath.replace(/^\//, ''));
  const derivativeAbsolutePath = path.join(publicDir, cardPath.replace(/^\//, ''));
  const existingEntry = existingByCardId.get(card.id);

  if (existingEntry && !shouldRefresh && await exists(path.join(publicDir, existingEntry.localPathCard?.replace(/^\//, '') ?? ''))) {
    ensureRequiredAttribution(existingEntry, ['sourceUrl', 'license', 'attribution'], existingEntry.provider ?? 'manifest', card.id);
    manifest.push({ ...existingEntry, normalizedKey });
    continue;
  }

  let chosen = null;
  let providerPolicy = null;
  for (const provider of enabledProviders.filter((item) => !item.fallback)) {
    const candidates = await provider.adapter.search({ card, normalizedKey });
    if (candidates.length > 0) {
      chosen = candidates[0];
      providerPolicy = provider;
      break;
    }
  }

  if (!chosen) {
    providerPolicy = fallbackProvider;
    [chosen] = await fallbackProvider.adapter.search({ card, normalizedKey });
  }

  ensureRequiredAttribution(chosen, providerPolicy.licenseRequirements, providerPolicy.id, card.id);

  const extension = chosen.assetUrl?.match(/\.(png|jpe?g|webp)(?:\?|$)/i)?.[1] ?? 'svg';
  const originalRelativePath = `${rawDirPath}/${rawFilename}.${extension.toLowerCase().replace('jpeg', 'jpg')}`;
  const originalAbsolutePath = path.join(publicDir, originalRelativePath.replace(/^\//, ''));

  if (shouldWriteFiles) {
    await fs.mkdir(rawAbsoluteDir, { recursive: true });
    await providerPolicy.adapter.download(chosen, originalAbsolutePath);

    if (providerPolicy.id === 'local-placeholder') {
      await fs.mkdir(path.dirname(derivativeAbsolutePath), { recursive: true });
      await fs.copyFile(placeholderPath, derivativeAbsolutePath);
    } else {
      await createCardDerivativeFromUrl({
        sourceUrl: chosen.assetUrl,
        destinationPath: derivativeAbsolutePath,
        width: config.target.width,
        height: config.target.height,
        userAgent: providerPolicy.userAgent,
      });
    }
  }

  const derivativeMeta = (shouldWriteFiles && providerPolicy.id !== 'local-placeholder')
    ? await detectImageMetadata(derivativeAbsolutePath)
    : { width: config.target.width, height: config.target.height, format: config.target.format };

  manifest.push({
    cardId: card.id,
    normalizedKey,
    localPathOriginal: originalRelativePath,
    localPathCard: providerPolicy.id === 'local-placeholder' ? '/placeholder.svg' : cardPath,
    width: derivativeMeta.width,
    height: derivativeMeta.height,
    format: derivativeMeta.format,
    attribution: chosen.attribution,
    sourceUrl: chosen.sourceUrl,
    license: chosen.license,
    provider: providerPolicy.id,
    fetchedAt: timestamp,
  });
}

manifest.sort((a, b) => a.cardId.localeCompare(b.cardId));
if (shouldWriteFiles) {
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

console.log(`Prepared manifest entries: ${manifest.length}`);
