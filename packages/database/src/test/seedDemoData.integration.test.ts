/**
 * Integration test for `seedDemoData` against a real Postgres with the full
 * Carbon schema applied (started once by globalSetup — see ./globalSetup.ts).
 *
 * This is the DB-suite's sole test: `seedDemoData` (the ~100-step "Try the demo"
 * seeder) is heavy, takes a direct `pg` client, and is exercised by nothing
 * else. Migration/`seed.sql`/`seed_company` correctness is already covered by
 * the ERP API suite, which applies the same schema and provisions a company via
 * `seed_company` before every test — so those checks aren't duplicated here.
 *
 * Runs inside a rolled-back transaction; skips when Docker is unavailable.
 */
import pg from "pg";
import { afterAll, beforeAll, describe, expect, inject, it } from "vitest";
import { seedDemoData } from "../seedDemoData";
import { withRollback } from "./harness";
import { provisionTestCompany } from "./provision";

const url = inject("itestDbUrl");

describe.skipIf(!url)("integration: seedDemoData (real database)", () => {
  let pool: pg.Pool;

  beforeAll(() => {
    pool = new pg.Pool({ connectionString: url, max: 4 });
  });

  afterAll(async () => {
    await pool?.end();
  });

  it("seeds demo data (items, customers, suppliers) into a provisioned company", async () => {
    await withRollback(pool, async (client) => {
      const { companyId, userId, locationId } =
        await provisionTestCompany(client);

      await seedDemoData(client, {
        companyId,
        userId,
        locationId,
        language: "en"
      });

      const items = await client.query<{ n: number }>(
        `SELECT count(*)::int AS n FROM item WHERE "companyId" = $1`,
        [companyId]
      );
      expect(items.rows[0]!.n).toBeGreaterThan(0);

      const customers = await client.query<{ n: number }>(
        `SELECT count(*)::int AS n FROM customer WHERE "companyId" = $1`,
        [companyId]
      );
      expect(customers.rows[0]!.n).toBeGreaterThan(0);

      const suppliers = await client.query<{ n: number }>(
        `SELECT count(*)::int AS n FROM supplier WHERE "companyId" = $1`,
        [companyId]
      );
      expect(suppliers.rows[0]!.n).toBeGreaterThan(0);
    });
  }, 120_000);
});
