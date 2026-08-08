import { describe, expect, it } from "vitest";
import {
  isConfigTableConfiguration,
  jobVariantQuantitiesToConfigTable,
  sumJobVariantQuantities
} from "./jobVariantQuantity.service";

describe("jobVariantQuantity helpers", () => {
  it("detects configTable vs flat Part params", () => {
    expect(
      isConfigTableConfiguration({
        configTable: [{ valuesKey: "BK|S", Quantities: 2 }],
        configTablePrimaryKeys: ["Quantities"]
      })
    ).toBe(true);
    expect(isConfigTableConfiguration({ color: "BK", finish: "matte" })).toBe(
      false
    );
    expect(isConfigTableConfiguration(null)).toBe(false);
  });

  it("sums quantities", () => {
    expect(sumJobVariantQuantities([{ quantity: 2 }, { quantity: 3 }])).toBe(5);
    expect(sumJobVariantQuantities([])).toBe(0);
  });

  it("builds combo configTable for the editor", () => {
    expect(
      jobVariantQuantitiesToConfigTable([
        { variantItemId: "a", valuesKey: "BK|S", quantity: 2 },
        { variantItemId: "b", valuesKey: "BK|M", quantity: 0 }
      ])
    ).toEqual({
      configTable: [{ valuesKey: "BK|S", Quantities: 2 }],
      configTablePrimaryKeys: ["Quantities"]
    });
  });
});
