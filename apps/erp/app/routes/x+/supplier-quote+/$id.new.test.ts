import { requirePermissions } from "@carbon/auth/auth.server";
import { validator } from "@carbon/form";
import { describe, expect, it, vi } from "vitest";
import { action } from "./$id.new";

const getSupplierQuote = vi.fn();
const upsertSupplierQuoteLine = vi.fn();
const replaceSupplierQuoteLinesWithStyleVariants = vi.fn();
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

vi.mock("~/modules/purchasing", () => ({
  getSupplierQuote: (...args: unknown[]) => getSupplierQuote(...args),
  isSupplierQuoteLocked: vi.fn(() => false),
  replaceSupplierQuoteLinesWithStyleVariants: (...args: unknown[]) =>
    replaceSupplierQuoteLinesWithStyleVariants(...args),
  supplierQuoteLineValidator: {},
  upsertSupplierQuoteLine: (...args: unknown[]) =>
    upsertSupplierQuoteLine(...args)
}));

vi.mock("~/services/database.server", () => ({
  getDatabaseClient: vi.fn(() => ({ tx: vi.fn() }))
}));

vi.mock("~/utils/lockedGuard.server", () => ({
  requireUnlocked: (...args: unknown[]) => requireUnlocked(...args)
}));

describe("supplier quote new line action", () => {
  it("expands submitted variantQuantities into concrete variant sku lines", async () => {
    vi.mocked(requirePermissions)
      .mockResolvedValueOnce({
        client: { from: vi.fn() },
        companyId: "company_1",
        userId: "user_1"
      } as any)
      .mockResolvedValueOnce({
        client: { from: vi.fn() }
      } as any);

    getSupplierQuote.mockResolvedValue({ data: { status: "Draft" } });
    requireUnlocked.mockResolvedValue(undefined);
    vi.mocked(validator).mockReturnValue({
      validate: vi.fn().mockResolvedValue({
        data: {
          supplierQuoteId: "sq_1",
          supplierQuoteLineType: "Style",
          itemId: "item_parent",
          description: "Style line",
          inventoryUnitOfMeasureCode: "EA",
          purchaseUnitOfMeasureCode: "EA",
          conversionFactor: 1,
          quantity: [1],
          variantQuantities: JSON.stringify({
            variantTable: [{ variantItemId: "item_bk_s", Quantities: 2 }]
          })
        }
      })
    } as any);
    expandVariantTableToLines.mockResolvedValue({
      ok: true,
      variants: [{ variantItemId: "item_child", quantity: 2 }]
    });

    const formData = new FormData();
    formData.set(
      "variantQuantities",
      JSON.stringify({
        variantTable: [{ variantItemId: "item_bk_s", Quantities: 2 }]
      })
    );

    await expect(
      action({
        request: new Request("http://localhost/supplier-quote/new", {
          method: "POST",
          body: formData
        }),
        params: { id: "sq_1" }
      } as any)
    ).rejects.toBeInstanceOf(Response);

    expect(replaceSupplierQuoteLinesWithStyleVariants).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        companyId: "company_1",
        supplierQuoteId: "sq_1",
        userId: "user_1",
        variants: [{ variantItemId: "item_child", quantity: 2 }]
      })
    );
    expect(upsertSupplierQuoteLine).not.toHaveBeenCalled();
  });
});
