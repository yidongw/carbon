import type { ItemFile, Part, PartSummary } from "~/modules/items";
import {
  createPendingPartUsedInGroupPromises,
  type PartMethodTree
} from "~/modules/items/partUsedIn.server";

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

export function createPartShellLoaderData(
  partSummary: PartSummary,
  flags: { shell?: true }
) {
  return {
    partSummary: Promise.resolve(partSummary),
    files: Promise.resolve([] as ItemFile[]),
    supplierParts: Promise.resolve([]),
    pickMethods: Promise.resolve([]),
    makeMethods: Promise.resolve({ data: [], error: null }),
    tags: Promise.resolve([]),
    usedInGroups: createPendingPartUsedInGroupPromises(),
    methodTree: new Promise<PartMethodTree | null>(() => {}),
    ...flags
  };
}
