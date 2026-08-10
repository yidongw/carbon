import { describe, expect, it } from "vitest";
import { syncItemVariantsFromSelections } from "./itemAttribute.service";

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
