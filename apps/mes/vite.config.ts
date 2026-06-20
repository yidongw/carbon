import { reactRouter } from "@react-router/dev/vite";
import { lingui } from "@lingui/vite-plugin";
import path from "node:path";
import { defineConfig, loadEnv, PluginOption } from "vite";
import babelMacros from "vite-plugin-babel-macros";
import tsconfigPaths from "vite-tsconfig-paths";

const repoRoot = path.resolve(__dirname, "../..");

/**
 * Node does not read `.env`; `process.env` is only inherited from the parent
 * process. Merge file-based env here so SSR / `getEnv()` see the repo-root and
 * app-local `.env*` (mirrors apps/erp/vite.config.ts). This also lets a Vite
 * restart pick up values written after startup (e.g. tunnel.sh's
 * SUPABASE_URL_PUBLIC), since the config re-runs and re-reads the files.
 *
 * Repo root is merged after apps/mes so `crbn up`–written root `.env.local`
 * wins. Non-production modes overwrite stale keys; production fills only
 * undefined so CI-injected secrets are preserved.
 */
function applyDotenvToProcessEnv(mode: string) {
  const fromFiles = {
    ...loadEnv(mode, __dirname, ""),
    ...loadEnv(mode, repoRoot, ""),
  };
  const devOverwrite = mode !== "production";
  for (const [key, value] of Object.entries(fromFiles)) {
    if (value === undefined || value === "") continue;
    if (devOverwrite || process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

export default defineConfig(({ mode, isSsrBuild }) => {
  applyDotenvToProcessEnv(mode);

  return {
    build: {
      minify: true,
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          if (warning.code === "SOURCEMAP_ERROR") {
            return;
          }

          defaultHandler(warning);
        },
        ...(isSsrBuild && { input: "./server/app.ts" }),
      },
    },
    define: {
      global: "globalThis",
    },
    ssr: {
      noExternal: [
        "react-dropzone",
        "react-icons",
        "react-phone-number-input",
        "tailwind-merge",
      ],
    },
    server: {
      port: 3001,
      allowedHosts: [
        ".ngrok-free.app",
        ".trycloudflare.com",
        ".w.modal.host",
        ".w.modal.dev",
        ".dev",
        ".localhost",
      ],
    },
    plugins: [
      babelMacros(),
      lingui(),
      reactRouter(),
      tsconfigPaths(),
    ] as PluginOption[],
    resolve: {
      alias: {
        "@carbon/utils": path.resolve(
          __dirname,
          "../../packages/utils/src/index.ts"
        ),
        "@carbon/form": path.resolve(
          __dirname,
          "../../packages/form/src/index.tsx"
        ),
      },
    },
  };
});
