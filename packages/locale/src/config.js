"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.languageNativeLabels = exports.resolveLanguage = exports.localeCookieName = exports.defaultLanguage = exports.supportedLanguages = void 0;
exports.getSortedLanguageSelectOptions = getSortedLanguageSelectOptions;
var env_1 = require("@carbon/env");
exports.supportedLanguages = [
    "en",
    "fr",
    "de",
    "es",
    "it",
    "ja",
    "pl",
    "pt",
    "ru",
    "zh",
    "hi"
];
var envDefaultLanguage = (0, env_1.getBrowserEnv)().DEFAULT_LANGUAGE;
exports.defaultLanguage = exports.supportedLanguages.includes(envDefaultLanguage)
    ? envDefaultLanguage
    : "en";
exports.localeCookieName = "locale";
var resolveLanguage = function (locale) {
    if (!locale)
        return exports.defaultLanguage;
    var normalized = locale.toLowerCase().split("-")[0];
    if (exports.supportedLanguages.includes(normalized)) {
        return normalized;
    }
    return exports.defaultLanguage;
};
exports.resolveLanguage = resolveLanguage;
/** Each language name written in that language (for pickers). */
exports.languageNativeLabels = {
    en: "English",
    fr: "Français",
    de: "Deutsch",
    es: "Español",
    it: "Italiano",
    ja: "日本語",
    pl: "Polski",
    pt: "Português",
    ru: "Русский",
    zh: "中文",
    hi: "हिन्दी"
};
/**
 * Options for language `<Select>` UIs: native endonyms, sorted for the active UI locale.
 */
function getSortedLanguageSelectOptions(locale) {
    var resolved = (0, exports.resolveLanguage)(locale);
    return exports.supportedLanguages
        .map(function (value) { return ({
        value: value,
        label: exports.languageNativeLabels[value]
    }); })
        .sort(function (a, b) { return a.label.localeCompare(b.label, resolved); });
}
