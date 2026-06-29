import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { getPostgresConnectionPool } from "@carbon/database/client";
import { seedDemoData } from "@carbon/database/seed-demo";
import { inngest } from "../../client";

/**
 * Populates a freshly-created demo company with realistic sample data (items,
 * suppliers, customers, BOMs, purchase/sales orders, a manufacturing job, etc.)
 * so every module feels alive. Runs in the background after "Try the demo" so the
 * user isn't blocked while the (large) seed runs.
 *
 * Reuses the proven CLI seed logic via the extracted `seedDemoData` (raw SQL over
 * a pg connection), the same pattern other jobs use (queue/sync/accounting-backfill).
 */
export const demoSeedFunction = inngest.createFunction(
  // No retries: the seed is not transactional and not fully idempotent (it inserts
  // contacts/addresses unconditionally), so a retry would duplicate rows. Each step
  // auto-commits, so a mid-seed failure still leaves the demo populated.
  { id: "demo-seed", retries: 0 },
  { event: "carbon/demo.seed" },
  async ({ event, step }) => {
    const { companyId, userId, locationId } = event.data;

    await step.run("seed-demo-data", async () => {
      const carbon = getCarbonServiceRole();
      const { data: user } = await carbon
        .from("user")
        .select("email, firstName")
        .eq("id", userId)
        .single();

      const pool = getPostgresConnectionPool(1);
      const client = await pool.connect();
      try {
        await seedDemoData(client, {
          companyId,
          userId,
          locationId,
          email: user?.email ?? "demo@example.com",
          firstName: user?.firstName ?? "Demo"
        });
        console.log(`Seeded demo data for company ${companyId}`);
      } catch (error) {
        // Best-effort: steps auto-commit, so a mid-seed failure (e.g. a table the
        // target DB hasn't migrated yet) still leaves the demo populated with
        // everything seeded so far. Log it but don't rethrow — the demo is usable,
        // and a retry would duplicate the non-idempotent rows.
        console.error(
          `Demo seed for company ${companyId} stopped early (partial data kept):`,
          error
        );
      } finally {
        client.release();
        await pool.end();
      }
    });
  }
);
