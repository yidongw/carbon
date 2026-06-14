import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { JSONContent } from "@carbon/react";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  HStack,
  Spinner,
  useMount,
  VStack
} from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { Suspense } from "react";
import { LuShoppingCart } from "react-icons/lu";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Await, redirect, useLoaderData, useParams } from "react-router";
import {
  CadModel,
  DeferredFiles,
  Hyperlink,
  SupplierAvatar
} from "~/components";
import { usePanels } from "~/components/Layout";
import { usePermissions, useRealtime, useRouteData, useCurrencyFormatter } from "~/hooks";
import type { Job, JobPurchaseOrderLine } from "~/modules/production";
import {
  getJob,
  getJobDocumentsWithItemId,
  getJobMakeMethodById,
  getJobMaterialsByMethodId,
  getJobOperationsByMethodId,
  getJobPurchaseOrderLines,
  getProductionDataByOperations,
  getRootMakeMethod,
  isJobLocked,
  jobValidator,
  recalculateJobRequirements,
  updateJob
} from "~/modules/production";
import {
  JobBillOfMaterial,
  JobBillOfProcess,
  JobDocuments,
  JobEstimatesVsActuals,
  JobNotes,
  JobPurchaseOrderPriceBreakdown,
  groupJobPurchaseOrderLines,
  JobRiskRegister
} from "~/modules/production/ui/Jobs";
import JobMakeMethodTools from "~/modules/production/ui/Jobs/JobMakeMethodTools";
import PurchasingStatus from "~/modules/purchasing/ui/PurchaseOrder/PurchasingStatus";
import { getTagsList } from "~/modules/shared";
import { useItems } from "~/stores";
import type { StorageItem } from "~/types";
import { setCustomFields } from "~/utils/form";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    bypassRls: true
  });

  const { jobId } = params;
  if (!jobId) throw new Error("Could not find jobId");

  const job = await getJob(client, jobId);
  if (job.error) {
    throw redirect(
      path.to.jobs,
      await flash(request, error(job.error, "Failed to load job"))
    );
  }

  const rootMethod = await getRootMakeMethod(client, jobId, companyId);
  if (rootMethod.error) {
    return {
      notes: (job.data?.notes ?? {}) as JSONContent,
      purchaseOrderLines: getJobPurchaseOrderLines(client, jobId),
      materials: [],
      operations: [],
      makeMethod: null,
      files: Promise.resolve([] as StorageItem[]),
      productionData: Promise.resolve({
        quantities: [],
        events: [],
        notes: []
      }),
      tags: []
    };
  }

  const methodId = rootMethod.data.id;

  const [materials, operations, tags, makeMethod] = await Promise.all([
    getJobMaterialsByMethodId(client, methodId),
    getJobOperationsByMethodId(client, methodId),
    getTagsList(client, companyId, "operation"),
    getJobMakeMethodById(client, methodId, companyId)
  ]);

  return {
    notes: (job.data?.notes ?? {}) as JSONContent,
    purchaseOrderLines: getJobPurchaseOrderLines(client, jobId),
    materials:
      materials?.data?.map((m) => ({
        ...m,
        itemType: m.itemType as "Part",
        unitOfMeasureCode: m.unitOfMeasureCode ?? "",
        jobOperationId: m.jobOperationId ?? undefined
      })) ?? [],
    operations:
      operations.data?.map((o) => ({
        ...o,
        description: o.description ?? "",
        workCenterId: o.workCenterId ?? undefined,
        laborRate: o.laborRate ?? 0,
        machineRate: o.machineRate ?? 0,
        operationSupplierProcessId: o.operationSupplierProcessId ?? undefined,
        jobMakeMethodId: o.jobMakeMethodId ?? methodId,
        workInstruction: o.workInstruction as JSONContent
      })) ?? [],
    makeMethod: makeMethod.data ?? null,
    files: getJobDocumentsWithItemId(
      client,
      companyId,
      job.data,
      rootMethod.data.itemId
    ),
    productionData: getProductionDataByOperations(
      client,
      operations?.data?.map((o) => o.id) ?? []
    ),
    tags: tags.data ?? []
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "production"
  });

  const { jobId: id } = params;
  if (!id) throw new Error("Could not find jobId");

  const { client: viewClient } = await requirePermissions(request, {
    view: "production"
  });
  const job = await getJob(viewClient, id);
  await requireUnlocked({
    request,
    isLocked: isJobLocked(job.data?.status),
    redirectTo: path.to.job(id),
    message: "Cannot modify a locked job. Reopen it first."
  });

  const formData = await request.formData();
  const validation = await validator(jobValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const result = await updateJob(client, {
    id,
    quantity: validation.data.quantity,
    scrapQuantity: validation.data.scrapQuantity,
    itemId: validation.data.itemId,
    dueDate: validation.data.dueDate || null,
    startDate: validation.data.startDate || null,
    deadlineType: validation.data.deadlineType,
    locationId: validation.data.locationId,
    unitOfMeasureCode: validation.data.unitOfMeasureCode,
    customerId: validation.data.customerId || null,
    modelUploadId: validation.data.modelUploadId || null,
    customFields: setCustomFields(formData),
    updatedBy: userId
  });
  if (result.error) {
    throw redirect(
      path.to.job(id),
      await flash(request, error(result.error, "Failed to update job"))
    );
  }

  const recalculate = await recalculateJobRequirements(getCarbonServiceRole(), {
    id,
    companyId,
    userId
  });
  if (recalculate.error) {
    throw redirect(
      path.to.job(id),
      await flash(
        request,
        error(recalculate.error, "Failed to recalculate job requirements")
      )
    );
  }

  throw redirect(path.to.job(id), await flash(request, success("Updated job")));
}

