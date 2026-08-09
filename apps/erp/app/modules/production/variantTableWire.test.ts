import { describe, expect, it } from "vitest";
import {
  normalizeVariantQuantitiesPayload,
  readVariantQuantitiesFormRaw,
  readVariantTableRows
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
