import { describe, expect, it } from 'vitest';

import { CARD_ASSETS, getCardAsset } from './assets';

describe('getCardAsset', () => {
  it('returns the exact asset for a direct card ID match', () => {
    const cardId = 'fushiguro-megumi';

    const asset = getCardAsset(cardId);

    expect(asset.attribution).toBe(CARD_ASSETS[cardId].attribution);
    expect(asset.url).toContain('/images/fushiguro-megumi/Megumi_Child.webp');
  });

  it('returns a variant URL when card ID matches a normalized base key', () => {
    const asset = getCardAsset('fushiguromegumi-child', 'Adult');

    expect(asset.url).toContain('/images/fushiguro-megumi/Megumi_Adult.webp');
  });

  it('falls back to the default asset for unknown card IDs', () => {
    const asset = getCardAsset('unknown-card-id-123');

    expect(asset.attribution).toBe(CARD_ASSETS.default.attribution);
    expect(asset.url).toContain('/placeholder.svg');
  });
});
