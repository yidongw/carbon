import Taro from '@tarojs/taro'
import {
  isLocaleCode,
  LOCALE_KEY,
  LOCALE_LABELS,
  type LocaleCode,
} from './locales'
import { MESSAGES } from './messages'

const DEFAULT_LOCALE: LocaleCode = 'zh'

export function getLocale(): LocaleCode {
  try {
    const v = String(Taro.getStorageSync(LOCALE_KEY) || '')
    if (isLocaleCode(v)) return v
  } catch {
    /* ignore */
  }
  return DEFAULT_LOCALE
}

export function getLocaleLabel(code?: LocaleCode): string {
  return LOCALE_LABELS[code ?? getLocale()]
}

export function setLocale(code: LocaleCode) {
  Taro.setStorageSync(LOCALE_KEY, code)
}

/** 简单 key 翻译；`{0}` `{1}` 按 args 顺序替换 */
export function t(key: string, ...args: Array<string | number>): string {
  const locale = getLocale()
  const dict = MESSAGES[locale] || MESSAGES.en || MESSAGES.zh || {}
  let s = dict[key] || MESSAGES.en?.[key] || MESSAGES.zh?.[key] || key
  args.forEach((a, i) => {
    s = s.replace(new RegExp(`\\{${i}\\}`, 'g'), String(a))
  })
  return s
}

export { LOCALE_LABELS, sortedLocaleOptions, SUPPORTED_LOCALES } from './locales'
export type { LocaleCode } from './locales'
