import { describe, expect, it, vi } from "vitest";
import { STYLE_CUTTING_OPERATION_TAG } from "./styleMethod.service";

// diffMethod / updateOperationOrder live in items.service. Importing the real
// module drags in the items.service graph, which transitively loads
// @carbon/glossary — whose module-load-time Lingui `msg` macro isn't transformed
// under plain vitest and throws. The functions under test need none of it, so
// stub glossary; the implementations under test stay genuine.
vi.mock("@carbon/glossary", () => ({
  terms: {},
  getEntry: vi.fn(),
  lookupEntry: vi.fn(),
  hasEntry: vi.fn(),
  termSlug: vi.fn()
}));

const { diffMethod, updateOperationOrder } = await import("./items.service");

function createMethodOperationClient(args: {
  operationsById: Array<{
    id: string;
    makeMethodId: string;
    order: number;
    tags: string[] | null;
    customFields: Record<string, unknown> | null;
  }>;
  operationsByMethod: Array<{
    id: string;
    makeMethodId: string;
    order: number;
    tags: string[] | null;
    customFields: Record<string, unknown> | null;
  }>;
}) {
  const updateEq = vi.fn(async () => ({ data: null, error: null }));
  const update = vi.fn(() => ({ eq: updateEq }));
  const select = vi.fn(() => ({
    in: vi.fn(async (column: string) => {
      if (column === "id") {
        return { data: args.operationsById, error: null };
      }

      if (column === "makeMethodId") {
        return { data: args.operationsByMethod, error: null };
      }

      throw new Error(`Unexpected in column: ${column}`);
    })
  }));
  const from = vi.fn((table: string) => {
    if (table !== "methodOperation") {
      throw new Error(`Unexpected table: ${table}`);
    }

    return { select, update };
  });

  return {
    client: { from } as any,
    update,
    updateEq
  };
}

describe("updateOperationOrder", () => {
  it("rejects reorders that move the style cutting process later in the method", async () => {
    const mock = createMethodOperationClient({
      operationsById: [
        {
          id: "op-cut",
          makeMethodId: "mm-1",
          order: 0,
          tags: [STYLE_CUTTING_OPERATION_TAG],
          customFields: { styleStage: "cutting" }
        },
        {
          id: "op-sew",
          makeMethodId: "mm-1",
          order: 1,
          tags: ["sewing"],
          customFields: null
        }
      ],
      operationsByMethod: [
        {
          id: "op-cut",
          makeMethodId: "mm-1",
          order: 0,
          tags: [STYLE_CUTTING_OPERATION_TAG],
          customFields: { styleStage: "cutting" }
        },
        {
          id: "op-sew",
          makeMethodId: "mm-1",
          order: 1,
          tags: ["sewing"],
          customFields: null
        }
      ]
    });

    const result = await updateOperationOrder(mock.client, [
      { id: "op-cut", order: 2, updatedBy: "user-1" },
      { id: "op-sew", order: 1, updatedBy: "user-1" }
    ]);

    expect(result).toEqual([
      expect.objectContaining({
        error: expect.objectContaining({
          message:
            "System-owned Style cutting operations must remain the first process in the bill of process."
        })
      })
    ]);
    expect(mock.update).not.toHaveBeenCalled();
  });

  it("allows valid reorders that keep cutting first", async () => {
    const mock = createMethodOperationClient({
      operationsById: [
        {
          id: "op-cut",
          makeMethodId: "mm-1",
          order: 0,
          tags: [STYLE_CUTTING_OPERATION_TAG],
          customFields: { styleStage: "cutting" }
        },
        {
          id: "op-sew",
          makeMethodId: "mm-1",
          order: 1,
          tags: ["sewing"],
          customFields: null
        }
      ],
      operationsByMethod: [
        {
          id: "op-cut",
          makeMethodId: "mm-1",
          order: 0,
          tags: [STYLE_CUTTING_OPERATION_TAG],
          customFields: { styleStage: "cutting" }
        },
        {
          id: "op-sew",
          makeMethodId: "mm-1",
          order: 1,
          tags: ["sewing"],
          customFields: null
        }
      ]
    });

    const result = await updateOperationOrder(mock.client, [
      { id: "op-cut", order: 0, updatedBy: "user-1" },
      { id: "op-sew", order: 2, updatedBy: "user-1" }
    ]);

    expect(result).toEqual([
      { data: null, error: null },
      { data: null, error: null }
    ]);
    expect(mock.update).toHaveBeenCalledTimes(2);
    expect(mock.updateEq).toHaveBeenNthCalledWith(1, "id", "op-cut");
    expect(mock.updateEq).toHaveBeenNthCalledWith(2, "id", "op-sew");
  });
});

