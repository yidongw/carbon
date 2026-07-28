import type { Database } from "@carbon/database";
import type { JSONContent } from "@carbon/react";
import {
  type FlatTree,
  flattenTree,
  generateBomIds,
  type TrackedActivityAttributes
} from "@carbon/utils";
import { getLocalTimeZone, today } from "@internationalized/date";
import type { SupabaseClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import type { z } from "zod";
import { sanitize } from "~/utils/supabase";
import { getPickedQuantitiesByJobMaterial } from "./inventory.service";
import type {
  documentTypes,
  nonScrapQuantityValidator,
  productionEventValidator,
  scrapQuantityValidator,
  stepRecordValidator
} from "./models";
import type { BaseOperationWithDetails, Job, StorageItem } from "./types";

export async function getOpenJobs(
  client: SupabaseClient<Database>,
  args: { companyId: string; locationId: string }
) {
  return client
    .from("jobs")
    .select(
      "id, jobId, status, itemReadableIdWithRevision, name, quantity, quantityComplete, dueDate, deadlineType, assignee, jobMakeMethodId"
    )
    .eq("companyId", args.companyId)
    .eq("locationId", args.locationId)
    .in("status", ["Ready", "In Progress", "Paused"])
    .order("jobId", { ascending: true });
}

export async function getTrackedEntitiesByJobMakeMethodIds(
  client: SupabaseClient<Database>,
  jobMakeMethodIds: string[],
  companyId: string
) {
  if (jobMakeMethodIds.length === 0) return {};
  const result = await client
    .from("trackedEntity")
    .select("readableId, attributes")
    .in("attributes->>Job Make Method", jobMakeMethodIds)
    .eq("companyId", companyId);

  if (!result.data) return {};

  return result.data.reduce<Record<string, string>>((acc, curr) => {
    if (
      curr.attributes !== null &&
      typeof curr.attributes === "object" &&
      "Job Make Method" in curr.attributes &&
      curr.readableId
    ) {
      acc[curr.attributes["Job Make Method"] as string] = curr.readableId;
    }
    return acc;
  }, {});
}

export async function getJobOperations(
  client: SupabaseClient<Database>,
  jobId: string
) {
  return client
    .from("jobOperation")
    .select("*, jobMakeMethod(parentMaterialId, item(readableIdWithRevision))")
    .eq("jobId", jobId);
}

export async function getJobOperationDependencies(
  client: SupabaseClient<Database>,
  jobId: string
) {
  return client
    .from("jobOperationDependency")
    .select("operationId, dependsOnId")
    .eq("jobId", jobId);
}

export async function getUpstreamOperations(
  client: SupabaseClient<Database>,
  operationId: string
) {
  const operation = await client
    .from("jobOperation")
    .select("jobId")
    .eq("id", operationId)
    .single();

  if (operation.error) return { data: [], error: operation.error };

  const deps = await client
    .from("jobOperationDependency")
    .select("operationId, dependsOnId")
    .eq("jobId", operation.data.jobId);

  if (deps.error) return { data: [], error: deps.error };

  // Build adjacency list: operationId → [operations it depends on]
  const dependsOn = new Map<string, string[]>();
  for (const dep of deps.data) {
    const existing = dependsOn.get(dep.operationId) ?? [];
    existing.push(dep.dependsOnId);
    dependsOn.set(dep.operationId, existing);
  }

  // BFS backwards from operationId to find all ancestors
  const ancestors = new Set<string>();
  const queue: string[] = [...(dependsOn.get(operationId) ?? [])];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (ancestors.has(current)) continue;
    ancestors.add(current);
    for (const predecessor of dependsOn.get(current) ?? []) {
      queue.push(predecessor);
    }
  }

  if (ancestors.size === 0) return { data: [], error: null };

  return client
    .from("jobOperation")
    .select(
      "id, processId, description, order, status, reworkId, jobMakeMethod(item(name))"
    )
    .in("id", Array.from(ancestors))
    .order("order", { ascending: true });
}

export async function deleteAttributeRecord(
  client: SupabaseClient<Database>,
  args: { id: string; companyId: string; userId: string }
) {
  return client
    .from("jobOperationStepRecord")
    .delete()
    .eq("id", args.id)
    .eq("companyId", args.companyId)
    .eq("createdBy", args.userId);
}

export async function finishJobOperation(
  client: SupabaseClient<Database>,
  args: {
    jobOperationId: string;
    userId: string;
    companyId: string;
  }
) {
  const result = await client
    .from("jobOperation")
    .update({
      status: "Done",
      updatedBy: args.userId
    })
    .eq("id", args.jobOperationId);

  if (!result.error) {
    client
      .from("productionEvent")
      .select("id")
      .eq("jobOperationId", args.jobOperationId)
      .not("endTime", "is", null)
      .eq("postedToGL", false)
      .then((unpostedEvents) => {
        if (unpostedEvents.data?.length) {
          Promise.all(
            unpostedEvents.data.map((event) =>
              client.functions.invoke("post-production-event", {
                body: {
                  productionEventId: event.id,
                  userId: args.userId,
                  companyId: args.companyId
                }
              })
            )
          );
        }
      });
  }

  return result;
}

export async function getActiveJobOperationsByEmployee(
  client: SupabaseClient<Database>,
  args: {
    employeeId: string;
    companyId: string;
  }
) {
  return client.rpc("get_active_job_operations_by_employee", {
    employee_id: args.employeeId,
    company_id: args.companyId
  });
}

