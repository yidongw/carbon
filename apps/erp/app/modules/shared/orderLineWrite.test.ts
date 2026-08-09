import { describe, expect, it } from "vitest";
import { sanitizeOrderLineWriteRow } from "./orderLineWrite";

describe("sanitizeOrderLineWriteRow", () => {
  it("strips FormData-only variantQuantities and legacy serviceId", () => {
    expect(
      sanitizeOrderLineWriteRow({
        itemId: "item_1",
        variantQuantities: '{"variantTable":[]}',
        serviceId: "legacy",
        description: "ok"
      })
    ).toEqual({
      itemId: "item_1",
      description: "ok"
    });
  });

  it("coerces empty strings to null for optional FKs/dates", () => {
    expect(
      sanitizeOrderLineWriteRow({
        itemId: "item_1",
        locationId: "",
        requiredDate: ""
      })
    ).toEqual({
      itemId: "item_1",
      locationId: null,
      requiredDate: null
    });
  });
});
