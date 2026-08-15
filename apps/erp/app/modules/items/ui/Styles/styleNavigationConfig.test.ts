import { describe, expect, it } from "vitest";
import { getStyleNavigationKeys } from "./styleNavigationConfig";

describe("getStyleNavigationKeys", () => {
  it("mirrors the shared part tabs for bought, inventory-managed styles", () => {
    expect(
      getStyleNavigationKeys({
        itemTrackingType: "Serial",
        replenishmentSystem: "Buy"
      })
    ).toEqual([
      "details",
      "purchasing",
      "accounting",
      "planning",
      "inventory",
      "sales"
    ]);
  });

  it("hides purchasing for make styles (produced in-house)", () => {
    expect(
      getStyleNavigationKeys({
        itemTrackingType: "Serial",
        replenishmentSystem: "Make"
      })
    ).toEqual(["details", "accounting", "planning", "inventory", "sales"]);
  });

  it("hides planning and inventory for non-inventory styles", () => {
    expect(
      getStyleNavigationKeys({
        itemTrackingType: "Non-Inventory",
        replenishmentSystem: "Buy"
      })
    ).toEqual(["details", "purchasing", "accounting", "sales"]);
  });
});
