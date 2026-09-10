import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import {
  getStyleOnHandByColorSize,
  insertManualInventoryAdjustment
} from "~/modules/inventory";
import {
  buildStyleScanCountCommitLines,
  normalizeScannedExternalCodes,
  resolveGarmentPiecesByScannedCodes,
  tallyStyleScanCount
} from "~/modules/production";

/**
 * Resource action for Style 扫码盘点 on location inventory detail.
 * Storage unit is required. Commit Set Quantity per variant SKU in that bin;
 * unscanned family SKUs with prior on-hand go to 0.
 */
export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "inventory"
  });

  const { itemId: styleParentItemId } = params;
  if (!styleParentItemId) throw new Error("Could not find itemId");

  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");
  const locationId = String(formData.get("locationId") ?? "").trim();
  const storageUnitId = String(formData.get("storageUnitId") ?? "").trim();
  const rawCodes = formData.getAll("code").map(String);

  if (!locationId || !storageUnitId) {
    return data(
      {
        intent: intent || "none",
        ok: false as const,
        message: "Storage unit is required"
      },
      await flash(request, error(null, "Storage unit is required"))
    );
  }

  const styleVariants = await client
    .from("itemVariant")
    .select("variantItemId")
    .eq("parentItemId", styleParentItemId)
    .eq("companyId", companyId);
  if (styleVariants.error) {
    return data(
      { intent, ok: false as const, message: "Failed to load Style SKUs" },
      await flash(
        request,
        error(styleVariants.error, "Failed to load Style SKUs")
      )
    );
  }
  const styleVariantItemIds = (styleVariants.data ?? []).map(
    (r) => r.variantItemId
  );
  if (styleVariantItemIds.length === 0) {
    return data(
      { intent, ok: false as const, message: "Item is not a Style with SKUs" },
      await flash(request, error(null, "Scan count is only for Style items"))
    );
  }

  const uniqueCodes = normalizeScannedExternalCodes(rawCodes);
  const resolved = await resolveGarmentPiecesByScannedCodes(
    client,
    uniqueCodes,
    companyId
  );
  if (resolved.error) {
    return data(
      { intent, ok: false as const, message: "Failed to resolve scans" },
      await flash(request, error(resolved.error, "Failed to resolve scans"))
    );
  }

  const resolvedByCode: Record<
    string,
    {
      scannedCode: string;
      variantItemId: string;
      parentItemId: string | null;
      attributeLabel: string | null;
    }
  > = {};
  for (const piece of resolved.data) {
    resolvedByCode[piece.scannedCode] = {
      scannedCode: piece.scannedCode,
      variantItemId: piece.variantItemId,
      parentItemId: piece.parentItemId,
      attributeLabel: piece.attributeLabel
    };
  }

  const tally = tallyStyleScanCount({
    rawCodes: uniqueCodes,
    resolvedByCode,
    styleParentItemId,
    unknownCodes: resolved.unknown
  });

  if (intent === "resolve") {
    return data({
      intent: "resolve" as const,
      ok: true as const,
      pieces: resolved.data.filter((p) => p.parentItemId === styleParentItemId),
      foreignCodes: tally.foreignCodes,
      unknownCodes: tally.unknownCodes,
      countedByVariantId: tally.countedByVariantId,
      inScopeCount: tally.inScopeCodes.length
    });
  }

  const onHandRows = await getStyleOnHandByColorSize(
    client,
    styleParentItemId,
    companyId,
    locationId,
    storageUnitId
  );
  const onHandByVariantId: Record<string, number> = {};
  for (const row of onHandRows) {
    onHandByVariantId[row.variantItemId] = row.quantityOnHand;
  }

  const lines = buildStyleScanCountCommitLines({
    styleVariantItemIds,
    countedByVariantId: tally.countedByVariantId,
    onHandByVariantId
  });

  if (intent === "review") {
    const readableById: Record<string, string> = {};
    if (lines.length > 0) {
      const items = await client
        .from("item")
        .select("id, readableId")
        .eq("companyId", companyId)
        .in(
          "id",
          lines.map((l) => l.variantItemId)
        );
      if (!items.error) {
        for (const row of items.data ?? []) {
          readableById[row.id] = row.readableId;
        }
      }
    }
    return data({
      intent: "review" as const,
      ok: true as const,
      lines: lines.map((l) => ({
        ...l,
        readableId: readableById[l.variantItemId] ?? l.variantItemId
      })),
      foreignCodes: tally.foreignCodes,
      unknownCodes: tally.unknownCodes,
      inScopeCount: tally.inScopeCodes.length
    });
  }

  if (intent === "commit") {
    if (lines.length === 0) {
      return data(
        {
          intent: "commit" as const,
          ok: false as const,
          message: "Nothing to post for this storage unit"
        },
        await flash(
          request,
          error(null, "Nothing to post for this storage unit")
        )
      );
    }

    const failed: string[] = [];
    for (const line of lines) {
      if (line.counted === line.onHand) continue;
      const result = await insertManualInventoryAdjustment(client, {
        itemId: line.variantItemId,
        locationId,
        storageUnitId,
        adjustmentType: "Set Quantity",
        quantity: line.counted,
        comment: "Physical count (scan)",
        companyId,
        createdBy: userId
      });
      if ("error" in result && result.error) {
        failed.push(line.variantItemId);
      }
    }

    return data(
      {
        intent: "commit" as const,
        ok: failed.length === 0,
        committed: failed.length === 0,
        failed,
        updated:
          lines.filter((l) => l.counted !== l.onHand).length - failed.length
      },
      await flash(
        request,
        failed.length
          ? error(null, `${failed.length} SKU(s) failed to post`)
          : success(
              `Count posted — updated ${
                lines.filter((l) => l.counted !== l.onHand).length
              } SKU(s)`
            )
      )
    );
  }

  return data({ intent: "none" as const, ok: false as const });
}
