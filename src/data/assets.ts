export interface AssetMetadata {
  url: string;
  attribution: string;
  sourceUrl: string;
  license?: string;
}

const getAppBaseUrl = (): string => {
  const basePath = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');

  if (typeof window !== 'undefined' && window.location.origin) {
    return `${window.location.origin}${basePath}`;
  }

  return basePath || '';
};

const resolvePublicAssetUrl = (assetPath: string): string => {
  if (!assetPath.startsWith('/')) {
    return assetPath;
  }

  return `${getAppBaseUrl()}${assetPath}`;
};

// Generate a background color based on card rarity
export const getRarityBackground = (rarity: string): string => {
  switch (rarity) {
    case 'SSR': return '#FFD700'; // Gold
    case 'SR': return '#9B59B6';  // Purple
    case 'R': return '#3498DB';    // Blue
    default: return '#7F8C8D';    // Gray for Common
  }
};

// Get background color for a card based on its rarity
export const getCardBackground = (cardId: string, rarity: string): string => {
  return getRarityBackground(rarity);
};

export const CARD_ASSETS: Record<string, AssetMetadata> = {
  // Remove duplicate fushiguro-megumi placeholder - keeping the real one with webp
  "akari-nitta": { url: "/images/akari-nitta/akari-nitta.svg", attribution: "Placeholder", sourceUrl: "#" },
  "kiyotaka-ijichi": { url: "/images/kiyotaka-ijichi/kiyotaka-ijichi.svg", attribution: "Placeholder", sourceUrl: "#" },
  "panda": { url: "/images/panda/panda.svg", attribution: "Placeholder", sourceUrl: "#" },
  "shoko-ieiri": { url: "/images/shoko-ieiri/shoko-ieiri.svg", attribution: "Placeholder", sourceUrl: "#" },
  "kasumi-miwa": { url: "/images/kasumi-miwa/kasumi-miwa.svg", attribution: "Placeholder", sourceUrl: "#" },
  "rin-amai": { url: "/images/rin-amai/rin-amai.svg", attribution: "Placeholder", sourceUrl: "#" },
  "toge-inumaki": { url: "/images/toge-inumaki/toge-inumaki.svg", attribution: "Placeholder", sourceUrl: "#" },
  "kokichi-muta": { url: "/images/kokichi-muta/kokichi-muta.svg", attribution: "Placeholder", sourceUrl: "#" },
  "tsumiki-fushiguro": { url: "/images/tsumiki-fushiguro/tsumiki-fushiguro.svg", attribution: "Placeholder", sourceUrl: "#" },
  "fumihiko-takaba": { url: "/images/fumihiko-takaba/fumihiko-takaba.svg", attribution: "Placeholder", sourceUrl: "#" },
  "hiromi-higuruma": { url: "/images/hiromi-higuruma/hiromi-higuruma.svg", attribution: "Placeholder", sourceUrl: "#" },
  "kirara-hoshi": { url: "/images/kirara-hoshi/kirara-hoshi.svg", attribution: "Placeholder", sourceUrl: "#" },
  "momo-nishimiya": { url: "/images/momo-nishimiya/momo-nishimiya.svg", attribution: "Placeholder", sourceUrl: "#" },
  "masamichi-yaga": { url: "/images/masamichi-yaga/masamichi-yaga.svg", attribution: "Placeholder", sourceUrl: "#" },
  "noritoshi-kamo": { url: "/images/noritoshi-kamo/noritoshi-kamo.svg", attribution: "Placeholder", sourceUrl: "#" },
  "mai-zenin": { url: "/images/mai-zenin/mai-zenin.svg", attribution: "Placeholder", sourceUrl: "#" },
  "maki-zenin": { url: "/images/maki-zenin/maki-zenin.svg", attribution: "Placeholder", sourceUrl: "#" },
  "takuma-ino": { url: "/images/takuma-ino/takuma-ino.svg", attribution: "Placeholder", sourceUrl: "#" },
  "yoshinobu-gakuganji": { url: "/images/yoshinobu-gakuganji/yoshinobu-gakuganji.svg", attribution: "Placeholder", sourceUrl: "#" },
  "haba": { url: "/images/haba/haba.svg", attribution: "Placeholder", sourceUrl: "#" },
  "kinji-hakari": { url: "/images/kinji-hakari/kinji-hakari.svg", attribution: "Placeholder", sourceUrl: "#" },
  "suguru-geto": { url: "/images/suguru-geto/suguru-geto.svg", attribution: "Placeholder", sourceUrl: "#" },
  "aoi-todo": { url: "/images/aoi-todo/aoi-todo.svg", attribution: "Placeholder", sourceUrl: "#" },
  "mei-mei": { url: "/images/mei-mei/mei-mei.svg", attribution: "Placeholder", sourceUrl: "#" },
  "hana-kurusu": { url: "/images/hana-kurusu/hana-kurusu.svg", attribution: "Placeholder", sourceUrl: "#" },
  "takako-uro": { url: "/images/takako-uro/takako-uro.svg", attribution: "Placeholder", sourceUrl: "#" },
  "naoya-zenin": { url: "/images/naoya-zenin/naoya-zenin.svg", attribution: "Placeholder", sourceUrl: "#" },
  "kento-nanami": { url: "/images/kento-nanami/kento-nanami.svg", attribution: "Placeholder", sourceUrl: "#" },
  "yuta-okkotsu": { url: "/images/yuta-okkotsu/yuta-okkotsu.svg", attribution: "Placeholder", sourceUrl: "#" },
  "fushiguro-megumi": { url: "/images/fushiguro-megumi/Megumi_Child.webp", attribution: "Local Image", sourceUrl: "#" },
  "kenjaku": { url: "/images/kenjaku/kenjaku.svg", attribution: "Placeholder", sourceUrl: "#" },
  "gojo-satoru": { url: "/images/gojo-satoru/gojo-satoru.svg", attribution: "Placeholder", sourceUrl: "#" },
  "ryomen-sukuna": { url: "/images/ryomen-sukuna/ryomen-sukuna.svg", attribution: "Placeholder", sourceUrl: "#" },
  "ryu-ishigori": { url: "/images/ryu-ishigori/ryu-ishigori.svg", attribution: "Placeholder", sourceUrl: "#" },
  "hajime-kashimo": { url: "/images/hajime-kashimo/hajime-kashimo.svg", attribution: "Placeholder", sourceUrl: "#" },
  "naobito-zenin": { url: "/images/naobito-zenin/naobito-zenin.svg", attribution: "Placeholder", sourceUrl: "#" },
  "yuki-tsukumo": { url: "/images/yuki-tsukumo/yuki-tsukumo.svg", attribution: "Placeholder", sourceUrl: "#" },
  "master-tengen": { url: "/images/master-tengen/master-tengen.svg", attribution: "Placeholder", sourceUrl: "#" },
  "cursed-speech-explode": { url: "/images/cursed-speech-explode/cursed-speech-explode.svg", attribution: "Generated", sourceUrl: "#" },
  "domain-expansion-infinite-void": { url: "/images/domain-expansion-infinite-void/domain-expansion-infinite-void.svg", attribution: "Generated", sourceUrl: "#" },
  "domain-expansion-malevolent-shrine": { url: "/images/domain-expansion-malevolent-shrine/domain-expansion-malevolent-shrine.svg", attribution: "Generated", sourceUrl: "#" },
  "black-flash": { url: "/images/black-flash/black-flash.svg", attribution: "Generated", sourceUrl: "#" },
  "reversal-red": { url: "/images/reversal-red/reversal-red.svg", attribution: "Generated", sourceUrl: "#" },
  "reversal-blue": { url: "/images/reversal-blue/reversal-blue.svg", attribution: "Generated", sourceUrl: "#" },
  "simple-domain": { url: "/images/simple-domain/simple-domain.svg", attribution: "Generated", sourceUrl: "#" },
  "maximum-meteor": { url: "/images/maximum-meteor/maximum-meteor.svg", attribution: "Generated", sourceUrl: "#" },
  "open-maximum-technique": { url: "/images/open-maximum-technique/open-maximum-technique.svg", attribution: "Generated", sourceUrl: "#" },
  "cursed-technique-lapse-electric": { url: "/images/cursed-technique-lapse-electric/cursed-technique-lapse-electric.svg", attribution: "Generated", sourceUrl: "#" },
  "cursed-technique-lapse-volcanic": { url: "/images/cursed-technique-lapse-volcanic/cursed-technique-lapse-volcanic.svg", attribution: "Generated", sourceUrl: "#" },
  "idle-transfiguration": { url: "/images/idle-transfiguration/idle-transfiguration.svg", attribution: "Generated", sourceUrl: "#" },
  "soul-recognition": { url: "/images/soul-recognition/soul-recognition.svg", attribution: "Generated", sourceUrl: "#" },
  "binding-vow-escape": { url: "/images/binding-vow-escape/binding-vow-escape.svg", attribution: "Generated", sourceUrl: "#" },
  "cursed-speech-stop": { url: "/images/cursed-speech-stop/cursed-speech-stop.svg", attribution: "Generated", sourceUrl: "#" },
  "feeding": { url: "/images/feeding/feeding.svg", attribution: "Generated", sourceUrl: "#" },
  "copy-technique": { url: "/images/copy-technique/copy-technique.svg", attribution: "Generated", sourceUrl: "#" },
  "wandering-cursed-spirit": { url: "/images/wandering-cursed-spirit/wandering-cursed-spirit.svg", attribution: "Generated", sourceUrl: "#" },
  "new-shadow-style-simple-domain": { url: "/images/new-shadow-style-simple-domain/new-shadow-style-simple-domain.svg", attribution: "Generated", sourceUrl: "#" },
  "blood-manipulation": { url: "/images/blood-manipulation/blood-manipulation.svg", attribution: "Generated", sourceUrl: "#" },
  "ratio-technique": { url: "/images/ratio-technique/ratio-technique.svg", attribution: "Generated", sourceUrl: "#" },
  "boogie-woogie": { url: "/images/boogie-woogie/boogie-woogie.svg", attribution: "Generated", sourceUrl: "#" },
  "jacobs-ladder": { url: "/images/jacobs-ladder/jacobs-ladder.svg", attribution: "Generated", sourceUrl: "#" },
  "chimera-shadow-garden": { url: "/images/chimera-shadow-garden/chimera-shadow-garden.svg", attribution: "Generated", sourceUrl: "#" },
  "rikas-power": { url: "/images/rikas-power/rikas-power.svg", attribution: "Generated", sourceUrl: "#" },
  "unlimited-void": { url: "/images/unlimited-void/unlimited-void.svg", attribution: "Generated", sourceUrl: "#" },
  "shibuya-incident": { url: "/images/shibuya-incident/shibuya-incident.svg", attribution: "Generated", sourceUrl: "#" },
  "tokyo-jujutsu-high": { url: "/images/tokyo-jujutsu-high/tokyo-jujutsu-high.svg", attribution: "Generated", sourceUrl: "#" },
  "kyoto-jujutsu-high": { url: "/images/kyoto-jujutsu-high/kyoto-jujutsu-high.svg", attribution: "Generated", sourceUrl: "#" },
  "cursed-warehouse": { url: "/images/cursed-warehouse/cursed-warehouse.svg", attribution: "Generated", sourceUrl: "#" },
  "cemetery-of-forgotten-sorcerers": { url: "/images/cemetery-of-forgotten-sorcerers/cemetery-of-forgotten-sorcerers.svg", attribution: "Generated", sourceUrl: "#" },
  "zenin-clan-dojo": { url: "/images/zenin-clan-dojo/zenin-clan-dojo.svg", attribution: "Generated", sourceUrl: "#" },
  "prison-realm": { url: "/images/prison-realm/prison-realm.svg", attribution: "Generated", sourceUrl: "#" },
  "culling-game-arena": { url: "/images/culling-game-arena/culling-game-arena.svg", attribution: "Generated", sourceUrl: "#" },
  "star-plasma-vessel": { url: "/images/star-plasma-vessel/star-plasma-vessel.svg", attribution: "Generated", sourceUrl: "#" },
  "cursedspeechexplode-spell": { url: "/images/cursedspeechexplode-spell/cursedspeechexplode-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "domainexpansioninfinitevoid-spell": { url: "/images/domainexpansioninfinitevoid-spell/domainexpansioninfinitevoid-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "domainexpansionmalevolentshrine-spell": { url: "/images/domainexpansionmalevolentshrine-spell/domainexpansionmalevolentshrine-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "blackflash-spell": { url: "/images/blackflash-spell/blackflash-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "reversalred-spell": { url: "/images/reversalred-spell/reversalred-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "reversalblue-spell": { url: "/images/reversalblue-spell/reversalblue-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "simpledomain-spell": { url: "/images/simpledomain-spell/simpledomain-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "maximummeteor-spell": { url: "/images/maximummeteor-spell/maximummeteor-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "openmaximumtechnique-spell": { url: "/images/openmaximumtechnique-spell/openmaximumtechnique-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "cursedtechniquelapseelectric-spell": { url: "/images/cursedtechniquelapseelectric-spell/cursedtechniquelapseelectric-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "cursedtechniquelapsevolcanic-spell": { url: "/images/cursedtechniquelapsevolcanic-spell/cursedtechniquelapsevolcanic-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "idletransfiguration-spell": { url: "/images/idletransfiguration-spell/idletransfiguration-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "soulrecognition-spell": { url: "/images/soulrecognition-spell/soulrecognition-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "bindingvowescape-spell": { url: "/images/bindingvowescape-spell/bindingvowescape-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "cursedspeechstop-spell": { url: "/images/cursedspeechstop-spell/cursedspeechstop-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "feeding-spell": { url: "/images/feeding-spell/feeding-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "copytechnique-spell": { url: "/images/copytechnique-spell/copytechnique-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "wanderingcursedspirit-spell": { url: "/images/wanderingcursedspirit-spell/wanderingcursedspirit-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "newshadowstylesimpledomain-spell": { url: "/images/newshadowstylesimpledomain-spell/newshadowstylesimpledomain-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "bloodmanipulation-spell": { url: "/images/bloodmanipulation-spell/bloodmanipulation-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "ratiotechnique-spell": { url: "/images/ratiotechnique-spell/ratiotechnique-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "boogiewoogie-spell": { url: "/images/boogiewoogie-spell/boogiewoogie-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "jacobsladder-spell": { url: "/images/jacobsladder-spell/jacobsladder-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "chimerashadowgarden-spell": { url: "/images/chimerashadowgarden-spell/chimerashadowgarden-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "rikaspower-spell": { url: "/images/rikaspower-spell/rikaspower-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "unlimitedvoid-spell": { url: "/images/unlimitedvoid-spell/unlimitedvoid-spell.svg", attribution: "Generated", sourceUrl: "#" },
  "shibuyaincident-area": { url: "/images/shibuyaincident-area/shibuyaincident-area.svg", attribution: "Generated", sourceUrl: "#" },
  "tokyojujutsuhigh-area": { url: "/images/tokyojujutsuhigh-area/tokyojujutsuhigh-area.svg", attribution: "Generated", sourceUrl: "#" },
  "kyotojujutsuhigh-area": { url: "/images/kyotojujutsuhigh-area/kyotojujutsuhigh-area.svg", attribution: "Generated", sourceUrl: "#" },
  "cursedwarehouse-area": { url: "/images/cursedwarehouse-area/cursedwarehouse-area.svg", attribution: "Generated", sourceUrl: "#" },
  "cemeteryofforgottensorcerers-area": { url: "/images/cemeteryofforgottensorcerers-area/cemeteryofforgottensorcerers-area.svg", attribution: "Generated", sourceUrl: "#" },
  "zeninclandojo-area": { url: "/images/zeninclandojo-area/zeninclandojo-area.svg", attribution: "Generated", sourceUrl: "#" },
  "prisonrealm-area": { url: "/images/prisonrealm-area/prisonrealm-area.svg", attribution: "Generated", sourceUrl: "#" },
  "cullinggamearena-area": { url: "/images/cullinggamearena-area/cullinggamearena-area.svg", attribution: "Generated", sourceUrl: "#" },
  "starplasmavessel-area": { url: "/images/starplasmavessel-area/starplasmavessel-area.svg", attribution: "Generated", sourceUrl: "#" },
  "default": { url: "/placeholder.svg", attribution: "System Placeholder", sourceUrl: "#" }
};

const normalizeBaseAssetKey = (key: string): string => key.replace(/-/g, '').toLowerCase();

const NON_DEFAULT_CARD_ASSET_ENTRIES = Object.entries(CARD_ASSETS)
  .filter(([key]) => key !== 'default')
  .map(([key, asset]) => ({
    baseKey: key,
    normalizedBaseKey: normalizeBaseAssetKey(key),
    asset,
  }));

const CARD_ASSET_BY_NORMALIZED_BASE_KEY = new Map(
  NON_DEFAULT_CARD_ASSET_ENTRIES.map((entry) => [entry.normalizedBaseKey, entry]),
);

const CARD_ASSET_VARIANT_INDEX = NON_DEFAULT_CARD_ASSET_ENTRIES.reduce((index, entry) => {
  const prefix = entry.normalizedBaseKey.charAt(0);
  const existingEntries = index.get(prefix) ?? [];
  existingEntries.push(entry);
  index.set(prefix, existingEntries);
  return index;
}, new Map<string, typeof NON_DEFAULT_CARD_ASSET_ENTRIES>());

export const getCardAsset = (cardId: string, variant?: string): AssetMetadata => {
  // Direct match
  if (CARD_ASSETS[cardId]) {
    const asset = CARD_ASSETS[cardId];
    return { ...asset, url: resolvePublicAssetUrl(asset.url) };
  }
  
  const cardIdLower = cardId.toLowerCase();
  const variantCandidates = CARD_ASSET_VARIANT_INDEX.get(cardIdLower.charAt(0)) ?? NON_DEFAULT_CARD_ASSET_ENTRIES;
  
  // Try to match by extracting the base name from card ID
  // Card IDs like "fushiguromegumi-child" should match asset "fushiguro-megumi"
  for (const candidate of variantCandidates) {
    if (cardIdLower.includes(candidate.normalizedBaseKey)) {
      const baseEntry = CARD_ASSET_BY_NORMALIZED_BASE_KEY.get(candidate.normalizedBaseKey);
      if (!baseEntry) {
        continue;
      }

      const { baseKey, asset } = baseEntry;
      // If we have a variant, try to return the variant-specific image path
      if (variant) {
        // Get the original extension from the base asset
        const baseUrl = asset.url;
        const ext = baseUrl.includes('.webp') ? '.webp' : baseUrl.includes('.png') ? '.png' : '.svg';
        
        // Extract character name from baseKey (e.g., "fushiguro-megumi" -> "Megumi")
        const charName = baseKey.split('-').pop();
        const charNameCapitalized = charName ? charName.charAt(0).toUpperCase() + charName.slice(1) : '';
        const charVariant = charNameCapitalized ? charNameCapitalized + '_' + variant : variant;
        
        return {
          ...asset,
          url: resolvePublicAssetUrl('/images/' + baseKey + '/' + charVariant.replace(/[^a-zA-Z0-9]/g, '_') + ext),
          variant: variant 
        };
      }
      return { ...asset, url: resolvePublicAssetUrl(asset.url) };
    }
  }
  
  const defaultAsset = CARD_ASSETS['default'];
  return { ...defaultAsset, url: resolvePublicAssetUrl(defaultAsset.url) };
};
