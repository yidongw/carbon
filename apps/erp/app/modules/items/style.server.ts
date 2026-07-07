import type { Json } from "@carbon/database";
import { getLocalTimeZone, today } from "@internationalized/date";
import { sql } from "kysely";
import type { z } from "zod";
import { getDatabaseClient } from "~/services/database.server";
import { sanitize } from "~/utils/supabase";
import {
  upsertItemDefaultPickMethod,
  upsertItemShelfLife
} from "./items.service";
import type { styleValidator } from "./style.models";
import { ensureStyleMethodScaffoldWithDb } from "./styleMethod.service";

type StylePayload =
  | (z.infer<typeof styleValidator> & {
      companyId: string;
      createdBy: string;
      customFields?: Json;
    })
  | (z.infer<typeof styleValidator> & {
      updatedBy: string;
      customFields?: Json;
    });

type StyleSummary = {
  active: boolean | null;
  assignee: string | null;
  defaultMethodType: string | null;
  sourcingType: string | null;
  description: string | null;
  itemTrackingType: string | null;
  name: string | null;
  replenishmentSystem: string | null;
  unitOfMeasureCode: string | null;
  notes: string | null;
  revision: string | null;
  readableId: string | null;
  readableIdWithRevision: string | null;
  id: string;
  companyId: string;
  thumbnailPath: string | null;
  colorName: string;
  colorCode: string;
  revisions: unknown;
  customFields: Json | null;
  tags: string[] | null;
  itemPostingGroupId: string | null;
  createdBy: string | null;
  createdAt: string | null;
  updatedBy: string | null;
  updatedAt: string | null;
};

export async function getStyle(
  itemId: string,
  companyId: string
): Promise<{ data: StyleSummary | null; error: Error | null }> {
  try {
    const db = getDatabaseClient();
    const result = await sql<StyleSummary>`
      select *
      from "styles"
      where "id" = ${itemId}
        and "companyId" = ${companyId}
      limit 1
    `.execute(db);

    return {
      data: result.rows[0] ?? null,
      error: result.rows[0] ? null : new Error("Style not found")
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Failed to load style")
    };
  }
}

export async function getStyleColorContext(
  itemId: string,
  companyId: string
): Promise<{
  data: { itemId: string; colorCode: string } | null;
  error: Error | null;
}> {
  try {
    const db = getDatabaseClient();
    const result = await sql<{ itemId: string; colorCode: string }>`
      select "itemId", "colorCode"
      from "style"
      where "itemId" = ${itemId}
        and "companyId" = ${companyId}
      limit 1
    `.execute(db);

    return {
      data: result.rows[0] ?? null,
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error("Failed to load style color context")
    };
  }
}

async function insertStyleRecord(args: {
  readableId: string;
  itemId: string;
  colorName: string;
  colorCode: string;
  companyId: string;
  userId: string;
  customFields?: Json;
}) {
  const db = getDatabaseClient();
  await sql`
    insert into "style" (
      "id",
      "itemId",
      "colorName",
      "colorCode",
      "companyId",
      "createdBy",
      "customFields"
    ) values (
      ${args.readableId},
      ${args.itemId},
      ${args.colorName},
      ${args.colorCode},
      ${args.companyId},
      ${args.userId},
      ${args.customFields ?? null}
    )
  `.execute(db);
}

async function updateStyleRecord(args: {
  itemId: string;
  colorName: string;
  colorCode: string;
  companyId: string;
  userId: string;
  customFields?: Json;
}) {
  const db = getDatabaseClient();
  const updatedAt = today(getLocalTimeZone()).toString();
  await sql`
    update "style"
    set
      "colorName" = ${args.colorName},
      "colorCode" = ${args.colorCode},
      "customFields" = ${args.customFields ?? null},
      "updatedBy" = ${args.userId},
      "updatedAt" = ${updatedAt}
    where "itemId" = ${args.itemId}
      and "companyId" = ${args.companyId}
  `.execute(db);
}

