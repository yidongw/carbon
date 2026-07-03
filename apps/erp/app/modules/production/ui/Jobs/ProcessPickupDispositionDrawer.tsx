import type { Database } from "@carbon/database";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Label,
  toast,
  useDisclosure,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { useFetcher } from "react-router";
import { ConfirmDelete } from "~/components/Modals";
import { path } from "~/utils/path";
import {
  buildJobRemainingReferenceContext,
  type ConfigReferenceSource
} from "../../configParamsTableColumns";
import { computeJobConfigTableTotal } from "../../jobConfiguration";
import {
  toConfigTableValue,
  useConfigTableModal
} from "./ConfigParamsTableModal";
import { ItemConfigQuantityInput } from "./ItemConfigQuantityInput";

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

type EmployeePickup =
  Database["public"]["Tables"]["jobOperationPickup"]["Row"] & {
    employee?: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      avatarUrl: string | null;
    } | null;
  };

export function ProcessPickupDispositionDrawer({
  pickup,
  open,
  onClose,
  onSaved,
  onDeleted,
  canDelete,
  configurationParameters,
  itemId,
  jobId
}: {
  pickup: EmployeePickup;
  open: boolean;
  onClose: () => void;
  onSaved: (
    quantity: number,
    notes: string | null,
    configuration?: unknown
  ) => void;
  onDeleted?: () => void;
  canDelete?: boolean;
  configurationParameters?: ConfigurationParameter[] | null;
  itemId?: string | null;
  jobId?: string;
}) {
  const { t } = useLingui();
  const deleteModal = useDisclosure();
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const [quantity, setQuantity] = useState(Number(pickup.quantity));
  const [notes, setNotes] = useState(pickup.notes ?? "");

  const initialConfig = getInitialConfigState(pickup.configuration);
  const [configTableRows, setConfigTableRows] = useState<ConfigRow[] | null>(
    initialConfig.rows
  );
  const [configTablePrimaryKeys, setConfigTablePrimaryKeys] = useState<
    string[]
  >(initialConfig.primaryKeys);
  const [configTableTotal, setConfigTableTotal] = useState(initialConfig.total);

  const hasConfigurationParameters = (configurationParameters?.length ?? 0) > 0;

  const configModal = useConfigTableModal();

  useEffect(() => {
    if (!open) return;
    setQuantity(Number(pickup.quantity));
    setNotes(pickup.notes ?? "");
    const cfg = getInitialConfigState(pickup.configuration);
    setConfigTableRows(cfg.rows);
    setConfigTablePrimaryKeys(cfg.primaryKeys);
    setConfigTableTotal(cfg.total);
  }, [open, pickup]);

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if (fetcher.data.error) {
      toast.error(fetcher.data.error);
      return;
    }
    if (fetcher.data.ok) {
      toast.success(t`Process pickup updated`);
      const configuration = configTableRows
        ? { configTable: configTableRows, configTablePrimaryKeys }
        : undefined;
      onSaved(quantity, notes || null, configuration);
      onClose();
    }
  }, [
    fetcher.state,
    fetcher.data,
    onSaved,
    onClose,
    t,
    quantity,
    notes,
    configTableRows,
    configTablePrimaryKeys
  ]);

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
    configModal.open({
      itemId,
      configuration: toConfigTableValue(
        configTableRows,
        configTablePrimaryKeys,
        pickup.configuration
      ),
      jobId,
      jobOperationId: pickup.jobOperationId,
      reportKind: "pickup",
      buildReferenceContext: (source: ConfigReferenceSource | null) =>
        source ? buildJobRemainingReferenceContext(source) : undefined,
      onConfirm: (data) =>
        handleConfigTableSubmit(
          data.configuration.configTable,
          data.total,
          data.primaryKeys
        )
    });
  };

  const save = () => {
    if (quantity <= 0) {
      toast.error(t`Quantity must be greater than zero`);
      return;
    }

    const configuration = configTableRows
      ? { configTable: configTableRows, configTablePrimaryKeys }
      : undefined;

    fetcher.submit(
      JSON.stringify({
        quantity,
        notes: notes || undefined,
        ...(configuration ? { configuration } : {})
      }),
      {
        method: "PATCH",
        action: path.to.api.pickupUpdate(pickup.id),
        encType: "application/json"
      }
    );
  };

  const isSaving = fetcher.state !== "idle";

  return (
    <>
      <Drawer
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen && !deleteModal.isOpen) onClose();
        }}
      >
        <DrawerContent className="flex w-full max-w-lg flex-col sm:max-w-lg">
          <DrawerHeader>
            <DrawerTitle>
              <Trans>Process Pickup</Trans>
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="flex w-full min-w-0 flex-col items-stretch gap-4">
            <VStack className="w-full gap-1">
              <Label>{t`Quantity`}</Label>
              <ItemConfigQuantityInput
                id="edit-pickup-quantity"
                value={quantity}
                onChange={setQuantity}
                minValue={1}
                hasConfigurationParameters={hasConfigurationParameters}
                onOpenConfigTable={
                  hasConfigurationParameters ? openConfigTable : undefined
                }
                configTableTotal={configTableTotal}
                isReadOnly={configTableTotal > 0}
              />
            </VStack>
            <VStack className="w-full gap-1">
              <Label>{t`Notes`}</Label>
              <textarea
                className="min-h-[4rem] w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            {canDelete ? (
              <Button
                type="button"
                variant="destructive"
                leftIcon={<LuTrash2 />}
                onClick={deleteModal.onOpen}
                isDisabled={isSaving}
                className="sm:mr-auto"
              >
                <Trans>Delete</Trans>
              </Button>
            ) : null}
            <Button type="button" variant="secondary" onClick={onClose}>
              <Trans>Cancel</Trans>
            </Button>
            <Button
              type="button"
              onClick={save}
              isLoading={isSaving}
              isDisabled={quantity <= 0}
            >
              <Trans>Save</Trans>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {configModal.node}
      {canDelete && deleteModal.isOpen ? (
        <ConfirmDelete
          action={path.to.deleteJobPickup(pickup.id)}
          isOpen
          name={t`this process pickup`}
          text={t`Are you sure you want to delete this process pickup? This action cannot be undone.`}
          onCancel={deleteModal.onClose}
          onSubmit={() => {
            deleteModal.onClose();
            onDeleted?.();
            onClose();
          }}
        />
      ) : null}
    </>
  );
}
