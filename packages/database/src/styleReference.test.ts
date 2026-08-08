import { describe, expect, it } from "vitest";
import {
  localizeStyleColorName,
  localizeStyleColorNameByName,
  localizeVariantAttributeLabel
} from "./styleReference";

describe("localizeStyleColorName", () => {
  it("localizes a standard color code to the requested locale", () => {
    expect(localizeStyleColorName("BK", "zh")).toBe("黑色");
    expect(localizeStyleColorName("WH", "zh")).toBe("白色");
  });

  it("accepts a full BCP-47 tag and falls back to the base locale", () => {
    expect(localizeStyleColorName("BK", "zh-CN")).toBe("黑色");
  });

  it("returns the English name when no language is given", () => {
    expect(localizeStyleColorName("BK")).toBe("Black");
  });

  it("falls back to English for a locale the seed doesn't carry", () => {
    expect(localizeStyleColorName("BK", "xx")).toBe("Black");
  });

  it("returns undefined for a non-standard / company color code", () => {
    expect(localizeStyleColorName("NOT_A_CODE", "zh")).toBeUndefined();
    expect(localizeStyleColorName("", "zh")).toBeUndefined();
    expect(localizeStyleColorName(null)).toBeUndefined();
  });
});

describe("localizeStyleColorNameByName", () => {
  it("localizes by the stored English base name", () => {
    expect(localizeStyleColorNameByName("Black", "zh")).toBe("黑色");
  });

  it("is case-insensitive and trims", () => {
    expect(localizeStyleColorNameByName("  black  ", "zh")).toBe("黑色");
    expect(localizeStyleColorNameByName("WHITE", "zh")).toBe("白色");
  });

  it("returns undefined for a name that isn't a standard color", () => {
    expect(localizeStyleColorNameByName("XS", "zh")).toBeUndefined();
    expect(localizeStyleColorNameByName(null)).toBeUndefined();
  });
});

describe("localizeVariantAttributeLabel", () => {
  it("localizes a ' · '-joined label of value codes", () => {
    expect(localizeVariantAttributeLabel("BK · WH", "zh")).toBe("黑色 · 白色");
  });

  it("localizes a raw valuesKey joined by '|'", () => {
    expect(localizeVariantAttributeLabel("BK|WH", "zh")).toBe("黑色 · 白色");
  });

  it("localizes a bare '·' separator with no surrounding spaces", () => {
    expect(localizeVariantAttributeLabel("BK·WH", "zh")).toBe("黑色 · 白色");
  });

  it("passes non-color segments (e.g. size codes) through unchanged", () => {
    expect(localizeVariantAttributeLabel("BK · S", "zh")).toBe("黑色 · S");
  });

  it("localizes segments given as English base names", () => {
    expect(localizeVariantAttributeLabel("Black · White", "zh")).toBe(
      "黑色 · 白色"
    );
  });

  it("drops empty segments from a malformed label", () => {
    expect(localizeVariantAttributeLabel("BK ·  · S", "zh")).toBe("黑色 · S");
  });

  it("returns an empty string for empty/nullish input", () => {
    expect(localizeVariantAttributeLabel("")).toBe("");
    expect(localizeVariantAttributeLabel(null)).toBe("");
    expect(localizeVariantAttributeLabel(undefined)).toBe("");
  });
});
