/**
 * Integration tests against a real Postgres with the full Carbon schema applied.
 *
 * These exercise real SQL — triggers, event interceptors, `seed_company()`,
 * `seedDemoData()` — not mocks. The database is started once by globalSetup
 * (see ./globalSetup.ts). Each test runs inside a rolled-back transaction, so
 * they are fully isolated and require no cleanup.
 *
 * Skips automatically when Docker is unavailable.
 */
import pg from "pg";
import { afterAll, beforeAll, describe, expect, inject, it } from "vitest";
import { seedDemoData } from "../seedDemoData";
import { withRollback } from "./harness";
import { provisionTestCompany } from "./provision";

const url = inject("itestDbUrl");

describe.skipIf(!url)("integration: real database", () => {
  let pool: pg.Pool;

  beforeAll(() => {
    pool = new pg.Pool({ connectionString: url, max: 4 });
  });

  afterAll(async () => {
    await pool?.end();
  });

  it("provisions a company via seed_company (accounts, employee types, groups, user link)", async () => {
    await withRollback(pool, async (client) => {
      const { companyId, userId } = await provisionTestCompany(client);

      const links = await client.query<{ n: number }>(
        `SELECT count(*)::int AS n FROM "userToCompany" WHERE "userId" = $1 AND "companyId" = $2`,
        [userId, companyId]
      );
      expect(links.rows[0]!.n).toBe(1);

      const empTypes = await client.query<{ n: number }>(
        `SELECT count(*)::int AS n FROM "employeeType" WHERE "companyId" = $1`,
        [companyId]
      );
      expect(empTypes.rows[0]!.n).toBeGreaterThan(0);

      const groups = await client.query<{ n: number }>(
        `SELECT count(*)::int AS n FROM "group" WHERE "companyId" = $1`,
        [companyId]
      );
      expect(groups.rows[0]!.n).toBeGreaterThan(0);
    });
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

  it("withRollback isolates writes between tests", async () => {
    const marker = `itest-marker-${Date.now()}`;

    await withRollback(pool, async (client) => {
      const { companyId, userId } = await provisionTestCompany(client);
      await client.query(
        `INSERT INTO "customerType" (name, "companyId", "createdBy") VALUES ($1, $2, $3)`,
        [marker, companyId, userId]
      );
      const inside = await client.query<{ n: number }>(
        `SELECT count(*)::int AS n FROM "customerType" WHERE name = $1`,
        [marker]
      );
      expect(inside.rows[0]!.n).toBe(1);
    });

    // After rollback the row must be gone.
    const client = await pool.connect();
    try {
      const after = await client.query<{ n: number }>(
        `SELECT count(*)::int AS n FROM "customerType" WHERE name = $1`,
        [marker]
      );
      expect(after.rows[0]!.n).toBe(0);
    } finally {
      client.release();
    }
  });
});
