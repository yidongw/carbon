import { describe, expect, it } from "vitest";
import {
  buildStyleCuttingMethodOperation,
  classifyGarmentJobItems,
  getBundleJobCuttingOperationIdsToDelete,
  getParentJobNonCuttingOperationIdsToDelete,
  isStyleCuttingOperation,
  isStyleCuttingOperationFirst,
  isStyleSystemOwnedOperation,
  resolveStyleMethodItemId,
  STYLE_CUTTING_OPERATION_TAG,
  STYLE_CUTTING_PROCESS_TAG,
  STYLE_SYSTEM_OPERATION_TAG,
  sequenceGarmentJobOperations
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

describe("resolveStyleMethodItemId", () => {
  it("returns the parent Style id when the item is a variant SKU", async () => {
    const client = {
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: { parentItemId: "style-parent" },
                error: null
              })
            })
          })
        })
      })
    };
    expect(
      await resolveStyleMethodItemId(client as never, {
        itemId: "variant-sku",
        companyId: "co"
      })
    ).toBe("style-parent");
  });

  it("returns the item id when it is not a variant SKU", async () => {
    const client = {
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: null, error: null })
            })
          })
        })
      })
    };
    expect(
      await resolveStyleMethodItemId(client as never, {
        itemId: "style-parent",
        companyId: "co"
      })
    ).toBe("style-parent");
  });
});

describe("style process tags", () => {
  it("keeps a distinct process-level tag for the seeded cutting process", () => {
    expect(STYLE_CUTTING_PROCESS_TAG).toBe("style:cutting-process");
  });
});

