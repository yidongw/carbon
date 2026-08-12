import { useMount } from "@carbon/react";
import { useFetcher } from "react-router";
import { path } from "~/utils/path";
import type { AttributeSetFormOption } from "../itemAttribute.service";

/**
 * Load the attribute sets (with their attributes + value options) assignable to
 * an item type, from `api/items/attribute-sets-for-type`. Shared by the create
 * form selector (ItemAttributeSelects) and the Consumable properties editor.
 *
 * Pass `initialSets` when the parent already loaded them (e.g. overlay loader)
 * to skip the client round-trip on open.
 */
export function useItemAttributeSetOptions(
  itemType: string,
  initialSets?: AttributeSetFormOption[]
) {
  const hasInitial = initialSets !== undefined;
  const fetcher = useFetcher<{
    data: AttributeSetFormOption[];
    error: Error | null;
  }>();

  useMount(() => {
    if (hasInitial) return;
    fetcher.load(path.to.api.attributeSetsForType(itemType));
  });

  return {
    sets: hasInitial ? (initialSets ?? []) : (fetcher.data?.data ?? []),
    isLoading: hasInitial ? false : fetcher.state !== "idle" && !fetcher.data
  };
}
