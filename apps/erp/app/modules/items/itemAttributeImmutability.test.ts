import { describe, expect, it } from "vitest";
import {
  syncItemVariantsFromSelections,
  validateAttributeSelectionForCreate
} from "./itemAttribute.service";

/**
 * Minimal client mock for the immutability guards in
 * syncItemVariantsFromSelections. The guards short-circuit before any attribute
 * set / variant lookups, so only `item` and `itemAttributeSelection` reads need
 * to resolve.
 */
function mockClient(handlers: {
  attributeSetId: string | null;
  currentValueIds?: string[];
}) {
  return {
    from(table: string) {
      if (table === "item") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                maybeSingle: async () => ({
                  data: {
                    type: "Style",
                    attributeSetId: handlers.attributeSetId
                  },
                  error: null
                })
              })
            })
          })
        };
      }
      if (table === "itemAttributeSelection") {
        return {
          select: () => ({
            eq: () => ({
              eq: async () => ({
                data: (handlers.currentValueIds ?? []).map((id) => ({
                  attributeValueId: id
                })),
                error: null
              })
            })
          })
        };
      }
      throw new Error(`unexpected table ${table}`);
    }
  } as any;
}

const base = {
  itemId: "item_1",
  companyId: "co_1",
  userId: "user_1"
};

describe("syncItemVariantsFromSelections immutability guards", () => {
  it("rejects adding an attribute set to an item created without one", async () => {
    const client = mockClient({ attributeSetId: null });
    const { error } = await syncItemVariantsFromSelections(client, {
      ...base,
      attributeSetId: "ias_a",
      selections: { attr_1: ["v1"] }
    });
    expect(error?.message).toMatch(/can't be added/i);
  });

  it("rejects changing the assigned attribute set", async () => {
    const client = mockClient({ attributeSetId: "ias_a" });
    const { error } = await syncItemVariantsFromSelections(client, {
      ...base,
      attributeSetId: "ias_b",
      selections: { attr_1: ["v1"] }
    });
    expect(error?.message).toMatch(/can't be changed/i);
  });

  it("rejects removing an already-assigned attribute value", async () => {
    const client = mockClient({
      attributeSetId: "ias_a",
      currentValueIds: ["v1", "v2"]
    });
    // v2 is dropped from the submitted selections.
    const { error } = await syncItemVariantsFromSelections(client, {
      ...base,
      attributeSetId: "ias_a",
      selections: { attr_1: ["v1"] }
    });
    expect(error?.message).toMatch(/can't be removed/i);
  });

  it("skips the guards on create (isCreate) so the baseline can be set", async () => {
    // A set-less item would be rejected by the add-set guard on edit. With
    // isCreate the guards are skipped, so execution reaches the downstream
    // attribute-set lookup (unmocked here) instead of returning an immutability
    // error — proving the guards did not fire.
    const client = mockClient({ attributeSetId: null });
    await expect(
      syncItemVariantsFromSelections(client, {
        ...base,
        attributeSetId: "ias_a",
        selections: { attr_1: ["v1"] },
        isCreate: true
      })
    ).rejects.toThrow(/unexpected table itemAttributeSetAssignment/);
  });
});

/**
 * Mock for the create-time completeness rule: an item must carry a value for
 * every attribute of its chosen set. Resolves the set-assignability lookup
 * (`itemAttributeSetAssignment`) and the set membership (`itemAttributeSetAttribute`);
 * anything past the completeness check is left unmocked so a passing check is
 * observable as a *different* (downstream) failure rather than a swallowed pass.
 */
function completenessClient(setAttributeIds: string[]) {
  return {
    from(table: string) {
      if (table === "item") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                maybeSingle: async () => ({
                  data: { type: "Style", attributeSetId: null },
                  error: null
                })
              })
            })
          })
        };
      }
      if (table === "itemAttributeSetAssignment") {
        return {
          select: () => ({
            eq: () => ({
              or: async () => ({
                data: [
                  {
                    attributeSetId: "ias_a",
                    itemAttributeSet: { id: "ias_a", code: "A", name: "A" }
                  }
                ],
                error: null
              })
            })
          })
        };
      }
      if (table === "itemAttributeSetAttribute") {
        return {
          select: () => ({
            eq: async () => ({
              data: setAttributeIds.map((attributeId) => ({ attributeId })),
              error: null
            })
          })
        };
      }
      throw new Error(`unexpected table ${table}`);
    }
  } as any;
}