export async function getActiveJobOperationsByLocation(
  client: SupabaseClient<Database>,
  locationId: string,
  workCenterIds: string[] = []
) {
  return client.rpc("get_active_job_operations_by_location", {
    location_id: locationId,
    work_center_ids: workCenterIds
  });
}

export async function getActiveJobCount(
  client: SupabaseClient<Database>,
  args: {
    employeeId: string;
    companyId: string;
  }
) {
  return client.rpc("get_active_job_count", {
    employee_id: args.employeeId,
    company_id: args.companyId
  });
}

export async function getCustomers(
  client: SupabaseClient<Database>,
  companyId: string,
  customerIds: string[]
) {
  return client
    .from("customer")
    .select("id, name")
    .in("id", customerIds)
    .eq("companyId", companyId);
}

export async function getFailureModesList(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return client
    .from("maintenanceFailureMode")
    .select("id, name")
    .eq("companyId", companyId)
    .order("name");
}

export async function getQualityIssueTypesList(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return client
    .from("nonConformanceType")
    .select("id, name")
    .eq("companyId", companyId)
    .order("name");
}

export function getFileType(fileName: string): (typeof documentTypes)[number] {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
    return "Archive";
  }

  if (["pdf"].includes(extension)) {
    return "PDF";
  }

  if (["doc", "docx", "txt", "rtf"].includes(extension)) {
    return "Document";
  }

  if (["ppt", "pptx"].includes(extension)) {
    return "Presentation";
  }

  if (["csv", "xls", "xlsx"].includes(extension)) {
    return "Spreadsheet";
  }

  if (["txt"].includes(extension)) {
    return "Text";
  }

  if (["png", "jpg", "jpeg", "gif", "avif"].includes(extension)) {
    return "Image";
  }

  if (["mp4", "mov", "avi", "wmv", "flv", "mkv"].includes(extension)) {
    return "Video";
  }

  if (["mp3", "wav", "wma", "aac", "ogg", "flac"].includes(extension)) {
    return "Audio";
  }

  return "Other";
}

export async function getJobOperationProcedure(
  client: SupabaseClient<Database>,
  operationId: string
) {
  const [attributes, parameters] = await Promise.all([
    client
      .from("jobOperationStep")
      .select("*, jobOperationStepRecord(*)")
      .eq("operationId", operationId),
    client
      .from("jobOperationParameter")
      .select("*")
      .eq("operationId", operationId)
  ]);

  return {
    attributes: attributes.data ?? [],
    parameters: parameters.data ?? []
  };
}

export async function getJobAttributesByOperationId(
  client: SupabaseClient<Database>,
  operationId: string
) {
  return client
    .from("jobOperationStep")
    .select("*, jobOperationStepRecord(*)")
    .eq("operationId", operationId);
}

export async function getJobByOperationId(
  client: SupabaseClient<Database>,
  operationId: string
) {
  const operation = await client
    .from("jobOperation")
    .select("jobId")
    .eq("id", operationId)
    .single();
  if (operation.error) return operation;
  return client
    .from("jobs")
    .select("*, customer(name)")
    .eq("id", operation.data.jobId)
    .single();
}

const getItemFiles = async (
  client: SupabaseClient<Database>,
  companyId: string,
  items: Array<{ itemId: string }>
) => {
  const getFile = async (id: string) => {
    const res = await client.storage
      .from("private")
      .list(`${companyId}/parts/${id}`);

    if (res.error || !res.data) return null;

    return res.data.map((f) => ({ ...f, bucket: "parts", itemId: id }));
  };

  const elems = items.map((el) => getFile(el.itemId));

  const results = await Promise.all(elems);

  return results.filter((f) => f !== null).flat();
};

export async function getJobFiles(
  client: SupabaseClient<Database>,
  companyId: string,
  job: Job,
  items: Array<{ itemId: string }>
): Promise<StorageItem[]> {
  if (job.salesOrderLineId || job.quoteLineId) {
    const opportunityLine = job.salesOrderLineId || job.quoteLineId;

    const [opportunityLineFiles, jobFiles, itemFiles] = await Promise.all([
      client.storage
        .from("private")
        .list(`${companyId}/opportunity-line/${opportunityLine}`),
      client.storage.from("private").list(`${companyId}/job/${job.id}`),
      getItemFiles(client, companyId, items)
    ]);

    // Combine and return both sets of files
    return [
      ...(opportunityLineFiles.data?.map((f) => ({
        ...f,
        bucket: "opportunity-line"
      })) || []),
      ...(jobFiles.data?.map((f) => ({ ...f, bucket: "job" })) || []),
      ...itemFiles
    ];
  } else {
    const [jobFiles, itemFiles] = await Promise.all([
      client.storage.from("private").list(`${companyId}/job/${job.id}`),
      getItemFiles(client, companyId, items)
    ]);

    return [
      ...(jobFiles.data?.map((f) => ({ ...f, bucket: "job" })) || []),
      ...itemFiles
    ];
  }
}

export async function getJobMakeMethod(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("jobMakeMethod").select("*").eq("id", id).single();
}

