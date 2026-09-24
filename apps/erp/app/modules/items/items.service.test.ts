import { describe, expect, it, vi } from "vitest";
import { getStyles, updateOperationOrder } from "./items.service";
import { STYLE_CUTTING_OPERATION_TAG } from "./styleMethod.service";

describe("getStyles", () => {
  it("sorts by creation time from newest to oldest by default", async () => {
    const order = vi.fn();
    const range = vi.fn(async () => ({ data: [], error: null, count: 0 }));
    const query: Record<string, ReturnType<typeof vi.fn>> = {} as Record<
      string,
      ReturnType<typeof vi.fn>
    >;

    for (const method of ["select", "eq", "or", "contains"]) {
      query[method] = vi.fn(() => query);
    }
    query.order = vi.fn((...args) => {
      order(...args);
      return query;
    });
    query.range = range;

    await getStyles({ from: vi.fn(() => query) } as any, "company-1", {
      search: null,
      supplierId: null,
      limit: 100,
      offset: 0,
      sorts: [],
      filters: []
    });

    expect(order).toHaveBeenCalledWith(
      "createdAt",
      expect.objectContaining({ ascending: false })
    );
  });
});

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
