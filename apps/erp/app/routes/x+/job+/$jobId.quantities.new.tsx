import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData } from "react-router";
import { z } from "zod";
import { getConfigurationParameters } from "~/modules/items";
import {
  assertSupplierQuantityAllowedForOperation,
  createJobOperationSupplierQuantityReport,
  createProductionQuantityReport,
  defaultActorKindFromOperationType,
  getJob,
  getJobOperationActorContext,
  getJobOperations,
  isJobLocked,
  productionQuantityCreateFormValidator,
  resolveProductionQuantityCanAutoApprove,
  seededActorFromOperationContext,
  validateActorMatchesOperationSupplierRouting
} from "~/modules/production";
import { productionQuantityLineJsonValidator } from "~/modules/production/productionQuantityReport.models";
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

  if (jobOperationId) {
    return {
      jobOperationId,
      operationOptions: [] as const,
      configurationParameters:
        configurationParameters.length > 0 ? configurationParameters : null,
      itemId,
      ...actorContext
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
    itemId,
    ...actorContext
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
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

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

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

  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";
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

  const routingValidation = await validateActorMatchesOperationSupplierRouting(
    client,
    jobOperationId,
    companyId,
    { actorKind, employeeId, supplierProcessId }
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

  let lines: z.infer<typeof productionQuantityLineJsonValidator>[];
  try {
    lines = z
      .array(productionQuantityLineJsonValidator)
      .parse(JSON.parse(linesJson));
  } catch (parseError) {
    console.error(parseError);
    return validationError(
      {
        fieldErrors: { lines: "Invalid quantity lines" },
        formId: validation.formId
      },
      validation.submittedData
    );
  }

  const mappedLines = lines.map((line) => ({
    ...line,
    scrapReasonId: line.type === "Scrap" ? line.scrapReasonId : undefined
  }));

  if (actorKind === "supplier") {
    const operationCheck = await assertSupplierQuantityAllowedForOperation(
      client,
      jobOperationId,
      companyId
    );
    if (operationCheck.error) {
      return data(
        {},
        await flash(
          request,
          error(
            operationCheck.error,
            operationCheck.error.message ??
              "Supplier quantities cannot be recorded for Inside operations"
          )
        )
      );
    }
  }

  const reportResult =
    actorKind === "supplier"
      ? await createJobOperationSupplierQuantityReport(client, {
          companyId,
          jobId,
          jobOperationId,
          supplierProcessId: supplierProcessId!,
          userId,
          notes: notes?.trim() ? notes : null,
          lines: mappedLines,
          snapshotPricing:
            operationUnitCost != null
              ? {
                  operationUnitCost,
                  operationMinimumCost: operationMinimumCost ?? 0
                }
              : undefined,
          snapshotPricingEdited: snapshotPricingEdited === "1"
        })
      : await createProductionQuantityReport(client, {
          companyId,
          jobId,
          jobOperationId,
          userId,
          employeeId: employeeId?.trim() ? employeeId : userId,
          notes: notes?.trim() ? notes : null,
          lines: mappedLines,
          paymentYear: canAutoApprove ? currentYear : null,
          paymentMonth: canAutoApprove ? currentMonth : null
        });

  if (reportResult.error) {
    return data(
      {},
      await flash(
        request,
        error(reportResult.error, "Failed to insert production quantity")
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
  const {
    jobOperationId,
    operationOptions,
    configurationParameters,
    itemId,
    processId,
    operationType,
    defaultActorKind,
    seededActor
  } = useLoaderData<typeof loader>();
  const initialValues = {
    jobOperationId,
    notes: "",
    employeeId: seededActor.employeeId,
    actorKind: seededActor.actorKind,
    supplierProcessId: seededActor.supplierProcessId,
    supplierId: seededActor.supplierId,
    lines: [{ type: "Production" as const, quantity: 0 }]
  };

  return (
    <ProductionQuantityForm
      initialValues={initialValues}
      operationOptions={[...(operationOptions ?? [])]}
      configurationParameters={configurationParameters}
      itemId={itemId}
      processId={processId}
      operationType={operationType}
      defaultActorKind={defaultActorKind}
      lockActorSelection={seededActor.lockActorSelection}
    />
  );
}