export async function getJobMaterialsByOperationId(
  client: SupabaseClient<Database>,
  args: {
    operation: BaseOperationWithDetails;
    trackedEntityId: string | undefined;
    requiresSerialTracking: boolean;
  }
) {
  const { operation, trackedEntityId, requiresSerialTracking } = args;

  const [materials, trackedInputs] = await Promise.all([
    client
      .from("jobMaterialWithMakeMethodId")
      .select("*")
      .eq("jobMakeMethodId", operation.jobMakeMethodId)
      .order("itemReadableId", { ascending: true })
      .order("id", { ascending: true }),
    getTrackedInputs(client, trackedEntityId)
  ]);

  const kittedMakeMethodIds = new Set(
    materials.data
      ?.filter((m) => m.kit)
      .map((m) => m.jobMaterialMakeMethodId) ?? []
  );
  if (kittedMakeMethodIds.size) {
    const kittedMaterials = await client
      .from("jobMaterialWithMakeMethodId")
      .select("*")
      .in("jobMakeMethodId", Array.from(kittedMakeMethodIds))
      .neq("methodType", "Make to Order");

    // Create a map of parent kit materials by their make method ID
    const kitParentMap = new Map();
    materials.data?.forEach((material) => {
      if (material.kit && material.jobMaterialMakeMethodId) {
        kitParentMap.set(material.jobMaterialMakeMethodId, material);
      }
    });

    // Add parent reference to each kitted material
    const processedKittedMaterials = (kittedMaterials.data ?? []).map(
      (material) => ({
        ...material,
        isKitComponent: true,
        kitParentId: Array.from(kitParentMap.entries()).find(
          ([makeMethodId]) => makeMethodId === material.jobMakeMethodId
        )?.[1]?.id
      })
    );

    materials.data = [...(materials.data ?? []), ...processedKittedMaterials];
  }

  // The descendant rpc doesn't return expirationDate, so look it up from
  // trackedEntity for the consumed inputs in one batched call. This lets
  // us flag materials whose CONSUMED stock is now past expiry — useful
  // when the user manually overrides a batch's expirationDate after
  // consumption (food-safety scenario: rice flour shouldn't outlive its
  // already-stale rice).
  const consumedEntityIds = Array.from(
    new Set((trackedInputs.data ?? []).map((i) => i.id).filter(Boolean))
  );
  const todayStr = today(getLocalTimeZone()).toString();
  const expiredConsumed =
    consumedEntityIds.length > 0
      ? await client
          .from("trackedEntity")
          .select("id")
          .in("id", consumedEntityIds)
          .not("expirationDate", "is", null)
          .lt("expirationDate", todayStr)
      : { data: [] as { id: string }[] };
  const expiredConsumedIds = new Set(
    (expiredConsumed.data ?? []).map((r) => r.id)
  );
  const consumedExpiredFor = (materialId: string | null) =>
    (trackedInputs.data ?? []).some(
      (input) =>
        (input.activityAttributes as TrackedActivityAttributes)?.[
          "Job Material"
        ] === materialId && expiredConsumedIds.has(input.id)
    );

  // How much of each material has already been picked (staged at lineside) across any
  // non-cancelled picking-list line. Picking is optional, so this is additive overlay
  // data — materials with no picking activity have no entry and render unchanged.
  const materialIds = Array.from(
    new Set(
      (materials.data ?? []).map((m) => m.id).filter((id): id is string => !!id)
    )
  );
  const pickedByMaterial = await getPickedQuantitiesByJobMaterial(
    client,
    materialIds
  );
  const pickedFor = (materialId: string | null) =>
    (materialId ? pickedByMaterial[materialId] : undefined) ?? {
      quantityPicked: 0,
      quantityToPick: 0
    };

  if (requiresSerialTracking) {
    return {
      materials:
        materials.data?.map((material) => {
          const hasExpiredConsumed = consumedExpiredFor(material.id);
          const picked = pickedFor(material.id);
          if (
            !material.requiresSerialTracking &&
            !material.requiresBatchTracking
          )
            return { ...material, hasExpiredConsumed, ...picked };
          const issuedForTrackedParent =
            trackedInputs.data
              ?.filter(
                (input) =>
                  (input.activityAttributes as TrackedActivityAttributes)?.[
                    "Job Material"
                  ] === material.id
              )
              .reduce((acc, input) => {
                return acc + input.quantity;
              }, 0) ?? 0;

          return {
            ...material,
            quantityIssued: issuedForTrackedParent,
            hasExpiredConsumed,
            ...picked
          };
        }) ?? [],
      trackedInputs: trackedInputs.data ?? []
    };
  } else {
    return {
      materials: (materials.data ?? []).map((material) => ({
        ...material,
        hasExpiredConsumed: consumedExpiredFor(material.id),
        ...pickedFor(material.id)
      })),
      trackedInputs: trackedInputs.data ?? []
    };
  }
}

export async function getJobOperationsAssignedToEmployee(
  client: SupabaseClient<Database>,
  employeeId: string,
  companyId: string
) {
  return client.rpc("get_assigned_job_operations", {
    user_id: employeeId,
    company_id: companyId
  });
}

export async function getJobOperationById(
  client: SupabaseClient<Database>,
  operationId: string
) {
  return client.rpc("get_job_operation_by_id", {
    operation_id: operationId
  });
}

export async function getJobOperationsByWorkCenter(
  client: SupabaseClient<Database>,
  { locationId, workCenterId }: { locationId: string; workCenterId: string }
) {
  return client.rpc("get_job_operations_by_work_center", {
    location_id: locationId,
    work_center_id: workCenterId
  });
}

