import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData } from "react-router";
import {
  filterOperationsByIds,
  getJob,
  getJobOperations,
  getVisibleJobOperationIds,
  isJobLocked,
  productionEventValidator,
  upsertProductionEvent
} from "~/modules/production";
import { ProductionEventForm } from "~/modules/production/ui/Jobs";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    create: "production"
  });

  const { jobId } = params;
  if (!jobId) throw notFound("jobId not found");

  const jobOperations = await getJobOperations(client, jobId);
  const visibleOperationIds = await getVisibleJobOperationIds(client, {
    companyId,
    jobId
  });
  if (visibleOperationIds.error) {
    throw redirect(
      path.to.jobProductionEvents(jobId),
      await flash(
        request,
        error(visibleOperationIds.error, "Failed to load visible operations")
      )
    );
  }

  const filteredOperations = filterOperationsByIds(
    jobOperations.data ?? [],
    visibleOperationIds.data
  );

  const operationOptions =
    filteredOperations.map((operation) => ({
      label: operation.description ?? "",
      value: operation.id
    })) ?? [];

  return { operationOptions };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
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

  const validation = await validator(productionEventValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
  const { id, ...d } = validation.data;

  const visibleOperationIds = await getVisibleJobOperationIds(client, {
    companyId,
    jobId
  });
  if (
    visibleOperationIds.data &&
    visibleOperationIds.data.length > 0 &&
    !visibleOperationIds.data.includes(d.jobOperationId)
  ) {
    return data(
      {},
      await flash(
        request,
        error(
          null,
          "This operation is not available on the current garment work order."
        )
      )
    );
  }

  const insert = await upsertProductionEvent(client, {
    ...d,
    companyId,
    createdBy: userId
  });
  if (insert.error) {
    return data(
      {},
      await flash(
        request,
        error(insert.error, "Failed to insert production event")
      )
    );
  }

  if (d.endTime) {
    const serviceRole = await getCarbonServiceRole();
    await serviceRole.functions.invoke("post-production-event", {
      body: {
        productionEventId: insert.data.id,
        userId,
        companyId
      }
    });
  }

  return modal
    ? data(insert, { status: 201 })
    : redirect(
        `${path.to.jobProductionEvents(jobId)}?${getParams(request)}`,
        await flash(request, success("Production event created"))
      );
}

export default function NewProductionEventRoute() {
  const { operationOptions } = useLoaderData<typeof loader>();
  const initialValues = {
    type: "Labor" as const,
    jobOperationId: "",
    startTime: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
    employeeId: "",
    workCenterId: "",
    notes: ""
  };

  return (
    <ProductionEventForm
      initialValues={initialValues}
      operationOptions={operationOptions ?? []}
    />
  );
}