// A minimal live methodMaterial row (only the fields diffMethod compares + id).
function baseMaterial(over: Record<string, unknown> = {}) {
  return {
    id: "mm_1",
    itemId: "P1",
    quantity: 2,
    order: 1,
    unitOfMeasureCode: "EA",
    methodType: "Buy",
    sourcingType: "Specified",
    ...over
  };
}

// A staged material pointing back at a live material via sourceMaterialId.
function stagedMaterial(over: Record<string, unknown> = {}) {
  return {
    id: "cosm_1",
    sourceMaterialId: "mm_1",
    itemId: "P1",
    quantity: 2,
    order: 1,
    unitOfMeasureCode: "EA",
    methodType: "Buy",
    sourcingType: "Specified",
    ...over
  };
}

function baseOperation(over: Record<string, unknown> = {}) {
  return {
    id: "mo_1",
    order: 1,
    operationOrder: "After Previous",
    description: "Cut",
    setupTime: 5,
    laborTime: 10,
    machineTime: 0,
    ...over
  };
}

function stagedOperation(over: Record<string, unknown> = {}) {
  return {
    id: "coso_1",
    sourceOperationId: "mo_1",
    order: 1,
    operationOrder: "After Previous",
    description: "Cut",
    setupTime: 5,
    laborTime: 10,
    machineTime: 0,
    ...over
  };
}

const EMPTY = {
  baseMaterials: [],
  targetMaterials: [],
  baseOperations: [],
  targetOperations: []
};

describe("diffMethod — materials", () => {
  it("classifies a staged line with no source pointer as added", () => {
    const { materials } = diffMethod({
      ...EMPTY,
      targetMaterials: [stagedMaterial({ sourceMaterialId: null })]
    });
    expect(materials).toHaveLength(1);
    expect(materials[0].status).toBe("added");
    expect(materials[0].before).toBeNull();
    expect(materials[0].after).not.toBeNull();
  });

  it("classifies a base line nothing points at as removed", () => {
    const { materials } = diffMethod({
      ...EMPTY,
      baseMaterials: [baseMaterial()]
    });
    expect(materials).toHaveLength(1);
    expect(materials[0].status).toBe("removed");
    expect(materials[0].before).not.toBeNull();
    expect(materials[0].after).toBeNull();
  });

  it("classifies a matched pair with a changed field as modified", () => {
    const { materials } = diffMethod({
      ...EMPTY,
      baseMaterials: [baseMaterial()],
      targetMaterials: [stagedMaterial({ quantity: 5 })]
    });
    expect(materials).toHaveLength(1);
    expect(materials[0].status).toBe("modified");
    expect(materials[0].changedFields).toEqual({
      quantity: { before: 2, after: 5 }
    });
  });

  it("classifies an identical matched pair as unchanged", () => {
    const { materials } = diffMethod({
      ...EMPTY,
      baseMaterials: [baseMaterial()],
      targetMaterials: [stagedMaterial()]
    });
    expect(materials).toHaveLength(1);
    expect(materials[0].status).toBe("unchanged");
    expect(materials[0].changedFields).toBeUndefined();
  });

  it("treats numeric-string vs number quantities as unchanged", () => {
    const { materials } = diffMethod({
      ...EMPTY,
      baseMaterials: [baseMaterial({ quantity: "2" })],
      targetMaterials: [stagedMaterial({ quantity: 2 })]
    });
    expect(materials[0].status).toBe("unchanged");
  });

  // N→1 consolidation: an assembly's draft BOM drops 3 components and adds one
  // new part. The diff must read as 3 removed + 1 added (no supersession) — the
  // shape the consolidation feature surfaces on the assembly's Changes card.
  it("consolidation: 3 base materials removed, 1 new part added", () => {
    const { materials } = diffMethod({
      ...EMPTY,
      baseMaterials: [
        baseMaterial({ id: "mm_1", itemId: "P1", order: 1 }),
        baseMaterial({ id: "mm_2", itemId: "P2", order: 2 }),
        baseMaterial({ id: "mm_3", itemId: "P3", order: 3 })
      ],
      targetMaterials: [
        stagedMaterial({
          id: "cosm_new",
          sourceMaterialId: null,
          itemId: "P_NEW",
          order: 1
        })
      ]
    });
    expect(materials.filter((m) => m.status === "removed")).toHaveLength(3);
    expect(materials.filter((m) => m.status === "added")).toHaveLength(1);
    expect(materials.filter((m) => m.status === "modified")).toHaveLength(0);
    expect(materials.find((m) => m.status === "added")?.after?.itemId).toBe(
      "P_NEW"
    );
  });
});

