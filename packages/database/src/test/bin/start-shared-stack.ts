/**
 * Start ONE Supabase stack (Postgres + PostgREST) to be shared by both
 * integration suites in a CI run, and export its coordinates so the suites reuse
 * it instead of each starting (and migrating) their own.
 *
 * Writes the connection env + Docker resource names to `$GITHUB_ENV` (so later
 * workflow steps inherit them), or to stdout when run locally. Does NOT tear the
 * stack down — `stop-shared-stack.ts` does that in an `always()` step.
 *
 * Both globalSetups check for `ITEST_PG_URL` / `ITEST_POSTGREST_URL` /
 * `ITEST_SERVICE_ROLE_TOKEN`; when present they attach to this stack, otherwise
 * they self-provision (unchanged local behaviour).
 */
import { appendFileSync } from "node:fs";
import { startSupabaseStack } from "../supabaseStack";

async function main() {
  const started = Date.now();
  const stack = await startSupabaseStack();
  console.log(
    `[integration] shared stack ready in ${Math.round((Date.now() - started) / 1000)}s`
  );

  const env = {
    ITEST_PG_URL: stack.pgUrl,
    ITEST_POSTGREST_URL: stack.postgrestUrl,
    ITEST_SERVICE_ROLE_TOKEN: stack.serviceRoleToken,
    ITEST_STACK_NETWORK: stack.resources.network,
    ITEST_STACK_PG: stack.resources.pgContainer,
    ITEST_STACK_REST: stack.resources.restContainer,
  };
  const lines = Object.entries(env).map(([k, v]) => `${k}=${v}`);

  if (process.env.GITHUB_ENV) {
    appendFileSync(process.env.GITHUB_ENV, `${lines.join("\n")}\n`);
    console.log("[integration] wrote ITEST_* to $GITHUB_ENV");
  } else {
    // Local use: `export $(pnpm --filter @carbon/database exec tsx … | tail -n …)`
    console.log(lines.join("\n"));
  }
  // Intentionally do not call stack.stop(); the container must outlive this process.
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
