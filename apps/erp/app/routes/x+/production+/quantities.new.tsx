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
import { productionQuantityLineJsonValidator } from "~/modules/production/productionQuantityReport.models";
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
      query ? `${path.to.productionQuantities}?${query}` : path.to.productionQuantities
    );
  }

  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    role: "employee",
    bypassRls: true
  });

  const jobId = url.searchParams.get("jobId") ?? "";
  const jobOperationId = url.searchParams.get("jobOperationId") ?? "";

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
  let configReferenceSource = null;

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

    if (itemId) {
      const params = await getConfigurationParameters(
        client,
        itemId,
        companyId
      );
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
  }

  const actorContext = opContext
    ? {
        ...opContext,
        defaultActorKind: defaultActorKindFromOperationType(
          opContext.operationType
        ),
        seededActor: seededActorFromOperationContext(opContext)
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
        error(result.error, "Failed to create process completion")
      )
    );
  }

  if (isOverlay) {
    return data(
      { ok: true as const },
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
