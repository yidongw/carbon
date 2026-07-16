import { describe, expect, it } from "vitest";
import { methodItemType } from "./shared.models";

describe("methodItemType", () => {
  it("includes Style as a first-class production item type", () => {
    expect(methodItemType).toContain("Style");
  });
});
