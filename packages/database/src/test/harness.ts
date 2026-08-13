/**
 * Helpers for connecting to the integration-test database and isolating writes.
 *
 * Reset strategy for the direct-SQL path: one transaction per test, rolled back
 * afterwards. Nothing is ever committed, so tests never see each other's writes
 * and no truncate/reseed is needed. (Transaction rollback cannot be used through
 * the Supabase/PostgREST HTTP client — that path uses its own pooled
 * connections — so a truncate/snapshot reset is the follow-up for those tests.)
 */
import pg from "pg";

export function createPool(url: string): pg.Pool {
  return new pg.Pool({ connectionString: url, max: 4 });
}

/**
 * Run `fn` inside a transaction that is always rolled back. Any write `fn` makes
 * (directly or via a trigger) is discarded, giving each test a clean slate.
 */
export async function withRollback<T>(
  pool: pg.Pool,
  fn: (client: pg.PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    return await fn(client);
  } finally {
    await client.query("ROLLBACK").catch(() => {});
    client.release();
  }
}
