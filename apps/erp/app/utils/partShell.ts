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
