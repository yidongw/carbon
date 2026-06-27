import { ValidatedForm } from "@carbon/form";
import {
  Button,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  HStack,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useMemo, useState } from "react";
import type { z } from "zod";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import { Hidden, Number, Select, Submit, TextArea } from "~/components/Form";
import { ProductionActorFields } from "./ProductionActorFields";
import type { productionActorKinds } from "../../production.models";
import { usePermissions } from "~/hooks";
import {
  buildJobRemainingReferenceContext,
  type ConfigReferenceSource
} from "../../configParamsTableColumns";
import {
  toConfigTableValue,
  useConfigTableModal
} from "./ConfigParamsTableModal";
import { jobOperationPickupValidator } from "~/modules/production/production.models";
import { path } from "~/utils/path";
import { computeJobConfigTableTotal } from "../../jobConfiguration";
import { QuantityWithConfigTable } from "./QuantityWithConfigTable";
import { useProductionJobPicker } from "./useProductionJobPicker";

type ConfigurationParameter = {
  key: string;
  label: string;
  dataType: string;
  listOptions?: string[] | null;
};

type ConfigRow = Record<string, string | number | boolean>;

function getInitialConfigState(configuration: unknown) {
  if (
    configuration === null ||
    configuration === undefined ||
    typeof configuration !== "object" ||
    Array.isArray(configuration)
  ) {
    return {
      rows: null as ConfigRow[] | null,
      primaryKeys: [] as string[],
      total: 0
    };
  }

  const cfg = configuration as Record<string, unknown>;
  const rows = Array.isArray(cfg.configTable)
    ? (cfg.configTable as ConfigRow[])
    : null;
  const primaryKeys = Array.isArray(cfg.configTablePrimaryKeys)
    ? cfg.configTablePrimaryKeys.filter(
        (k): k is string => typeof k === "string"
      )
    : [];

  return {
    rows,
    primaryKeys,
    total: computeJobConfigTableTotal(cfg)
  };
}

export type PickupFormProps = {
  initialValues: z.infer<typeof jobOperationPickupValidator>;
  jobOptions?: { label: string; value: string }[];
  jobId?: string | null;
  operationOptions?: { label: string; value: string }[];
  configurationParameters?: ConfigurationParameter[] | null;
  configReferenceSource?: ConfigReferenceSource | null;
  itemId?: string | null;
  processId?: string | null;
  operationType?: string | null;
  defaultActorKind?: "employee" | "supplier";
  lockJobSelection?: boolean;
  lockActorSelection?: boolean;
  /** When true, operation is shown but not editable (e.g. BOP overlay with preset operation). */
  lockOperationSelection?: boolean;
  supplierId?: string;
} & Pick<OverlayFormInjectedProps, "onDismiss" | "fetcher" | "action">;

