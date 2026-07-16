"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.styleReferenceRows = styleReferenceRows;
var STYLE_COLORS = [
    { code: "BK", names: { en: "Black", zh: "黑色", fr: "Noir", de: "Schwarz", es: "Negro", it: "Nero", ja: "ブラック", pl: "Czarny", pt: "Preto", ru: "Чёрный", hi: "काला" } },
    { code: "WH", names: { en: "White", zh: "白色", fr: "Blanc", de: "Weiß", es: "Blanco", it: "Bianco", ja: "ホワイト", pl: "Biały", pt: "Branco", ru: "Белый", hi: "सफ़ेद" } },
    { code: "GY", names: { en: "Gray", zh: "灰色", fr: "Gris", de: "Grau", es: "Gris", it: "Grigio", ja: "グレー", pl: "Szary", pt: "Cinza", ru: "Серый", hi: "धूसर" } },
    { code: "LGY", names: { en: "Light Gray", zh: "浅灰色", fr: "Gris clair", de: "Hellgrau", es: "Gris claro", it: "Grigio chiaro", ja: "ライトグレー", pl: "Jasnoszary", pt: "Cinza claro", ru: "Светло-серый", hi: "हल्का धूसर" } },
    { code: "CH", names: { en: "Charcoal", zh: "炭灰色", fr: "Anthracite", de: "Anthrazit", es: "Antracita", it: "Antracite", ja: "チャコール", pl: "Grafitowy", pt: "Carvão", ru: "Угольный", hi: "कोयला" } },
    { code: "NV", names: { en: "Navy", zh: "藏青色", fr: "Marine", de: "Marineblau", es: "Azul marino", it: "Blu navy", ja: "ネイビー", pl: "Granatowy", pt: "Azul-marinho", ru: "Тёмно-синий", hi: "नेवी" } },
    { code: "BL", names: { en: "Blue", zh: "蓝色", fr: "Bleu", de: "Blau", es: "Azul", it: "Blu", ja: "ブルー", pl: "Niebieski", pt: "Azul", ru: "Синий", hi: "नीला" } },
    { code: "LBL", names: { en: "Light Blue", zh: "浅蓝色", fr: "Bleu clair", de: "Hellblau", es: "Azul claro", it: "Azzurro", ja: "ライトブルー", pl: "Jasnoniebieski", pt: "Azul claro", ru: "Голубой", hi: "हल्का नीला" } },
    { code: "RD", names: { en: "Red", zh: "红色", fr: "Rouge", de: "Rot", es: "Rojo", it: "Rosso", ja: "レッド", pl: "Czerwony", pt: "Vermelho", ru: "Красный", hi: "लाल" } },
    { code: "PK", names: { en: "Pink", zh: "粉色", fr: "Rose", de: "Rosa", es: "Rosa", it: "Rosa", ja: "ピンク", pl: "Różowy", pt: "Rosa", ru: "Розовый", hi: "गुलाबी" } },
    { code: "WN", names: { en: "Wine", zh: "酒红色", fr: "Bordeaux", de: "Weinrot", es: "Vino", it: "Bordeaux", ja: "ワイン", pl: "Bordowy", pt: "Vinho", ru: "Винный", hi: "वाइन" } },
    { code: "PP", names: { en: "Purple", zh: "紫色", fr: "Violet", de: "Lila", es: "Morado", it: "Viola", ja: "パープル", pl: "Fioletowy", pt: "Roxo", ru: "Фиолетовый", hi: "बैंगनी" } },
    { code: "OR", names: { en: "Orange", zh: "橙色", fr: "Orange", de: "Orange", es: "Naranja", it: "Arancione", ja: "オレンジ", pl: "Pomarańczowy", pt: "Laranja", ru: "Оранжевый", hi: "नारंगी" } },
    { code: "YL", names: { en: "Yellow", zh: "黄色", fr: "Jaune", de: "Gelb", es: "Amarillo", it: "Giallo", ja: "イエロー", pl: "Żółty", pt: "Amarelo", ru: "Жёлтый", hi: "पीला" } },
    { code: "GR", names: { en: "Green", zh: "绿色", fr: "Vert", de: "Grün", es: "Verde", it: "Verde", ja: "グリーン", pl: "Zielony", pt: "Verde", ru: "Зелёный", hi: "हरा" } },
    { code: "OL", names: { en: "Olive", zh: "橄榄色", fr: "Olive", de: "Oliv", es: "Oliva", it: "Oliva", ja: "オリーブ", pl: "Oliwkowy", pt: "Oliva", ru: "Оливковый", hi: "जैतूनी" } },
    { code: "BG", names: { en: "Beige", zh: "米色", fr: "Beige", de: "Beige", es: "Beige", it: "Beige", ja: "ベージュ", pl: "Beżowy", pt: "Bege", ru: "Бежевый", hi: "बेज" } },
    { code: "CR", names: { en: "Cream", zh: "奶油色", fr: "Crème", de: "Creme", es: "Crema", it: "Crema", ja: "クリーム", pl: "Kremowy", pt: "Creme", ru: "Кремовый", hi: "क्रीम" } },
    { code: "KH", names: { en: "Khaki", zh: "卡其色", fr: "Kaki", de: "Khaki", es: "Caqui", it: "Cachi", ja: "カーキ", pl: "Khaki", pt: "Cáqui", ru: "Хаки", hi: "खाकी" } },
    { code: "BN", names: { en: "Brown", zh: "棕色", fr: "Marron", de: "Braun", es: "Marrón", it: "Marrone", ja: "ブラウン", pl: "Brązowy", pt: "Marrom", ru: "Коричневый", hi: "भूरा" } }
];
// Sizes are universally understood by their code (XS, S, M, …), so they aren't
// localized and carry no descriptive name — `sizeName` just mirrors the code.
var STYLE_SIZE_CODES = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "2XL",
    "3XL",
    "OS"
];
var pickName = function (names, language) { var _a, _b; return (_b = (_a = (language ? names[language] : undefined)) !== null && _a !== void 0 ? _a : names.en) !== null && _b !== void 0 ? _b : ""; };
/**
 * The color + size rows to seed for a company, with names localized to the
 * given language (falls back to English for any locale without a translation).
 */
function styleReferenceRows(language) {
    return {
        colors: STYLE_COLORS.map(function (c) { return ({
            colorCode: c.code,
            colorName: pickName(c.names, language)
        }); }),
        sizes: STYLE_SIZE_CODES.map(function (code) { return ({
            sizeCode: code,
            sizeName: code
        }); })
    };
}
