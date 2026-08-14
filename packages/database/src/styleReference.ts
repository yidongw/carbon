/**
 * Standard apparel colors + sizes seeded per company when the company is
 * created. The `code` is the stable, language-independent key that is stored on
 * bundles, style-color assignments, and production configs — only the display
 * `name` is localized. To add a locale, add its entries to each `names` map;
 * downstream code never keys off the localized name, so nothing else changes.
 *
 * This lives in the seed layer (not a migration) so the names can be localized
 * to each company's language, rather than baked in as system-wide English rows.
 */

type LocalizedRef = {
  /** Stable, language-independent code stored on child records. */
  code: string;
  /** Display name per language ("en" is the required fallback). */
  names: { en: string } & Record<string, string>;
};

const STYLE_COLORS: LocalizedRef[] = [
  {
    code: "BK",
    names: {
      en: "Black",
      zh: "黑色",
      fr: "Noir",
      de: "Schwarz",
      es: "Negro",
      it: "Nero",
      ja: "ブラック",
      pl: "Czarny",
      pt: "Preto",
      ru: "Чёрный",
      hi: "काला"
    }
  },
  {
    code: "WH",
    names: {
      en: "White",
      zh: "白色",
      fr: "Blanc",
      de: "Weiß",
      es: "Blanco",
      it: "Bianco",
      ja: "ホワイト",
      pl: "Biały",
      pt: "Branco",
      ru: "Белый",
      hi: "सफ़ेद"
    }
  },
  {
    code: "GY",
    names: {
      en: "Gray",
      zh: "灰色",
      fr: "Gris",
      de: "Grau",
      es: "Gris",
      it: "Grigio",
      ja: "グレー",
      pl: "Szary",
      pt: "Cinza",
      ru: "Серый",
      hi: "धूसर"
    }
  },
  {
    code: "LGY",
    names: {
      en: "Light Gray",
      zh: "浅灰色",
      fr: "Gris clair",
      de: "Hellgrau",
      es: "Gris claro",
      it: "Grigio chiaro",
      ja: "ライトグレー",
      pl: "Jasnoszary",
      pt: "Cinza claro",
      ru: "Светло-серый",
      hi: "हल्का धूसर"
    }
  },
  {
    code: "CH",
    names: {
      en: "Charcoal",
      zh: "炭灰色",
      fr: "Anthracite",
      de: "Anthrazit",
      es: "Antracita",
      it: "Antracite",
      ja: "チャコール",
      pl: "Grafitowy",
      pt: "Carvão",
      ru: "Угольный",
      hi: "कोयला"
    }
  },
  {
    code: "NV",
    names: {
      en: "Navy",
      zh: "藏青色",
      fr: "Marine",
      de: "Marineblau",
      es: "Azul marino",
      it: "Blu navy",
      ja: "ネイビー",
      pl: "Granatowy",
      pt: "Azul-marinho",
      ru: "Тёмно-синий",
      hi: "नेवी"
    }
  },
  {
    code: "BL",
    names: {
      en: "Blue",
      zh: "蓝色",
      fr: "Bleu",
      de: "Blau",
      es: "Azul",
      it: "Blu",
      ja: "ブルー",
      pl: "Niebieski",
      pt: "Azul",
      ru: "Синий",
      hi: "नीला"
    }
  },
  {
    code: "LBL",
    names: {
      en: "Light Blue",
      zh: "浅蓝色",
      fr: "Bleu clair",
      de: "Hellblau",
      es: "Azul claro",
      it: "Azzurro",
      ja: "ライトブルー",
      pl: "Jasnoniebieski",
      pt: "Azul claro",
      ru: "Голубой",
      hi: "हल्का नीला"
    }
  },
  {
    code: "RD",
    names: {
      en: "Red",
      zh: "红色",
      fr: "Rouge",
      de: "Rot",
      es: "Rojo",
      it: "Rosso",
      ja: "レッド",
      pl: "Czerwony",
      pt: "Vermelho",
      ru: "Красный",
      hi: "लाल"
    }
  },
  {
    code: "PK",
    names: {
      en: "Pink",
      zh: "粉色",
      fr: "Rose",
      de: "Rosa",
      es: "Rosa",
      it: "Rosa",
      ja: "ピンク",
      pl: "Różowy",
      pt: "Rosa",
      ru: "Розовый",
      hi: "गुलाबी"
    }
  },
  {
    code: "WN",
    names: {
      en: "Wine",
      zh: "酒红色",
      fr: "Bordeaux",
      de: "Weinrot",
      es: "Vino",
      it: "Bordeaux",
      ja: "ワイン",
      pl: "Bordowy",
      pt: "Vinho",
      ru: "Винный",
      hi: "वाइन"
    }
  },
  {
    code: "PP",
    names: {
      en: "Purple",
      zh: "紫色",
      fr: "Violet",
      de: "Lila",
      es: "Morado",
      it: "Viola",
      ja: "パープル",
      pl: "Fioletowy",
      pt: "Roxo",
      ru: "Фиолетовый",
      hi: "बैंगनी"
    }
  },
  {
    code: "OR",
    names: {
      en: "Orange",
      zh: "橙色",
      fr: "Orange",
      de: "Orange",
      es: "Naranja",
      it: "Arancione",
      ja: "オレンジ",
      pl: "Pomarańczowy",
      pt: "Laranja",
      ru: "Оранжевый",
      hi: "नारंगी"
    }
  },
  {
    code: "YL",
    names: {
      en: "Yellow",
      zh: "黄色",
      fr: "Jaune",
      de: "Gelb",
      es: "Amarillo",
      it: "Giallo",
      ja: "イエロー",
      pl: "Żółty",
      pt: "Amarelo",
      ru: "Жёлтый",
      hi: "पीला"
    }
  },
  {
    code: "GR",
    names: {
      en: "Green",
      zh: "绿色",
      fr: "Vert",
      de: "Grün",
      es: "Verde",
      it: "Verde",
      ja: "グリーン",
      pl: "Zielony",
      pt: "Verde",
      ru: "Зелёный",
      hi: "हरा"
    }
  },
  {
    code: "OL",
    names: {
      en: "Olive",
      zh: "橄榄色",
      fr: "Olive",
      de: "Oliv",
      es: "Oliva",
      it: "Oliva",
      ja: "オリーブ",
      pl: "Oliwkowy",
      pt: "Oliva",
      ru: "Оливковый",
      hi: "जैतूनी"
    }
  },
  {
    code: "BG",
    names: {
      en: "Beige",
      zh: "米色",
      fr: "Beige",
      de: "Beige",
      es: "Beige",
      it: "Beige",
      ja: "ベージュ",
      pl: "Beżowy",
      pt: "Bege",
      ru: "Бежевый",
      hi: "बेज"
    }
  },
  {
    code: "CR",
    names: {
      en: "Cream",
      zh: "奶油色",
      fr: "Crème",
      de: "Creme",
      es: "Crema",
      it: "Crema",
      ja: "クリーム",
      pl: "Kremowy",
      pt: "Creme",
      ru: "Кремовый",
      hi: "क्रीम"
    }
  },
  {
    code: "KH",
    names: {
      en: "Khaki",
      zh: "卡其色",
      fr: "Kaki",
      de: "Khaki",
      es: "Caqui",
      it: "Cachi",
      ja: "カーキ",
      pl: "Khaki",
      pt: "Cáqui",
      ru: "Хаки",
      hi: "खाकी"
    }
  },
  {
    code: "BN",
    names: {
      en: "Brown",
      zh: "棕色",
      fr: "Marron",
      de: "Braun",
      es: "Marrón",
      it: "Marrone",
      ja: "ブラウン",
      pl: "Brązowy",
      pt: "Marrom",
      ru: "Коричневый",
      hi: "भूरा"
    }
  }
];