export async function getJobParametersByOperationId(
  client: SupabaseClient<Database>,
  operationId: string
) {
  return client
    .from("jobOperationParameter")
    .select("*")
    .eq("operationId", operationId);
}

export async function getKanbanByJobId(
  client: SupabaseClient<Database>,
  jobId: string | null
) {
  if (!jobId) return { data: null, error: null };
  return client.from("kanban").select("*").eq("jobId", jobId).maybeSingle();
}

export async function getLocationsByCompany(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return client
    .from("location")
    .select("*")
    .eq("companyId", companyId)
    .order("name", { ascending: true });
}

export async function getNonConformanceActions(
  client: SupabaseClient<Database>,
  args: {
    itemId: string;
    processId: string;
    companyId: string;
  }
) {
  const result = await client.rpc("get_action_tasks_by_item_and_process", {
    p_item_id: args.itemId,
    p_process_id: args.processId,
    p_company_id: args.companyId
  });

  return (result.data ?? []) as {
    id: string;
    actionTypeName: string;
    assignee: string;
    nonConformanceId: string;
    notes: JSONContent;
  }[];
}

export async function getProcessesList(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return client
    .from("process")
    .select(`id, name`)
    .eq("companyId", companyId)
    .order("name");
}

export async function getProductionEventsForJobOperation(
  client: SupabaseClient<Database>,
  args: {
    operationId: string;
    userId: string;
  }
) {
  return client
    .from("productionEvent")
    .select("*")
    .eq("jobOperationId", args.operationId);
}

export async function getProductionQuantitiesForJobOperation(
  client: SupabaseClient<Database>,
  operationId: string
) {
  return (client as any)
    .from("productionQuantity")
    .select(
      "*, employee:employeeId(id, firstName, lastName, avatarUrl), createdByUser:createdBy(id, firstName, lastName, avatarUrl)"
    )
    .eq("jobOperationId", operationId)
    .is("invalidatedAt", null)
    .order("createdAt", { ascending: false });
}

/**
 * Production quantities that have been reported but not yet approved for
 * payroll (paymentYear/Month still null) and not invalidated. Managers approve
 * or disapprove these from the MES Report Approvals page. Mirrors the ERP
 * "pending" pay scope (type Production only).
 */
export async function getPendingProductionQuantities(
  client: SupabaseClient<Database>,
  companyId: string,
  jobOperationId?: string
) {
  let query = (client as any)
    .from("productionQuantity")
    .select(
      `id, quantity, type, createdAt, employeeId, createdBy, notes, jobOperationId, reportId,
       jobOperation!inner(id, description, jobId,
         process:processId(name),
         job:jobId(id, jobId, item:itemId(id, readableIdWithRevision, name))
       )`
    )
    .eq("companyId", companyId)
    .eq("type", "Production")
    .is("paymentYear", null)
    .is("invalidatedAt", null);

  if (jobOperationId) {
    query = query.eq("jobOperationId", jobOperationId);
  }

  return query.order("createdAt", { ascending: false });
}

/**
 * Sum the Rework / Scrap quantities that belong to each of the given reports.
 * A single worker submission (finished + rework + scrap) links all three
 * quantity lines under one `reportId`, so this returns the rework/scrap that
 * accompanied each pending Production report — not the operation's running
 * total. Invalidated lines are excluded.
 */
export async function getReworkScrapByReport(
  client: SupabaseClient<Database>,
  companyId: string,
  reportIds: string[]
) {
  const totals = new Map<string, { rework: number; scrap: number }>();
  if (reportIds.length === 0) return totals;

  const { data } = await (client as any)
    .from("productionQuantity")
    .select("reportId, type, quantity")
    .eq("companyId", companyId)
    .in("type", ["Rework", "Scrap"])
    .in("reportId", reportIds)
    .is("invalidatedAt", null);

  for (const row of (data ?? []) as {
    reportId: string | null;
    type: "Rework" | "Scrap";
    quantity: number | null;
  }[]) {
    if (!row.reportId) continue;
    const entry = totals.get(row.reportId) ?? { rework: 0, scrap: 0 };
    if (row.type === "Rework") entry.rework += row.quantity ?? 0;
    else entry.scrap += row.quantity ?? 0;
    totals.set(row.reportId, entry);
  }

  return totals;
}

/**
 * Pending Production reports awaiting approval, each enriched with the rework /
 * scrap reported in the same submission (the lines sharing its reportId). One
 * call for the approvals view: the pending query plus the rework/scrap rollup.
 */
export async function getPendingProductionReports(
  client: SupabaseClient<Database>,
  companyId: string
) {
  const pending = await getPendingProductionQuantities(client, companyId);
  if (pending.error) {
    return { data: [], error: pending.error };
  }

  const rows = (pending.data ?? []) as (Record<string, unknown> & {
    reportId: string | null;
  })[];
  const reportIds = Array.from(
    new Set(
      rows.map((r) => r.reportId).filter((id): id is string => Boolean(id))
    )
  );
  const reworkScrap = await getReworkScrapByReport(
    client,
    companyId,
    reportIds
  );

  const data = rows.map((r) => {
    const totals = r.reportId ? reworkScrap.get(r.reportId) : undefined;
    return { ...r, rework: totals?.rework ?? 0, scrap: totals?.scrap ?? 0 };
  });

  return { data, error: null };
}

/**
 * Approve a reported production quantity by stamping the payment period.
 * Optionally correct the recorded quantity at the same time (the quantity
 * trigger keeps the operation's completed total in sync).
 */
