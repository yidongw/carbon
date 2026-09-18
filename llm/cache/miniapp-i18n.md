# Miniapp language / i18n

## Placement
**Profile（我的）** page — same role as MES web AvatarMenu / UserNav 「语言」 submenu.
Row shows current endonym (中文 / English / …); opens bottom sheet of all web languages.

## Implementation
- `miniapp/src/i18n/` — `getLocale` / `setLocale` / `t()`; storage key `carbon_miniapp_locale`
- Languages match `packages/locale` (`en fr de es it ja pl pt ru zh hi`) with native labels
- Full UI dictionaries: **zh** + **en**; other locales fall back to English for UI strings (picker still shows native names)
- Wired: profile, TabBar, workstation FN grid, picking/inventory titles

## Not using
MES `/api/locale` cookie — miniapp auth is Bearer + Taro storage; UI strings are client-side.
