import { ValidatedForm } from "@carbon/form";
import {
  Badge,
  Button,
  cn,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  HStack,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useMemo, useRef, useState } from "react";
import type { z } from "zod";
import { Hidden, Number, Select, Submit, TextArea } from "~/components/Form";
import ScrapReason from "~/components/Form/ScrapReason";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import { usePermissions } from "~/hooks";
import type { ProductionQuantityLineInput } from "~/modules/production/productionQuantityReport.models";
import { path } from "~/utils/path";
import type { productionActorKinds } from "../../production.models";
import {
  productionQuantityCreateFormValidator,
  productionQuantityValidator
} from "../../production.models";
import {
  buildProductionVariantsQuantityReferenceContext,
  type VariantsQuantityReferenceSource
} from "../../variantsQuantityTableColumns";
import {
  computeConfigRemaining,
  computeVariantTableTotal
} from "../../variantTable";
import {
  ProductionActorFields,
  selectionFromInitialValues
} from "./ProductionActorFields";
import {
  type EditableProductionQuantityLine,
  getConfigFromEditableLine,
  normalizeUniqueLineTypes,
  ProductionQuantityLinesEditor
} from "./ProductionQuantityLinesEditor";
import { getProductionFormCascadeState } from "./productionFormCascade";
import { QuantityWithVariantsQuantity } from "./QuantityWithVariantsQuantity";
import { SupplierSubcontractPricingFields } from "./SupplierSubcontractPricingFields";
import { useProductionJobPicker } from "./useProductionJobPicker";
import {
  toVariantsQuantityValue,
  useVariantsQuantityModal
} from "./VariantsQuantityModal";

type VariantsQuantityRow = Record<string, string | number | boolean>;

function getInitialConfigState(configuration: unknown) {
  if (
    configuration === null ||
    configuration === undefined ||
    typeof configuration !== "object" ||
    Array.isArray(configuration)
  ) {
    return {
      rows: null as VariantsQuantityRow[] | null,
      total: 0
    };
  }

  const cfg = configuration as Record<string, unknown>;
  const rows = Array.isArray(cfg.variantTable)
    ? (cfg.variantTable as VariantsQuantityRow[])
    : null;

  return {
    rows,
    total: computeVariantTableTotal(cfg)
  };
}