export async function approveProductionQuantity(
  client: SupabaseClient<Database>,
  args: {
    id: string;
    companyId: string;
    year: number;
    month: number;
    userId: string;
    quantity?: number;
  }
) {
  const now = new Date().toISOString();
  return client
    .from("productionQuantity")
    .update({
      paymentYear: args.year,
      paymentMonth: args.month,
      ...(args.quantity !== undefined ? { quantity: args.quantity } : {}),
      updatedBy: args.userId,
      updatedAt: now
    })
    .eq("id", args.id)
    .eq("companyId", args.companyId)
    .is("paymentYear", null)
    .is("invalidatedAt", null);
}

/**
 * Move some rework quantity back into production ("mark fixed"). Flips the
 * oldest Rework rows to Production first, splitting the last partial row when
 * the requested amount lands mid-row (the quantity trigger keeps the
 * operation's stored totals in sync).
 */
export async function markReworkFixed(
  client: SupabaseClient<Database>,
  args: {
    jobOperationId: string;
    companyId: string;
    userId: string;
    quantity: number;
  }
) {
  const now = new Date().toISOString();

  const { data: rows, error } = await (client as any)
    .from("productionQuantity")
    .select("id, quantity, employeeId, paymentYear, paymentMonth")
    .eq("jobOperationId", args.jobOperationId)
    .eq("companyId", args.companyId)
    .eq("type", "Rework")
    .is("invalidatedAt", null)
    .order("createdAt", { ascending: true });
  if (error) return { error };

  let remaining = Math.max(0, Math.floor(args.quantity));
  for (const row of (rows ?? []) as Array<{
    id: string;
    quantity: number;
    employeeId: string;
    paymentYear: number | null;
    paymentMonth: number | null;
  }>) {
    if (remaining <= 0) break;
    const q = Number(row.quantity);

    if (q <= remaining) {
      // Whole row is fixed — flip it to Production.
      const upd = await client
        .from("productionQuantity")
        .update({ type: "Production", updatedBy: args.userId, updatedAt: now })
        .eq("id", row.id)
        .eq("companyId", args.companyId);
      if (upd.error) return upd;
      remaining -= q;
    } else {
      // Only part of this row is fixed — shrink it and add a Production row.
      const upd = await client
        .from("productionQuantity")
        .update({
          quantity: q - remaining,
          updatedBy: args.userId,
          updatedAt: now
        })
        .eq("id", row.id)
        .eq("companyId", args.companyId);
      if (upd.error) return upd;

      const ins = await insertProductionQuantity(client, {
        jobOperationId: args.jobOperationId,
        quantity: remaining,
        employeeId: row.employeeId,
        companyId: args.companyId,
        createdBy: args.userId,
        paymentYear: row.paymentYear,
        paymentMonth: row.paymentMonth
      });
      if (ins.error) return ins;
      remaining = 0;
    }
  }

  return { error: null };
}

/**
 * Disapprove (invalidate) a reported production quantity. The manager can
 * correct the recorded quantity at the same time — the corrected figure is
 * persisted on the row for the record before it is invalidated (the quantity
 * trigger keeps the operation's completed total in sync).
 */
export async function invalidateProductionQuantity(
  client: SupabaseClient<Database>,
  args: { id: string; companyId: string; userId: string; quantity?: number }
) {
  const now = new Date().toISOString();
  return client
    .from("productionQuantity")
    .update({
      ...(args.quantity !== undefined ? { quantity: args.quantity } : {}),
      invalidatedAt: now,
      invalidatedBy: args.userId,
      updatedBy: args.userId,
      updatedAt: now
    })
    .eq("id", args.id)
    .eq("companyId", args.companyId)
    .is("invalidatedAt", null);
}

export async function getRecentJobOperationsByEmployee(
  client: SupabaseClient<Database>,
  args: {
    employeeId: string;
    companyId: string;
  }
) {
  return client.rpc("get_recent_job_operations_by_employee", {
    employee_id: args.employeeId,
    company_id: args.companyId
  });
}

export async function getScrapReasonsList(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return client
    .from("scrapReason")
    .select("id, name")
    .eq("companyId", companyId)
    .order("name");
}

export async function getTrackedEntitiesByMakeMethodId(
  client: SupabaseClient<Database>,
  jobMakeMethodId: string
) {
  return client
    .from("trackedEntity")
    .select("*")
    .eq("attributes->>Job Make Method", jobMakeMethodId)
    .order("createdAt", { ascending: true });
}

export async function getTrackedEntity(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("trackedEntity").select("*").eq("id", id).single();
}

export async function getTrackedEntitiesByOperationId(
  client: SupabaseClient<Database>,
  operationId: string
) {
  const jobOperation = await client
    .from("jobOperation")
    .select("jobMakeMethodId")
    .eq("id", operationId)
    .single();

  if (jobOperation.error || !jobOperation.data.jobMakeMethodId)
    return {
      data: null,
      error: jobOperation.error
    };

  return getTrackedEntitiesByMakeMethodId(
    client,
    jobOperation.data.jobMakeMethodId
  );
}

