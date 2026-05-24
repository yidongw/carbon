"use client";
import { useCarbon } from "@carbon/auth";
import type { Database } from "@carbon/database";
import { Input, ValidatedForm } from "@carbon/form";
import type { JSONContent } from "@carbon/react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Count,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  generateHTML,
  HStack,
  IconButton,
  Input as InputField,
  Label,
  Loading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ScrollArea,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  toast,
  useDebounce,
  useDisclosure,
  useMount,
  useRealtimeChannel,
  VStack
} from "@carbon/react";
import { Editor } from "@carbon/react/Editor";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Trans, useLingui } from "@lingui/react/macro";
import { useLocale, useNumberFormatter } from "@react-aria/i18n";
import type { DragControls } from "framer-motion";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  Reorder,
  useDragControls
} from "framer-motion";
import { nanoid } from "nanoid";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  LuActivity,
  LuCirclePlus,
  LuEllipsisVertical,
  LuGripVertical,
  LuHammer,
  LuInfo,
  LuListChecks,
  LuMaximize2,
  LuMinimize2,
  LuPaperclip,
  LuRefreshCcw,
  LuSend,
  LuSettings2,
  LuShieldX,
  LuTriangleAlert,
  LuX
} from "react-icons/lu";
import { Link, useFetcher, useFetchers, useParams } from "react-router";
import type { z } from "zod";
import {
  Assignee,
  DirectionAwareTabs,
  EmployeeAvatar,
  Empty,
  SupplierAvatar,
  TimeTypeIcon
} from "~/components";
import Activity from "~/components/Activity";
import {
  Array as ArrayInput,
  Hidden,
  InputControlled,
  Number,
  NumberControlled,
  Process,
  Select,
  SelectControlled,
  StandardFactor,
  Submit,
  SupplierProcess,
  Tool,
  UnitHint,
  WorkCenter
} from "~/components/Form";
import Procedure, { useProcedures } from "~/components/Form/Procedure";
import { SupplierProcessPreview } from "~/components/Form/SupplierProcess";
import { getUnitHint } from "~/components/Form/UnitHint";
import UnitOfMeasure, {
  useUnitOfMeasure
} from "~/components/Form/UnitOfMeasure";
import { ProcedureStepTypeIcon } from "~/components/Icons";
import InfiniteScroll from "~/components/InfiniteScroll";
import { ConfirmDelete } from "~/components/Modals";
import { overlay, useOverlay } from "~/components/Overlay";
import type { Item, SortableItemRenderProps } from "~/components/SortableList";
import { SortableList, SortableListItem } from "~/components/SortableList";
import {
  useDateFormatter,
  usePermissions,
  useRouteData,
  useUrlParams,
  useUser
} from "~/hooks";
import { getConfigurationParameters } from "~/modules/items";
import type { ConfigurationParameter } from "~/modules/items/types";
import type {
  OperationParameter,
  OperationStep,
  OperationTool
} from "~/modules/shared";
import {
  operationParameterValidator,
  operationStepValidator,
  operationToolValidator,
  procedureStepType
} from "~/modules/shared";
import type { action as editJobOperationParameterAction } from "~/routes/x+/job+/methods+/operation.parameter.$id";
import type { action as newJobOperationParameterAction } from "~/routes/x+/job+/methods+/operation.parameter.new";
import type { action as editJobOperationStepAction } from "~/routes/x+/job+/methods+/operation.step.$id";
import type { action as editJobOperationToolAction } from "~/routes/x+/job+/methods+/operation.tool.$id";
import type { action as newJobOperationToolAction } from "~/routes/x+/job+/methods+/operation.tool.new";
import { useItems, usePeople, useTools } from "~/stores";
import { getPrivateUrl, path } from "~/utils/path";
import {
  buildReportedTargetRows,
  getConfigRowDisplayParts,
  type ReportedTargetRow
} from "../../configParamsTableColumns";
import {
  type JobOperationSupplierQuantityReportWithLines,
  listJobOperationSupplierQuantityReportsForOperation
} from "../../jobOperationSupplierQuantityReport.service";
import {
  defaultOperationTypeFromProcess,
  disablesOutsideBopDetailTabs,
  isInsideOperationType,
  isOutsideOperationType,
  type OperationType,
  showsSupplierRoutingFields
} from "../../operationType";
import {
  jobOperationValidator,
  jobOperationValidatorForReleasedJob,
  procedureSyncValidator
} from "../../production.models";
import {
  getJobPickupsPage,
  getJobSupplierPickupsPage,
  getProductionEventsPage
} from "../../production.service";
import {
  getOperationQuantitySummary,
  listProductionQuantityReportsForOperation,
  type OperationQuantitySummary as OperationQuantitySummaryData,
  type ProductionQuantityReportWithLines
} from "../../productionQuantityReport.service";
import type { Job, JobOperation } from "../../types";
import { OutsideOperationBadge } from "../OutsideOperationBadge";
import {
  formatOperationTabSummary,
  OperationDetailTabs,
  useOperationTypeSelectOptions
} from "../operationBop";
import { ConfigParamsReportedTargetTable } from "./ConfigParamsReportedTargetTable";
import { ConfigQuantityBreakdown } from "./ConfigQuantityBreakdown";
import { JobOperationStatus, JobOperationTags } from "./JobOperationStatus";
import { OperationDueDatePicker } from "./OperationDueDatePicker";
import { OperationQuantitySummaryView } from "./OperationQuantitySummary";
import { ProductionQuantityDispositionDrawer } from "./ProductionQuantityDispositionDrawer";
import { ProductionQuantityReportCard } from "./ProductionQuantityReportCard";
import { ProductionQuantityReportHistoryDrawer } from "./ProductionQuantityReportHistoryDrawer";
import {
  useProductionEventActivityMessage,
  useRelativeCreatedUpdatedText
} from "./productionQuantityLabels";
import { SupplierQuantityDispositionDrawer } from "./SupplierQuantityDispositionDrawer";
import { SupplierQuantityReportCard } from "./SupplierQuantityReportCard";
import {
  mergePickups,
  mergeQuantityReports,
  type UnifiedPickupItem,
  type UnifiedQuantityReportItem
} from "./unifiedQuantityFeeds";

export type Operation = z.infer<typeof jobOperationValidator> & {
  assignee: string | null;
  dueDate?: string | null;
  jobId?: string;
  status: JobOperation["status"];
  tags: string[] | null;
  workInstruction: JSONContent | null;
  quantityComplete?: number | null;
};

type ItemWithData = Item & {
  data: Operation;
};

type JobOperationStep = OperationStep & {
  jobOperationStepRecord?:
    | Database["public"]["Tables"]["jobOperationStepRecord"]["Row"][]
    | null;
};

type JobMaterial = {
  itemId: string;
};

type JobBillOfProcessProps = {
  jobMakeMethodId: string;
  locationId: string;
  materials: JobMaterial[];
  operations: (Operation & {
    jobOperationTool: OperationTool[];
    jobOperationParameter: OperationParameter[];
    jobOperationStep: JobOperationStep[];
  })[];
  tags: { name: string }[];
  itemId: string;
  salesOrderLineId: string;
  customerId: string;
  /** When rendered outside `/x/job/:jobId` (e.g. jobs table preview modal). */
  routeJobId?: string;
  routeJob?: Job;
};

function makeItems(
  operations: Operation[],
  tags: { name: string }[],
  temporaryItems: TemporaryItems,
  urlParams: { [key: string]: string },
  t: ReturnType<typeof useLingui>["t"],
  jobId: string,
  jobQuantityTarget: number,
  job?: Job,
  onAddProductionQuantity?: (operationId: string) => void,
  onOpenConfigSummary?: (operationId: string) => void,
  hasConfigurationParameters?: boolean,
  pickupTotals?: Map<string, number>,
  onAddPickup?: (operationId: string) => void
): ItemWithData[] {
  return operations.map((operation) =>
    makeItem(
      operation,
      tags,
      temporaryItems,
      urlParams,
      t,
      jobId,
      jobQuantityTarget,
      job,
      onAddProductionQuantity,
      onOpenConfigSummary,
      hasConfigurationParameters,
      pickupTotals,
      onAddPickup
    )
  );
}

function makeItem(
  operation: Operation,
  tags: { name: string }[],
  temporaryItems: TemporaryItems,
  urlParams: { [key: string]: string },
  t: ReturnType<typeof useLingui>["t"],
  jobId: string,
  jobQuantityTarget: number,
  job?: Job,
  onAddProductionQuantity?: (operationId: string) => void,
  onOpenConfigSummary?: (operationId: string) => void,
  hasConfigurationParameters?: boolean,
  pickupTotals?: Map<string, number>,
  onAddPickup?: (operationId: string) => void
): ItemWithData {
  return {
    id: operation.id!,
    title: (
      <VStack spacing={0} className="min-w-0">
        <h3 className="font-semibold truncate cursor-pointer">
          {operation.description}
        </h3>
        {isOutsideOperationType(operation.operationType) ? (
          <SupplierProcessPreview
            processId={operation.processId}
            supplierProcessId={operation.operationSupplierProcessId}
          />
        ) : null}
      </VStack>
    ),
    checked: false,
    order: operation.operationOrder,
    details: isOutsideOperationType(operation.operationType) ? (
      <OutsideOperationBadge />
    ) : (
      <HStack spacing={1}>
        {(operation?.setupTime ?? 0) > 0 && (
          <Badge variant="secondary">
            <TimeTypeIcon type="Setup" className="h-3 w-3 mr-1" />
            {operation.setupTime} {operation.setupUnit}
          </Badge>
        )}
        {(operation?.laborTime ?? 0) > 0 && (
          <Badge variant="secondary">
            <TimeTypeIcon type="Labor" className="h-3 w-3 mr-1" />
            {operation.laborTime} {operation.laborUnit}
          </Badge>
        )}

        {(operation?.machineTime ?? 0) > 0 && (
          <Badge variant="secondary">
            <TimeTypeIcon type="Machine" className="h-3 w-3 mr-1" />
            {operation.machineTime} {operation.machineUnit}
          </Badge>
        )}
      </HStack>
    ),
    quantityProgress: temporaryItems[operation.id!]
      ? null
      : {
          complete: operation.quantityComplete ?? 0,
          pickup: pickupTotals?.get(operation.id!) ?? 0,
          target: jobQuantityTarget,
          onAddQuantity: onAddProductionQuantity
            ? () => onAddProductionQuantity(operation.id!)
            : undefined,
          onAddPickup: onAddPickup
            ? () => onAddPickup(operation.id!)
            : undefined,
          onOpenConfigTable:
            hasConfigurationParameters && onOpenConfigSummary
              ? () => onOpenConfigSummary(operation.id!)
              : undefined
        },
    footer: temporaryItems[operation.id!] ? null : (
      <HStack className="w-full justify-between">
        <HStack>
          <JobOperationStatus operation={operation} jobId={jobId} job={job} />
          <Assignee
            table="jobOperation"
            id={operation.id!}
            size="sm"
            value={operation.assignee ?? undefined}
          />
        </HStack>
        <HStack>
          <OperationDueDatePicker
            operationId={operation.id!}
            dueDate={operation.dueDate ?? null}
          />
          <JobOperationTags operation={operation} availableTags={tags} />
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to={`${path.to.newIssue}?${new URLSearchParams({
                  jobOperationId: operation.id,
                  operationSupplierProcessId:
                    operation.operationSupplierProcessId ?? "",
                  ...urlParams
                }).toString()}`}
                title={t`Create Issue`}
              >
                <IconButton
                  icon={<LuShieldX />}
                  variant="secondary"
                  aria-label={t`Create Issue`}
                  size="sm"
                  className="transition-transform active:scale-[0.96]"
                ></IconButton>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <span>
                <Trans>Create Issue</Trans>
              </span>
            </TooltipContent>
          </Tooltip>
        </HStack>
      </HStack>
    ),
    data: operation
  };
}

const initialOperation: Omit<
  Operation,
  "jobMakeMethodId" | "order" | "jobOperationTool" | "id"
> = {
  assignee: null,
  description: "",
  laborRate: 0,
  laborTime: 0,
  laborUnit: "Minutes/Piece",
  machineRate: 0,
  machineTime: 0,
  machineUnit: "Minutes/Piece",
  operationUnitCost: 0,
  operationLeadTime: 0,
  operationOrder: "After Previous",
  operationType: "Inside",
  overheadRate: 0,
  processId: "",
  procedureId: "",
  setupTime: 0,
  setupUnit: "Total Minutes",
  status: "Todo",
  tags: [],
  workCenterId: "",
  workInstruction: {}
};

type PendingWorkInstructions = {
  [key: string]: JSONContent;
};

type OrderState = {
  [key: string]: number;
};

type CheckedState = {
  [key: string]: boolean;
};

type TemporaryItems = {
  [key: string]: Operation;
};

const usePendingOperations = (jobId: string) => {
  type PendingItem = ReturnType<typeof useFetchers>[number] & {
    formData: FormData;
  };

  return useFetchers()
    .filter((fetcher): fetcher is PendingItem => {
      return (
        (fetcher.formAction === path.to.newJobOperation(jobId) ||
          fetcher.formAction?.includes(`/job/methods/${jobId}/operation`)) ??
        false
      );
    })
    .reduce<z.infer<typeof jobOperationValidator>[]>((acc, fetcher) => {
      const formData = fetcher.formData;
      const operation = jobOperationValidator.safeParse(
        Object.fromEntries(formData)
      );

      if (operation.success) {
        return [...acc, operation.data];
      }
      return acc;
    }, []);
};

type OperationPickup =
  Database["public"]["Tables"]["jobOperationPickup"]["Row"] & {
    employee?: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      avatarUrl: string | null;
    } | null;
  };

