import { describe, expect, it } from "vitest";
import { styleValidator } from "./style.models";

const validStyle = {
  id: "ST-001",
  readableId: "ST-001",
  revision: "A",
  name: "Runner Upper",
  replenishmentSystem: "Make" as const,
  defaultMethodType: "Make to Order" as const,
  itemTrackingType: "Inventory" as const,
  unitOfMeasureCode: "EA"
};

describe("styleValidator", () => {
  it("accepts a valid style", () => {
    const result = styleValidator.safeParse(validStyle);

    expect(result.success).toBe(true);
  });

  it("requires an id", () => {
    const result = styleValidator.safeParse({
      ...validStyle,
      id: ""
    });

    expect(result.success).toBe(false);
  });

  it("requires a revision", () => {
    const result = styleValidator.safeParse({
      ...validStyle,
      revision: ""
    });

    expect(result.success).toBe(false);
  });
});
