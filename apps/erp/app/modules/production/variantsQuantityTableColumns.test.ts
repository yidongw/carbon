import { describe, expect, it } from "vitest";
import {
  buildJobRemainingReferenceContext,
  buildProductionVariantsQuantityReferenceContext,
  buildVariantsQuantityEditorState,
  fillValueFromReference
} from "./variantsQuantityTableColumns";

// Combo model: the synthesized list param carries optionVariantItemLabels
// (variantItemId -> display label). Each cell is { variantItemId, Quantities }
// and merges by variantItemId.
const parameters = [
  {
    key: "variantCombo",
    label: "Attributes",
    dataType: "list" as const,
    listOptions: [],
    optionVariantItemLabels: {
      iav_hm: "红色 · M",
      iav_hl: "红色 · L",
      iav_bx: "蓝色 · XL"
    }
  }
];

describe("buildVariantsQuantityEditorState", () => {
  const originalVariantTable = {
    variantTable: [
      { variantItemId: "iav_hm", Quantities: 14 },
      { variantItemId: "iav_bx", Quantities: 6 }
    ]
  };

  it("shows original reported quantities for Production mode", () => {
    const { rows, referenceByRowIndex } = buildVariantsQuantityEditorState({
      parameters,
      defaultQuantityLabel: "Quantities",
      currentVariantQuantities: { variantTable: [] },
      referenceContext: {
        mode: "original",
        originalVariantTable,
        otherLineVariantTables: []
      }
    });

    expect(rows).toHaveLength(2);
    expect(referenceByRowIndex[0]?.Quantities).toBe(14);
    expect(referenceByRowIndex[1]?.Quantities).toBe(6);
  });

  it("shows remaining quantities for Rework mode", () => {
    const { referenceByRowIndex } = buildVariantsQuantityEditorState({
      parameters,
      defaultQuantityLabel: "Quantities",
      currentVariantQuantities: { variantTable: [] },
      referenceContext: {
        mode: "remaining",
        originalVariantTable,
        otherLineVariantTables: [
          { variantTable: [{ variantItemId: "iav_hm", Quantities: 10 }] }
        ]
      }
    });

    expect(referenceByRowIndex[0]?.Quantities).toBe(4);
  });

  it("can show negative remaining when over-allocated", () => {
    const { referenceByRowIndex } = buildVariantsQuantityEditorState({
      parameters,
      defaultQuantityLabel: "Quantities",
      currentVariantQuantities: { variantTable: [] },
      referenceContext: {
        mode: "remaining",
        originalVariantTable,
        otherLineVariantTables: [
          { variantTable: [{ variantItemId: "iav_hm", Quantities: 16 }] }
        ]
      }
    });

    expect(referenceByRowIndex[0]?.Quantities).toBe(-2);
  });

  it("seeds current line values into original rows (keyed by variantItemId)", () => {
    const { rows } = buildVariantsQuantityEditorState({
      parameters,
      defaultQuantityLabel: "Quantities",
      currentVariantQuantities: {
        variantTable: [{ variantItemId: "iav_hm", Quantities: 3 }]
      },
      referenceContext: {
        mode: "remaining",
        originalVariantTable,
        otherLineVariantTables: [
          { variantTable: [{ variantItemId: "iav_hm", Quantities: 10 }] }
        ]
      }
    });

    expect(rows[0]?.variantItemId).toBe("iav_hm");
    expect(rows[0]?.Quantities).toBe(3);
  });
});

describe("buildJobRemainingReferenceContext", () => {
  const jobVariantTable = {
    variantTable: [{ variantItemId: "iav_hm", Quantities: 14 }]
  };

  it("computes remaining quantities from job target minus reported", () => {
    const referenceContext = buildJobRemainingReferenceContext({
      jobVariantTable,
      reportedVariantQuantities: [
        { variantTable: [{ variantItemId: "iav_hm", Quantities: 10 }] }
      ]
    });

    const { referenceByRowIndex } = buildVariantsQuantityEditorState({
      parameters,
      defaultQuantityLabel: "Quantities",
      currentVariantQuantities: { variantTable: [] },
      referenceContext
    });

    expect(referenceByRowIndex[0]?.Quantities).toBe(4);
  });

  it("uses pickup-based hints for an employee with pickups", () => {
    const referenceContext = buildJobRemainingReferenceContext(
      {
        jobVariantTable: {
          variantTable: [
            { variantItemId: "iav_hm", Quantities: 100 },
            { variantItemId: "iav_hl", Quantities: 100 }
          ]
        },
        reportedVariantQuantities: [
          { variantTable: [{ variantItemId: "iav_hm", Quantities: 50 }] }
        ],
        pickupsByEmployee: {
          emp1: [
            {
              quantity: 1,
              variantQuantities: {
                variantTable: [{ variantItemId: "iav_hl", Quantities: 1 }]
              }
            }
          ]
        },
        reportedVariantQuantitiesByEmployee: {
          emp1: [{ variantTable: [{ variantItemId: "iav_hm", Quantities: 0 }] }]
        }
      },
      { employeeId: "emp1" }
    );

    const { referenceByRowIndex } = buildVariantsQuantityEditorState({
      parameters,
      defaultQuantityLabel: "Quantities",
      currentVariantQuantities: { variantTable: [] },
      referenceContext
    });

    // Row 0 = iav_hm (picked up 0), row 1 = iav_hl (picked up 1).
    expect(referenceByRowIndex[0]?.Quantities).toBe(0);
    expect(referenceByRowIndex[1]?.Quantities).toBe(1);
  });

  it("reduces pickup hints by the employee's already reported quantity", () => {
    const referenceContext = buildJobRemainingReferenceContext(
      {
        jobVariantTable: {
          variantTable: [{ variantItemId: "iav_hl", Quantities: 100 }]
        },
        reportedVariantQuantities: [],
        pickupsByEmployee: {
          emp1: [
            {
              quantity: 2,
              variantQuantities: {
                variantTable: [{ variantItemId: "iav_hl", Quantities: 2 }]
              }
            }
          ]
        },
        reportedVariantQuantitiesByEmployee: {
          emp1: [{ variantTable: [{ variantItemId: "iav_hl", Quantities: 1 }] }]
        }
      },
      { employeeId: "emp1" }
    );

    const { referenceByRowIndex } = buildVariantsQuantityEditorState({
      parameters,
      defaultQuantityLabel: "Quantities",
      currentVariantQuantities: { variantTable: [] },
      referenceContext
    });

    expect(referenceByRowIndex[0]?.Quantities).toBe(1);
  });
});

