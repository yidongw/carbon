import { describe, expect, it } from "vitest";
import {
  buildStyleCuttingMethodOperation,
  getBundleJobCuttingOperationIdsToDelete,
  getParentJobNonCuttingOperationIdsToDelete,
  isStyleCuttingOperation,
  isStyleCuttingOperationFirst,
  isStyleSystemOwnedOperation,
  STYLE_CUTTING_OPERATION_TAG,
  STYLE_CUTTING_PROCESS_TAG,
  STYLE_SYSTEM_OPERATION_TAG
} from "./styleMethod.service";

describe("isStyleCuttingOperation", () => {
  it("accepts cutting operations tagged by the style scaffold", () => {
    expect(
      isStyleCuttingOperation({
        tags: [STYLE_CUTTING_OPERATION_TAG, STYLE_SYSTEM_OPERATION_TAG],
        customFields: null
      })
    ).toBe(true);
  });

  it("accepts legacy operations marked in custom fields", () => {
    expect(
      isStyleCuttingOperation({
        tags: null,
        customFields: {
          styleStage: "cutting"
        }
      })
    ).toBe(true);
  });

  it("rejects ordinary downstream operations", () => {
    expect(
      isStyleCuttingOperation({
        tags: ["sewing"],
        customFields: {
          styleStage: "downstream"
        }
      })
    ).toBe(false);
  });
});

describe("buildStyleCuttingMethodOperation", () => {
  it("builds a seeded cutting operation with style tags and metadata", () => {
    const operation = buildStyleCuttingMethodOperation({
      makeMethodId: "mm-1",
      processId: "proc-1",
      companyId: "co-1",
      createdBy: "user-1",
      order: 0
    });

    expect(operation).toEqual(
      expect.objectContaining({
        makeMethodId: "mm-1",
        processId: "proc-1",
        description: "Cutting",
        operationType: "Inside",
        order: 0,
        tags: expect.arrayContaining([
          STYLE_CUTTING_OPERATION_TAG,
          STYLE_SYSTEM_OPERATION_TAG
        ]),
        customFields: expect.objectContaining({
          styleStage: "cutting",
          styleSystemOwned: true
        })
      })
    );
  });
});

describe("isStyleCuttingOperationFirst", () => {
  it("accepts methods where cutting is already the earliest operation", () => {
    expect(
      isStyleCuttingOperationFirst([
        {
          id: "op-cut",
          order: 5,
          tags: [STYLE_CUTTING_OPERATION_TAG],
          customFields: null
        },
        {
          id: "op-sew",
          order: 10,
          tags: ["sewing"],
          customFields: null
        }
      ])
    ).toBe(true);
  });

  it("rejects methods where a downstream operation moves ahead of cutting", () => {
    expect(
      isStyleCuttingOperationFirst([
        {
          id: "op-cut",
          order: 10,
          tags: [STYLE_CUTTING_OPERATION_TAG],
          customFields: null
        },
        {
          id: "op-sew",
          order: 5,
          tags: ["sewing"],
          customFields: null
        }
      ])
    ).toBe(false);
  });
});

describe("isStyleSystemOwnedOperation", () => {
  it("identifies protected scaffold operations", () => {
    expect(
      isStyleSystemOwnedOperation({
        tags: [STYLE_SYSTEM_OPERATION_TAG],
        customFields: null
      })
    ).toBe(true);
  });

  it("rejects editable downstream operations", () => {
    expect(
      isStyleSystemOwnedOperation({
        tags: ["sewing"],
        customFields: {
          styleSystemOwned: false
        }
      })
    ).toBe(false);
  });
});

describe("getBundleJobCuttingOperationIdsToDelete", () => {
  it("removes tagged cutting operations before downstream work starts", () => {
    expect(
      getBundleJobCuttingOperationIdsToDelete({
        operations: [
          {
            id: "op-cut",
            processId: "proc-cut",
            order: 0,
            tags: [STYLE_CUTTING_OPERATION_TAG],
            customFields: null
          },
          {
            id: "op-sew",
            processId: "proc-sew",
            order: 1,
            tags: [],
            customFields: null
          }
        ]
      })
    ).toEqual(["op-cut"]);
  });

  it("falls back to the parent cutting process when the copied job lost tags", () => {
    expect(
      getBundleJobCuttingOperationIdsToDelete({
        cuttingProcessId: "proc-cut",
        operations: [
          {
            id: "op-cut",
            processId: "proc-cut",
            order: 5,
            tags: [],
            customFields: null
          },
          {
            id: "op-sew",
            processId: "proc-sew",
            order: 10,
            tags: [],
            customFields: null
          }
        ]
      })
    ).toEqual(["op-cut"]);
  });

  it("falls back to the first copied operation when no other boundary marker exists", () => {
    expect(
      getBundleJobCuttingOperationIdsToDelete({
        operations: [
          {
            id: "op-first",
            processId: "proc-1",
            order: 1,
            tags: [],
            customFields: null
          },
          {
            id: "op-second",
            processId: "proc-2",
            order: 2,
            tags: [],
            customFields: null
          }
        ]
      })
    ).toEqual(["op-first"]);
  });
});

describe("getParentJobNonCuttingOperationIdsToDelete", () => {
  it("removes every non-cutting operation when a tagged cutting step exists", () => {
    expect(
      getParentJobNonCuttingOperationIdsToDelete({
        operations: [
          {
            id: "op-cut",
            order: 0,
            tags: [STYLE_CUTTING_OPERATION_TAG],
            customFields: null
          },
          {
            id: "op-sew",
            order: 1,
            tags: [],
            customFields: null
          },
          {
            id: "op-pack",
            order: 2,
            tags: [],
            customFields: null
          }
        ]
      })
    ).toEqual(["op-sew", "op-pack"]);
  });

  it("keeps the first operation when no cutting marker exists", () => {
    expect(
      getParentJobNonCuttingOperationIdsToDelete({
        operations: [
          {
            id: "op-first",
            order: 0,
            tags: [],
            customFields: null
          },
          {
            id: "op-second",
            order: 1,
            tags: [],
            customFields: null
          },
          {
            id: "op-third",
            order: 2,
            tags: [],
            customFields: null
          }
        ]
      })
    ).toEqual(["op-second", "op-third"]);
  });
});

describe("style process tags", () => {
  it("keeps a distinct process-level tag for the seeded cutting process", () => {
    expect(STYLE_CUTTING_PROCESS_TAG).toBe("style:cutting-process");
  });
});
