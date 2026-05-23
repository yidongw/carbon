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
  useNavigate,
  useParams
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
import type { ProductionQuantityLineInput } from "~/modules/production/productionQuantityReport.models";
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
  configurationParameters?: ConfigurationParameter[] | null;
  itemId?: string | null;
  processId?: string | null;
  operationType?: string | null;
  defaultActorKind?: "employee" | "supplier";
  lockActorSelection?: boolean;
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
  configurationParameters,
  itemId,
  processId,
  operationType,
  defaultActorKind,
  lockActorSelection: lockActorSelectionProp,
  onDismiss: onDismissProp,
  action: formAction,
  fetcher
}: ProductionQuantityFormProps) => {
  const permissions = usePermissions();
  const { t } = useLingui();
  const navigate = useNavigate();
  const { jobId } = useParams();
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

  const presetJobOperationIdOnCreate =
    !isEditing && Boolean(initialValues.jobOperationId);
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

    openOverlay(
      overlay.to.itemConfigTable(itemId, {
        configuration:
          configTableRows && configTablePrimaryKeys.length > 0
            ? {
                configTable: configTableRows,
                configTablePrimaryKeys
              }
            : (initialValues as z.infer<typeof productionQuantityValidator>)
                .configuration
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
    return {
      jobOperationId: init.jobOperationId,
      notes: init.notes ?? "",
      lines: JSON.stringify(
        normalizeUniqueLineTypes(toEditableLines(init.lines)).map(
          ({ key: _k, ...l }) => l
        )
      )
    };
  }, [isCreateMultiLine, initialValues]);

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
  const [supplierProcessId, setSupplierProcessId] = useState(
    () => actorFieldValues.supplierProcessId ?? ""
  );
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

  const lockActorSelection =
    lockActorSelectionProp ??
    (isEditing ||
      Boolean(
        (actorFieldValues.employeeId ?? "").trim() ||
          (actorFieldValues.supplierProcessId ?? "").trim()
      ));

  const form = (
    <ValidatedForm
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
          {isEditing || presetJobOperationIdOnCreate ? (
            <Hidden name="jobOperationId" />
          ) : (
            <Select
              name="jobOperationId"
              label={t`Operation`}
              options={operationOptions ?? []}
              onChange={(value) => {
                setJobOperationIdState(value?.value ?? "");
              }}
            />
          )}
          <ProductionActorFields
            processId={processId}
            operationType={operationType}
            defaultActorKind={defaultActorKind}
            lockActorSelection={lockActorSelection}
            employeeIdValue={actorFieldValues.employeeId}
            supplierProcessIdValue={actorFieldValues.supplierProcessId}
            supplierIdValue={actorFieldValues.supplierId}
            onActorKindChange={setActorKind}
            onSupplierProcessChange={setSupplierProcessId}
          />

          {isCreateMultiLine &&
          actorKind === "supplier" &&
          jobOperationIdState &&
          supplierProcessId ? (
            <SupplierSubcontractPricingFields
              jobOperationId={jobOperationIdState}
              supplierProcessId={supplierProcessId}
              isDisabled={isDisabled}
            />
          ) : null}

          {isCreateMultiLine ? (
            <>
              <Hidden name="lines" value={linesJsonForForm} />
              <ProductionQuantityLinesEditor
                lines={lines}
                setLines={setLines}
                configurationParameters={configurationParameters}
                itemId={itemId}
                isDisabled={isDisabled}
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
                  isDisabled={isDisabled || configTableTotal > 0}
                  configTableTotal={configTableTotal}
                  hasConfigurationParameters
                  onOpenConfigTable={openConfigTable}
                  onChange={setQuantity}
                />
              ) : (
                <Number name="quantity" label={t`Quantity`} />
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

          <TextArea name="notes" label={t`Notes`} />
        </VStack>
      </DrawerBody>
      <DrawerFooter>
        <HStack>
          <Submit
            isDisabled={isDisabled || hasZeroQuantityLine}
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
      <DrawerContent>{form}</DrawerContent>
    </Drawer>
  );
};

export default ProductionQuantityForm;
