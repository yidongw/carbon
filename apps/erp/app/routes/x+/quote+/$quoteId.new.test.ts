import { requirePermissions } from "@carbon/auth/auth.server";
import { validator } from "@carbon/form";
import { describe, expect, it, vi } from "vitest";
import { action } from "./$quoteId.new";

const getQuote = vi.fn();
const upsertQuoteLine = vi.fn();
const upsertQuoteLineMethod = vi.fn();
const resolvePurchaseToOrderPrices = vi.fn();
const resolveQuoteLinePrices = vi.fn();
const recalculateQuoteLinePrices = vi.fn();
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

vi.mock("@carbon/auth/client.server", () => ({
  getCarbonServiceRole: vi.fn(() => ({ from: vi.fn() }))
}));

vi.mock("@carbon/form", () => ({
  validationError: vi.fn((error) => ({ error })),
  validator: vi.fn()
}));

vi.mock("~/modules/sales", () => ({
  getQuote: (...args: unknown[]) => getQuote(...args),
  isQuoteLocked: vi.fn(() => false),
  quoteLineValidator: {},
  recalculateQuoteLinePrices: (...args: unknown[]) =>
    recalculateQuoteLinePrices(...args),
  resolvePurchaseToOrderPrices: (...args: unknown[]) =>
    resolvePurchaseToOrderPrices(...args),
  resolveQuoteLinePrices: (...args: unknown[]) =>
    resolveQuoteLinePrices(...args),
  upsertQuoteLine: (...args: unknown[]) => upsertQuoteLine(...args),
  upsertQuoteLineMethod: (...args: unknown[]) => upsertQuoteLineMethod(...args)
}));

vi.mock("~/utils/lockedGuard.server", () => ({
  requireUnlocked: (...args: unknown[]) => requireUnlocked(...args)
}));

describe("quote new line action", () => {
  it("maps variantQuantities JSON into style configuration and total quantity", async () => {
    vi.mocked(requirePermissions)
      .mockResolvedValueOnce({
        companyId: "company_1",
        userId: "user_1"
      } as any)
      .mockResolvedValueOnce({
        client: { from: vi.fn() }
      } as any);

    getQuote.mockResolvedValue({ data: { status: "Draft" } });
    requireUnlocked.mockResolvedValue(undefined);
    vi.mocked(validator).mockReturnValue({
      validate: vi.fn().mockResolvedValue({
        data: {
          quoteId: "quote_1",
          itemId: "item_parent",
          itemType: "Style",
          status: "Not Started",
          description: "Style line",
          methodType: "Make to Order",
          unitOfMeasureCode: "EA",
          quantity: [1],
          taxPercent: 0,
          variantQuantities: JSON.stringify({
            variantTable: [{ valuesKey: "BK|S", Quantities: 2 }]
          })
        }
      })
    } as any);
    upsertQuoteLine.mockResolvedValue({ data: { id: "line_1" } });
    upsertQuoteLineMethod.mockResolvedValue({ data: { id: "method_1" } });
    recalculateQuoteLinePrices.mockResolvedValue(null);

    const formData = new FormData();
    formData.set(
      "variantQuantities",
      JSON.stringify({
        variantTable: [{ valuesKey: "BK|S", Quantities: 2 }]
      })
    );

    await expect(
      action({
        request: new Request("http://localhost/quote/new", {
          method: "POST",
          body: formData
        }),
        params: { quoteId: "quote_1" }
      } as any)
    ).rejects.toBeInstanceOf(Response);

    expect(upsertQuoteLine).toHaveBeenCalledWith(
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
