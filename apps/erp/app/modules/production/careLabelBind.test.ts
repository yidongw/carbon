import { describe, expect, it } from "vitest";
import {
  normalizeScannedExternalCodes,
  validateCareLabelBulkBind
} from "./careLabelBind";

describe("normalizeScannedExternalCodes", () => {
  it("trims, drops empties, and de-dupes preserving first-seen order", () => {
    expect(
      normalizeScannedExternalCodes(["  A1 ", "B2", "A1", "", "C3", "B2"])
    ).toEqual(["A1", "B2", "C3"]);
  });
});

describe("validateCareLabelBulkBind", () => {
  it("accepts an exact unique EPC count", () => {
    expect(
      validateCareLabelBulkBind({
        rawExternalCodes: ["e1", "e2", "e3"],
        expectedCount: 3
      })
    ).toEqual({ ok: true, externalCodes: ["e1", "e2", "e3"] });
  });

  it("accepts PDA re-reads of the same chip when unique count matches", () => {
    expect(
      validateCareLabelBulkBind({
        rawExternalCodes: ["e1", "e2", "e1", "e2"],
        expectedCount: 2
      })
    ).toEqual({ ok: true, externalCodes: ["e1", "e2"] });
  });

  it("rejects too few unique chips", () => {
    expect(
      validateCareLabelBulkBind({
        rawExternalCodes: ["e1"],
        expectedCount: 3
      })
    ).toEqual({
      ok: false,
      reason: "tooFew",
      uniqueCount: 1,
      expectedCount: 3
    });
  });

  it("rejects too many unique chips", () => {
    expect(
      validateCareLabelBulkBind({
        rawExternalCodes: ["e1", "e2", "e3"],
        expectedCount: 2
      })
    ).toEqual({
      ok: false,
      reason: "tooMany",
      uniqueCount: 3,
      expectedCount: 2
    });
  });

  it("rejects empty scans", () => {
    expect(
      validateCareLabelBulkBind({
        rawExternalCodes: ["  ", ""],
        expectedCount: 2
      })
    ).toEqual({
      ok: false,
      reason: "empty",
      uniqueCount: 0,
      expectedCount: 2
    });
  });

  it("rejects when there are no system codes to bind", () => {
    expect(
      validateCareLabelBulkBind({
        rawExternalCodes: ["e1"],
        expectedCount: 0
      })
    ).toEqual({
      ok: false,
      reason: "noSystemCodes",
      uniqueCount: 0,
      expectedCount: 0
    });
  });
});