type ConfigurationParameter = {
  key: string;
  label: string;
  dataType: string;
  listOptions?: string[] | null;
};

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
  // Remaining quantity per operation — used to prefill the Production line when
  // an operation is selected.
  remainingByOperationId?: Record<string, number>;
  variantQuantityParameters?: ConfigurationParameter[] | null;
  variantsQuantityReferenceSource?: VariantsQuantityReferenceSource | null;
  itemId?: string | null;
  jobId?: string | null;
  processId?: string | null;
  operationType?: string | null;
  defaultActorKind?: "employee" | "supplier";
  lockJobSelection?: boolean;
  lockActorSelection?: boolean;
  /** When true, operation is shown but not editable (e.g. BOP overlay with preset operation). */
  lockOperationSelection?: boolean;
} & Pick<OverlayFormInjectedProps, "onDismiss" | "fetcher" | "action">;

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
  operationOptions = [],
  jobOptions,
  remainingByOperationId,
  variantQuantityParameters,
  variantsQuantityReferenceSource,
  itemId,
  jobId: jobIdProp,
  processId,
  operationType,
  defaultActorKind,
  lockJobSelection: lockJobSelectionProp = false,
  lockActorSelection: lockActorSelectionProp,
  lockOperationSelection: lockOperationSelectionProp = false,
  onDismiss,
  action: formAction,
  fetcher
}: ProductionQuantityFormProps) => {
  const permissions = usePermissions();
  const { t } = useLingui();
  const hasJobPicker = Boolean(jobOptions?.length);

  const jobPicker = useProductionJobPicker({
    enabled: hasJobPicker,
    loaderPath: path.to.newProductionQuantity,
    jobIdProp,
    operationOptions,
    variantQuantityParameters,
    variantsQuantityReferenceSource,
    itemId,
    processId,
    operationType,
    defaultActorKind,
    lockActorSelection: lockActorSelectionProp
  });

  const selectedJobId = hasJobPicker
    ? jobPicker.selectedJobId
    : (jobIdProp?.trim() ?? "");
  const jobId = selectedJobId || jobIdProp?.trim() || undefined;
  const seededFormJobId = jobIdProp?.trim() || "";

  const isEditing = Boolean(
    "id" in initialValues &&
      initialValues.id != null &&
      String(initialValues.id).trim() !== ""
  );
  const isCreateMultiLine =
    !isEditing && isCreateMultiLineInitial(initialValues);

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
    ? {
        rows: null as VariantsQuantityRow[] | null,
        total: 0
      }
    : getInitialConfigState(
        (initialValues as z.infer<typeof productionQuantityValidator>)
          .configuration
      );

  const [variantsQuantityRows, setVariantsQuantityRows] = useState<
    VariantsQuantityRow[] | null
  >(initialConfig.rows);
  const [variantsQuantityTotal, setVariantsQuantityTotal] = useState(
    initialConfig.total
  );
  const formBodyRef = useRef<HTMLDivElement>(null);

  const [lines, setLines] = useState<EditableProductionQuantityLine[]>(() => {
    if (!isCreateMultiLineInitial(initialValues)) return [];
    const editable = normalizeUniqueLineTypes(
      toEditableLines(
        (initialValues as ProductionQuantityCreateInitialValues).lines
      )
    );

    // For a variant-configured item, seed the Production line with the
    // remaining plan per cell (instead of only a bare prefilled quantity with an
    // empty config). This makes the report valid out of the box — Save is
    // enabled and the config table is prefilled/editable — rather than showing a
    // filled quantity next to a disabled Save. Falls through (empty config,
    // Save gated by hasUnconfiguredLine) when there's no plan to seed from.
    if (
      !variantQuantityParameters?.length ||
      !variantsQuantityReferenceSource
    ) {
      return editable;
    }
    const remaining = computeConfigRemaining(
      variantsQuantityReferenceSource.jobVariantTable as Parameters<
        typeof computeConfigRemaining
      >[0],
      variantsQuantityReferenceSource.reportedConfigurations as Parameters<
        typeof computeConfigRemaining
      >[1]
    );
    if (remaining.variantTable.length === 0) return editable;
    const remainingTotal = computeVariantTableTotal(remaining);
    return editable.map((line) =>
      line.type === "Production" && !getConfigFromEditableLine(line)
        ? { ...line, configuration: remaining, quantity: remainingTotal }
        : line
    );
  });

  const hasVariantsQuantity =
    (jobPicker.variantQuantityParameters?.length ?? 0) > 0;

  const hasZeroQuantityLine =
    isCreateMultiLine && lines.some((line) => line.quantity <= 0);

  // A variant-configured report must enter its quantity through the config
  // table. The line seeds a prefilled quantity (the operation's remaining) with
  // an empty configuration, so `hasZeroQuantityLine` alone wouldn't catch it —
  // block submit until every line carries a non-empty configuration, otherwise
  // the prefilled quantity would post with configuration = NULL.
  const hasUnconfiguredLine =
    isCreateMultiLine &&
    hasVariantsQuantity &&
    lines.some(
      (line) => computeVariantTableTotal(getConfigFromEditableLine(line)) <= 0
    );

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
    if (isCreateMultiLineInitial(initialValues)) {
      return (initialValues as ProductionQuantityCreateInitialValues)
        .jobOperationId;
    }
    return (
      (initialValues as z.infer<typeof productionQuantityValidator>)
        .jobOperationId ?? ""
    );
  });
  const [operationSelectKey, setOperationSelectKey] = useState(0);

  const resetQuantityEntry = (initialQuantity = 0) => {
    if (isCreateMultiLine) {
      setLines(
        normalizeUniqueLineTypes(
          toEditableLines([
            { type: "Production" as const, quantity: initialQuantity }
          ])
        )
      );
      return;
    }
    setQuantity(initialQuantity);
    setVariantsQuantityRows(null);
    setVariantsQuantityTotal(0);
  };

  useEffect(() => {
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
  }, []);

  const handleVariantsQuantitySubmit = (
    rows: VariantsQuantityRow[],
    total: number
  ) => {
    setVariantsQuantityRows(rows);
    setVariantsQuantityTotal(total);
    if (total > 0) {
      setQuantity(total);
    }
  };

  const variantsQuantityModal = useVariantsQuantityModal();

  const openVariantsQuantity = () => {
    if (!jobPicker.itemId) return;
    variantsQuantityModal.open({
      itemId: jobPicker.itemId,
      configuration: toVariantsQuantityValue(
        variantsQuantityRows,
        (initialValues as z.infer<typeof productionQuantityValidator>)
          .configuration
      ),
      jobId: jobId ?? undefined,
      jobOperationId: jobOperationIdState || undefined,
      reportKind: "productionQuantity",
      splitMode: true,
      isEditingReport: isEditing,
      buildReferenceContext: (source) =>
        buildProductionVariantsQuantityReferenceContext({
          source: source ?? undefined,
          employeeId: actorKind === "employee" ? employeeId : undefined
        }),
      onConfirm: (data) =>
        handleVariantsQuantitySubmit(
          data.configuration.variantTable,
          data.total
        )
    });
  };

  const createDefaultValues = useMemo(() => {
    if (!isCreateMultiLine) return undefined;
    const init = initialValues as ProductionQuantityCreateInitialValues;
    const operationId = jobOperationIdState || init.jobOperationId || "";
    return {
      ...(hasJobPicker && seededFormJobId ? { jobId: seededFormJobId } : {}),
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
    seededFormJobId,
    jobOperationIdState
  ]);

  const editDefaultValues = useMemo(() => {
    if (isCreateMultiLine) return undefined;
    const values = initialValues as z.infer<
      typeof productionQuantityValidator
    > & {
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
    const values = initialValues as z.infer<
      typeof productionQuantityValidator
    > & {
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

  const resetActorEntry = () => {
    if (lockActorSelectionProp) return;
    setEmployeeId("");
    setSupplierProcessId("");
    setActorKind(
      (defaultActorKind ?? "employee") as (typeof productionActorKinds)[number]
    );
  };

  const handleJobChange = (value: string) => {
    queueMicrotask(() => {
      jobPicker.setSelectedJobId(value);
      setJobOperationIdState("");
      setOperationSelectKey((key) => key + 1);
      resetQuantityEntry();
      resetActorEntry();
    });
  };

  const isOperationPresetAndLocked =
    lockOperationSelectionProp &&
    Boolean(initialValues.jobOperationId) &&
    !isEditing;
  const effectiveJobOperationId = isOperationPresetAndLocked
    ? initialValues.jobOperationId
    : jobOperationIdState;

  // The job-level cascade only resolves the seeded operation's processId, so
  // resolve the picked operation's process from the per-operation map to keep
  // the actor list filtered to that process's assigned employees/suppliers.
  const selectedProcessId =
    (effectiveJobOperationId
      ? jobPicker.processByOperationId?.[effectiveJobOperationId]
      : undefined) ??
    jobPicker.processId ??
    null;

  const {
    hasJobSelected,
    hasOperationSelected,
    areDetailFieldsDisabled,
    canSubmitDetails
  } = getProductionFormCascadeState({
    isEditing,
    hasJobPicker,
    selectedJobId,
    jobOperationId: effectiveJobOperationId,
    actorSelection,
    permissionDisabled: isDisabled
  });
  const canSubmitCreate =
    canSubmitDetails && !hasZeroQuantityLine && !hasUnconfiguredLine;

  // Configured reports (e.g. master cutting) enter their quantity through the
  // variants-quantity modal, and opening it only needs the job/item + operation —
  // not an actor. So surface the config quantity field + its modal trigger as
  // soon as the operation is picked, instead of waiting for an employee to be
  // selected (submitting still requires one). Plain-quantity reports keep the
  // stricter `areDetailFieldsDisabled` gate.
  const configFieldsDisabled =
    isDisabled || !hasJobSelected || !hasOperationSelected;

  // Plain-quantity reports (bundles / non-configured items) show the operation's
  // remaining (target − reported) and can't exceed it. Configured reports are
  // handled per variant combo by the config editor instead.
  // NOTE: `Number` is shadowed by the imported `<Number>` form field, so we use
  // globals here (`Infinity`, unary `+`) — calling `Number(...)` would hit the
  // component and throw "Number is not a function".
  const operationRemaining =
    remainingByOperationId?.[effectiveJobOperationId] ?? Infinity;
  const reportedTotal = isCreateMultiLine
    ? lines.reduce((sum, line) => sum + (+line.quantity || 0), 0)
    : +quantity || 0;
  const showRemaining =
    !isEditing && !hasVariantsQuantity && operationRemaining !== Infinity;
  const remaining = operationRemaining - reportedTotal;
  const exceedsRemaining = showRemaining && remaining < 0;

  const lockActorSelection =
    isEditing ||
    Boolean(jobPicker.lockActorSelection || lockActorSelectionProp) ||
    Boolean(
      (actorFieldValues.employeeId ?? "").trim() ||
        (actorFieldValues.supplierProcessId ?? "").trim()
    );

  return (
    <>
      <ValidatedForm
        validator={
          isCreateMultiLine
            ? productionQuantityCreateFormValidator
            : productionQuantityValidator
        }
        method="post"
        defaultValues={
          isCreateMultiLine ? createDefaultValues : editDefaultValues
        }
        className="flex h-full flex-col"
        action={formAction}
        fetcher={fetcher}
      >
        <DrawerHeader>
          <DrawerTitle>
            {isEditing ? (
              <Trans>Edit Process Completion</Trans>
            ) : (
              <Trans>Create Process Completion</Trans>
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
                key={
                  hasJobPicker ? `op-${operationSelectKey}` : "job-operation"
                }
                name="jobOperationId"
                label={t`Operation`}
                options={jobPicker.operationOptions}
                isDisabled={
                  lockOperationSelectionProp ||
                  (hasJobPicker && !hasJobSelected) ||
                  jobPicker.isCascadeLoading
                }
                onChange={(value) => {
                  if (lockOperationSelectionProp) return;
                  const nextOperationId = value?.value ?? "";
                  setJobOperationIdState(nextOperationId);
                  resetQuantityEntry(
                    remainingByOperationId?.[nextOperationId] ?? 0
                  );
                }}
              />
            )}
            <ProductionActorFields
              processId={selectedProcessId}
              operationType={jobPicker.operationType}
              defaultActorKind={jobPicker.defaultActorKind}
              lockActorSelection={lockActorSelection}
              isDisabled={!hasOperationSelected}
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
                  variantQuantityParameters={
                    jobPicker.variantQuantityParameters
                  }
                  variantsQuantityReferenceSource={
                    jobPicker.variantsQuantityReferenceSource
                  }
                  itemId={jobPicker.itemId}
                  // Configured reports enter their quantity through the config
                  // table, which only needs the job/item + operation — so let it
                  // open before an actor is picked. Plain-quantity reports keep
                  // the stricter gate (need an actor before entering anything).
                  isDisabled={
                    hasVariantsQuantity
                      ? configFieldsDisabled
                      : areDetailFieldsDisabled
                  }
                  employeeId={actorKind === "employee" ? employeeId : undefined}
                  jobId={jobId ?? undefined}
                  jobOperationId={jobOperationIdState || undefined}
                />
              </>
            ) : (
              <>
                {variantsQuantityRows && (
                  <Hidden
                    name="configuration"
                    value={JSON.stringify({
                      variantTable: variantsQuantityRows
                    })}
                  />
                )}
                {hasVariantsQuantity ? (
                  <QuantityWithVariantsQuantity
                    name="quantity"
                    label={t`Quantity`}
                    value={quantity}
                    minValue={0}
                    isDisabled={configFieldsDisabled}
                    isReadOnly={variantsQuantityTotal > 0}
                    variantsQuantityTotal={variantsQuantityTotal}
                    hasVariantsQuantity
                    onOpenVariantsQuantity={
                      configFieldsDisabled ? undefined : openVariantsQuantity
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
              isDisabled={hasVariantsQuantity ? areDetailFieldsDisabled : false}
            />
          </VStack>
        </DrawerBody>
        <DrawerFooter>
          <HStack className="w-full justify-between">
            {showRemaining ? (
              <HStack spacing={2}>
                <span className="text-sm text-muted-foreground">
                  <Trans>Remaining</Trans>:{" "}
                  <strong
                    className={cn(
                      "tabular-nums",
                      remaining < 0 ? "text-red-500" : "text-foreground"
                    )}
                  >
                    {remaining}
                  </strong>
                </span>
                {remaining < 0 ? (
                  <Badge variant="red">
                    <Trans>Exceeds plan</Trans>
                  </Badge>
                ) : null}
              </HStack>
            ) : (
              <span />
            )}
            <HStack className="gap-2">
              <Submit
                isDisabled={
                  isDisabled ||
                  exceedsRemaining ||
                  (isCreateMultiLine
                    ? hasVariantsQuantity
                      ? !canSubmitCreate
                      : !hasOperationSelected || hasZeroQuantityLine
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
          </HStack>
        </DrawerFooter>
      </ValidatedForm>
      {variantsQuantityModal.node}
    </>
  );
};

export default ProductionQuantityForm;