export default function JobDetailsRoute() {
  const { t } = useLingui();
  const {
    notes,
    purchaseOrderLines,
    materials,
    operations,
    makeMethod,
    productionData,
    tags,
    files
  } = useLoaderData<typeof loader>();
  const { jobId } = useParams();
  if (!jobId) throw new Error("Could not find jobId");
  const permissions = usePermissions();

  const { setIsExplorerCollapsed, isExplorerCollapsed } = usePanels();

  useMount(() => {
    if (isExplorerCollapsed) {
      setIsExplorerCollapsed(false);
    }
  });

  const jobData = useRouteData<{
    job: Job;
    files: Promise<StorageItem[]> | StorageItem[];
  }>(path.to.job(jobId));

  if (!jobData) throw new Error("Could not find job data");

  useRealtime("modelUpload", `modelPath=eq.(${jobData?.job.modelPath})`);

  const methodId = makeMethod?.id;

  return (
    <div className="h-full w-full items-start overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent">
      <VStack spacing={2} className="p-2">
        <JobMakeMethodTools makeMethod={makeMethod ?? undefined} />

        <JobNotes
          id={jobId}
          title={jobData?.job.jobId ?? ""}
          subTitle={jobData?.job.itemReadableIdWithRevision ?? ""}
          notes={notes}
        />

        {methodId && (
          <>
            <JobBillOfMaterial
              key={`bom:${methodId}`}
              jobMakeMethodId={methodId}
              // @ts-ignore
              materials={materials}
              // @ts-ignore
              operations={operations}
            />
            <JobBillOfProcess
              key={`bop:${methodId}`}
              jobMakeMethodId={methodId}
              // @ts-ignore
              materials={materials}
              // @ts-ignore
              operations={operations}
              locationId={jobData?.job?.locationId ?? ""}
              tags={tags}
              itemId={makeMethod.itemId}
              salesOrderLineId={jobData?.job.salesOrderLineId ?? ""}
              customerId={jobData?.job.customerId ?? ""}
            />
          </>
        )}
        <Suspense>
          <Await resolve={purchaseOrderLines}>
            {(purchaseOrderLines) => (
              <JobPurchaseOrderLines
                purchaseOrderLines={purchaseOrderLines.data ?? []}
              />
            )}
          </Await>
        </Suspense>

        <Suspense
          fallback={
            <div className="flex w-full h-full rounded bg-gradient-to-tr from-background to-card items-center justify-center min-h-[200px]">
              <Spinner className="h-10 w-10" />
            </div>
          }
        >
          <Await resolve={productionData}>
            {(resolvedProductionData) => (
              <JobEstimatesVsActuals
                // @ts-ignore
                materials={materials ?? []}
                // @ts-ignore
                operations={operations}
                productionEvents={resolvedProductionData.events}
                productionQuantities={resolvedProductionData.quantities}
                notes={resolvedProductionData.notes}
              />
            )}
          </Await>
        </Suspense>

        <DeferredFiles resolve={files}>
          {(resolvedFiles) => (
            <JobDocuments
              files={resolvedFiles}
              jobId={jobData.job.id ?? ""}
              bucket="parts"
              itemId={makeMethod?.itemId ?? jobData.job.itemId}
              modelUpload={{ ...jobData.job }}
            />
          )}
        </DeferredFiles>

        <CadModel
          isReadOnly={!permissions.can("update", "production")}
          metadata={{
            jobId: jobData?.job?.id ?? undefined,
            itemId: jobData?.job?.itemId ?? undefined
          }}
          modelPath={jobData?.job?.modelPath ?? null}
          title={t`CAD Model`}
          uploadClassName="aspect-square min-h-[420px] max-h-[70vh]"
          viewerClassName="aspect-square min-h-[420px] max-h-[70vh]"
        />
        <JobRiskRegister jobId={jobId} itemId={jobData?.job?.itemId ?? ""} />
      </VStack>
    </div>
  );
}

