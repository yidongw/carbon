import { describe, expect, it } from "vitest";
import {
  buildConfigTableEditorState,
  buildJobRemainingReferenceContext,
  buildProductionConfigTableReferenceContext,
  fillValueFromReference
} from "./configParamsTableColumns";

// Combo model: a single valuesKey list param; each row is { valuesKey, Quantities }.
const parameters = [
  {
    key: "valuesKey",
    label: "Attributes",
    dataType: "list" as const,
    listOptions: ["红色|M", "红色|L", "蓝色|XL"]
  }
];

describe("buildConfigTableEditorState", () => {
  const originalConfiguration = {
    configTable: [
      { valuesKey: "红色|M", Quantities: 14 },
      { valuesKey: "蓝色|XL", Quantities: 6 }
    ]
  };

  it("shows original reported quantities for Production mode", () => {
    const { rows, referenceByRowIndex } = buildConfigTableEditorState({
      parameters,
      defaultQuantityLabel: "Quantities",
      currentConfiguration: { configTable: [] },
      referenceContext: {
        mode: "original",
        originalConfiguration,
        otherLineConfigurations: []
      }
    });

    expect(rows).toHaveLength(2);
    expect(referenceByRowIndex[0]?.Quantities).toBe(14);
    expect(referenceByRowIndex[1]?.Quantities).toBe(6);
  });

  it("shows remaining quantities for Rework mode", () => {
    const { referenceByRowIndex } = buildConfigTableEditorState({
      parameters,
      defaultQuantityLabel: "Quantities",
      currentConfiguration: { configTable: [] },
      referenceContext: {
        mode: "remaining",
        originalConfiguration,
        otherLineConfigurations: [
          { configTable: [{ valuesKey: "红色|M", Quantities: 10 }] }
        ]
      }
    });

    expect(referenceByRowIndex[0]?.Quantities).toBe(4);
  });

  it("can show negative remaining when over-allocated", () => {
    const { referenceByRowIndex } = buildConfigTableEditorState({
      parameters,
      defaultQuantityLabel: "Quantities",
      currentConfiguration: { configTable: [] },
      referenceContext: {
        mode: "remaining",
        originalConfiguration,
        otherLineConfigurations: [
          { configTable: [{ valuesKey: "红色|M", Quantities: 16 }] }
        ]
      }
    });

    expect(referenceByRowIndex[0]?.Quantities).toBe(-2);
  });

  it("seeds current line values into original rows", () => {
    const { rows } = buildConfigTableEditorState({
      parameters,
      defaultQuantityLabel: "Quantities",
      currentConfiguration: {
        configTable: [{ valuesKey: "红色|M", Quantities: 3 }]
      },
      referenceContext: {
        mode: "remaining",
        originalConfiguration,
        otherLineConfigurations: [
          { configTable: [{ valuesKey: "红色|M", Quantities: 10 }] }
        ]
      }
    });

    expect(rows[0]?.Quantities).toBe(3);
  });
});

describe("buildJobRemainingReferenceContext", () => {
  const jobConfiguration = {
    configTable: [{ valuesKey: "红色|M", Quantities: 14 }]
  };

  it("computes remaining quantities from job target minus reported", () => {
    const referenceContext = buildJobRemainingReferenceContext({
      jobConfiguration,
      reportedConfigurations: [
        { configTable: [{ valuesKey: "红色|M", Quantities: 10 }] }
      ]
    });

    const { referenceByRowIndex } = buildConfigTableEditorState({
      parameters,
      defaultQuantityLabel: "Quantities",
      currentConfiguration: { configTable: [] },
      referenceContext
    });

    expect(referenceByRowIndex[0]?.Quantities).toBe(4);
  });

  it("uses pickup-based hints for an employee with pickups", () => {
    const referenceContext = buildJobRemainingReferenceContext(
      {
        jobConfiguration: {
          configTable: [
            { valuesKey: "红色|M", Quantities: 100 },
            { valuesKey: "红色|L", Quantities: 100 }
          ]
        },
        reportedConfigurations: [
          { configTable: [{ valuesKey: "红色|M", Quantities: 50 }] }
        ],
        pickupsByEmployee: {
          emp1: [
            {
              quantity: 1,
              configuration: {
                configTable: [{ valuesKey: "红色|L", Quantities: 1 }]
              }
            }
          ]
        },
        reportedConfigurationsByEmployee: {
          emp1: [{ configTable: [{ valuesKey: "红色|M", Quantities: 0 }] }]
        }
      },
      { employeeId: "emp1" }
    );

    const { referenceByRowIndex } = buildConfigTableEditorState({
      parameters,
      defaultQuantityLabel: "Quantities",
      currentConfiguration: { configTable: [] },
      referenceContext
    });

    // Row 0 = 红色|M (picked up 0), row 1 = 红色|L (picked up 1).
    expect(referenceByRowIndex[0]?.Quantities).toBe(0);
    expect(referenceByRowIndex[1]?.Quantities).toBe(1);
  });

  it("reduces pickup hints by the employee's already reported quantity", () => {
    const referenceContext = buildJobRemainingReferenceContext(
      {
        jobConfiguration: {
          configTable: [{ valuesKey: "红色|L", Quantities: 100 }]
        },
        reportedConfigurations: [],
        pickupsByEmployee: {
          emp1: [
            {
              quantity: 2,
              configuration: {
                configTable: [{ valuesKey: "红色|L", Quantities: 2 }]
              }
            }
          ]
        },
        reportedConfigurationsByEmployee: {
          emp1: [{ configTable: [{ valuesKey: "红色|L", Quantities: 1 }] }]
        }
      },
      { employeeId: "emp1" }
    );

    const { referenceByRowIndex } = buildConfigTableEditorState({
      parameters,
      defaultQuantityLabel: "Quantities",
      currentConfiguration: { configTable: [] },
      referenceContext
    });

    expect(referenceByRowIndex[0]?.Quantities).toBe(1);
  });
});

