import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData } from "react-router";
import { getConfigurationParameters } from "~/modules/items";
import {
  createJobOperationSupplierQuantityReport,
  createProductionQuantityReport,
  defaultActorKindFromOperationType,
  getJob,
  getJobOperationActorContext,
  getJobOperations,
  getJobs,
  productionQuantityCreateFormValidator,
  resolveProductionQuantityCanAutoApprove,
  seededActorFromOperationContext,
  validateActorMatchesOperationSupplierRouting
} from "~/modules/production";
import { getConfigReferenceSourceForOperation } from "~/modules/production/configTableOverlay.server";
import { ProductionQuantityForm } from "~/modules/production/ui/ProductionQuantities";
import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    role: "employee",
    bypassRls: true
  });

  const url = new URL(request.url);
  const jobId = url.searchParams.get("jobId") ?? "";
  const jobOperationId = url.searchParams.get("jobOperationId") ?? "";

  // Get list of jobs for the job selector with item info
  const jobs = await client
    .from("jobs")
    .select("id, jobId, itemId, item(readableId)")
    .eq("companyId", companyId)
    .order("jobId", { ascending: false })
    .limit(1000);

  if (jobs.error) {
    throw redirect(
      path.to.productionQuantities,
      await flash(request, error(jobs.error, "Failed to fetch jobs"))
    );
  }

  let jobOperations = null;
  let itemId = null;
  let configurationParameters = null;
  let configReferenceSource = null;

  // If jobId is selected, load operations
  if (jobId) {
    const [job, operations] = await Promise.all([
      getJob(client, jobId),
      getJobOperations(client, jobId)
    ]);

    if (job.error) {
      throw redirect(
        path.to.productionQuantities,
        await flash(request, error(job.error, "Failed to fetch job"))
      );
    }

    if (operations.error) {
      throw redirect(
        path.to.productionQuantities,
        await flash(request, error(operations.error, "Failed to fetch job operations"))
      );
    }

    jobOperations = operations.data ?? [];
    itemId = job.data?.itemId ?? null;
  }

  // Load operation context (safe to call with empty jobOperationId)
  const opContext = await getJobOperationActorContext(
    client,
    jobOperationId,
    companyId
  );

  // If both jobId and jobOperationId are selected, load config params
  if (jobId && jobOperationId && itemId) {
    const params = await getConfigurationParameters(
      client,
      itemId,
      companyId
    );
    configurationParameters = params.parameters;

    configReferenceSource = await getConfigReferenceSourceForOperation(
      client,
      {
        jobId,
        jobOperationId,
        companyId,
        reportKind: "productionQuantity"
      }
    );
  }

  const actorContext = {
    ...opContext,
    defaultActorKind: defaultActorKindFromOperationType(opContext.operationType),
    seededActor: seededActorFromOperationContext(opContext)
  };

  const jobOptions =
    jobs.data?.map((job) => ({
      label: job.item?.readableId ? `${job.jobId} - ${job.item.readableId}` : (job.jobId ?? ""),
      value: job.id!
    })) ?? [];

  const operationOptions =
    jobOperations?.map((operation) => ({
      label: operation.description ?? "",
      value: operation.id!
    })) ?? [];

  return {
    jobId,
    jobOperationId,
    jobOptions,
    operationOptions,
    itemId,
    configurationParameters:
      configurationParameters && configurationParameters.length > 0
        ? configurationParameters
        : null,
    configReferenceSource,
    ...actorContext
  };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "production"
  });

  const serviceRole = getCarbonServiceRole();
  const canAutoApprove = await resolveProductionQuantityCanAutoApprove(
    serviceRole,
    companyId,
    userId,
    0
  );

  const formData = await request.formData();
  const validation = await validator(
    productionQuantityCreateFormValidator
  ).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const {
    actorKind,
    employeeId,
    supplierProcessId,
    operationUnitCost,
    operationMinimumCost,
    snapshotPricingEdited,
    notes,
    lines: linesJson,
    jobOperationId
  } = validation.data;

  const routingValidation =
    await validateActorMatchesOperationSupplierRouting(
      client,
      jobOperationId,
      companyId,
      {
        actorKind,
        employeeId,
        supplierProcessId
      }
    );

  if (routingValidation.error) {
    return validationError(
      {
        fieldErrors: {
          supplierProcessId: routingValidation.error.message
        },
        formId: validation.formId
      },
      validation.submittedData
    );
  }

  const lines = JSON.parse(linesJson);

  const result =
    actorKind === "supplier"
      ? await createJobOperationSupplierQuantityReport(client, {
          jobOperationId,
          supplierProcessId: supplierProcessId!,
          lines,
          notes: notes ?? null,
          operationUnitCost:
            snapshotPricingEdited === "true" ? operationUnitCost : undefined,
          operationMinimumCost:
            snapshotPricingEdited === "true"
              ? operationMinimumCost
              : undefined,
          companyId,
          userId
        })
      : await createProductionQuantityReport(client, {
          jobOperationId,
          employeeId: employeeId!,
          lines,
          notes: notes ?? null,
          companyId,
          userId,
          canAutoApprove
        });

  if (result.error) {
    return data(
      validation.submittedData,
      await flash(
        request,
        error(result.error, "Failed to create production quantity")
      )
    );
  }

  return redirect(
    path.to.productionQuantities,
    await flash(request, success("Production quantity created"))
  );
}

export default function NewProductionQuantityRoute() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <ProductionQuantityForm
      jobOperationId={loaderData.jobOperationId}
      jobOptions={loaderData.jobOptions}
      operationOptions={loaderData.operationOptions}
      configurationParameters={loaderData.configurationParameters}
      configReferenceSource={loaderData.configReferenceSource}
      itemId={loaderData.itemId}
      processId={loaderData.processId}
      operationType={loaderData.operationType}
      defaultActorKind={loaderData.defaultActorKind}
      lockActorSelection={loaderData.lockActorSelection}
      supplierId={loaderData.supplierId}
      seededActor={loaderData.seededActor}
    />
  );
}
