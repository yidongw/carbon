import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import {
  OVERLAY_PARAM,
  overlay,
  overlayToken,
  serializeSearch
} from "~/components/Overlay/overlay";
import { getConfigurationParameters } from "~/modules/items";
import {
  defaultActorKindFromOperationType,
  getJob,
  getJobOperationActorContext,
  getJobOperations,
  getJobs,
  jobOperationPickupValidator,
  seededActorFromOperationContext,
  upsertJobOperationPickup,
  upsertJobOperationSupplierPickup,
  validateActorMatchesOperationSupplierRouting
} from "~/modules/production";
import { getConfigReferenceSourceForOperation } from "~/modules/production/configTableOverlay.server";
import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isOverlay = url.searchParams.get("overlay") === "true";

  if (!isOverlay) {
    const jobId = url.searchParams.get("jobId") ?? "";
    const jobOperationId = url.searchParams.get("jobOperationId") ?? "";
    const target = overlay.to.newProductionPickup({
      jobId: jobId || undefined,
      jobOperationId: jobOperationId || undefined
    });
    const token = overlayToken(target);
    const redirectParams = new URLSearchParams();
    if (token) redirectParams.append(OVERLAY_PARAM, token);
    const query = serializeSearch(redirectParams);
    throw redirect(query ? `${path.to.pickups}?${query}` : path.to.pickups);
  }

  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    role: "employee",
    bypassRls: true
  });

  const jobId = url.searchParams.get("jobId") ?? "";
  const jobOperationId = url.searchParams.get("jobOperationId") ?? "";

  // Get list of jobs for the job selector
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

  // If jobId is selected, load operations
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

  // If jobOperationId is selected, load operation context
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
          reportKind: "pickup"
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

  const formData = await request.formData();
  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";
  const validation = await validator(jobOperationPickupValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const routingValidation =
    await validateActorMatchesOperationSupplierRouting(
      client,
      validation.data.jobOperationId,
      companyId,
      {
        actorKind: validation.data.actorKind,
        employeeId: validation.data.employeeId,
        supplierProcessId: validation.data.supplierProcessId
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

  const {
    configuration: rawConfiguration,
    id: _id,
    actorKind,
    employeeId: _employeeId,
    supplierProcessId: _supplierProcessId,
    ...rest
  } = validation.data;

  let configuration: unknown;
  if (rawConfiguration) {
    try {
      configuration =
        typeof rawConfiguration === "string"
          ? JSON.parse(rawConfiguration)
          : rawConfiguration;
    } catch {
      configuration = undefined;
    }
  }

  const insert =
    actorKind === "supplier"
      ? await upsertJobOperationSupplierPickup(client, {
          jobOperationId: rest.jobOperationId,
          supplierProcessId: validation.data.supplierProcessId!,
          quantity: rest.quantity,
          configuration,
          notes: rest.notes ?? null,
          companyId,
          createdBy: userId
        })
      : await upsertJobOperationPickup(client, {
          jobOperationId: rest.jobOperationId,
          employeeId: validation.data.employeeId!,
          quantity: rest.quantity,
          configuration,
          notes: rest.notes ?? null,
          companyId,
          createdBy: userId
        });

  if (insert.error) {
    return data(
      validation.submittedData,
      await flash(request, error(insert.error, "Failed to create process pickup"))
    );
  }

  if (isOverlay) {
    return data(
      { ok: true as const },
      await flash(request, success("Process pickup created"))
    );
  }

  return redirect(
    path.to.pickups,
    await flash(request, success("Process pickup created"))
  );
}

export default function NewPickupRoute() {
  return null;
}
