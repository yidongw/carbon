import { describe, expect, it } from "vitest";
import {
  buildConfigTableEditorState,
  buildJobRemainingReferenceContext,
  buildProductionConfigTableReferenceContext,
  fillValueFromReference
} from "./configParamsTableColumns";

const parameters = [
  {
    key: "size",
    label: "Size",
    dataType: "list" as const,
    listOptions: ["M", "L", "XL"]
  },
  {
    key: "color",
    label: "Color",
    dataType: "list" as const,
    listOptions: ["红色", "蓝色"]
  }
];

describe("buildConfigTableEditorState", () => {
  const originalConfiguration = {
    configTable: [
      { color: "红色", size: "M", M: 14, L: 0, XL: 0 },
      { color: "蓝色", size: "XL", M: 0, L: 0, XL: 6 }
    ],
    configTablePrimaryKeys: ["M", "L", "XL"]
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
    expect(referenceByRowIndex[0]?.M).toBe(14);
    expect(referenceByRowIndex[1]?.XL).toBe(6);
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
          {
            configTable: [{ color: "红色", size: "M", M: 10, L: 0, XL: 0 }]
          }
        ]
      }
    });

    expect(referenceByRowIndex[0]?.M).toBe(4);
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
          {
            configTable: [{ color: "红色", size: "M", M: 16, L: 0, XL: 0 }]
          }
        ]
      }
    });

    expect(referenceByRowIndex[0]?.M).toBe(-2);
  });

  it("seeds current line values into original rows", () => {
    const { rows } = buildConfigTableEditorState({
      parameters,
      defaultQuantityLabel: "Quantities",
      currentConfiguration: {
        configTable: [{ color: "红色", size: "M", M: 3, L: 0, XL: 0 }]
      },
      referenceContext: {
        mode: "remaining",
        originalConfiguration,
        otherLineConfigurations: [
          {
            configTable: [{ color: "红色", size: "M", M: 10, L: 0, XL: 0 }]
          }
        ]
      }
    });

    expect(rows[0]?.M).toBe(3);
  });
});

describe("buildJobRemainingReferenceContext", () => {
  const jobConfiguration = {
    configTable: [{ color: "红色", size: "M", M: 14, L: 0, XL: 0 }],
    configTablePrimaryKeys: ["M", "L", "XL"]
  };

  it("computes remaining quantities from job target minus reported", () => {
    const referenceContext = buildJobRemainingReferenceContext({
      jobConfiguration,
      reportedConfigurations: [
        {
          configTable: [{ color: "红色", size: "M", M: 10, L: 0, XL: 0 }]
        }
      ]
    });

    const { referenceByRowIndex } = buildConfigTableEditorState({
      parameters,
      defaultQuantityLabel: "Quantities",
      currentConfiguration: { configTable: [] },
      referenceContext
    });

    expect(referenceByRowIndex[0]?.M).toBe(4);
  });

  it("uses pickup-based hints for an employee with pickups", () => {
    const referenceContext = buildJobRemainingReferenceContext(
      {
        jobConfiguration: {
          configTable: [{ color: "红色", size: "M", M: 100, L: 100, XL: 0 }],
          configTablePrimaryKeys: ["M", "L", "XL"]
        },
        reportedConfigurations: [
          {
            configTable: [{ color: "红色", size: "M", M: 50, L: 0, XL: 0 }]
          }
        ],
        pickupsByEmployee: {
          emp1: [
            {
              quantity: 1,
              configuration: {
                configTable: [{ color: "红色", size: "M", M: 0, L: 1, XL: 0 }]
              }
            }
          ]
        },
        reportedConfigurationsByEmployee: {
          emp1: [
            {
              configTable: [{ color: "红色", size: "M", M: 0, L: 0, XL: 0 }]
            }
          ]
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

    expect(referenceByRowIndex[0]?.M).toBe(0);
    expect(referenceByRowIndex[0]?.L).toBe(1);
    expect(referenceByRowIndex[0]?.XL).toBe(0);
  });

  it("reduces pickup hints by the employee's already reported quantity", () => {
    const referenceContext = buildJobRemainingReferenceContext(
      {
        jobConfiguration: {
          configTable: [{ color: "红色", size: "M", M: 100, L: 100, XL: 0 }],
          configTablePrimaryKeys: ["M", "L", "XL"]
        },
        reportedConfigurations: [],
        pickupsByEmployee: {
          emp1: [
            {
              quantity: 2,
              configuration: {
                configTable: [{ color: "红色", size: "M", M: 0, L: 2, XL: 0 }]
              }
            }
          ]
        },
        reportedConfigurationsByEmployee: {
          emp1: [
            {
              configTable: [{ color: "红色", size: "M", M: 0, L: 1, XL: 0 }]
            }
          ]
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

    expect(referenceByRowIndex[0]?.L).toBe(1);
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
      originalConfiguration: { configTable: [] },
      otherLineConfigurations: [],
      employeeId: "emp1",
      jobId: "job1",
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
