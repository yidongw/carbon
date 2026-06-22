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
import { useEffect, useMemo, useRef, useState } from "react";
import {
  type FetcherWithComponents,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
} from "react-router";
import type { z } from "zod";
import { Hidden, Number, Select, Submit, TextArea } from "~/components/Form";
import {
  ProductionActorFields,
  selectionFromInitialValues
} from "./ProductionActorFields";
import { SupplierSubcontractPricingFields } from "./SupplierSubcontractPricingFields";
import type { productionActorKinds } from "../../production.models";
import ScrapReason from "~/components/Form/ScrapReason";
import { overlay, useOverlay } from "~/components/Overlay";
import { usePermissions } from "~/hooks";
import { isConfigTableOverlaySuccess } from "../../configTableOverlay";
import {
  buildProductionConfigTableReferenceContext,
  type ConfigReferenceSource
} from "../../configParamsTableColumns";
import type { ProductionQuantityLineInput } from "~/modules/production/productionQuantityReport.models";
import { preventDismissOnPortaledContent } from "~/utils/dom";
import { path } from "~/utils/path";
import { computeJobConfigTableTotal } from "../../jobConfiguration";
import {
  productionQuantityCreateFormValidator,
  productionQuantityValidator
} from "../../production.models";
import { QuantityWithConfigTable } from "./QuantityWithConfigTable";
import {
  type EditableProductionQuantityLine,
  normalizeUniqueLineTypes,
  ProductionQuantityLinesEditor
} from "./ProductionQuantityLinesEditor";
import { getProductionFormCascadeState } from "./productionFormCascade";

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
    ? cfg.configTablePrimaryKeys.filter((k): k is string => typeof k === "string")
    : [];

  return {
    rows,
    primaryKeys,
    total: computeJobConfigTableTotal(cfg)
  };
}

type ConfigurationParameter = {
  key: string;
  label: string;
  dataType: string;
  listOptions?: string[] | null;
};

function parseJobIdFromQuantitiesUrl(url?: string | null) {
  if (!url) return undefined;
  const match = url.match(/\/job\/([^/]+)\/quantities\/(?:new|[^/?]+)/);
  return match?.[1];
}

export type ProductionQuantityCreateInitialValues = {
  jobOperationId: string;
  actorKind?: "employee" | "supplier";
  employeeId?: string;
  supplierProcessId?: string;
  /** Display-only: resolves supplier Name label before process options load. */
  supplierId?: string;
  notes?: string;
  lines: ProductionQuantityLineInput[];
};

export type ProductionQuantityFormProps = {
  initialValues:
    | z.infer<typeof productionQuantityValidator>
    | ProductionQuantityCreateInitialValues;
  operationOptions?: {
    label: string;
    value: string;
    helperText?: string;
  }[];
  jobOptions?: { label: string; value: string }[];
  configurationParameters?: ConfigurationParameter[] | null;
  configReferenceSource?: ConfigReferenceSource | null;
  itemId?: string | null;
  jobId?: string | null;
  processId?: string | null;
  operationType?: string | null;
  defaultActorKind?: "employee" | "supplier";
  lockJobSelection?: boolean;
  lockActorSelection?: boolean;
  /** When true, operation is shown but not editable (e.g. BOP overlay with preset operation). */
  lockOperationSelection?: boolean;
  onDismiss?: () => void;
  action?: string;
  fetcher?: FetcherWithComponents<unknown>;
};

function toEditableLines(
  input: ProductionQuantityLineInput[]
): EditableProductionQuantityLine[] {
  return input.map((l, i) => ({
    ...l,
    key: `line-${i}-${Math.random().toString(36).slice(2, 9)}`
  }));
}

function isCreateMultiLineInitial(
  v: ProductionQuantityFormProps["initialValues"]
): v is ProductionQuantityCreateInitialValues {
  return (
    !("id" in v && v.id) &&
    "lines" in v &&
    Array.isArray((v as ProductionQuantityCreateInitialValues).lines)
  );
}

