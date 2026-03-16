import { describe, expect, it } from 'vitest';

import manifest from './card-art-manifest.json';
import { CARD_ASSETS, getCardAsset } from './assets';

const firstManifestEntry = manifest[0];

describe('getCardAsset', () => {
  it('returns the exact asset for a direct card ID match', () => {
    const cardId = firstManifestEntry.cardId;

    const asset = getCardAsset(cardId);

    expect(asset.attribution).toBe(CARD_ASSETS[cardId].attribution);
    expect(asset.url).toContain(CARD_ASSETS[cardId].url);
  });

  it('resolves a normalized card ID to the same asset entry', () => {
    const cardId = firstManifestEntry.cardId;
    const normalizedCardId = cardId.replace(/-/g, '');

    const asset = getCardAsset(normalizedCardId, 'Any Variant');

    expect(asset.url).toContain(CARD_ASSETS[cardId].url);
  });

  it('falls back to the default asset for unknown card IDs', () => {
    const asset = getCardAsset('unknown-card-id-123');

    expect(asset.attribution).toBe(CARD_ASSETS.default.attribution);
    expect(asset.url).toContain('/placeholder.svg');
  });
});
