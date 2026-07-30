import type { Database } from "@carbon/database";
import { useStore as useValue } from "@nanostores/react";
import { atom, computed } from "nanostores";
import { useNanoStore } from "~/hooks";
import type { ListItem } from "~/types";

export type Item = ListItem & {
  readableIdWithRevision: string;
  replenishmentSystem: Database["public"]["Enums"]["itemReplenishmentSystem"];
  itemTrackingType: Database["public"]["Enums"]["itemTrackingType"];
  unitOfMeasureCode: string;
  type: Database["public"]["Enums"]["itemType"];
  active: boolean;
  quantityOnHand?: number;
  quantityByLocation?: Record<string, number>;
  // Whether the item's manufacturing setup requires a configuration table (color/
  // size matrix, etc). Preloaded here so item pickers can show the config-quantity
  // trigger instantly instead of waiting on a per-selection query. `undefined`
  // means "not yet known" (e.g. an item inserted via realtime after hydration).
  requiresConfiguration?: boolean;
};

const $itemsStore = atom<Item[]>([]);

const $partsStore = computed($itemsStore, (item) =>
  item.filter((i) => i.type === "Part")
);

const $stylesStore = computed($itemsStore, (item) =>
  item.filter((i) => i.type === "Style")
);

const $toolsStore = computed($itemsStore, (item) =>
  item.filter((i) => i.type === "Tool")
);

const $serivceStore = computed($itemsStore, (item) =>
  item.filter((i) => i.type === "Service")
);

const $materialsStore = computed($itemsStore, (item) =>
  item.filter((i) => i.type === "Material")
);

export const useItems = () => useNanoStore<Item[]>($itemsStore, "items");
export const useParts = () => useValue($partsStore);
export const useStyles = () => useValue($stylesStore);
export const useTools = () => useValue($toolsStore);
export const useServices = () => useValue($serivceStore);
export const useMaterials = () => useValue($materialsStore);
