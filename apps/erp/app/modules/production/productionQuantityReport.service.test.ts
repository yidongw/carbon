import { describe, expect, it } from "vitest";
import { validateProductionQuantityLines } from "./productionQuantityReport.service";

describe("validateProductionQuantityLines", () => {
  it("accepts lines without configuration", () => {
    const result = validateProductionQuantityLines([
      { type: "Production", quantity: 10 }
    ]);
    expect(result.error).toBeNull();
  });

  it("rejects when configuration total does not match quantity", () => {
    const result = validateProductionQuantityLines([
      {
        type: "Production",
        quantity: 10,
        configuration: {
          configTable: [{ Quantities: 5 }],
          configTablePrimaryKeys: ["Quantities"]
        }
      }
    ]);
    expect(result.error).toBeInstanceOf(Error);
  });

  it("accepts multiple lines when each line configuration matches its quantity", () => {
    const result = validateProductionQuantityLines([
      {
        type: "Production",
        quantity: 13,
        configuration: {
          configTable: [{ Quantities: 13 }],
          configTablePrimaryKeys: ["Quantities"]
        }
      },
      {
        type: "Rework",
        quantity: 1
      }
    ]);
    expect(result.error).toBeNull();
  });

  it("rejects duplicate line types", () => {
    const result = validateProductionQuantityLines([
      { type: "Production", quantity: 5 },
      { type: "Production", quantity: 3 }
    ]);
    expect(result.error).toBeInstanceOf(Error);
  });

  it("rejects zero quantity lines", () => {
    const result = validateProductionQuantityLines([
      { type: "Production", quantity: 5 },
      { type: "Rework", quantity: 0 }
    ]);
    expect(result.error).toBeInstanceOf(Error);
  });

  it("clears scrap reason for non-scrap lines", () => {
    const result = validateProductionQuantityLines([
      {
        type: "Production",
        quantity: 5,
        scrapReasonId: "should-clear"
      }
    ]);
    expect(result.error).toBeNull();
  });
});
