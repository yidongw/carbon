import { describe, expect, it } from "vitest";
import {
  getJobTableItemTypes,
  jobSelectableItemTypes
} from "./jobSelectableItemTypes";

describe("jobSelectableItemTypes", () => {
  it("includes style alongside the existing job-capable item types", () => {
    expect(jobSelectableItemTypes).toEqual(["Part", "Style", "Tool"]);
  });

  it("filters job table item types to the supported production set", () => {
    expect(getJobTableItemTypes("Part")).toBe(true);
    expect(getJobTableItemTypes("Style")).toBe(true);
    expect(getJobTableItemTypes("Tool")).toBe(true);
    expect(getJobTableItemTypes("Material")).toBe(false);
  });
});
