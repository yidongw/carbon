import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData } from "react-router";
import {
  getJob,
  getJobOperations,
  isJobLocked,
  productionQuantityValidator,
  upsertProductionQuantity
} from "~/modules/production";
import { getConfigReferenceSourceForOperation } from "~/modules/production/configTableOverlay.server";
import { productionQuantityLineJsonValidator } from "~/modules/production/productionQuantityReport.models";
import ProductionQuantityForm from "~/modules/production/ui/Jobs/ProductionQuantityForm";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    create: "production"
  });

  const { jobId } = params;
  if (!jobId) throw notFound("jobId not found");

  const jobOperationId =
    new URL(request.url).searchParams.get("jobOperationId") ?? "";

  const [job, jobOperations, opContext] = await Promise.all([
    getJob(client, jobId),
    jobOperationId ? null : getJobOperations(client, jobId),
    getJobOperationActorContext(client, jobOperationId, companyId)
  ]);
  const actorContext = {
    ...opContext,
    defaultActorKind: defaultActorKindFromOperationType(
      opContext.operationType
    ),
    seededActor: seededActorFromOperationContext(opContext)
  };

  const configurationParameters = job.data?.itemId
    ? (await getConfigurationParameters(client, job.data.itemId, companyId))
        .parameters
    : [];

  const itemId = job.data?.itemId ?? null;

  const configReferenceSource = await getConfigReferenceSourceForOperation(
    client,
    {
      jobId,
      jobOperationId: jobOperationId || undefined,
      companyId,
      reportKind: "productionQuantity"
    }
  );

  if (jobOperationId) {
    return {
      jobOperationId,
      operationOptions: [] as const,
      configurationParameters:
        configurationParameters.length > 0 ? configurationParameters : null,
      configReferenceSource,
      itemId,
      ...actorContext
    };
  }

  const operationOptions =
    jobOperations.data?.map((operation) => ({
      label: operation.description ?? "",
      value: operation.id
    })) ?? [];

  return {
    jobOperationId: "",
    operationOptions,
    configurationParameters:
      configurationParameters.length > 0 ? configurationParameters : null,
    configReferenceSource,
    itemId,
    ...actorContext
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

  const formData = await request.formData();
  const modal = formData.get("type") === "modal";

  const validation = await validator(productionQuantityValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
  const { id, ...d } = validation.data;

  // If the type is not Scrap, clear the scrapReasonId
  if (d.type !== "Scrap") {
    d.scrapReasonId = undefined;
  }

  const insert = await upsertProductionQuantity(client, {
    ...d,
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

  return modal
    ? data(insert, { status: 201 })
    : redirect(
        `${path.to.jobProductionQuantities(jobId)}?${getParams(request)}`,
        await flash(request, success("Production quantity created"))
      );
}

export default function NewProductionQuantityRoute() {
  const {
    jobOperationId,
    operationOptions,
    configurationParameters,
    configReferenceSource,
    itemId,
    processId,
    operationType,
    defaultActorKind,
    seededActor
  } = useLoaderData<typeof loader>();
  const initialValues = {
    type: "Production" as const,
    jobOperationId: "",
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
      configReferenceSource={configReferenceSource}
      itemId={itemId}
      processId={processId}
      operationType={operationType}
      defaultActorKind={defaultActorKind}
      lockActorSelection={seededActor.lockActorSelection}
    />
  );
}