describe("buildProductionConfigTableReferenceContext", () => {
  it("defers pickup loading to the server when job and operation are known", () => {
    const context = buildProductionConfigTableReferenceContext({
      source: {
        jobConfiguration: { configTable: [] },
        reportedConfigurations: []
      },
      employeeId: "emp1",
      jobId: "job1",
      jobOperationId: "op1"
    });

    expect(context).toEqual({
      mode: "remaining",
      originalConfiguration: null,
      otherLineConfigurations: [],
      employeeId: "emp1",
      jobId: "job1",
      jobOperationId: "op1",
      siblingLineConfigurations: []
    });
  });

  it("defers pickup loading when only job operation is known", () => {
    const context = buildProductionConfigTableReferenceContext({
      source: {
        jobConfiguration: {
          configTable: [{ color: "红色", size: "M", M: 100, L: 100, XL: 0 }]
        },
        reportedConfigurations: [],
        pickupsByEmployee: {
          emp1: [{ quantity: 1, configuration: { configTable: [] } }]
        }
      },
      employeeId: "emp1",
      jobOperationId: "op1"
    });

    expect(context).toEqual({
      mode: "remaining",
      originalConfiguration: null,
      otherLineConfigurations: [],
      employeeId: "emp1",
      jobId: undefined,
      jobOperationId: "op1",
      siblingLineConfigurations: []
    });
  });
});

describe("fillValueFromReference", () => {
  it("clamps negative references to zero", () => {
    expect(fillValueFromReference(-2)).toBe(0);
    expect(fillValueFromReference(4)).toBe(4);
  });
});

describe("getConfigQuantityCells", () => {
  it("labels combo valuesKey + Quantities rows", async () => {
    const { getConfigQuantityCells } = await import(
      "./configParamsTableColumns"
    );
    const cells = getConfigQuantityCells(
      {
        configTable: [
          { valuesKey: "BK|S", label: "BK · S", Quantities: 6 },
          { valuesKey: "RD|M", Quantities: 2 }
        ]
      },
      { BK: "黑色", RD: "红色" }
    );
    expect(cells).toEqual([
      { key: "0:Quantities", label: "BK · S", quantity: 6 },
      { key: "1:Quantities", label: "红色 · M", quantity: 2 }
    ]);
  });

  it("reads combo rows when configTablePrimaryKeys is omitted", async () => {
    const { getConfigQuantityCells, configTableToComboRows } = await import(
      "./configParamsTableColumns"
    );
    const configuration = {
      configTable: [{ valuesKey: "BK|S", Quantities: 4 }]
    };
    expect(getConfigQuantityCells(configuration, { BK: "黑色" })).toEqual([
      { key: "0:Quantities", label: "黑色 · S", quantity: 4 }
    ]);
    expect(configTableToComboRows(configuration)).toEqual([
      { valuesKey: "BK|S", Quantities: 4, label: "BK · S" }
    ]);
  });

  it("configTableToComboRows passes through combo rows", async () => {
    const { configTableToComboRows } = await import(
      "./configParamsTableColumns"
    );
    expect(
      configTableToComboRows(
        {
          configTable: [{ valuesKey: "BK|S", Quantities: 6 }]
        },
        { BK: "黑色", S: "S" }
      )
    ).toEqual([{ valuesKey: "BK|S", Quantities: 6, label: "黑色 · S" }]);
  });
});
