/**
 * Vitest globalSetup for the integration suite.
 *
 * Starts ONE ephemeral database for the whole run (applying 865 migrations is
 * slow, so we do it once), exposes its URL to tests via `inject("itestDbUrl")`,
 * and tears the container down afterwards.
 *
 * If Docker is unavailable (e.g. CI without a Docker daemon), it provides an
 * empty URL and the tests skip themselves — the suite stays green rather than
 * failing, mirroring the opt-in `seedDemoData.test.ts` convention.
 */
import {
  isDockerAvailable,
  startTestDatabase,
  type TestDatabase
} from "./testDatabase";

// The context object vitest passes to globalSetup (typed loosely to avoid
// coupling to a specific vitest internal type).
interface GlobalSetupContext {
  provide: (key: "itestDbUrl", value: string) => void;
}

let db: TestDatabase | undefined;

export default async function setup({ provide }: GlobalSetupContext) {
  if (!(await isDockerAvailable())) {
    console.warn(
      "[integration] Docker not available — integration tests will be skipped."
    );
    provide("itestDbUrl", "");
    return;
  }

  console.log(
    "[integration] starting test database (applies all migrations + seed, ~2-3 min)…"
  );
  const start = Date.now();
  db = await startTestDatabase();
  console.log(
    `[integration] test database ready in ${Math.round((Date.now() - start) / 1000)}s`
  );
  provide("itestDbUrl", db.url);

  return async () => {
    await db?.stop();
  };
}

declare module "vitest" {
  export interface ProvidedContext {
    itestDbUrl: string;
  }
}