const PickupForm = ({
  initialValues,
  jobOptions,
  jobId: jobIdProp,
  operationOptions,
  configurationParameters,
  configReferenceSource,
  itemId,
  processId,
  operationType,
  defaultActorKind,
  lockJobSelection: lockJobSelectionProp,
  lockActorSelection: lockActorSelectionProp,
  lockOperationSelection: lockOperationSelectionProp = false,
  supplierId,
  onDismiss,
  action: formAction,
  fetcher
}: PickupFormProps) => {
  const permissions = usePermissions();
  const { t } = useLingui();
  const hasJobPicker = Boolean(jobOptions?.length);

  const jobPicker = useProductionJobPicker({
    enabled: hasJobPicker,
    loaderPath: path.to.newPickup,
    jobIdProp,
    initialJobId: initialValues.jobId,
    operationOptions,
    configurationParameters,
    configReferenceSource,
    itemId,
    processId,
    operationType,
    defaultActorKind,
    lockActorSelection: lockActorSelectionProp,
    supplierId
  });

  const selectedJobId = hasJobPicker
    ? jobPicker.selectedJobId
    : jobIdProp?.trim() ?? "";
  const jobId = selectedJobId || jobIdProp?.trim() || undefined;

  const initialConfig = getInitialConfigState(initialValues.configuration);

  const [quantity, setQuantity] = useState(initialValues.quantity ?? 0);
  const [configTableRows, setConfigTableRows] = useState<ConfigRow[] | null>(
    initialConfig.rows
  );
  const [configTablePrimaryKeys, setConfigTablePrimaryKeys] = useState<
    string[]
  >(initialConfig.primaryKeys);
  const [configTableTotal, setConfigTableTotal] = useState(initialConfig.total);

  const hasConfigurationParameters =
    (jobPicker.configurationParameters?.length ?? 0) > 0;

  const isDisabled = !permissions.can("create", "production");

  const [selectedOperation, setSelectedOperation] = useState(
    initialValues.jobOperationId || ""
  );
  const [operationSelectKey, setOperationSelectKey] = useState(0);
  const seededFormJobId = jobIdProp?.trim() || initialValues.jobId?.trim() || "";

  const [actorKind, setActorKind] = useState<
    (typeof productionActorKinds)[number]
  >(
    () =>
      (initialValues.actorKind ??
        defaultActorKind ??
        "employee") as (typeof productionActorKinds)[number]
  );
  const [employeeId, setEmployeeId] = useState(
    () => initialValues.employeeId ?? ""
  );
  const [supplierProcessId, setSupplierProcessId] = useState(
    () => initialValues.supplierProcessId ?? ""
  );

  const resetActorEntry = () => {
    if (lockActorSelectionProp) return;
    setEmployeeId("");
    setSupplierProcessId("");
    setActorKind(
      (defaultActorKind ?? "employee") as (typeof productionActorKinds)[number]
    );
  };

  const resetQuantityEntry = () => {
    setQuantity(0);
    setConfigTableRows(null);
    setConfigTablePrimaryKeys([]);
    setConfigTableTotal(0);
  };

  const handleJobChange = (value: string) => {
    queueMicrotask(() => {
      jobPicker.setSelectedJobId(value);
      setSelectedOperation("");
      setOperationSelectKey((key) => key + 1);
      resetQuantityEntry();
      resetActorEntry();
    });
  };

  const isOperationPresetAndLocked =
    lockOperationSelectionProp && Boolean(initialValues.jobOperationId);
  const effectiveOperationId = isOperationPresetAndLocked
    ? initialValues.jobOperationId
    : selectedOperation;

  const handleConfigTableSubmit = (
    rows: ConfigRow[],
    total: number,
    primaryKeys: string[]
  ) => {
    setConfigTableRows(rows);
    setConfigTablePrimaryKeys(primaryKeys);
    setConfigTableTotal(total);
    if (total > 0) {
      setQuantity(total);
    }
  };

  const configModal = useConfigTableModal();

  const openConfigTable = () => {
    if (!jobPicker.itemId) return;
    configModal.open({
      itemId: jobPicker.itemId,
      configuration: toConfigTableValue(
        configTableRows,
        configTablePrimaryKeys,
        initialValues.configuration
      ),
      jobId: jobId ?? undefined,
      jobOperationId: effectiveOperationId || undefined,
      reportKind: "pickup",
      buildReferenceContext: (source) =>
        source ? buildJobRemainingReferenceContext(source) : undefined,
      onConfirm: (data) =>
        handleConfigTableSubmit(
          data.configuration.configTable,
          data.total,
          data.primaryKeys
        )
    });
  };

  const lockActorSelection = Boolean(
    jobPicker.lockActorSelection || lockActorSelectionProp
  );

  const formDefaultValues = useMemo(
    () => ({
      ...initialValues,
      ...(seededFormJobId ? { jobId: seededFormJobId } : {}),
      jobOperationId: effectiveOperationId || initialValues.jobOperationId || ""
    }),
    [initialValues, seededFormJobId, effectiveOperationId]
  );

  return (
    <>
      <ValidatedForm
        validator={jobOperationPickupValidator}
        method="post"
        defaultValues={formDefaultValues}
        className="flex flex-col h-full"
        action={formAction}
        fetcher={fetcher}
      >
        <DrawerHeader>
          <DrawerTitle>
            <Trans>Process Pickup</Trans>
          </DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <VStack spacing={4}>
            {jobOptions ? (
              <Select
                name="jobId"
                label={t`Job`}
                options={jobOptions}
                isDisabled={lockJobSelectionProp}
                onChange={(newValue) => {
                  if (newValue?.value) handleJobChange(newValue.value);
                }}
              />
            ) : null}
            <Select
              key={hasJobPicker ? `op-${operationSelectKey}` : "job-operation"}
              name="jobOperationId"
              label={t`Operation`}
              options={jobPicker.operationOptions}
              isDisabled={
                lockOperationSelectionProp ||
                (hasJobPicker && !selectedJobId) ||
                jobPicker.isCascadeLoading
              }
              onChange={(newValue) => {
                if (lockOperationSelectionProp) return;
                setSelectedOperation(newValue?.value ?? "");
                resetQuantityEntry();
              }}
            />
            <ProductionActorFields
              processId={jobPicker.processId}
              operationType={jobPicker.operationType}
              defaultActorKind={jobPicker.defaultActorKind}
              lockActorSelection={lockActorSelection}
              employeeIdValue={employeeId}
              supplierProcessIdValue={supplierProcessId}
              supplierIdValue={jobPicker.supplierId}
              onActorKindChange={setActorKind}
              onEmployeeChange={setEmployeeId}
              onSupplierProcessChange={setSupplierProcessId}
            />
            {configTableRows && (
              <Hidden
                name="configuration"
                value={JSON.stringify({
                  configTable: configTableRows,
                  configTablePrimaryKeys
                })}
              />
            )}
            {hasConfigurationParameters ? (
              <QuantityWithConfigTable
                name="quantity"
                label={t`Quantity`}
                value={quantity}
                minValue={0}
                isDisabled={isDisabled}
                isReadOnly={configTableTotal > 0}
                configTableTotal={configTableTotal}
                hasConfigurationParameters
                onOpenConfigTable={openConfigTable}
                onChange={setQuantity}
              />
            ) : (
              <Number
                name="quantity"
                label={t`Quantity`}
                minValue={0}
                onChange={(value) => setQuantity(value)}
              />
            )}
            <TextArea name="notes" label={t`Notes`} />
          </VStack>
        </DrawerBody>
        <DrawerFooter>
          <HStack>
            <Submit
              isDisabled={
                isDisabled || quantity === 0 || !effectiveOperationId
              }
              className="transition-transform active:scale-[0.96]"
            >
              <Trans>Save</Trans>
            </Submit>
            <Button
              variant="solid"
              type="button"
              onClick={onDismiss}
              className="transition-transform active:scale-[0.96]"
            >
              <Trans>Cancel</Trans>
            </Button>
          </HStack>
        </DrawerFooter>
      </ValidatedForm>
      {configModal.node}
    </>
  );
};

export default PickupForm;