function JobPurchaseOrderLines({
  purchaseOrderLines
}: {
  purchaseOrderLines: JobPurchaseOrderLine[];
}) {
  const purchaseOrders = groupJobPurchaseOrderLines(purchaseOrderLines);

  if (purchaseOrders.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          {purchaseOrders.map((order, index) => (
            <div
              key={order.purchaseOrder.id}
              className={cn(
                "border-b p-6",
                index === purchaseOrders.length - 1 && "border-b-0"
              )}
            >
              <JobPurchaseOrderGroupItem order={order} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function JobPurchaseOrderGroupItem({
  order
}: {
  order: ReturnType<typeof groupJobPurchaseOrderLines>[number];
}) {
  const [items] = useItems();
  const primaryLine =
    order.lines.find((line) => line.jobOperation) ?? order.lines[0];
  const item = items.find((i) => i.id === primaryLine?.itemId);
  const currencyCode = order.purchaseOrder.currencyCode ?? "USD";
  const formatter = useCurrencyFormatter({ currency: currencyCode });

  const isPartiallyShipped = order.lines.some(
    (line) => (line.quantityShipped ?? 0) > 0
  );
  const isShipped = order.lines.every(
    (line) => (line.quantityShipped ?? 0) >= (line.purchaseQuantity ?? 0)
  );

  const isPartiallyReceived = order.lines.some(
    (line) => (line.quantityReceived ?? 0) > 0
  );
  const isReceived = order.lines.every(
    (line) => (line.quantityReceived ?? 0) >= (line.purchaseQuantity ?? 0)
  );

  const status = isReceived
    ? "Received"
    : isPartiallyReceived
      ? "Partially Received"
      : isShipped
        ? "Shipped"
        : isPartiallyShipped
          ? "Partially Shipped"
          : "To Ship";

  const statusColor = isReceived
    ? "green"
    : isPartiallyReceived
      ? "yellow"
      : isShipped
        ? "blue"
        : isPartiallyShipped
          ? "orange"
          : "gray";

  return (
    <div className="flex w-full items-center justify-between gap-8">
      <HStack spacing={4} className="w-fit shrink-0">
        <div className="bg-muted border rounded-full flex shrink-0 items-center justify-center p-2">
          <LuShoppingCart className="size-4" />
        </div>
        <VStack spacing={0}>
          <Hyperlink
            className="text-sm font-medium whitespace-nowrap"
            to={path.to.purchaseOrder(order.purchaseOrder.id)}
          >
            {order.purchaseOrder.purchaseOrderId}
          </Hyperlink>
          <PurchasingStatus status={order.purchaseOrder.status} />
        </VStack>
      </HStack>

      <VStack spacing={0} className="w-fit shrink-0 items-center text-center">
        <span className="text-sm font-medium whitespace-nowrap">
          {item?.readableIdWithRevision}
        </span>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {primaryLine?.jobOperation?.description ?? item?.name}
        </span>
      </VStack>

      <VStack spacing={1} className="w-fit shrink-0 items-end">
        <SupplierAvatar
          className="text-sm"
          supplierId={order.purchaseOrder.supplierId}
        />
        <Badge variant={statusColor}>{status}</Badge>
      </VStack>

      <div className="w-fit shrink-0">
        <JobPurchaseOrderPriceBreakdown
          currencyCode={currencyCode}
          lines={order.lines}
          total={order.total}
        >
          <button
            type="button"
            className="text-sm font-semibold tabular-nums underline-offset-4 hover:underline whitespace-nowrap"
          >
            {formatter.format(order.total)}
          </button>
        </JobPurchaseOrderPriceBreakdown>
      </div>
    </div>
  );
}
