import { ValidatedForm } from "@carbon/form";
import {
  Button,
  IconButton,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useMemo, useRef, useState } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { useFetcher } from "react-router";
import {
  Customer,
  CustomerLocation,
  Hidden,
  Location,
  Submit,
  Supplier,
  SupplierLocation
} from "~/components/Form";
import { useConfigurableItems } from "~/components/Form/Item";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import { newTransferValidator } from "~/modules/inventory";
import { path } from "~/utils/path";
import { StyleLineQuantityInput } from "../StyleLineQuantityInput";

export type TransferItem = {
  id: string;
  readableId: string;
  name: string;
  quantityOnHand: number;
  unitOfMeasureCode: string;
  itemTrackingType: string;
  type?: string;
};

type StockRow = {
  storageUnitId: string | null;
  storageUnitName: string | null;
  trackedEntityId: string | null;
  readableId: string | null;
  quantity: number;
  color?: string | null;
  size?: string | null;
};

// A serial variant group (bin + color + size) with its candidate units.
type SerialGroup = {
  key: string;
  storageUnitId: string | null;
  storageUnitName: string | null;
  color: string | null;
  size: string | null;
  serialIds: string[];
};

const serialGroupKey = (r: StockRow) =>
  `${r.storageUnitId ?? ""}::${r.color ?? ""}::${r.size ?? ""}`;

const groupSerials = (rows: StockRow[]): SerialGroup[] => {
  const groups = new Map<string, SerialGroup>();
  for (const r of rows) {
    if (!r.trackedEntityId) continue;
    const key = serialGroupKey(r);
    const g = groups.get(key) ?? {
      key,
      storageUnitId: r.storageUnitId,
      storageUnitName: r.storageUnitName,
      color: r.color ?? null,
      size: r.size ?? null,
      serialIds: []
    };
    g.serialIds.push(r.trackedEntityId);
    groups.set(key, g);
  }
  return [...groups.values()];
};

type StorageUnitOption = { id: string; name: string };

type ToType = "warehouse" | "customer" | "supplier";

type Line = {
  key: string;
  itemId: string;
  // Identifies the chosen source stock row (bin + serial/lot).
  sourceKey: string;
  fromStorageUnitId: string;
  // The exact serial/lot picked (batch/single) so it carries + reserves.
  trackedEntityId: string;
  // For serial items: the specific units auto-assigned from the chosen variant
  // group (length = quantity). One transfer line is emitted per serial.
  trackedEntityIds: string[];
  toStorageUnitId: string;
  quantity: number;
  variantQuantities?: {
    variantTable: Record<string, string | number | boolean>[];
  } | null;
};

// A stock row's stable identity: which bin + which tracked entity (if any).
const stockRowKey = (r: StockRow) =>
  `${r.storageUnitId ?? ""}::${r.trackedEntityId ?? ""}`;

type TransferFormProps = {
  mode: "stock" | "warehouse";
  fromLocationId: string;
  itemsByLocation: Record<string, TransferItem[]>;
  // Warehouses linked to a customer/supplier — hidden from the warehouse pickers.
  partnerLocationIds: string[];
} & Pick<OverlayFormInjectedProps, "onDismiss" | "fetcher" | "action">;

