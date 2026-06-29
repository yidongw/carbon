import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { getPostgresConnectionPool } from "@carbon/database/client";
import { seedDemoData } from "@carbon/database/seed-demo";

/**
 * Runs the demo seed over a direct pg connection and marks the company seeded.
 *
 * This lives in a `.server` module so `pg` / the large seed bundle never leak into
 * the client build (importing them from a route module crashes hydration). Called
 * detached (not awaited) from the demo.seed action — a long-running Node server keeps
 * the promise alive after the response.
 */
export async function runDemoSeed(opts: {
  companyId: string;
  userId: string;
  locationId: string;
  email: string;
  firstName: string;
}) {
  const admin = getCarbonServiceRole();
  const pool = getPostgresConnectionPool(1);
  const client = await pool.connect();
  try {
    await seedDemoData(client, opts);
  } catch (error) {
    // Best-effort: steps auto-commit, so partial data is kept. Mark seeded anyway so
    // the user gets the populated demo and we don't re-trigger on every load.
    console.error(`Demo seed for ${opts.companyId} stopped early:`, error);
  } finally {
    client.release();
    await pool.end();
    await admin
      .from("company")
      .update({ demoSeedStatus: "seeded" })
      .eq("id", opts.companyId);
  }
}
