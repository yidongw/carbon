import { assertIsPost, error, notFound } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { trigger } from "@carbon/jobs";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import {
  getAttributeValueNames,
  getQuantityGridParameters
} from "~/modules/items";
import type { ConfigurationParameter } from "~/modules/items/types";
import { getJob, isJobLocked } from "~/modules/production";
import {
  getJobVariantQuantities,
  jobVariantQuantitiesToTable,
  replaceJobVariantQuantitiesFromTable
} from "~/modules/production/jobVariantQuantity.service";
import {
  buildVariantsQuantityActionResponse,
  parseVariantQuantitiesFormValue
} from "~/modules/production/variantsQuantityOverlay.server";
import type { VariantsQuantityRow } from "~/modules/production/variantTable";
import { applyVariantTableAdjustment } from "~/modules/production/variantTable";
import { buildAttributeValueNames } from "~/modules/shared/variantDisplay";
import { getDatabaseClient } from "~/services/database.server";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { path } from "~/utils/path";

export type JobVariantsQuantityOverlayLoaderData = {
  jobDisplayId: string | null;
  parameters: ConfigurationParameter[];
  initialRows?: VariantsQuantityRow[];
  /** Attribute value code -> name for the variants quantity grid. */
  attributeValueNames: Record<string, string>;
};

export async function loader({
  request,
  params
}: LoaderFunctionArgs): Promise<JobVariantsQuantityOverlayLoaderData | null> {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    bypassRls: true
  });

  const { jobId } = params;
  if (!jobId) return null;

  const job = await getJob(client, jobId);
  if (job.error || !job.data?.itemId) return null;

  // The combo quantity grid belongs to jobs that OWN a plan — master work orders
  // and standalone configured Style jobs (which have jobVariantQuantity rows).
  // Bundle/variant SKU jobs have none (their item resolves to the parent Style,
  // so an item-centric check would wrongly show the full matrix), so they get
  // plain quantity, not the grid.
  const planned = await getJobVariantQuantities(client, jobId, companyId);
  if ((planned.data?.length ?? 0) === 0) return null;

  const { parameters } = await getQuantityGridParameters(
    client,
    job.data.itemId,
    companyId
  );
  if (parameters.length === 0) return null;

  const fromTable = jobVariantQuantitiesToTable(planned.data ?? []);
  const initialRows =
    fromTable.variantTable.length > 0
      ? (fromTable.variantTable as VariantsQuantityRow[])
      : undefined;

  const attributeValueNameRows = await getAttributeValueNames(
    client,
    companyId
  );
  const attributeValueNames = buildAttributeValueNames(
    attributeValueNameRows.data ?? []
  );

  return {
    jobDisplayId: job.data.jobId ?? null,
    parameters,
    initialRows,
    attributeValueNames
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

  const adjustment = parseVariantQuantitiesFormValue(
    (await request.formData()).get("adjustment")
  );
  if (!adjustment) {
    return data(
      { ok: false as const, error: "Invalid adjustment data" },
      await flash(request, error("Invalid adjustment data", "Update failed"))
    );
  }

  const adjustmentRows = Array.isArray(
    (adjustment as { variantTable?: unknown }).variantTable
  )
    ? (adjustment as { variantTable: VariantsQuantityRow[] }).variantTable
    : [];
  const hasAdjustment = adjustmentRows.some(
    (row) => (Number(row.Quantities) || 0) !== 0
  );
  if (!hasAdjustment) {
    return data(
      { ok: false as const, error: "Enter an adjustment before saving" },
      await flash(request, error("No adjustment entered", "Update failed"))
    );
  }

  const planned = await getJobVariantQuantities(client, jobId, companyId);
  const currentVariantQuantities = jobVariantQuantitiesToTable(
    planned.data ?? []
  );

  const merged = applyVariantTableAdjustment(
    currentVariantQuantities,
    adjustment
  );
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

  const replaced = await replaceJobVariantQuantitiesFromTable(
    client,
    getDatabaseClient(),
    {
      jobId,
      parentItemId: job.data.itemId,
      companyId,
      userId,
      variantQuantities: merged.variantQuantities
    }
  );
  if (replaced.error) {
    return data(
      { ok: false as const, error: replaced.error.message },
      await flash(
        request,
        error(replaced.error, "Failed to update variants quantity")
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
      "[job variants-quantity] failed to enqueue recalculate",
      recalcError
    );
  }

  return data(buildVariantsQuantityActionResponse(merged.variantQuantities));
}
