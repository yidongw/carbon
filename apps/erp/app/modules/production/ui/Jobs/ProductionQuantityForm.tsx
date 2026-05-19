import { ValidatedForm } from "@carbon/form";
import {
  Button,
  cn,
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
import { useEffect, useRef, useState } from "react";
import { LuTable } from "react-icons/lu";
import {
  type FetcherWithComponents,
  useNavigate,
  useParams
} from "react-router";
import type { z } from "zod";
import {
  Employee,
  Hidden,
  Number,
  Select,
  Submit,
  TextArea
} from "~/components/Form";
import ScrapReason from "~/components/Form/ScrapReason";
import { overlay, useOverlay } from "~/components/Overlay";
import { usePermissions } from "~/hooks";
import { isConfigTableOverlaySuccess } from "../../configTableOverlay";
import type { ConfigurationParameter } from "~/modules/items/types";
import { path } from "~/utils/path";
import { computeJobConfigTableTotal } from "../../jobConfiguration";
import { productionQuantityValidator } from "../../production.models";
import { QuantityWithConfigTable } from "./QuantityWithConfigTable";

type ConfigRow = Record<string, string | number | boolean>;

function getInitialConfigState(configuration: unknown) {
  if (
    configuration === null ||
    configuration === undefined ||
    typeof configuration !== "object" ||
    Array.isArray(configuration)
  ) {
    return { rows: null as ConfigRow[] | null, primaryKeys: [] as string[], total: 0 };
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

export type ProductionQuantityFormProps = {
  initialValues: z.infer<typeof productionQuantityValidator>;
  operationOptions?: {
    label: string;
    value: string;
    helperText?: string;
  }[];
  configurationParameters?: ConfigurationParameter[] | null;
  itemId?: string | null;
  onDismiss?: () => void;
  action?: string;
  fetcher?: FetcherWithComponents<unknown>;
};

const ProductionQuantityForm = ({
  initialValues,
  operationOptions,
  configurationParameters,
  itemId,
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

  const initialConfig = getInitialConfigState(initialValues.configuration);

  const [type, setType] = useState<"Production" | "Scrap" | "Rework">(
    initialValues.type
  );
  const [quantity, setQuantity] = useState(initialValues.quantity ?? 0);
  const [configTableRows, setConfigTableRows] = useState<ConfigRow[] | null>(
    initialConfig.rows
  );
  const [configTablePrimaryKeys, setConfigTablePrimaryKeys] = useState<string[]>(
    initialConfig.primaryKeys
  );
  const [configTableTotal, setConfigTableTotal] = useState(initialConfig.total);
  const { openOverlay } = useOverlay();
  const formBodyRef = useRef<HTMLDivElement>(null);

  const hasConfigurationParameters =
    (configurationParameters?.length ?? 0) > 0;

  const isEditing = initialValues.id !== undefined;
  const presetJobOperationIdOnCreate =
    !isEditing && Boolean(initialValues.jobOperationId);
  const isDisabled = isEditing
    ? !permissions.can("update", "production")
    : !permissions.can("create", "production");

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
            : initialValues.configuration
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

  const getQuantityAdornment = () =>
    hasConfigurationParameters ? (
      <div
        className={cn(
          "absolute right-0 top-0 z-10 m-px flex h-[calc(100%-2px)] w-10 items-center justify-center border-l border-border rounded-r-md pointer-events-none transition-colors",
          configTableTotal > 0
            ? "text-emerald-500"
            : "text-muted-foreground"
        )}
        aria-hidden
      >
        <LuTable size="1em" strokeWidth="3" />
      </div>
    ) : undefined;

  const form = (
    <ValidatedForm
      validator={productionQuantityValidator}
      method="post"
      defaultValues={initialValues}
      className="flex flex-col h-full"
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
        <Hidden name="id" />
        <VStack ref={formBodyRef} spacing={4}>
          {isEditing || presetJobOperationIdOnCreate ? (
            <Hidden name="jobOperationId" />
          ) : (
            <Select
              name="jobOperationId"
              label={t`Operation`}
              options={operationOptions ?? []}
            />
          )}
          <Employee name="createdBy" label={t`Employee`} />
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
              adornment={getQuantityAdornment()}
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
          <TextArea name="notes" label={t`Notes`} />
        </VStack>
      </DrawerBody>
      <DrawerFooter>
        <HStack>
          <Submit isDisabled={isDisabled}>
            <Trans>Save</Trans>
          </Submit>
          <Button variant="solid" type="button" onClick={onDismiss}>
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
