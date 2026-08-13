import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: false,
    environment: "node",
    passWithNoTests: true,
    include: ["src/**/*.test.ts"],
    // Integration tests run via vitest.integration.config.ts (they need Docker).
    exclude: ["node_modules", "dist", ".turbo", "src/**/*.integration.test.ts"],
  },
});
