import { assertIsPost, error, notFound } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { Json } from "@carbon/database";
import { trigger } from "@carbon/jobs";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { getConfigurationParameters } from "~/modules/items";
import type { ConfigurationParameter } from "~/modules/items/types";
import {
  getJob,
  getJobConfigurationHistory,
  getJobProductionQuantitySummary,
  isJobLocked
} from "~/modules/production";
import { buildConfigColumns } from "~/modules/production/configParamsTableColumns";
import {
  buildConfigTableActionResponse,
  jobConfigurationUpdateFields,
  parseConfigurationFormValue
} from "~/modules/production/configTableOverlay.server";
import type { ConfigRow } from "~/modules/production/jobConfiguration";
import {
  applyConfigAdjustment,
  sumConfigTables
} from "~/modules/production/jobConfiguration";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { path } from "~/utils/path";

export type JobConfigurationHistoryEntry = {
  id: string;
  quantity: number;
  configuration: { configTable: ConfigRow[]; configTablePrimaryKeys: string[] };
  createdAt: string;
  createdByName: string | null;
};

export type JobProcessQuantityEntry = {
  operationId: string;
  label: string;
  quantity: number;
  configuration: { configTable: ConfigRow[]; configTablePrimaryKeys: string[] };
};

export type JobConfigTableOverlayLoaderData = {
  jobDisplayId: string | null;
  parameters: ConfigurationParameter[];
  initialRows?: ConfigRow[];
  history: JobConfigurationHistoryEntry[];
  processQuantities: JobProcessQuantityEntry[];
};

function normalizeConfigurationValue(value: unknown): {
  configTable: ConfigRow[];
  configTablePrimaryKeys: string[];
} {
  const cfg =
    typeof value === "object" && value !== null && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  const configTable = Array.isArray(cfg?.configTable)
    ? (cfg?.configTable as ConfigRow[])
    : [];
  const configTablePrimaryKeys = Array.isArray(cfg?.configTablePrimaryKeys)
    ? (cfg?.configTablePrimaryKeys as unknown[]).filter(
        (k): k is string => typeof k === "string"
      )
    : ["Quantities"];
  return { configTable, configTablePrimaryKeys };
}

export async function loader({
  request,
  params
}: LoaderFunctionArgs): Promise<JobConfigTableOverlayLoaderData | null> {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    bypassRls: true
  });

  const { jobId } = params;
  if (!jobId) return null;

  const job = await getJob(client, jobId);
  if (job.error || !job.data?.itemId) return null;

  const { parameters } = await getConfigurationParameters(
    client,
    job.data.itemId,
    companyId
  );
  if (parameters.length === 0) return null;

  const existingConfig = job.data.configuration as Record<
    string,
    unknown
  > | null;
  const configTable = existingConfig?.configTable;
  const initialRows = Array.isArray(configTable)
    ? (configTable as ConfigRow[])
    : undefined;

  const historyResult = await getJobConfigurationHistory(
    client,
    jobId,
    companyId
  );
  const history: JobConfigurationHistoryEntry[] = (
    historyResult.data ?? []
  ).map((entry) => {
    const createdByUser = Array.isArray(entry.createdByUser)
      ? entry.createdByUser[0]
      : entry.createdByUser;
    return {
      id: entry.id,
      quantity: Number(entry.quantity) || 0,
      configuration: normalizeConfigurationValue(entry.configuration),
      createdAt: entry.createdAt,
      createdByName: createdByUser?.fullName ?? null
    };
  });

  const { primaryKeys } = buildConfigColumns(parameters, "Quantities");
  const summaryResult = await getJobProductionQuantitySummary(
    client,
    jobId,
    companyId
  );
  const processQuantities: JobProcessQuantityEntry[] = (
    summaryResult.data ?? []
  ).map((entry) => {
    const summed = sumConfigTables(entry.configurations, primaryKeys);
    return {
      operationId: entry.operationId,
      label: entry.label,
      quantity: summed.total,
      configuration: summed.configuration
    };
  });

  return {
    jobDisplayId: job.data.jobId ?? null,
    parameters,
    initialRows,
    history,
    processQuantities
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);

  const { client, companyId, userId } = await requirePermissions(request, {
    update: "production"
  });

  const { jobId } = params;
  if (!jobId) {
    throw notFound("jobId not found");
  }

  const { client: viewClient } = await requirePermissions(request, {
    view: "production"
  });
  const job = await getJob(viewClient, jobId);
  await requireUnlocked({
    request,
    isLocked: isJobLocked(job.data?.status),
    redirectTo: path.to.job(jobId),
    message: "Cannot modify a locked job. Reopen it first."
  });

  const adjustment = parseConfigurationFormValue(
    (await request.formData()).get("adjustment")
  );
  if (!adjustment) {
    return data(
      { ok: false as const, error: "Invalid adjustment data" },
      await flash(request, error("Invalid adjustment data", "Update failed"))
    );
  }

  const adjustmentTable = normalizeConfigurationValue(adjustment);
  const hasAdjustment = adjustmentTable.configTable.some((row) =>
    adjustmentTable.configTablePrimaryKeys.some(
      (key) => (Number(row[key]) || 0) !== 0
    )
  );
  if (!hasAdjustment) {
    return data(
      { ok: false as const, error: "Enter an adjustment before saving" },
      await flash(request, error("No adjustment entered", "Update failed"))
    );
  }

  const merged = applyConfigAdjustment(job.data?.configuration, adjustment);
  if (merged.hasNegative) {
    return data(
      {
        ok: false as const,
        error: "Adjustment would make a quantity negative"
      },
      await flash(
        request,
        error("Adjustment would make a quantity negative", "Update failed")
      )
    );
  }

  const update = await client
    .from("job")
    .update({
      ...jobConfigurationUpdateFields(merged.configuration),
      updatedBy: userId,
      updatedAt: new Date().toISOString()
    })
    .eq("id", jobId)
    .eq("companyId", companyId);

  if (update.error) {
    return data(
      { ok: false as const, error: update.error.message },
      await flash(
        request,
        error(update.error, "Failed to update configuration")
      )
    );
  }

  const historyInsert = await client.from("jobConfigurationHistory").insert({
    jobId,
    companyId,
    configuration: adjustmentTable as unknown as Json,
    quantity: merged.deltaTotal,
    createdBy: userId
  });

  if (historyInsert.error) {
    return data(
      { ok: false as const, error: historyInsert.error.message },
      await flash(
        request,
        error(historyInsert.error, "Failed to record history")
      )
    );
  }

  // The quantity change is already committed; recalculation is a background
  // side effect. Don't let a failure to enqueue it turn the committed mutation
  // into a 500 (which would also prompt the user to retry and double-record
  // the adjustment in history).
  try {
    await trigger("recalculate", {
      type: "jobRequirements",
      id: jobId,
      companyId,
      userId
    });
  } catch (recalcError) {
    console.error(
      "[job config-table] failed to enqueue recalculate",
      recalcError
    );
  }

  // Toast is shown client-side when the job config overlay closes (translated).
  return data(buildConfigTableActionResponse(merged.configuration));
}