export async function upsertStyle(
  client: Parameters<typeof upsertItemDefaultPickMethod>[0],
  style: StylePayload
) {
  if ("createdBy" in style) {
    const itemInsert = await client
      .from("item")
      .insert({
        readableId: style.id,
        revision: style.revision ?? "0",
        name: style.name,
        description: style.description,
        type: "Style",
        replenishmentSystem: style.replenishmentSystem,
        defaultMethodType: style.defaultMethodType,
        itemTrackingType: style.itemTrackingType,
        unitOfMeasureCode: style.unitOfMeasureCode,
        active: true,
        modelUploadId: style.modelUploadId,
        thumbnailPath: style.thumbnailPath,
        companyId: style.companyId,
        createdBy: style.createdBy
      })
      .select("id")
      .single();

    if (itemInsert.error || !itemInsert.data?.id) return itemInsert;
    const itemId = itemInsert.data.id;

    try {
      await insertStyleRecord({
        readableId: style.id,
        itemId,
        colorName: style.colorName,
        colorCode: style.colorCode,
        companyId: style.companyId,
        userId: style.createdBy,
        customFields: style.customFields
      });
    } catch (error) {
      return {
        data: null,
        error:
          error instanceof Error ? error : new Error("Failed to insert style")
      };
    }

    const itemCostUpdate = await client
      .from("itemCost")
      .update(
        sanitize({
          itemPostingGroupId: style.postingGroupId,
          unitCost:
            style.replenishmentSystem !== "Make" ? style.unitCost : undefined
        })
      )
      .eq("itemId", itemId);

    if (itemCostUpdate.error) {
      console.error(itemCostUpdate.error);
    }

    if (style.replenishmentSystem !== "Buy") {
      const itemReplenishmentInsert = await client
        .from("itemReplenishment")
        .update({ lotSize: style.lotSize })
        .eq("itemId", itemId);

      if (itemReplenishmentInsert.error) {
        return {
          data: null,
          error: new Error(
            `Style replenishment update failed: ${itemReplenishmentInsert.error.message}`
          )
        };
      }
    }

    const pickMethod = await upsertItemDefaultPickMethod(client, {
      itemId,
      userId: style.createdBy,
      storageUnitId: style.defaultStorageUnitId
    });
    if (pickMethod.error) {
      return {
        data: null,
        error: new Error(
          `Style pick method failed: ${pickMethod.error.message}`
        )
      };
    }

    const shelfLife = await upsertItemShelfLife(client, {
      itemId,
      userId: style.createdBy,
      companyId: style.companyId,
      mode: style.shelfLifeMode,
      days: style.shelfLifeDays,
      triggerProcessId: style.shelfLifeTriggerProcessId,
      triggerTiming: style.shelfLifeTriggerTiming,
      calculateFromBom: style.shelfLifeCalculateFromBom
    });
    if (shelfLife.error) {
      return {
        data: null,
        error: new Error(`Style shelf life failed: ${shelfLife.error.message}`)
      };
    }

    const styleMethod = await ensureStyleMethodScaffoldWithDb({
      itemId,
      companyId: style.companyId,
      userId: style.createdBy
    });
    if (styleMethod.error) {
      return {
        data: null,
        error: new Error(
          `Style method scaffold failed: ${styleMethod.error.message}`
        )
      };
    }

    return { data: { id: itemId }, error: null };
  }

  const itemUpdate = {
    id: style.id,
    name: style.name,
    description: style.description,
    replenishmentSystem: style.replenishmentSystem,
    defaultMethodType: style.defaultMethodType,
    itemTrackingType: style.itemTrackingType,
    unitOfMeasureCode: style.unitOfMeasureCode,
    active: true,
    modelUploadId: style.modelUploadId,
    thumbnailPath: style.thumbnailPath
  };

  const updateItem = await client
    .from("item")
    .update({
      ...sanitize(itemUpdate),
      updatedAt: today(getLocalTimeZone()).toString()
    })
    .eq("id", style.id);

  if (updateItem.error) return updateItem;

  const styleCompany = await client
    .from("item")
    .select("companyId")
    .eq("id", style.id)
    .single();
  if (styleCompany.error) return styleCompany;
  const companyId = styleCompany.data.companyId;
  if (!companyId) {
    return { data: null, error: new Error("Style company not found") };
  }

  try {
    await updateStyleRecord({
      itemId: style.id,
      colorName: style.colorName,
      colorCode: style.colorCode,
      companyId,
      userId: style.updatedBy,
      customFields: style.customFields
    });
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error : new Error("Failed to update style")
    };
  }

  const [pickMethod, shelfLife] = await Promise.all([
    upsertItemDefaultPickMethod(client, {
      itemId: style.id,
      userId: style.updatedBy,
      storageUnitId: style.defaultStorageUnitId
    }),
    upsertItemShelfLife(client, {
      itemId: style.id,
      userId: style.updatedBy,
      mode: style.shelfLifeMode,
      days: style.shelfLifeDays,
      triggerProcessId: style.shelfLifeTriggerProcessId,
      triggerTiming: style.shelfLifeTriggerTiming,
      calculateFromBom: style.shelfLifeCalculateFromBom
    })
  ]);

  if (pickMethod.error) {
    return {
      data: null,
      error: new Error(`Style pick method failed: ${pickMethod.error.message}`)
    };
  }
  if (shelfLife.error) {
    return {
      data: null,
      error: new Error(`Style shelf life failed: ${shelfLife.error.message}`)
    };
  }

  const styleMethod = await ensureStyleMethodScaffoldWithDb({
    itemId: style.id,
    companyId,
    userId: style.updatedBy
  });
  if (styleMethod.error) {
    return {
      data: null,
      error: new Error(
        `Style method scaffold failed: ${styleMethod.error.message}`
      )
    };
  }

  if (style.replenishmentSystem !== "Buy") {
    const itemReplenishmentUpdate = await client
      .from("itemReplenishment")
      .update({ lotSize: style.lotSize })
      .eq("itemId", style.id);

    if (itemReplenishmentUpdate.error) {
      return {
        data: null,
        error: new Error(
          `Style replenishment update failed: ${itemReplenishmentUpdate.error.message}`
        )
      };
    }
  }

  const itemCostUpdate = await client
    .from("itemCost")
    .update(
      sanitize({
        itemPostingGroupId: style.postingGroupId,
        unitCost:
          style.replenishmentSystem !== "Make" ? style.unitCost : undefined
      })
    )
    .eq("itemId", style.id);

  if (itemCostUpdate.error) {
    console.error(itemCostUpdate.error);
  }

  return { data: { id: style.id }, error: null };
}