describe("syncItemVariantsFromSelections create completeness", () => {
  it("rejects create when a set attribute has no selected value", async () => {
    const client = completenessClient(["attr_1", "attr_2"]);
    const { error } = await syncItemVariantsFromSelections(client, {
      ...base,
      attributeSetId: "ias_a",
      selections: { attr_1: ["v1"] }, // attr_2 has no value
      isCreate: true
    });
    expect(error?.message).toMatch(/at least one value/i);
  });

  it("passes the completeness check when every set attribute has a value", async () => {
    const client = completenessClient(["attr_1", "attr_2"]);
    const { error } = await syncItemVariantsFromSelections(client, {
      ...base,
      attributeSetId: "ias_a",
      selections: { attr_1: ["v1"], attr_2: ["v2"] },
      isCreate: true
    });
    // Completeness passed — the only remaining failure is a downstream write
    // against an unmocked table, never the completeness error itself.
    expect(error?.message ?? "").not.toMatch(/at least one value/i);
  });
});

/**
 * Mock for the pre-insert create validator. Resolves the type→set assignment
 * (`itemAttributeSetAssignment`) and, when a set is chosen, its attribute
 * membership (`itemAttributeSetAttribute`).
 */
function preInsertClient(args: {
  availableSetIds: string[];
  setAttributeIds?: string[];
}) {
  return {
    from(table: string) {
      if (table === "itemAttributeSetAssignment") {
        return {
          select: () => ({
            eq: () => ({
              or: async () => ({
                data: args.availableSetIds.map((id) => ({
                  attributeSetId: id,
                  itemAttributeSet: { id, code: id, name: id }
                })),
                error: null
              })
            })
          })
        };
      }
      if (table === "itemAttributeSetAttribute") {
        return {
          select: () => ({
            eq: async () => ({
              data: (args.setAttributeIds ?? []).map((attributeId) => ({
                attributeId
              })),
              error: null
            })
          })
        };
      }
      throw new Error(`unexpected table ${table}`);
    }
  } as any;
}

describe("validateAttributeSelectionForCreate", () => {
  const base = { itemType: "Style", companyId: "co_1" };

  it("allows creation when no set is chosen (the set is optional)", async () => {
    // No set chosen: the validator short-circuits without hitting any table.
    const client = preInsertClient({ availableSetIds: ["ias_a"] });
    const result = await validateAttributeSelectionForCreate(client, {
      ...base,
      attributeSetId: "",
      selections: {}
    });
    expect(result).toBeNull();
  });

  it("rejects a chosen set that is not available for the item type", async () => {
    const client = preInsertClient({ availableSetIds: ["ias_a"] });
    const result = await validateAttributeSelectionForCreate(client, {
      ...base,
      attributeSetId: "ias_other",
      selections: {}
    });
    expect(result?.field).toBe("attributeSetId");
  });

  it("flags the specific attribute missing a value", async () => {
    const client = preInsertClient({
      availableSetIds: ["ias_a"],
      setAttributeIds: ["attr_1", "attr_2"]
    });
    const result = await validateAttributeSelectionForCreate(client, {
      ...base,
      attributeSetId: "ias_a",
      selections: { attr_1: ["v1"] } // attr_2 missing
    });
    expect(result?.field).toBe("av__attr_2");
  });

  it("passes when the set is chosen and every attribute has a value", async () => {
    const client = preInsertClient({
      availableSetIds: ["ias_a"],
      setAttributeIds: ["attr_1", "attr_2"]
    });
    const result = await validateAttributeSelectionForCreate(client, {
      ...base,
      attributeSetId: "ias_a",
      selections: { attr_1: ["v1"], attr_2: ["v2"] }
    });
    expect(result).toBeNull();
  });
});
