/**
 * Vitest globalSetup for the ERP API-level integration suite.
 *
 * Starts ONE Supabase stack (Postgres + PostgREST) for the whole run and
 * exposes its coordinates to tests via `inject(...)`. Skips (green) when Docker
 * is unavailable, mirroring the packages/database harness.
 */
import {
  isDockerAvailable,
  startSupabaseStack,
  type SupabaseStack,
} from "@carbon/database/test";

interface GlobalSetupContext {
  provide: (
    key: "itestPgUrl" | "itestPostgrestUrl" | "itestServiceRoleToken",
    value: string
  ) => void;
}

let stack: SupabaseStack | undefined;

export default async function setup({ provide }: GlobalSetupContext) {
  // Reuse a shared stack started by CI (start-shared-stack.ts) if present — no
  // teardown here, CI owns its lifecycle.
  const { ITEST_PG_URL, ITEST_POSTGREST_URL, ITEST_SERVICE_ROLE_TOKEN } =
    process.env;
  if (ITEST_PG_URL && ITEST_POSTGREST_URL && ITEST_SERVICE_ROLE_TOKEN) {
    console.log("[integration] reusing shared Supabase stack");
    provide("itestPgUrl", ITEST_PG_URL);
    provide("itestPostgrestUrl", ITEST_POSTGREST_URL);
    provide("itestServiceRoleToken", ITEST_SERVICE_ROLE_TOKEN);
    return;
  }

  if (!(await isDockerAvailable())) {
    console.warn(
      "[integration] Docker not available — API integration tests will be skipped."
    );
    provide("itestPgUrl", "");
    provide("itestPostgrestUrl", "");
    provide("itestServiceRoleToken", "");
    return;
  }

  console.log(
    "[integration] starting Supabase stack (Postgres + PostgREST, ~2-3 min)…"
  );
  const start = Date.now();
  stack = await startSupabaseStack();
  console.log(
    `[integration] Supabase stack ready in ${Math.round((Date.now() - start) / 1000)}s`
  );
  provide("itestPgUrl", stack.pgUrl);
  provide("itestPostgrestUrl", stack.postgrestUrl);
  provide("itestServiceRoleToken", stack.serviceRoleToken);

  return async () => {
    await stack?.stop();
  };
}

declare module "vitest" {
  export interface ProvidedContext {
    itestPgUrl: string;
    itestPostgrestUrl: string;
    itestServiceRoleToken: string;
  }
}