describe("classifyGarmentJobItems", () => {
  // Style 110 job tree:
  //   root method (mmRoot): ops cut(cutting) + sew; materials fabric(→cut, null),
  //     trim(→sew), applique(→sew, made)
  //   nested mmFabric (off fabric): op dye(印染); material greige
  //   nested mmApplique (off applique): op embroider
  const cuttingTags = [STYLE_CUTTING_OPERATION_TAG, STYLE_SYSTEM_OPERATION_TAG];

  const scenario = {
    operations: [
      { id: "cut", order: 0, tags: cuttingTags, jobMakeMethodId: "mmRoot" },
      { id: "sew", order: 1, tags: [], jobMakeMethodId: "mmRoot" },
      { id: "dye", order: 0, tags: [], jobMakeMethodId: "mmFabric" },
      { id: "embroider", order: 0, tags: [], jobMakeMethodId: "mmApplique" }
    ],
    materials: [
      // fabric consumed at cutting by default (no explicit operation) → master
      { id: "fabric", jobMakeMethodId: "mmRoot", jobOperationId: null },
      // trim explicitly consumed at sewing → bundle
      { id: "trim", jobMakeMethodId: "mmRoot", jobOperationId: "sew" },
      // made applique consumed at sewing → bundle
      { id: "applique", jobMakeMethodId: "mmRoot", jobOperationId: "sew" },
      // greige lives inside the fabric sub-assembly → follows it
      { id: "greige", jobMakeMethodId: "mmFabric", jobOperationId: null }
    ],
    makeMethods: [
      { id: "mmRoot", parentMaterialId: null },
      { id: "mmFabric", parentMaterialId: "fabric" },
      { id: "mmApplique", parentMaterialId: "applique" }
    ]
  };

  it("routes cutting + fabric prep to master, sewing + its inputs to bundle", () => {
    const { operationHome, materialHome, nestedMakeMethodHome } =
      classifyGarmentJobItems(scenario);

    // Operations
    expect(operationHome.get("cut")).toBe("master");
    expect(operationHome.get("sew")).toBe("bundle");
    expect(operationHome.get("dye")).toBe("master"); // fabric consumed at cutting
    expect(operationHome.get("embroider")).toBe("bundle"); // applique at sewing

    // Materials
    expect(materialHome.get("fabric")).toBe("master"); // default → cutting
    expect(materialHome.get("greige")).toBe("master"); // inside fabric sub-assembly
    expect(materialHome.get("trim")).toBe("bundle"); // consumed at sewing
    expect(materialHome.get("applique")).toBe("bundle"); // consumed at sewing

    // Nested make methods
    expect(nestedMakeMethodHome.get("mmFabric")).toBe("master");
    expect(nestedMakeMethodHome.get("mmApplique")).toBe("bundle");
  });

  it("routes unassigned root-method materials (jobOperationId null) to master", () => {
    // A top-level BOM material with no assigned consuming operation arrives with
    // jobOperationId = null and must consume on the master (once). Materials the
    // author DID assign to an operation follow that op's home (covered by the
    // "sewing + its inputs to bundle" test above).
    const { materialHome, nestedMakeMethodHome } = classifyGarmentJobItems({
      operations: [
        { id: "cut", order: 0, tags: cuttingTags, jobMakeMethodId: "mmRoot" },
        { id: "sew", order: 1, tags: [], jobMakeMethodId: "mmRoot" },
        { id: "dye", order: 0, tags: [], jobMakeMethodId: "mmFabric" }
      ],
      materials: [
        { id: "fabric", jobMakeMethodId: "mmRoot", jobOperationId: null },
        { id: "trim", jobMakeMethodId: "mmRoot", jobOperationId: null },
        { id: "thread", jobMakeMethodId: "mmRoot", jobOperationId: null },
        // greige lives inside the fabric sub-assembly → follows it to master
        { id: "greige", jobMakeMethodId: "mmFabric", jobOperationId: null }
      ],
      makeMethods: [
        { id: "mmRoot", parentMaterialId: null },
        { id: "mmFabric", parentMaterialId: "fabric" }
      ]
    });
    for (const id of ["fabric", "trim", "thread", "greige"]) {
      expect(materialHome.get(id)).toBe("master");
    }
    expect(nestedMakeMethodHome.get("mmFabric")).toBe("master");
  });

  it("preserves legacy behaviour for a plain style with no sub-assemblies", () => {
    const { operationHome, materialHome } = classifyGarmentJobItems({
      operations: [
        { id: "cut", order: 0, tags: cuttingTags, jobMakeMethodId: "mmRoot" },
        { id: "sew", order: 1, tags: [], jobMakeMethodId: "mmRoot" }
      ],
      materials: [
        { id: "fabric", jobMakeMethodId: "mmRoot", jobOperationId: null }
      ],
      makeMethods: [{ id: "mmRoot", parentMaterialId: null }]
    });
    expect(operationHome.get("cut")).toBe("master");
    expect(operationHome.get("sew")).toBe("bundle");
    // fabric now belongs only to the master (was previously double-consumed)
    expect(materialHome.get("fabric")).toBe("master");
  });

  it("identifies cutting by cuttingProcessId when no op is tagged", () => {
    // get-method may have created the job before cutting tags were carried across,
    // so no op carries the tag; the threaded cuttingProcessId pins cutting instead.
    const { operationHome } = classifyGarmentJobItems({
      operations: [
        {
          id: "a",
          order: 5,
          tags: [],
          processId: "sew-proc",
          jobMakeMethodId: "mmRoot"
        },
        {
          id: "b",
          order: 1,
          tags: [],
          processId: "cut-proc",
          jobMakeMethodId: "mmRoot"
        }
      ],
      materials: [],
      makeMethods: [{ id: "mmRoot", parentMaterialId: null }],
      cuttingProcessId: "cut-proc"
    });
    expect(operationHome.get("b")).toBe("master"); // matched by process = cutting
    expect(operationHome.get("a")).toBe("bundle");
  });

  it("throws when cutting cannot be identified (no tag, no matching process)", () => {
    // No "lowest-order" guess: mislabeling cutting would leak it into bundles, so
    // an unidentifiable cutting op must fail loudly instead of splitting arbitrarily.
    expect(() =>
      classifyGarmentJobItems({
        operations: [
          { id: "a", order: 5, tags: [], jobMakeMethodId: "mmRoot" },
          { id: "b", order: 1, tags: [], jobMakeMethodId: "mmRoot" }
        ],
        materials: [],
        makeMethods: [{ id: "mmRoot", parentMaterialId: null }]
      })
    ).toThrow(/cutting operation/i);
  });

  it("propagates home through 3+ nesting levels", () => {
    // root → fabric(MTO) → semi(MTO) → greige, fabric consumed at cutting.
    const { operationHome, materialHome, nestedMakeMethodHome } =
      classifyGarmentJobItems({
        operations: [
          { id: "cut", order: 0, tags: cuttingTags, jobMakeMethodId: "mmRoot" },
          { id: "dye", order: 0, tags: [], jobMakeMethodId: "mmFabric" },
          { id: "pretreat", order: 0, tags: [], jobMakeMethodId: "mmSemi" }
        ],
        materials: [
          { id: "fabric", jobMakeMethodId: "mmRoot", jobOperationId: null },
          { id: "semi", jobMakeMethodId: "mmFabric", jobOperationId: null },
          { id: "greige", jobMakeMethodId: "mmSemi", jobOperationId: null }
        ],
        makeMethods: [
          { id: "mmRoot", parentMaterialId: null },
          { id: "mmFabric", parentMaterialId: "fabric" },
          { id: "mmSemi", parentMaterialId: "semi" }
        ]
      });
    // Everything below cutting rolls up to the master.
    expect(operationHome.get("dye")).toBe("master");
    expect(operationHome.get("pretreat")).toBe("master"); // deepest op
    expect(materialHome.get("greige")).toBe("master"); // deepest material
    expect(nestedMakeMethodHome.get("mmSemi")).toBe("master");
  });

  it("propagates a bundle-bound root material down its whole sub-tree", () => {
    // fabric explicitly consumed at sewing → the fabric prep chain goes to bundle.
    const { operationHome, materialHome } = classifyGarmentJobItems({
      operations: [
        { id: "cut", order: 0, tags: cuttingTags, jobMakeMethodId: "mmRoot" },
        { id: "sew", order: 1, tags: [], jobMakeMethodId: "mmRoot" },
        { id: "dye", order: 0, tags: [], jobMakeMethodId: "mmFabric" }
      ],
      materials: [
        { id: "fabric", jobMakeMethodId: "mmRoot", jobOperationId: "sew" },
        { id: "greige", jobMakeMethodId: "mmFabric", jobOperationId: null }
      ],
      makeMethods: [
        { id: "mmRoot", parentMaterialId: null },
        { id: "mmFabric", parentMaterialId: "fabric" }
      ]
    });
    expect(operationHome.get("dye")).toBe("bundle");
    expect(materialHome.get("greige")).toBe("bundle");
  });

  it("terminates on a self-referential cycle (guard, no infinite loop)", () => {
    // Pathological: mmA's parent material lives on mmA and is consumed by opA on mmA.
    const { operationHome } = classifyGarmentJobItems({
      operations: [{ id: "opA", order: 0, tags: [], jobMakeMethodId: "mmA" }],
      materials: [
        { id: "matA", jobMakeMethodId: "mmA", jobOperationId: "opA" }
      ],
      makeMethods: [{ id: "mmA", parentMaterialId: "matA" }]
    });
    // Must resolve to a value (guard default) rather than hang.
    expect(operationHome.get("opA")).toBe("master");
  });
});

