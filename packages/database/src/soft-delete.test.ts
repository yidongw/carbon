import { describe, expect, it, vi } from "vitest";
import {
  HARD_DELETE_TABLES,
  SOFT_DELETE_TABLES,
  SOFT_DELETE_VIEW_BASE,
  isSoftDeletableTable,
  isSoftDeleteView,
  resolveSoftDeleteBaseTable,
  withHardDelete,
  withIncludeDeleted,
  wrapSoftDeleteClient
} from "./soft-delete.ts";

describe("soft-delete registry", () => {
  it("maps list views to base tables", () => {
    expect(resolveSoftDeleteBaseTable("parts")).toBe("item");
    expect(resolveSoftDeleteBaseTable("jobs")).toBe("job");
    expect(resolveSoftDeleteBaseTable("item")).toBe("item");
  });

  it("keeps auth tables on hard delete", () => {
    for (const table of HARD_DELETE_TABLES) {
      expect(isSoftDeletableTable(table)).toBe(false);
    }
  });

  it("marks configured tables as soft-deletable", () => {
    expect(SOFT_DELETE_TABLES.has("item")).toBe(true);
    expect(isSoftDeletableTable("parts")).toBe(true);
    expect(isSoftDeletableTable("jobs")).toBe(true);
    expect(isSoftDeletableTable("gauges")).toBe(true);
  });

  it("lists every mapped view as a soft-delete view", () => {
    for (const view of Object.keys(SOFT_DELETE_VIEW_BASE)) {
      expect(isSoftDeleteView(view)).toBe(true);
      expect(isSoftDeletableTable(view)).toBe(true);
    }
  });
});

describe("wrapSoftDeleteClient", () => {
  it("converts delete() into update(deletedAt) for soft-deletable tables", async () => {
    const eq = vi.fn().mockResolvedValue({ data: null, error: null });
    const update = vi.fn().mockReturnValue({
      is: vi.fn().mockReturnValue({ eq })
    });
    const del = vi.fn();
    const from = vi.fn().mockReturnValue({ delete: del, update });

    const client = wrapSoftDeleteClient({ from } as never, {
      deletedBy: "user_123"
    });
    await client.from("item").delete().eq("id", "item_1");

    expect(del).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        deletedAt: expect.any(String),
        deletedBy: "user_123"
      })
    );
    expect(eq).toHaveBeenCalledWith("id", "item_1");
  });

  it("keeps hard delete inside withHardDelete", async () => {
    const del = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: null, error: null })
    });
    const from = vi.fn().mockReturnValue({ delete: del });

    const client = wrapSoftDeleteClient({ from } as never);
    await withHardDelete(async () => client.from("item").delete().eq("id", "item_1"));

    expect(del).toHaveBeenCalled();
  });

  it("does not filter select() on list views (SQL already excludes deleted rows)", () => {
    const is = vi.fn().mockReturnValue({ eq: vi.fn() });
    const select = vi.fn().mockReturnValue({ is });
    const from = vi.fn().mockReturnValue({ select });

    const client = wrapSoftDeleteClient({ from } as never);
    client.from("parts").select("*");

    expect(is).not.toHaveBeenCalled();
  });

  it("filters select() on base tables", () => {
    const is = vi.fn().mockReturnValue({ eq: vi.fn() });
    const select = vi.fn().mockReturnValue({ is });
    const from = vi.fn().mockReturnValue({ select });

    const client = wrapSoftDeleteClient({ from } as never);
    client.from("item").select("*");

    expect(is).toHaveBeenCalledWith("deletedAt", null);

    const isIncluded = vi.fn().mockReturnValue({ eq: vi.fn() });
    const selectIncluded = vi.fn().mockReturnValue({ is: isIncluded });
    from.mockReturnValue({ select: selectIncluded });

    withIncludeDeleted(() => {
      client.from("item").select("*");
    });

    expect(isIncluded).not.toHaveBeenCalled();
  });

  it("routes view delete to the base table", async () => {
    const eq = vi.fn().mockResolvedValue({ data: null, error: null });
    const itemUpdate = vi.fn().mockReturnValue({
      is: vi.fn().mockReturnValue({ eq })
    });
    const partsDelete = vi.fn();
    const from = vi.fn((table: string) => {
      if (table === "item") return { update: itemUpdate };
      return { delete: partsDelete, update: itemUpdate };
    });

    const client = wrapSoftDeleteClient({ from } as never, {
      deletedBy: "user_123"
    });
    await client.from("parts").delete().eq("id", "item_1");

    expect(partsDelete).not.toHaveBeenCalled();
    expect(from).toHaveBeenCalledWith("item");
    expect(itemUpdate).toHaveBeenCalled();
  });

  it("routes gauges view delete to gauge table", async () => {
    const eq = vi.fn().mockResolvedValue({ data: null, error: null });
    const gaugeUpdate = vi.fn().mockReturnValue({
      is: vi.fn().mockReturnValue({ eq })
    });
    const from = vi.fn((table: string) => {
      if (table === "gauge") return { update: gaugeUpdate };
      return { delete: vi.fn(), update: gaugeUpdate };
    });

    const client = wrapSoftDeleteClient({ from } as never);
    await client.from("gauges").delete().eq("id", "gauge_1");

    expect(from).toHaveBeenCalledWith("gauge");
    expect(gaugeUpdate).toHaveBeenCalled();
  });
});