const JobBillOfProcess = ({
  jobMakeMethodId,
  locationId,
  materials,
  operations: initialOperations,
  tags,
  itemId,
  salesOrderLineId,
  customerId,
  routeJobId,
  routeJob
}: JobBillOfProcessProps) => {
  const { t } = useLingui();
  // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
  const { carbon, accessToken } = useCarbon();
  const sortOrderFetcher = useFetcher<{}>();
  const deleteOperationFetcher = useFetcher<{ success: boolean }>();
  const permissions = usePermissions();
  const { openOverlay } = useOverlay();
  const {
    id: userId,
    company: { id: companyId }
  } = useUser();

  const [params] = useUrlParams();
  const selected = params.get("selectedOperation");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    selected ? selected : null
  );

  const paramsJobId = useParams().jobId;
  const jobId = routeJobId ?? paramsJobId;
  if (!jobId) throw new Error("jobId not found");
  const routeJobData = useRouteData<{ job: Job }>(path.to.job(jobId));
  const jobData = routeJob ? { job: routeJob } : routeJobData;
  const [temporaryItems, setTemporaryItems] = useState<TemporaryItems>({});
  const [workInstructions, setWorkInstructions] =
    useState<PendingWorkInstructions>(() => {
      return initialOperations.reduce((acc, operation) => {
        if (operation.workInstruction) {
          acc[operation.id!] = operation.workInstruction;
        }
        return acc;
      }, {} as PendingWorkInstructions);
    });

  const [checkedState, setCheckedState] = useState<CheckedState>({});
  const [orderState, setOrderState] = useState<OrderState>(() => {
    return initialOperations.reduce((acc, op) => {
      acc[op.id!] = op.order;
      return acc;
    }, {} as OrderState);
  });

  const operationsById = new Map<
    string,
    Operation & {
      jobOperationTool: OperationTool[];
      jobOperationParameter: OperationParameter[];
      jobOperationStep: JobOperationStep[];
    }
  >();

  // Add initial operations to map
  initialOperations.forEach((operation) => {
    if (!operation.id) return;
    operationsById.set(operation.id, operation);
  });

  const pendingOperations = usePendingOperations(jobId);

  // Replace existing operations with pending ones
  pendingOperations.forEach((pendingOperation) => {
    if (!pendingOperation.id) {
      operationsById.set("temporary", {
        ...pendingOperation,
        jobId,
        assignee: null,
        status: "Todo",
        workInstruction: {},
        jobOperationTool: [],
        jobOperationParameter: [],
        jobOperationStep: [],
        tags: []
      });
    } else {
      operationsById.set(pendingOperation.id, {
        ...operationsById.get(pendingOperation.id)!,
        ...pendingOperation,
        jobId
      });
    }
  });

  // Add temporary items
  Object.entries(temporaryItems).forEach(([id, operation]) => {
    operationsById.set(id, {
      ...operation,
      jobId,
      jobOperationTool: [],
      jobOperationParameter: [],
      jobOperationStep: []
    });
  });

  const operations = Array.from(operationsById.values()).sort(
    (a, b) => (orderState[a.id!] ?? a.order) - (orderState[b.id!] ?? b.order)
  );

  const isDisabled = ["Completed", "Cancelled"].includes(
    jobData?.job?.status ?? ""
  );

  const onAddProductionQuantity =
    !isDisabled && permissions.can("create", "production")
      ? (operationId: string) => {
          openOverlay(
            overlay.to.newJobProductionQuantity(jobId, {
              jobOperationId: operationId
            }),
            {
              onSuccess: () => {
                void refreshQuantityDataRef.current();
              }
            }
          );
        }
      : undefined;

  const onAddPickup =
    !isDisabled && permissions.can("create", "production")
      ? (operationId: string) => {
          openOverlay(
            overlay.to.newJobPickup(jobId, {
              jobOperationId: operationId
            }),
            {
              onSuccess: () => {
                setPickups([]);
                setPickupPage(0);
                setPickupHasMore(true);
                setPickupCount(0);
                setPickupScrollKey((k) => k + 1);
              }
            }
          );
        }
      : undefined;

  // Load pickup totals for all operations so the progress strip can display them
  useEffect(() => {
    if (!carbon || initialOperations.length === 0) return;

    const operationIds = initialOperations
      .map((o) => o.id)
      .filter(Boolean) as string[];
    if (operationIds.length === 0) return;

    let cancelled = false;

    const load = async () => {
      const [{ data: employeePickups }, { data: supplierPickups }] =
        await Promise.all([
          carbon
            .from("jobOperationPickup")
            .select("jobOperationId, quantity")
            .in("jobOperationId", operationIds)
            .eq("companyId", companyId),
          carbon
            .from("jobOperationSupplierPickup")
            .select("jobOperationId, quantity")
            .in("jobOperationId", operationIds)
            .eq("companyId", companyId)
        ]);

      if (cancelled) return;

      const totals = new Map<string, number>();
      for (const row of [
        ...(employeePickups ?? []),
        ...(supplierPickups ?? [])
      ]) {
        totals.set(
          row.jobOperationId,
          (totals.get(row.jobOperationId) ?? 0) + (row.quantity as number)
        );
      }
      setPickupTotals(totals);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [carbon, companyId, initialOperations]);

  const onToggleItem = (id: string) => {
    if (!permissions.can("update", "parts")) return;
    setCheckedState((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const onAddItem = () => {
    const operationId = nanoid();

    let newOrder = 1;
    if (operations.length) {
      newOrder = Math.max(...operations.map((op) => op.order)) + 1;
    }

    const newOperation: Operation = {
      ...initialOperation,
      id: operationId,
      order: newOrder,
      jobMakeMethodId,
      jobId
    };

    setTemporaryItems((prev) => ({
      ...prev,
      [operationId]: newOperation
    }));
    setSelectedItemId(operationId);
  };

  const onRemoveItem = async (id: string) => {
    if (!permissions.can("update", "production")) return;

    const operation = operationsById.get(id);
    if (!operation) return;

    if (temporaryItems[id]) {
      setTemporaryItems((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    } else {
      deleteOperationFetcher.submit(
        { id },
        {
          method: "post",
          action: path.to.jobOperationsDelete(jobId)
        }
      );
    }

    setSelectedItemId(null);
    setOrderState((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const onReorder = (items: ItemWithData[]) => {
    if (!permissions.can("update", "production") || isDisabled) return;
    const newItems = items.map((item, index) => ({
      ...item,
      data: {
        ...item.data,
        order: index + 1
      }
    }));
    const updates = newItems.reduce<Record<string, number>>((acc, item) => {
      if (!temporaryItems[item.id]) {
        acc[item.id] = item.data.order;
      }
      return acc;
    }, {});

    setOrderState((prev) => ({
      ...prev,
      ...updates
    }));
    updateSortOrder(updates);
  };

  const updateSortOrder = useDebounce(
    (updates: Record<string, number>) => {
      let formData = new FormData();
      formData.append("updates", JSON.stringify(updates));
      sortOrderFetcher.submit(formData, {
        method: "post",
        action: path.to.jobOperationsOrder(jobId)
      });
    },
    1000,
    true
  );

  const onCloseOnDrag = useCallback(() => {
    setCheckedState({});
  }, []);

  const onUpdateWorkInstruction = useDebounce(
    async (content: JSONContent) => {
      if (selectedItemId !== null && !temporaryItems[selectedItemId])
        await carbon
          ?.from("jobOperation")
          .update({
            workInstruction: content,
            updatedAt: today(getLocalTimeZone()).toString(),
            updatedBy: userId
          })
          .eq("id", selectedItemId!);
    },
    2500,
    true
  );

  const onUploadImage = async (file: File) => {
    const fileType = file.name.split(".").pop();
    const fileName = `${companyId}/parts/${selectedItemId}/${nanoid()}.${fileType}`;
    const result = await carbon?.storage
      .from("private")
      .upload(fileName, file, { upsert: true });

    if (result?.error) {
      throw new Error(result.error.message);
    }

    if (!result?.data) {
      throw new Error("Failed to upload image");
    }

    return getPrivateUrl(result.data.path);
  };

  const [productionEvents, setProductionEvents] = useState<
    Database["public"]["Tables"]["productionEvent"]["Row"][]
  >([]);
  const [quantityReports, setQuantityReports] = useState<
    UnifiedQuantityReportItem[]
  >([]);
  const [operationQuantitySummary, setOperationQuantitySummary] =
    useState<OperationQuantitySummaryData | null>(null);
  const [quantityReportCount, setQuantityReportCount] = useState<number>(0);
  const [dispositionReport, setDispositionReport] =
    useState<ProductionQuantityReportWithLines | null>(null);
  const [supplierDispositionReport, setSupplierDispositionReport] =
    useState<JobOperationSupplierQuantityReportWithLines | null>(null);
  const [historyReport, setHistoryReport] =
    useState<ProductionQuantityReportWithLines | null>(null);
  const [supplierHistoryReport, setSupplierHistoryReport] =
    useState<JobOperationSupplierQuantityReportWithLines | null>(null);
  const [creatingPoReportId, setCreatingPoReportId] = useState<string | null>(
    null
  );
  const [page, setPage] = useState(0);
  const [quantityPage, setQuantityPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [quantityIsLoading, setQuantityIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [quantityHasMore, setQuantityHasMore] = useState(true);
  const [pickups, setPickups] = useState<UnifiedPickupItem[]>([]);
  const [pickupCount, setPickupCount] = useState<number>(0);
  const [pickupPage, setPickupPage] = useState(0);
  const [pickupIsLoading, setPickupIsLoading] = useState(false);
  const [pickupHasMore, setPickupHasMore] = useState(true);
  const [pickupScrollKey, setPickupScrollKey] = useState(0);
  const [pickupTotals, setPickupTotals] = useState<Map<string, number>>(
    new Map()
  );
  const addOperationButtonRef = useRef<HTMLButtonElement>(null);
  const refreshQuantityDataRef = useRef<() => Promise<void>>(() =>
    Promise.resolve()
  );
  const [configurationParameters, setConfigurationParameters] = useState<
    ConfigurationParameter[] | null
  >(null);
  const configSummaryModal = useDisclosure();
  const [configSummaryOperationId, setConfigSummaryOperationId] = useState<
    string | null
  >(null);
  const [configSummaryRows, setConfigSummaryRows] = useState<
    ReportedTargetRow[]
  >([]);
  const [configSummaryLoading, setConfigSummaryLoading] = useState(false);

  const hasConfigurationParameters = (configurationParameters?.length ?? 0) > 0;

  useEffect(() => {
    if (!itemId || !carbon) return;

    void getConfigurationParameters(carbon, itemId, companyId).then(
      ({ parameters }) => {
        setConfigurationParameters(parameters.length > 0 ? parameters : null);
      }
    );
  }, [carbon, companyId, itemId]);

  const openConfigSummary = useCallback(
    async (operationId: string) => {
      if (!carbon || !configurationParameters?.length) return;

      setConfigSummaryOperationId(operationId);
      setConfigSummaryRows([]);
      setConfigSummaryLoading(true);
      configSummaryModal.onOpen();

      const [quantityResult, pickupResult] = await Promise.all([
        carbon
          .from("productionQuantity")
          .select("configuration")
          .eq("jobOperationId", operationId)
          .eq("companyId", companyId)
          .eq("type", "Production")
          .is("invalidatedAt", null),
        carbon
          .from("jobOperationPickup")
          .select("configuration")
          .eq("jobOperationId", operationId)
          .eq("companyId", companyId)
      ]);

      if (quantityResult.error) {
        toast.error(quantityResult.error.message);
        setConfigSummaryLoading(false);
        return;
      }

      const reportedConfigurations = (quantityResult.data ?? [])
        .map((row) => row.configuration)
        .filter(
          (config): config is NonNullable<typeof config> => config != null
        );

      const pickupConfigurations = (pickupResult.data ?? [])
        .map((row) => row.configuration)
        .filter(
          (config): config is NonNullable<typeof config> => config != null
        );

      setConfigSummaryRows(
        buildReportedTargetRows({
          targetConfiguration: jobData?.job?.configuration,
          reportedConfigurations,
          pickupConfigurations,
          parameters: configurationParameters,
          defaultQuantityLabel: t`Quantities`
        })
      );
      setConfigSummaryLoading(false);
    },
    [
      carbon,
      companyId,
      configSummaryModal,
      configurationParameters,
      jobData?.job?.configuration,
      t
    ]
  );

  const jobQuantityTarget = jobData?.job?.quantity ?? 0;

  const items = makeItems(
    operations,
    tags,
    temporaryItems,
    {
      itemId,
      salesOrderLineId,
      customerId
    },
    t,
    jobId,
    jobQuantityTarget,
    jobData?.job,
    onAddProductionQuantity,
    hasConfigurationParameters ? openConfigSummary : undefined,
    hasConfigurationParameters,
    pickupTotals,
    onAddPickup
  ).map((item) => ({
    ...item,
    checked: checkedState[item.id] ?? false
  }));

  useEffect(() => {
    setProductionEvents([]);
    setQuantityReports([]);
    setOperationQuantitySummary(null);
    setQuantityReportCount(0);
    setPage(0);
    setQuantityPage(0);
    setHasMore(true);
    setQuantityHasMore(true);
    setPickups([]);
    setPickupCount(0);
    setPickupPage(0);
    setPickupHasMore(true);
  }, []);

  useEffect(() => {
    if (!selectedItemId || temporaryItems[selectedItemId] || !carbon) return;

    let cancelled = false;

    const loadQuantityCount = async () => {
      const [employeeCount, supplierCount] = await Promise.all([
        carbon
          .from("productionQuantityReport")
          .select("id", { count: "exact", head: true })
          .eq("jobOperationId", selectedItemId)
          .eq("companyId", companyId),
        carbon
          .from("jobOperationSupplierQuantityReport")
          .select("id", { count: "exact", head: true })
          .eq("jobOperationId", selectedItemId)
          .eq("companyId", companyId)
      ]);

      if (!cancelled) {
        setQuantityReportCount(
          (employeeCount.count ?? 0) + (supplierCount.count ?? 0)
        );
      }
    };

    void loadQuantityCount();

    return () => {
      cancelled = true;
    };
  }, [carbon, companyId, selectedItemId, temporaryItems]);

  useEffect(() => {
    if (!selectedItemId || temporaryItems[selectedItemId] || !carbon) return;

    let cancelled = false;

    const loadPickupCount = async () => {
      const [employeeCount, supplierCount] = await Promise.all([
        carbon
          .from("jobOperationPickup")
          .select("id", { count: "exact", head: true })
          .eq("jobOperationId", selectedItemId)
          .eq("companyId", companyId),
        carbon
          .from("jobOperationSupplierPickup")
          .select("id", { count: "exact", head: true })
          .eq("jobOperationId", selectedItemId)
          .eq("companyId", companyId)
      ]);

      if (!cancelled) {
        setPickupCount((employeeCount.count ?? 0) + (supplierCount.count ?? 0));
      }
    };

    void loadPickupCount();

    return () => {
      cancelled = true;
    };
  }, [carbon, companyId, selectedItemId, temporaryItems]);

  useRealtimeChannel({
    topic: `pickup-counts:${selectedItemId}`,
    enabled: !!selectedItemId && !temporaryItems[selectedItemId ?? ""],
    setup(channel) {
      return channel
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "jobOperationPickup",
            filter: `jobOperationId=eq.${selectedItemId}`
          },
          (payload) => {
            switch (payload.eventType) {
              case "INSERT": {
                const inserted = payload.new as OperationPickup;
                const item: UnifiedPickupItem = {
                  kind: "employee",
                  id: inserted.id,
                  createdAt: inserted.createdAt,
                  pickup: inserted
                };
                setPickups((prev) => {
                  if (prev.some((p) => p.id === inserted.id)) return prev;
                  return [item, ...prev];
                });
                setPickupCount((count) => count + 1);
                setPickupTotals((prev) => {
                  const next = new Map(prev);
                  next.set(
                    inserted.jobOperationId,
                    (next.get(inserted.jobOperationId) ?? 0) +
                      (inserted.quantity as number)
                  );
                  return next;
                });
                break;
              }
              case "UPDATE": {
                const updated = payload.new as OperationPickup;
                const previous = payload.old as {
                  id: string;
                  quantity?: number;
                  jobOperationId?: string;
                };
                setPickups((prev) =>
                  prev.map((p) =>
                    p.id === updated.id && p.kind === "employee"
                      ? {
                          kind: "employee",
                          id: updated.id,
                          createdAt: updated.createdAt,
                          pickup: updated
                        }
                      : p
                  )
                );
                if (
                  previous.jobOperationId &&
                  previous.quantity !== undefined
                ) {
                  setPickupTotals((prev) => {
                    const next = new Map(prev);
                    const opId = updated.jobOperationId;
                    const oldQty = previous.quantity as number;
                    const newQty = updated.quantity as number;
                    next.set(
                      opId,
                      Math.max(0, (next.get(opId) ?? 0) - oldQty + newQty)
                    );
                    return next;
                  });
                }
                break;
              }
              case "DELETE": {
                const deleted = payload.old as {
                  id: string;
                  jobOperationId?: string;
                  quantity?: number;
                };
                setPickups((prev) => prev.filter((p) => p.id !== deleted.id));
                setPickupCount((count) => Math.max(0, count - 1));
                if (deleted.jobOperationId && deleted.quantity !== undefined) {
                  setPickupTotals((prev) => {
                    const next = new Map(prev);
                    next.set(
                      deleted.jobOperationId!,
                      Math.max(
                        0,
                        (next.get(deleted.jobOperationId!) ?? 0) -
                          (deleted.quantity as number)
                      )
                    );
                    return next;
                  });
                }
                break;
              }
              default:
                break;
            }
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "jobOperationSupplierPickup",
            filter: `jobOperationId=eq.${selectedItemId}`
          },
          () => {
            setPickups([]);
            setPickupPage(0);
            setPickupHasMore(true);
            setPickupScrollKey((k) => k + 1);
          }
        );
    }
  });

  useRealtimeChannel({
    topic: `production-events:${selectedItemId}`,
    enabled: !!selectedItemId && !temporaryItems[selectedItemId],
    setup(channel) {
      return channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "productionEvent",
          filter: `jobOperationId=eq.${selectedItemId}`
        },
        (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              const { new: inserted } = payload;
              setProductionEvents((prevEvents) => [
                ...prevEvents,
                inserted as Database["public"]["Tables"]["productionEvent"]["Row"]
              ]);
              break;
            case "UPDATE":
              const { new: updated } = payload;
              setProductionEvents((prevEvents) =>
                prevEvents.map((event) =>
                  event.id === updated.id
                    ? (updated as Database["public"]["Tables"]["productionEvent"]["Row"])
                    : event
                )
              );
              break;
            case "DELETE":
              const { old: deleted } = payload;
              setProductionEvents((prevEvents) =>
                prevEvents.filter((event) => event.id !== deleted.id)
              );
              break;
            default:
              break;
          }
        }
      );
    }
  });

  const loadMoreProductionEvents = useCallback(async () => {
    if (isLoading || !hasMore || !selectedItemId) return;

    setIsLoading(true);

    const newProductionEvents = await getProductionEventsPage(
      carbon!,
      selectedItemId,
      companyId,
      false,
      page + 1
    );

    if (newProductionEvents.data && newProductionEvents.data.length > 0) {
      setProductionEvents((prev) => [...prev, ...newProductionEvents.data]);
      setPage((prevPage) => prevPage + 1);
    } else {
      setHasMore(false);
    }

    setIsLoading(false);
  }, [isLoading, hasMore, carbon, selectedItemId, companyId, page]);

  const refreshQuantityData = useCallback(async () => {
    if (!carbon || !selectedItemId || temporaryItems[selectedItemId]) return;

    const [summaryResult, employeeReports, supplierReports] = await Promise.all(
      [
        getOperationQuantitySummary(carbon, selectedItemId, companyId),
        listProductionQuantityReportsForOperation(carbon, {
          jobOperationId: selectedItemId,
          companyId,
          page: 1
        }),
        listJobOperationSupplierQuantityReportsForOperation(carbon, {
          jobOperationId: selectedItemId,
          companyId,
          page: 1
        })
      ]
    );

    if (summaryResult.data) {
      setOperationQuantitySummary(summaryResult.data);
    }
    const employee = employeeReports.data ?? [];
    const supplier = supplierReports.data ?? [];
    setQuantityReports(mergeQuantityReports(employee, supplier));
    setQuantityReportCount(
      (employeeReports.count ?? 0) + (supplierReports.count ?? 0)
    );
    setQuantityPage(1);
    setQuantityHasMore(
      Boolean(employeeReports.hasMore || supplierReports.hasMore)
    );
  }, [carbon, companyId, selectedItemId, temporaryItems]);

  refreshQuantityDataRef.current = refreshQuantityData;

  useEffect(() => {
    void refreshQuantityData();
  }, [refreshQuantityData]);

  useRealtimeChannel({
    topic: `production-quantities:${selectedItemId}`,
    enabled: !!selectedItemId && !temporaryItems[selectedItemId ?? ""],
    setup(channel) {
      const onQuantityChange = () => {
        void refreshQuantityData();
      };
      return channel
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "productionQuantity",
            filter: `jobOperationId=eq.${selectedItemId}`
          },
          onQuantityChange
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "productionQuantityReport",
            filter: `jobOperationId=eq.${selectedItemId}`
          },
          onQuantityChange
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "jobOperationSupplierQuantity",
            filter: `jobOperationId=eq.${selectedItemId}`
          },
          onQuantityChange
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "jobOperationSupplierQuantityReport",
            filter: `jobOperationId=eq.${selectedItemId}`
          },
          onQuantityChange
        );
    }
  });

  const loadMoreQuantityReports = useCallback(async () => {
    if (quantityIsLoading || !quantityHasMore || !selectedItemId || !carbon) {
      return;
    }

    setQuantityIsLoading(true);

    const page = quantityPage + 1;
    const [employeeResult, supplierResult] = await Promise.all([
      listProductionQuantityReportsForOperation(carbon, {
        jobOperationId: selectedItemId,
        companyId,
        page
      }),
      listJobOperationSupplierQuantityReportsForOperation(carbon, {
        jobOperationId: selectedItemId,
        companyId,
        page
      })
    ]);

    const merged = mergeQuantityReports(
      employeeResult.data ?? [],
      supplierResult.data ?? []
    );

    if (merged.length > 0) {
      setQuantityReports((prev) => [...prev, ...merged]);
      setQuantityPage((prevPage) => prevPage + 1);
      setQuantityReportCount(
        (employeeResult.count ?? 0) + (supplierResult.count ?? 0)
      );
      if (!employeeResult.hasMore && !supplierResult.hasMore) {
        setQuantityHasMore(false);
      }
    } else {
      setQuantityHasMore(false);
    }

    setQuantityIsLoading(false);
  }, [
    quantityIsLoading,
    quantityHasMore,
    carbon,
    selectedItemId,
    companyId,
    quantityPage
  ]);

  const handleQuantityReportSaved = useCallback(
    (updated: ProductionQuantityReportWithLines) => {
      setQuantityReports((prev) =>
        prev.map((item) =>
          item.actorKind === "employee" && item.id === updated.id
            ? { ...item, report: updated }
            : item
        )
      );
      void refreshQuantityData();
    },
    [refreshQuantityData]
  );

  const handleSupplierQuantityReportSaved = useCallback(
    (updated: JobOperationSupplierQuantityReportWithLines) => {
      setQuantityReports((prev) =>
        prev.map((item) =>
          item.actorKind === "supplier" && item.id === updated.id
            ? { ...item, report: updated }
            : item
        )
      );
      void refreshQuantityData();
    },
    [refreshQuantityData]
  );

  const loadMorePickups = useCallback(async () => {
    if (pickupIsLoading || !pickupHasMore || !selectedItemId) return;

    setPickupIsLoading(true);

    const page = pickupPage + 1;
    const [employeeResult, supplierResult] = await Promise.all([
      getJobPickupsPage(carbon!, selectedItemId, companyId, page),
      getJobSupplierPickupsPage(carbon!, selectedItemId, companyId, page)
    ]);

    const merged = mergePickups(
      (employeeResult.data ?? []) as OperationPickup[],
      (supplierResult.data ?? []) as Extract<
        UnifiedPickupItem,
        { kind: "supplier" }
      >["pickup"][]
    );

    if (merged.length > 0) {
      setPickups((prev) => [...prev, ...merged]);
      setPickupPage((prevPage) => prevPage + 1);
      setPickupCount((employeeResult.count ?? 0) + (supplierResult.count ?? 0));
      if (!employeeResult.hasMore && !supplierResult.hasMore) {
        setPickupHasMore(false);
      }
    } else {
      setPickupHasMore(false);
    }

    setPickupIsLoading(false);
  }, [
    pickupIsLoading,
    pickupHasMore,
    carbon,
    selectedItemId,
    companyId,
    pickupPage
  ]);

  const [tabChangeRerender, setTabChangeRerender] = useState<number>(1);

  const initialWorkInstructions = useMemo(
    () =>
      initialOperations.reduce((acc, operation) => {
        if (operation.workInstruction && operation.id) {
          acc[operation.id] = operation.workInstruction;
        }
        return acc;
      }, {} as PendingWorkInstructions),
    [initialOperations]
  );

  useEffect(() => {
    setWorkInstructions(initialWorkInstructions);
  }, [initialWorkInstructions]);

  const renderListItem = ({
    item,
    items,
    order,
    onToggleItem,
    onRemoveItem
  }: SortableItemRenderProps<ItemWithData>) => {
    const isOpen = item.id === selectedItemId;
    const isNewOperation = item.id in temporaryItems;

    const operationDetails = operationsById.get(item.id);
    const tools = operationDetails?.jobOperationTool ?? [];
    const parameters = operationDetails?.jobOperationParameter ?? [];
    const steps = operationDetails?.jobOperationStep ?? [];
    const quantityCount = item.id === selectedItemId ? quantityReportCount : 0;
    const canEditQuantityReport =
      !isDisabled && permissions.can("update", "production");
    const currentPickupCount = item.id === selectedItemId ? pickupCount : 0;
    const canRecordQuantity =
      !isDisabled &&
      permissions.can("create", "production") &&
      !temporaryItems[item.id];

    const operationFormContent = (
      <div className="flex w-full flex-col pr-2 py-2">
        <motion.div
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{
            type: "spring",
            bounce: 0.2,
            duration: 0.75,
            delay: 0.15
          }}
        >
          <OperationForm
            item={item}
            jobId={jobId}
            isDisabled={isDisabled}
            job={jobData?.job}
            locationId={locationId}
            workInstruction={workInstructions[item.id] ?? {}}
            setWorkInstructions={setWorkInstructions}
            setTemporaryItems={setTemporaryItems}
            setSelectedItemId={setSelectedItemId}
            temporaryItems={temporaryItems}
            onSubmit={() => {
              setSelectedItemId(null);
              addOperationButtonRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center"
              });
            }}
          />
        </motion.div>
      </div>
    );

    const QuantityReportRow = ({
      item: reportItem
    }: {
      item: UnifiedQuantityReportItem;
    }) =>
      reportItem.actorKind === "employee" ? (
        <ProductionQuantityReportCard
          report={reportItem.report}
          configurationParameters={configurationParameters}
          canEdit={canEditQuantityReport}
          onEdit={() => setDispositionReport(reportItem.report)}
          onHistory={() => setHistoryReport(reportItem.report)}
        />
      ) : (
        <SupplierQuantityReportCard
          report={reportItem.report}
          configurationParameters={configurationParameters}
          canEdit={canEditQuantityReport}
          onEdit={() => setSupplierDispositionReport(reportItem.report)}
          onHistory={() => setSupplierHistoryReport(reportItem.report)}
          isCreatingPo={creatingPoReportId === reportItem.id}
          onCreatePo={async () => {
            setCreatingPoReportId(reportItem.id);
            try {
              const res = await fetch(
                path.to.api.supplierQuantityReportCreatePo(reportItem.id),
                { method: "POST", credentials: "include" }
              );
              const body = await res.json();
              if (!res.ok) {
                toast.error(body.error ?? "Failed to create PO");
                return;
              }
              toast.success("Purchase order line created");
              void refreshQuantityData();
            } finally {
              setCreatingPoReportId(null);
            }
          }}
        />
      );

    const PickupActivityRowWrapper = ({
      item: pickupItem
    }: {
      item: UnifiedPickupItem;
    }) => (
      <PickupActivityRow
        item={pickupItem}
        configurationParameters={configurationParameters}
      />
    );

    const tabs = [
      {
        id: 0,
        label: t`Details`,
        content: operationFormContent
      },
      {
        id: 1,
        label: t`Instructions`,
        disabled: disablesOutsideBopDetailTabs(item.data.operationType),
        content: (
          <div className="flex flex-col">
            <div>
              {permissions.can("update", "parts") ? (
                <Editor
                  initialValue={
                    workInstructions[item.id] ?? ({} as JSONContent)
                  }
                  onUpload={onUploadImage}
                  onChange={(content) => {
                    if (!permissions.can("update", "production")) return;
                    setWorkInstructions((prev) => ({
                      ...prev,
                      [item.id]: content
                    }));
                    onUpdateWorkInstruction(content);
                  }}
                  className="py-8"
                />
              ) : (
                <div
                  className="prose dark:prose-invert"
                  dangerouslySetInnerHTML={{
                    __html: generateHTML(
                      item.data.workInstruction ?? ({} as JSONContent)
                    )
                  }}
                />
              )}
            </div>
          </div>
        )
      },
      {
        id: 2,
        disabled: disablesOutsideBopDetailTabs(item.data.operationType),
        label: (
          <span className="flex items-center gap-2">
            <span>
              <Trans>Params</Trans>
            </span>
            {parameters.length > 0 && <Count count={parameters.length} />}
          </span>
        ),
        content: (
          <div className="flex w-full flex-col py-4">
            <ParametersForm
              parameters={parameters}
              operationId={item.id!}
              isDisabled={
                selectedItemId === null || !!temporaryItems[selectedItemId]
              }
              temporaryItems={temporaryItems}
            />
          </div>
        )
      },
      {
        id: 3,
        disabled: disablesOutsideBopDetailTabs(item.data.operationType),
        label: (
          <span className="flex items-center gap-2">
            <span>
              <Trans>Steps</Trans>
            </span>
            {steps.length > 0 && <Count count={steps.length} />}
          </span>
        ),
        content: (
          <div className="flex w-full flex-col py-4">
            <StepsForm
              steps={steps}
              operationId={item.id!}
              isDisabled={
                selectedItemId === null || !!temporaryItems[selectedItemId]
              }
              temporaryItems={temporaryItems}
              materials={materials}
            />
          </div>
        )
      },
      {
        id: 4,
        disabled: disablesOutsideBopDetailTabs(item.data.operationType),
        label: (
          <span className="flex items-center gap-2">
            <span>
              <Trans>Tools</Trans>
            </span>
            {tools.length > 0 && <Count count={tools.length} />}
          </span>
        ),
        content: (
          <div className="flex w-full flex-col py-4">
            <ToolsForm
              tools={tools}
              operationId={item.id!}
              isDisabled={
                selectedItemId === null || !!temporaryItems[selectedItemId]
              }
              temporaryItems={temporaryItems}
            />
          </div>
        )
      },
      {
        id: 5,
        disabled: false,
        label: (
          <span className="flex items-center gap-2">
            <span>
              <Trans>Pickups</Trans>
            </span>
            {currentPickupCount > 0 && <Count count={currentPickupCount} />}
          </span>
        ),
        content: (
          <motion.div
            className="flex w-full flex-col gap-4 py-6 pr-2 min-h-[300px]"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{
              type: "spring",
              bounce: 0.2,
              duration: 0.75,
              delay: 0.15
            }}
          >
            {canRecordQuantity && onAddPickup && (
              <HStack className="justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onAddPickup(item.id)}
                  className="transition-transform active:scale-[0.96]"
                >
                  <LuCirclePlus className="mr-1.5 h-4 w-4" />
                  <Trans>Record pickup</Trans>
                </Button>
              </HStack>
            )}
            <InfiniteScroll
              key={pickupScrollKey}
              component={PickupActivityRowWrapper}
              items={pickups}
              loadMore={loadMorePickups}
              hasMore={pickupHasMore}
            />
          </motion.div>
        )
      },
      {
        id: 6,
        disabled: false,
        label: (
          <span className="flex items-center gap-2">
            <span>
              <Trans>Quantities</Trans>
            </span>
            {quantityCount > 0 && <Count count={quantityCount} />}
          </span>
        ),
        content: (
          <motion.div
            className="flex w-full flex-col gap-4 py-6 pr-2 min-h-[300px]"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{
              type: "spring",
              bounce: 0.2,
              duration: 0.75,
              delay: 0.15
            }}
          >
            {(item.id === selectedItemId ||
              (canRecordQuantity && onAddProductionQuantity)) && (
              <HStack className="w-full flex-wrap items-center justify-between gap-2">
                <HStack className="min-w-0 flex-wrap items-center gap-2">
                  {item.id === selectedItemId ? (
                    <OperationQuantitySummaryView
                      summary={operationQuantitySummary}
                      configurationParameters={configurationParameters}
                    />
                  ) : null}
                </HStack>
                {canRecordQuantity && onAddProductionQuantity ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="shrink-0 transition-transform active:scale-[0.96]"
                    onClick={() => onAddProductionQuantity(item.id)}
                  >
                    <LuCirclePlus className="mr-1.5 h-4 w-4" />
                    <Trans>Record quantity</Trans>
                  </Button>
                ) : null}
              </HStack>
            )}
            <InfiniteScroll
              component={QuantityReportRow}
              items={item.id === selectedItemId ? quantityReports : []}
              loadMore={loadMoreQuantityReports}
              hasMore={quantityHasMore}
              listClassName="gap-5 pt-2"
            />
          </motion.div>
        )
      },
      {
        id: 7,
        disabled: disablesOutsideBopDetailTabs(item.data.operationType),
        label: t`Events`,
        content: (
          <motion.div
            className="flex w-full flex-col pr-2 py-6 min-h-[300px]"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{
              type: "spring",
              bounce: 0.2,
              duration: 0.75,
              delay: 0.15
            }}
          >
            <InfiniteScroll
              component={ProductionEventActivity}
              items={productionEvents}
              loadMore={loadMoreProductionEvents}
              hasMore={hasMore}
            />
          </motion.div>
        )
      },
      {
        id: 8,
        disabled: disablesOutsideBopDetailTabs(item.data.operationType),
        label: t`Chat`,
        content: <OperationChat jobOperationId={item.id} />
      }
    ];

    return (
      <SortableListItem<Operation>
        item={item}
        items={items}
        order={order}
        key={item.id}
        isExpanded={isOpen}
        onSelectItem={setSelectedItemId}
        onToggleItem={onToggleItem}
        onRemoveItem={onRemoveItem}
        handleDrag={onCloseOnDrag}
        className="my-2 "
        renderExtra={(item) => (
          <div key={`${isOpen}`}>
            <motion.button
              layout
              onClick={
                isOpen
                  ? () => {
                      if (isNewOperation) {
                        onRemoveItem(item.id);
                      } else {
                        setSelectedItemId(null);
                      }
                    }
                  : () => {
                      setSelectedItemId(item.id);
                    }
              }
              key="collapse"
              className={cn("absolute right-3 top-3 z-10")}
            >
              {isOpen ? (
                <motion.span
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{
                    type: "spring",
                    duration: 1.95
                  }}
                >
                  <LuX className="h-5 w-5 text-foreground" />
                </motion.span>
              ) : (
                <motion.span
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{
                    type: "spring",
                    duration: 0.95
                  }}
                >
                  <LuSettings2 className="stroke-1 h-5 w-5 text-foreground/80  hover:stroke-primary/70 " />
                </motion.span>
              )}
            </motion.button>

            <LayoutGroup id={`${item.id}`}>
              <AnimatePresence mode="popLayout">
                {isOpen ? (
                  <motion.div className="flex w-full flex-col ">
                    <div className=" w-full p-2">
                      <motion.div
                        initial={{
                          y: 0,
                          opacity: 0,
                          filter: "blur(4px)"
                        }}
                        animate={{
                          y: 0,
                          opacity: 1,
                          filter: "blur(0px)"
                        }}
                        transition={{
                          type: "spring",
                          duration: 0.15
                        }}
                        layout
                        className="w-full "
                      >
                        {isNewOperation ? (
                          operationFormContent
                        ) : (
                          <DirectionAwareTabs
                            className="mr-auto"
                            tabs={tabs}
                            onChange={() =>
                              setTabChangeRerender(tabChangeRerender + 1)
                            }
                          />
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </LayoutGroup>
          </div>
        )}
      />
    );
  };

  const list = (
    <SortableList
      items={items}
      onReorder={onReorder}
      onToggleItem={onToggleItem}
      onRemoveItem={onRemoveItem}
      renderItem={renderListItem}
    />
  );

  const configSummaryOperation = configSummaryOperationId
    ? operationsById.get(configSummaryOperationId)
    : undefined;

  const configSummaryModalElement = hasConfigurationParameters ? (
    <Modal
      open={configSummaryModal.isOpen}
      onOpenChange={(open) => {
        if (!open) configSummaryModal.onClose();
      }}
    >
      <ModalContent
        className={cn(
          "flex w-fit min-w-[20rem] max-w-[min(90vw,56rem)] max-h-[85dvh] flex-col overflow-hidden",
          "md:w-fit sm:w-fit sm:max-w-[min(90vw,56rem)]"
        )}
      >
        <ModalHeader className="mb-4 shrink-0">
          <ModalTitle>
            {configSummaryOperation?.description ?? (
              <Trans>Configuration quantities</Trans>
            )}
          </ModalTitle>
        </ModalHeader>
        <ModalBody className="mb-0 min-h-0 flex-1 overflow-y-auto overflow-x-auto pb-6">
          {configSummaryLoading ? (
            <Loading isLoading />
          ) : (
            <ConfigParamsReportedTargetTable
              rows={configSummaryRows}
              parameters={configurationParameters ?? []}
            />
          )}
        </ModalBody>
        <ModalFooter className="shrink-0">
          <Button variant="secondary" onClick={configSummaryModal.onClose}>
            <Trans>Close</Trans>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ) : null;

  const quantityDrawerElements = (
    <>
      {dispositionReport ? (
        <ProductionQuantityDispositionDrawer
          report={dispositionReport}
          configurationParameters={configurationParameters}
          itemId={itemId}
          open
          onClose={() => setDispositionReport(null)}
          onSaved={handleQuantityReportSaved}
        />
      ) : null}
      {historyReport ? (
        <ProductionQuantityReportHistoryDrawer
          reportId={historyReport.id}
          configurationParameters={configurationParameters}
          open
          onClose={() => setHistoryReport(null)}
        />
      ) : null}
      {supplierDispositionReport ? (
        <SupplierQuantityDispositionDrawer
          report={supplierDispositionReport}
          configurationParameters={configurationParameters}
          itemId={itemId}
          open
          onClose={() => setSupplierDispositionReport(null)}
          onSaved={handleSupplierQuantityReportSaved}
        />
      ) : null}
      {supplierHistoryReport ? (
        <ProductionQuantityReportHistoryDrawer
          reportId={supplierHistoryReport.id}
          linesApiPath={path.to.api.supplierQuantityReportLines(
            supplierHistoryReport.id,
            true
          )}
          supplierId={supplierHistoryReport.supplierProcess?.supplierId}
          reportCreatedBy={supplierHistoryReport.createdBy}
          configurationParameters={configurationParameters}
          open
          onClose={() => setSupplierHistoryReport(null)}
        />
      ) : null}
    </>
  );

  if (routeJob) {
    return (
      <>
        <div className="flex w-max max-w-[min(42rem,calc(100vw-1.5rem))] flex-col">
          <HStack className="shrink-0 items-center justify-between border-b border-border px-4 py-3 pr-12">
            <h3 className="text-base font-medium font-headline tracking-tight text-foreground">
              <Trans>Bill of Process</Trans>
            </h3>
            <Button
              ref={addOperationButtonRef}
              variant="secondary"
              isDisabled={
                !permissions.can("update", "production") ||
                selectedItemId !== null ||
                isDisabled
              }
              onClick={onAddItem}
              className="transition-transform active:scale-[0.96]"
            >
              <Trans>Add Operation</Trans>
            </Button>
          </HStack>
          <div className="min-h-0 max-h-[min(72vh,48rem)] overflow-y-auto px-3 py-3">
            {list}
          </div>
        </div>
        {configSummaryModalElement}
        {quantityDrawerElements}
      </>
    );
  }

  return (
    <>
      <Card>
        <HStack className="justify-between">
          <CardHeader>
            <CardTitle>
              <Trans>Bill of Process</Trans>
            </CardTitle>
          </CardHeader>

          <CardAction>
            <Button
              ref={addOperationButtonRef}
              variant="secondary"
              isDisabled={
                !permissions.can("update", "production") ||
                selectedItemId !== null ||
                isDisabled
              }
              onClick={onAddItem}
              className="transition-transform active:scale-[0.96]"
            >
              <Trans>Add Operation</Trans>
            </Button>
          </CardAction>
        </HStack>
        <CardContent>{list}</CardContent>
      </Card>
      {configSummaryModalElement}
      {quantityDrawerElements}
    </>
  );
};

