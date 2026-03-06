export interface AssetMetadata {
  url: string;
  attribution: string;
  sourceUrl: string;
  license?: string;
}

export const CARD_ASSETS: Record<string, AssetMetadata> = {
  // Main characters from Fandom Wiki (IDs match cards.json - includes -base suffix)
  "gojo-satoru-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/e/ef/Satoru_Gojo_%28Anime_2%29.png/revision/latest/scale-to-width-down/306?cb=20250726003655",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Satoru_Gojo",
  },
  "sukuna-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/7/74/Sukuna_%28Volume_29%29.png/revision/latest/scale-to-width-down/326?cb=20250726003512",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Sukuna",
  },
  "nanami-kento-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/b/b0/Kento_Nanami_%28Anime%29.png/revision/latest/scale-to-width-down/362?cb=20240618014214",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Kento_Nanami",
  },
  "nobara-kugisaki-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/d/dd/Nobara_Kugisaki_%28Anime_2%29.png/revision/latest/scale-to-width-down/250?cb=20240621133809",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Nobara_Kugisaki",
  },
  "megumi-fushiguro-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/6/6e/Megumi_Fushiguro_%28Anime_4%29.png/revision/latest/scale-to-width-down/432?cb=20251230155327",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Megumi_Fushiguro",
  },
  "yuji-itadori-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/3/35/Yuji_Itadori_%28Anime_4%29.png/revision/latest/scale-to-width-down/364?cb=20251230155050",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori",
  },
  "mahito-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/4/4e/Mahito_%28Anime%29.png/revision/latest/scale-to-width-down/416?cb=20240618013419",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Mahito",
  },
  "jogo-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/2/29/Jogo_%28Anime%29.png/revision/latest/scale-to-width-down/360?cb=20210109005534",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Jogo",
  },
  "hanami-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/7/76/Hanami_%28Anime%29.png/revision/latest/scale-to-width-down/362?cb=20210318193331",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Hanami",
  },
  "choso-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/c/c6/Choso_%28Anime_3%29.png/revision/latest/scale-to-width-down/396?cb=20251230164541",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Choso",
  },
  "maki-zenin-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/2/2c/Maki_Zen%27in_%28Anime_4%29.png/revision/latest/scale-to-width-down/402?cb=20251230144642",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Maki_Zenin",
  },
  "todo-aoi-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/9/9d/Aoi_Todo_%28Anime%29.png/revision/latest/scale-to-width-down/350?cb=20210831121027",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Aoi_Todo",
  },
  "ino-takuma-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/4/49/Takuma_Ino_%28Anime%29.png/revision/latest/scale-to-width-down/350?cb=20220329140254",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Takuma_Ino",
  },
  "yuta-okkotsu-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/e/e6/Yuta_Okkotsu_%28Anime_2%29.png/revision/latest/scale-to-width-down/324?cb=20251230155621",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Yuta_Okkotsu",
  },
  "geto-suguru-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/8/86/Suguru_Geto_%28Anime%29.png/revision/latest/scale-to-width-down/350?cb=20210215095345",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Suguru_Geto",
  },
  "toji-fushiguro-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/d/db/Toji_Fushiguro_%28Anime%29.png/revision/latest/scale-to-width-down/350?cb=20250726005401",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Toji_Fushiguro",
  },
  // Variant characters - use base images
  "kento-nanami-grade-1-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/b/b0/Kento_Nanami_%28Anime%29.png/revision/latest/scale-to-width-down/362?cb=20240618014214",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Kento_Nanami",
  },
  "nobara-kugisaki-resolute-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/d/dd/Nobara_Kugisaki_%28Anime_2%29.png/revision/latest/scale-to-width-down/250?cb=20240621133809",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Nobara_Kugisaki",
  },
  "megumi-fushiguro-shadow-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/6/6e/Megumi_Fushiguro_%28Anime_4%29.png/revision/latest/scale-to-width-down/432?cb=20251230155327",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Megumi_Fushiguro",
  },
  "yuji-itadori-determined-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/3/35/Yuji_Itadori_%28Anime_4%29.png/revision/latest/scale-to-width-down/364?cb=20251230155050",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori",
  },
  "mahito-curse-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/4/4e/Mahito_%28Anime%29.png/revision/latest/scale-to-width-down/416?cb=20240618013419",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Mahito",
  },
  "jogo-flame-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/2/29/Jogo_%28Anime%29.png/revision/latest/scale-to-width-down/360?cb=20210109005534",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Jogo",
  },
  "hanami-nature-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/7/76/Hanami_%28Anime%29.png/revision/latest/scale-to-width-down/362?cb=20210318193331",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Hanami",
  },
  "choso-blood-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/c/c6/Choso_%28Anime_3%29.png/revision/latest/scale-to-width-down/396?cb=20251230164541",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Choso",
  },
  "maki-zenin-blade-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/2/2c/Maki_Zen%27in_%28Anime_4%29.png/revision/latest/scale-to-width-down/402?cb=20251230144642",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Maki_Zenin",
  },
  "todo-aoi-flash-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/9/9d/Aoi_Todo_%28Anime%29.png/revision/latest/scale-to-width-down/350?cb=20210831121027",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Aoi_Todo",
  },
  "ino-takuma-speech-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/4/49/Takuma_Ino_%28Anime%29.png/revision/latest/scale-to-width-down/350?cb=20220329140254",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Takuma_Ino",
  },
  "yuta-okkotsu-bound-base": {
    url: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/e/e6/Yuta_Okkotsu_%28Anime_2%29.png/revision/latest/scale-to-width-down/324?cb=20251230155621",
    attribution: "Jujutsu Kaisen Wiki (Fandom)",
    sourceUrl: "https://jujutsu-kaisen.fandom.com/wiki/Yuta_Okkotsu",
  },
  // Spells and Areas
  "shibuya-incident": {
    url: "/placeholder.svg",
    attribution: "System Placeholder",
    sourceUrl: "#",
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