describe("buildProductionVariantsQuantityReferenceContext", () => {
  it("defers pickup loading to the server when job and operation are known", () => {
    const context = buildProductionVariantsQuantityReferenceContext({
      source: {
        jobVariantTable: { variantTable: [] },
        reportedVariantQuantities: []
      },
      employeeId: "emp1",
      jobId: "job1",
      jobOperationId: "op1"
    });

    expect(context).toEqual({
      mode: "remaining",
      originalVariantTable: null,
      otherLineVariantTables: [],
      employeeId: "emp1",
      jobId: "job1",
      jobOperationId: "op1",
      siblingLineVariantQuantities: []
    });
  });

  it("defers pickup loading when only job operation is known", () => {
    const context = buildProductionVariantsQuantityReferenceContext({
      source: {
        jobVariantTable: {
          variantTable: [{ variantItemId: "iav_hm", Quantities: 100 }]
        },
        reportedVariantQuantities: [],
        pickupsByEmployee: {
          emp1: [{ quantity: 1, variantQuantities: { variantTable: [] } }]
        }
      },
      employeeId: "emp1",
      jobOperationId: "op1"
    });

    expect(context).toEqual({
      mode: "remaining",
      originalVariantTable: null,
      otherLineVariantTables: [],
      employeeId: "emp1",
      jobId: undefined,
      jobOperationId: "op1",
      siblingLineVariantQuantities: []
    });
  });
});

describe("fillValueFromReference", () => {
  it("clamps negative references to zero", () => {
    expect(fillValueFromReference(-2)).toBe(0);
    expect(fillValueFromReference(4)).toBe(4);
  });
});

describe("getVariantsQuantityCells", () => {
  // variantItemId -> display label (the synthesized param's label map).
  const optionVariantItemLabels = {
    iav_bk_s: "黑色 · S",
    iav_rd_m: "红色 · M"
  };

  it("labels variantItemId + Quantities cells from the param's label map", async () => {
    const { getVariantsQuantityCells } = await import(
      "./variantsQuantityTableColumns"
    );
    const cells = getVariantsQuantityCells(
      {
        variantTable: [
          { variantItemId: "iav_bk_s", Quantities: 6 },
          { variantItemId: "iav_rd_m", Quantities: 2 }
        ]
      },
      optionVariantItemLabels
    );
    expect(cells).toEqual([
      { key: "0:Quantities", label: "黑色 · S", quantity: 6 },
      { key: "1:Quantities", label: "红色 · M", quantity: 2 }
    ]);
  });

  it("falls back to the raw variantItemId when no label map is given", async () => {
    const { getVariantsQuantityCells, variantsQuantityToComboRows } =
      await import("./variantsQuantityTableColumns");
    const configuration = {
      variantTable: [{ variantItemId: "iav_bk_s", Quantities: 4 }]
    };
    expect(getVariantsQuantityCells(configuration)).toEqual([
      { key: "0:Quantities", label: "iav_bk_s", quantity: 4 }
    ]);
    expect(variantsQuantityToComboRows(configuration)).toEqual([
      { variantItemId: "iav_bk_s", Quantities: 4 }
    ]);
  });

  it("variantsQuantityToComboRows labels rows from the param's label map", async () => {
    const { variantsQuantityToComboRows } = await import(
      "./variantsQuantityTableColumns"
    );
    expect(
      variantsQuantityToComboRows(
        {
          variantTable: [{ variantItemId: "iav_bk_s", Quantities: 6 }]
        },
        { iav_bk_s: "黑色 · S" }
      )
    ).toEqual([
      { variantItemId: "iav_bk_s", Quantities: 6, label: "黑色 · S" }
    ]);
  });
});
