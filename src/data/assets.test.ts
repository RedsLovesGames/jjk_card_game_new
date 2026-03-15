import { CARD_ASSETS, getCardAsset } from './assets';

describe('asset metadata', () => {
  it('uses static file paths instead of inline data URLs', () => {
    for (const asset of Object.values(CARD_ASSETS)) {
      expect(asset.url.startsWith('data:')).toBe(false);
    }
  });

  it('resolves public URLs to absolute URLs', () => {
    const asset = getCardAsset('akari-nitta');

    expect(asset.url).toBe(`${window.location.origin}/images/akari-nitta/akari-nitta.svg`);
  });

  it('resolves variant asset URLs with public image paths', () => {
    const asset = getCardAsset('fushiguromegumi-child', 'child');

    expect(asset.url).toBe(`${window.location.origin}/images/fushiguro-megumi/Megumi_child.webp`);
  });
});
