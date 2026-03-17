import cardArtManifest from './card-art-manifest.json';

export interface AssetMetadata {
  url: string;
  attribution: string;
  sourceUrl: string;
  license?: string;
  provider?: string;
  fetchedAt?: string;
}

interface CardArtManifestEntry {
  cardId: string;
  localPathOriginal?: string;
  localPathCard?: string;
  localPath?: string;
  width?: number;
  height?: number;
  format?: string;
  attribution: string;
  sourceUrl: string;
  license?: string;
  provider: string;
  fetchedAt: string;
}

const resolvePublicAssetUrl = (assetPath: string): string => {
  if (/^https?:\/\//.test(assetPath) || !assetPath.startsWith('/')) {
    return assetPath;
  }

  const basePath = import.meta.env.BASE_URL ?? '/';
  const normalizedBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`;

  return `${normalizedBasePath}${assetPath.slice(1)}`;
};

export const getRarityBackground = (rarity: string): string => {
  switch (rarity) {
    case 'SSR': return '#FFD700';
    case 'SR': return '#9B59B6';
    case 'R': return '#3498DB';
    default: return '#7F8C8D';
  }
};

export const getCardBackground = (_cardId: string, rarity: string): string => {
  return getRarityBackground(rarity);
};

const buildCardAssetsFromManifest = (manifest: CardArtManifestEntry[]): Record<string, AssetMetadata> => {
  const entries = manifest.map((entry) => ([entry.cardId, {
    url: entry.localPathCard ?? entry.localPath ?? '/placeholder.svg',
    attribution: entry.attribution,
    sourceUrl: entry.sourceUrl,
    license: entry.license,
    provider: entry.provider,
    fetchedAt: entry.fetchedAt,
  }]));

  return Object.fromEntries(entries);
};

export const CARD_ASSETS: Record<string, AssetMetadata> = {
  ...buildCardAssetsFromManifest(cardArtManifest as CardArtManifestEntry[]),
  default: {
    url: '/placeholder.svg',
    attribution: 'System Fallback Asset',
    sourceUrl: 'local://public/placeholder.svg',
    license: 'Project Internal',
    provider: 'fallback',
    fetchedAt: 'n/a',
  },
};

const normalize = (value: string): string => value.replace(/[^a-z0-9]/gi, '').toLowerCase();
const CARD_ASSETS_BY_NORMALIZED_KEY = new Map(
  Object.entries(CARD_ASSETS)
    .filter(([key]) => key !== 'default')
    .map(([key, asset]) => [normalize(key), asset]),
);

export const getCardAsset = (cardId: string, _variant?: string): AssetMetadata => {
  const direct = CARD_ASSETS[cardId];
  if (direct) {
    return { ...direct, url: resolvePublicAssetUrl(direct.url) };
  }

  const normalized = CARD_ASSETS_BY_NORMALIZED_KEY.get(normalize(cardId));
  if (normalized) {
    return { ...normalized, url: resolvePublicAssetUrl(normalized.url) };
  }

  const fallback = CARD_ASSETS.default;
  return { ...fallback, url: resolvePublicAssetUrl(fallback.url) };
};
