export interface AssetMetadata {
  url: string;
  attribution: string;
  sourceUrl: string;
  license?: string;
}

export const CARD_ASSETS: Record<string, AssetMetadata> = {
  "gojo-satoru-base": {
    url: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1000&auto=format&fit=crop",
    attribution: "Unsplash / Anime Style Concept",
    sourceUrl: "https://unsplash.com/photos/anime-character-concept",
  },
  "sukuna-base": {
    url: "https://images.unsplash.com/photo-1578632738981-4330ce5b5104?q=80&w=1000&auto=format&fit=crop",
    attribution: "Unsplash / Dark Fantasy Art",
    sourceUrl: "https://unsplash.com/photos/dark-fantasy-character",
  },
  // Fallback for missing assets
  "default": {
    url: "/placeholder.svg",
    attribution: "System Placeholder",
    sourceUrl: "#",
  }
};

export const getCardAsset = (cardId: string): AssetMetadata => {
  return CARD_ASSETS[cardId] || CARD_ASSETS["default"];
};