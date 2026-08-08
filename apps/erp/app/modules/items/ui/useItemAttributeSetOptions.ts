import { useMount } from "@carbon/react";
import { useFetcher } from "react-router";
import { path } from "~/utils/path";
import type { AttributeSetFormOption } from "../itemAttribute.service";

/**
 * Load the attribute sets (with their attributes + value options) assignable to
 * an item type, from `api/items/attribute-sets-for-type`. Shared by the create
 * form selector (ItemAttributeSelects) and the Consumable properties editor.
 */
export function useItemAttributeSetOptions(itemType: string) {
  const fetcher = useFetcher<{
    data: AttributeSetFormOption[];
    error: Error | null;
  }>();

  useMount(() => {
    fetcher.load(path.to.api.attributeSetsForType(itemType));
  });

  return {
    sets: fetcher.data?.data ?? [],
    isLoading: fetcher.state !== "idle" && !fetcher.data
  };
}
