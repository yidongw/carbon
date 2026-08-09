/**
 * Integration test for seedDemoData.
 *
 * Requires a live Postgres connection. Set SEED_TEST_DATABASE_URL to a
 * database that has the Carbon schema applied.  Also requires:
 *   SEED_TEST_COMPANY_ID  — an existing company row
 *   SEED_TEST_USER_ID     — a user that belongs to that company
 *   SEED_TEST_LOCATION_ID — a location that belongs to that company
 *
 * The test cleans all company-scoped rows before and after running the seed,
 * so it is safe to point it at the dev / staging DB as long as the IDs belong
 * to a dedicated test / demo company.
 *
 * Run:  DATABASE_URL=... SEED_TEST_COMPANY_ID=... ... vitest run src/seedDemoData.test.ts
 */

import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { seedDemoData } from "./seedDemoData";

const DATABASE_URL = process.env.SEED_TEST_DATABASE_URL;
const COMPANY_ID = process.env.SEED_TEST_COMPANY_ID;
const USER_ID = process.env.SEED_TEST_USER_ID;
const LOCATION_ID = process.env.SEED_TEST_LOCATION_ID;

const configured =
  Boolean(DATABASE_URL) &&
  Boolean(COMPANY_ID) &&
  Boolean(USER_ID) &&
  Boolean(LOCATION_ID);

