import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData } from "react-router";
import { getConfigurationParameters } from "~/modules/items";
import {
  getJob,
  getJobOperations,
  isJobLocked,
  productionQuantityValidator,
  upsertProductionQuantity
} from "~/modules/production";
import ProductionQuantityForm from "~/modules/production/ui/Jobs/ProductionQuantityForm";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    create: "production"
  });

  const { jobId } = params;
  if (!jobId) throw notFound("jobId not found");

  const jobOperationId =
    new URL(request.url).searchParams.get("jobOperationId") ?? "";

  const [job, jobOperations] = await Promise.all([
    getJob(client, jobId),
    jobOperationId ? null : getJobOperations(client, jobId)
  ]);

  const configurationParameters = job.data?.itemId
    ? (await getConfigurationParameters(client, job.data.itemId, companyId))
        .parameters
    : [];

  const itemId = job.data?.itemId ?? null;

  if (jobOperationId) {
    return {
      jobOperationId,
      operationOptions: [] as const,
      configurationParameters:
        configurationParameters.length > 0 ? configurationParameters : null,
      itemId
    };
  }

  const operationOptions =
    jobOperations?.data?.map((operation) => ({
      label: operation.description ?? "",
      value: operation.id!
    })) ?? [];

  return {
    jobOperationId: "",
    operationOptions,
    configurationParameters:
      configurationParameters.length > 0 ? configurationParameters : null,
    itemId
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId } = await requirePermissions(request, {
    create: "production"
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

  const isOverlay =
    new URL(request.url).searchParams.get("overlay") === "true";
  const formData = await request.formData();

  const validation = await validator(productionQuantityValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
  const { id, configuration: rawConfiguration, ...rest } = validation.data;

  if (rest.type !== "Scrap") {
    rest.scrapReasonId = undefined;
  }

  let configuration: unknown;
  if (rawConfiguration) {
    try {
      configuration =
        typeof rawConfiguration === "string"
          ? JSON.parse(rawConfiguration)
          : rawConfiguration;
    } catch (parseError) {
      console.error(parseError);
    }
  }

  const insert = await upsertProductionQuantity(client, {
    ...rest,
    configuration,
    companyId
  });
  if (insert.error) {
    return data(
      {},
      await flash(
        request,
        error(insert.error, "Failed to insert production quantity")
      )
    );
  }

  if (isOverlay) {
    return data(
      { ok: true as const, jobId },
      await flash(request, success("Production quantity created"))
    );
  }

  return redirect(
    `${path.to.jobProductionQuantities(jobId)}?${getParams(request)}`,
    await flash(request, success("Production quantity created"))
  );
}

export default function NewProductionQuantityRoute() {
  const { jobOperationId, operationOptions, configurationParameters, itemId } =
    useLoaderData<typeof loader>();
  const initialValues = {
    type: "Production" as const,
    jobOperationId,
    quantity: 0,
    scrapReasonId: "",
    notes: "",
    createdBy: ""
  };

  return (
    <ProductionQuantityForm
      initialValues={initialValues}
      operationOptions={[...(operationOptions ?? [])]}
      configurationParameters={configurationParameters}
      itemId={itemId}
    />
  );
}
