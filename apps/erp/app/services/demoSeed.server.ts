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
}) {
  const admin = getCarbonServiceRole();
  const pool = getPostgresConnectionPool(1);
  const client = await pool.connect();
  try {
    await seedDemoData(client, opts);
  } catch (error) {
    console.error(`Demo seed for ${opts.companyId} stopped early:`, error);
  } finally {
    client.release();
    await pool.end();
    // Only mark 'seeded' if data was actually created. A zero-item outcome means
    // the seed failed entirely; marking it 'failed' lets the loader's data-presence
    // check retry on the next visit rather than silently looping forever.
    const { count } = await admin
      .from("item")
      .select("id", { count: "exact", head: true })
      .eq("companyId", opts.companyId);
    await admin
      .from("demoCompany")
      .update({ seedStatus: (count ?? 0) > 0 ? "seeded" : "failed" })
      .eq("id", opts.companyId);
  }
}
