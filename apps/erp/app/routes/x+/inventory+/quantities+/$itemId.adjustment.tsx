import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import {
  dedupeViolations,
  evaluateLinesForSurface,
  isBlocked
} from "@carbon/ee/storage-rules.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import {
  insertManualInventoryAdjustment,
  inventoryAdjustmentValidator
} from "~/modules/inventory";
import {
  expandVariantTableToLines,
  requireVariantQuantitiesIfAttributeParent
} from "~/modules/items/styleOrderLines.server";
import { path, requestReferrer } from "~/utils/path";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "inventory"
  });

  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");

  const formData = await request.formData();
  const validation = await validator(inventoryAdjustmentValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }
  const { variantQuantities: variantQuantitiesJson, ...d } = validation.data;
  const acknowledged = formData.get("acknowledged") === "true";

  let variantQuantities: unknown = null;
  if (variantQuantitiesJson) {
    try {
      variantQuantities = JSON.parse(variantQuantitiesJson);
    } catch {
      return validationError({
        fieldErrors: { variantQuantities: "Invalid variant quantities" }
      } as never);
    }
  }

  const required = await requireVariantQuantitiesIfAttributeParent(client, {
    parentItemId: itemId,
    companyId,
    variantQuantities,
    quantity: Number(d.quantity ?? 0)
  });
  if (!required.ok) {
    throw redirect(
      path.to.inventoryItem(itemId),
      await flash(request, error(required.error, required.error))
    );
  }

  // Style parents submit a variants grid: one adjustment per child SKU.
  let expandedVariants: { variantItemId: string; quantity: number }[] | null =
    null;
  if (variantQuantities) {
    const expanded = await expandVariantTableToLines(client, {
      parentItemId: itemId,
      companyId,
      variantQuantities
    });
    if (!expanded.ok) {
      throw redirect(
        path.to.inventoryItem(itemId),
        await flash(request, error(expanded.error, expanded.error))
      );
    }
    expandedVariants = expanded.variants
      .map((v) => ({
        variantItemId: v.variantItemId,
        quantity: Number(v.quantity) || 0
      }))
      .filter((v) => {
        if (!Number.isFinite(v.quantity)) return false;
        // Set Quantity must apply 0 to clear a SKU; Pos/Neg skip no-ops.
        if (d.adjustmentType === "Set Quantity") return true;
        return v.quantity !== 0;
      });
    if (expandedVariants.length === 0) {
      throw redirect(
        path.to.inventoryItem(itemId),
        await flash(
          request,
          error(
            "No variant quantities to adjust",
            "Open the variant quantities grid to assign quantities"
          )
        )
      );
    }
  }

  // Business rule evaluation. Item rules fire on the `inventoryAdjustment`
  // surface, and on `place` when the adjustment lands stock in a bin (positive
  // delta) or `pick` when it removes from a bin (negative delta) — so bin-level
  // rules tied to those surfaces also kick in for manual adjustments.
  const serviceRole = getCarbonServiceRole();
  const evalLines = expandedVariants
    ? expandedVariants.map((v) => ({
        lineId: v.variantItemId,
        itemId: v.variantItemId,
        storageUnitId: d.storageUnitId ?? null,
        quantity: v.quantity,
        locationId: d.locationId
      }))
    : [
        {
          lineId: itemId,
          itemId,
          storageUnitId: d.storageUnitId ?? null,
          quantity: Number(d.quantity ?? 0),
          locationId: d.locationId
        }
      ];

  const itemPass = await evaluateLinesForSurface({
    client: serviceRole,
    companyId,
    userId,
    targetType: "item",
    surface: "inventoryAdjustment",
    lines: evalLines
  });

  const allViolations = [...itemPass.violations];
  const allRuleNames: Record<string, string> = { ...itemPass.ruleNames };

  if (d.storageUnitId) {
    // Pick the bin surface from `adjustmentType` only. `quantity` is a
    // positive magnitude per `inventoryAdjustmentValidator` — sign-based
    // direction detection would misclassify `Negative Adjmt.` as `place`.
    // Item rules own the `place`/`pick` surfaces.
    const isNegative = d.adjustmentType === "Negative Adjmt.";
    const binSurface: "place" | "pick" = isNegative ? "pick" : "place";

    const binPass = await evaluateLinesForSurface({
      client: serviceRole,
      companyId,
      userId,
      targetType: "item",
      surface: binSurface,
      lines: evalLines
    });
    allViolations.push(...binPass.violations);
    Object.assign(allRuleNames, binPass.ruleNames);
  }

  const deduped = dedupeViolations(allViolations);

  if (deduped.length > 0 && isBlocked(deduped, acknowledged)) {
    return {
      error: null,
      data: null,
      violations: deduped,
      ruleNames: allRuleNames
    };
  }

  const adjustments = expandedVariants
    ? expandedVariants.map((v) => ({
        ...d,
        itemId: v.variantItemId,
        quantity: v.quantity
      }))
    : [d];

  for (const adjustment of adjustments) {
    const itemLedger = await insertManualInventoryAdjustment(client, {
      ...adjustment,
      companyId,
      createdBy: userId
    });

    if (itemLedger.error) {
      const flashMessage =
        itemLedger.error === "Insufficient quantity for negative adjustment"
          ? "Insufficient quantity for negative adjustment"
          : itemLedger.error === "Serial number not found"
            ? "Serial number not found"
            : "Failed to create manual inventory adjustment";

      throw redirect(
        path.to.inventoryItem(itemId),
        await flash(request, error(itemLedger.error, flashMessage))
      );
    }
  }

  throw redirect(requestReferrer(request) ?? path.to.inventoryItem(itemId));
}
