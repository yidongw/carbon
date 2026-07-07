import type { Database, Json } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sql } from "kysely";

export const STYLE_CUTTING_PROCESS_TAG = "style:cutting-process";
export const STYLE_CUTTING_OPERATION_TAG = "style:cutting-operation";
export const STYLE_SYSTEM_OPERATION_TAG = "style:system-operation";

type StyleOperationLike = {
  id?: string;
  processId?: string | null;
  order?: number | null;
  tags?: string[] | null;
  customFields?: Json | null;
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

function getStyleStage(customFields: Json | null | undefined) {
  if (!customFields || typeof customFields !== "object") return null;
  const styleStage = (customFields as Record<string, unknown>).styleStage;
  return typeof styleStage === "string" ? styleStage : null;
}

export function isStyleCuttingOperation(operation: StyleOperationLike) {
  const tags = operation.tags ?? [];
  return (
    tags.includes(STYLE_CUTTING_OPERATION_TAG) ||
    getStyleStage(operation.customFields) === "cutting"
  );
}

export function isStyleSystemOwnedOperation(operation: StyleOperationLike) {
  const tags = operation.tags ?? [];
  if (tags.includes(STYLE_SYSTEM_OPERATION_TAG)) return true;
  if (!operation.customFields || typeof operation.customFields !== "object") {
    return false;
  }

  return (
    (operation.customFields as Record<string, unknown>).styleSystemOwned ===
    true
  );
}

export function buildStyleCuttingMethodOperation(args: {
  makeMethodId: string;
  processId: string;
  companyId: string;
  createdBy: string;
  order?: number;
}) {
  return {
    makeMethodId: args.makeMethodId,
    processId: args.processId,
    companyId: args.companyId,
    createdBy: args.createdBy,
    order: args.order ?? 0,
    operationOrder: "After Previous" as const,
    operationType: "Inside" as const,
    description: "Cutting",
    setupUnit: "Minutes/Piece" as const,
    setupTime: 0,
    laborUnit: "Minutes/Piece" as const,
    laborTime: 0,
    machineUnit: "Minutes/Piece" as const,
    machineTime: 0,
    insideUnitCost: 0,
    tags: [STYLE_CUTTING_OPERATION_TAG, STYLE_SYSTEM_OPERATION_TAG],
    customFields: {
      styleStage: "cutting",
      styleSystemOwned: true
    }
  };
}

export function getBundleJobCuttingOperationIdsToDelete(args: {
  operations: Array<
    Required<Pick<StyleOperationLike, "id">> & StyleOperationLike
  >;
  cuttingProcessId?: string | null;
}) {
  const tagged = args.operations
    .filter((operation) => isStyleCuttingOperation(operation))
    .map((operation) => operation.id);
  if (tagged.length > 0) return tagged;

  if (args.cuttingProcessId) {
    const byProcess = args.operations
      .filter((operation) => operation.processId === args.cuttingProcessId)
      .map((operation) => operation.id);
    if (byProcess.length > 0) return byProcess;
  }

  const firstOperation = [...args.operations]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .find(Boolean);

  return firstOperation ? [firstOperation.id] : [];
}

export async function ensureStyleRootMakeMethod(
  client: SupabaseClient<Database>,
  args: {
    itemId: string;
    companyId: string;
    userId: string;
  }
) {
  const makeMethod = await client
    .from("makeMethod")
    .select("id")
    .eq("itemId", args.itemId)
    .eq("companyId", args.companyId)
    .order("createdAt", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (makeMethod.error) return { data: null, error: makeMethod.error };
  if (makeMethod.data?.id) {
    return { data: { id: makeMethod.data.id }, error: null };
  }

  return client
    .from("makeMethod")
    .insert({
      itemId: args.itemId,
      companyId: args.companyId,
      createdBy: args.userId
    })
    .select("id")
    .single();
}

export async function ensureStyleCuttingProcess(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    userId: string;
  }
) {
  const processClient = client as SupabaseClient<any>;
  const existing = await processClient
    .from("process")
    .select("id, name, tags")
    .eq("companyId", args.companyId)
    .contains("tags", [STYLE_CUTTING_PROCESS_TAG])
    .limit(1)
    .maybeSingle();

  if (existing.error) return { data: null, error: existing.error };
  if (existing.data?.id) {
    return {
      data: { id: existing.data.id, name: existing.data.name as string },
      error: null
    };
  }

  const byName = await processClient
    .from("process")
    .select("id, name, tags")
    .eq("companyId", args.companyId)
    .in("name", ["Cutting", "裁剪"])
    .order("createdAt", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (byName.error) return { data: null, error: byName.error };
  if (byName.data?.id) {
    const tags = Array.from(
      new Set([...(byName.data.tags ?? []), STYLE_CUTTING_PROCESS_TAG])
    );
    await processClient
      .from("process")
      .update({ tags, updatedBy: args.userId })
      .eq("id", byName.data.id);

    return {
      data: { id: byName.data.id, name: byName.data.name as string },
      error: null
    };
  }

  return processClient
    .from("process")
    .insert({
      name: "Cutting",
      processType: "Inside",
      defaultStandardFactor: "Minutes/Piece",
      completeAllOnScan: false,
      tags: [STYLE_CUTTING_PROCESS_TAG],
      companyId: args.companyId,
      createdBy: args.userId
    })
    .select("id, name")
    .single();
}

export async function ensureStyleCuttingOperation(
  client: SupabaseClient<Database>,
  args: {
    makeMethodId: string;
    companyId: string;
    userId: string;
  }
) {
  const process = await ensureStyleCuttingProcess(client, args);
  if (process.error || !process.data?.id) {
    return { data: null, error: process.error };
  }

  const operationClient = client as SupabaseClient<any>;
  const operations = await operationClient
    .from("methodOperation")
    .select("id, processId, order, tags, customFields")
    .eq("makeMethodId", args.makeMethodId)
    .order("order", { ascending: true });

  if (operations.error) return { data: null, error: operations.error };

  const existingCutting = (operations.data ?? []).find((operation: any) =>
    isStyleCuttingOperation(operation)
  );
  if (existingCutting?.id) {
    return { data: { id: existingCutting.id }, error: null };
  }

  const firstOperation = (operations.data ?? [])[0];
  if (firstOperation?.processId === process.data.id) {
    const tags = Array.from(
      new Set([
        ...(firstOperation.tags ?? []),
        STYLE_CUTTING_OPERATION_TAG,
        STYLE_SYSTEM_OPERATION_TAG
      ])
    );
    const customFields = {
      ...(typeof firstOperation.customFields === "object" &&
      firstOperation.customFields
        ? firstOperation.customFields
        : {}),
      styleStage: "cutting",
      styleSystemOwned: true
    };

    const updated = await operationClient
      .from("methodOperation")
      .update({
        tags,
        customFields,
        updatedBy: args.userId
      })
      .eq("id", firstOperation.id)
      .select("id")
      .single();

    if (updated.error) return { data: null, error: updated.error };
    return updated;
  }

  const insert = await operationClient
    .from("methodOperation")
    .insert(
      buildStyleCuttingMethodOperation({
        makeMethodId: args.makeMethodId,
        processId: process.data.id,
        companyId: args.companyId,
        createdBy: args.userId,
        order:
          firstOperation && typeof firstOperation.order === "number"
            ? firstOperation.order - 1
            : 0
      })
    )
    .select("id")
    .single();

  if (insert.error) return { data: null, error: insert.error };
  return insert;
}

export async function ensureStyleMethodScaffold(
  client: SupabaseClient<Database>,
  args: {
    itemId: string;
    companyId: string;
    userId: string;
  }
) {
  const makeMethod = await ensureStyleRootMakeMethod(client, args);
  if (makeMethod.error || !makeMethod.data?.id) return makeMethod;

  const cutting = await ensureStyleCuttingOperation(client, {
    makeMethodId: makeMethod.data.id,
    companyId: args.companyId,
    userId: args.userId
  });
  if (cutting.error) return { data: null, error: cutting.error };

  return {
    data: {
      makeMethodId: makeMethod.data.id,
      cuttingOperationId: cutting.data?.id ?? null
    },
    error: null
  };
}

export async function ensureStyleMethodScaffoldWithDb(args: {
  itemId: string;
  companyId: string;
  userId: string;
}) {
  const { getDatabaseClient } = await import("~/services/database.server");
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
