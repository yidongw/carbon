# i18n / Lingui System

## Architecture

- Lingui v5 with macros. Config at root `lingui.config.js`: locales en (source), es, de, it, ja, zh, fr, pl, pt, ru, hi; PO format; catalogs at `packages/locale/locales/{locale}/{erp,mes}` extracted from `apps/{erp,mes}/app`, `packages/react/src`, `packages/form/src` (excludes `*.server.*`, tests). PO origin refs/creation dates are stripped post-extract by `scripts/strip-po-headers.mjs` to reduce diff churn.
- **No `runtimeConfigModule`** is configured, so `t` from `@lingui/core/macro` compiles to `i18n._()` on the **global** singleton from `@lingui/core`.
- The global i18n singleton is **never activated** — there is no `i18n.activate()` call anywhere except inside `LocaleProvider`.
- `packages/locale/src/i18n.tsx` — `LocaleProvider` creates its own runtime per render via `setupI18n()`, loads the catalog, activates it, and provides it through `<I18nProvider>` (React context). This is the only working i18n instance.
- Server side: `apps/erp/app/services/lingui.server.ts` `loadLinguiCatalogForRequest()` lazily imports the compiled `erp.mjs` catalog for the resolved locale (via `import.meta.glob`); the root loader passes the catalog to `LocaleProvider`. It loads messages only — it does not (and must not) activate the global singleton.

## Critical pitfall (caused production SSR crashes)

Using the `t` backtick macro imported from `@lingui/core/macro` in render code throws
`"Lingui: Attempted to call a translation function without setting a locale"` during SSR
(and on the client), because it hits the never-activated global singleton.

**Correct patterns:**
- In components: `import { useLingui } from "@lingui/react/macro"; const { t } = useLingui();` then `t\`...\`` — context-bound, identical message IDs/extraction.
- `<Trans>` from `@lingui/react/macro` — context-bound, safe.
- Route `handle.breadcrumb: msg\`...\`` with `msg` from `@lingui/core/macro` — safe; `msg` only creates a MessageDescriptor (no i18n call). `Breadcrumb.tsx` resolves descriptors via the context `t`.
- If `t` is used inside `useMemo`/`useCallback`, include `t` in the dependency array (see `assignments.tsx` columns memo).

So: `msg` from core/macro is fine; **never import `t` from `@lingui/core/macro`** in app code.

## UI language preference (cookie)

- Cookie name: `locale` (`localeCookieName`). Set via `apps/{erp,mes}/app/services/locale.server.ts` `setLocale()` (scoped with `DOMAIN` when set).
- Public POST `apps/erp/app/routes/api+/locale.tsx` validates against `supportedLanguages` and sets the cookie. Root loader reads it through `getPreferenceHeaders()` → `resolveLanguage()` → `loadLinguiCatalogForRequest()`.
- **Authenticated ERP switcher:** `AvatarMenu` → POST `/api/locale` + `window.location.reload()` (fetcher revalidation alone does not reliably re-run the root loader on heavy routes).
- **Authenticated MES switcher:** profile dropdown in `AppSidebar` still uses a `useFetcher` form post (ERP’s hard-reload pattern is the safer one).
- **Dual-scope cookie bug (post-login no-op):** when `DOMAIN` is set (e.g. `carbon-erp.vercel.app`), `/api/locale` writes a Domain-scoped `locale` cookie. Browsers may still hold an older **host-only** `locale` from a prior deploy. Both are sent; host-only comes first; `cookie.parse` kept the stale value → language switch appeared to do nothing after login. Same class of bug as the `carbon` session cookie. Fix: `setLocale` expires stale scopes before writing; `cookieDomainMigrationMiddleware` also clears duplicate `locale` scopes; `getPreferenceHeaders` prefers the **last** `locale=` value.
- **Public/login gap:** `/api/locale`’s comment says it is for the login page, but the login language UI was removed when the control moved to the avatar menu (#735).
- Dead code: `ProfileLanguageForm` still exists and posts `intent=locale` to profile, but profile no longer renders it or handles that intent.

## MES standard color names (tickets / labels)

Do **not** use a static `COLOR_BY_LANGUAGE` map. Color display names live in `mes.po` (`Black`, `Red`, …).

- Shared descriptors: `apps/mes/app/utils/standardColorMessages.ts` (`msg\`Red\`` …) — included in extract.
- Client: `apps/mes/app/hooks/useLocalizeColor.tsx` via context `t(descriptor)`.
- Server (PDF tickets): `localizeColor.server.ts` loads `mes.mjs` with `loadLinguiCatalogForRequest`, `setupI18n()` locally (never activate global), then `i18n._(descriptor)`. Catalog keys are **hashed**; plain `i18n._("Black")` will not work — always pass the `msg` descriptor.
