import { describe, expect, it } from "vitest";
import { getStyleNavigationKeys } from "./styleNavigationConfig";

describe("getStyleNavigationKeys", () => {
  it("mirrors the shared part tabs for inventory-managed styles", () => {
    expect(
      getStyleNavigationKeys({
        itemTrackingType: "Serial"
      })
    ).toEqual(["details", "accounting", "planning", "inventory", "sales"]);
  });

  it("hides planning and inventory for non-inventory styles", () => {
    expect(
      getStyleNavigationKeys({
        itemTrackingType: "Non-Inventory"
      })
    ).toEqual(["details", "accounting", "sales"]);
  });
});
