import { assertIsPost, error, success } from "@carbon/auth";
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
  createJobOperationSupplierQuantityReport,
  createProductionQuantityReport,
  defaultActorKindFromOperationType,
  getJob,
  getJobOperationActorContext,
  getJobOperations,
  getJobs,
  productionQuantityCreateFormValidator,
  recordBundleProductionReport,
  resolveProductionQuantityCanAutoApprove,
  seededActorFromOperationContext,
  validateActorMatchesOperationSupplierRouting
} from "~/modules/production";
import { productionQuantityLineJsonValidator } from "~/modules/production/productionQuantityReport.models";
import { getVariantsQuantityReferenceSourceForOperation } from "~/modules/production/variantsQuantityOverlay.server";
import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isOverlay = url.searchParams.get("overlay") === "true";

  if (!isOverlay) {
    const jobId = url.searchParams.get("jobId") ?? "";
    const jobOperationId = url.searchParams.get("jobOperationId") ?? "";
    const target = overlay.to.newProductionQuantity({
      jobId: jobId || undefined,
      jobOperationId: jobOperationId || undefined
    });
    const token = overlayToken(target);
    const redirectParams = new URLSearchParams();
    if (token) redirectParams.append(OVERLAY_PARAM, token);
    const query = serializeSearch(redirectParams);
    throw redirect(
      query
        ? `${path.to.productionQuantities}?${query}`
        : path.to.productionQuantities
    );
  }

  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    role: "employee",
    bypassRls: true
  });

  const jobId = url.searchParams.get("jobId") ?? "";
  const jobOperationId = url.searchParams.get("jobOperationId") ?? "";
  const lockOperation = url.searchParams.get("lockOperation") === "true";

  const jobs = await getJobs(client, companyId, {
    search: null,
    limit: 1000,
    offset: 0,
    sorts: [{ sortBy: "jobId", sortAsc: false }],
    filters: []
  });

  if (jobs.error) {
    throw error(jobs.error, "Failed to fetch jobs");
  }

  const itemIds = [
    ...new Set((jobs.data ?? []).map((j) => j.itemId).filter(Boolean))
  ] as string[];

  const itemReadableIdById = new Map<string, string>();
  if (itemIds.length > 0) {
    const items = await client
      .from("item")
      .select("id, readableIdWithRevision")
      .in("id", itemIds);

    for (const item of items.data ?? []) {
      if (item.readableIdWithRevision) {
        itemReadableIdById.set(item.id, item.readableIdWithRevision);
      }
    }
  }

  let jobOperations = null;
  let opContext = null;
  let itemId = null;
  let configurationParameters = null;
  let variantsQuantityReferenceSource = null;

  if (jobId) {
    const [job, operations] = await Promise.all([
      getJob(client, jobId),
      getJobOperations(client, jobId)
    ]);

    if (job.error) {
      throw error(job.error, "Failed to fetch job");
    }

    if (operations.error) {
      throw error(operations.error, "Failed to fetch job operations");
    }

    jobOperations = operations.data ?? [];
    itemId = job.data?.itemId ?? null;

    // A Bundle Work Order's job already has a fixed variant, so reporting on
    // it is a plain quantity — don't surface the style's variant config table.
    const bundle = await client
      .from("bundleWorkOrder")
      .select("id")
      .eq("jobId", jobId)
      .maybeSingle();

    if (itemId && !bundle.data) {
      const params = await getQuantityGridParameters(client, itemId, companyId);
      configurationParameters = params.parameters;
    }
  }

  if (jobOperationId) {
    opContext = await getJobOperationActorContext(
      client,
      jobOperationId,
      companyId
    );

    if (jobId) {
      variantsQuantityReferenceSource =
        await getVariantsQuantityReferenceSourceForOperation(client, {
          jobId,
          jobOperationId,
          companyId,
          reportKind: "productionQuantity"
        });
    }
  }

  const seededActor = opContext
    ? seededActorFromOperationContext(opContext)
    : null;
  const actorContext = opContext
    ? {
        ...opContext,
        defaultActorKind: defaultActorKindFromOperationType(
          opContext.operationType
        ),
        seededActor,
        lockActorSelection: seededActor?.lockActorSelection ?? false
      }
    : {
        defaultActorKind: "employee" as const,
        seededActor: null,
        operationType: null,
        processId: null,
        lockActorSelection: false,
        supplierId: undefined
      };

  const jobOptions =
    jobs.data?.map((job) => {
      const itemReadableId = job.itemId
        ? itemReadableIdById.get(job.itemId)
        : undefined;
      return {
        label: itemReadableId
          ? `${job.jobId} (${itemReadableId})`
          : (job.jobId ?? ""),
        value: job.id!
      };
    }) ?? [];

  const operationOptions =
    jobOperations?.map((operation) => ({
      label: operation.description ?? "",
      value: operation.id!
    })) ?? [];

  // Remaining per operation (target − completed − scrapped − reworked, floored
  // at 0) — used to prefill the Production quantity when an operation is chosen.
  // operationId -> its process id, so the form can filter the actor list by the
  // process of whichever operation is picked in the dropdown.
  const processByOperationId: Record<string, string> = {};
  const remainingByOperationId: Record<string, number> = {};
  for (const op of jobOperations ?? []) {
    if (!op.id) continue;
    if (op.processId) processByOperationId[op.id] = op.processId;
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
    jobOperationId,
    jobOptions,
    operationOptions,
    processByOperationId,
    itemId,
    remainingByOperationId,
    // Lock job + operation when the caller seeds a specific operation to report
    // (e.g. a Master Work Order's cutting operation).
    lockJobSelection: lockOperation && Boolean(jobId),
    lockOperationSelection: lockOperation && Boolean(jobOperationId),
    configurationParameters:
      configurationParameters && configurationParameters.length > 0
        ? configurationParameters
        : null,
    variantsQuantityReferenceSource,
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

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const formData = await request.formData();
  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";
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

  let lines: z.infer<typeof productionQuantityLineJsonValidator>[];
  try {
    lines = z
      .array(productionQuantityLineJsonValidator)
      .parse(JSON.parse(linesJson));
  } catch {
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

  const { data: operation, error: operationError } = await client
    .from("jobOperation")
    .select("jobId")
    .eq("id", jobOperationId)
    .eq("companyId", companyId)
    .single();

  if (operationError || !operation?.jobId) {
    return data(
      validation.submittedData,
      await flash(request, error(operationError, "Job operation not found"))
    );
  }

  const result =
    actorKind === "supplier"
      ? await createJobOperationSupplierQuantityReport(client, {
          companyId,
          jobId: operation.jobId,
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
          snapshotPricingEdited: snapshotPricingEdited === "true"
        })
      : await createProductionQuantityReport(client, {
          companyId,
          jobId: operation.jobId,
          jobOperationId,
          userId,
          employeeId: employeeId?.trim() ? employeeId : userId,
          notes: notes?.trim() ? notes : null,
          lines: mappedLines,
          paymentYear: canAutoApprove ? currentYear : null,
          paymentMonth: canAutoApprove ? currentMonth : null
        });

  if (result.error) {
    return data(
      validation.submittedData,
      await flash(
        request,
        error(
          result.error,
          result.error.message || "Failed to create process completion"
        )
      )
    );
  }

  // Cutting reports on a Master Work Order no longer auto-spawn bundles — the
  // user reviews/edits the split via the "Split Batch" modal, which creates the
  // bundles. Here we only cache a Bundle Work Order's own reported quantity.
  if (actorKind !== "supplier") {
    await recordBundleProductionReport(client, {
      jobId: operation.jobId,
      companyId,
      createdBy: userId,
      lines: mappedLines
    });
  }

  if (isOverlay) {
    // A master work order's cutting report leads into Split Batch. Return a
    // generic "open this overlay next" signal (resolved by the report service)
    // so the overlay host can chain it even when the report was opened from a
    // deep link (which carries no onCreated callback).
    const splitBatchMasterWorkOrderId =
      "splitBatchMasterWorkOrderId" in result
        ? result.splitBatchMasterWorkOrderId
        : null;
    const nextOverlay = splitBatchMasterWorkOrderId
      ? {
          id: "masterWorkOrderSplitBatch",
          params: { masterWorkOrderId: splitBatchMasterWorkOrderId }
        }
      : null;
    return data(
      { ok: true as const, nextOverlay },
      await flash(request, success("Process completion created"))
    );
  }

  return redirect(
    path.to.productionQuantities,
    await flash(request, success("Process completion created"))
  );
}

export default function NewProductionQuantityRoute() {
  return null;
}
