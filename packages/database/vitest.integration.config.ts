import { defineConfig } from "vitest/config";

// Integration suite: real Postgres via Docker (see src/test/globalSetup.ts).
// Kept separate from the default (unit) config so `pnpm test` stays fast and
// dependency-free. Run with `pnpm test:integration`.
export default defineConfig({
  test: {
    globals: false,
    environment: "node",
    include: ["src/**/*.integration.test.ts"],
    exclude: ["node_modules", "dist", ".turbo"],
    globalSetup: ["src/test/globalSetup.ts"],
    // One shared container for the whole run.
    fileParallelism: false,
    pool: "forks",
    poolOptions: { forks: { singleFork: true } },
    testTimeout: 120_000,
    hookTimeout: 300_000,
  },
});