// Sizes are universally understood by their code (XS, S, M, …), so they aren't
// localized and carry no descriptive name — `sizeName` just mirrors the code.
const STYLE_SIZE_CODES: string[] = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "OS"
];

/**
 * The color + size rows to seed for a company. Color names are stored as the
 * English base name; the UI translates them per-locale via the seed display-name
 * catalog (translateSeedDisplayName), so "Black" renders as 黑色 in zh, etc.
 * `language` is accepted for API compatibility but no longer localizes the
 * stored name — keeping English as the single stored base was the requirement.
 */
export function styleReferenceRows(language?: string) {
  void language;
  return {
    colors: STYLE_COLORS.map((c) => ({
      colorCode: c.code,
      colorName: c.names.en ?? c.code
    })),
    // `index` is the canonical apparel order (XS→3XL, OS last) persisted as
    // `sortOrder` so downstream reads don't fall back to alphabetical.
    sizes: STYLE_SIZE_CODES.map((code, index) => ({
      sizeCode: code,
      sizeName: code,
      sortOrder: index
    }))
  };
}

/**
 * Stable colorCode → English display name from the seed list. Used to alias
 * legacy config grids that stored English color names as column keys.
 */
export function styleColorEnglishNamesByCode(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const color of STYLE_COLORS) {
    const en = color.names.en;
    if (en) out[color.code] = en;
  }
  return out;
}

