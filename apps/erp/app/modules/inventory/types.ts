import type { Database } from "@carbon/database";
import type {
  getBatchProperties,
  getInventoryItems,
  getItemLedgerPage,
  getKanbans,
  getReceiptLines,
  getReceipts,
  getReceiptTracking,
  getShipmentLines,
  getShipments,
  getShipmentTracking,
  getShippingMethods,
  getStockTransferLines,
  getStockTransfers,
  getTrackedEntities,
  getWarehouseTransferLines,
  getWarehouseTransfers
} from "./inventory.service";

export type BatchProperty = NonNullable<
  Awaited<ReturnType<typeof getBatchProperties>>["data"]
>[number];

// One SKU row of a Style item's inventory breakdown, as returned by the
// `breakdown` / `jobBreakdown` jsonb from get_inventory_quantities (rolled up
// from the item's variant-SKU ledgers). Each element is one variant: `label`
// is the display (e.g. "BK · M"), `valuesKey` its identity (e.g. "BK|M").
export type BreakdownEntry = {
  valuesKey?: string | null;
  label?: string | null;
  variantItemId?: string | null;
  quantityOnHand: number;
  // Optional per-location split of `quantityOnHand`, keyed by locationId — used
  // by the cross-location Stock Overview grid to show one column per warehouse.
  byLocation?: Record<string, number>;
};

export type InventoryItem = NonNullable<
  Awaited<ReturnType<typeof getInventoryItems>>["data"]
>[number] & {
  // Merged in by the quantities loader from open warehouse transfers.
  toShip?: number;
  toReceive?: number;
  // Per-variant on-hand for Style items; absent/[] for other item types.
  breakdown?: BreakdownEntry[] | null;
};

export type ItemLedger = NonNullable<
  Awaited<ReturnType<typeof getItemLedgerPage>>["data"]
>[number];

export type ItemTracking = NonNullable<
  Awaited<ReturnType<typeof getReceiptTracking>>["data"]
>[number];

export type Kanban = NonNullable<
  Awaited<ReturnType<typeof getKanbans>>["data"]
>[number];

export type Receipt = NonNullable<
  Awaited<ReturnType<typeof getReceipts>>["data"]
>[number];

export type ReceiptLine = NonNullable<
  Awaited<ReturnType<typeof getReceiptLines>>["data"]
>[number];

export type ReceiptLineItem = Omit<
  ReceiptLine,
  "id" | "updatedBy" | "createdAt" | "updatedAt"
>;

export type ReceiptSourceDocument =
  Database["public"]["Enums"]["receiptSourceDocument"];

export type Shipment = NonNullable<
  Awaited<ReturnType<typeof getShipments>>["data"]
>[number];

export type ShipmentLine = NonNullable<
  Awaited<ReturnType<typeof getShipmentLines>>["data"]
>[number];

export type ShipmentLineTracking = NonNullable<
  Awaited<ReturnType<typeof getShipmentTracking>>["data"]
>[number];

export type ShippingCarrier = Database["public"]["Enums"]["shippingCarrier"];

export type ShippingMethod = NonNullable<
  Awaited<ReturnType<typeof getShippingMethods>>["data"]
>[number];

export type ShipmentSourceDocument =
  Database["public"]["Enums"]["shipmentSourceDocument"];

export type StockTransfer = NonNullable<
  Awaited<ReturnType<typeof getStockTransfers>>["data"]
>[number];

export type StockTransferLine = NonNullable<
  Awaited<ReturnType<typeof getStockTransferLines>>["data"]
>[number];

export type TrackedEntity = NonNullable<
  Awaited<ReturnType<typeof getTrackedEntities>>["data"]
>[number];

export type WarehouseTransfer = NonNullable<
  Awaited<ReturnType<typeof getWarehouseTransfers>>["data"]
>[number];

export type WarehouseTransferLine = NonNullable<
  Awaited<ReturnType<typeof getWarehouseTransferLines>>["data"]
>[number];

export interface Activity {
  id: string;
  type: string;
  sourceDocument?: string;
  sourceDocumentId?: string;
  sourceDocumentReadableId?: string;
  attributes: Record<string, any>;
}

export interface ActivityInput {
  trackedActivityId: string;
  trackedEntityId: string;
  quantity: number;
}

export interface ActivityOutput {
  trackedActivityId: string;
  trackedEntityId: string;
  quantity: number;
}

export interface GraphNode {
  id: string;
  type: "entity" | "activity";
  data: TrackedEntity | Activity;
  x?: number;
  y?: number;
  depth?: number;
  parentId: string | null;
}

export interface GraphLink {
  source: string;
  target: string;
  type: "input" | "output";
  quantity: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// A single clickable chip: a per-warehouse on-hand amount, or a per-document
// (warehouse transfer / receipt) amount that deep-links to that document.
export type StockOverviewChip = {
  id: string;
  locationId: string;
  locationName: string;
  quantity: number;
  href: string;
};

export type StockOverviewItem = {
  itemId: string;
  readableIdWithRevision: string;
  name: string;
  thumbnailPath: string | null;
  type: string | null;
  unitOfMeasureCode: string | null;
  onHand: number;
  toSend: number;
  toReceive: number;
  inTransit: number;
  total: number;
  onHandChips: StockOverviewChip[];
  toSendChips: StockOverviewChip[];
  toReceiveChips: StockOverviewChip[];
  // Per-variant on-hand for Style items, each entry carrying a `byLocation`
  // split; `breakdownLocations` lists the warehouses shown as quantity columns.
  breakdown: BreakdownEntry[];
  breakdownLocations: { id: string; name: string }[];
};
