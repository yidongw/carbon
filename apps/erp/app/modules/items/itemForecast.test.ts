import { describe, expect, it } from "vitest";
import { sumQuantityByGroup } from "./itemForecast";

describe("sumQuantityByGroup", () => {
  it("sums SKU demand that shares a period and source", () => {
    expect(
      sumQuantityByGroup(
        [
          { periodId: "p1", sourceType: "Sales Order", actualQuantity: 3 },
          { periodId: "p1", sourceType: "Sales Order", actualQuantity: 5 },
          { periodId: "p1", sourceType: "Job Material", actualQuantity: 1 },
          { periodId: "p2", sourceType: "Sales Order", actualQuantity: 2 }
        ],
        "actualQuantity",
        ["periodId", "sourceType"]
      )
    ).toEqual([
      { periodId: "p1", sourceType: "Sales Order", actualQuantity: 8 },
      { periodId: "p1", sourceType: "Job Material", actualQuantity: 1 },
      { periodId: "p2", sourceType: "Sales Order", actualQuantity: 2 }
    ]);
  });

  it("returns an empty list when there are no rows", () => {
    expect(sumQuantityByGroup([], "actualQuantity", ["periodId"])).toEqual([]);
  });
});
