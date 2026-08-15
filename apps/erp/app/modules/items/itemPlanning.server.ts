import type { Database, Json } from "@carbon/database";
import type { Kysely, KyselyDatabase } from "@carbon/database/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { z } from "zod";
import type { itemPlanningValidator } from "./items.models";
import { getItemPlanning, upsertItemPlanning } from "./items.service";
import type {
  PlanningMixQuantityKey,
  PlanningVariantMixPayload
} from "./styleOrderLines";
import {
  planningMixFromChildStockTargets,
  readPlanningVariantMixCustomFields,
  withPlanningVariantMixCustomFields
} from "./styleOrderLines";
import {
  getVariantChildItemIds,
  resolvePlanningVariantMix
} from "./styleOrderLines.server";

type Db = SupabaseClient<Database>;

function parsePlanningVariantQuantities(raw: unknown): unknown {
  if (raw == null || raw === "") return undefined;
  if (typeof raw === "object") return raw;
  if (typeof raw !== "string") return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function stringifyPlanningMix(
  mix: PlanningVariantMixPayload | undefined
): string | undefined {
  return mix ? JSON.stringify(mix) : undefined;
}

async function reconstructPlanningVariantMix(
  client: Db,
  args: { parentItemId: string; companyId: string; locationId: string }
): Promise<PlanningVariantMixPayload | undefined> {
  const childIds = await getVariantChildItemIds(client, {
    parentItemId: args.parentItemId,
    companyId: args.companyId
  });
  if (childIds.length === 0) return undefined;

  const { data, error } = await client
    .from("itemPlanning")
    .select(
      "itemId, demandAccumulationSafetyStock, reorderPoint, reorderQuantity, maximumInventoryQuantity"
    )
    .in("itemId", childIds)
    .eq("companyId", args.companyId)
    .eq("locationId", args.locationId);
  if (error) throw error;

  const byId = new Map((data ?? []).map((row) => [row.itemId, row]));
  return planningMixFromChildStockTargets(
    childIds.map((variantItemId) => {
      const row = byId.get(variantItemId);
      return {
        variantItemId,
        demandAccumulationSafetyStock: row?.demandAccumulationSafetyStock,
        reorderPoint: row?.reorderPoint,
        reorderQuantity: row?.reorderQuantity,
        maximumInventoryQuantity: row?.maximumInventoryQuantity
      } satisfies { variantItemId: string } & Partial<
        Record<PlanningMixQuantityKey, number | null | undefined>
      >;
    })
  );
}

/**
 * Load item planning and attach saved mix so the Style planning grid rehydrates.
 */
export async function getItemPlanningWithMix(
  client: Db,
  itemId: string,
  companyId: string,
  locationId: string
) {
  const planning = await getItemPlanning(client, itemId, companyId, locationId);
  if (planning.error || !planning.data) return planning;

  const stored = readPlanningVariantMixCustomFields(planning.data.customFields);
  const mix =
    stored ??
    (await reconstructPlanningVariantMix(client, {
      parentItemId: itemId,
      companyId,
      locationId
    }));
  const variantQuantities = stringifyPlanningMix(mix);
  if (!variantQuantities) return planning;

  return {
    ...planning,
    data: {
      ...planning.data,
      variantQuantities
    }
  };
}

/**
 * Save item planning and split stock-target fields onto variant SKUs.
 * Lives in a .server module so mix helpers are not pulled into the client bundle.
 */
export async function upsertItemPlanningWithMix(
  client: Db,
  partPlanning: z.infer<typeof itemPlanningValidator> & {
    updatedBy: string;
    customFields?: Json;
  },
  fanOut: {
    db: Kysely<KyselyDatabase>;
    companyId: string;
  }
) {
  const parsedMix = parsePlanningVariantQuantities(
    partPlanning.variantQuantities
  );
  const mixResult = await resolvePlanningVariantMix(client, {
    parentItemId: partPlanning.itemId,
    companyId: fanOut.companyId,
    variantQuantities: parsedMix
  });
  if (!mixResult.ok) {
    return { data: null, error: { message: mixResult.error } };
  }

  return upsertItemPlanning(
    client,
    {
      ...partPlanning,
      customFields: withPlanningVariantMixCustomFields(
        partPlanning.customFields,
        parsedMix
      ) as Json
    },
    {
      db: fanOut.db,
      companyId: fanOut.companyId,
      mix: mixResult.mix
    }
  );
}
