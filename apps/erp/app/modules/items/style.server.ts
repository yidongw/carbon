import type { Json } from "@carbon/database";
import { sql } from "kysely";
import type { z } from "zod";
import { getDatabaseClient } from "~/services/database.server";
import { sanitize } from "~/utils/supabase";
import { syncItemVariantsFromSelections } from "./itemAttribute.service";
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

// upsertStyle only creates styles — style editing does not route through it
// (updates go through items.service.ts / the MCP tool). Create payload only.
type StylePayload = z.infer<typeof styleValidator> & {
  companyId: string;
  createdBy: string;
  customFields?: Json;
  attributeSetId: string;
  selections: Record<string, string[]>;
};

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
  colors: Array<{ id: string; colorCode: string; colorName: string }> | null;
  sizes: Array<{ id: string; sizeCode: string; sizeName: string }> | null;
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
    companyId: string;
    userId: string;
    customFields?: Json;
  }
) {
  const styleClient = client as any;
  // style is keyed by id (= item.readableId), shared across revisions. The
  // item-insert interceptor (sync_create_style_related_records) already created
  // the base row, so upsert to fill in the remaining fields without colliding
  // on the (id, companyId) primary key.
  const result = await styleClient.from("style").upsert(
    {
      id: args.readableId,
      companyId: args.companyId,
      createdBy: args.userId,
      customFields: args.customFields ?? null
    },
    { onConflict: "id,companyId" }
  );

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
        companyId: style.companyId,
        userId: style.createdBy,
        customFields: style.customFields
      });
      // Attribute selections + child SKU items (styles view reads selections).
      // Skip when no set was chosen (e.g. form submitted before the set loaded);
      // the style is created bare and colors/sizes can be added on the detail page.
      if (style.attributeSetId) {
        const variantSync = await syncItemVariantsFromSelections(client, {
          itemId,
          companyId: style.companyId,
          userId: style.createdBy,
          attributeSetId: style.attributeSetId,
          selections: style.selections
        });
        if (variantSync.error) throw variantSync.error;
      }
    } catch (error) {
      // Roll back the orphaned item so retries don't hit duplicate-key errors
      await client.from("item").delete().eq("id", itemId);
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

  // Unreachable: StylePayload is create-only (see the type above); style edits
  // are handled elsewhere. Kept as a guard so the function stays total.
  return {
    data: null,
    error: new Error("upsertStyle only supports creating a style")
  };
}