describe("sequenceGarmentJobOperations", () => {
  const cuttingTags = ["style:cutting-operation", "style:system-operation"];

  it("places nested fabric prep (印染) before the cutting op that consumes it", () => {
    // root: cut(order0) + sew(order1); nested dye(order1 on fabric's method).
    // fabric consumed at cutting by default (no explicit operation).
    const orderMap = sequenceGarmentJobOperations({
      operations: [
        { id: "cut", order: 0, tags: cuttingTags, jobMakeMethodId: "mmRoot" },
        { id: "sew", order: 1, tags: [], jobMakeMethodId: "mmRoot" },
        { id: "dye", order: 1, tags: [], jobMakeMethodId: "mmFabric" }
      ],
      materials: [
        { id: "fabric", jobMakeMethodId: "mmRoot", jobOperationId: null },
        { id: "greige", jobMakeMethodId: "mmFabric", jobOperationId: null }
      ],
      makeMethods: [
        { id: "mmRoot", parentMaterialId: null },
        { id: "mmFabric", parentMaterialId: "fabric" }
      ]
    });
    // dye runs before cutting; cutting before sewing.
    expect(orderMap.get("dye")! < orderMap.get("cut")!).toBe(true);
    expect(orderMap.get("cut")! < orderMap.get("sew")!).toBe(true);
    expect([
      orderMap.get("dye"),
      orderMap.get("cut"),
      orderMap.get("sew")
    ]).toEqual([0, 1, 2]);
  });

  it("orders deeper sub-assemblies before shallower ones", () => {
    // root cut; fabric(→cut) has nested dye; fabric's own material semi has a
    // deeper pretreat op. pretreat (deepest) must precede dye, both before cut.
    const orderMap = sequenceGarmentJobOperations({
      operations: [
        { id: "cut", order: 0, tags: cuttingTags, jobMakeMethodId: "mmRoot" },
        { id: "dye", order: 1, tags: [], jobMakeMethodId: "mmFabric" },
        { id: "pretreat", order: 1, tags: [], jobMakeMethodId: "mmSemi" }
      ],
      materials: [
        { id: "fabric", jobMakeMethodId: "mmRoot", jobOperationId: null },
        { id: "semi", jobMakeMethodId: "mmFabric", jobOperationId: "dye" }
      ],
      makeMethods: [
        { id: "mmRoot", parentMaterialId: null },
        { id: "mmFabric", parentMaterialId: "fabric" },
        { id: "mmSemi", parentMaterialId: "semi" }
      ]
    });
    expect(orderMap.get("pretreat")! < orderMap.get("dye")!).toBe(true);
    expect(orderMap.get("dye")! < orderMap.get("cut")!).toBe(true);
  });

  it("leaves a plain style's order unchanged (cut then sew)", () => {
    const orderMap = sequenceGarmentJobOperations({
      operations: [
        { id: "cut", order: 0, tags: cuttingTags, jobMakeMethodId: "mmRoot" },
        { id: "sew", order: 1, tags: [], jobMakeMethodId: "mmRoot" }
      ],
      materials: [],
      makeMethods: [{ id: "mmRoot", parentMaterialId: null }]
    });
    expect(orderMap.get("cut")).toBe(0);
    expect(orderMap.get("sew")).toBe(1);
  });
});