export async function getTrackedInputs(
  client: SupabaseClient<Database>,
  trackedEntityId?: string
) {
  if (!trackedEntityId) return { data: [] };
  const [inputs, outputs] = await Promise.all([
    client.rpc("get_direct_descendants_of_tracked_entity_strict", {
      p_tracked_entity_id: trackedEntityId
    }),
    client.rpc("get_direct_ancestors_of_tracked_entity_strict", {
      p_tracked_entity_id: trackedEntityId
    })
  ]);

  if (outputs.error || outputs.data.length === 0) return inputs;

  // Handle circular references while keeping only unique entities that appear more times in inputs than outputs
  const inputCounts = new Map<string, number>();
  const outputCounts = new Map<string, number>();

  // Count occurrences in inputs
  inputs.data?.forEach((input) => {
    inputCounts.set(input.id, (inputCounts.get(input.id) || 0) + 1);
  });

  // Count occurrences in outputs
  outputs.data?.forEach((output) => {
    outputCounts.set(output.id, (outputCounts.get(output.id) || 0) + 1);
  });

  // Track which IDs we've already included to avoid duplicates
  const includedIds = new Set<string>();

  const inputsWithoutCircularReferences = inputs.data?.filter((input) => {
    const inputCount = inputCounts.get(input.id) || 0;
    const outputCount = outputCounts.get(input.id) || 0;

    // Only include if input count > output count and we haven't included this ID yet
    if (inputCount > outputCount && !includedIds.has(input.id)) {
      includedIds.add(input.id);
      return true;
    }
    return false;
  });

  return {
    data: inputsWithoutCircularReferences,
    error: inputs.error
  };
}

export async function getThumbnailPathByItemId(
  client: SupabaseClient<Database>,
  itemId: string
) {
  const { data: item } = await client
    .from("item")
    .select("thumbnailPath, modelUploadId")
    .eq("id", itemId)
    .single();

  if (!item) return null;

  const { thumbnailPath, modelUploadId } = item;

  if (!modelUploadId) return thumbnailPath;

  const { data: modelUpload } = await client
    .from("modelUpload")
    .select("thumbnailPath")
    .eq("id", modelUploadId)
    .single();

  const modelUploadThumbnailPath = modelUpload?.thumbnailPath;

  if (!thumbnailPath && modelUploadThumbnailPath) {
    return modelUploadThumbnailPath;
  }
  return thumbnailPath;
}

export async function getWorkCenter(
  client: SupabaseClient<Database>,
  workCenterId: string
) {
  return client
    .from("workCentersWithBlockingStatus")
    .select(
      "id, name, isBlocked, blockingDispatchId, blockingDispatchReadableId"
    )
    .eq("id", workCenterId)
    .single();
}

export async function getWorkCentersByLocation(
  client: SupabaseClient<Database>,
  locationId: string
) {
  // Query both views and merge - workCenters has processes, workCentersWithBlockingStatus has blocking info
  const [workCentersResult, blockingStatusResult] = await Promise.all([
    client
      .from("workCenters")
      .select("*")
      .eq("locationId", locationId)
      .eq("active", true)
      .order("name", { ascending: true }),
    client
      .from("workCentersWithBlockingStatus")
      .select("id, isBlocked, blockingDispatchId, blockingDispatchReadableId")
      .eq("locationId", locationId)
      .eq("active", true)
  ]);

  if (workCentersResult.error) {
    return workCentersResult;
  }

  // Create a map of blocking status by work center id
  const blockingStatusMap = new Map(
    blockingStatusResult.data?.map((wc) => [wc.id, wc]) ?? []
  );

  // Merge the data
  const mergedData = workCentersResult.data?.map((wc) => {
    const blockingStatus = blockingStatusMap.get(wc.id);
    return {
      ...wc,
      isBlocked: blockingStatus?.isBlocked ?? false,
      blockingDispatchId: blockingStatus?.blockingDispatchId ?? null,
      blockingDispatchReadableId:
        blockingStatus?.blockingDispatchReadableId ?? null
    };
  });

  return { data: mergedData, error: null };
}

export async function getWorkCentersByCompany(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return client
    .from("workCenter")
    .select("*")
    .eq("companyId", companyId)
    .order("name", { ascending: true });
}

export async function insertAttributeRecord(
  client: SupabaseClient<Database>,
  data: z.infer<typeof stepRecordValidator> & {
    companyId: string;
    createdBy: string;
  }
) {
  return client.from("jobOperationStepRecord").upsert(data, {
    onConflict: "jobOperationStepId, index",
    ignoreDuplicates: false
  });
}

