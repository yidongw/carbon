# i18n / Translation Pipeline (lingui + ollama)

How UI strings get extracted, translated, and compiled across locales.

## Layout

- Config: `lingui.config.js` (repo root). `sourceLocale: "en"`, 11 locales
  (`en, es, de, it, ja, zh, fr, pl, pt, ru, hi`).
- Catalogs: `packages/locale/locales/{locale}/{erp,mes}.po` — two namespaces:
  - `erp` ← scans `apps/erp/app`, `packages/react/src`
  - `mes` ← scans `apps/mes/app`, `packages/react/src`
  - (`.server.*`, `.test.*`, `.spec.*` excluded)
- Compiled output via `lingui compile --namespace es` (not the committed `.po`).

## Key config decision: `format: "po"` (string), NOT `formatter({...})`

`lingui.config.js` uses `format: "po"` (the string), even though we want
origin-free `.po` files. Reason: external tooling that reads the lingui config
(linguito) asserts `config.format === "po"` and uses it to build the `.po` file
paths. A `formatter({ origins: false })` object breaks that. So instead of the
formatter, the churny bits are stripped post-extract by
`scripts/strip-po-headers.mjs`:

- `POT-Creation-Date:` header (changes every run)
- `#: path:lineno` origin lines (shift on any code move; ~half the PR diff)

`#.` extracted comments (e.g. `#. placeholder {0}: ...`) are kept.

## npm scripts (root `package.json`)

- `lingui:extract:raw` = `gen-seed-display-names.ts` + `lingui extract --clean`
  — **keeps origins** (translation tooling needs them; see below).
- `lingui:clean` = `node ./scripts/strip-po-headers.mjs` — strips origins + date.
- `lingui:extract` = `lingui:extract:raw` + `lingui:clean`.
- `lingui:compile` = `lingui compile --namespace es`.
- `lingui:check` = `lingui:extract` + `lingui:compile`.
- `translate` = `lingui:extract:raw` + `node scripts/translate-po.mjs` + `lingui:clean`.
  Origins are kept through extraction/translation and stripped only at the end.

## Translator: `scripts/translate-po.mjs` (local, replaces linguito)

We do NOT use `linguito translate --llm`. linguito translates the whole batch in
memory and writes only if EVERY string succeeds, with a brittle strict-JSON
parse and no retries — one bad response from a small local model discards
thousands of good translations. (linguito also needs `#:` origins present to read
source files for LLM context; without them it resolves the project dir and
`EISDIR`s.)

`scripts/translate-po.mjs` instead:

- Parses/serializes `.po` with `pofile` (same lib `@lingui/format-po` uses).
- Translates each missing `msgstr` independently via local **ollama**
  (`http://127.0.0.1:11434/api/chat`, model `llama3.2:latest` by default).
- Parallel with bounded concurrency (`TRANSLATE_CONCURRENCY`, default 6).
- Per-string retry with **temperature escalation** (`0.1 → 1.0`) so deterministic
  wrong answers get varied retries.
- Preserves placeholders (`{0}`, `{name}`, `%s`, `<0></0>`) and outer whitespace;
  rejects outputs that add/drop placeholders.
- Writes each catalog incrementally; re-running fills only what's still empty.
- Skips `en` (source locale). Env: `OLLAMA_URL`, `OLLAMA_MODEL`, `TRANSLATE_CONCURRENCY`.
- Prompt deliberately avoids literal placeholder examples — small models parrot
  them into the output.

Prereq (see README): local ollama with `llama3.2`, linguito config pointed at it.
Quality from the 3B model is decent for common UI strings but weak on niche terms
(e.g. accounting/Japanese); use a stronger `OLLAMA_MODEL` or API model for higher
quality.

## Runtime loading + dev compilation (the compiled `.mjs` must exist)

At runtime the apps import compiled catalogs, NOT the `.po`:
`apps/{erp,mes}/app/services/lingui.server.ts` does
`import.meta.glob("…/packages/locale/locales/*/{erp,mes}.mjs", { import: "messages" })`
and `LocaleProvider` (`packages/locale/src/i18n.tsx`) `load()`s + `activate()`s them
reactively. If a locale's `.mjs` is missing the loader returns `{}` → text silently
falls back to English (switching looks like a no-op).

The `.mjs` are **gitignored** (`packages/locale/locales/**/*.mjs`) and produced by the
`//#lingui:compile` turbo task — which only **`build`** depends on. `crbn up` spawns
`react-router dev` directly (bypassing turbo), so dev had no `.mjs`. Fixed: `crbn up`
(`packages/dev/src/commands/up.ts` → `compileLocaleCatalogs`) runs `pnpm lingui:compile`
before spawning apps when apps are selected. NOTE: `crbn` runs `packages/dev` from the
**main checkout** (bin `repo_root()` = git-common-dir parent), so this step only takes
effect once the change is on `main`.

## pre-push hook (`.git/hooks/pre-push`, not tracked)

- origin (carbon): blocks `staging`/`prod`. On **dev** push, runs the full
  `translate` flow + `compile`; if it produces changes, commits them and
  re-pushes dev (guarded by `CARBON_SKIP_TRANSLATE=1` against recursion).
- jilio: on **staging** push, resets staging to `jilio/staging` then rebases
  `-X theirs` onto latest dev.
