import { requirePermissions } from "@carbon/auth/auth.server";
import { validator } from "@carbon/form";
import { describe, expect, it, vi } from "vitest";
import { action } from "./$rfqId.new";

const getPurchasingRFQ = vi.fn();
const upsertPurchasingRFQLine = vi.fn();
const replacePurchasingRfqLinesWithStyleVariants = vi.fn();
const expandVariantTableToLines = vi.fn();
const requireUnlocked = vi.fn();

vi.mock("@carbon/auth/auth.server", () => ({
  assertIsPost: vi.fn(),
  requirePermissions: vi.fn()
}));

vi.mock("@carbon/auth", () => ({
  assertIsPost: vi.fn(),
  error: vi.fn((value) => value),
  getAppUrl: vi.fn(() => "http://localhost"),
  getMESUrl: vi.fn(() => "http://localhost"),
  success: vi.fn((value) => value)
}));

vi.mock("@carbon/auth/session.server", () => ({
  flash: vi.fn(async () => new Headers())
}));

vi.mock("@carbon/auth/client.server", () => ({
  getCarbonServiceRole: vi.fn(() => ({ from: vi.fn() }))
}));

vi.mock("@carbon/form", () => ({
  validationError: vi.fn((error) => ({ error })),
  validator: vi.fn()
}));

vi.mock("~/modules/items/styleOrderLines.server", () => ({
  expandVariantTableToLines: (...args: unknown[]) =>
    expandVariantTableToLines(...args),
  hasStyleVariantsQuantity: vi.fn(() => true)
}));

vi.mock("~/modules/production/variantsQuantityOverlay.server", () => ({
  readVariantQuantitiesFormRaw: (
    _formData: FormData,
    fromValidator?: string | null
  ) => fromValidator || undefined,
  variantTableUpdateFields: (parsed: Record<string, unknown>) => ({
    variantQuantities: parsed,
    quantity: 2
  })
}));

vi.mock("~/modules/purchasing", () => ({
  getPurchasingRFQ: (...args: unknown[]) => getPurchasingRFQ(...args),
  isRfqLocked: vi.fn(() => false),
  purchasingRfqLineValidator: {},
  replacePurchasingRfqLinesWithStyleVariants: (...args: unknown[]) =>
    replacePurchasingRfqLinesWithStyleVariants(...args),
  upsertPurchasingRFQLine: (...args: unknown[]) =>
    upsertPurchasingRFQLine(...args)
}));

vi.mock("~/services/database.server", () => ({
  getDatabaseClient: vi.fn(() => ({ tx: vi.fn() }))
}));

vi.mock("~/utils/lockedGuard.server", () => ({
  requireUnlocked: (...args: unknown[]) => requireUnlocked(...args)
}));

describe("purchasing rfq new line action", () => {
  it("expands submitted variantQuantities into concrete variant sku lines", async () => {
    vi.mocked(requirePermissions)
      .mockResolvedValueOnce({
        client: { from: vi.fn() }
      } as any)
      .mockResolvedValueOnce({
        client: { from: vi.fn() },
        companyId: "company_1",
        userId: "user_1"
      } as any);

    getPurchasingRFQ.mockResolvedValue({ data: { status: "Draft" } });
    requireUnlocked.mockResolvedValue(undefined);
    vi.mocked(validator).mockReturnValue({
      validate: vi.fn().mockResolvedValue({
        data: {
          purchasingRfqId: "rfq_1",
          itemId: "item_parent",
          description: "Style line",
          inventoryUnitOfMeasureCode: "EA",
          purchaseUnitOfMeasureCode: "EA",
          conversionFactor: 1,
          order: 1,
          quantity: [1],
          variantQuantities: JSON.stringify({
            variantTable: [{ valuesKey: "BK|S", Quantities: 2 }]
          })
        }
      })
    } as any);
    expandVariantTableToLines.mockResolvedValue({
      ok: true,
      variants: [
        { variantItemId: "item_child", quantity: 2, valuesKey: "BK|S" }
      ]
    });

    const formData = new FormData();
    formData.set(
      "variantQuantities",
      JSON.stringify({
        variantTable: [{ valuesKey: "BK|S", Quantities: 2 }]
      })
    );

    await expect(
      action({
        request: new Request("http://localhost/purchasing-rfq/new", {
          method: "POST",
          body: formData
        }),
        params: { rfqId: "rfq_1" }
      } as any)
    ).rejects.toBeInstanceOf(Response);

    expect(replacePurchasingRfqLinesWithStyleVariants).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        companyId: "company_1",
        purchasingRfqId: "rfq_1",
        userId: "user_1",
        variants: [
          { variantItemId: "item_child", quantity: 2, valuesKey: "BK|S" }
        ]
      })
    );
    expect(upsertPurchasingRFQLine).not.toHaveBeenCalled();
  });
});
