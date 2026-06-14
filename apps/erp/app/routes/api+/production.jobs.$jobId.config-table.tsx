import { assertIsPost, error, notFound } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { Json } from "@carbon/database";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { getConfigurationParameters } from "~/modules/items";
import type { ConfigurationParameter } from "~/modules/items/types";
import { getJob, isJobLocked } from "~/modules/production";
import {
  buildConfigTableActionResponse,
  parseConfigurationFormValue
} from "~/modules/production/configTableOverlay.server";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { path } from "~/utils/path";

export type JobConfigTableOverlayLoaderData = {
  jobDisplayId: string | null;
  parameters: ConfigurationParameter[];
  initialRows?: Record<string, string | number | boolean>[];
};

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
    ? (configTable as Record<string, string | number | boolean>[])
    : undefined;

  return {
    jobDisplayId: job.data.jobId ?? null,
    parameters,
    initialRows
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

  const configuration = parseConfigurationFormValue(
    (await request.formData()).get("configuration")
  );
  if (!configuration) {
    return data(
      {},
      await flash(request, error("Invalid configuration data", "Update failed"))
    );
  }

  const update = await client
    .from("job")
    .update({
      configuration: configuration as Json,
      updatedBy: userId,
      updatedAt: new Date().toISOString()
    })
    .eq("id", jobId)
    .eq("companyId", companyId);

  if (update.error) {
    return data(
      {},
      await flash(
        request,
        error(update.error, "Failed to update configuration")
      )
    );
  }

  // Toast is shown client-side when the job config overlay closes (translated).
  return data(buildConfigTableActionResponse(configuration));
}
