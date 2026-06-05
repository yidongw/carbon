import { defineConfig } from "@lingui/cli";

export default defineConfig({
  sourceLocale: "en",
  locales: ["en", "es", "de", "it", "ja", "zh", "fr", "pl", "pt", "ru", "hi"],
  fallbackLocales: {
    default: "en"
  },
  // Use the plain "po" string format (not the formatter object) so external
  // tooling that reads the lingui config recognizes it — linguito asserts
  // `config.format === "po"` and uses it to build the .po file paths.
  // The churny bits the formatter used to drop — `#: path:lineno` origins and
  // POT-Creation-Date — are stripped post-extract in scripts/strip-po-headers.mjs.
  format: "po",
  catalogs: [
    {
      path: "packages/locale/locales/{locale}/erp",
      include: ["apps/erp/app", "packages/react/src"],
      exclude: ["**/*.server.*", "**/*.test.*", "**/*.spec.*"]
    },
    {
      path: "packages/locale/locales/{locale}/mes",
      include: ["apps/mes/app", "packages/react/src"],
      exclude: ["**/*.server.*", "**/*.test.*", "**/*.spec.*"]
    }
  ]
});
