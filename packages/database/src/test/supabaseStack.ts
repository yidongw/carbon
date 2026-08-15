/**
 * Full Supabase stack for API-level integration tests: a Postgres container
 * (full Carbon schema) + PostgREST on a shared Docker network, so supabase-js
 * service functions can be driven over real HTTP.
 *
 * Returns both a direct `pgUrl` (for provisioning fixtures via `pg`) and a
 * `postgrestUrl` + `serviceRoleToken` (for building a supabase-js client via
 * `createTestClient`).
 *
 * Reset note: transaction rollback cannot isolate PostgREST (it uses its own
 * pooled connections), so tests isolate by provisioning a fresh company per
 * test — writes are companyId-scoped and the whole container is thrown away
 * after the run.
 */
import {
  applyCarbonSchema,
  docker,
  JWT_SECRET,
  PASSWORD,
  PG_IMAGE,
  POSTGREST_IMAGE,
  resolveHostPort,
  setAuthenticatorPassword,
  sleep,
  waitForPgReady,
} from "./dockerHarness";
import { serviceRoleToken as mintServiceRoleToken } from "./jwt";

export interface SupabaseStack {
  /** Direct Postgres connection — for provisioning fixtures with `pg`. */
  pgUrl: string;
  /** Base URL for a supabase-js client (before the `/rest/v1` prefix). */
  postgrestUrl: string;
  jwtSecret: string;
  /** Full-access token (RLS bypass) for a supabase-js client. */
  serviceRoleToken: string;
  /** Docker resource names — so a separate process (CI) can tear the stack down. */
  resources: { network: string; pgContainer: string; restContainer: string };
  stop: () => Promise<void>;
}

async function waitForPostgrest(url: string): Promise<void> {
  for (let i = 0; i < 60; i++) {
    try {
      // PostgREST answers the root path once its schema cache is loaded.
      const res = await fetch(`${url}/`);
      if (res.status < 500) return;
    } catch {
      // not up yet
    }
    await sleep(1000);
  }
  throw new Error(`PostgREST at ${url} never became ready`);
}

export async function startSupabaseStack(): Promise<SupabaseStack> {
  const id = `${process.pid}-${Date.now()}`;
  const network = `carbon-itest-net-${id}`;
  const pg = `carbon-itest-pg-${id}`;
  const rest = `carbon-itest-rest-${id}`;

  await docker(["network", "create", network]);

  const stop = async () => {
    for (const name of [rest, pg]) {
      try {
        await docker(["rm", "-f", name]);
      } catch {
        // best-effort
      }
    }
    try {
      await docker(["network", "rm", network]);
    } catch {
      // best-effort
    }
  };

  try {
    // Postgres — reachable inside the network as `db`.
    await docker([
      "run",
      "-d",
      "--name",
      pg,
      "--network",
      network,
      "--network-alias",
      "db",
      "-e",
      `POSTGRES_PASSWORD=${PASSWORD}`,
      "-p",
      "127.0.0.1::5432",
      PG_IMAGE,
    ]);
    await waitForPgReady(pg);
    await applyCarbonSchema(pg);
    await setAuthenticatorPassword(pg);

    // PostgREST — started after the schema exists so its startup introspection
    // is complete (no NOTIFY reload needed).
    await docker([
      "run",
      "-d",
      "--name",
      rest,
      "--network",
      network,
      "-p",
      "127.0.0.1::3000",
      "-e",
      `PGRST_DB_URI=postgresql://authenticator:${PASSWORD}@db:5432/postgres`,
      "-e",
      "PGRST_DB_SCHEMAS=public,storage",
      "-e",
      "PGRST_DB_ANON_ROLE=anon",
      "-e",
      `PGRST_JWT_SECRET=${JWT_SECRET}`,
      POSTGREST_IMAGE,
    ]);

    const pgPort = await resolveHostPort(pg, 5432);
    const restPort = await resolveHostPort(rest, 3000);
    const postgrestUrl = `http://127.0.0.1:${restPort}`;
    await waitForPostgrest(postgrestUrl);

    return {
      pgUrl: `postgresql://postgres:${PASSWORD}@127.0.0.1:${pgPort}/postgres`,
      postgrestUrl,
      jwtSecret: JWT_SECRET,
      serviceRoleToken: mintServiceRoleToken(JWT_SECRET),
      resources: { network, pgContainer: pg, restContainer: rest },
      stop,
    };
  } catch (err) {
    await stop();
    throw err;
  }
}
