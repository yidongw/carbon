import type { Database } from "@carbon/database";
import type { MethodItemType } from "~/modules/shared";

export const jobSelectableItemTypes = [
  "Part",
  "Style",
  "Tool"
] as const satisfies MethodItemType[];

export function getJobTableItemTypes(
  type: Database["public"]["Enums"]["itemType"]
) {
  return jobSelectableItemTypes.includes(
    type as (typeof jobSelectableItemTypes)[number]
  );
}
