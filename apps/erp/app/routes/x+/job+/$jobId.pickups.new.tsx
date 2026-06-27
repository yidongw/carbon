import { assertIsPost, error, notFound, success } from "@carbon/auth";
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
  jobOperationPickupValidator,
  seededActorFromOperationContext,
  upsertJobOperationPickup,
  upsertJobOperationSupplierPickup,
  validateActorMatchesOperationSupplierRouting
} from "~/modules/production";
import { getConfigReferenceSourceForOperation } from "~/modules/production/configTableOverlay.server";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isOverlay = url.searchParams.get("overlay") === "true";
  const { jobId } = params;
  if (!jobId) throw notFound("jobId not found");

  if (!isOverlay) {
    const jobOperationId = url.searchParams.get("jobOperationId") ?? "";
    const target = overlay.to.newJobPickup({
      jobId,
      jobOperationId: jobOperationId || undefined
    });
    const token = overlayToken(target);
    const redirectParams = new URLSearchParams();
    if (token) redirectParams.append(OVERLAY_PARAM, token);
    const query = serializeSearch(redirectParams);
    throw redirect(
      query ? `${path.to.jobPickups(jobId)}?${query}` : path.to.jobPickups(jobId)
    );
  }

  const { client, companyId } = await requirePermissions(request, {
    view: "production"
  });

  const jobOperationId = url.searchParams.get("jobOperationId") ?? "";

  const [job, jobOperations, opContext] = await Promise.all([
    getJob(client, jobId),
    getJobOperations(client, jobId),
    getJobOperationActorContext(client, jobOperationId, companyId)
  ]);
  const actorContext = {
    ...opContext,
    defaultActorKind: defaultActorKindFromOperationType(opContext.operationType),
    seededActor: seededActorFromOperationContext(opContext)
  };

  const itemId = job.data?.itemId ?? null;

  const configurationParameters = itemId
    ? (await getConfigurationParameters(client, itemId, companyId)).parameters
    : [];

  const configReferenceSource = await getConfigReferenceSourceForOperation(
    client,
    {
      jobId,
      jobOperationId: jobOperationId || undefined,
      companyId,
      reportKind: "pickup"
    }
  );

  const operationOptions =
    jobOperations?.data?.map((operation) => ({
      label: operation.description ?? "",
      value: operation.id!
    })) ?? [];

  const jobOption = {
    label: job.data?.jobId ?? "",
    value: jobId
  };

  return {
    jobId,
    jobOption,
    jobOperationId,
    operationOptions,
    itemId,
    configurationParameters:
      configurationParameters.length > 0 ? configurationParameters : null,
    configReferenceSource,
    ...actorContext
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "production"
  });

  const { jobId } = params;
  if (!jobId) throw notFound("jobId not found");

  const isOverlay =
    new URL(request.url).searchParams.get("overlay") === "true";
  const formData = await request.formData();

  const validation = await validator(jobOperationPickupValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const routingValidation = await validateActorMatchesOperationSupplierRouting(
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
          quantity: rest.quantity,
          notes: rest.notes,
          employeeId: validation.data.employeeId!,
          configuration,
          companyId,
          createdBy: userId
        });

  if (insert.error) {
    return data(
      {},
      await flash(request, error(insert.error, "Failed to record process pickup"))
    );
  }

  if (isOverlay) {
    return data(
      { ok: true as const, jobId },
      await flash(request, success("Process pickup recorded"))
    );
  }

  return redirect(
    `${path.to.jobPickups(jobId)}?${getParams(request)}`,
    await flash(request, success("Process pickup recorded"))
  );
}

export default function NewJobPickupRoute() {
  return null;
}
