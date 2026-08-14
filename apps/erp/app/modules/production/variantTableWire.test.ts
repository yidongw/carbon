import { describe, expect, it } from "vitest";
import {
  readVariantQuantitiesFormRaw,
  readVariantTableRows
} from "./variantTableWire";

describe("readVariantTableRows", () => {
  it("reads variantTable", () => {
    expect(
      readVariantTableRows({
        variantTable: [{ variantItemId: "iav_bk_s", Quantities: 2 }]
      })
    ).toHaveLength(1);
  });

  it("ignores the retired legacy configTable key", () => {
    expect(
      readVariantTableRows({
        configTable: [{ variantItemId: "iav_bk_s", Quantities: 3 }]
      })
    ).toEqual([]);
  });
});

describe("readVariantQuantitiesFormRaw", () => {
  it("returns the validator value", () => {
    const fd = new FormData();
    expect(readVariantQuantitiesFormRaw(fd, '{"variantTable":[]}')).toBe(
      '{"variantTable":[]}'
    );
  });

  it("returns undefined when the validator value is absent (no legacy fallback)", () => {
    const fd = new FormData();
    fd.set(
      "configuration",
      '{"configTable":[{"variantItemId":"iav_a","Quantities":1}]}'
    );
    expect(readVariantQuantitiesFormRaw(fd, undefined)).toBeUndefined();
  });
});
