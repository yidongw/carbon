import { describe, expect, it } from "vitest";
import { mergeMasterProcessDescriptions } from "./masterProcessDescriptions";

describe("mergeMasterProcessDescriptions", () => {
  it("keeps Style BOP order and drops duplicates from job ops", () => {
    expect(
      mergeMasterProcessDescriptions(["裁剪", "缝制"], ["裁剪", "缝制", "缝制"])
    ).toEqual(["裁剪", "缝制"]);
  });

  it("shows sewing from Style even when only cutting exists on the master job", () => {
    expect(mergeMasterProcessDescriptions(["裁剪", "缝制"], ["裁剪"])).toEqual([
      "裁剪",
      "缝制"
    ]);
  });

  it("falls back to master ∪ bundle descriptions when Style BOP is empty", () => {
    expect(mergeMasterProcessDescriptions([], ["裁剪", "缝制"])).toEqual([
      "裁剪",
      "缝制"
    ]);
  });

  it("appends job-only prep that is not on the Style root method", () => {
    expect(
      mergeMasterProcessDescriptions(["裁剪", "缝制"], ["裁剪", "印染"])
    ).toEqual(["裁剪", "缝制", "印染"]);
  });

  it("counts a cutting-only Style as one process", () => {
    expect(mergeMasterProcessDescriptions(["Cutting"], ["Cutting"])).toEqual([
      "Cutting"
    ]);
  });
});
