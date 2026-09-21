/** 与网页 `packages/locale` 一致的语言列表（本地化显示名） */
export const SUPPORTED_LOCALES = [
  'en',
  'fr',
  'de',
  'es',
  'it',
  'ja',
  'pl',
  'pt',
  'ru',
  'zh',
  'hi',
] as const

export type LocaleCode = (typeof SUPPORTED_LOCALES)[number]

export const LOCALE_LABELS: Record<LocaleCode, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  it: 'Italiano',
  ja: '日本語',
  pl: 'Polski',
  pt: 'Português',
  ru: 'Русский',
  zh: '中文',
  hi: 'हिन्दी',
}

export const LOCALE_KEY = 'carbon_miniapp_locale'

export function isLocaleCode(v: string): v is LocaleCode {
  return (SUPPORTED_LOCALES as readonly string[]).includes(v)
}

/** 按当前 UI 语言排序的选项（对齐网页 getSortedLanguageSelectOptions） */
export function sortedLocaleOptions(active: LocaleCode) {
  return [...SUPPORTED_LOCALES]
    .map((value) => ({ value, label: LOCALE_LABELS[value] }))
    .sort((a, b) => a.label.localeCompare(b.label, active))
}
