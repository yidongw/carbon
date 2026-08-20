/**
 * API-level integration test for `getBomComponentVariants` (the data source of
 * the /api/items/bom-variants route), against real PostgREST + Postgres.
 *
 * The BOM component picker consumes concrete SKUs, not the abstract variant
 * parent, so this query must:
 *  - return one row per leaf variant SKU (keyed by the stable `variantItemId`),
 *  - carry each SKU's `parentItemId` so the picker can drop the parent,
 *  - carry a readable `attributes` combo built from the attribute value NAMES
 *    (no code combo, no valuesKey read),
 *  - never surface the parent itself as a selectable SKU, and leave plain
 *    non-variant items alone (they aren't variants, so they aren't returned
 *    here — the client keeps them from the items store).
 *
 * The Supabase stack is started once by globalSetup. Each test provisions a
 * fresh company. Skips automatically when Docker is unavailable.
 */
import {
  createPool,
  createTestClient,
  provisionTestCompany
} from "@carbon/database/test";
import { afterAll, beforeAll, describe, expect, inject, it } from "vitest";
import {
  getBomComponentVariants,
  syncItemVariants,
  upsertItemAttribute,
  upsertItemAttributeSet,
  upsertItemAttributeValue
} from "./itemAttribute.service";

const pgUrl = inject("itestPgUrl");
const postgrestUrl = inject("itestPostgrestUrl");
const token = inject("itestServiceRoleToken");
const enabled = Boolean(pgUrl && postgrestUrl && token);