// Production quantities roll up under a productionQuantityReport: the ERP
// review/approval flow keys off `productionQuantity.reportId`. MES reports a
// single line per submission, so we create the report wrapper here and attach
// the line to it. Without this, MES-reported quantities are orphaned (no
// report) and cannot be reviewed/approved on the ERP side.
async function createReportAndQuantity(
  client: SupabaseClient<Database>,
  args: {
    type: "Production" | "Scrap" | "Rework";
    companyId: string;
    jobOperationId: string;
    employeeId: string;
    createdBy: string;
    quantity: number;
    notes?: string | null;
    scrapReasonId?: string | null;
    paymentYear?: number | null;
    paymentMonth?: number | null;
    // When set, this quantity line is attached to an existing report (so the
    // finished / rework / scrap of one submission share a single reportId)
    // instead of creating a new report of its own.
    reportId?: string | null;
  }
) {
  let reportId = args.reportId ?? null;

  if (!reportId) {
    const { data: operation, error: operationError } = await client
      .from("jobOperation")
      .select("jobId")
      .eq("id", args.jobOperationId)
      .single();

    if (operationError || !operation?.jobId) {
      return {
        data: null,
        error:
          operationError ??
          new Error(
            `Could not resolve job for operation ${args.jobOperationId}`
          )
      };
    }

    const { data: report, error: reportError } = await client
      .from("productionQuantityReport")
      .insert({
        companyId: args.companyId,
        jobId: operation.jobId,
        jobOperationId: args.jobOperationId,
        employeeId: args.employeeId,
        originalQuantity: args.quantity,
        notes: args.notes ?? null,
        createdBy: args.createdBy
      })
      .select("id")
      .single();

    if (reportError || !report) {
      return { data: null, error: reportError };
    }
    reportId = report.id;
  }

  return client
    .from("productionQuantity")
    .insert(
      sanitize({
        companyId: args.companyId,
        jobOperationId: args.jobOperationId,
        reportId,
        type: args.type,
        quantity: args.quantity,
        notes: args.notes ?? null,
        scrapReasonId:
          args.type === "Scrap" ? (args.scrapReasonId ?? null) : null,
        employeeId: args.employeeId,
        createdBy: args.createdBy,
        paymentYear: args.paymentYear ?? null,
        paymentMonth: args.paymentMonth ?? null
      })
    )
    .select("*");
}

export async function insertReworkQuantity(
  client: SupabaseClient<Database>,
  data: z.infer<typeof nonScrapQuantityValidator> & {
    companyId: string;
    createdBy: string;
    employeeId: string;
    reportId?: string | null;
  }
) {
  return createReportAndQuantity(client, {
    type: "Rework",
    companyId: data.companyId,
    jobOperationId: data.jobOperationId,
    employeeId: data.employeeId,
    createdBy: data.createdBy,
    quantity: data.quantity,
    notes: data.notes ?? null,
    reportId: data.reportId ?? null
  });
}

export async function insertProductionQuantity(
  client: SupabaseClient<Database>,
  data: z.infer<typeof nonScrapQuantityValidator> & {
    companyId: string;
    createdBy: string;
    employeeId: string;
    paymentYear?: number | null;
    paymentMonth?: number | null;
  }
) {
  return createReportAndQuantity(client, {
    type: "Production",
    companyId: data.companyId,
    jobOperationId: data.jobOperationId,
    employeeId: data.employeeId,
    createdBy: data.createdBy,
    quantity: data.quantity,
    notes: data.notes ?? null,
    paymentYear: data.paymentYear,
    paymentMonth: data.paymentMonth
  });
}

export async function insertScrapQuantity(
  client: SupabaseClient<Database>,
  // scrapReasonId is optional: the shortfall reason split (rework/scrap) records
  // scrap without a specific reason, same as the report-quantity modal.
  data: Omit<z.infer<typeof scrapQuantityValidator>, "scrapReasonId"> & {
    scrapReasonId?: string | null;
    companyId: string;
    createdBy: string;
    employeeId: string;
    reportId?: string | null;
  }
) {
  return createReportAndQuantity(client, {
    type: "Scrap",
    companyId: data.companyId,
    jobOperationId: data.jobOperationId,
    employeeId: data.employeeId,
    createdBy: data.createdBy,
    quantity: data.quantity,
    notes: data.notes ?? null,
    scrapReasonId: data.scrapReasonId ?? null,
    reportId: data.reportId ?? null
  });
}

/**
 * Set the total Rework or Scrap recorded under a report to an exact value
 * (used when a manager corrects the reported numbers while disapproving). Any
 * existing non-invalidated line of that type under the report is invalidated
 * and, when the target is greater than zero, replaced with a single line — so
 * the operation's stored totals recompute cleanly. No-ops when the total is
 * already the requested value.
 */
export async function setReportQuantity(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    reportId: string;
    jobOperationId: string;
    employeeId: string;
    createdBy: string;
    type: "Rework" | "Scrap";
    quantity: number;
  }
) {
  const target = Math.max(0, Math.floor(args.quantity));

  const { data: existing } = await (client as any)
    .from("productionQuantity")
    .select("id, quantity")
    .eq("companyId", args.companyId)
    .eq("reportId", args.reportId)
    .eq("type", args.type)
    .is("invalidatedAt", null);

  const rows = (existing ?? []) as { id: string; quantity: number | null }[];
  const currentSum = rows.reduce(
    (sum, r) => sum + (Number(r.quantity) || 0),
    0
  );
  if (currentSum === target) return { error: null };

  const now = new Date().toISOString();
  for (const row of rows) {
    const inv = await client
      .from("productionQuantity")
      .update({
        invalidatedAt: now,
        invalidatedBy: args.createdBy,
        updatedBy: args.createdBy,
        updatedAt: now
      })
      .eq("id", row.id)
      .eq("companyId", args.companyId)
      .is("invalidatedAt", null);
    if (inv.error) return inv;
  }

  if (target > 0) {
    const ins = await client.from("productionQuantity").insert(
      sanitize({
        companyId: args.companyId,
        jobOperationId: args.jobOperationId,
        reportId: args.reportId,
        type: args.type,
        quantity: target,
        employeeId: args.employeeId,
        createdBy: args.createdBy
      })
    );
    if (ins.error) return ins;
  }

  return { error: null };
}

export async function endProductionEvent(
  client: SupabaseClient<Database>,
  data: {
    id: string;
    endTime: string;
    employeeId: string;
  }
) {
  return client
    .from("productionEvent")
    .update({ endTime: data.endTime, updatedBy: data.employeeId })
    .eq("id", data.id)
    .select("*");
}

