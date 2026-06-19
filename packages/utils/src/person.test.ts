import { describe, expect, it } from "vitest";
import { formatPersonName } from "./person";

describe("formatPersonName", () => {
  it("formats first name first by default", () => {
    expect(
      formatPersonName({ firstName: "Wei", lastName: "Zhang" })
    ).toBe("Wei Zhang");
  });

  it("formats last name first when enabled", () => {
    expect(
      formatPersonName({ firstName: "Wei", lastName: "Zhang" }, true)
    ).toBe("Zhang Wei");
  });

  it("handles missing first or last name", () => {
    expect(formatPersonName({ firstName: "Wei", lastName: null })).toBe("Wei");
    expect(formatPersonName({ firstName: null, lastName: "Zhang" }, true)).toBe(
      "Zhang"
    );
  });

  it("falls back to fullName when parts are missing", () => {
    expect(formatPersonName({ fullName: "Wei Zhang" })).toBe("Wei Zhang");
  });
});
