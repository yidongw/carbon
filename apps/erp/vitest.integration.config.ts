import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const dir = path.dirname(fileURLToPath(import.meta.url));
const macroShim = path.resolve(dir, "app/test/integration/lingui-macro.shim.ts");

// API-level integration suite: real service functions over real PostgREST +
// Postgres (see app/test/integration/globalSetup.ts). Needs Docker. Kept
// separate from the default (unit) config; run with `pnpm test:integration`.
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    // vitest doesn't run Lingui's macro transform; alias the compile-time macros
    // to runtime shims so service modules (which transitively import UI) import.
    alias: {
      "@lingui/core/macro": macroShim,
      "@lingui/react/macro": macroShim,
    },
  },
  test: {
    include: [
      "app/**/*.integration.test.ts",
      "test/**/*.integration.test.ts",
    ],
    setupFiles: ["app/test/integration/env.setup.ts"],
    globalSetup: ["app/test/integration/globalSetup.ts"],
    // One shared stack for the whole run.
    fileParallelism: false,
    testTimeout: 120_000,
    hookTimeout: 300_000,
    passWithNoTests: true,
  },
});
