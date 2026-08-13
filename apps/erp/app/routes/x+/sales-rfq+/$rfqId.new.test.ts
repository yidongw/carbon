import { requirePermissions } from "@carbon/auth/auth.server";
import { validator } from "@carbon/form";
import { describe, expect, it, vi } from "vitest";
import { action } from "./$rfqId.new";

const getSalesRFQ = vi.fn();
const upsertSalesRFQLine = vi.fn();
const requireUnlocked = vi.fn();

vi.mock("@carbon/auth/auth.server", () => ({
  assertIsPost: vi.fn(),
  requirePermissions: vi.fn()
}));

vi.mock("@carbon/auth", () => ({
  assertIsPost: vi.fn(),
  error: vi.fn((value) => value),
  getAppUrl: vi.fn(() => "http://localhost"),
  getMESUrl: vi.fn(() => "http://localhost")
}));

vi.mock("@carbon/auth/session.server", () => ({
  flash: vi.fn(async () => new Headers())
}));

vi.mock("@carbon/form", () => ({
  validationError: vi.fn((error) => ({ error })),
  validator: vi.fn()
}));

vi.mock("~/modules/items/styleOrderLines.server", () => ({
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

vi.mock("~/modules/sales", () => ({
  getSalesRFQ: (...args: unknown[]) => getSalesRFQ(...args),
  isSalesRfqLocked: vi.fn(() => false),
  salesRfqLineValidator: {},
  upsertSalesRFQLine: (...args: unknown[]) => upsertSalesRFQLine(...args)
}));

vi.mock("~/utils/lockedGuard.server", () => ({
  requireUnlocked: (...args: unknown[]) => requireUnlocked(...args)
}));

describe("sales rfq new line action", () => {
  it("maps variantQuantities JSON into style configuration and total quantity", async () => {
    vi.mocked(requirePermissions)
      .mockResolvedValueOnce({
        client: { from: vi.fn() }
      } as any)
      .mockResolvedValueOnce({
        client: { from: vi.fn() },
        companyId: "company_1",
        userId: "user_1"
      } as any);

    getSalesRFQ.mockResolvedValue({ data: { status: "Draft" } });
    requireUnlocked.mockResolvedValue(undefined);
    vi.mocked(validator).mockReturnValue({
      validate: vi.fn().mockResolvedValue({
        data: {
          salesRfqId: "rfq_1",
          customerPartId: "CP-1",
          itemId: "item_parent",
          description: "Style line",
          unitOfMeasureCode: "EA",
          order: 1,
          quantity: [1],
          variantQuantities: JSON.stringify({
            variantTable: [{ valuesKey: "BK|S", Quantities: 2 }]
          })
        }
      })
    } as any);
    upsertSalesRFQLine.mockResolvedValue({ data: { id: "line_1" } });

    const formData = new FormData();
    formData.set(
      "variantQuantities",
      JSON.stringify({
        variantTable: [{ valuesKey: "BK|S", Quantities: 2 }]
      })
    );

    await expect(
      action({
        request: new Request("http://localhost/sales-rfq/new", {
          method: "POST",
          body: formData
        }),
        params: { rfqId: "rfq_1" }
      } as any)
    ).rejects.toBeInstanceOf(Response);

    expect(upsertSalesRFQLine).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        companyId: "company_1",
        configuration: {
          variantTable: [{ valuesKey: "BK|S", Quantities: 2 }]
        },
        createdBy: "user_1",
        itemId: "item_parent",
        quantity: [2]
      })
    );
  });
});
