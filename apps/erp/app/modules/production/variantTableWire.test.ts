import { describe, expect, it } from "vitest";
import {
  readVariantQuantitiesFormRaw,
  readVariantTableRows,
  stampVariantItemIds
} from "./variantTableWire";

describe("readVariantTableRows", () => {
  it("reads variantTable", () => {
    expect(
      readVariantTableRows({
        variantTable: [{ valuesKey: "BK|S", Quantities: 2 }]
      })
    ).toHaveLength(1);
  });

  it("ignores the retired legacy configTable key", () => {
    expect(
      readVariantTableRows({
        configTable: [{ valuesKey: "BK|S", Quantities: 3 }]
      })
    ).toEqual([]);
  });
});

describe("stampVariantItemIds", () => {
  const map = { "BK|S": "iav_bk_s_sku", "BK|M": "iav_bk_m_sku" };

  it("stamps variantItemId from the valuesKey map", () => {
    expect(
      stampVariantItemIds([{ valuesKey: "BK|S", Quantities: 2 }], map)
    ).toEqual([
      { valuesKey: "BK|S", Quantities: 2, variantItemId: "iav_bk_s_sku" }
    ]);
  });

  it("leaves rows whose valuesKey has no mapped variant untouched (lossless)", () => {
    expect(
      stampVariantItemIds([{ valuesKey: "WH|L", Quantities: 5 }], map)
    ).toEqual([{ valuesKey: "WH|L", Quantities: 5 }]);
  });

  it("is idempotent — keeps an existing variantItemId", () => {
    expect(
      stampVariantItemIds(
        [{ valuesKey: "BK|S", Quantities: 2, variantItemId: "already" }],
        map
      )
    ).toEqual([{ valuesKey: "BK|S", Quantities: 2, variantItemId: "already" }]);
  });

  it("no-ops without a map", () => {
    const rows = [{ valuesKey: "BK|S", Quantities: 2 }];
    expect(stampVariantItemIds(rows, undefined)).toBe(rows);
    expect(stampVariantItemIds(rows, null)).toBe(rows);
  });

  it("skips rows with an empty valuesKey", () => {
    expect(
      stampVariantItemIds([{ valuesKey: "", Quantities: 0 }], map)
    ).toEqual([{ valuesKey: "", Quantities: 0 }]);
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
      '{"configTable":[{"valuesKey":"A","Quantities":1}]}'
    );
    expect(readVariantQuantitiesFormRaw(fd, undefined)).toBeUndefined();
  });
});