describe("diffMethod — operations", () => {
  it("classifies an added operation (null source)", () => {
    const { operations } = diffMethod({
      ...EMPTY,
      targetOperations: [stagedOperation({ sourceOperationId: null })]
    });
    expect(operations[0].status).toBe("added");
  });

  it("classifies a removed operation", () => {
    const { operations } = diffMethod({
      ...EMPTY,
      baseOperations: [baseOperation()]
    });
    expect(operations[0].status).toBe("removed");
  });

  it("classifies a modified operation and records the changed field", () => {
    const { operations } = diffMethod({
      ...EMPTY,
      baseOperations: [baseOperation()],
      targetOperations: [stagedOperation({ setupTime: 20 })]
    });
    expect(operations[0].status).toBe("modified");
    expect(operations[0].changedFields).toEqual({
      setupTime: { before: 5, after: 20 }
    });
  });

  it("classifies an unchanged operation", () => {
    const { operations } = diffMethod({
      ...EMPTY,
      baseOperations: [baseOperation()],
      targetOperations: [stagedOperation()]
    });
    expect(operations[0].status).toBe("unchanged");
  });
});

describe("diffMethod — operation children", () => {
  it("carries no children when child maps are omitted (backward compatible)", () => {
    const { operations } = diffMethod({
      ...EMPTY,
      baseOperations: [baseOperation()],
      targetOperations: [stagedOperation()]
    });
    expect(operations[0].children).toBeUndefined();
  });

  it("diffs steps/parameters/tools by sourceId per matched operation", () => {
    const { operations } = diffMethod({
      ...EMPTY,
      baseOperations: [baseOperation()],
      targetOperations: [stagedOperation()],
      baseOperationChildren: {
        // keyed by the LIVE operation id (mo_1)
        mo_1: {
          steps: [{ id: "mos_1", name: "Inspect", sortOrder: 1 }],
          parameters: [{ id: "mop_1", key: "speed", value: "100" }],
          tools: [{ id: "mot_1", toolId: "T1", quantity: 1 }]
        }
      },
      targetOperationChildren: {
        // keyed by the STAGED operation id (coso_1)
        coso_1: {
          steps: [
            // modified: sortOrder changed
            { id: "coss_1", sourceId: "mos_1", name: "Inspect", sortOrder: 2 }
          ],
          parameters: [
            // added: no sourceId
            { id: "cosp_1", sourceId: null, key: "feed", value: "5" }
          ],
          // tools: mot_1 nothing points at ⇒ removed
          tools: []
        }
      }
    });

    const children = operations[0].children!;
    expect(children.steps).toHaveLength(1);
    expect(children.steps[0].status).toBe("modified");
    expect(children.steps[0].changedFields).toEqual({
      sortOrder: { before: 1, after: 2 }
    });

    // base mop_1 dropped (removed) + staged cosp_1 with no sourceId (added)
    expect(children.parameters).toHaveLength(2);
    expect(children.parameters.map((e) => e.status).sort()).toEqual([
      "added",
      "removed"
    ]);

    expect(children.tools).toHaveLength(1);
    expect(children.tools[0].status).toBe("removed");
  });
});

describe("diffMethod — attributes", () => {
  it("reports one entry per changed attribute column", () => {
    const { attributes } = diffMethod({
      ...EMPTY,
      baseAttributes: { name: "Widget", description: "old" },
      targetAttributes: { name: "Widget", description: "new" }
    });
    expect(attributes).toHaveLength(1);
    expect(attributes[0].status).toBe("modified");
    expect(attributes[0].changedFields).toEqual({
      description: { before: "old", after: "new" }
    });
  });

  it("returns a single unchanged entry when no attribute differs", () => {
    const { attributes } = diffMethod({
      ...EMPTY,
      baseAttributes: { name: "Widget", description: "same" },
      targetAttributes: { name: "Widget", description: "same" }
    });
    expect(attributes).toHaveLength(1);
    expect(attributes[0].status).toBe("unchanged");
  });

  it("ignores audit/linkage columns in the attribute diff", () => {
    const { attributes } = diffMethod({
      ...EMPTY,
      baseAttributes: { name: "Widget", id: "a", updatedAt: "t1" },
      targetAttributes: { name: "Widget", id: "b", updatedAt: "t2" }
    });
    expect(attributes).toHaveLength(1);
    expect(attributes[0].status).toBe("unchanged");
  });

  it("surfaces the whole attribute set as added for a net-new item (New Part)", () => {
    const target = { name: "Widget", description: "brand new" };
    const { attributes } = diffMethod({
      ...EMPTY,
      baseAttributes: null,
      targetAttributes: target
    });
    expect(attributes).toHaveLength(1);
    expect(attributes[0].status).toBe("added");
    expect(attributes[0].before).toBeNull();
    expect(attributes[0].after).toEqual(target);
  });
});
