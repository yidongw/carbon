import type { Part, PartSummary } from "~/modules/items";

const key = (itemId: string) => `carbon:part-shell:${itemId}`;

export function storePartShell(part: Part) {
  try {
    sessionStorage.setItem(key(part.id!), JSON.stringify(part));
  } catch {
    // sessionStorage may be unavailable
  }
}

export function readPartShell(itemId: string): PartSummary | null {
  try {
    const raw = sessionStorage.getItem(key(itemId));
    if (!raw) return null;
    return JSON.parse(raw) as PartSummary;
  } catch {
    return null;
  }
}

export function consumePartShell(itemId: string): PartSummary | null {
  const shell = readPartShell(itemId);
  if (!shell) return null;
  try {
    sessionStorage.removeItem(key(itemId));
  } catch {
    // sessionStorage may be unavailable
  }
  return shell;
}

export function createPlaceholderPartSummary(itemId: string): PartSummary {
  return {
    id: itemId,
    name: "",
    readableId: "",
    readableIdWithRevision: "",
    replenishmentSystem: "Buy",
    itemTrackingType: "Inventory",
    requiresInspection: false,
    active: true
  } as PartSummary;
}

const emptyUsedIn = {
  issues: [],
  jobMaterials: [],
  jobs: [],
  maintenanceDispatchItems: [],
  methodMaterials: [],
  purchaseOrderLines: [],
  receiptLines: [],
  quoteLines: [],
  quoteMaterials: [],
  salesOrderLines: [],
  shipmentLines: [],
  supplierQuotes: []
};

export function createPartShellLoaderData(
  partSummary: PartSummary,
  flags: { shell?: true; placeholder?: true }
) {
  return {
    partSummary,
    files: Promise.resolve([]),
    supplierParts: Promise.resolve({ data: [], error: null }),
    pickMethods: Promise.resolve({ data: [], error: null }),
    makeMethods: Promise.resolve({ data: [], error: null }),
    tags: Promise.resolve({ data: [], error: null }),
    usedIn: Promise.resolve(emptyUsedIn),
    methodTree: Promise.resolve(null),
    ...flags
  };
}
