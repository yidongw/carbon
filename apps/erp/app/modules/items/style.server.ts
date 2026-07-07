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
import {
  buildStyleCuttingMethodOperation,
  STYLE_CUTTING_OPERATION_TAG,
  STYLE_CUTTING_PROCESS_TAG,
  STYLE_SYSTEM_OPERATION_TAG
} from "./styleMethod.service";

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

function toError(error: unknown, fallback: string) {
  if (error instanceof Error) return error;
  if (error && typeof error === "object") {
    const maybeMessage = "message" in error ? error.message : undefined;
    const maybeDetail = "detail" in error ? error.detail : undefined;
    const parts = [maybeMessage, maybeDetail].filter(
      (value): value is string => typeof value === "string" && value.length > 0
    );
    if (parts.length > 0) return new Error(parts.join(" | "));
  }
  return new Error(fallback);
}

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
      error: toError(error, "Failed to load style")
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
      error: toError(error, "Failed to load style color context")
    };
  }
}

export async function ensureStyleMethodScaffoldWithDb(args: {
  itemId: string;
  companyId: string;
  userId: string;
}) {
  const db = getDatabaseClient();

  try {
    const existingMakeMethod = await sql<{ id: string }>`
      select "id"
      from "makeMethod"
      where "itemId" = ${args.itemId}
        and "companyId" = ${args.companyId}
      order by "createdAt" asc
      limit 1
    `.execute(db);

    let makeMethodId = existingMakeMethod.rows[0]?.id ?? null;
    if (!makeMethodId) {
      const makeMethodResult = await sql<{ id: string }>`
        insert into "makeMethod" ("itemId", "companyId", "createdBy")
        values (${args.itemId}, ${args.companyId}, ${args.userId})
        returning "id"
      `.execute(db);
      makeMethodId = makeMethodResult.rows[0]?.id ?? null;
    }

    if (!makeMethodId) {
      return {
        data: null,
        error: new Error("Failed to create style make method")
      };
    }

    const existingCuttingProcess = await sql<{ id: string; name: string }>`
      select "id", "name"
      from "process"
      where "companyId" = ${args.companyId}
        and ${STYLE_CUTTING_PROCESS_TAG} = any(coalesce("tags", '{}'::text[]))
      order by "createdAt" asc
      limit 1
    `.execute(db);

    let cuttingProcessId = existingCuttingProcess.rows[0]?.id ?? null;

    if (!cuttingProcessId) {
      const namedCuttingProcess = await sql<{ id: string; name: string }>`
        select "id", "name"
        from "process"
        where "companyId" = ${args.companyId}
          and "name" in ('Cutting', '裁剪')
        order by "createdAt" asc
        limit 1
      `.execute(db);

      const namedCuttingProcessId = namedCuttingProcess.rows[0]?.id ?? null;
      if (namedCuttingProcessId) {
        await sql`
          update "process"
          set
            "tags" = array(
              select distinct tag
              from unnest(array_append(coalesce("tags", '{}'::text[]), ${STYLE_CUTTING_PROCESS_TAG})) as tag
            ),
            "updatedBy" = ${args.userId}
          where "id" = ${namedCuttingProcessId}
        `.execute(db);
        cuttingProcessId = namedCuttingProcessId;
      } else {
        const insertedCuttingProcess = await sql<{ id: string }>`
          insert into "process" (
            "name",
            "processType",
            "defaultStandardFactor",
            "completeAllOnScan",
            "tags",
            "companyId",
            "createdBy"
          ) values (
            'Cutting',
            'Inside',
            'Minutes/Piece',
            false,
            array[${STYLE_CUTTING_PROCESS_TAG}]::text[],
            ${args.companyId},
            ${args.userId}
          )
          returning "id"
        `.execute(db);

        cuttingProcessId = insertedCuttingProcess.rows[0]?.id ?? null;
      }
    }

    if (!cuttingProcessId) {
      return {
        data: null,
        error: new Error("Failed to resolve style cutting process")
      };
    }

    const existingCuttingOperation = await sql<{ id: string }>`
      select "id"
      from "methodOperation"
      where "makeMethodId" = ${makeMethodId}
        and (
          ${STYLE_CUTTING_OPERATION_TAG} = any(coalesce("tags", '{}'::text[]))
          or "customFields" ->> 'styleStage' = 'cutting'
        )
      order by "order" asc
      limit 1
    `.execute(db);

    if (existingCuttingOperation.rows[0]?.id) {
      return {
        data: {
          makeMethodId,
          cuttingOperationId: existingCuttingOperation.rows[0].id
        },
        error: null
      };
    }

    const firstOperation = await sql<{
      id: string;
      processId: string | null;
      order: number | null;
    }>`
      select "id", "processId", "order"
      from "methodOperation"
      where "makeMethodId" = ${makeMethodId}
      order by "order" asc
      limit 1
    `.execute(db);

    const first = firstOperation.rows[0];
    if (first?.id && first.processId === cuttingProcessId) {
      await sql`
        update "methodOperation"
        set
          "tags" = array(
            select distinct tag
            from unnest(
              array_append(
                array_append(coalesce("tags", '{}'::text[]), ${STYLE_CUTTING_OPERATION_TAG}),
                ${STYLE_SYSTEM_OPERATION_TAG}
              )
            ) as tag
          ),
          "customFields" = coalesce("customFields", '{}'::jsonb) || ${JSON.stringify(
            {
              styleStage: "cutting",
              styleSystemOwned: true
            }
          )}::jsonb,
          "updatedBy" = ${args.userId}
        where "id" = ${first.id}
      `.execute(db);

      return {
        data: {
          makeMethodId,
          cuttingOperationId: first.id
        },
        error: null
      };
    }

    const seededCuttingOperation = buildStyleCuttingMethodOperation({
      makeMethodId,
      processId: cuttingProcessId,
      companyId: args.companyId,
      createdBy: args.userId,
      order: first && typeof first.order === "number" ? first.order - 1 : 0
    });

    const insertedOperation = await sql<{ id: string }>`
      insert into "methodOperation" (
        "makeMethodId",
        "processId",
        "companyId",
        "createdBy",
        "order",
        "operationOrder",
        "operationType",
        "description",
        "setupUnit",
        "setupTime",
        "laborUnit",
        "laborTime",
        "machineUnit",
        "machineTime",
        "insideUnitCost",
        "tags",
        "customFields"
      ) values (
        ${seededCuttingOperation.makeMethodId},
        ${seededCuttingOperation.processId},
        ${seededCuttingOperation.companyId},
        ${seededCuttingOperation.createdBy},
        ${seededCuttingOperation.order},
        ${seededCuttingOperation.operationOrder},
        ${seededCuttingOperation.operationType},
        ${seededCuttingOperation.description},
        ${seededCuttingOperation.setupUnit},
        ${seededCuttingOperation.setupTime},
        ${seededCuttingOperation.laborUnit},
        ${seededCuttingOperation.laborTime},
        ${seededCuttingOperation.machineUnit},
        ${seededCuttingOperation.machineTime},
        ${seededCuttingOperation.insideUnitCost},
        array[${STYLE_CUTTING_OPERATION_TAG}, ${STYLE_SYSTEM_OPERATION_TAG}]::text[],
        ${JSON.stringify(seededCuttingOperation.customFields)}::jsonb
      )
      returning "id"
    `.execute(db);

    const cuttingOperationId = insertedOperation.rows[0]?.id ?? null;
    if (!cuttingOperationId) {
      return {
        data: null,
        error: new Error("Failed to create style cutting operation")
      };
    }

    return {
      data: {
        makeMethodId,
        cuttingOperationId
      },
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error: toError(error, "Failed to scaffold style make method")
    };
  }
}