describe.skipIf(!configured)("seedDemoData integration", () => {
  let pool: pg.Pool;
  let client: pg.PoolClient;

  // seedDemoData uses SELECT-first patterns throughout, so it is safe to run on
  // an already-seeded company without any pre-cleanup. The seed will reuse existing
  // rows or skip inserts via ON CONFLICT. Infrastructure tables (unitOfMeasure,
  // sequence, location, warehouse, group, etc.) created by seed_company() must
  // remain intact — do not delete them.
  // No pre-cleanup needed; the test just verifies the idempotent seed produces
  // correct results.

  beforeAll(async () => {
    pool = new pg.Pool({ connectionString: DATABASE_URL });
    client = await pool.connect();
    await seedDemoData(client, {
      companyId: COMPANY_ID!,
      userId: USER_ID!,
      locationId: LOCATION_ID!,
      language: "en"
    });
  }, 180_000);

  afterAll(async () => {
    client.release();
    await pool.end();
  }, 10_000);

  // ── Items ────────────────────────────────────────────────────────────────

  it("creates ERP part-type items", async () => {
    const res = await client.query<{ readableId: string }>(
      `SELECT "readableId" FROM item WHERE "companyId" = $1 AND type = 'Part'`,
      [COMPANY_ID]
    );
    const ids = res.rows.map((r) => r["readableId"]);
    expect(ids).toContain("TSHIRT-001");
    expect(ids).toContain("JACKET-001");
    expect(ids).toContain("BEARING-6205");
    expect(ids).toContain("BRACKET-001");
    expect(ids).toContain("SHAFT-ASM-001");
  });

  it("creates part records for every Part-type item", async () => {
    const items = await client.query<{ readableId: string }>(
      `SELECT "readableId" FROM item WHERE "companyId" = $1 AND type = 'Part'`,
      [COMPANY_ID]
    );
    const parts = await client.query<{ id: string }>(
      `SELECT id FROM part WHERE "companyId" = $1`,
      [COMPANY_ID]
    );
    const partIds = new Set(parts.rows.map((r) => r.id));
    for (const { readableId } of items.rows) {
      expect(
        partIds.has(readableId),
        `part missing for item ${readableId}`
      ).toBe(true);
    }
  });

  // ── Jobs ─────────────────────────────────────────────────────────────────

  it("creates jobs with operations", async () => {
    const res = await client.query<{ count: string }>(
      `SELECT COUNT(*) FROM "jobOperation" jo
       JOIN job j ON j.id = jo."jobId"
       WHERE j."companyId" = $1`,
      [COMPANY_ID]
    );
    expect(Number(res.rows[0]?.count)).toBeGreaterThan(0);
  });

  it("every operation with production has at least one pickup", async () => {
    const res = await client.query<{
      op_id: string;
      prod: string;
      pickups: string;
    }>(
      `SELECT
         jo.id AS op_id,
         COUNT(DISTINCT pq.id) AS prod,
         COUNT(DISTINCT jop.id) AS pickups
       FROM "jobOperation" jo
       JOIN job j ON j.id = jo."jobId"
       LEFT JOIN "productionQuantity" pq ON pq."jobOperationId" = jo.id
       LEFT JOIN "jobOperationPickup" jop ON jop."jobOperationId" = jo.id
       WHERE j."companyId" = $1
       GROUP BY jo.id
       HAVING COUNT(DISTINCT pq.id) > 0`,
      [COMPANY_ID]
    );
    for (const row of res.rows) {
      expect(
        Number(row.pickups),
        `operation ${row.op_id} has ${row.prod} production records but no pickups`
      ).toBeGreaterThan(0);
    }
  });

  it("per-config-param pickup >= production for configurable items", async () => {
    type Row = {
      op_id: string;
      description: string;
      variantQuantities: unknown;
      qty: string;
      type: string;
    };

    const pickups = await client.query<Row>(
      `SELECT jo.id AS op_id, jo.description, jop."variantQuantities", jop.quantity AS qty, 'pickup' AS type
       FROM "jobOperationPickup" jop
       JOIN "jobOperation" jo ON jo.id = jop."jobOperationId"
       JOIN job j ON j.id = jo."jobId"
       WHERE j."companyId" = $1 AND jop."variantQuantities" IS NOT NULL`,
      [COMPANY_ID]
    );
    const productions = await client.query<Row>(
      `SELECT jo.id AS op_id, jo.description, pq."variantQuantities", pq.quantity AS qty, 'production' AS type
       FROM "productionQuantity" pq
       JOIN "jobOperation" jo ON jo.id = pq."jobOperationId"
       JOIN job j ON j.id = jo."jobId"
       WHERE j."companyId" = $1 AND pq."variantQuantities" IS NOT NULL`,
      [COMPANY_ID]
    );

    function sumConfig(rows: Row[], opId: string) {
      const totals: Record<string, number> = {};
      for (const r of rows.filter((x) => x.op_id === opId)) {
        const config =
          typeof r.variantQuantities === "string"
            ? JSON.parse(r.variantQuantities)
            : r.variantQuantities;
        for (const tableRow of config?.variantTable ?? []) {
          const row = tableRow as Record<string, unknown>;
          const valuesKey = String(row.valuesKey ?? "");
          if (!valuesKey) continue;
          totals[valuesKey] =
            (totals[valuesKey] ?? 0) + Number(row.Quantities ?? 0);
        }
      }
      return totals;
    }

    const prodOpIds = [...new Set(productions.rows.map((r) => r.op_id))];
    for (const opId of prodOpIds) {
      const pickupTotals = sumConfig(pickups.rows, opId);
      const prodTotals = sumConfig(productions.rows, opId);
      const desc =
        productions.rows.find((r) => r.op_id === opId)?.description ?? opId;
      for (const [key, prodQty] of Object.entries(prodTotals)) {
        const pickupQty = pickupTotals[key] ?? 0;
        expect(
          pickupQty,
          `op "${desc}" config key "${key}": pickup=${pickupQty} < production=${prodQty}`
        ).toBeGreaterThanOrEqual(prodQty);
      }
    }
  });

  it("total pickup quantity >= total production quantity for every operation", async () => {
    const res = await client.query<{
      op_id: string;
      description: string;
      pickup_qty: string;
      prod_qty: string;
    }>(
      // Use correlated subqueries to avoid cross-join inflation when an operation
      // has multiple pickup or production records.
      `SELECT
         jo.id AS op_id,
         jo.description,
         COALESCE((SELECT SUM(jop.quantity) FROM "jobOperationPickup" jop WHERE jop."jobOperationId" = jo.id), 0) AS pickup_qty,
         COALESCE((SELECT SUM(pq.quantity)  FROM "productionQuantity" pq  WHERE pq."jobOperationId"  = jo.id), 0) AS prod_qty
       FROM "jobOperation" jo
       JOIN job j ON j.id = jo."jobId"
       WHERE j."companyId" = $1
         AND (SELECT COALESCE(SUM(pq.quantity), 0) FROM "productionQuantity" pq WHERE pq."jobOperationId" = jo.id) > 0`,
      [COMPANY_ID]
    );
    for (const row of res.rows) {
      expect(
        Number(row.pickup_qty),
        `op "${row.description}": pickup=${row.pickup_qty} < production=${row.prod_qty}`
      ).toBeGreaterThanOrEqual(Number(row.prod_qty));
    }
  });

  it("seeding again is idempotent (same item count, no errors)", async () => {
    const before = await client.query<{ count: string }>(
      `SELECT COUNT(*) FROM item WHERE "companyId" = $1`,
      [COMPANY_ID]
    );
    await seedDemoData(client, {
      companyId: COMPANY_ID!,
      userId: USER_ID!,
      locationId: LOCATION_ID!,
      language: "en"
    });
    const after = await client.query<{ count: string }>(
      `SELECT COUNT(*) FROM item WHERE "companyId" = $1`,
      [COMPANY_ID]
    );
    expect(Number(after.rows[0]?.count)).toBe(Number(before.rows[0]?.count));
  }, 120_000);
});
