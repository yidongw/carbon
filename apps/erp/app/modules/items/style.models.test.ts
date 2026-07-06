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
  unitOfMeasureCode: "EA",
  colorName: "Black",
  colorCode: "BLK"
};

describe("styleValidator", () => {
  it("accepts a style with required color fields", () => {
    const result = styleValidator.safeParse(validStyle);

    expect(result.success).toBe(true);
  });

  it("requires a color name", () => {
    const result = styleValidator.safeParse({
      ...validStyle,
      colorName: ""
    });

    expect(result.success).toBe(false);
  });

  it("requires a color code", () => {
    const result = styleValidator.safeParse({
      ...validStyle,
      colorCode: ""
    });

    expect(result.success).toBe(false);
  });
});