const TransferForm = ({
  mode,
  fromLocationId: initialFromLocationId,
  itemsByLocation,
  partnerLocationIds,
  onDismiss,
  fetcher,
  action
}: TransferFormProps) => {
  const { t } = useLingui();
  const isStock = mode === "stock";
  // Parents with attribute selections (variant qty grid) — same set
  // Job/MWOs use. Variant child SKUs are not included.
  const configurableItemIds = useConfigurableItems();
  const configurableItemIdSet = useMemo(
    () => new Set(configurableItemIds),
    [configurableItemIds]
  );

  // Warehouse-transfer destination: a warehouse, or any customer/supplier (which
  // resolves server-side to that partner's dedicated warehouse).
  const [toType, setToType] = useState<ToType>("warehouse");
  const [toCustomerId, setToCustomerId] = useState("");
  const [toSupplierId, setToSupplierId] = useState("");

  const [fromLocationId, setFromLocationId] = useState(initialFromLocationId);
  // Stock transfer moves bin→bin within one warehouse, so From and To are the
  // same location; warehouse transfer starts with To empty so it must be picked.
  const [toLocationId, setToLocationId] = useState(
    isStock ? initialFromLocationId : ""
  );

  // On-hand item breakdown per item (bin + serial), fetched lazily on select.
  const [stockByItem, setStockByItem] = useState<Record<string, StockRow[]>>(
    {}
  );

  useEffect(() => {
    // Source warehouse changed → its items/bins differ, so clear each line's
    // item + chosen source and drop the cached per-item stock.
    setStockByItem({});
    setLines((prev) =>
      prev.map((l) => ({
        ...l,
        itemId: "",
        sourceKey: "",
        fromStorageUnitId: "",
        trackedEntityId: "",
        trackedEntityIds: [],
        quantity: 1
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromLocationId]);

  // Items on hand at the chosen From warehouse — preloaded for every warehouse,
  // so switching warehouses (and back) never reloads or loses the list.
  const items: TransferItem[] = useMemo(
    () => itemsByLocation[fromLocationId] ?? [],
    [itemsByLocation, fromLocationId]
  );
  const itemById = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);

  // Destination storage units for the chosen "To warehouse".
  const toUnitsFetcher = useFetcher<{ data: StorageUnitOption[] }>();
  useEffect(() => {
    if (toLocationId) {
      toUnitsFetcher.load(path.to.api.storageUnits(toLocationId));
    }
    setLines((prev) => prev.map((l) => ({ ...l, toStorageUnitId: "" })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toLocationId]);
  const toUnits: StorageUnitOption[] = toUnitsFetcher.data?.data ?? [];

  // A single fetcher caches item stock keyed by the item it was requested for.
  const stockFetcher = useFetcher<{ stock: StockRow[] }>();
  const pendingItemRef = useRef<string | null>(null);
  useEffect(() => {
    if (
      stockFetcher.state === "idle" &&
      stockFetcher.data &&
      pendingItemRef.current
    ) {
      const id = pendingItemRef.current;
      pendingItemRef.current = null;
      const stock = stockFetcher.data.stock;
      setStockByItem((prev) => ({ ...prev, [id]: stock }));
    }
  }, [stockFetcher.state, stockFetcher.data]);

  const keyRef = useRef(0);
  const [lines, setLines] = useState<Line[]>([]);
  const addLine = () =>
    setLines((prev) => [
      ...prev,
      {
        key: `row-${keyRef.current++}`,
        itemId: "",
        sourceKey: "",
        fromStorageUnitId: "",
        trackedEntityId: "",
        trackedEntityIds: [],
        toStorageUnitId: "",
        quantity: 1
      }
    ]);
  const updateLine = (key: string, patch: Partial<Line>) =>
    setLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, ...patch } : l))
    );
  const removeLine = (key: string) =>
    setLines((prev) => prev.filter((l) => l.key !== key));

  const selectItem = (line: Line, itemId: string) => {
    const isConfigurable = configurableItemIdSet.has(itemId);
    updateLine(line.key, {
      itemId,
      sourceKey: "",
      fromStorageUnitId: "",
      trackedEntityId: "",
      trackedEntityIds: [],
      // Attribute qty comes from the combo grid — start at 0 until configured.
      quantity: isConfigurable ? 0 : 1,
      variantQuantities: null
    });
    if (itemId && fromLocationId && !stockByItem[itemId]) {
      pendingItemRef.current = itemId;
      stockFetcher.load(path.to.api.transferStock(itemId, fromLocationId));
    }
  };

  // How much of a given source row (item + bin + serial) is already claimed by
  // OTHER lines — so no two lines can over-draw or double-pick the same serial.
  const usedElsewhere = (
    itemId: string,
    sourceKey: string,
    exceptKey: string
  ) =>
    lines
      .filter(
        (l) =>
          l.key !== exceptKey &&
          l.itemId === itemId &&
          l.sourceKey === sourceKey &&
          l.sourceKey
      )
      .reduce((sum, l) => sum + (l.quantity || 0), 0);

  // Serials already assigned to OTHER lines of the same item, so each serial
  // line grabs distinct physical units from the chosen variant group.
  const serialsUsedByOtherLines = (itemId: string, exceptKey: string) =>
    new Set(
      lines
        .filter((l) => l.key !== exceptKey && l.itemId === itemId)
        .flatMap((l) => l.trackedEntityIds)
    );

  // Assign `qty` units from a variant group to a serial line.
  //
  // Warehouse transfers are physically picked and scanned at ship, so we only
  // pin the exact serials when moving the ENTIRE available group (unambiguous —
  // it's all of them). A partial pick ("2 of 6 BK·L") leaves the units
  // unassigned: the line reserves by quantity at the source bin and the shipper
  // scans the exact garments at ship time — we don't guess which two.
  //
  // Stock transfers move immediately with no ship/scan step, so they must always
  // pin specific units.
  const assignSerialGroup = (line: Line, group: SerialGroup, qty: number) => {
    const used = serialsUsedByOtherLines(line.itemId, line.key);
    const available = group.serialIds.filter((id) => !used.has(id));
    const requested = Math.min(available.length, Math.max(1, qty));
    const pinExact = isStock || requested >= available.length;
    const assigned = pinExact ? available.slice(0, requested) : [];
    updateLine(line.key, {
      sourceKey: group.key,
      fromStorageUnitId: group.storageUnitId ?? "",
      trackedEntityIds: assigned,
      trackedEntityId: "",
      quantity: pinExact ? assigned.length : requested
    });
  };

  const selectSource = (line: Line, key: string) => {
    const row = (stockByItem[line.itemId] ?? []).find(
      (r) => stockRowKey(r) === key
    );
    const remaining = row
      ? Math.max(0, row.quantity - usedElsewhere(line.itemId, key, line.key))
      : 0;
    const isConfigurable = configurableItemIdSet.has(line.itemId);
    updateLine(line.key, {
      sourceKey: key,
      fromStorageUnitId: row?.storageUnitId ?? "",
      trackedEntityId: row?.trackedEntityId ?? "",
      trackedEntityIds: [],
      // Attribute grid was for the previous source — clear so the modal
      // reloads against this bin's on-hand.
      variantQuantities: undefined,
      quantity: !row
        ? line.quantity
        : isConfigurable
          ? 0
          : Math.max(1, Math.min(line.quantity || 1, remaining))
    });
  };

  // A line is ready once it has an item, a resolved source, and a positive qty
  // (configurable lines stay at 0 until the attribute grid is confirmed).
  const preparedLines = lines.filter(
    (l) =>
      l.itemId &&
      l.quantity > 0 &&
      // A source is chosen once sourceKey is set — this also covers stock held
      // in no storage unit (null bin), whose fromStorageUnitId is empty.
      (l.trackedEntityIds.length > 0 ||
        !!l.fromStorageUnitId ||
        !!l.trackedEntityId ||
        !!l.sourceKey)
  );

  const linesJson = JSON.stringify(
    preparedLines.flatMap((l) =>
      // Serial lines emit one entry per auto-assigned unit; others emit one.
      l.trackedEntityIds.length > 0
        ? l.trackedEntityIds.map((teId) => ({
            itemId: l.itemId,
            quantity: 1,
            fromStorageUnitId: l.fromStorageUnitId,
            trackedEntityId: teId,
            toStorageUnitId: l.toStorageUnitId
          }))
        : [
            {
              itemId: l.itemId,
              quantity: l.quantity,
              fromStorageUnitId: l.fromStorageUnitId,
              trackedEntityId: l.trackedEntityId,
              toStorageUnitId: l.toStorageUnitId,
              ...(l.variantQuantities
                ? { variantQuantities: l.variantQuantities }
                : {})
            }
          ]
    )
  );

  const sameWarehouse =
    !isStock &&
    !!fromLocationId &&
    !!toLocationId &&
    fromLocationId === toLocationId;

  return (
    <ValidatedForm
      validator={newTransferValidator}
      method="post"
      action={action}
      fetcher={fetcher}
      defaultValues={{
        mode,
        fromLocationId: initialFromLocationId,
        toLocationId: isStock ? initialFromLocationId : "",
        lines: ""
      }}
      className="flex min-h-0 w-[44rem] max-w-[calc(100vw-2rem)] flex-col bg-accent dark:bg-card"
    >
      {/* Hidden fields live at form level (no gap) so their 0-height wrappers
          don't add spacing inside the gap-4 content panel. */}
      <Hidden name="lines" value={linesJson} />
      <Hidden name="mode" value={mode} />
      {isStock && <Hidden name="toLocationId" value={fromLocationId} />}
      <ModalHeader className="shrink-0 pt-6">
        <ModalTitle>
          {isStock ? (
            <Trans>New Stock Transfer</Trans>
          ) : (
            <Trans>New Warehouse Transfer</Trans>
          )}
        </ModalTitle>
      </ModalHeader>
      <ModalBody className="flex min-h-0 flex-1 flex-col px-0">
        <div className="flex min-h-0 w-full min-w-0 flex-col gap-4 overflow-y-auto rounded-xl border border-border bg-card p-6 dark:bg-muted/40">
          {isStock ? (
            <Location
              name="fromLocationId"
              label={t`Warehouse`}
              exclude={partnerLocationIds}
              onChange={(o) => {
                const v = o?.value ?? "";
                setFromLocationId(v);
                setToLocationId(v);
              }}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full items-start">
                <Location
                  name="fromLocationId"
                  label={t`From warehouse`}
                  exclude={partnerLocationIds}
                  onChange={(o) => setFromLocationId(o?.value ?? "")}
                />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    {t`To`}
                  </span>
                  <Hidden name="toType" value={toType} />
                  <Select
                    value={toType}
                    onValueChange={(v) => {
                      setToType(v as ToType);
                      setToLocationId("");
                      setToCustomerId("");
                      setToSupplierId("");
                    }}
                  >
                    <SelectTrigger className="w-full max-w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[100]">
                      <SelectItem value="warehouse">{t`Warehouse`}</SelectItem>
                      <SelectItem value="customer">{t`Customer`}</SelectItem>
                      <SelectItem value="supplier">{t`Supplier`}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Destination picker on its own full-width row so the two
                  From/To columns above stay single-height and aligned. */}
              {toType === "warehouse" ? (
                <Location
                  name="toLocationId"
                  label={t`Warehouse`}
                  exclude={[
                    ...partnerLocationIds,
                    ...(fromLocationId ? [fromLocationId] : [])
                  ]}
                  onChange={(o) => setToLocationId(o?.value ?? "")}
                />
              ) : toType === "customer" ? (
                // Pick the customer, then the specific ship-to location. Each
                // customer location has its own warehouse (created on first use);
                // leaving the location empty ships to the customer's bare
                // warehouse.
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full items-start">
                  <Customer
                    name="toCustomerId"
                    label={t`Customer`}
                    onChange={(o) => setToCustomerId(o?.value ?? "")}
                  />
                  {toCustomerId && (
                    // key on the customer so switching customers resets the
                    // location field (and its options) to empty.
                    <CustomerLocation
                      key={toCustomerId}
                      name="toCustomerLocationId"
                      customer={toCustomerId}
                      label={t`Ship-to location`}
                    />
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full items-start">
                  <Supplier
                    name="toSupplierId"
                    label={t`Supplier`}
                    onChange={(o) => setToSupplierId(o?.value ?? "")}
                  />
                  {toSupplierId && (
                    <SupplierLocation
                      key={toSupplierId}
                      name="toSupplierLocationId"
                      supplier={toSupplierId}
                      label={t`Ship-to location`}
                    />
                  )}
                </div>
              )}
            </>
          )}
          {sameWarehouse && (
            <p className="text-xs text-red-500 w-full">
              {t`From and To warehouses must be different`}
            </p>
          )}

          <div className="flex min-h-0 w-full flex-col gap-2">
            <div className="flex shrink-0 items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {t`Items`}
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {lines.length}
              </span>
            </div>
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-accent p-3 empty:hidden dark:bg-card">
              {lines.map((line) => {
                const item = itemById.get(line.itemId);
                const uom = item?.unitOfMeasureCode ?? "EA";
                const isConfigurable = configurableItemIdSet.has(line.itemId);
                // A serial item is one physical unit per row — its quantity is
                // always 1, so there's no quantity to choose.
                const isSerial = item?.itemTrackingType === "Serial";
                const stock = stockByItem[line.itemId] ?? [];
                // Serial units grouped by attributes, so you pick a variant
                // rather than an opaque serial number.
                const serialGroups = isSerial ? groupSerials(stock) : [];
                const selectedGroup = isSerial
                  ? serialGroups.find((g) => g.key === line.sourceKey)
                  : undefined;
                // Units of the chosen variant still free for this line.
                const serialAvailable = selectedGroup
                  ? selectedGroup.serialIds.filter(
                      (id) =>
                        !serialsUsedByOtherLines(line.itemId, line.key).has(id)
                    ).length
                  : 0;
                const selectedRow = stock.find(
                  (r) => stockRowKey(r) === line.sourceKey
                );
                const maxQty = selectedRow
                  ? Math.max(
                      0,
                      selectedRow.quantity -
                        usedElsewhere(line.itemId, line.sourceKey, line.key)
                    )
                  : (item?.quantityOnHand ?? 0);
                const loadingStock =
                  !!line.itemId &&
                  !stockByItem[line.itemId] &&
                  stockFetcher.state !== "idle";
                return (
                  <div
                    key={line.key}
                    className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3 dark:bg-muted/40"
                  >
                    <div className="flex items-center gap-2">
                      <Select
                        value={line.itemId}
                        onValueChange={(v) => selectItem(line, v)}
                      >
                        <SelectTrigger className="w-full max-w-full">
                          <SelectValue placeholder={t`Select item`} />
                        </SelectTrigger>
                        <SelectContent className="z-[100]">
                          {items.map((i) => (
                            <SelectItem key={i.id} value={i.id}>
                              {`${i.readableId} · ${i.quantityOnHand} ${i.unitOfMeasureCode}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <IconButton
                        variant="ghost"
                        aria-label={t`Remove`}
                        icon={<LuTrash2 />}
                        onClick={() => removeLine(line.key)}
                      />
                    </div>

                    {line.itemId && (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_6rem]">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            {t`From (current location)`}
                          </span>
                          {isSerial ? (
                            // Serial items: pick a variant group; units are
                            // auto-assigned by quantity (send all → fully auto;
                            // send fewer → re-scannable at ship).
                            <Select
                              value={line.sourceKey}
                              onValueChange={(v) => {
                                const g = serialGroups.find((g) => g.key === v);
                                if (g)
                                  assignSerialGroup(
                                    line,
                                    g,
                                    line.quantity || 1
                                  );
                              }}
                              disabled={serialGroups.length === 0}
                            >
                              <SelectTrigger className="w-full max-w-full">
                                <SelectValue
                                  placeholder={
                                    loadingStock
                                      ? t`Loading…`
                                      : serialGroups.length
                                        ? t`Select color / size`
                                        : t`No stock`
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent className="z-[100]">
                                {serialGroups.map((g) => {
                                  const used = serialsUsedByOtherLines(
                                    line.itemId,
                                    line.key
                                  );
                                  const remaining = g.serialIds.filter(
                                    (id) => !used.has(id)
                                  ).length;
                                  const bin = g.storageUnitName ?? t`No bin`;
                                  const cfg = [g.color, g.size]
                                    .filter(Boolean)
                                    .join(" · ");
                                  const consumed =
                                    remaining <= 0 && g.key !== line.sourceKey;
                                  return (
                                    <SelectItem
                                      key={g.key}
                                      value={g.key}
                                      disabled={consumed}
                                    >
                                      {`${bin}${cfg ? ` · ${cfg}` : ""} · ${remaining} ${uom}${
                                        consumed ? ` · ${t`in use`}` : ""
                                      }`}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Select
                              value={line.sourceKey}
                              onValueChange={(v) => selectSource(line, v)}
                              disabled={stock.length === 0}
                            >
                              <SelectTrigger className="w-full max-w-full">
                                <SelectValue
                                  placeholder={
                                    loadingStock
                                      ? t`Loading…`
                                      : stock.length
                                        ? t`Select source`
                                        : t`No stock`
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent className="z-[100]">
                                {stock.map((r) => {
                                  const k = stockRowKey(r);
                                  const bin = r.storageUnitName ?? t`No bin`;
                                  // Hide rows fully claimed by other lines so the
                                  // same stock can't be transferred twice.
                                  const remaining =
                                    r.quantity -
                                    usedElsewhere(line.itemId, k, line.key);
                                  const consumed =
                                    remaining <= 0 && k !== line.sourceKey;
                                  return (
                                    <SelectItem
                                      key={k}
                                      value={k}
                                      disabled={consumed}
                                    >
                                      {`${bin} · ${r.quantity} ${uom}${
                                        consumed ? ` · ${t`in use`}` : ""
                                      }`}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          )}
                        </div>

                        {/* Always shown — for a customer/supplier the destination
                          warehouse is auto-created (no bins yet), so it reads
                          "No units", same as a warehouse without storage units. */}
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            {t`To unit`}
                          </span>
                          <Select
                            value={line.toStorageUnitId}
                            onValueChange={(v) =>
                              updateLine(line.key, { toStorageUnitId: v })
                            }
                            disabled={toUnits.length === 0}
                          >
                            <SelectTrigger className="w-full max-w-full">
                              <SelectValue
                                placeholder={
                                  toType === "warehouse" && !toLocationId
                                    ? t`Pick a warehouse`
                                    : toUnits.length
                                      ? t`Select unit`
                                      : t`No units`
                                }
                              />
                            </SelectTrigger>
                            <SelectContent className="z-[100]">
                              {toUnits.map((u) => (
                                <SelectItem key={u.id} value={u.id}>
                                  {u.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {isSerial ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-muted-foreground">
                              {t`Quantity`}
                            </span>
                            <Input
                              type="number"
                              min={1}
                              max={serialAvailable || undefined}
                              value={String(line.quantity)}
                              disabled={!selectedGroup}
                              onChange={(e) => {
                                if (!selectedGroup) return;
                                // Re-assign that many units from the chosen config.
                                const qty = Math.min(
                                  serialAvailable,
                                  Math.max(1, +e.target.value || 1)
                                );
                                assignSerialGroup(line, selectedGroup, qty);
                              }}
                            />
                          </div>
                        ) : isConfigurable ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-muted-foreground">
                              {t`Quantity`}
                            </span>
                            <StyleLineQuantityInput
                              key={`${line.key}:${line.sourceKey}`}
                              lineId={line.key}
                              itemId={line.itemId}
                              value={line.quantity}
                              variantQuantities={line.variantQuantities}
                              locationId={fromLocationId}
                              storageUnitId={selectedRow?.storageUnitId}
                              maxTotal={maxQty}
                              isDisabled={!line.sourceKey || !selectedRow}
                              size="md"
                              otherLineVariantQuantities={lines
                                .filter(
                                  (l) =>
                                    l.key !== line.key &&
                                    l.itemId === line.itemId &&
                                    l.variantQuantities
                                )
                                .map((l) => l.variantQuantities)}
                              onQuantityChange={({
                                quantity,
                                variantQuantities
                              }) =>
                                updateLine(line.key, {
                                  quantity: Math.min(
                                    maxQty || Infinity,
                                    Math.max(0, quantity || 0)
                                  ),
                                  variantQuantities
                                })
                              }
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-muted-foreground">
                              {t`Quantity`}
                            </span>
                            <Input
                              type="number"
                              min={1}
                              max={maxQty || undefined}
                              value={String(line.quantity)}
                              disabled={!selectedRow}
                              onChange={(e) => {
                                if (!selectedRow) return;
                                updateLine(line.key, {
                                  // Clamp to what's available at the chosen source
                                  // so a typed value can't over-transfer.
                                  quantity: Math.min(
                                    maxQty || Infinity,
                                    Math.max(1, +e.target.value || 1)
                                  )
                                });
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full shrink-0 justify-center border border-dashed border-border text-muted-foreground"
              leftIcon={<LuPlus />}
              onClick={addLine}
            >
              <Trans>Add item</Trans>
            </Button>
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="shrink-0 border-t-0 bg-transparent">
        <Button variant="secondary" type="button" onClick={onDismiss}>
          <Trans>Cancel</Trans>
        </Button>
        <Submit
          isDisabled={
            preparedLines.length === 0 ||
            !fromLocationId ||
            sameWarehouse ||
            (!isStock &&
              ((toType === "warehouse" && !toLocationId) ||
                (toType === "customer" && !toCustomerId) ||
                (toType === "supplier" && !toSupplierId)))
          }
        >
          <Trans>Create transfer</Trans>
        </Submit>
      </ModalFooter>
    </ValidatedForm>
  );
};

export default TransferForm;