export async function endProductionEventsForJobOperation(
  client: SupabaseClient<Database>,
  args: {
    jobOperationId: string;
    employeeId: string;
    companyId: string;
  }
) {
  return client
    .from("productionEvent")
    .update({ endTime: new Date().toISOString(), updatedBy: args.employeeId })
    .eq("jobOperationId", args.jobOperationId)
    .is("endTime", null)
    .eq("employeeId", args.employeeId)
    .eq("companyId", args.companyId);
}

export async function endProductionEvents(
  client: SupabaseClient<Database>,
  args: { companyId: string; employeeId: string; endTime: string }
) {
  return client
    .from("productionEvent")
    .update({
      endTime: args.endTime
    })
    .is("endTime", null)
    .eq("employeeId", args.employeeId)
    .eq("companyId", args.companyId);
}

export async function endProductionEventsByWorkCenter(
  client: SupabaseClient<Database>,
  args: { workCenterId: string; companyId: string; endTime: string }
) {
  return client
    .from("productionEvent")
    .update({
      endTime: args.endTime
    })
    .is("endTime", null)
    .eq("workCenterId", args.workCenterId)
    .eq("companyId", args.companyId);
}

export async function startProductionEvent(
  client: SupabaseClient<Database>,
  data: Omit<
    z.infer<typeof productionEventValidator>,
    "id" | "action" | "timezone" | "hasActiveEvents"
  > & {
    startTime: string;
    employeeId: string;
    companyId: string;
    createdBy: string;
  },
  trackedEntityId: string | undefined
) {
  if (trackedEntityId) {
    const activityId = nanoid();

    const [eventInsert, operation] = await Promise.all([
      client.from("productionEvent").insert(data).select("id").single(),
      client
        .from("jobOperation")
        .select("*")
        .eq("id", data.jobOperationId)
        .single()
    ]);

    if (eventInsert.error) return eventInsert;
    if (operation.error) return operation;

    const trackedActivityInsert = await client
      .from("trackedActivity")
      .insert({
        id: activityId,
        type: `${operation.data?.description} (${data.type})`,
        sourceDocument: "Production Event",
        sourceDocumentId: eventInsert.data?.id,
        attributes: {
          Job: operation.data?.jobId,
          "Job Operation": data.jobOperationId,
          "Production Event": eventInsert.data?.id,
          "Work Center": data.workCenterId,
          Employee: data.employeeId
        },
        companyId: data.companyId,
        createdBy: data.createdBy
      })
      .select("id")
      .single();

    if (trackedActivityInsert.error) {
      console.error(trackedActivityInsert.error);
      return trackedActivityInsert;
    }

    const trackedActivityOutputInsert = await client
      .from("trackedActivityOutput")
      .insert({
        trackedActivityId: activityId,
        trackedEntityId,
        quantity: 1,
        companyId: data.companyId,
        createdBy: data.createdBy
      });

    if (trackedActivityOutputInsert.error) {
      console.error(trackedActivityOutputInsert.error);
      return trackedActivityOutputInsert;
    }

    return eventInsert;
  }

  return client.from("productionEvent").insert(data).select("*");
}

type JobMethod = {
  id: string;
  methodMaterialId: string;
  parentMaterialId: string | null;
  [key: string]: unknown;
};

type JobMethodTreeItem = {
  id: string;
  data: JobMethod;
  children: JobMethodTreeItem[];
};

function arrayToTree(items: JobMethod[]): JobMethodTreeItem[] {
  const rootItems: JobMethodTreeItem[] = [];
  const lookup: { [id: string]: JobMethodTreeItem } = {};

  for (const item of items) {
    const itemId = item.methodMaterialId;
    const parentId = item.parentMaterialId;

    if (!Object.prototype.hasOwnProperty.call(lookup, itemId)) {
      // @ts-expect-error - building tree incrementally
      lookup[itemId] = { id: itemId, children: [] };
    }

    lookup[itemId].data = item;

    const treeItem = lookup[itemId];

    if (parentId === null || parentId === undefined) {
      rootItems.push(treeItem);
    } else {
      if (!Object.prototype.hasOwnProperty.call(lookup, parentId)) {
        // @ts-expect-error - building tree incrementally
        lookup[parentId] = { id: parentId, children: [] };
      }
      lookup[parentId].children.push(treeItem);
    }
  }
  return rootItems;
}

/**
 * Fetches the job method tree and generates BOM IDs.
 * Returns a map of methodMaterialId to hierarchical BOM ID (e.g., "1.2.3").
 */
export async function getJobMethodBomIdMap(
  client: SupabaseClient<Database>,
  jobId: string
): Promise<Map<string, string>> {
  const result = await client.rpc("get_job_method", { jid: jobId });

  if (result.error || !result.data?.length) {
    return new Map();
  }

  const tree = arrayToTree(result.data as unknown as JobMethod[]);
  if (tree.length === 0) {
    return new Map();
  }

  // Flatten tree and generate BOM IDs
  const flatMethods: FlatTree<JobMethod> = flattenTree(tree[0]);
  const bomIds = generateBomIds(flatMethods);

  // Create map of methodMaterialId to BOM ID
  const bomIdMap = new Map<string, string>();
  flatMethods.forEach((node, index) => {
    bomIdMap.set(node.data.methodMaterialId, bomIds[index]);
  });

  return bomIdMap;
}