const ProductionQuantityForm = ({
  initialValues,
  operationOptions,
  jobOptions,
  configurationParameters,
  configReferenceSource,
  itemId,
  jobId: jobIdProp,
  processId,
  operationType,
  defaultActorKind,
  lockJobSelection: lockJobSelectionProp = false,
  lockActorSelection: lockActorSelectionProp,
  lockOperationSelection: lockOperationSelectionProp = false,
  onDismiss: onDismissProp,
  action: formAction,
  fetcher
}: ProductionQuantityFormProps) => {
  const permissions = usePermissions();
  const { t } = useLingui();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { jobId: jobIdFromParams } = useParams();
  const hasJobPicker = Boolean(jobOptions?.length);
  const selectedJobId = hasJobPicker
    ? (searchParams.get("jobId") ?? jobIdProp?.trim() ?? "")
    : "";
  const jobId = hasJobPicker
    ? selectedJobId || undefined
    : jobIdProp?.trim() ||
      parseJobIdFromQuantitiesUrl(formAction) ||
      jobIdFromParams?.trim() ||
      undefined;
  const isOverlay = fetcher != null;
  const onDismiss =
    onDismissProp ??
    (() => {
      if (jobId) {
        navigate(path.to.jobProductionQuantities(jobId));
        return;
      }
      navigate(-1);
    });

  const isEditing = Boolean(
    "id" in initialValues &&
      initialValues.id != null &&
      String(initialValues.id).trim() !== ""
  );
  const isCreateMultiLine = !isEditing && isCreateMultiLineInitial(initialValues);

  const isDisabled = isEditing
    ? !permissions.can("update", "production")
    : !permissions.can("create", "production");

  const [type, setType] = useState<"Production" | "Scrap" | "Rework">(
    isCreateMultiLine
      ? "Production"
      : (initialValues as z.infer<typeof productionQuantityValidator>).type
  );
  const [quantity, setQuantity] = useState(
    isCreateMultiLine
      ? 0
      : ((initialValues as z.infer<typeof productionQuantityValidator>)
          .quantity ?? 0)
  );
  const initialConfig = isCreateMultiLine
    ? { rows: null as ConfigRow[] | null, primaryKeys: [] as string[], total: 0 }
    : getInitialConfigState(
        (initialValues as z.infer<typeof productionQuantityValidator>)
          .configuration
      );

  const [configTableRows, setConfigTableRows] = useState<ConfigRow[] | null>(
    initialConfig.rows
  );
  const [configTablePrimaryKeys, setConfigTablePrimaryKeys] = useState<string[]>(
    initialConfig.primaryKeys
  );
  const [configTableTotal, setConfigTableTotal] = useState(initialConfig.total);
  const { openOverlay } = useOverlay();
  const formBodyRef = useRef<HTMLDivElement>(null);

  const [lines, setLines] = useState<EditableProductionQuantityLine[]>(() => {
    if (isCreateMultiLineInitial(initialValues)) {
      return normalizeUniqueLineTypes(
        toEditableLines(
          (initialValues as ProductionQuantityCreateInitialValues).lines
        )
      );
    }
    return [];
  });

  const hasConfigurationParameters =
    (configurationParameters?.length ?? 0) > 0;

  const hasZeroQuantityLine =
    isCreateMultiLine && lines.some((line) => line.quantity <= 0);

  const linesJsonForForm = useMemo(() => {
    if (!isCreateMultiLine) return "";
    return JSON.stringify(
      lines.map(({ key: _k, ...line }) => ({
        ...line,
        scrapReasonId: line.type === "Scrap" ? line.scrapReasonId : undefined
      }))
    );
  }, [isCreateMultiLine, lines]);

  const [jobOperationIdState, setJobOperationIdState] = useState(() => {
    // Check initialValues first (for overlays), then URL params (for routes)
    let initial: string;
    if (isCreateMultiLineInitial(initialValues)) {
      initial = (initialValues as ProductionQuantityCreateInitialValues)
        .jobOperationId;
    } else {
      initial = (
        (initialValues as z.infer<typeof productionQuantityValidator>)
          .jobOperationId ?? ""
      );
    }
    // URL params override initialValues (for route navigation)
    const fromUrl = searchParams.get("jobOperationId") ?? "";
    return fromUrl || initial;
  });

  useEffect(() => {
    if (isEditing) return;
    setJobOperationIdState(searchParams.get("jobOperationId") ?? "");
  }, [isEditing, searchParams]);

  useEffect(() => {
    if (!isOverlay) return;

    const focusFirstField = () => {
      const root = formBodyRef.current;
      if (!root) return;

      const combobox = root.querySelector<HTMLElement>(
        'button[role="combobox"]:not([disabled])'
      );
      if (combobox) {
        combobox.focus();
        return;
      }

      root
        .querySelector<HTMLElement>(
          'input:not([type="hidden"]):not([disabled])'
        )
        ?.focus();
    };

    const frame = requestAnimationFrame(focusFirstField);
    return () => cancelAnimationFrame(frame);
  }, [isOverlay]);

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

  const openConfigTable = () => {
    if (!itemId) return;

    const referenceContext = buildProductionConfigTableReferenceContext({
      source: configReferenceSource,
      employeeId: actorKind === "employee" ? employeeId : undefined,
      jobId: jobId ?? undefined,
      jobOperationId: jobOperationIdState || undefined
    });

    openOverlay(
      overlay.to.itemConfigTable(itemId, {
        configuration:
          configTableRows && configTablePrimaryKeys.length > 0
            ? {
                configTable: configTableRows,
                configTablePrimaryKeys
              }
            : (initialValues as z.infer<typeof productionQuantityValidator>)
                .configuration,
        referenceContext
      }),
      {
        onSuccess: (data) => {
          if (!isConfigTableOverlaySuccess(data)) return;
          handleConfigTableSubmit(
            data.configuration.configTable,
            data.total,
            data.primaryKeys
          );
        }
      }
    );
  };

  const createDefaultValues = useMemo(() => {
    if (!isCreateMultiLine) return undefined;
    const init = initialValues as ProductionQuantityCreateInitialValues;
    const operationId = jobOperationIdState || init.jobOperationId || "";
    return {
      ...(hasJobPicker && selectedJobId ? { jobId: selectedJobId } : {}),
      ...(operationId ? { jobOperationId: operationId } : {}),
      notes: init.notes ?? "",
      lines: JSON.stringify(
        normalizeUniqueLineTypes(toEditableLines(init.lines)).map(
          ({ key: _k, ...l }) => l
        )
      )
    };
  }, [
    isCreateMultiLine,
    initialValues,
    hasJobPicker,
    selectedJobId,
    jobOperationIdState
  ]);

  const editDefaultValues = useMemo(() => {
    if (isCreateMultiLine) return undefined;
    const values = initialValues as z.infer<typeof productionQuantityValidator> & {
      actorKind?: "employee" | "supplier";
      supplierProcessId?: string;
      supplierId?: string;
    };
    const {
      actorKind: _ak,
      employeeId: _eid,
      supplierProcessId: _spid,
      supplierId: _sid,
      ...rest
    } = values;
    return {
      ...rest,
      productionActorSelection: selectionFromInitialValues({
        employeeId: values.employeeId,
        supplierProcessId: values.supplierProcessId
      })
    };
  }, [isCreateMultiLine, initialValues]);

  const actorFieldValues = useMemo(() => {
    if (isCreateMultiLine) {
      const init = initialValues as ProductionQuantityCreateInitialValues;
      return {
        employeeId: init.employeeId,
        supplierProcessId: init.supplierProcessId,
        actorKind: init.actorKind ?? defaultActorKind
      };
    }
    const values = initialValues as z.infer<typeof productionQuantityValidator> & {
      actorKind?: "employee" | "supplier";
      supplierProcessId?: string;
      supplierId?: string;
    };
    return {
      employeeId: values.employeeId,
      supplierProcessId: values.supplierProcessId,
      supplierId: values.supplierId,
      actorKind: values.actorKind ?? defaultActorKind
    };
  }, [isCreateMultiLine, initialValues, defaultActorKind]);

  const [actorKind, setActorKind] = useState<
    (typeof productionActorKinds)[number]
  >(
    () =>
      (actorFieldValues.actorKind ??
        defaultActorKind ??
        "employee") as (typeof productionActorKinds)[number]
  );
  const [employeeId, setEmployeeId] = useState(
    () => actorFieldValues.employeeId ?? ""
  );
  const [supplierProcessId, setSupplierProcessId] = useState(
    () => actorFieldValues.supplierProcessId ?? ""
  );

  useEffect(() => {
    setEmployeeId(actorFieldValues.employeeId ?? "");
    setSupplierProcessId(actorFieldValues.supplierProcessId ?? "");
    if (actorFieldValues.actorKind) {
      setActorKind(actorFieldValues.actorKind);
    }
  }, [
    actorFieldValues.actorKind,
    actorFieldValues.employeeId,
    actorFieldValues.supplierProcessId
  ]);

  const actorSelection = useMemo(
    () =>
      selectionFromInitialValues({
        employeeId,
        supplierProcessId
      }),
    [employeeId, supplierProcessId]
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

    const search = newParams.toString();
    navigate(
      {
        pathname: location.pathname,
        search: search ? `?${search}` : ""
      },
      { replace: true }
    );
  };

  const handleJobChange = (value: string) => {
    updateSearchParams({ jobId: value, jobOperationId: null });
  };

  const handleOperationChange = (value: string) => {
    updateSearchParams({ jobOperationId: value });
  };

  const {
    hasJobSelected,
    hasOperationSelected,
    hasActorSelected,
    areDetailFieldsDisabled,
    canSubmitDetails
  } = getProductionFormCascadeState({
    isEditing,
    hasJobPicker,
    selectedJobId,
    jobOperationId: jobOperationIdState,
    actorSelection,
    permissionDisabled: isDisabled
  });
  const canSubmitCreate = canSubmitDetails && !hasZeroQuantityLine;

  const lockActorSelection =
    lockActorSelectionProp ??
    (isEditing ||
      Boolean(
        (actorFieldValues.employeeId ?? "").trim() ||
          (actorFieldValues.supplierProcessId ?? "").trim()
      ));

  const form = (
    <ValidatedForm
      key={hasJobPicker ? selectedJobId || "no-job" : undefined}
      validator={
        isCreateMultiLine
          ? productionQuantityCreateFormValidator
          : productionQuantityValidator
      }
      method="post"
      defaultValues={isCreateMultiLine ? createDefaultValues : editDefaultValues}
      className="flex h-full flex-col"
      action={formAction}
      fetcher={fetcher}
    >
      <DrawerHeader>
        <DrawerTitle>
          {isEditing ? (
            <Trans>Edit Production Quantity</Trans>
          ) : (
            <Trans>Create Production Quantity</Trans>
          )}
        </DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        {isEditing ? <Hidden name="id" /> : null}
        <VStack ref={formBodyRef} spacing={4}>
          {hasJobPicker && !isEditing ? (
            <Select
              name="jobId"
              label={t`Job`}
              options={jobOptions ?? []}
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
                lockOperationSelectionProp ||
                (hasJobPicker && !hasJobSelected)
              }
              onChange={(value) => {
                if (lockOperationSelectionProp) return;
                const next = value?.value ?? "";
                setJobOperationIdState(next);
                if (next) {
                  handleOperationChange(next);
                }
              }}
            />
          )}
          <ProductionActorFields
            processId={processId}
            operationType={operationType}
            defaultActorKind={defaultActorKind}
            lockActorSelection={lockActorSelection}
            isDisabled={hasConfigurationParameters ? !hasOperationSelected : false}
            employeeIdValue={actorFieldValues.employeeId}
            supplierProcessIdValue={actorFieldValues.supplierProcessId}
            supplierIdValue={actorFieldValues.supplierId}
            onActorKindChange={setActorKind}
            onEmployeeChange={setEmployeeId}
            onSupplierProcessChange={setSupplierProcessId}
          />

          {isCreateMultiLine &&
          actorKind === "supplier" &&
          jobOperationIdState &&
          supplierProcessId ? (
            <SupplierSubcontractPricingFields
              jobOperationId={jobOperationIdState}
              supplierProcessId={supplierProcessId}
              isDisabled={areDetailFieldsDisabled}
            />
          ) : null}

          {isCreateMultiLine ? (
            <>
              <Hidden name="lines" value={linesJsonForForm} />
              <ProductionQuantityLinesEditor
                lines={lines}
                setLines={setLines}
                configurationParameters={configurationParameters}
                configReferenceSource={configReferenceSource}
                itemId={itemId}
                isDisabled={areDetailFieldsDisabled}
                employeeId={actorKind === "employee" ? employeeId : undefined}
                jobId={jobId ?? undefined}
                jobOperationId={jobOperationIdState || undefined}
              />
            </>
          ) : (
            <>
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
                  isDisabled={areDetailFieldsDisabled}
                  isReadOnly={configTableTotal > 0}
                  configTableTotal={configTableTotal}
                  hasConfigurationParameters
                  onOpenConfigTable={
                    hasActorSelected ? openConfigTable : undefined
                  }
                  onChange={setQuantity}
                />
              ) : (
                <Number
                  name="quantity"
                  label={t`Quantity`}
                  isDisabled={areDetailFieldsDisabled}
                />
              )}
              <Select
                name="type"
                label={t`Quantity Type`}
                options={[
                  { label: "Production", value: "Production" },
                  { label: "Scrap", value: "Scrap" },
                  { label: "Rework", value: "Rework" }
                ]}
                onChange={(value) =>
                  setType(value?.value as "Production" | "Scrap" | "Rework")
                }
              />
              {type === "Scrap" && (
                <ScrapReason name="scrapReasonId" label={t`Scrap Reason`} />
              )}
            </>
          )}

          <TextArea
            name="notes"
            label={t`Notes`}
            isDisabled={hasConfigurationParameters ? areDetailFieldsDisabled : false}
          />
        </VStack>
      </DrawerBody>
      <DrawerFooter>
        <HStack>
          <Submit
            isDisabled={
              isDisabled ||
              (isCreateMultiLine
                ? hasConfigurationParameters
                  ? !canSubmitCreate
                  : hasZeroQuantityLine
                : hasZeroQuantityLine)
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
  );

  if (isOverlay) {
    return form;
  }

  return (
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) onDismiss();
      }}
    >
      <DrawerContent
        onPointerDownOutside={preventDismissOnPortaledContent}
        onInteractOutside={preventDismissOnPortaledContent}
      >
        {form}
      </DrawerContent>
    </Drawer>
  );
};

export default ProductionQuantityForm;
