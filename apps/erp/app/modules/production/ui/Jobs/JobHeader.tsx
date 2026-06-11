import { useCarbon } from "@carbon/auth";
import { Hidden, NumberControlled, ValidatedForm } from "@carbon/form";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Copy,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Spinner,
  useDisclosure,
  useIsomorphicLayoutEffect,
  useMount,
  VStack
} from "@carbon/react";
import {
  getLocalTimeZone,
  isSameDay,
  parseDate,
  today
} from "@internationalized/date";
import { Trans, useLingui } from "@lingui/react/macro";
import { useMemo, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import {
  LuArrowLeft,
  LuCheckCheck,
  LuCircleCheck,
  LuCirclePause,
  LuCirclePlay,
  LuCircleStop,
  LuEllipsisVertical,
  LuPackage,
  LuPanelLeft,
  LuPanelRight,
  LuQrCode,
  LuShoppingCart,
  LuTrash,
  LuTriangleAlert
} from "react-icons/lu";
import { RiProgress8Line } from "react-icons/ri";
import type { FetcherWithComponents } from "react-router";
import { Link, useFetcher, useNavigate, useParams } from "react-router";
import { useAuditLog } from "~/components/AuditLog";
import { Location, StorageUnit } from "~/components/Form";
import { DetailsTopbar, usePanels, useTopbarLeft } from "~/components/Layout";
import ConfirmDelete from "~/components/Modals/ConfirmDelete";
import Select from "~/components/Select";
import SupplierAvatar from "~/components/SupplierAvatar";
import { flattenTree } from "~/components/TreeView";
import {
  usePermissions,
  useRouteData,
  useUser
} from "~/hooks";
import { generateBomIds } from "~/utils/bom";
import { path } from "~/utils/path";
import { isJobLocked, jobCompleteValidator } from "../../production.models";
import { getJobMethodTree } from "../../production.service";
import type { Job } from "../../types";
import JobStatus from "./JobStatus";

function JobTopbarLeft({ jobId }: { jobId: string }) {
  const { t } = useLingui();
  const navigate = useNavigate();
  const permissions = usePermissions();
  const { company } = useUser();

  const releaseModal = useDisclosure();
  const cancelModal = useDisclosure();
  const completeModal = useDisclosure();
  const deleteJobModal = useDisclosure();

  const { trigger: auditLogTrigger, drawer: auditLogDrawer } = useAuditLog({
    entityType: "productionJob",
    entityId: jobId,
    companyId: company.id,
    variant: "dropdown"
  });

  const routeData = useRouteData<{ job: Job }>(path.to.job(jobId));
  const statusFetcher = useFetcher<{}>();
  const status = routeData?.job?.status;

  const todaysDate = useMemo(() => today(getLocalTimeZone()), []);
  const isDraft = ["Draft", "Planned"].includes(status ?? "");
  const isPaused = status === "Paused";
  const isRunning = ["Ready", "In Progress"].includes(status ?? "");
  const isDone = ["Completed", "Cancelled"].includes(status ?? "");
  const isLocked = isJobLocked(status);

  return (
    <>
      <HStack className="items-center -ml-2" spacing={1}>
        <IconButton
          aria-label={t`Back`}
          icon={<LuArrowLeft />}
          variant="ghost"
          onClick={() => navigate(path.to.jobs)}
        />
        <Link to={path.to.jobDetails(jobId)}>
          <span className="font-semibold text-sm">
            {routeData?.job?.jobId ?? jobId}
          </span>
        </Link>
        <Copy text={routeData?.job?.jobId ?? ""} />
        <JobStatus status={status} />
        {["Draft", "Planned", "In Progress", "Ready", "Paused"].includes(
          status ?? ""
        ) && routeData?.job?.dueDate && (
          <>
            {isSameDay(parseDate(routeData.job.dueDate), todaysDate) && (
              <JobStatus status="Due Today" />
            )}
            {parseDate(routeData.job.dueDate) < todaysDate && (
              <JobStatus status="Overdue" />
            )}
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              aria-label={t`More options`}
              icon={<LuEllipsisVertical />}
              size="sm"
              variant="secondary"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <a
                target="_blank"
                href={path.to.file.jobTravelerByJobId(jobId)}
                rel="noreferrer"
              >
                <DropdownMenuIcon icon={<LuQrCode />} />
                <Trans>Job Traveler</Trans>
              </a>
            </DropdownMenuItem>
            {auditLogTrigger}
            {routeData?.job?.salesOrderId && routeData?.job?.salesOrderLineId && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to={path.to.salesOrderLine(
                      routeData.job.salesOrderId,
                      routeData.job.salesOrderLineId
                    )}
                  >
                    <DropdownMenuIcon icon={<RiProgress8Line />} />
                    <Trans>Sales Order</Trans>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            {isDraft && (
              <DropdownMenuItem
                disabled={
                  statusFetcher.state !== "idle" ||
                  !permissions.can("update", "production")
                }
                onClick={() =>
                  statusFetcher.submit(
                    { status: "Planned" },
                    { method: "post", action: path.to.jobStatus(jobId) }
                  )
                }
              >
                <DropdownMenuIcon icon={<LuCheckCheck />} />
                <Trans>Mark as Planned</Trans>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              disabled={
                !isDraft ||
                statusFetcher.state !== "idle" ||
                !permissions.can("update", "production") ||
                (routeData?.job?.quantity === 0 &&
                  routeData?.job?.scrapQuantity === 0)
              }
              onClick={releaseModal.onOpen}
            >
              <DropdownMenuIcon icon={<LuCirclePlay />} />
              <Trans>Release</Trans>
            </DropdownMenuItem>
            {isPaused ? (
              <DropdownMenuItem
                disabled={
                  statusFetcher.state !== "idle" ||
                  !permissions.can("update", "production")
                }
                onClick={() =>
                  statusFetcher.submit(
                    { status: "Ready" },
                    { method: "post", action: path.to.jobStatus(jobId) }
                  )
                }
              >
                <DropdownMenuIcon icon={<LuCirclePlay />} />
                <Trans>Resume</Trans>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                disabled={
                  !isRunning ||
                  statusFetcher.state !== "idle" ||
                  !permissions.can("update", "production")
                }
                onClick={() =>
                  statusFetcher.submit(
                    { status: "Paused" },
                    { method: "post", action: path.to.jobStatus(jobId) }
                  )
                }
              >
                <DropdownMenuIcon icon={<LuCirclePause />} />
                <Trans>Pause</Trans>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              disabled={
                isDone ||
                statusFetcher.state !== "idle" ||
                !permissions.can("update", "production")
              }
              onClick={completeModal.onOpen}
            >
              <DropdownMenuIcon icon={<LuCircleCheck />} />
              <Trans>Complete</Trans>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={
                isDone ||
                statusFetcher.state !== "idle" ||
                !permissions.can("update", "production")
              }
              onClick={cancelModal.onOpen}
            >
              <DropdownMenuIcon icon={<LuCircleStop />} />
              <Trans>Cancel</Trans>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={
                !isDone ||
                statusFetcher.state !== "idle" ||
                !permissions.can("update", "production")
              }
              onClick={() =>
                statusFetcher.submit(
                  { status: status === "Cancelled" ? "Draft" : "In Progress" },
                  { method: "post", action: path.to.jobStatus(jobId) }
                )
              }
            >
              <DropdownMenuIcon icon={<LuCirclePlay />} />
              <Trans>Reopen</Trans>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={
                !permissions.can("delete", "production") ||
                !permissions.is("employee") ||
                isLocked
              }
              destructive
              onClick={deleteJobModal.onOpen}
            >
              <DropdownMenuIcon icon={<LuTrash />} />
              <Trans>Delete Job</Trans>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </HStack>
      {auditLogDrawer}
      {releaseModal.isOpen && (
        <JobStartModal
          job={routeData?.job}
          onClose={releaseModal.onClose}
          fetcher={statusFetcher}
        />
      )}
      {cancelModal.isOpen && (
        <JobCancelModal
          job={routeData?.job}
          onClose={cancelModal.onClose}
          fetcher={statusFetcher}
        />
      )}
      {completeModal.isOpen && (
        <JobCompleteModal
          job={routeData?.job}
          onClose={completeModal.onClose}
          fetcher={statusFetcher}
        />
      )}
      {deleteJobModal.isOpen && (
        <ConfirmDelete
          action={path.to.deleteJob(jobId)}
          isOpen={deleteJobModal.isOpen}
          name={routeData?.job?.jobId!}
          text={t`Are you sure you want to delete ${routeData?.job?.jobId!}? This cannot be undone.`}
          onCancel={deleteJobModal.onClose}
          onSubmit={deleteJobModal.onClose}
        />
      )}
    </>
  );
}

const JobHeader = () => {
  const { t } = useLingui();
  const { jobId } = useParams();
  if (!jobId) throw new Error("jobId not found");

  const { leftSlotEl, setHasLeftContent } = useTopbarLeft();
  const { hasExplorer, toggleExplorer, toggleProperties } = usePanels();

  useIsomorphicLayoutEffect(() => {
    setHasLeftContent(true);
    return () => setHasLeftContent(false);
  }, [setHasLeftContent]);

  const links = [
    { name: t`Details`, to: path.to.jobDetails(jobId) },
    { name: t`Materials`, to: path.to.jobMaterials(jobId) },
    { name: t`Operations`, to: path.to.jobOperations(jobId) },
    { name: t`Events`, to: path.to.jobProductionEvents(jobId) },
    { name: t`Quantities`, to: path.to.jobProductionQuantities(jobId) },
    { name: t`Pickups`, to: path.to.jobPickups(jobId) },
    { name: t`Step Records`, to: path.to.jobOperationStepRecords(jobId) },
  ];

  return (
    <>
      {leftSlotEl && createPortal(<JobTopbarLeft jobId={jobId} />, leftSlotEl)}
      <div className="flex-shrink-0 h-[50px] flex items-center gap-1 px-2 bg-card border-b border-border dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        {hasExplorer && (
          <IconButton
            aria-label={t`Toggle Explorer`}
            icon={<LuPanelLeft />}
            onClick={toggleExplorer}
            variant="ghost"
          />
        )}
        <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide flex items-center">
          <DetailsTopbar links={links} />
        </div>
        <IconButton
          aria-label={t`Toggle Properties`}
          icon={<LuPanelRight />}
          onClick={toggleProperties}
          variant="ghost"
        />
      </div>
    </>
  );
};

export default JobHeader;

export function JobStartModal({
  job,
  onClose,
  fetcher
}: {
  job?: Job;
  fetcher: FetcherWithComponents<{}>;
  onClose: () => void;
}) {
  const { carbon } = useCarbon();
  const [loading, setLoading] = useState(true);
  const [missingOperationAssemblies, setMissingOperationAssemblies] = useState<
    { bomId: string; description: string }[]
  >([]);
  const [
    eachOutsideOperationHasASupplier,
    setEachOutsideOperationHasASupplier
  ] = useState(false);
  const [hasOutsideOperations, setHasOutsideOperations] = useState(false);
  const [
    existingPurchaseOrdersBySupplierId,
    setExistingPurchaseOrdersBySupplierId
  ] = useState<Record<string, { id: string; purchaseOrderId: string }[]>>({});
  const [
    selectedPurchaseOrdersBySupplierId,
    setSelectedPurchaseOrdersBySupplierId
  ] = useState<Record<string, string>>({});

  const startSubmitted = useRef(false);
  useIsomorphicLayoutEffect(() => {
    if (fetcher.state === "loading" && startSubmitted.current) {
      onClose();
      startSubmitted.current = false;
    }
  }, [fetcher.state, onClose]);

  const validate = async () => {
    if (!carbon || !job) return;
    const [makeMethod, materials, operations, methodTree] = await Promise.all([
      carbon
        .from("jobMakeMethod")
        .select("*")
        .eq("jobId", job.id!)
        .is("parentMaterialId", null)
        .single(),
      carbon
        .from("jobMaterialWithMakeMethodId")
        .select("*")
        .eq("jobId", job.id!),
      carbon.from("jobOperation").select("*").eq("jobId", job.id!),
      getJobMethodTree(carbon, job.id!)
    ]);

    const outsideOperations =
      operations.data?.filter((op) => op.operationType === "Outside") || [];
    const existingPurchaseOrderLines =
      outsideOperations.length > 0
        ? await carbon
            .from("purchaseOrderLine")
            .select("jobOperationId")
            .in(
              "jobOperationId",
              outsideOperations.map((op) => op.id)
            )
        : { data: [] };

    const existingJobOperationIds = new Set(
      existingPurchaseOrderLines.data?.map((pol) => pol.jobOperationId) ?? []
    );

    const operationsNeedingPurchaseOrders = outsideOperations.filter(
      (op) =>
        !existingJobOperationIds.has(op.id) && op.operationSupplierProcessId
    );

    const uniqueOutsideProcessIds = operationsNeedingPurchaseOrders.map(
      (op) => op.operationSupplierProcessId!
    );

    const supplierProcesses =
      uniqueOutsideProcessIds.length > 0
        ? await carbon
            .from("supplierProcess")
            .select("supplierId")
            .in("id", uniqueOutsideProcessIds)
        : { data: [] };

    const uniqueSupplierIds = new Set(
      supplierProcesses.data?.map((sp) => sp.supplierId) ?? []
    );

    if (uniqueSupplierIds.size) {
      const draftPurchaseOrders = await carbon
        .from("purchaseOrder")
        .select("id, purchaseOrderId, supplierId")
        .eq("status", "Draft")
        .in("supplierId", Array.from(uniqueSupplierIds));

      setExistingPurchaseOrdersBySupplierId(
        draftPurchaseOrders.data?.reduce<
          Record<string, { id: string; purchaseOrderId: string }[]>
        >((acc, po) => {
          acc[po.supplierId] = acc[po.supplierId] || [];
          acc[po.supplierId].push({
            id: po.id,
            purchaseOrderId: po.purchaseOrderId
          });
          return acc;
        }, {}) ?? {}
      );
    }

    setSelectedPurchaseOrdersBySupplierId(
      Array.from(uniqueSupplierIds).reduce<Record<string, string>>(
        (acc, supplierId) => {
          acc[supplierId] = "new";
          return acc;
        },
        {}
      )
    );

    const kittedMakeMethodIds = new Set(
      materials.data
        ?.filter((m) => m.jobMaterialMakeMethodId && m.kit)
        .map((m) => m.jobMaterialMakeMethodId) ?? []
    );

    const uniqueMakeMethodIds = new Set(
      materials.data
        ?.filter(
          (m) =>
            m.jobMaterialMakeMethodId &&
            m.methodType === "Make to Order" &&
            !kittedMakeMethodIds.has(m.jobMaterialMakeMethodId)
        )
        .map((m) => m.jobMaterialMakeMethodId) ?? []
    );

    uniqueMakeMethodIds.add(makeMethod.data?.id!);

    const flatMethod =
      methodTree.data && methodTree.data.length > 0
        ? flattenTree(methodTree.data[0])
        : [];
    const bomIds = generateBomIds(flatMethod);
    const bomInfoByMakeMethodId = new Map(
      flatMethod.map((node, index) => [
        node.data.jobMaterialMakeMethodId,
        {
          bomId: bomIds[index],
          description: node.data.description || node.data.itemReadableId
        }
      ])
    );

    const missingAssemblies = Array.from(uniqueMakeMethodIds)
      .filter(
        (makeMethodId) =>
          !(
            operations.data?.some(
              (op) => op.jobMakeMethodId === makeMethodId
            ) ?? false
          )
      )
      .map((makeMethodId) => {
        const info = bomInfoByMakeMethodId.get(makeMethodId ?? "");
        return info
          ? { bomId: info.bomId, description: info.description }
          : { bomId: "?", description: makeMethodId ?? "Unknown" };
      });

    flushSync(() => {
      setMissingOperationAssemblies(missingAssemblies);
      setHasOutsideOperations(operationsNeedingPurchaseOrders.length > 0);
      setEachOutsideOperationHasASupplier(
        operationsNeedingPurchaseOrders.length === 0 ||
          operationsNeedingPurchaseOrders.every(
            (op) => op.operationSupplierProcessId !== null
          )
      );
    });

    setLoading(false);
  };

  useMount(() => {
    validate();
  });

  if (!job) return null;

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <ModalContent
        size={
          hasOutsideOperations && eachOutsideOperationHasASupplier
            ? "large"
            : "medium"
        }
      >
        <ModalHeader>
          <ModalTitle>
            <Trans>Release Job</Trans> {job?.jobId}
          </ModalTitle>
        </ModalHeader>
        {loading ? (
          <ModalBody>
            <div className="flex flex-col h-[118px] w-full items-center justify-center gap-2">
              <Spinner className="size-8" />
              <p className="text-sm">
                <Trans>Validating job...</Trans>
              </p>
            </div>
          </ModalBody>
        ) : (
          <>
            <ModalBody>
              <VStack>
                {missingOperationAssemblies.length === 0 &&
                  eachOutsideOperationHasASupplier && (
                    <p className="text-sm">
                      <Trans>
                        Are you sure you want to release this job? It will
                        become available to the shop floor, and drive purchasing
                        and production.
                      </Trans>
                    </p>
                  )}
                {hasOutsideOperations && eachOutsideOperationHasASupplier && (
                  <>
                    <Alert>
                      <LuShoppingCart />
                      <AlertTitle>
                        <Trans>Purchase orders required</Trans>
                      </AlertTitle>
                      <AlertDescription>
                        <Trans>
                          A new purchase order will be created for each
                          supplier. Alternatively, you can choose an existing
                          draft purchase order for the supplier to add the
                          outside operations to.
                        </Trans>
                      </AlertDescription>
                    </Alert>
                    {Object.entries(selectedPurchaseOrdersBySupplierId).map(
                      ([supplierId, purchaseOrderId]) => {
                        const purchaseOrders =
                          existingPurchaseOrdersBySupplierId[supplierId] ?? [];
                        return (
                          <div
                            key={supplierId}
                            className="flex justify-between items-center text-sm rounded-lg border p-4 w-full"
                          >
                            <SupplierAvatar supplierId={supplierId} />
                            <Select
                              size="sm"
                              value={purchaseOrderId}
                              isReadOnly={
                                !Array.isArray(purchaseOrders) ||
                                purchaseOrders.length === 0
                              }
                              options={[
                                { value: "new", label: "Create New" },
                                ...purchaseOrders.map((po) => ({
                                  label: po.purchaseOrderId,
                                  value: po.id
                                }))
                              ]}
                              onChange={(value) => {
                                setSelectedPurchaseOrdersBySupplierId(
                                  (prev) => ({ ...prev, [supplierId]: value })
                                );
                              }}
                            />
                          </div>
                        );
                      }
                    )}
                  </>
                )}
                {missingOperationAssemblies.length > 0 && (
                  <Alert variant="warning">
                    <LuTriangleAlert />
                    <AlertTitle>
                      <Trans>Missing Operations</Trans>
                    </AlertTitle>
                    <AlertDescription>
                      <Trans>
                        The following assemblies have no operations. Please
                        assign an operation to each before releasing.
                      </Trans>
                      <ul className="mt-2 list-disc pl-4 space-y-1">
                        {[...missingOperationAssemblies]
                          .sort((a, b) =>
                            a.bomId.localeCompare(b.bomId, undefined, {
                              numeric: true
                            })
                          )
                          .map((assembly) => (
                            <li key={assembly.bomId}>
                              <span className="font-medium">
                                {assembly.bomId}
                              </span>{" "}
                              — {assembly.description}
                            </li>
                          ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
                {!eachOutsideOperationHasASupplier && hasOutsideOperations && (
                  <Alert variant="warning">
                    <LuTriangleAlert />
                    <AlertTitle>
                      <Trans>Missing Suppliers</Trans>
                    </AlertTitle>
                    <AlertDescription>
                      <Trans>
                        There are outside operations associated with this job
                        that have no suppliers. Please assign a supplier to each
                        outside operation before releasing it.
                      </Trans>
                    </AlertDescription>
                  </Alert>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={onClose}>
                <Trans>Cancel</Trans>
              </Button>
              <fetcher.Form
                onSubmit={() => {
                  startSubmitted.current = true;
                }}
                method="post"
                action={`${path.to.jobStatus(job.id!)}?schedule=1`}
              >
                <input type="hidden" name="status" value="Ready" />
                <input
                  type="hidden"
                  name="selectedPurchaseOrdersBySupplierId"
                  value={JSON.stringify(selectedPurchaseOrdersBySupplierId)}
                />
                <Button
                  isLoading={
                    fetcher.state !== "idle" &&
                    fetcher.formData?.get("status") === "Ready"
                  }
                  isDisabled={
                    fetcher.state !== "idle" ||
                    missingOperationAssemblies.length > 0 ||
                    !eachOutsideOperationHasASupplier
                  }
                  type="submit"
                >
                  <Trans>Release Job</Trans>
                </Button>
              </fetcher.Form>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function JobCancelModal({
  job,
  onClose,
  fetcher
}: {
  job?: Job;
  fetcher: FetcherWithComponents<{}>;
  onClose: () => void;
}) {
  const cancelSubmitted = useRef(false);
  useIsomorphicLayoutEffect(() => {
    if (fetcher.state === "loading" && cancelSubmitted.current) {
      onClose();
      cancelSubmitted.current = false;
    }
  }, [fetcher.state, onClose]);

  if (!job) return null;

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            <Trans>Cancel</Trans> {job?.jobId}
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Trans>
            Are you sure you want to cancel this job? It will no longer be
            available on the shop floor.
          </Trans>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={onClose}>
            <Trans>Don't Cancel</Trans>
          </Button>
          <fetcher.Form
            onSubmit={() => {
              cancelSubmitted.current = true;
            }}
            method="post"
            action={path.to.jobStatus(job.id!)}
          >
            <input type="hidden" name="status" value="Cancelled" />
            <Button variant="destructive" type="submit">
              <Trans>Cancel Job</Trans>
            </Button>
          </fetcher.Form>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function JobCompleteModal({
  job,
  onClose,
  fetcher
}: {
  job?: Job;
  fetcher: FetcherWithComponents<{}>;
  onClose: () => void;
}) {
  const { carbon } = useCarbon();
  const [loading, setLoading] = useState(true);
  const { t } = useLingui();
  const [defaultStorageUnitId, setDefaultStorageUnitId] = useState<
    string | undefined
  >(undefined);
  const [quantityComplete, setQuantityComplete] = useState<number>(
    job?.quantityComplete ?? 0
  );
  const [hasTrackedQuantity, setHasTrackedQuantity] = useState<boolean>(false);
  const [leftoverAction, setLeftoverAction] = useState<
    "ship" | "receive" | "split" | "discard" | undefined
  >(undefined);
  const [leftoverShipQuantity, setLeftoverShipQuantity] = useState<number>(0);
  const [leftoverReceiveQuantity, setLeftoverReceiveQuantity] =
    useState<number>(0);

  const makeToOrder = !!job?.salesOrderId && !!job?.salesOrderLineId;
  const leftoverQuantity = Math.max(0, quantityComplete - (job?.quantity ?? 0));
  const hasLeftover = leftoverQuantity > 0;

  const getJobData = async () => {
    if (!carbon) return;
    const [pickMethod, makeMethod] = await Promise.all([
      carbon
        .from("pickMethod")
        .select("*")
        .eq("locationId", job?.locationId!)
        .eq("itemId", job?.itemId!)
        .single(),
      carbon
        .from("jobMakeMethod")
        .select("*")
        .eq("jobId", job?.id!)
        .is("parentMaterialId", null)
        .single()
    ]);

    if (
      makeMethod.data?.requiresSerialTracking ||
      makeMethod.data?.requiresBatchTracking
    ) {
      const trackedEntities = await carbon
        .from("trackedEntity")
        .select("*")
        .eq("attributes->>Job Make Method", makeMethod.data?.id!)
        .order("createdAt", { ascending: true });

      if (trackedEntities.data?.length) {
        const availableQuantity = trackedEntities.data.reduce((acc, curr) => {
          if (curr.status === "Available") return acc + curr.quantity;
          return acc;
        }, 0);
        setQuantityComplete(availableQuantity);
        setHasTrackedQuantity(true);
      }
    }

    flushSync(() => {
      setDefaultStorageUnitId(
        pickMethod.data?.defaultStorageUnitId ?? undefined
      );
    });

    setLoading(false);
  };

  useMount(() => {
    if (!job) return;
    getJobData();
  });

  const handleLeftoverActionChange = (
    action: "ship" | "receive" | "split" | "discard"
  ) => {
    setLeftoverAction(action);
    if (action === "ship") {
      setLeftoverShipQuantity(leftoverQuantity);
      setLeftoverReceiveQuantity(0);
    } else if (action === "receive") {
      setLeftoverShipQuantity(0);
      setLeftoverReceiveQuantity(leftoverQuantity);
    } else if (action === "split") {
      const halfQty = Math.floor(leftoverQuantity / 2);
      setLeftoverShipQuantity(halfQty);
      setLeftoverReceiveQuantity(leftoverQuantity - halfQty);
    } else {
      setLeftoverShipQuantity(0);
      setLeftoverReceiveQuantity(0);
    }
  };

  if (!job) return null;

  return (
    <Modal open onOpenChange={onClose}>
      <ModalContent size={hasLeftover ? "large" : "medium"}>
        {loading ? (
          <ModalBody>
            <div className="flex flex-col h-[118px] w-full items-center justify-center gap-2">
              <Spinner className="size-8" />
            </div>
          </ModalBody>
        ) : (
          <ValidatedForm
            method="post"
            action={path.to.jobComplete(job.id!)}
            validator={jobCompleteValidator}
            onSuccess={onClose}
            defaultValues={{
              quantityComplete: job.quantity ?? 0,
              salesOrderId: job.salesOrderId ?? undefined,
              salesOrderLineId: job.salesOrderLineId ?? undefined,
              locationId: job.locationId ?? undefined,
              storageUnitId:
                job.storageUnitId ?? defaultStorageUnitId ?? undefined
            }}
            fetcher={fetcher}
          >
            <ModalHeader>
              <ModalTitle>
                {makeToOrder
                  ? t`Complete Job`
                  : t`Receive ${job.jobId} to Inventory`}
              </ModalTitle>
              <ModalDescription>
                {makeToOrder
                  ? t`This job will no longer be available on the shop floor.`
                  : t`This job will be received to inventory. It will no longer be available on the shop floor.`}
              </ModalDescription>
            </ModalHeader>
            <Hidden name="salesOrderId" />
            <Hidden name="salesOrderLineId" />
            <Hidden name="leftoverAction" value={leftoverAction} />
            <Hidden
              name="leftoverShipQuantity"
              value={leftoverShipQuantity.toString()}
            />
            <Hidden
              name="leftoverReceiveQuantity"
              value={leftoverReceiveQuantity.toString()}
            />
            {makeToOrder && (
              <>
                <Hidden name="locationId" />
                <Hidden name="storageUnitId" />
              </>
            )}
            <ModalBody>
              <VStack spacing={4}>
                {!makeToOrder && (
                  <>
                    <Location name="locationId" label={t`Location`} isReadOnly />
                    <StorageUnit
                      name="storageUnitId"
                      locationId={job.locationId ?? undefined}
                      label={t`Storage Unit`}
                    />
                  </>
                )}
                <NumberControlled
                  name="quantityComplete"
                  label={t`Quantity Completed`}
                  value={quantityComplete}
                  onChange={(value) => setQuantityComplete(value)}
                  isDisabled={hasTrackedQuantity}
                  helperText={
                    hasTrackedQuantity
                      ? t`Quantity is derived from completed serials/batches in MES and cannot be edited.`
                      : undefined
                  }
                />
                {hasLeftover && (
                  <>
                    <Alert>
                      <LuPackage />
                      <AlertTitle>
                        <Trans>Leftover Parts Detected</Trans>
                      </AlertTitle>
                      <AlertDescription>
                        {t`You completed ${leftoverQuantity} more ${leftoverQuantity === 1 ? "part" : "parts"} than the ordered quantity of ${job.quantity}. What would you like to do with the extra parts?`}
                      </AlertDescription>
                    </Alert>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {makeToOrder && (
                        <Button
                          variant={
                            leftoverAction === "ship" ? "primary" : "secondary"
                          }
                          onClick={() => handleLeftoverActionChange("ship")}
                          type="button"
                          className="h-auto py-3"
                        >
                          <VStack spacing={1}>
                            <span>
                              <Trans>Ship to Customer</Trans>
                            </span>
                            <span className="text-xs opacity-70">
                              <Trans>Include extra parts in shipment</Trans>
                            </span>
                          </VStack>
                        </Button>
                      )}
                      <Button
                        variant={
                          leftoverAction === "receive"
                            ? "primary"
                            : "secondary"
                        }
                        onClick={() => handleLeftoverActionChange("receive")}
                        type="button"
                        className="h-auto py-3"
                      >
                        <VStack spacing={1}>
                          <span>
                            <Trans>Receive to Inventory</Trans>
                          </span>
                          <span className="text-xs opacity-70">
                            <Trans>Add to stock for future use</Trans>
                          </span>
                        </VStack>
                      </Button>
                      {makeToOrder && (
                        <Button
                          variant={
                            leftoverAction === "split" ? "primary" : "secondary"
                          }
                          onClick={() => handleLeftoverActionChange("split")}
                          type="button"
                          className="h-auto py-3"
                        >
                          <VStack spacing={1}>
                            <span>
                              <Trans>Split</Trans>
                            </span>
                            <span className="text-xs opacity-70">
                              <Trans>Ship some, stock some</Trans>
                            </span>
                          </VStack>
                        </Button>
                      )}
                      <Button
                        variant={
                          leftoverAction === "discard"
                            ? "primary"
                            : "secondary"
                        }
                        onClick={() => handleLeftoverActionChange("discard")}
                        type="button"
                        className="h-auto py-3"
                      >
                        <VStack spacing={1}>
                          <span>
                            <Trans>Discard</Trans>
                          </span>
                          <span className="text-xs opacity-70">
                            <Trans>No action needed</Trans>
                          </span>
                        </VStack>
                      </Button>
                    </div>
                    {leftoverAction === "split" && (
                      <HStack className="w-full">
                        <div className="flex-1">
                          <NumberControlled
                            name="leftoverShipQuantity"
                            label={t`Ship to Customer`}
                            value={leftoverShipQuantity}
                            onChange={(value) => {
                              const shipQty = Math.min(value, leftoverQuantity);
                              setLeftoverShipQuantity(shipQty);
                              setLeftoverReceiveQuantity(
                                leftoverQuantity - shipQty
                              );
                            }}
                            minValue={0}
                            maxValue={leftoverQuantity}
                          />
                        </div>
                        <div className="flex-1">
                          <NumberControlled
                            name="leftoverReceiveQuantity"
                            label={t`Receive to Inventory`}
                            value={leftoverReceiveQuantity}
                            onChange={(value) => {
                              const receiveQty = Math.min(
                                value,
                                leftoverQuantity
                              );
                              setLeftoverReceiveQuantity(receiveQty);
                              setLeftoverShipQuantity(
                                leftoverQuantity - receiveQty
                              );
                            }}
                            minValue={0}
                            maxValue={leftoverQuantity}
                          />
                        </div>
                      </HStack>
                    )}
                  </>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={onClose}>
                <Trans>Cancel</Trans>
              </Button>
              <Button
                type="submit"
                isDisabled={hasLeftover && !leftoverAction}
              >
                <Trans>Complete Job</Trans>
              </Button>
            </ModalFooter>
          </ValidatedForm>
        )}
      </ModalContent>
    </Modal>
  );
}
