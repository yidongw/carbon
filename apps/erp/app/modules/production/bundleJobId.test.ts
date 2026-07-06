import { describe, expect, it } from "vitest";
import { buildBundleJobReadableId } from "./bundleJobId";

describe("buildBundleJobReadableId", () => {
  it("builds a readable ID from style, color, size, and bundle sequence", () => {
    expect(
      buildBundleJobReadableId({
        styleCode: "ST1001",
        colorCode: "BLK",
        sizeCode: "42",
        bundleSequence: 3
      })
    ).toBe("ST1001-BLK-42-B003");
  });

  it("omits size when no size code exists", () => {
    expect(
      buildBundleJobReadableId({
        styleCode: "ST1001",
        colorCode: "BLK",
        sizeCode: null,
        bundleSequence: 12
      })
    ).toBe("ST1001-BLK-B012");
  });

  it("normalizes spacing and zero-pads the bundle sequence", () => {
    expect(
      buildBundleJobReadableId({
        styleCode: " ST 1001 ",
        colorCode: " navy blue ",
        sizeCode: " xl ",
        bundleSequence: 1
      })
    ).toBe("ST-1001-NAVY-BLUE-XL-B001");
  });
});
