import { describe, expect, it } from "vitest";
import { getAutoScrollDirection } from "./sortableDragAutoScroll";

describe("getAutoScrollDirection", () => {
  it("scrolls up near the top edge", () => {
    expect(
      getAutoScrollDirection({
        pointerY: 12,
        containerTop: 0,
        containerBottom: 600,
        threshold: 40
      })
    ).toBe(-1);
  });

  it("scrolls down near the bottom edge", () => {
    expect(
      getAutoScrollDirection({
        pointerY: 588,
        containerTop: 0,
        containerBottom: 600,
        threshold: 40
      })
    ).toBe(1);
  });

  it("does not scroll in the middle", () => {
    expect(
      getAutoScrollDirection({
        pointerY: 300,
        containerTop: 0,
        containerBottom: 600,
        threshold: 40
      })
    ).toBe(0);
  });
});
