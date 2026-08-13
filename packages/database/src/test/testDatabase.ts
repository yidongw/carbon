/**
 * Ephemeral integration-test database (direct-SQL / Kysely path).
 *
 * Spins up a throwaway `supabase/postgres` container, applies the full Carbon
 * migration set + seed.sql, and hands back a connection string. This gives tests
 * the *same* Postgres behaviour as Supabase (RLS-as-SQL, triggers, event
 * interceptors, `seed_company()`, `get_next_sequence()`, the `auth`/`storage`
 * schemas) rather than mocks.
 *
 * For testing supabase-js/PostgREST APIs over HTTP, use `startSupabaseStack()`
 * (supabaseStack.ts) instead — it additionally runs PostgREST.
 */
import {
  applyCarbonSchema,
  docker,
  PG_IMAGE,
  PASSWORD,
  resolveHostPort,
  waitForPgReady,
} from "./dockerHarness";

export interface TestDatabase {
  url: string;
  containerName: string;
  stop: () => Promise<void>;
}

export async function startTestDatabase(): Promise<TestDatabase> {
  const containerName = `carbon-itest-${process.pid}-${Date.now()}`;

  await docker([
    "run",
    "-d",
    "--name",
    containerName,
    "-e",
    `POSTGRES_PASSWORD=${PASSWORD}`,
    "-p",
    "127.0.0.1::5432",
    PG_IMAGE,
  ]);

  const stop = async () => {
    try {
      await docker(["rm", "-f", containerName]);
    } catch {
      // best-effort teardown
    }
  };

  try {
    await waitForPgReady(containerName);
    await applyCarbonSchema(containerName);
    const port = await resolveHostPort(containerName, 5432);
    const url = `postgresql://postgres:${PASSWORD}@127.0.0.1:${port}/postgres`;
    return { url, containerName, stop };
  } catch (err) {
    await stop();
    throw err;
  }
}

export { isDockerAvailable } from "./dockerHarness";
