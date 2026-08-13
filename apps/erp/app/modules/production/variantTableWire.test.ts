import { describe, expect, it } from "vitest";
import {
  normalizeVariantQuantitiesPayload,
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

  it("dual-reads legacy configTable", () => {
    expect(
      readVariantTableRows({
        configTable: [{ valuesKey: "BK|S", Quantities: 3 }]
      })
    ).toEqual([{ valuesKey: "BK|S", Quantities: 3 }]);
  });

  it("prefers variantTable when both are present", () => {
    expect(
      readVariantTableRows({
        variantTable: [{ valuesKey: "new", Quantities: 1 }],
        configTable: [{ valuesKey: "old", Quantities: 9 }]
      })
    ).toEqual([{ valuesKey: "new", Quantities: 1 }]);
  });
});

describe("normalizeVariantQuantitiesPayload", () => {
  it("promotes configTable to variantTable", () => {
    expect(
      normalizeVariantQuantitiesPayload({
        configTable: [{ valuesKey: "BK|S", Quantities: 1 }],
        splitRows: []
      })
    ).toEqual({
      variantTable: [{ valuesKey: "BK|S", Quantities: 1 }],
      splitRows: []
    });
  });

  it("leaves current key alone", () => {
    const payload = {
      variantTable: [{ valuesKey: "BK|S", Quantities: 1 }]
    };
    expect(normalizeVariantQuantitiesPayload(payload)).toEqual(payload);
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
  it("prefers validator value", () => {
    const fd = new FormData();
    fd.set("configuration", '{"configTable":[]}');
    expect(readVariantQuantitiesFormRaw(fd, '{"variantTable":[]}')).toBe(
      '{"variantTable":[]}'
    );
  });

  it("falls back to legacy configuration FormData field", () => {
    const fd = new FormData();
    fd.set(
      "configuration",
      '{"configTable":[{"valuesKey":"A","Quantities":1}]}'
    );
    expect(readVariantQuantitiesFormRaw(fd, undefined)).toContain(
      "configTable"
    );
  });
});