const STYLE_COLOR_BY_CODE: Record<string, LocalizedRef> = Object.fromEntries(
  STYLE_COLORS.map((c) => [c.code, c])
);

const STYLE_COLOR_BY_EN_NAME: Record<string, LocalizedRef> = Object.fromEntries(
  STYLE_COLORS.map((c) => [c.names.en.trim().toLowerCase(), c])
);

/**
 * Localized display name for a standard style color looked up by its stored
 * English base NAME (e.g. "Black" → 黑色), for callers that only have the name
 * (a variant view exposing `COALESCE(value.name, value.code)`). Returns
 * `undefined` for non-standard names (e.g. size codes, company colors) so the
 * caller keeps the stored value.
 */
export function localizeStyleColorNameByName(
  name: string | null | undefined,
  language?: string
): string | undefined {
  if (!name) return undefined;
  const ref = STYLE_COLOR_BY_EN_NAME[name.trim().toLowerCase()];
  if (!ref) return undefined;
  if (!language) return ref.names.en;
  const base = language.split("-")[0] ?? language;
  return ref.names[language] ?? ref.names[base] ?? ref.names.en;
}

/**
 * Localized display name for a standard style color, by its stable code.
 * The seed list carries every locale, so the UI can render the color in the
 * user's language regardless of what name is stored on the value row. Returns
 * `undefined` for codes that aren't part of the standard palette (e.g. a
 * company-defined color) so callers can fall back to the stored name.
 */
export function localizeStyleColorName(
  code: string | null | undefined,
  language?: string
): string | undefined {
  if (!code) return undefined;
  const ref = STYLE_COLOR_BY_CODE[code];
  if (!ref) return undefined;
  if (!language) return ref.names.en;
  // Accept both the short lingui locale ("zh") and a full BCP-47 tag ("zh-CN")
  // — different callers pass different formats. Fall back short, then English.
  const base = language.split("-")[0] ?? language;
  return ref.names[language] ?? ref.names[base] ?? ref.names.en;
}

/**
 * Localize a variant's attribute label — a separator-joined string of attribute
 * value CODES (e.g. a code-combo "BK|S" rendered as "BK · S"). Each
 * segment is translated to the user's locale when it's a standard color code
 * (BK → 黑色); size codes and any non-color segments (e.g. an item name
 * fallback) pass through unchanged. Usable from both ERP and MES.
 */
export function localizeVariantAttributeLabel(
  label: string | null | undefined,
  language?: string,
  separator = " · "
): string {
  if (!label) return "";
  // Split on whatever separator the source used — " · ", a bare "·", or the raw
  // code-combo "|" — so a label never silently passes through untranslated when
  // a caller's separator differs from the output one.
  return label
    .split(/\s*[·|]\s*/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map(
      (seg) =>
        // A segment may be a value CODE (BK) or an English base NAME (Black),
        // depending on the source field — localize either; non-colors pass through.
        localizeStyleColorName(seg, language) ??
        localizeStyleColorNameByName(seg, language) ??
        seg
    )
    .join(separator);
}