describe.skipIf(!enabled)(
  "integration: getBomComponentVariants (real PostgREST)",
  () => {
    let pool: ReturnType<typeof createPool>;
    let client: ReturnType<typeof createTestClient>;

    beforeAll(() => {
      pool = createPool(pgUrl);
      client = createTestClient(postgrestUrl, token);
    });

    afterAll(async () => {
      await pool?.end();
    });

    async function provision() {
      const connection = await pool.connect();
      try {
        return await provisionTestCompany(connection);
      } finally {
        connection.release();
      }
    }

    // Build a Part with a Color×Size attribute set + selections, so
    // syncItemVariants generates real variant SKUs to read back.
    async function setupVariantParent(
      companyId: string,
      userId: string,
      opts: {
        readableId: string;
        name: string;
        colors: Array<[string, string]>;
        sizes: Array<[string, string]>;
      }
    ) {
      const color = await upsertItemAttribute(client, {
        code: "COLOR",
        name: "Color",
        values: [],
        companyId,
        createdBy: userId
      });
      const size = await upsertItemAttribute(client, {
        code: "SIZE",
        name: "Size",
        values: [],
        companyId,
        createdBy: userId
      });
      const colorId = color.data?.id as string;
      const sizeId = size.data?.id as string;

      const colorValueIds: Record<string, string> = {};
      for (const [code, name] of opts.colors) {
        const v = await upsertItemAttributeValue(client, {
          attributeId: colorId,
          code,
          name,
          companyId,
          createdBy: userId
        });
        colorValueIds[code] = v.data?.id as string;
      }
      const sizeValueIds: Record<string, string> = {};
      for (const [code, name] of opts.sizes) {
        const v = await upsertItemAttributeValue(client, {
          attributeId: sizeId,
          code,
          name,
          companyId,
          createdBy: userId
        });
        sizeValueIds[code] = v.data?.id as string;
      }

      const set = await upsertItemAttributeSet(client, {
        code: "GARMENT",
        name: "Garment",
        attributeIds: [colorId, sizeId],
        companyId,
        createdBy: userId
      });
      const attributeSetId = set.data?.id as string;

      const item = await client
        .from("item")
        .insert({
          readableId: opts.readableId,
          name: opts.name,
          type: "Material",
          replenishmentSystem: "Buy",
          itemTrackingType: "Inventory",
          unitOfMeasureCode: "EA",
          active: true,
          attributeSetId,
          companyId,
          createdBy: userId
        })
        .select("id")
        .single();
      const itemId = (item.data as { id: string }).id;

      const selectionRows = [
        ...Object.values(colorValueIds).map((id) => ({
          itemId,
          attributeId: colorId,
          attributeValueId: id,
          companyId,
          createdBy: userId
        })),
        ...Object.values(sizeValueIds).map((id) => ({
          itemId,
          attributeId: sizeId,
          attributeValueId: id,
          companyId,
          createdBy: userId
        }))
      ];
      const sel = await client
        .from("itemAttributeSelection")
        .insert(selectionRows);
      expect(sel.error).toBeNull();

      await syncItemVariants(client, {
        parentItemId: itemId,
        companyId,
        userId
      });

      return { itemId };
    }

    it("returns one leaf SKU per combo, each tagged with its parentItemId and a value-name combo", async () => {
      const { companyId, userId } = await provision();
      const { itemId: parentId } = await setupVariantParent(companyId, userId, {
        readableId: "FAB-1",
        name: "Fastener Kit",
        colors: [
          ["BK", "Black"],
          ["NV", "Navy"]
        ],
        sizes: [["S", "S"]]
      });

      const result = await getBomComponentVariants(client, companyId);
      expect(result.error).toBeNull();
      const data = result.data ?? [];

      // 2 colors × 1 size = 2 leaf SKUs.
      expect(data).toHaveLength(2);

      // Every row points back at the parent so the picker can drop the parent.
      expect(data.every((r) => r.parentItemId === parentId)).toBe(true);

      // The parent itself is never returned as a selectable SKU.
      expect(data.some((r) => r.variantItemId === parentId)).toBe(false);

      // variantItemId values are the real child item ids.
      const variants = await client
        .from("itemVariant")
        .select("variantItemId")
        .eq("parentItemId", parentId)
        .eq("companyId", companyId);
      const realIds = new Set(
        (variants.data ?? []).map(
          (v: { variantItemId: string }) => v.variantItemId
        )
      );
      expect(data.every((r) => realIds.has(r.variantItemId))).toBe(true);

      // Combos are built from value NAMES (not codes), one per color.
      const combos = data.map((r) => r.attributes);
      expect(combos.some((c) => c.includes("Black") && c.includes("S"))).toBe(
        true
      );
      expect(combos.some((c) => c.includes("Navy") && c.includes("S"))).toBe(
        true
      );
      // No raw code combo leaks in.
      expect(combos.every((c) => !c.includes("BK") && !c.includes("NV"))).toBe(
        true
      );
    });

    it("only returns variant children — a plain non-variant item is not included", async () => {
      const { companyId, userId } = await provision();
      await setupVariantParent(companyId, userId, {
        readableId: "FAB-2",
        name: "Zipper",
        colors: [["BK", "Black"]],
        sizes: [["S", "S"]]
      });

      // A plain Material with no attribute set / no variants.
      const plain = await client
        .from("item")
        .insert({
          readableId: "PLAIN-1",
          name: "Plain Thread",
          type: "Material",
          replenishmentSystem: "Buy",
          itemTrackingType: "Inventory",
          unitOfMeasureCode: "EA",
          active: true,
          companyId,
          createdBy: userId
        })
        .select("id")
        .single();
      const plainId = (plain.data as { id: string }).id;

      const result = await getBomComponentVariants(client, companyId);
      expect(result.error).toBeNull();
      const data = result.data ?? [];

      // Only the single BK|S variant SKU is returned; the plain item is not a
      // variant, so it isn't here (the client sources it from the items store).
      expect(data).toHaveLength(1);
      expect(data.some((r) => r.variantItemId === plainId)).toBe(false);
      expect(data.some((r) => r.parentItemId === plainId)).toBe(false);
    });

    it("returns an empty list for a company with no variants", async () => {
      const { companyId } = await provision();
      const result = await getBomComponentVariants(client, companyId);
      expect(result.error).toBeNull();
      expect(result.data ?? []).toHaveLength(0);
    });
  }
);
