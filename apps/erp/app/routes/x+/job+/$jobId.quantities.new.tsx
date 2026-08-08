import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import { z } from "zod";
import {
  OVERLAY_PARAM,
  overlay,
  overlayToken,
  serializeSearch
} from "~/components/Overlay/overlay";
import { getQuantityGridParameters } from "~/modules/items";
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
import { getConfigReferenceSourceForOperation } from "~/modules/production/configTableOverlay.server";
import { getJobVariantQuantities } from "~/modules/production/jobVariantQuantity.service";
import { productionQuantityLineJsonValidator } from "~/modules/production/productionQuantityReport.models";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isOverlay = url.searchParams.get("overlay") === "true";
  const { jobId } = params;
  if (!jobId) throw notFound("jobId not found");

  if (!isOverlay) {
    const jobOperationId = url.searchParams.get("jobOperationId") ?? "";
    const target = overlay.to.newJobProductionQuantity({
      jobId,
      jobOperationId: jobOperationId || undefined
    });
    const token = overlayToken(target);
    const redirectParams = new URLSearchParams();
    if (token) redirectParams.append(OVERLAY_PARAM, token);
    const query = serializeSearch(redirectParams);
    throw redirect(
      query
        ? `${path.to.jobProductionQuantities(jobId)}?${query}`
        : path.to.jobProductionQuantities(jobId)
    );
  }

  const { client, companyId } = await requirePermissions(request, {
    create: "production"
  });

  const jobOperationId = url.searchParams.get("jobOperationId") ?? "";

  const [job, jobOperations, opContext] = await Promise.all([
    getJob(client, jobId),
    getJobOperations(client, jobId),
    getJobOperationActorContext(client, jobOperationId, companyId)
  ]);
  const seededActor = seededActorFromOperationContext(opContext);
  const actorContext = {
    ...opContext,
    defaultActorKind: defaultActorKindFromOperationType(
      opContext.operationType
    ),
    seededActor,
    lockActorSelection: seededActor.lockActorSelection
  };

  // Style/attribute qty editor when the job has planned variant rows (or legacy
  // configTable dual-read). Bundle jobs have none — plain quantity only.
  const planned = await getJobVariantQuantities(client, jobId, companyId);
  const jobIsConfigured = (planned.data?.length ?? 0) > 0;

  const configurationParameters =
    job.data?.itemId && jobIsConfigured
      ? (await getQuantityGridParameters(client, job.data.itemId, companyId))
          .parameters
      : [];

  const itemId = job.data?.itemId ?? null;
  const jobOption = {
    label: job.data?.jobId ?? "",
    value: jobId
  };

  const configReferenceSource = await getConfigReferenceSourceForOperation(
    client,
    {
      jobId,
      jobOperationId: jobOperationId || undefined,
      companyId,
      reportKind: "productionQuantity"
    }
  );

  // A master work order carries only its cutting operation (sew/finish are
  // reported on the bundles), so no operation filtering is needed here.
  const operationOptions =
    jobOperations?.data?.map((operation) => ({
      label: operation.description ?? "",
      value: operation.id!
    })) ?? [];

  const remainingByOperationId: Record<string, number> = {};
  for (const op of jobOperations?.data ?? []) {
    if (!op.id) continue;
    remainingByOperationId[op.id] = Math.max(
      0,
      (op.targetQuantity ?? op.operationQuantity ?? 0) -
        (op.quantityComplete ?? 0) -
        (op.quantityScrapped ?? 0) -
        (op.quantityReworked ?? 0)
    );
  }

  return {
    jobId,
    jobOption,
    jobOperationId,
    operationOptions,
    remainingByOperationId,
    configurationParameters:
      configurationParameters.length > 0 ? configurationParameters : null,
    configReferenceSource,
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
        error(
          reportResult.error,
          reportResult.error.message || "Failed to insert process completion"
        )
      )
    );
  }

  if (isOverlay) {
    return data(
      { ok: true as const, jobId },
      await flash(request, success("Process completion created"))
    );
  }

  return redirect(
    `${path.to.jobProductionQuantities(jobId)}?${getParams(request)}`,
    await flash(request, success("Process completion created"))
  );
}

export default function NewProductionQuantityRoute() {
  return null;
}