export default JobBillOfProcess;

function StepsForm({
  operationId,
  isDisabled,
  steps,
  temporaryItems,
  materials
}: {
  operationId: string;
  isDisabled: boolean;
  steps: JobOperationStep[];
  temporaryItems: TemporaryItems;
  materials: JobMaterial[];
}) {
  const fetcher = useFetcher<typeof newJobOperationParameterAction>();
  const { t } = useLingui();
  const sortOrderFetcher = useFetcher<{ success: boolean }>();
  const [type, setType] = useState<OperationStep["type"]>("Task");
  const [description, setDescription] = useState<JSONContent>({});
  const [numericControls, setNumericControls] = useState<string[]>([]);

  // Initialize sort order state based on existing steps
  const [sortOrder, setSortOrder] = useState<string[]>(() =>
    [...steps]
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((step) => step.id || "")
  );

  const disclosure = useDisclosure();

  // Update sort order when steps change
  useEffect(() => {
    if (steps && steps.length > 0) {
      const sorted = [...steps]
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        .map((step) => step.id || "");
      setSortOrder(sorted);
    }
  }, [steps]);

  const onReorder = (newOrder: string[]) => {
    if (isDisabled) return;

    const updates: Record<string, number> = {};
    newOrder.forEach((id, index) => {
      updates[id] = index + 1;
    });
    setSortOrder(newOrder);
    updateSortOrder(updates);
  };

  const updateSortOrder = useDebounce(
    (updates: Record<string, number>) => {
      let formData = new FormData();
      formData.append("updates", JSON.stringify(updates));
      sortOrderFetcher.submit(formData, {
        method: "post",
        action: path.to.jobOperationStepOrder(operationId)
      });
    },
    1000,
    true
  );

  const typeOptions = useMemo(
    () =>
      procedureStepType.map((type) => ({
        label: (
          <HStack>
            <ProcedureStepTypeIcon type={type} className="mr-2" />
            {type}
          </HStack>
        ),
        value: type
      })),
    []
  );

  const { carbon } = useCarbon();
  const {
    company: { id: companyId }
  } = useUser();
  const [allItems] = useItems();

  const materialItemIds = useMemo(
    () => new Set((materials ?? []).map((m) => m.itemId)),
    [materials]
  );

  const itemMentions = useMemo(
    () =>
      allItems
        .filter((item) => materialItemIds.has(item.id))
        .map((item) => ({
          id: item.id,
          label: item.name ?? item.readableIdWithRevision,
          helper: item.name ? item.readableIdWithRevision : undefined
        })),
    [allItems, materialItemIds]
  );

  const onUploadImage = async (file: File) => {
    const fileType = file.name.split(".").pop();
    const fileName = `${companyId}/parts/${nanoid()}.${fileType}`;

    const result = await carbon?.storage.from("private").upload(fileName, file);

    if (result?.error) {
      toast.error(t`Failed to upload image`);
      throw new Error(result.error.message);
    }

    if (!result?.data) {
      throw new Error("Failed to upload image");
    }

    return getPrivateUrl(result.data.path);
  };

  if (isDisabled && temporaryItems[operationId]) {
    return (
      <Alert className="max-w-[420px] mx-auto my-8">
        <LuTriangleAlert />
        <AlertTitle>
          <Trans>Cannot add steps to unsaved operation</Trans>
        </AlertTitle>
        <AlertDescription>
          <Trans>Please save the operation before adding steps.</Trans>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Loading
      className="flex flex-col gap-6"
      isLoading={fetcher.state !== "idle"}
    >
      {disclosure.isOpen ? (
        <div className="p-6 border rounded-lg bg-card mb-6">
          <ValidatedForm
            action={path.to.newJobOperationStep}
            method="post"
            validator={operationStepValidator}
            fetcher={fetcher}
            resetAfterSubmit
            defaultValues={{
              id: undefined,
              name: "",
              description: "",
              type: "Task",
              unitOfMeasureCode: "",
              minValue: 0,
              maxValue: 0,
              listValues: [],
              sortOrder:
                steps.reduce((acc, a) => Math.max(acc, a.sortOrder ?? 0), 0) +
                1,
              operationId
            }}
            onSubmit={() => {
              setType("Value");
              setDescription({});
            }}
            className="w-full"
          >
            <Hidden name="operationId" />
            <Hidden name="sortOrder" />
            <Hidden name="description" value={JSON.stringify(description)} />
            <VStack spacing={4}>
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                <SelectControlled
                  name="type"
                  label={t`Type`}
                  options={typeOptions}
                  value={type}
                  onChange={(option) => {
                    if (option) {
                      setType(option.value as OperationStep["type"]);
                    }
                  }}
                />
                <Input name="name" label={t`Name`} />
              </div>

              <VStack spacing={2} className="w-full col-span-2">
                <Label>
                  <Trans>Description</Trans>
                </Label>
                <Editor
                  initialValue={description}
                  onUpload={onUploadImage}
                  onChange={(value) => {
                    setDescription(value);
                  }}
                  mentions={[{ char: "@", items: itemMentions }]}
                  className="[&_.is-empty]:text-muted-foreground min-h-[120px] p-4 rounded-lg border w-full"
                />
              </VStack>

              {type === "Measurement" && (
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                  <UnitOfMeasure
                    name="unitOfMeasureCode"
                    label={t`Unit of Measure`}
                  />

                  <ToggleGroup
                    type="multiple"
                    value={numericControls}
                    onValueChange={setNumericControls}
                    className="justify-start items-start mt-6"
                  >
                    <ToggleGroupItem size="sm" value="min">
                      <LuMinimize2 className="mr-2" />
                      Minimum
                    </ToggleGroupItem>
                    <ToggleGroupItem size="sm" value="max">
                      <LuMaximize2 className="mr-2" />
                      Maximum
                    </ToggleGroupItem>
                  </ToggleGroup>

                  {numericControls.includes("min") && (
                    <Number
                      name="minValue"
                      label={t`Minimum`}
                      formatOptions={{
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 10
                      }}
                    />
                  )}
                  {numericControls.includes("max") && (
                    <Number
                      name="maxValue"
                      label={t`Maximum`}
                      formatOptions={{
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 10
                      }}
                    />
                  )}
                </div>
              )}
              {type === "List" && (
                <ArrayInput name="listValues" label={t`List Options`} />
              )}

              <Submit
                leftIcon={<LuCirclePlus />}
                isDisabled={isDisabled || fetcher.state !== "idle"}
                isLoading={fetcher.state !== "idle"}
              >
                <Trans>Save Step</Trans>
              </Submit>
            </VStack>
          </ValidatedForm>
        </div>
      ) : (
        <div className="flex justify-end mb-4">
          <Button onClick={disclosure.onOpen} leftIcon={<LuCirclePlus />}>
            <Trans>Add Step</Trans>
          </Button>
        </div>
      )}

      {steps.length > 0 && (
        <div className="border rounded-lg ">
          <Reorder.Group
            axis="y"
            values={sortOrder}
            onReorder={onReorder}
            className="w-full"
          >
            {sortOrder.map((stepId) => {
              const step = steps.find((s) => s.id === stepId);
              if (!step) return null;
              const index = sortOrder.indexOf(stepId);
              return (
                <DraggableStepItem
                  key={stepId}
                  stepId={stepId}
                  isDisabled={isDisabled}
                >
                  {(dragControls) => (
                    <StepsListItem
                      attribute={step}
                      operationId={operationId}
                      typeOptions={typeOptions}
                      isDisabled={isDisabled}
                      dragControls={dragControls}
                      itemMentions={itemMentions}
                      className={
                        index === sortOrder.length - 1 ? "border-none" : ""
                      }
                    />
                  )}
                </DraggableStepItem>
              );
            })}
          </Reorder.Group>
        </div>
      )}
    </Loading>
  );
}

function DraggableStepItem({
  stepId,
  isDisabled,
  children
}: {
  stepId: string;
  isDisabled: boolean;
  children: (dragControls: DragControls) => ReactNode;
}) {
  const dragControls = useDragControls();
  return (
    <Reorder.Item
      key={stepId}
      value={stepId}
      dragListener={false}
      dragControls={dragControls}
    >
      {children(dragControls)}
    </Reorder.Item>
  );
}

function StepsListItem({
  attribute,
  operationId,
  typeOptions,
  isDisabled = false,
  dragControls,
  itemMentions,
  className
}: {
  attribute: JobOperationStep;
  operationId: string;
  typeOptions: { label: JSX.Element; value: string }[];
  isDisabled?: boolean;
  dragControls?: DragControls;
  itemMentions: { id: string; label: string }[];
  className?: string;
}) {
  const {
    name,
    unitOfMeasureCode,
    minValue,
    maxValue,
    id,
    updatedBy,
    updatedAt,
    createdBy,
    createdAt
  } = attribute;

  const { formatRelativeTime } = useDateFormatter();
  const createdUpdatedText = useRelativeCreatedUpdatedText();
  const disclosure = useDisclosure();
  const deleteModalDisclosure = useDisclosure();
  const submitted = useRef(false);
  const fetcher = useFetcher<typeof editJobOperationStepAction>();
  const { t } = useLingui();
  const [description, setDescription] = useState<JSONContent>(() => {
    if (!attribute.description) return {};
    // Handle both object and string formats
    if (typeof attribute.description === "object") {
      return attribute.description as JSONContent;
    }
    try {
      return JSON.parse(attribute.description);
      // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
    } catch (e) {
      return {};
    }
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  useEffect(() => {
    if (submitted.current && fetcher.state === "idle") {
      disclosure.onClose();
      submitted.current = false;
    }
  }, [fetcher.state]);

  const [type, setType] = useState<OperationStep["type"]>(attribute.type);
  const [numericControls, setNumericControls] = useState<string[]>(() => {
    const controls = [];
    if (type === "Measurement") {
      if (minValue !== null) {
        controls.push("min");
      }
      if (maxValue !== null) {
        controls.push("max");
      }
    }
    return controls;
  });

  const isUpdated = updatedBy !== null;
  const person = isUpdated ? updatedBy : createdBy;
  const date = updatedAt ?? createdAt;

  const unitOfMeasures = useUnitOfMeasure();
  const { carbon } = useCarbon();
  const {
    company: { id: companyId }
  } = useUser();

  const onUploadImage = async (file: File) => {
    const fileType = file.name.split(".").pop();
    const fileName = `${companyId}/parts/${nanoid()}.${fileType}`;

    const result = await carbon?.storage.from("private").upload(fileName, file);

    if (result?.error) {
      toast.error(t`Failed to upload image`);
      throw new Error(result.error.message);
    }

    if (!result?.data) {
      throw new Error("Failed to upload image");
    }

    return getPrivateUrl(result.data.path);
  };

  if (!id) return null;

  return (
    <div className={cn("border-b p-6", className)}>
      {disclosure.isOpen ? (
        <ValidatedForm
          action={path.to.jobOperationStep(id)}
          method="post"
          validator={operationStepValidator}
          fetcher={fetcher}
          resetAfterSubmit
          onSubmit={() => {
            disclosure.onClose();
          }}
          defaultValues={{
            ...attribute,
            operationId
          }}
          className="w-full"
        >
          <Hidden name="operationId" />
          <Hidden name="description" value={JSON.stringify(description)} />
          <VStack spacing={4}>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <SelectControlled
                name="type"
                label={t`Type`}
                options={typeOptions}
                onChange={(option) => {
                  if (option) {
                    setType(option.value as OperationStep["type"]);
                  }
                }}
              />
              <Input name="name" label={t`Name`} />
            </div>

            <VStack spacing={2} className="w-full col-span-2">
              <Label>
                <Trans>Description</Trans>
              </Label>
              <Editor
                initialValue={description}
                onUpload={onUploadImage}
                onChange={(value) => {
                  setDescription(value);
                }}
                mentions={[{ char: "@", items: itemMentions }]}
                className="[&_.is-empty]:text-muted-foreground min-h-[120px] p-4 rounded-lg border w-full"
              />
            </VStack>

            {type === "Measurement" && (
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                <UnitOfMeasure
                  name="unitOfMeasureCode"
                  label={t`Unit of Measure`}
                />

                <ToggleGroup
                  type="multiple"
                  value={numericControls}
                  onValueChange={setNumericControls}
                  className="justify-start items-start mt-6"
                >
                  <ToggleGroupItem size="sm" value="min">
                    <LuMinimize2 className="mr-2" />
                    Minimum
                  </ToggleGroupItem>
                  <ToggleGroupItem size="sm" value="max">
                    <LuMaximize2 className="mr-2" />
                    Maximum
                  </ToggleGroupItem>
                </ToggleGroup>

                {numericControls.includes("min") && (
                  <Number
                    name="minValue"
                    label={t`Minimum`}
                    formatOptions={{
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 10
                    }}
                  />
                )}
                {numericControls.includes("max") && (
                  <Number
                    name="maxValue"
                    label={t`Maximum`}
                    formatOptions={{
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 10
                    }}
                  />
                )}
              </div>
            )}
            {type === "List" && (
              <ArrayInput name="listValues" label={t`List Options`} />
            )}
            <HStack className="w-full justify-end" spacing={2}>
              <Button variant="secondary" onClick={disclosure.onClose}>
                <Trans>Cancel</Trans>
              </Button>
              <Submit
                isDisabled={fetcher.state !== "idle"}
                isLoading={fetcher.state !== "idle"}
              >
                <Trans>Save</Trans>
              </Submit>
            </HStack>
          </VStack>
        </ValidatedForm>
      ) : (
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-1 justify-between items-center w-full">
            <HStack spacing={4} className="w-1/2">
              <IconButton
                aria-label={t`Drag handle`}
                icon={<LuGripVertical />}
                variant="ghost"
                disabled={isDisabled}
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => {
                  if (!isDisabled && dragControls) dragControls.start(e);
                }}
                style={{ touchAction: "none" }}
              />
              <HStack spacing={4} className="flex-1">
                <div className="bg-muted border rounded-full flex items-center justify-center p-2">
                  <ProcedureStepTypeIcon type={type} />
                </div>
                <VStack spacing={0}>
                  <HStack>
                    <p className="text-foreground text-sm font-medium">
                      {attribute.name}
                    </p>
                    {attribute.description &&
                    Object.keys(attribute.description).length > 0 ? (
                      <Tooltip>
                        <TooltipTrigger>
                          <LuInfo className="text-muted-foreground size-3" />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p
                            className="prose prose-sm dark:prose-invert text-foreground text-sm"
                            dangerouslySetInnerHTML={{
                              __html: generateHTML(attribute.description)
                            }}
                          />
                        </TooltipContent>
                      </Tooltip>
                    ) : null}
                  </HStack>
                  {attribute.type === "Measurement" && (
                    <span className="text-xs text-muted-foreground">
                      {attribute.minValue !== null &&
                      attribute.maxValue !== null
                        ? `Must be between ${attribute.minValue} and ${
                            attribute.maxValue
                          } ${
                            unitOfMeasures.find(
                              (u) => u.value === unitOfMeasureCode
                            )?.label
                          }`
                        : attribute.minValue !== null
                          ? `Must be > ${attribute.minValue} ${
                              unitOfMeasures.find(
                                (u) => u.value === unitOfMeasureCode
                              )?.label
                            }`
                          : attribute.maxValue !== null
                            ? `Must be < ${attribute.maxValue} ${
                                unitOfMeasures.find(
                                  (u) => u.value === unitOfMeasureCode
                                )?.label
                              }`
                            : null}
                    </span>
                  )}
                </VStack>
              </HStack>
            </HStack>
            <div className="flex items-center justify-end gap-2">
              <HStack spacing={2}>
                <span className="text-xs text-muted-foreground">
                  {createdUpdatedText(isUpdated, formatRelativeTime(date))}
                </span>
                <EmployeeAvatar employeeId={person} withName={false} />
              </HStack>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton
                    aria-label={t`Open menu`}
                    icon={<LuEllipsisVertical />}
                    variant="ghost"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={disclosure.onOpen}>
                    <Trans>Edit</Trans>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    destructive
                    onClick={deleteModalDisclosure.onOpen}
                  >
                    <Trans>Delete</Trans>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {attribute.jobOperationStepRecord && (
            <PreviewStepRecords attribute={attribute} />
          )}
        </div>
      )}
      {deleteModalDisclosure.isOpen && (
        <ConfirmDelete
          action={path.to.deleteJobOperationStep(id)}
          isOpen={deleteModalDisclosure.isOpen}
          name={name}
          text={t`Are you sure you want to delete the ${name} attribute from this operation? This cannot be undone.`}
          onCancel={() => {
            deleteModalDisclosure.onClose();
          }}
          onSubmit={() => {
            deleteModalDisclosure.onClose();
          }}
        />
      )}
    </div>
  );
}

function PreviewStepRecords({ attribute }: { attribute: JobOperationStep }) {
  const { t } = useLingui();
  const { formatRelativeTime } = useDateFormatter();
  if (
    !attribute.jobOperationStepRecord ||
    !Array.isArray(attribute.jobOperationStepRecord)
  ) {
    return null;
  }

  const records = attribute.jobOperationStepRecord;

  return (
    <div className="mt-4">
      <div className="border rounded-lg overflow-hidden">
        {records.map((record, index) => (
          <div
            key={record.id || index}
            className={cn(
              "flex flex-1 items-center justify-between px-3 py-2",
              index !== records.length - 1 && "border-b"
            )}
          >
            <div className="flex w-1/2 items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground font-medium">
                {t`Record ${index + 1}`}
              </span>
              <div className="text-right font-medium">
                <PreviewStepRecord attribute={attribute} record={record} />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 w-1/2">
              <HStack spacing={2}>
                <span className="text-xs text-muted-foreground">
                  {t`Created ${formatRelativeTime(record.createdAt ?? "")}`}
                </span>
                <EmployeeAvatar
                  employeeId={record.createdBy}
                  withName={false}
                />
              </HStack>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewStepRecord({
  attribute,
  record
}: {
  attribute: JobOperationStep;
  record: any;
}) {
  const { formatDateTime } = useDateFormatter();
  const unitOfMeasures = useUnitOfMeasure();
  const [employees] = usePeople();
  const numberFormatter = useNumberFormatter();

  return (
    <>
      {attribute.type === "Task" && (
        <Checkbox checked={record.booleanValue ?? false} />
      )}
      {attribute.type === "Checkbox" && (
        <Checkbox checked={record.booleanValue ?? false} />
      )}
      {attribute.type === "Value" && <p className="text-sm">{record.value}</p>}
      {attribute.type === "Measurement" &&
        typeof record.numericValue === "number" && (
          <p
            className={cn(
              "text-sm",
              attribute.minValue !== null &&
                attribute.minValue !== undefined &&
                record.numericValue < attribute.minValue &&
                "text-red-500",
              attribute.maxValue !== null &&
                attribute.maxValue !== undefined &&
                record.numericValue > attribute.maxValue &&
                "text-red-500"
            )}
          >
            {numberFormatter.format(record.numericValue)}{" "}
            {
              unitOfMeasures.find(
                (u) => u.value === attribute.unitOfMeasureCode
              )?.label
            }
          </p>
        )}
      {attribute.type === "Timestamp" && (
        <p className="text-sm">{formatDateTime(record.value ?? "")}</p>
      )}
      {attribute.type === "List" && <p className="text-sm">{record.value}</p>}
      {attribute.type === "Person" && (
        <p className="text-sm">
          {employees.find((e) => e.id === record.userValue)?.name}
        </p>
      )}
      {attribute.type === "File" && record.value && (
        <div className="flex justify-end gap-2 text-xs">
          <LuPaperclip className="size-4 text-muted-foreground" />
          <a
            href={getPrivateUrl(record.value)}
            target="_blank"
            rel="noopener noreferrer"
          >
            View File
          </a>
        </div>
      )}
      {attribute.type === "Inspection" && (
        <div className="flex justify-end gap-2 items-center text-sm">
          {record.value && (
            <>
              <LuPaperclip className="size-4 text-muted-foreground" />
              <a
                href={getPrivateUrl(record.value)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs"
              >
                View File
              </a>
            </>
          )}
          <Checkbox checked={record.booleanValue ?? false} />
        </div>
      )}
    </>
  );
}

function ParametersForm({
  operationId,
  isDisabled,
  parameters,
  temporaryItems
}: {
  operationId: string;
  isDisabled: boolean;
  parameters: OperationParameter[];
  temporaryItems: TemporaryItems;
}) {
  const fetcher = useFetcher<typeof newJobOperationParameterAction>();
  const { t } = useLingui();

  if (isDisabled && temporaryItems[operationId]) {
    return (
      <Alert className="max-w-[420px] mx-auto my-8">
        <LuTriangleAlert />
        <AlertTitle>
          <Trans>Cannot add parameters to unsaved operation</Trans>
        </AlertTitle>
        <AlertDescription>
          <Trans>Please save the operation before adding parameters.</Trans>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="p-6 border rounded-lg bg-card">
        <ValidatedForm
          action={path.to.newJobOperationParameter}
          method="post"
          validator={operationParameterValidator}
          fetcher={fetcher}
          resetAfterSubmit
          defaultValues={{
            id: undefined,
            key: "",
            value: "",
            operationId
          }}
          className="w-full"
        >
          <Hidden name="operationId" />
          <VStack spacing={4}>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <Input
                name="key"
                label={t`Key`}
                autoFocus={parameters.length === 0}
              />
              <Input name="value" label={t`Value`} />
            </div>
            <Submit
              leftIcon={<LuCirclePlus />}
              isDisabled={isDisabled || fetcher.state !== "idle"}
              isLoading={fetcher.state !== "idle"}
            >
              <Trans>Add Parameter</Trans>
            </Submit>
          </VStack>
        </ValidatedForm>
      </div>

      {parameters.length > 0 && (
        <div className="border rounded-lg">
          {[...parameters]
            .sort((a, b) =>
              String(a.id ?? "").localeCompare(String(b.id ?? ""))
            )
            .map((p, index) => (
              <ParametersListItem
                key={p.id}
                parameter={p}
                operationId={operationId}
                className={index === parameters.length - 1 ? "border-none" : ""}
              />
            ))}
        </div>
      )}
    </div>
  );
}

function ParametersListItem({
  parameter: { key, value, id, updatedBy, updatedAt, createdBy, createdAt },
  operationId,
  className
}: {
  parameter: OperationParameter;
  operationId: string;
  className?: string;
}) {
  const { formatRelativeTime } = useDateFormatter();
  const createdUpdatedText = useRelativeCreatedUpdatedText();
  const disclosure = useDisclosure();
  const deleteModalDisclosure = useDisclosure();
  const submitted = useRef(false);
  const fetcher = useFetcher<typeof editJobOperationParameterAction>();
  const { t } = useLingui();

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  useEffect(() => {
    if (submitted.current && fetcher.state === "idle") {
      disclosure.onClose();
      submitted.current = false;
    }
  }, [fetcher.state]);

  const isUpdated = updatedBy !== null;
  const person = isUpdated ? updatedBy : createdBy;
  const date = updatedAt ?? createdAt;

  if (!id) return null;

  return (
    <div className={cn("border-b p-6", className)}>
      {disclosure.isOpen ? (
        <ValidatedForm
          action={path.to.jobOperationParameter(id)}
          method="post"
          validator={operationParameterValidator}
          fetcher={fetcher}
          resetAfterSubmit
          onSubmit={() => {
            disclosure.onClose();
          }}
          defaultValues={{
            id: id,
            key: key ?? "",
            value: value ?? "",
            operationId
          }}
          className="w-full"
        >
          <Hidden name="operationId" />
          <VStack spacing={4}>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <Input name="key" label={t`Key`} />
              <Input name="value" label={t`Value`} />
            </div>
            <HStack className="w-full justify-end" spacing={2}>
              <Button variant="secondary" onClick={disclosure.onClose}>
                <Trans>Cancel</Trans>
              </Button>
              <Submit
                isDisabled={fetcher.state !== "idle"}
                isLoading={fetcher.state !== "idle"}
              >
                <Trans>Save</Trans>
              </Submit>
            </HStack>
          </VStack>
        </ValidatedForm>
      ) : (
        <div className="flex flex-1 justify-between items-center w-full">
          <HStack spacing={4} className="w-1/2">
            <HStack spacing={4} className="flex-1">
              <div className="bg-muted border rounded-full flex items-center justify-center p-2">
                <LuActivity className="size-4" />
              </div>
              <VStack spacing={0}>
                <span className="text-sm font-medium">{key}</span>
              </VStack>
              <span className="text-base text-muted-foreground">{value}</span>
            </HStack>
          </HStack>
          <div className="flex items-center justify-end gap-2">
            <HStack spacing={2}>
              <span className="text-xs text-muted-foreground">
                {createdUpdatedText(isUpdated, formatRelativeTime(date))}
              </span>
              <EmployeeAvatar employeeId={person} withName={false} />
            </HStack>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton
                  aria-label={t`Open menu`}
                  icon={<LuEllipsisVertical />}
                  variant="ghost"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={disclosure.onOpen}>
                  <Trans>Edit</Trans>
                </DropdownMenuItem>
                <DropdownMenuItem
                  destructive
                  onClick={deleteModalDisclosure.onOpen}
                >
                  <Trans>Delete</Trans>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
      {deleteModalDisclosure.isOpen && (
        <ConfirmDelete
          action={path.to.deleteJobOperationParameter(id)}
          isOpen={deleteModalDisclosure.isOpen}
          name={key}
          text={t`Are you sure you want to delete the ${key} parameter from this operation? This cannot be undone.`}
          onCancel={() => {
            deleteModalDisclosure.onClose();
          }}
          onSubmit={() => {
            deleteModalDisclosure.onClose();
          }}
        />
      )}
    </div>
  );
}

function OperationForm({
  item,
  jobId,
  isDisabled,
  job,
  locationId,
  workInstruction,
  setWorkInstructions,
  setTemporaryItems,
  setSelectedItemId,
  temporaryItems,
  onSubmit
}: {
  item: ItemWithData;
  jobId: string;
  isDisabled: boolean;
  job?: Job;
  locationId: string;
  workInstruction: JSONContent;
  setWorkInstructions: Dispatch<SetStateAction<PendingWorkInstructions>>;
  setTemporaryItems: Dispatch<SetStateAction<TemporaryItems>>;
  setSelectedItemId: Dispatch<SetStateAction<string | null>>;
  onSubmit: () => void;
  temporaryItems: TemporaryItems;
}) {
  const { t } = useLingui();
  const operationOrderOptions = useMemo(
    () => [
      { value: "After Previous", label: <Trans>After Previous</Trans> },
      { value: "With Previous", label: <Trans>With Previous</Trans> }
    ],
    []
  );
  const operationTypeOptions = useOperationTypeSelectOptions();
  const { company } = useUser();

  const fetcher = useFetcher<{
    id: string;
    success: boolean;
    message: string;
  }>();
  const { carbon } = useCarbon();
  const baseCurrency = company?.baseCurrencyCode ?? "USD";

  useEffect(() => {
    if (fetcher.data?.id) {
      // Clear temporary item after successful save
      setTemporaryItems((prev) => {
        const { [item.id]: _, ...rest } = prev;
        return rest;
      });
      if (fetcher.data?.success) {
        toast.success(fetcher.data.message);
      }
      onSubmit();
    }
  }, [item.id, fetcher.data, onSubmit, setTemporaryItems]);

  const [procedureWasChanged, setProcedureWasChanged] = useState(false);
  const procedureSyncDisclosure = useDisclosure();

  const [processData, setProcessData] = useState<{
    description: string;
    insideUnitCost: number;
    laborRate: number;
    laborTime: number;
    laborUnit: string;
    laborUnitHint: string;
    machineRate: number;
    machineTime: number;
    machineUnit: string;
    machineUnitHint: string;
    operationMinimumCost: number;
    operationLeadTime: number;
    operationSupplierProcessId: string;
    operationType: OperationType;
    operationUnitCost: number;
    overheadRate: number;
    processId: string;
    procedureId: string;
    setupTime: number;
    setupUnit: string;
    setupUnitHint: string;
  }>({
    description: item.data.description ?? "",
    insideUnitCost: (item.data as any).insideUnitCost ?? 0,
    laborRate: item.data.laborRate ?? 0,
    laborTime: item.data.laborTime ?? 0,
    laborUnit: item.data.laborUnit ?? "Hours/Piece",
    laborUnitHint: getUnitHint(item.data.laborUnit),
    machineRate: item.data.machineRate ?? 0,
    machineTime: item.data.machineTime ?? 0,
    machineUnit: item.data.machineUnit ?? "Hours/Piece",
    machineUnitHint: getUnitHint(item.data.machineUnit),
    operationMinimumCost: item.data.operationMinimumCost ?? 0,
    operationLeadTime: item.data.operationLeadTime ?? 0,
    operationSupplierProcessId: item.data.operationSupplierProcessId ?? "",
    operationType: (item.data.operationType ?? "Inside") as OperationType,
    operationUnitCost: item.data.operationUnitCost ?? 0,
    overheadRate: item.data.overheadRate ?? 0,
    processId: item.data.processId ?? "",
    procedureId: item.data.procedureId ?? "",
    setupTime: item.data.setupTime ?? 0,
    setupUnit: item.data.setupUnit ?? "Total Minutes",
    setupUnitHint: getUnitHint(item.data.setupUnit)
  });

  useEffect(() => {
    setTemporaryItems((prev) => {
      const current = prev[item.id];
      if (!current) return prev;

      return {
        ...prev,
        [item.id]: {
          ...current,
          description: processData.description,
          operationType: processData.operationType,
          processId: processData.processId,
          operationSupplierProcessId: processData.operationSupplierProcessId,
          operationMinimumCost: processData.operationMinimumCost,
          operationUnitCost: processData.operationUnitCost,
          operationLeadTime: processData.operationLeadTime,
          laborRate: processData.laborRate,
          machineRate: processData.machineRate,
          overheadRate: processData.overheadRate,
          setupTime: processData.setupTime,
          laborTime: processData.laborTime,
          machineTime: processData.machineTime
        }
      };
    });
  }, [processData, item.id, setTemporaryItems]);

  const { procedures } = useProcedures({ processId: processData.processId });

  const procedureTabSummary = useMemo(() => {
    if (!processData.procedureId) return undefined;
    const procedure = procedures.find((p) => p.id === processData.procedureId);
    return procedure?.name ?? "…";
  }, [processData.procedureId, procedures]);

  const procedureTabSummaryTitle = useMemo(() => {
    if (!processData.procedureId) return undefined;
    const procedure = procedures.find((p) => p.id === processData.procedureId);
    if (!procedure) return undefined;
    return procedure.version
      ? `${procedure.name} v${procedure.version}`
      : procedure.name;
  }, [processData.procedureId, procedures]);

  const onProcessChange = async (processId: string) => {
    if (!carbon || !processId) return;
    const [process, workCenters, supplierProcesses] = await Promise.all([
      carbon.from("process").select("*").eq("id", processId).single(),
      carbon
        .from("workCenterProcess")
        .select("workCenter(*)")
        .eq("processId", processId)
        .eq("workCenter.active", true),
      carbon.from("supplierProcess").select("*").eq("processId", processId)
    ]);

    const activeWorkCenters =
      workCenters?.data?.filter((wc) => Boolean(wc.workCenter)) ?? [];

    if (process.error) throw new Error(process.error.message);

    const operationType = defaultOperationTypeFromProcess(
      process.data?.processType
    );
    const useSupplierRouting = showsSupplierRoutingFields(operationType);

    setProcessData((p) => ({
      ...p,
      processId,
      procedureId: "",
      description: process.data?.name ?? "",
      laborUnit: process.data?.defaultStandardFactor ?? "Hours/Piece",
      laborUnitHint: getUnitHint(process.data?.defaultStandardFactor),
      laborRate:
        // get the average labor rate from the work centers
        activeWorkCenters.length
          ? activeWorkCenters.reduce((acc, workCenter) => {
              return (acc += workCenter.workCenter?.laborRate ?? 0);
            }, 0) / activeWorkCenters.length
          : p.laborRate,
      machineUnit: process.data?.defaultStandardFactor ?? "Hours/Piece",
      machineUnitHint: getUnitHint(process.data?.defaultStandardFactor),
      machineRate:
        // get the average labor rate from the work centers
        activeWorkCenters.length
          ? activeWorkCenters.reduce((acc, workCenter) => {
              return (acc += workCenter.workCenter?.machineRate ?? 0);
            }, 0) / activeWorkCenters.length
          : p.machineRate,
      // get the average quoting rate from the work centers
      overheadRate: activeWorkCenters.length
        ? activeWorkCenters?.reduce((acc, workCenter) => {
            return (acc += workCenter.workCenter?.overheadRate ?? 0);
          }, 0) / activeWorkCenters.length
        : p.overheadRate,
      operationMinimumCost:
        useSupplierRouting &&
        supplierProcesses.data &&
        supplierProcesses.data.length > 0
          ? supplierProcesses.data.reduce((acc, sp) => {
              return (acc += sp.minimumCost ?? 0);
            }, 0) / supplierProcesses.data.length
          : useSupplierRouting
            ? p.operationMinimumCost
            : 0,
      operationUnitCost:
        useSupplierRouting &&
        supplierProcesses.data &&
        supplierProcesses.data.length > 0
          ? supplierProcesses.data.reduce((acc, sp) => {
              return (acc += sp.unitCost ?? 0);
            }, 0) / supplierProcesses.data.length
          : useSupplierRouting
            ? p.operationUnitCost
            : 0,
      operationLeadTime:
        useSupplierRouting &&
        supplierProcesses.data &&
        supplierProcesses.data.length > 0
          ? supplierProcesses.data.reduce((acc, sp) => {
              return (acc += sp.leadTime ?? 0);
            }, 0) / supplierProcesses.data.length
          : useSupplierRouting
            ? p.operationLeadTime
            : 0,
      operationType
    }));
  };

  const onWorkCenterChange = async (workCenterId: string | null) => {
    if (!carbon) return;
    if (!workCenterId) {
      // get the average costs
      await onProcessChange(processData.processId);
      return;
    }

    const { data, error } = await carbon
      .from("workCenter")
      .select("*")
      .eq("id", workCenterId)
      .single();

    if (error) throw new Error(error.message);

    setProcessData((d) => ({
      ...d,
      laborRate: data?.laborRate ?? 0,
      laborUnit: data?.defaultStandardFactor ?? "Hours/Piece",
      laborUnitHint: getUnitHint(data?.defaultStandardFactor),
      machineRate: data?.machineRate ?? 0,
      machineUnit: data?.defaultStandardFactor ?? "Hours/Piece",
      machineUnitHint: getUnitHint(data?.defaultStandardFactor),
      overheadRate: data?.overheadRate ?? 0
    }));
  };

  const onSupplierProcessChange = async (supplierProcessId: string) => {
    if (!carbon) return;
    const { data, error } = await carbon
      .from("supplierProcess")
      .select("*")
      .eq("id", supplierProcessId)
      .single();

    if (error) throw new Error(error.message);

    setProcessData((d) => ({
      ...d,
      operationMinimumCost: data?.minimumCost ?? 0,
      operationUnitCost: data?.unitCost ?? 0,
      operationLeadTime: data?.leadTime ?? 0,
      operationSupplierProcessId: supplierProcessId
    }));
  };

  return (
    <ValidatedForm
      action={
        temporaryItems[item.id]
          ? path.to.newJobOperation(jobId)
          : path.to.jobOperation(jobId, item.id!)
      }
      method="post"
      defaultValues={item.data}
      validator={
        ["Draft", "Planned"].includes(job?.status ?? "")
          ? jobOperationValidator
          : jobOperationValidatorForReleasedJob
      }
      className="w-full flex flex-col gap-y-4"
      fetcher={fetcher}
    >
      <div>
        <Hidden name="id" />
        <Hidden name="jobMakeMethodId" />
        <Hidden name="order" />
      </div>
      <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
        <Process
          name="processId"
          label={t`Process`}
          onChange={(value) => {
            onProcessChange(value?.value as string);
          }}
        />
        <Select
          name="operationOrder"
          label={t`Operation Order`}
          placeholder={t`Operation Order`}
          options={operationOrderOptions}
        />
        <SelectControlled
          name="operationType"
          label={t`Operation Type`}
          placeholder={t`Operation Type`}
          options={operationTypeOptions}
          value={processData.operationType}
          onChange={(value) => {
            const operationType = value?.value as OperationType;
            const useSupplierRouting =
              showsSupplierRoutingFields(operationType);

            setProcessData((d) => ({
              ...d,
              setupUnit: "Total Minutes",
              laborUnit: "Minutes/Piece",
              machineUnit: "Minutes/Piece",
              operationType,
              ...(useSupplierRouting
                ? {}
                : {
                    operationSupplierProcessId: "",
                    operationMinimumCost: 0,
                    operationUnitCost: 0,
                    operationLeadTime: 0
                  })
            }));
          }}
        />

        <InputControlled
          name="description"
          label={t`Description`}
          value={processData.description}
          onChange={(newValue) => {
            setProcessData((d) => ({ ...d, description: newValue }));
          }}
          className="col-span-2"
        />

        {isInsideOperationType(processData.operationType) ? (
          <>
            <WorkCenter
              name="workCenterId"
              label={t`Work Center`}
              autoSelectSingleOption={Boolean(processData.processId)}
              locationId={locationId}
              isOptional={["Draft", "Planned"].includes(job?.status ?? "")}
              processId={processData.processId}
              onChange={(value) => {
                if (value) {
                  onWorkCenterChange(value?.value as string);
                }
              }}
            />
            <NumberControlled
              name="laborRate"
              label={t`Labor Rate`}
              minValue={0}
              value={processData.laborRate}
              formatOptions={{
                style: "currency",
                currency: baseCurrency
              }}
              onChange={(newValue) =>
                setProcessData((d) => ({
                  ...d,
                  laborRate: newValue
                }))
              }
            />
            <NumberControlled
              name="machineRate"
              label={t`Machine Rate`}
              minValue={0}
              value={processData.machineRate}
              formatOptions={{
                style: "currency",
                currency: baseCurrency
              }}
              onChange={(newValue) =>
                setProcessData((d) => ({
                  ...d,
                  machineRate: newValue
                }))
              }
            />
            <NumberControlled
              name="overheadRate"
              label={t`Overhead Rate`}
              minValue={0}
              value={processData.overheadRate}
              formatOptions={{
                style: "currency",
                currency: baseCurrency
              }}
              onChange={(newValue) =>
                setProcessData((d) => ({
                  ...d,
                  overheadRate: newValue
                }))
              }
            />
            <NumberControlled
              name="insideUnitCost"
              label={t`Unit rate`}
              minValue={0}
              value={processData.insideUnitCost}
              formatOptions={{
                style: "currency",
                currency: baseCurrency
              }}
              onChange={(newValue) =>
                setProcessData((d) => ({
                  ...d,
                  insideUnitCost: newValue ?? 0
                }))
              }
            />
          </>
        ) : null}
        {showsSupplierRoutingFields(processData.operationType) ? (
          <>
            <SupplierProcess
              name="operationSupplierProcessId"
              label={t`Supplier`}
              processId={processData.processId}
              isOptional={false}
              onChange={(value) => {
                if (value) {
                  onSupplierProcessChange(value?.value as string);
                } else {
                  setProcessData((d) => ({
                    ...d,
                    operationSupplierProcessId: ""
                  }));
                }
              }}
            />
            <NumberControlled
              name="operationMinimumCost"
              label={t`Minimum Cost`}
              isOptional={false}
              minValue={0}
              value={processData.operationMinimumCost}
              formatOptions={{
                style: "currency",
                currency: baseCurrency
              }}
              onChange={(newValue) =>
                setProcessData((d) => ({
                  ...d,
                  operationMinimumCost: newValue
                }))
              }
            />
            <NumberControlled
              name="operationUnitCost"
              label={t`Unit Cost`}
              isOptional={false}
              minValue={0}
              value={processData.operationUnitCost}
              formatOptions={{
                style: "currency",
                currency: baseCurrency
              }}
              onChange={(newValue) =>
                setProcessData((d) => ({
                  ...d,
                  operationUnitCost: newValue
                }))
              }
            />
            <NumberControlled
              name="operationLeadTime"
              label={t`Lead Time`}
              isOptional={false}
              minValue={0}
              value={processData.operationLeadTime}
              onChange={(newValue) =>
                setProcessData((d) => ({
                  ...d,
                  operationLeadTime: newValue
                }))
              }
            />
          </>
        ) : (
          <>
            <Hidden name="operationSupplierProcessId" value="" />
            <Hidden name="operationMinimumCost" value={0} />
            <Hidden name="operationUnitCost" value={0} />
            <Hidden name="operationLeadTime" value={0} />
          </>
        )}
      </div>

      {isInsideOperationType(processData.operationType) && (
        <OperationDetailTabs
          sections={[
            {
              id: "setup",
              label: <Trans>Setup</Trans>,
              accessibilityLabel: t`Setup`,
              icon: <TimeTypeIcon type="Setup" />,
              summary:
                (processData.setupTime ?? 0) > 0
                  ? formatOperationTabSummary(
                      processData.setupTime,
                      processData.setupUnit
                    )
                  : undefined,
              summaryTitle:
                (processData.setupTime ?? 0) > 0
                  ? `${processData.setupTime} ${processData.setupUnit}`
                  : undefined,
              content: (
                <>
                  <UnitHint
                    name="setupHint"
                    label={t`Setup`}
                    value={processData.setupUnitHint}
                    onChange={(hint) => {
                      setProcessData((d) => ({
                        ...d,
                        setupUnitHint: hint,
                        setupUnit:
                          hint === "Fixed" ? "Total Minutes" : "Minutes/Piece"
                      }));
                    }}
                  />
                  <NumberControlled
                    name="setupTime"
                    label={t`Setup Time`}
                    isOptional={false}
                    minValue={0}
                    value={processData.setupTime}
                    onChange={(newValue) =>
                      setProcessData((d) => ({
                        ...d,
                        setupTime: newValue
                      }))
                    }
                  />
                  <StandardFactor
                    name="setupUnit"
                    label={t`Setup Unit`}
                    isOptional={false}
                    hint={processData.setupUnitHint}
                    value={processData.setupUnit}
                    onChange={(newValue) => {
                      setProcessData((d) => ({
                        ...d,
                        setupUnit: newValue?.value ?? "Total Minutes"
                      }));
                    }}
                  />
                </>
              )
            },
            {
              id: "labor",
              label: <Trans>Labor</Trans>,
              accessibilityLabel: t`Labor`,
              icon: <TimeTypeIcon type="Labor" />,
              summary:
                (processData.laborTime ?? 0) > 0
                  ? formatOperationTabSummary(
                      processData.laborTime,
                      processData.laborUnit
                    )
                  : undefined,
              summaryTitle:
                (processData.laborTime ?? 0) > 0
                  ? `${processData.laborTime} ${processData.laborUnit}`
                  : undefined,
              content: (
                <>
                  <UnitHint
                    name="laborHint"
                    label={t`Labor`}
                    value={processData.laborUnitHint}
                    onChange={(hint) => {
                      setProcessData((d) => ({
                        ...d,
                        laborUnitHint: hint,
                        laborUnit:
                          hint === "Fixed" ? "Total Minutes" : "Minutes/Piece"
                      }));
                    }}
                  />
                  <NumberControlled
                    name="laborTime"
                    label={t`Labor Time`}
                    isOptional={false}
                    minValue={0}
                    value={processData.laborTime}
                    onChange={(newValue) =>
                      setProcessData((d) => ({
                        ...d,
                        laborTime: newValue
                      }))
                    }
                  />
                  <StandardFactor
                    name="laborUnit"
                    label={t`Labor Unit`}
                    isOptional={false}
                    hint={processData.laborUnitHint}
                    value={processData.laborUnit}
                    onChange={(newValue) => {
                      setProcessData((d) => ({
                        ...d,
                        laborUnit: newValue?.value ?? "Total Minutes"
                      }));
                    }}
                  />
                </>
              )
            },
            {
              id: "machine",
              label: <Trans>Machine</Trans>,
              accessibilityLabel: t`Machine`,
              icon: <TimeTypeIcon type="Machine" />,
              summary:
                (processData.machineTime ?? 0) > 0
                  ? formatOperationTabSummary(
                      processData.machineTime,
                      processData.machineUnit
                    )
                  : undefined,
              summaryTitle:
                (processData.machineTime ?? 0) > 0
                  ? `${processData.machineTime} ${processData.machineUnit}`
                  : undefined,
              content: (
                <>
                  <UnitHint
                    name="machineHint"
                    label={t`Machine`}
                    value={processData.machineUnitHint}
                    onChange={(hint) => {
                      setProcessData((d) => ({
                        ...d,
                        machineUnitHint: hint,
                        machineUnit:
                          hint === "Fixed" ? "Total Minutes" : "Minutes/Piece"
                      }));
                    }}
                  />
                  <NumberControlled
                    name="machineTime"
                    label={t`Machine Time`}
                    isOptional={false}
                    minValue={0}
                    value={processData.machineTime}
                    onChange={(newValue) =>
                      setProcessData((d) => ({
                        ...d,
                        machineTime: newValue
                      }))
                    }
                  />
                  <StandardFactor
                    name="machineUnit"
                    label={t`Machine Unit`}
                    isOptional={false}
                    hint={processData.machineUnitHint}
                    value={processData.machineUnit}
                    onChange={(newValue) => {
                      setProcessData((d) => ({
                        ...d,
                        machineUnit: newValue?.value ?? "Total Minutes"
                      }));
                    }}
                  />
                </>
              )
            },
            {
              id: "procedure",
              label: <Trans>Procedure</Trans>,
              accessibilityLabel: t`Procedure`,
              icon: <LuListChecks />,
              summary: procedureTabSummary,
              summaryTitle: procedureTabSummaryTitle,
              contentClassName:
                "grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-1 pb-4 px-4 pt-4",
              content: (
                <>
                  <Procedure
                    name="procedureId"
                    label={t`Procedure`}
                    processId={processData.processId}
                    value={processData.procedureId}
                    onChange={(value) => {
                      if (value && value.value !== item.data.procedureId) {
                        setProcedureWasChanged(true);
                      }
                      setProcessData((d) => ({
                        ...d,
                        procedureId: value?.value as string
                      }));
                    }}
                  />
                  {!temporaryItems[item.id] && processData.procedureId && (
                    <div className="flex flex-col gap-2 w-auto">
                      {procedureWasChanged && (
                        <span className="text-sm text-muted-foreground">
                          <Trans>
                            The procedure was changed, but not synced to the
                            operation.
                          </Trans>
                        </span>
                      )}
                      <div>
                        <Button
                          variant="secondary"
                          rightIcon={<LuRefreshCcw />}
                          onClick={procedureSyncDisclosure.onOpen}
                        >
                          <Trans>Sync Procedure</Trans>
                        </Button>
                        {procedureSyncDisclosure.isOpen && (
                          <ProcedureSyncModal
                            operationId={item.id}
                            procedureId={processData.procedureId}
                            onClose={procedureSyncDisclosure.onClose}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </>
              )
            }
          ]}
        />
      )}
      <motion.div
        className="flex w-full items-center justify-end p-2"
        initial={{ opacity: 0, filter: "blur(4px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{
          type: "spring",
          bounce: 0,
          duration: 0.55
        }}
      >
        <motion.div layout className="ml-auto mr-1 pt-2">
          <Submit isDisabled={isDisabled}>
            <Trans>Save</Trans>
          </Submit>
        </motion.div>
      </motion.div>
    </ValidatedForm>
  );
}

function ProcedureSyncModal({
  operationId,
  procedureId,
  onClose
}: {
  operationId: string;
  procedureId: string;
  onClose: () => void;
}) {
  const fetcher = useFetcher<{ success: boolean }>();
  useEffect(() => {
    if (fetcher.data?.success) {
      onClose();
    }
  }, [fetcher.data?.success, onClose]);

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <ModalContent>
        <ValidatedForm
          validator={procedureSyncValidator}
          action={path.to.jobOperationProcedureSync}
          method="post"
          fetcher={fetcher}
          defaultValues={{
            operationId,
            procedureId
          }}
        >
          <ModalHeader>
            <ModalTitle>
              <Trans>Are you sure?</Trans>
            </ModalTitle>
          </ModalHeader>
          <ModalBody className="py-4">
            <Hidden name="operationId" />
            <Hidden name="procedureId" />
            <Alert variant="warning">
              <LuTriangleAlert className="h-4 w-4" />
              <AlertTitle>
                <Trans>Potential Data Loss</Trans>
              </AlertTitle>
              <AlertDescription>
                <Trans>
                  Syncing the procedure will update the operation with the new
                  work instructions, steps, and parameters. Any steps that are
                  not part of the procedure will be removed.
                </Trans>
              </AlertDescription>
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={onClose}>
              <Trans>Cancel</Trans>
            </Button>
            <Submit
              isLoading={fetcher.state !== "idle"}
              isDisabled={fetcher.state !== "idle"}
            >
              <Trans>Sync</Trans>
            </Submit>
          </ModalFooter>
        </ValidatedForm>
      </ModalContent>
    </Modal>
  );
}

type PickupActivityRowProps = {
  item: UnifiedPickupItem;
  configurationParameters?: ConfigurationParameter[] | null;
};

const PickupActivityRow = ({
  item,
  configurationParameters
}: PickupActivityRowProps) => {
  const { formatDateTime } = useDateFormatter();
  const { t } = useLingui();

  const pickup = item.pickup;
  const configParts =
    configurationParameters?.length && pickup.configuration
      ? getConfigRowDisplayParts(
          pickup.configuration,
          configurationParameters,
          t`Quantities`
        )
      : [];

  const commentParts: ReactNode[] = [];
  if (configParts.length > 0) {
    commentParts.push(
      <div key="config" className="mb-1">
        <ConfigQuantityBreakdown parts={configParts} />
      </div>
    );
  }
  if (pickup.notes) {
    commentParts.push(
      <p key="notes" className="text-sm text-muted-foreground">
        {pickup.notes}
      </p>
    );
  }

  if (item.kind === "supplier") {
    const supplierId = item.pickup.supplierProcess?.supplierId;
    return (
      <div className="flex flex-col gap-1 rounded-lg border border-border/60 bg-background px-3 py-2">
        <div className="flex items-center gap-2 text-sm">
          {supplierId ? (
            <SupplierAvatar
              supplierId={supplierId}
              size="xs"
              className="font-medium"
            />
          ) : (
            <span className="font-medium">{t`Supplier`}</span>
          )}
          <span className="text-muted-foreground">
            {t`picked up ${pickup.quantity} units`}
          </span>
          {pickup.createdAt ? (
            <span className="text-xs tabular-nums text-muted-foreground">
              {formatDateTime(pickup.createdAt)}
            </span>
          ) : null}
        </div>
        {commentParts.length > 0 ? (
          <div className="flex flex-col gap-1.5">{commentParts}</div>
        ) : null}
      </div>
    );
  }

  const employeePickup = item.pickup;
  return (
    <Activity
      employeeId={employeePickup.employeeId}
      activityMessage={
        <span className="inline-flex flex-wrap items-center gap-2">
          {t`picked up ${pickup.quantity} units`}
        </span>
      }
      activityTime={pickup.createdAt}
      activityTimeDetail={
        pickup.createdAt ? formatDateTime(pickup.createdAt) : undefined
      }
      comment={
        commentParts.length > 0 ? (
          <div className="flex flex-col gap-1.5">{commentParts}</div>
        ) : undefined
      }
    />
  );
};

type ProductionEventActivityProps = {
  item: Database["public"]["Tables"]["productionEvent"]["Row"];
};

const ProductionEventActivity = ({ item }: ProductionEventActivityProps) => {
  const { formatDateTime } = useDateFormatter();
  const getActivityMessage = useProductionEventActivityMessage();
  return (
    <Activity
      employeeId={item.employeeId ?? item.createdBy}
      activityMessage={getActivityMessage(item)}
      activityTime={formatDateTime(item.startTime)}
      activityIcon={
        item.type ? (
          <TimeTypeIcon
            type={item.type}
            className={cn(
              item.type === "Labor"
                ? "text-emerald-500"
                : item.type === "Machine"
                  ? "text-blue-500"
                  : "text-yellow-500"
            )}
          />
        ) : null
      }
    />
  );
};

function ToolsListItem({
  tool: { toolId, quantity, id, updatedBy, updatedAt, createdBy, createdAt },
  operationId,
  className
}: {
  tool: OperationTool;
  operationId: string;
  className?: string;
}) {
  const { formatRelativeTime } = useDateFormatter();
  const createdUpdatedText = useRelativeCreatedUpdatedText();
  const disclosure = useDisclosure();
  const deleteModalDisclosure = useDisclosure();
  const submitted = useRef(false);
  const fetcher = useFetcher<typeof editJobOperationToolAction>();
  const { t } = useLingui();

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  useEffect(() => {
    if (submitted.current && fetcher.state === "idle") {
      disclosure.onClose();
      submitted.current = false;
    }
  }, [fetcher.state]);

  const tools = useTools();
  const tool = tools.find((t) => t.id === toolId);
  if (!tool || !id) return null;

  const isUpdated = updatedBy !== null;
  const person = isUpdated ? updatedBy : createdBy;
  const date = updatedAt ?? createdAt;

  return (
    <div className={cn("border-b p-6 bg-card", className)}>
      {disclosure.isOpen ? (
        <ValidatedForm
          action={path.to.jobOperationTool(id)}
          method="post"
          validator={operationToolValidator}
          fetcher={fetcher}
          resetAfterSubmit
          onSubmit={() => {
            disclosure.onClose();
          }}
          defaultValues={{
            id: id,
            toolId: toolId ?? "",
            quantity: quantity ?? 1,
            operationId
          }}
          className="w-full"
        >
          <Hidden name="operationId" />
          <VStack spacing={4}>
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
              <Tool name="toolId" label={t`Tool`} autoFocus />
              <Number name="quantity" label={t`Quantity`} />
            </div>
            <HStack className="w-full justify-end" spacing={2}>
              <Button variant="secondary" onClick={disclosure.onClose}>
                <Trans>Cancel</Trans>
              </Button>
              <Submit
                isDisabled={fetcher.state !== "idle"}
                isLoading={fetcher.state !== "idle"}
              >
                <Trans>Save</Trans>
              </Submit>
            </HStack>
          </VStack>
        </ValidatedForm>
      ) : (
        <div className="flex flex-1 justify-between items-center w-full">
          <HStack spacing={4} className="w-1/2">
            <HStack spacing={4} className="flex-1">
              <div className="bg-muted border rounded-full flex items-center justify-center p-2">
                <LuHammer className="size-4" />
              </div>
              <VStack spacing={0}>
                <span className="text-sm font-medium">
                  {tool.readableIdWithRevision}
                </span>
                <span className="text-xs text-muted-foreground">
                  {tool.name}
                </span>
              </VStack>
              <span className="text-base text-muted-foreground text-right">
                {quantity}
              </span>
            </HStack>
          </HStack>
          <div className="flex items-center justify-end gap-2">
            <HStack spacing={2}>
              <span className="text-xs text-muted-foreground">
                {createdUpdatedText(isUpdated, formatRelativeTime(date))}
              </span>
              <EmployeeAvatar employeeId={person} withName={false} />
            </HStack>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton
                  aria-label={t`Open menu`}
                  icon={<LuEllipsisVertical />}
                  variant="ghost"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={disclosure.onOpen}>
                  <Trans>Edit</Trans>
                </DropdownMenuItem>
                <DropdownMenuItem
                  destructive
                  onClick={deleteModalDisclosure.onOpen}
                >
                  <Trans>Delete</Trans>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
      {deleteModalDisclosure.isOpen && (
        <ConfirmDelete
          action={path.to.deleteJobOperationTool(id)}
          isOpen={deleteModalDisclosure.isOpen}
          name={tool.readableIdWithRevision}
          text={t`Are you sure you want to delete ${tool.readableIdWithRevision} from this operation? This cannot be undone.`}
          onCancel={() => {
            deleteModalDisclosure.onClose();
          }}
          onSubmit={() => {
            deleteModalDisclosure.onClose();
          }}
        />
      )}
    </div>
  );
}

function ToolsForm({
  operationId,
  isDisabled,
  tools,
  temporaryItems
}: {
  operationId: string;
  isDisabled: boolean;
  tools: OperationTool[];
  temporaryItems: TemporaryItems;
}) {
  const fetcher = useFetcher<typeof newJobOperationToolAction>();
  const { t } = useLingui();

  if (isDisabled && temporaryItems[operationId]) {
    return (
      <Alert className="max-w-[420px] mx-auto my-8">
        <LuTriangleAlert />
        <AlertTitle>
          <Trans>Cannot add tools to unsaved operation</Trans>
        </AlertTitle>
        <AlertDescription>
          <Trans>Please save the operation before adding tools.</Trans>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="p-6 border rounded-lg bg-card">
        <ValidatedForm
          action={path.to.newJobOperationTool}
          method="post"
          validator={operationToolValidator}
          fetcher={fetcher}
          resetAfterSubmit
          defaultValues={{
            id: undefined,
            toolId: "",
            quantity: 1,
            operationId
          }}
          className="w-full"
        >
          <Hidden name="operationId" />
          <VStack spacing={4}>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <Tool name="toolId" label={t`Tool`} autoFocus />
              <Number name="quantity" label={t`Quantity`} />
            </div>

            <Submit
              leftIcon={<LuCirclePlus />}
              isDisabled={isDisabled || fetcher.state !== "idle"}
              isLoading={fetcher.state !== "idle"}
            >
              <Trans>Save Tool</Trans>
            </Submit>
          </VStack>
        </ValidatedForm>
      </div>

      {tools.length > 0 && (
        <div className="border rounded-lg">
          {[...tools]
            .sort((a, b) =>
              String(a.id ?? "").localeCompare(String(b.id ?? ""))
            )
            .map((t, index) => (
              <ToolsListItem
                key={t.id}
                tool={t}
                operationId={operationId}
                className={index === tools.length - 1 ? "border-none" : ""}
              />
            ))}
        </div>
      )}
    </div>
  );
}

type Message = {
  id: string;
  createdBy: string;
  createdAt: string;
  note: string;
};

function OperationChat({ jobOperationId }: { jobOperationId: string }) {
  const user = useUser();
  const [employees] = usePeople();
  const [messages, setMessages] = useState<Message[]>([]);
  const { t } = useLingui();
  const { locale } = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
  const { carbon, accessToken } = useCarbon();

  const fetchChat = async () => {
    if (!carbon) return;
    flushSync(() => {
      setIsLoading(true);
    });

    const { data, error } = await carbon
      ?.from("jobOperationNote")
      .select("*")
      .eq("jobOperationId", jobOperationId)
      .order("createdAt", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }
    setMessages(data);
    setIsLoading(false);
  };

  useMount(() => {
    fetchChat();
  });

  useRealtimeChannel({
    topic: `job-operation-notes-${jobOperationId}`,
    setup(channel) {
      return channel.on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "jobOperationNote",
          filter: `jobOperationId=eq.${jobOperationId}`
        },
        (payload) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === payload.new.id)) {
              return prev;
            }
            return [...prev, payload.new as Message];
          });
        }
      );
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      block: "nearest",
      inline: "start",
      behavior: messages.length > 0 ? "smooth" : "auto"
    });
  }, [messages]);

  const [message, setMessage] = useState("");

  const notify = useDebounce(
    async () => {
      if (!carbon) return;

      const response = await fetch(path.to.api.messagingNotify, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "jobOperationNote",
          operationId: jobOperationId
        }),
        credentials: "include" // This is sufficient for CORS with cookies
      });

      if (!response.ok) {
        console.error("Failed to notify user");
      }
    },
    5000,
    true
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message.trim()) return;

    const newMessage = {
      id: nanoid(),
      jobOperationId,
      createdBy: user.id,
      note: message,
      createdAt: new Date().toISOString(),
      companyId: user.company.id
    };

    flushSync(() => {
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    });

    await Promise.all([
      carbon?.from("jobOperationNote").insert(newMessage),
      notify()
    ]);
  };

  return (
    <div className="flex flex-col h-[50dvh]">
      <ScrollArea className="flex-1 p-4">
        <Loading isLoading={isLoading}>
          <div className="flex flex-col gap-3">
            {messages.length === 0 ? (
              <div className="flex justify-center pt-16">
                <Empty />
              </div>
            ) : (
              messages.map((m) => {
                const createdBy = employees.find(
                  (employee) => employee.id === m.createdBy
                );
                const isUser = m.createdBy === user.id;
                return (
                  <div
                    key={m.id}
                    className={cn(
                      "flex gap-2 items-end",
                      isUser && "flex-row-reverse"
                    )}
                  >
                    <Avatar
                      src={createdBy?.avatarUrl ?? undefined}
                      name={createdBy?.name}
                    />

                    <div className="flex flex-col gap-1 max-w-[80%] ">
                      <div className="flex flex-col gap-1">
                        {!isUser && (
                          <span className="text-xs opacity-70">
                            {createdBy?.name}
                          </span>
                        )}
                        <div
                          className={cn(
                            "rounded-2xl p-3 w-full flex flex-col gap-1",
                            isUser ? "bg-blue-500 text-white" : "bg-muted"
                          )}
                        >
                          <p className="text-sm">{m.note}</p>

                          <span className="text-xs opacity-70">
                            {new Date(m.createdAt).toLocaleTimeString(locale, {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} style={{ height: 0 }} />
          </div>
        </Loading>
      </ScrollArea>

      <div>
        <form className="flex gap-2" onSubmit={handleSubmit}>
          <InputField
            className="flex-1"
            placeholder={t`Type a message...`}
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            className="h-10"
            aria-label={t`Send`}
            type="submit"
            leftIcon={<LuSend />}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
