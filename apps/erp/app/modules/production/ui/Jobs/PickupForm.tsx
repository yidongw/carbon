import { ValidatedForm } from "@carbon/form";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  HStack,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import type { z } from "zod";
import { Hidden, Number, Select, Submit, TextArea } from "~/components/Form";
import { ProductionActorFields, selectionFromInitialValues } from "./ProductionActorFields";
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
  supplierId?: string;
  onDismiss?: () => void;
  action?: string;
  fetcher?: import("react-router").FetcherWithComponents<unknown>;
};

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
  supplierId,
  onDismiss: onDismissProp,
  action: formAction,
  fetcher
}: PickupFormProps) => {
  const permissions = usePermissions();
  const { t } = useLingui();
  const navigate = useNavigate();
  const { jobId: jobIdFromParams } = useParams();
  const [searchParams] = useSearchParams();
  const hasJobPicker = Boolean(jobOptions?.length);
  const selectedJobId = hasJobPicker
    ? (searchParams.get("jobId") ?? jobIdProp?.trim() ?? "")
    : jobIdProp ?? jobIdFromParams ?? "";
  const jobId = selectedJobId || jobIdFromParams;
  const isOverlay = fetcher != null;
  const onDismiss =
    onDismissProp ??
    (() => {
      if (jobId) {
        navigate(path.to.jobPickups(jobId));
        return;
      }
      navigate(-1);
    });

  const initialConfig = getInitialConfigState(initialValues.configuration);

  const [quantity, setQuantity] = useState(initialValues.quantity ?? 0);
  const [configTableRows, setConfigTableRows] = useState<ConfigRow[] | null>(
    initialConfig.rows
  );
  const [configTablePrimaryKeys, setConfigTablePrimaryKeys] = useState<
    string[]
  >(initialConfig.primaryKeys);
  const [configTableTotal, setConfigTableTotal] = useState(initialConfig.total);

  const hasConfigurationParameters = (configurationParameters?.length ?? 0) > 0;

  const isEditing = initialValues.id !== undefined;
  const presetJobOperationIdOnCreate =
    !isEditing && Boolean(initialValues.jobOperationId);
  const isDisabled = isEditing
    ? !permissions.can("update", "production")
    : !permissions.can("create", "production");

  // Track operation selection for submit validation
  const [selectedOperation, setSelectedOperation] = useState(
    initialValues.jobOperationId || ""
  );

  const updateSearchParams = (updates: {
    jobId?: string | null;
    jobOperationId?: string | null;
  }) => {
    const newParams = new URLSearchParams(searchParams);
    if (updates.jobId !== undefined) {
      if (updates.jobId) {
        newParams.set("jobId", updates.jobId);
      } else {
        newParams.delete("jobId");
      }
    }
    if (updates.jobOperationId !== undefined) {
      if (updates.jobOperationId) {
        newParams.set("jobOperationId", updates.jobOperationId);
      } else {
        newParams.delete("jobOperationId");
      }
    }
    navigate(
      {
        search: newParams.toString()
      },
      { replace: true }
    );
  };

  const handleJobChange = (value: string) => {
    updateSearchParams({ jobId: value, jobOperationId: null });
  };

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
    if (!itemId) return;
    configModal.open({
      itemId,
      configuration: toConfigTableValue(
        configTableRows,
        configTablePrimaryKeys,
        initialValues.configuration
      ),
      jobId: jobId ?? undefined,
      jobOperationId: selectedOperation || undefined,
      reportKind: "pickup",
      buildReferenceContext: (source) =>
        source
          ? buildJobRemainingReferenceContext(source, {
              excludeConfigurations: isEditing
                ? [initialValues.configuration]
                : undefined
            })
          : undefined,
      onConfirm: (data) =>
        handleConfigTableSubmit(
          data.configuration.configTable,
          data.total,
          data.primaryKeys
        )
    });
  };

  const lockActorSelection = isEditing || Boolean(lockActorSelectionProp);

  const form = (
    <ValidatedForm
      validator={jobOperationPickupValidator}
      method="post"
      defaultValues={initialValues}
      className="flex flex-col h-full"
      action={formAction}
      fetcher={fetcher}
    >
      <DrawerHeader>
        <DrawerTitle>
          {isEditing ? (
            <Trans>Edit Process Pickup</Trans>
          ) : (
            <Trans>Process Pickup</Trans>
          )}
        </DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <Hidden name="id" />
        <VStack spacing={4}>
          {jobOptions && !isEditing ? (
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
          {isEditing ? (
            <Hidden name="jobOperationId" />
          ) : (
            <Select
              key={hasJobPicker ? selectedJobId || "no-job" : "job-operation"}
              name="jobOperationId"
              label={t`Operation`}
              options={operationOptions ?? []}
              isDisabled={
                presetJobOperationIdOnCreate ||
                (hasJobPicker && !selectedJobId)
              }
              onChange={(newValue) => {
                setSelectedOperation(newValue?.value ?? "");
              }}
            />
          )}
          <ProductionActorFields
            processId={processId}
            operationType={operationType}
            defaultActorKind={defaultActorKind}
            lockActorSelection={lockActorSelection}
            employeeIdValue={initialValues.employeeId}
            supplierProcessIdValue={initialValues.supplierProcessId}
            supplierIdValue={supplierId}
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
            isDisabled={isDisabled || quantity === 0 || !selectedOperation}
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
  );

  if (isOverlay) {
    return (
      <>
        {form}
        {configModal.node}
      </>
    );
  }

  return (
    <>
      <Drawer
        open
        onOpenChange={(open) => {
          if (!open) onDismiss();
        }}
      >
        <DrawerContent>{form}</DrawerContent>
      </Drawer>
      {configModal.node}
    </>
  );
};

export default PickupForm;
