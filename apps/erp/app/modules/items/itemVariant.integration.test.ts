/**
 * API-level integration test for the variant model, against real PostgREST +
 * Postgres. Exercises behaviour that mock-based unit tests cannot:
 *  - `syncItemVariants` generates one variant SKU (child item + itemVariant +
 *    itemVariantAttribute) per attribute-selection combo, and is idempotent.
 *  - `itemVariant.valuesKey` is owned by the DB trigger (the app never writes it):
 *    it equals string_agg(attributeValueId ORDER BY attributeId COLLATE "C"),
 *    stays unique per combo, and is populated on the attribute-row insert.
 *  - `getStyleVariantQuantityParameters` maps each stable `variantItemId` to its
 *    display label built from the attribute value NAMES (no code combo, no
 *    valuesKey read).
 *  - shrinking the selections archives (deactivates) the unselected variants.
 *
 * The Supabase stack is started once by globalSetup
 * (app/test/integration/globalSetup.ts). Tests isolate by provisioning a fresh
 * company each. Skips automatically when Docker is unavailable.
 */
import {
  createPool,
  createTestClient,
  provisionTestCompany
} from "@carbon/database/test";
import { afterAll, beforeAll, describe, expect, inject, it } from "vitest";
import {
  getStyleVariantQuantityParameters,
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
  "integration: item variants API (real PostgREST + trigger)",
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

    // Build a Part with a Color×Size attribute set + the given selections, so
    // syncItemVariants has a set + selections to generate variants from.
    async function setupItem(
      companyId: string,
      userId: string,
      opts: { colors: Array<[string, string]>; sizes: Array<[string, string]> }
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
          readableId: "TVAR-1",
          name: "Test Variant Parent",
          type: "Part",
          replenishmentSystem: "Make",
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

      return { itemId, colorId, sizeId, colorValueIds, sizeValueIds };
    }

    it("generates a variant SKU per combo; the DB trigger owns valuesKey", async () => {
      const { companyId, userId } = await provision();
      const { itemId, colorId, sizeId, colorValueIds, sizeValueIds } =
        await setupItem(companyId, userId, {
          colors: [
            ["BK", "Black"],
            ["NV", "Navy"]
          ],
          sizes: [
            ["S", "S"],
            ["M", "M"]
          ]
        });

      const synced = await syncItemVariants(client, {
        parentItemId: itemId,
        companyId,
        userId
      });
      expect(synced.error).toBeNull();
      expect(synced.data.created).toBe(4); // 2 colors × 2 sizes

      const variants = await client
        .from("itemVariant")
        .select("id, variantItemId, valuesKey")
        .eq("parentItemId", itemId)
        .eq("companyId", companyId);
      expect(variants.error).toBeNull();
      const rows = (variants.data ?? []) as Array<{
        id: string;
        variantItemId: string;
        valuesKey: string | null;
      }>;
      expect(rows).toHaveLength(4);

      // The app never writes valuesKey; the trigger must have populated all four
      // with a distinct fingerprint.
      expect(rows.every((r) => (r.valuesKey ?? "").length > 0)).toBe(true);
      expect(new Set(rows.map((r) => r.valuesKey)).size).toBe(4);

      // Each variantItemId points at a real child item.
      for (const r of rows) {
        const child = await client
          .from("item")
          .select("id")
          .eq("id", r.variantItemId)
          .maybeSingle();
        expect(child.data).toBeTruthy();
      }

      // valuesKey matches the trigger formula for the BK|S combo: the two
      // attributeValueIds joined by "|", ordered by attributeId (byte order).
      const bkS = [
        { attributeId: colorId, valueId: colorValueIds.BK },
        { attributeId: sizeId, valueId: sizeValueIds.S }
      ]
        .sort((a, b) =>
          a.attributeId < b.attributeId
            ? -1
            : a.attributeId > b.attributeId
              ? 1
              : 0
        )
        .map((p) => p.valueId)
        .join("|");
      const bkSVariant = await client
        .from("itemVariant")
        .select("valuesKey")
        .eq("parentItemId", itemId)
        .eq("valuesKey", bkS)
        .maybeSingle();
      expect(bkSVariant.data).toBeTruthy();
    });

    it("is idempotent: re-running does not duplicate variants", async () => {
      const { companyId, userId } = await provision();
      const { itemId } = await setupItem(companyId, userId, {
        colors: [["BK", "Black"]],
        sizes: [
          ["S", "S"],
          ["M", "M"]
        ]
      });

      const first = await syncItemVariants(client, {
        parentItemId: itemId,
        companyId,
        userId
      });
      expect(first.data.created).toBe(2);

      const second = await syncItemVariants(client, {
        parentItemId: itemId,
        companyId,
        userId
      });
      expect(second.error).toBeNull();
      expect(second.data.created).toBe(0);

      const variants = await client
        .from("itemVariant")
        .select("id")
        .eq("parentItemId", itemId)
        .eq("companyId", companyId);
      expect((variants.data ?? []).length).toBe(2);
    });

    it("getStyleVariantQuantityParameters maps each variantItemId to its value-name label", async () => {
      const { companyId, userId } = await provision();
      const { itemId } = await setupItem(companyId, userId, {
        colors: [
          ["BK", "Black"],
          ["NV", "Navy"]
        ],
        sizes: [["S", "S"]]
      });
      await syncItemVariants(client, {
        parentItemId: itemId,
        companyId,
        userId
      });

      const params = await getStyleVariantQuantityParameters(
        client,
        itemId,
        companyId
      );
      expect(params).toHaveLength(1);
      const param = params[0]!;
      expect(param.key).toBe("variantItemId");

      const labels = param.optionVariantItemLabels ?? {};
      // Two combos → two variantItemId → label entries, labelled by value NAMES.
      expect(Object.keys(labels)).toHaveLength(2);
      const values = Object.values(labels);
      expect(values.some((l) => l.includes("Black") && l.includes("S"))).toBe(
        true
      );
      expect(values.some((l) => l.includes("Navy") && l.includes("S"))).toBe(
        true
      );
      // No raw code combo leaks into the label.
      expect(values.every((l) => !l.includes("BK") && !l.includes("NV"))).toBe(
        true
      );

      // The keys are the actual itemVariant.variantItemId values.
      const variants = await client
        .from("itemVariant")
        .select("variantItemId")
        .eq("parentItemId", itemId)
        .eq("companyId", companyId);
      const realIds = new Set(
        (variants.data ?? []).map(
          (v: { variantItemId: string }) => v.variantItemId
        )
      );
      expect(Object.keys(labels).every((id) => realIds.has(id))).toBe(true);
    });

    it("archives variants whose combo is no longer selected", async () => {
      const { companyId, userId } = await provision();
      const { itemId, sizeValueIds } = await setupItem(companyId, userId, {
        colors: [["BK", "Black"]],
        sizes: [
          ["S", "S"],
          ["M", "M"]
        ]
      });
      await syncItemVariants(client, {
        parentItemId: itemId,
        companyId,
        userId
      });

      // Drop the "M" selection, then re-sync.
      const del = await client
        .from("itemAttributeSelection")
        .delete()
        .eq("itemId", itemId)
        .eq("attributeValueId", sizeValueIds.M)
        .eq("companyId", companyId);
      expect(del.error).toBeNull();

      const resync = await syncItemVariants(client, {
        parentItemId: itemId,
        companyId,
        userId
      });
      expect(resync.error).toBeNull();
      expect(resync.data.archived).toBe(1); // the BK|M variant

      // Archive = deactivate the child SKU (not delete): still 2 itemVariant
      // rows, but only the BK|S child stays active.
      const variants = await client
        .from("itemVariant")
        .select("variantItemId")
        .eq("parentItemId", itemId)
        .eq("companyId", companyId);
      const rows = (variants.data ?? []) as Array<{ variantItemId: string }>;
      expect(rows).toHaveLength(2);

      let active = 0;
      for (const r of rows) {
        const child = await client
          .from("item")
          .select("active")
          .eq("id", r.variantItemId)
          .maybeSingle();
        if ((child.data as { active: boolean } | null)?.active) active += 1;
      }
      expect(active).toBe(1);
    });
  }
);
