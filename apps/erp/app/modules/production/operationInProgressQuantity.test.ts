import { describe, expect, it } from "vitest";
import { calculateInProgressQuantityByOperation } from "./operationInProgressQuantity";

describe("calculateInProgressQuantityByOperation", () => {
  it("subtracts production only for the same person", () => {
    const xlConfig = { configTable: [{ size: "XL", XL: 10 }] };
    const lConfig = { configTable: [{ size: "L", L: 20 }] };

    const result = calculateInProgressQuantityByOperation(
      [
        {
          jobOperationId: "op1",
          employeeId: "person-a",
          quantity: 10,
          configuration: xlConfig
        },
        {
          jobOperationId: "op1",
          employeeId: "person-b",
          quantity: 20,
          configuration: lConfig
        }
      ],
      [
        {
          jobOperationId: "op1",
          employeeId: "person-a",
          quantity: 5,
          configuration: xlConfig
        },
        {
          jobOperationId: "op1",
          employeeId: "person-c",
          quantity: 10,
          configuration: lConfig
        }
      ]
    );

    expect(result.get("op1")).toBe(25);
  });

  it("subtracts production for the same person even when configurations differ", () => {
    const result = calculateInProgressQuantityByOperation(
      [
        {
          jobOperationId: "op1",
          employeeId: "person-a",
          quantity: 2,
          configuration: {
            configTable: [{ L: 1, "4XL": 1 }],
            configTablePrimaryKeys: ["L", "4XL"]
          }
        }
      ],
      [
        {
          jobOperationId: "op1",
          employeeId: "person-a",
          quantity: 2,
          configuration: { configTable: [{ L: 1, "4XL": 1 }] }
        }
      ]
    );

    expect(result.get("op1")).toBe(0);
  });

  it("ignores production without a matching pickup for that actor", () => {
    const result = calculateInProgressQuantityByOperation(
      [
        {
          jobOperationId: "op1",
          employeeId: "person-b",
          quantity: 20
        }
      ],
      [
        {
          jobOperationId: "op1",
          employeeId: "person-c",
          quantity: 10
        }
      ]
    );

    expect(result.get("op1")).toBe(20);
  });
});
