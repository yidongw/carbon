import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ["app/**/*.test.ts", "app/**/*.test.tsx", "test/**/*.test.ts"],
    // Integration tests run via vitest.integration.config.ts (they need Docker).
    exclude: ["**/node_modules/**", "**/*.integration.test.ts"],
    passWithNoTests: true
  }
});
