/**
 * Tear down the shared Supabase stack started by `start-shared-stack.ts`, using
 * the resource names it exported. Best-effort; safe to run even if nothing is up.
 */
import { docker } from "../dockerHarness";

async function main() {
  const { ITEST_STACK_REST, ITEST_STACK_PG, ITEST_STACK_NETWORK } = process.env;

  for (const name of [ITEST_STACK_REST, ITEST_STACK_PG]) {
    if (!name) continue;
    try {
      await docker(["rm", "-f", name]);
    } catch {
      // already gone
    }
  }
  if (ITEST_STACK_NETWORK) {
    try {
      await docker(["network", "rm", ITEST_STACK_NETWORK]);
    } catch {
      // already gone
    }
  }
}

main().catch((err) => {
  console.error(err);
  // Don't fail the job on teardown issues.
  process.exit(0);
});