async function insertStyleRecord(
  client: Parameters<typeof upsertItemDefaultPickMethod>[0],
  args: {
    readableId: string;
    itemId: string;
    colorName: string;
    colorCode: string;
    companyId: string;
    userId: string;
    customFields?: Json;
  }
) {
  const styleClient = client as any;
  const result = await styleClient.from("style").insert({
    id: args.readableId,
    itemId: args.itemId,
    colorName: args.colorName,
    colorCode: args.colorCode,
    companyId: args.companyId,
    createdBy: args.userId,
    customFields: args.customFields ?? null
  });

  if (result.error) throw result.error;
}

async function updateStyleRecord(
  client: Parameters<typeof upsertItemDefaultPickMethod>[0],
  args: {
    itemId: string;
    colorName: string;
    colorCode: string;
    companyId: string;
    userId: string;
    customFields?: Json;
  }
) {
  const updatedAt = today(getLocalTimeZone()).toString();
  const styleClient = client as any;
  const result = await styleClient
    .from("style")
    .update({
      colorName: args.colorName,
      colorCode: args.colorCode,
      customFields: args.customFields ?? null,
      updatedBy: args.userId,
      updatedAt
    })
    .eq("itemId", args.itemId)
    .eq("companyId", args.companyId);

  if (result.error) throw result.error;
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
      await insertStyleRecord(client, {
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
        error: toError(error, "Failed to insert style")
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
    await updateStyleRecord(client, {
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
      error: toError(error, "Failed to update style")
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

  // Only update fields that were explicitly submitted — undefined means the
  // edit form doesn't include that control, and sanitize() would turn it to
  // null, wiping the stored value.
  const costUpdate: Record<string, unknown> = {};
  if (style.postingGroupId !== undefined) {
    costUpdate.itemPostingGroupId = style.postingGroupId;
  }
  if (style.replenishmentSystem !== "Make" && style.unitCost !== undefined) {
    costUpdate.unitCost = style.unitCost;
  }
  if (Object.keys(costUpdate).length > 0) {
    const itemCostUpdate = await client
      .from("itemCost")
      .update(costUpdate)
      .eq("itemId", style.id);

    if (itemCostUpdate.error) {
      console.error(itemCostUpdate.error);
    }
  }

  return { data: { id: style.id }, error: null };
}
