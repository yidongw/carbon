import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData } from "react-router";
import { z } from "zod";
import { getConfigurationParameters } from "~/modules/items";
import {
  getJob,
  getJobOperationActorContext,
  getJobOperationSupplierQuantityReport,
  getJobOperations,
  getProductionQuantity,
  isJobLocked,
  productionQuantityCreateFormValidator,
  productionQuantityValidator,
  replaceJobOperationSupplierQuantityReportLines,
  replaceProductionQuantityReportLines
} from "~/modules/production";
import { productionQuantityLineJsonValidator } from "~/modules/production/productionQuantityReport.models";
import {
  isProductionQuantityReportId,
  isSupplierQuantityLineId,
  isSupplierQuantityReportId
} from "~/modules/production/operationType";
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

  const [job, jobOperations] = await Promise.all([
    getJob(client, jobId),
    getJobOperations(client, jobId)
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

  const itemId = job.data?.itemId ?? null;
  const base = {
    operationOptions,
    configurationParameters:
      configurationParameters.length > 0 ? configurationParameters : null,
    itemId
  };

  if (isSupplierQuantityReportId(id)) {
    const reportResult = await getJobOperationSupplierQuantityReport(
      client,
      id,
      companyId
    );
    if (!reportResult.data) {
      throw notFound("Supplier quantity report not found");
    }

    const actorContext = await getJobOperationActorContext(
      client,
      reportResult.data.jobOperationId,
      companyId
    );

    return {
      ...base,
      mode: "supplier-report" as const,
      supplierReport: reportResult.data,
      productionQuantity: null,
      ...actorContext
    };
  }

  if (isProductionQuantityReportId(id)) {
    const { data: report, error: reportError } = await client
      .from("productionQuantityReport")
      .select("*")
      .eq("id", id)
      .eq("companyId", companyId)
      .single();

    if (reportError || !report) {
      throw notFound("Production quantity report not found");
    }

    const { data: activeLines } = await client
      .from("productionQuantity")
      .select("id, type, quantity, configuration, scrapReasonId, notes")
      .eq("reportId", id)
      .eq("companyId", companyId)
      .is("invalidatedAt", null);

    const actorContext = await getJobOperationActorContext(
      client,
      report.jobOperationId,
      companyId
    );

    return {
      ...base,
      mode: "employee-report" as const,
      employeeReport: {
        ...report,
        activeLines: activeLines ?? []
      },
      productionQuantity: null,
      ...actorContext
    };
  }

  if (isSupplierQuantityLineId(id)) {
    const { data: line, error: lineError } = await client
      .from("jobOperationSupplierQuantity")
      .select(
        "*, supplierProcess!jobOperationSupplierQuantity_supplierProcessId_fkey(id, supplierId)"
      )
      .eq("id", id)
      .eq("companyId", companyId)
      .single();

    if (lineError || !line) {
      throw notFound("Supplier quantity line not found");
    }

    const actorContext = await getJobOperationActorContext(
      client,
      line.jobOperationId,
      companyId
    );

    return {
      ...base,
      mode: "supplier-line" as const,
      productionQuantity: line,
      ...actorContext
    };
  }

  const productionQuantity = await getProductionQuantity(client, id);
  if (!productionQuantity.data) {
    throw notFound("Production quantity not found");
  }

  const actorContext = await getJobOperationActorContext(
    client,
    productionQuantity.data.jobOperationId,
    companyId
  );

  return {
    ...base,
    mode: "employee-line" as const,
    productionQuantity: productionQuantity.data,
    ...actorContext
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "production"
  });

  const { jobId, id } = params;
  if (!jobId) throw notFound("jobId not found");
  if (!id) throw notFound("id not found");

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

  if (isSupplierQuantityReportId(id) || isProductionQuantityReportId(id)) {
    const formData = await request.formData();
    const validation = await validator(
      productionQuantityCreateFormValidator
    ).validate(formData);

    if (validation.error) {
      return validationError(validation.error);
    }

    const { notes, lines: linesJson } = validation.data;

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

    const update = isSupplierQuantityReportId(id)
      ? await replaceJobOperationSupplierQuantityReportLines(client, {
          reportId: id,
          companyId,
          userId,
          notes: notes?.trim() ? notes : null,
          lines: mappedLines
        })
      : await replaceProductionQuantityReportLines(client, {
          reportId: id,
          companyId,
          userId,
          employeeId: validation.data.employeeId ?? userId,
          notes: notes?.trim() ? notes : null,
          lines: mappedLines
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

  const formData = await request.formData();
  const validation = await validator(productionQuantityValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const {
    id: lineId,
    configuration: rawConfiguration,
    employeeId,
    ...rest
  } = validation.data;
  if (!lineId) throw new Error("id not found");

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

  const isSupplierLine = isSupplierQuantityLineId(lineId);

  const existing = isSupplierLine
    ? await client
        .from("jobOperationSupplierQuantity")
        .select("reportId")
        .eq("id", lineId)
        .eq("companyId", companyId)
        .single()
    : await getProductionQuantity(client, lineId);

  const reportId = isSupplierLine
    ? existing.data?.reportId
    : existing.data?.reportId;

  if (!reportId) {
    return data(
      {},
      await flash(request, error("Quantity report not found"))
    );
  }

  const linesTable = isSupplierLine
    ? "jobOperationSupplierQuantity"
    : "productionQuantity";

  const { data: activeLines, error: linesError } = await client
    .from(linesTable)
    .select("id, type, quantity, configuration, scrapReasonId, notes")
    .eq("reportId", reportId)
    .eq("companyId", companyId)
    .is("invalidatedAt", null);

  if (linesError) {
    return data(
      {},
      await flash(request, error(linesError, "Failed to load report lines"))
    );
  }

  const lines = (activeLines ?? []).map((line) =>
    line.id === lineId
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

  const update = isSupplierLine
    ? await replaceJobOperationSupplierQuantityReportLines(client, {
        reportId,
        companyId,
        userId,
        notes: null,
        lines
      })
    : await replaceProductionQuantityReportLines(client, {
        reportId,
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
  const loaderData = useLoaderData<typeof loader>();

  if (loaderData.mode === "supplier-report" && loaderData.supplierReport) {
    const report = loaderData.supplierReport;
    return (
      <ProductionQuantityForm
        key={report.id}
        initialValues={{
          jobOperationId: report.jobOperationId,
          actorKind: "supplier",
          supplierProcessId: report.supplierProcessId,
          supplierId: report.supplierProcess?.supplierId ?? "",
          notes: report.notes ?? "",
          lines: report.activeLines.map(
            (line: (typeof report.activeLines)[number]) => ({
              type: line.type,
              quantity: line.quantity,
              scrapReasonId: line.scrapReasonId ?? undefined,
              notes: line.notes ?? undefined,
              configuration: line.configuration ?? undefined
            })
          )
        }}
        operationOptions={loaderData.operationOptions ?? []}
        configurationParameters={loaderData.configurationParameters}
        itemId={loaderData.itemId}
        processId={loaderData.processId}
        operationType={loaderData.operationType}
        defaultActorKind="supplier"
      />
    );
  }

  if (loaderData.mode === "employee-report" && loaderData.employeeReport) {
    const report = loaderData.employeeReport;
    return (
      <ProductionQuantityForm
        key={report.id}
        initialValues={{
          jobOperationId: report.jobOperationId,
          actorKind: "employee",
          employeeId: report.employeeId,
          notes: report.notes ?? "",
          lines: report.activeLines.map(
            (line: (typeof report.activeLines)[number]) => ({
              type: line.type,
              quantity: line.quantity,
              scrapReasonId: line.scrapReasonId ?? undefined,
              notes: line.notes ?? undefined,
              configuration: line.configuration ?? undefined
            })
          )
        }}
        operationOptions={loaderData.operationOptions ?? []}
        configurationParameters={loaderData.configurationParameters}
        itemId={loaderData.itemId}
        processId={loaderData.processId}
        operationType={loaderData.operationType}
        defaultActorKind="employee"
      />
    );
  }

  const pq = loaderData.productionQuantity;
  if (!pq) {
    return null;
  }

  const isSupplierLine = loaderData.mode === "supplier-line";

  const supplierProcess =
    isSupplierLine && "supplierProcess" in pq
      ? Array.isArray(pq.supplierProcess)
        ? pq.supplierProcess[0]
        : pq.supplierProcess
      : undefined;

  const initialValues = {
    id: pq.id,
    type: pq.type ?? ("Scrap" as "Scrap"),
    jobOperationId: pq.jobOperationId ?? "",
    quantity: pq.quantity ?? 0,
    scrapReasonId: pq.scrapReasonId ?? "",
    notes: pq.notes ?? "",
    employeeId: isSupplierLine || !("employeeId" in pq) ? "" : (pq.employeeId ?? ""),
    actorKind: isSupplierLine ? ("supplier" as const) : ("employee" as const),
    supplierProcessId: isSupplierLine
      ? ("supplierProcessId" in pq ? (pq.supplierProcessId ?? "") : "")
      : "",
    supplierId: isSupplierLine ? (supplierProcess?.supplierId ?? "") : "",
    configuration: pq.configuration ?? undefined
  };

  return (
    <ProductionQuantityForm
      key={initialValues.id}
      initialValues={initialValues}
      operationOptions={loaderData.operationOptions ?? []}
      configurationParameters={loaderData.configurationParameters}
      itemId={loaderData.itemId}
      processId={loaderData.processId}
      operationType={loaderData.operationType}
      defaultActorKind={isSupplierLine ? "supplier" : "employee"}
    />
  );
}
