/**
 * Ephemeral integration-test database.
 *
 * Spins up a throwaway `supabase/postgres` container, applies the full Carbon
 * migration set + seed.sql, and hands back a connection string. This gives tests
 * the *same* Postgres behaviour as Supabase (RLS-as-SQL, triggers, event
 * interceptors, `seed_company()`, `get_next_sequence()`, the `auth`/`storage`
 * schemas) rather than mocks.
 *
 * Orchestrated via the `docker` CLI (no extra npm dependency). The container is
 * bound to a random host port so parallel/local runs never collide.
 *
 * NOTE: this covers the direct-SQL / Kysely path. The PostgREST HTTP layer
 * (supabase-js embeds over the network) is a deliberate follow-up — see
 * llm/tasks/integration-tests.md.
 */
import { execFile as _execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFile = promisify(_execFile);

/** Matches the image the local Supabase CLI uses (config.toml major_version = 15). */
const IMAGE =
  process.env.ITEST_POSTGRES_IMAGE ??
  "public.ecr.aws/supabase/postgres:15.8.1.085";

const MIGRATIONS_DIR = fileURLToPath(
  new URL("../../supabase/migrations", import.meta.url)
);
const SEED_SQL = fileURLToPath(
  new URL("../../supabase/seed.sql", import.meta.url)
);

const PASSWORD = "postgres";

/**
 * The image bakes an older `storage` schema than the app migrations expect
 * (`storage.buckets` has no `public` column — in a real stack the storage-api
 * service migrates it). Add the column before applying migrations so the bucket
 * inserts + policies (and the `feedback` table / xid-to-uuid chain that depend
 * on them) apply cleanly. `storage.buckets` is owned by `supabase_storage_admin`,
 * so this must run as the `supabase_admin` superuser.
 */
const STORAGE_SHIM =
  "ALTER TABLE storage.buckets ADD COLUMN IF NOT EXISTS public boolean NOT NULL DEFAULT false;";

export interface TestDatabase {
  url: string;
  containerName: string;
  stop: () => Promise<void>;
}

function docker(args: string[]) {
  return execFile("docker", args, { maxBuffer: 128 * 1024 * 1024 });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function isDockerAvailable(): Promise<boolean> {
  try {
    await docker(["info"]);
    return true;
  } catch {
    return false;
  }
}

async function waitForReady(container: string): Promise<void> {
  for (let i = 0; i < 60; i++) {
    try {
      await docker(["exec", container, "pg_isready", "-U", "postgres"]);
      return;
    } catch {
      await sleep(1000);
    }
  }
  throw new Error(`Postgres in ${container} never became ready`);
}

async function resolveUrl(container: string): Promise<string> {
  const { stdout } = await docker(["port", container, "5432"]);
  // e.g. "127.0.0.1:49158\n[::]:49158\n" — take the first mapping's port.
  const port = stdout.trim().split("\n")[0]?.split(":").pop();
  if (!port)
    throw new Error(`Could not resolve host port for ${container}: ${stdout}`);
  return `postgresql://postgres:${PASSWORD}@127.0.0.1:${port}/postgres`;
}

async function applySchema(container: string): Promise<void> {
  // Storage shim (as the superuser that owns storage.buckets).
  await docker([
    "exec",
    "-e",
    `PGPASSWORD=${PASSWORD}`,
    container,
    "psql",
    "-U",
    "supabase_admin",
    "-h",
    "127.0.0.1",
    "-d",
    "postgres",
    "-v",
    "ON_ERROR_STOP=1",
    "-q",
    "-c",
    STORAGE_SHIM
  ]);

  // Apply every migration in order, then seed.sql. `set -e` + ON_ERROR_STOP means
  // the first failing statement aborts the whole startup (psql prints the file +
  // line in the rejected error, which surfaces via execFile's stderr).
  await docker([
    "exec",
    container,
    "bash",
    "-c",
    'set -e; for f in $(ls /tmp/migrations/*.sql | sort); do psql -U postgres -v ON_ERROR_STOP=1 -q -f "$f"; done; psql -U postgres -v ON_ERROR_STOP=1 -q -f /tmp/seed.sql'
  ]);
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
    IMAGE
  ]);

  const stop = async () => {
    try {
      await docker(["rm", "-f", containerName]);
    } catch {
      // best-effort teardown
    }
  };

  try {
    await waitForReady(containerName);
    await docker(["cp", MIGRATIONS_DIR, `${containerName}:/tmp/migrations`]);
    await docker(["cp", SEED_SQL, `${containerName}:/tmp/seed.sql`]);
    await applySchema(containerName);
    const url = await resolveUrl(containerName);
    return { url, containerName, stop };
  } catch (err) {
    await stop();
    throw err;
  }
}
