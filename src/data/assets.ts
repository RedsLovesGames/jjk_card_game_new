export interface AssetMetadata {
  url: string;
  attribution: string;
  sourceUrl: string;
  license?: string;
}

export const CARD_ASSETS: Record<string, AssetMetadata> = {
  "fushiguro-megumi": { url: "/images/fushiguro-megumi.svg", attribution: "Placeholder", sourceUrl: "#" },
  "akari-nitta": { url: "/images/akari-nitta.svg", attribution: "Placeholder", sourceUrl: "#" },
  "kiyotaka-ijichi": { url: "/images/kiyotaka-ijichi.svg", attribution: "Placeholder", sourceUrl: "#" },
  "panda": { url: "/images/panda.svg", attribution: "Placeholder", sourceUrl: "#" },
  "shoko-ieiri": { url: "/images/shoko-ieiri.svg", attribution: "Placeholder", sourceUrl: "#" },
  "kasumi-miwa": { url: "/images/kasumi-miwa.svg", attribution: "Placeholder", sourceUrl: "#" },
  "rin-amai": { url: "/images/rin-amai.svg", attribution: "Placeholder", sourceUrl: "#" },
  "toge-inumaki": { url: "/images/toge-inumaki.svg", attribution: "Placeholder", sourceUrl: "#" },
  "kokichi-muta": { url: "/images/kokichi-muta.svg", attribution: "Placeholder", sourceUrl: "#" },
  "tsumiki-fushiguro": { url: "/images/tsumiki-fushiguro.svg", attribution: "Placeholder", sourceUrl: "#" },
  "fumihiko-takaba": { url: "/images/fumihiko-takaba.svg", attribution: "Placeholder", sourceUrl: "#" },
  "hiromi-higuruma": { url: "/images/hiromi-higuruma.svg", attribution: "Placeholder", sourceUrl: "#" },
  "kirara-hoshi": { url: "/images/kirara-hoshi.svg", attribution: "Placeholder", sourceUrl: "#" },
  "momo-nishimiya": { url: "/images/momo-nishimiya.svg", attribution: "Placeholder", sourceUrl: "#" },
  "masamichi-yaga": { url: "/images/masamichi-yaga.svg", attribution: "Placeholder", sourceUrl: "#" },
  "noritoshi-kamo": { url: "/images/noritoshi-kamo.svg", attribution: "Placeholder", sourceUrl: "#" },
  "mai-zenin": { url: "/images/mai-zenin.svg", attribution: "Placeholder", sourceUrl: "#" },
  "maki-zenin": { url: "/images/maki-zenin.svg", attribution: "Placeholder", sourceUrl: "#" },
  "takuma-ino": { url: "/images/takuma-ino.svg", attribution: "Placeholder", sourceUrl: "#" },
  "yoshinobu-gakuganji": { url: "/images/yoshinobu-gakuganji.svg", attribution: "Placeholder", sourceUrl: "#" },
  "haba": { url: "/images/haba.svg", attribution: "Placeholder", sourceUrl: "#" },
  "kinji-hakari": { url: "/images/kinji-hakari.svg", attribution: "Placeholder", sourceUrl: "#" },
  "suguru-geto": { url: "/images/suguru-geto.svg", attribution: "Placeholder", sourceUrl: "#" },
  "aoi-todo": { url: "/images/aoi-todo.svg", attribution: "Placeholder", sourceUrl: "#" },
  "mei-mei": { url: "/images/mei-mei.svg", attribution: "Placeholder", sourceUrl: "#" },
  "hana-kurusu": { url: "/images/hana-kurusu.svg", attribution: "Placeholder", sourceUrl: "#" },
  "takako-uro": { url: "/images/takako-uro.svg", attribution: "Placeholder", sourceUrl: "#" },
  "naoya-zenin": { url: "/images/naoya-zenin.svg", attribution: "Placeholder", sourceUrl: "#" },
  "kento-nanami": { url: "/images/kento-nanami.svg", attribution: "Placeholder", sourceUrl: "#" },
  "yuta-okkotsu": { url: "/images/yuta-okkotsu.svg", attribution: "Placeholder", sourceUrl: "#" },
  "kenjaku": { url: "/images/kenjaku.svg", attribution: "Placeholder", sourceUrl: "#" },
  "gojo-satoru": { url: "/images/gojo-satoru.svg", attribution: "Placeholder", sourceUrl: "#" },
  "ryomen-sukuna": { url: "/images/ryomen-sukuna.svg", attribution: "Placeholder", sourceUrl: "#" },
  "ryu-ishori": { url: "/images/ryu-ishori.svg", attribution: "Placeholder", sourceUrl: "#" },
  "hajime-kashimo": { url: "/images/hajime-kashimo.svg", attribution: "Placeholder", sourceUrl: "#" },
  "naobito-zenin": { url: "/images/naobito-zenin.svg", attribution: "Placeholder", sourceUrl: "#" },
  "yuki-tsukumo": { url: "/images/yuki-tsukumo.svg", attribution: "Placeholder", sourceUrl: "#" },
  "master-tengen": { url: "/images/master-tengen.svg", attribution: "Placeholder", sourceUrl: "#" },
  "default": { url: "/placeholder.svg", attribution: "System Placeholder", sourceUrl: "#" }
};

export const getCardAsset = (cardId: string): AssetMetadata => {
  if (CARD_ASSETS[cardId]) return CARD_ASSETS[cardId];
  const cardIdLower = cardId.toLowerCase();
  for (const baseKey of Object.keys(CARD_ASSETS)) {
    if (baseKey === 'default') continue;
    if (cardIdLower.startsWith(baseKey + '-')) {
      return CARD_ASSETS[baseKey];
    }
  }
  return CARD_ASSETS["default"];
};
