/**
 * Shared Docker orchestration for the integration-test harnesses.
 *
 * Both the direct-SQL harness (`testDatabase.ts`) and the full Supabase stack
 * harness (`supabaseStack.ts`) build on these helpers, so the image tags, the
 * storage shim, and the migration-apply logic live in exactly one place.
 */
import { execFile as _execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFile = promisify(_execFile);

/** Matches the image the local Supabase CLI uses (config.toml major_version = 15). */
export const PG_IMAGE =
  process.env.ITEST_POSTGRES_IMAGE ??
  "public.ecr.aws/supabase/postgres:15.8.1.085";

/** PostgREST image (the REST layer supabase-js talks to). */
export const POSTGREST_IMAGE =
  process.env.ITEST_POSTGREST_IMAGE ?? "public.ecr.aws/supabase/postgrest:v14.10";

export const PASSWORD = "postgres";

/**
 * HS256 secret PostgREST uses to verify JWTs. The service-role/authenticated
 * tokens the tests mint are signed with this (see jwt.ts). It only ever guards
 * an ephemeral throwaway container, so a fixed well-known value is fine.
 */
export const JWT_SECRET =
  "super-secret-jwt-token-with-at-least-32-characters-long";

export const MIGRATIONS_DIR = fileURLToPath(
  new URL("../../supabase/migrations", import.meta.url)
);
export const SEED_SQL = fileURLToPath(
  new URL("../../supabase/seed.sql", import.meta.url)
);

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

export function docker(args: string[]) {
  return execFile("docker", args, { maxBuffer: 128 * 1024 * 1024 });
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function isDockerAvailable(): Promise<boolean> {
  try {
    await docker(["info"]);
    return true;
  } catch {
    return false;
  }
}

/** Wait until Postgres answers on its unix socket (via pg_isready). */
export async function waitForPgReady(container: string): Promise<void> {
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

/**
 * Wait until `supabase_admin` (the superuser) can connect over TCP. pg_isready
 * can pass on the socket a beat before the TCP listener + auth are ready, and
 * the superuser work below needs TCP.
 */
async function waitForAdminTcp(container: string): Promise<void> {
  for (let i = 0; i < 60; i++) {
    try {
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
        "-tAc",
        "select 1",
      ]);
      return;
    } catch {
      await sleep(1000);
    }
  }
  throw new Error(`supabase_admin never became reachable in ${container}`);
}

function psqlSuperuser(container: string, sql: string) {
  return docker([
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
    sql,
  ]);
}

/** Resolve the random host port Docker mapped for a container port. */
export async function resolveHostPort(
  container: string,
  containerPort: number
): Promise<string> {
  const { stdout } = await docker(["port", container, String(containerPort)]);
  // e.g. "127.0.0.1:49158\n[::]:49158\n" — take the first mapping's port.
  const port = stdout.trim().split("\n")[0]?.split(":").pop();
  if (!port)
    throw new Error(`Could not resolve host port for ${container}: ${stdout}`);
  return port;
}

/**
 * Apply the storage shim + every migration (in order) + seed.sql to a running
 * Postgres container. `set -e` + ON_ERROR_STOP means the first failing statement
 * aborts (psql prints the file + line in the rejected error).
 */
export async function applyCarbonSchema(container: string): Promise<void> {
  await waitForAdminTcp(container);
  await psqlSuperuser(container, STORAGE_SHIM);
  await docker(["cp", MIGRATIONS_DIR, `${container}:/tmp/migrations`]);
  await docker(["cp", SEED_SQL, `${container}:/tmp/seed.sql`]);
  await docker([
    "exec",
    container,
    "bash",
    "-c",
    'set -e; for f in $(ls /tmp/migrations/*.sql | sort); do psql -U postgres -v ON_ERROR_STOP=1 -q -f "$f"; done; psql -U postgres -v ON_ERROR_STOP=1 -q -f /tmp/seed.sql',
  ]);
}

/**
 * Give the `authenticator` role (which PostgREST logs in as) a password. Must
 * run as the superuser and before PostgREST starts.
 */
export async function setAuthenticatorPassword(container: string): Promise<void> {
  await psqlSuperuser(
    container,
    `ALTER ROLE authenticator WITH LOGIN PASSWORD '${PASSWORD}';`
  );
}
