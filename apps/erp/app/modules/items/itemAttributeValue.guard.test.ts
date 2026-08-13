import { describe, expect, it } from "vitest";
import { isAttributeValueCodeChangeBlocked } from "./itemAttributeValue.guard";

describe("isAttributeValueCodeChangeBlocked", () => {
  it("blocks a code change when the value is referenced", () => {
    expect(
      isAttributeValueCodeChangeBlocked({
        currentCode: "BK",
        nextCode: "BLK",
        referenceCount: 3
      })
    ).toBe(true);
  });

  it("allows a code change when the value is unreferenced", () => {
    expect(
      isAttributeValueCodeChangeBlocked({
        currentCode: "BK",
        nextCode: "BLK",
        referenceCount: 0
      })
    ).toBe(false);
  });

  it("allows an unchanged code even when referenced (name/sortOrder edits)", () => {
    expect(
      isAttributeValueCodeChangeBlocked({
        currentCode: "BK",
        nextCode: "BK",
        referenceCount: 5
      })
    ).toBe(false);
  });

  it("ignores surrounding whitespace when comparing codes", () => {
    expect(
      isAttributeValueCodeChangeBlocked({
        currentCode: "BK",
        nextCode: " BK ",
        referenceCount: 5
      })
    ).toBe(false);
  });
});
