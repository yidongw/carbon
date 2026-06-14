import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData } from "react-router";
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
import PickupForm from "~/modules/production/ui/Jobs/PickupForm";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production"
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
    defaultActorKind: defaultActorKindFromOperationType(opContext.operationType),
    seededActor: seededActorFromOperationContext(opContext)
  };

  const itemId = job.data?.itemId ?? null;

  const configurationParameters = itemId
    ? (await getConfigurationParameters(client, itemId, companyId)).parameters
    : [];

  const operationOptions =
    jobOperations?.data?.map((operation) => ({
      label: operation.description ?? "",
      value: operation.id!
    })) ?? [];

  return {
    jobOperationId,
    operationOptions,
    itemId,
    configurationParameters:
      configurationParameters.length > 0 ? configurationParameters : null,
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

  const { configuration: rawConfiguration, id: _id, actorKind, ...rest } =
    validation.data;

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
          supplierProcessId: rest.supplierProcessId!,
          quantity: rest.quantity,
          configuration,
          notes: rest.notes ?? null,
          companyId,
          createdBy: userId
        })
      : await upsertJobOperationPickup(client, {
          ...rest,
          employeeId: rest.employeeId!,
          configuration,
          companyId,
          createdBy: userId
        });

  if (insert.error) {
    return data(
      {},
      await flash(request, error(insert.error, "Failed to record pickup"))
    );
  }

  if (isOverlay) {
    return data(
      { ok: true as const, jobId },
      await flash(request, success("Pickup recorded"))
    );
  }

  return redirect(
    `${path.to.jobPickups(jobId)}?${getParams(request)}`,
    await flash(request, success("Pickup recorded"))
  );
}

export default function NewJobPickupRoute() {
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
    quantity: 0,
    notes: "",
    employeeId: seededActor.employeeId,
    actorKind: seededActor.actorKind,
    supplierProcessId: seededActor.supplierProcessId
  };

  return (
    <PickupForm
      initialValues={initialValues}
      operationOptions={[...(operationOptions ?? [])]}
      configurationParameters={configurationParameters}
      itemId={itemId}
      processId={processId}
      operationType={operationType}
      defaultActorKind={defaultActorKind}
      lockActorSelection={seededActor.lockActorSelection}
      supplierId={seededActor.supplierId}
    />
  );
}
