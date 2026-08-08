import { assertIsPost, error, notFound } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { Json } from "@carbon/database";
import { trigger } from "@carbon/jobs";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { getConfigurationParameters, getStyleColorList } from "~/modules/items";
import type { ConfigurationParameter } from "~/modules/items/types";
import {
  getJob,
  getJobConfigurationHistory,
  isJobLocked
} from "~/modules/production";
import {
  buildConfigTableActionResponse,
  parseConfigurationFormValue
} from "~/modules/production/configTableOverlay.server";
import type { ConfigRow } from "~/modules/production/jobConfiguration";
import { applyConfigAdjustment } from "~/modules/production/jobConfiguration";
import {
  getJobVariantQuantities,
  jobVariantQuantitiesToConfigTable,
  replaceJobVariantQuantitiesFromConfigTable
} from "~/modules/production/jobVariantQuantity.service";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { path } from "~/utils/path";

export type JobConfigurationHistoryEntry = {
  id: string;
  quantity: number;
  configuration: { configTable: ConfigRow[]; configTablePrimaryKeys: string[] };
  createdAt: string;
  createdByName: string | null;
};

export type JobConfigTableOverlayLoaderData = {
  jobDisplayId: string | null;
  parameters: ConfigurationParameter[];
  initialRows?: ConfigRow[];
  history: JobConfigurationHistoryEntry[];
  /** Color code -> color name, so the config table shows names not codes. */
  colorNames: Record<string, string>;
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

  const planned = await getJobVariantQuantities(client, jobId, companyId);
  const fromTable = jobVariantQuantitiesToConfigTable(planned.data ?? []);
  const initialRows =
    fromTable.configTable.length > 0
      ? (fromTable.configTable as ConfigRow[])
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

  // Map color code -> name so the config table displays names, not codes.
  const styleColors = await getStyleColorList(client, companyId);
  const colorNames: Record<string, string> = {};
  for (const color of styleColors.data ?? []) {
    if (color.colorCode) {
      colorNames[color.colorCode] = color.colorName ?? color.colorCode;
    }
  }

  return {
    jobDisplayId: job.data.jobId ?? null,
    parameters,
    initialRows,
    history,
    colorNames
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

  if (!job.data?.itemId) {
    return data(
      { ok: false as const, error: "Job has no item" },
      await flash(request, error("Job has no item", "Update failed"))
    );
  }

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

  const planned = await getJobVariantQuantities(client, jobId, companyId);
  const currentConfiguration = jobVariantQuantitiesToConfigTable(
    planned.data ?? []
  );

  const merged = applyConfigAdjustment(currentConfiguration, adjustment);
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

  const replaced = await replaceJobVariantQuantitiesFromConfigTable(client, {
    jobId,
    parentItemId: job.data.itemId,
    companyId,
    userId,
    configuration: merged.configuration
  });
  if (replaced.error) {
    return data(
      { ok: false as const, error: replaced.error.message },
      await flash(
        request,
        error(replaced.error, "Failed to update configuration")
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

  return data(buildConfigTableActionResponse(merged.configuration));
}
