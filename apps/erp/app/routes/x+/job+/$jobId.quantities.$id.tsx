import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData } from "react-router";
import { getConfigurationParameters } from "~/modules/items";
import {
  getJob,
  getJobOperations,
  getProductionQuantity,
  isJobLocked,
  productionQuantityValidator,
  replaceProductionQuantityReportLines
} from "~/modules/production";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import ProductionQuantityForm from "~/modules/production/ui/Jobs/ProductionQuantityForm";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production"
  });

  const { id, jobId } = params;
  if (!id) throw notFound("id not found");
  if (!jobId) throw notFound("jobId not found");

  const [productionQuantity, jobOperations, job] = await Promise.all([
    getProductionQuantity(client, id),
    getJobOperations(client, jobId),
    getJob(client, jobId)
  ]);

  const operationOptions =
    jobOperations.data?.map((operation) => ({
      label: operation.description ?? "",
      value: operation.id
    })) ?? [];

  const configurationParameters = job.data?.itemId
    ? (await getConfigurationParameters(client, job.data.itemId, companyId))
        .parameters
    : [];

  return {
    productionQuantity: productionQuantity?.data ?? null,
    operationOptions,
    configurationParameters:
      configurationParameters.length > 0 ? configurationParameters : null,
    itemId: job.data?.itemId ?? null
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "production"
  });

  const { jobId, id: quantityId } = params;
  if (!jobId) throw notFound("jobId not found");
  if (!quantityId) throw notFound("id not found");

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

  const isOverlay =
    new URL(request.url).searchParams.get("overlay") === "true";
  const formData = await request.formData();

  const validation = await validator(productionQuantityValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, configuration: rawConfiguration, employeeId, ...rest } = validation.data;
  if (!id) throw new Error("id not found");

  if (rest.type !== "Scrap") {
    rest.scrapReasonId = undefined;
  }

  let configuration: unknown;
  if (rawConfiguration) {
    try {
      configuration =
        typeof rawConfiguration === "string"
          ? JSON.parse(rawConfiguration)
          : rawConfiguration;
    } catch (parseError) {
      console.error(parseError);
    }
  }

  const existing = await getProductionQuantity(client, id);
  if (!existing.data?.reportId) {
    return data(
      {},
      await flash(request, error("Quantity report not found"))
    );
  }

  const { data: activeLines, error: linesError } = await client
    .from("productionQuantity")
    .select("id, type, quantity, configuration, scrapReasonId, notes")
    .eq("reportId", existing.data.reportId)
    .eq("companyId", companyId)
    .is("invalidatedAt", null);

  if (linesError) {
    return data(
      {},
      await flash(request, error(linesError, "Failed to load report lines"))
    );
  }

  const lines = (activeLines ?? []).map((line) =>
    line.id === id
      ? {
          type: rest.type,
          quantity: rest.quantity,
          configuration,
          scrapReasonId: rest.scrapReasonId,
          notes: rest.notes
        }
      : {
          type: line.type,
          quantity: line.quantity,
          configuration: line.configuration ?? undefined,
          scrapReasonId: line.scrapReasonId ?? undefined,
          notes: line.notes ?? undefined
        }
  );

  const update = await replaceProductionQuantityReportLines(client, {
    reportId: existing.data.reportId,
    companyId,
    userId,
    employeeId: employeeId ?? userId,
    lines
  });

  if (update.error) {
    return data(
      {},
      await flash(
        request,
        error(update.error, "Failed to update production quantity")
      )
    );
  }

  if (isOverlay) {
    return data(
      { ok: true as const, jobId },
      await flash(request, success("Updated production quantity"))
    );
  }

  return redirect(
    `${path.to.jobProductionQuantities(jobId)}?${getParams(request)}`,
    await flash(request, success("Updated production quantity"))
  );
}

export default function EditProductionQuantityRoute() {
  const { productionQuantity, operationOptions, configurationParameters, itemId } =
    useLoaderData<typeof loader>();

  const initialValues = {
    id: productionQuantity?.id!,
    type: productionQuantity?.type ?? ("Scrap" as "Scrap"),
    jobOperationId: productionQuantity?.jobOperationId ?? "",
    quantity: productionQuantity?.quantity ?? 0,
    scrapReasonId: productionQuantity?.scrapReasonId ?? "",
    notes: productionQuantity?.notes ?? "",
    employeeId: productionQuantity?.employeeId ?? "",
    configuration: productionQuantity?.configuration ?? undefined
  };

  return (
    <ProductionQuantityForm
      key={initialValues.id}
      initialValues={initialValues}
      operationOptions={operationOptions ?? []}
      configurationParameters={configurationParameters}
      itemId={itemId}
    />
  );
}
