import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import type { UsedInKey, UsedInNode } from "~/modules/items/ui/Item/UsedIn";

export type PartUsedInGroupKey = Extract<
  UsedInKey,
  | "issues"
  | "jobMaterials"
  | "jobs"
  | "maintenanceDispatchItems"
  | "methodMaterials"
  | "purchaseOrderLines"
  | "receiptLines"
  | "quoteLines"
  | "quoteMaterials"
  | "salesOrderLines"
  | "shipmentLines"
  | "supplierQuotes"
>;

export type PartUsedInGroupDefinition = {
  key: PartUsedInGroupKey;
  name: MessageDescriptor;
  module: string;
};

export const PART_USED_IN_GROUP_DEFINITIONS: PartUsedInGroupDefinition[] = [
  { key: "issues", name: msg`Issues`, module: "quality" },
  { key: "jobs", name: msg`Jobs`, module: "production" },
  { key: "jobMaterials", name: msg`Job Materials`, module: "production" },
  {
    key: "maintenanceDispatchItems",
    name: msg`Maintenance`,
    module: "resources"
  },
  { key: "methodMaterials", name: msg`Method Materials`, module: "parts" },
  {
    key: "purchaseOrderLines",
    name: msg`Purchase Orders`,
    module: "purchasing"
  },
  { key: "receiptLines", name: msg`Receipts`, module: "inventory" },
  { key: "quoteLines", name: msg`Quotes`, module: "sales" },
  { key: "quoteMaterials", name: msg`Quote Materials`, module: "sales" },
  { key: "salesOrderLines", name: msg`Sales Orders`, module: "sales" },
  { key: "shipmentLines", name: msg`Shipments`, module: "inventory" },
  {
    key: "supplierQuotes",
    name: msg`Supplier Quotes`,
    module: "purchasing"
  }
];

export type PartUsedInData = Record<
  PartUsedInGroupKey,
  UsedInNode["children"]
>;

type TranslateFn = (descriptor: MessageDescriptor) => string;

export function createLoadingUsedInNodes(t: TranslateFn): UsedInNode[] {
  return PART_USED_IN_GROUP_DEFINITIONS.map((group) => ({
    key: group.key,
    name: t(group.name),
    module: group.module,
    children: [],
    isLoading: true
  }));
}

export function transformPartUsedInGroupChildren(
  key: PartUsedInGroupKey,
  children: UsedInNode["children"]
): UsedInNode["children"] {
  switch (key) {
    case "jobs":
      return children.map((job) => ({
        ...job,
        methodType: "Make to Order"
      }));
    case "purchaseOrderLines":
      return children.map((po) => ({
        ...po,
        methodType: "Purchase to Order"
      }));
    case "receiptLines":
      return children.map((receipt) => ({
        ...receipt,
        methodType: "Pull from Inventory"
      }));
    case "shipmentLines":
      return children.map((shipment) => ({
        ...shipment,
        methodType: "Shipment"
      }));
    case "quoteMaterials":
      return children.map((qm) => ({
        ...qm,
        documentReadableId: qm.documentReadableId ?? ""
      }));
    default:
      return children;
  }
}
