import { describe, expect, it } from "vitest";
import { defaultStylesTableSharedColumnKeys } from "./stylesTableConfig";

describe("defaultStylesTableSharedColumnKeys", () => {
  it("covers the shared item-management columns mirrored from parts", () => {
    expect(defaultStylesTableSharedColumnKeys).toEqual(
      expect.arrayContaining([
        "id",
        "templateName",
        "description",
        "replenishmentSystem",
        "defaultMethodType",
        "itemTrackingType",
        "itemPostingGroupId",
        "colorCode",
        "tags",
        "active"
      ])
    );
  });
});
