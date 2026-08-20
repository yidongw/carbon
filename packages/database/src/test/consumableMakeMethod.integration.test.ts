import pg from "pg";
import { afterAll, beforeAll, describe, expect, inject, it } from "vitest";
import { withRollback } from "./harness";
import { provisionTestCompany } from "./provision";

// Real-DB integration test for the "Consumables can be manufactured" feature
// (migration 20260818113247_consumable-make-method.sql). Models the garment
// supply chain: finished fabric (成品布, Consumable/Make) is made from greige
// (胚布, Consumable/Buy) via an OUTSIDE 印染 (dyeing) operation, and both the
// greige material and the dyeing operation live on the fabric's make method so
// their cost rolls up. Skips cleanly (green) when Docker is unavailable.

const url = inject("itestDbUrl");

async function insertConsumable(
  client: pg.PoolClient,
  companyId: string,
  userId: string,
  opts: {
    readableId: string;
    name: string;
    replenishmentSystem: "Buy" | "Make" | "Buy and Make";
    defaultMethodType:
      | "Purchase to Order"
      | "Pull from Inventory"
      | "Make to Order";
    itemTrackingType?: "Inventory" | "Non-Inventory";
  }
): Promise<string> {
  const { rows } = await client.query<{ id: string }>(
    `INSERT INTO item ("readableId", name, description, type,
        "replenishmentSystem", "defaultMethodType", "itemTrackingType",
        "unitOfMeasureCode", active, "companyId", "createdBy")
     VALUES ($1, $2, '', 'Consumable'::"itemType",
        $3::"itemReplenishmentSystem", $4::"methodType", $5::"itemTrackingType",
        'EA', true, $6, $7)
     RETURNING id`,
    [
      opts.readableId,
      opts.name,
      opts.replenishmentSystem,
      opts.defaultMethodType,
      opts.itemTrackingType ?? "Non-Inventory",
      companyId,
      userId
    ]
  );
  // Mirror the app: give the Consumable its type-specific extension row.
  await client.query(
    `INSERT INTO consumable (id, "companyId", "createdBy")
     VALUES ($1, $2, $3) ON CONFLICT (id, "companyId") DO NOTHING`,
    [rows[0]!.id, companyId, userId]
  );
  return rows[0]!.id;
}

async function makeMethodIdFor(
  client: pg.PoolClient,
  itemId: string,
  companyId: string
): Promise<string | undefined> {
  const { rows } = await client.query<{ id: string }>(
    `SELECT id FROM "makeMethod" WHERE "itemId" = $1 AND "companyId" = $2`,
    [itemId, companyId]
  );
  return rows[0]?.id;
}

describe.skipIf(!url)(
  "integration: consumable make method (real database)",
  () => {
    let pool: pg.Pool;

    beforeAll(() => {
      pool = new pg.Pool({ connectionString: url, max: 4 });
    });
    afterAll(async () => {
      await pool?.end();
    });

    it("auto-creates a makeMethod when a Consumable item is inserted", async () => {
      await withRollback(pool, async (client) => {
        const { companyId, userId } = await provisionTestCompany(client);

        const itemId = await insertConsumable(client, companyId, userId, {
          readableId: "GREIGE",
          name: "Greige fabric",
          replenishmentSystem: "Buy",
          defaultMethodType: "Pull from Inventory",
          itemTrackingType: "Inventory"
        });

        // The interceptor now fires for Consumable inserts (was Part/Tool/Style).
        const mmId = await makeMethodIdFor(client, itemId, companyId);
        expect(mmId).toBeTruthy();
      });
    }, 120_000);

    it("holds greige (material) + outside dyeing (operation) on the finished-fabric make method so cost can roll up", async () => {
      await withRollback(pool, async (client) => {
        const { companyId, userId } = await provisionTestCompany(client);

        // 胚布 greige — bought, unit cost 10.
        const greige = await insertConsumable(client, companyId, userId, {
          readableId: "GREIGE",
          name: "Greige fabric",
          replenishmentSystem: "Buy",
          defaultMethodType: "Pull from Inventory",
          itemTrackingType: "Inventory"
        });
        await client.query(
          `UPDATE "itemCost" SET "unitCost" = 10 WHERE "itemId" = $1 AND "companyId" = $2`,
          [greige, companyId]
        );

        // 成品布 finished fabric — made to order.
        const fabric = await insertConsumable(client, companyId, userId, {
          readableId: "FINFAB",
          name: "Finished fabric",
          replenishmentSystem: "Make",
          defaultMethodType: "Make to Order"
        });
        const fabricMM = await makeMethodIdFor(client, fabric, companyId);
        expect(fabricMM).toBeTruthy();

        // 印染 dyeing — an OUTSIDE (subcontract) process.
        const { rows: procRows } = await client.query<{ id: string }>(
          `INSERT INTO process (name, "processType", "defaultStandardFactor",
              "companyId", "createdBy")
           VALUES ('Dyeing', 'Outside'::"processType", 'Minutes/Piece'::factor,
              $1, $2)
           RETURNING id`,
          [companyId, userId]
        );
        const dyeing = procRows[0]!.id;

        // Outside dyeing operation on the fabric's make method, unit cost 5.
        await client.query(
          `INSERT INTO "methodOperation" ("makeMethodId", description, "processId",
              "operationType", "operationUnitCost", "order", "companyId", "createdBy")
           VALUES ($1, 'Dye greige', $2, 'Outside'::"operationType", 5, 1, $3, $4)`,
          [fabricMM, dyeing, companyId, userId]
        );

        // Greige as a BOM material on the fabric's make method, quantity 2.
        await client.query(
          `INSERT INTO "methodMaterial" ("makeMethodId", "itemId", "itemType",
              "methodType", quantity, "unitOfMeasureCode", "order",
              "companyId", "createdBy")
           VALUES ($1, $2, 'Consumable', 'Pull from Inventory', 2, 'EA', 1, $3, $4)`,
          [fabricMM, greige, companyId, userId]
        );

        // Explode the finished-fabric make method.
        const tree = await client.query(`SELECT * FROM get_method_tree($1)`, [
          fabricMM
        ]);
        const greigeRow = tree.rows.find(
          (r: { itemId: string }) => r.itemId === greige
        );
        expect(
          greigeRow,
          "greige should appear in the fabric's method tree"
        ).toBeTruthy();
        expect(Number(greigeRow.quantity)).toBe(2);
        expect(greigeRow.itemType).toBe("Consumable");

        // Material basis: greige unitCost(10) * qty(2) = 20.
        const cost = await client.query<{ unitCost: string }>(
          `SELECT "unitCost" FROM "itemCost" WHERE "itemId" = $1 AND "companyId" = $2`,
          [greige, companyId]
        );
        expect(Number(cost.rows[0]!.unitCost)).toBe(10);

        // Outside dyeing operation is present with its cost (rolled up TS-side).
        const op = await client.query<{
          operationType: string;
          operationUnitCost: string;
        }>(
          `SELECT "operationType", "operationUnitCost"
           FROM "methodOperation" WHERE "makeMethodId" = $1`,
          [fabricMM]
        );
        expect(op.rowCount).toBe(1);
        expect(op.rows[0]!.operationType).toBe("Outside");
        expect(Number(op.rows[0]!.operationUnitCost)).toBe(5);
      });
    }, 120_000);
  }
);
