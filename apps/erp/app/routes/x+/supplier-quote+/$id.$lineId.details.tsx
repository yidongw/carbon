import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import type { Json } from "@carbon/database";
import { validationError, validator } from "@carbon/form";
import type { JSONContent } from "@carbon/react";
import { useRouteData } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { Fragment } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData, useParams } from "react-router";
import { DeferredFiles } from "~/components";
import {
  expandVariantTableToLines,
  hasStyleVariantsQuantity
} from "~/modules/items/styleOrderLines.server";
import {
  readVariantQuantitiesFormRaw,
  variantTableUpdateFields
} from "~/modules/production/variantsQuantityOverlay.server";
import type {
  SupplierQuote,
  SupplierQuoteLinePrice
} from "~/modules/purchasing";
import {
  getSupplierInteractionLineDocuments,
  getSupplierQuote,
  getSupplierQuoteLine,
  getSupplierQuoteLinePrices,
  isSupplierQuoteLocked,
  replaceSupplierQuoteLinesWithStyleVariants,
  supplierQuoteLineValidator,
  upsertSupplierQuoteLine
} from "~/modules/purchasing";
import {
  SupplierInteractionLineDocuments,
  SupplierInteractionLineNotes
} from "~/modules/purchasing/ui/SupplierInteraction";
import {
  SupplierQuoteLineForm,
  SupplierQuoteLinePricing
} from "~/modules/purchasing/ui/SupplierQuote";
import type { MethodItemType } from "~/modules/shared";
import { getDatabaseClient } from "~/services/database.server";
import { setCustomFields } from "~/utils/form";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { path } from "~/utils/path";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { companyId } = await requirePermissions(request, {
    view: "purchasing"
  });

  const { id, lineId } = params;
  if (!id) throw new Error("Could not find id");
  if (!lineId) throw new Error("Could not find lineId");

  const serviceRole = await getCarbonServiceRole();

  const [line, prices] = await Promise.all([
    getSupplierQuoteLine(serviceRole, lineId),
    getSupplierQuoteLinePrices(serviceRole, lineId)
  ]);

  if (line.error) {
    throw redirect(
      path.to.supplierQuote(id),
      await flash(request, error(line.error, "Failed to load line"))
    );
  }

  return {
    line: line.data,
    files: getSupplierInteractionLineDocuments(serviceRole, companyId, lineId),
    pricesByQuantity: (prices?.data ?? []).reduce<
      Record<number, SupplierQuoteLinePrice>
    >((acc, price) => {
      acc[price.quantity] = price;
      return acc;
    }, {})
  };
};

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId, companyId } = await requirePermissions(request, {
    create: "purchasing"
  });

  const { id, lineId } = params;
  if (!id) throw new Error("Could not find id");
  if (!lineId) throw new Error("Could not find lineId");

  const { client: viewClient } = await requirePermissions(request, {
    view: "purchasing"
  });
  const quote = await getSupplierQuote(viewClient, id);
  await requireUnlocked({
    request,
    isLocked: isSupplierQuoteLocked(quote.data?.status),
    redirectTo: path.to.supplierQuote(id),
    message: "Cannot modify a locked supplier quote. Reopen it first."
  });

  const formData = await request.formData();

  const validation = await validator(supplierQuoteLineValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const {
    id: _id,
    variantQuantities: variantQuantitiesFromValidator,
    quantity: rawQuantity,
    ...d
  } = validation.data;

  let quantity = rawQuantity;
  let variantQuantities: Json | undefined;
  const variantQuantitiesRaw = readVariantQuantitiesFormRaw(
    formData,
    variantQuantitiesFromValidator
  );
  if (variantQuantitiesRaw) {
    try {
      const parsed = JSON.parse(variantQuantitiesRaw) as Record<
        string,
        unknown
      >;
      const fields = variantTableUpdateFields(parsed);
      variantQuantities = fields.variantQuantities;
      quantity = [fields.quantity];
    } catch {
      // Invalid JSON — keep typed quantity; FormData config is expand-only.
    }
  }

  // FormData variantTable means the per-variant quantity grid was used (Style
  // variants quantity, or a Consumable color set) — expand into variant SKU lines
  // regardless of the picker's line type.
  if (
    d.itemId &&
    variantQuantities &&
    hasStyleVariantsQuantity(variantQuantities)
  ) {
    const expanded = await expandVariantTableToLines(client, {
      parentItemId: d.itemId,
      companyId,
      variantQuantities
    });
    if (!expanded.ok) {
      throw redirect(
        path.to.supplierQuoteLine(id, lineId),
        await flash(request, error(expanded.error, expanded.error))
      );
    }

    const onlyParent =
      expanded.variants.length === 1 &&
      expanded.variants[0].variantItemId === d.itemId;

    if (!onlyParent) {
      try {
        await replaceSupplierQuoteLinesWithStyleVariants(getDatabaseClient(), {
          companyId,
          userId,
          supplierQuoteId: id,
          replaceLineId: lineId,
          variants: expanded.variants,
          base: {
            supplierQuoteLineType: d.supplierQuoteLineType,
            description: d.description,
            supplierPartId: d.supplierPartId,
            purchaseUnitOfMeasureCode: d.purchaseUnitOfMeasureCode,
            inventoryUnitOfMeasureCode: d.inventoryUnitOfMeasureCode,
            conversionFactor: d.conversionFactor,
            requiredDate: d.requiredDate,
            accountId: d.accountId,
            costCenterId: d.costCenterId
          },
          customFields: setCustomFields(formData)
        });
      } catch (err) {
        throw redirect(
          path.to.supplierQuoteLine(id, lineId),
          await flash(
            request,
            error(
              err,
              "Failed to update supplier quote lines for style variants"
            )
          )
        );
      }

      throw redirect(path.to.supplierQuote(id));
    }

    quantity = [expanded.variants[0].quantity];
  }

  // FormData `variantQuantities` is expand-only; never persist on the line.
  const updateSupplierQuoteLine = await upsertSupplierQuoteLine(client, {
    id: lineId,
    ...d,
    quantity,
    updatedBy: userId,
    customFields: setCustomFields(formData)
  });

  if (updateSupplierQuoteLine.error) {
    throw redirect(
      path.to.supplierQuoteLine(id, lineId),
      await flash(
        request,
        error(
          updateSupplierQuoteLine.error,
          "Failed to update supplierQuote line"
        )
      )
    );
  }

  throw redirect(path.to.supplierQuoteLine(id, lineId));
}

export default function SupplierQuoteLine() {
  const { t } = useLingui();
  const { line, files, pricesByQuantity } = useLoaderData<typeof loader>();

  const { id, lineId } = useParams();
  if (!id) throw new Error("Could not find id");
  if (!lineId) throw new Error("Could not find lineId");

  const routeData = useRouteData<{
    quote: SupplierQuote;
  }>(path.to.supplierQuote(id));

  const exchangeRate = routeData?.quote?.exchangeRate ?? 1;

  const initialValues = {
    ...line,
    id: line.id ?? undefined,
    supplierQuoteId: line.supplierQuoteId ?? "",
    supplierQuoteLineType: (line.supplierQuoteLineType ?? "Part") as
      | "Consumable"
      | "G/L Account"
      | "Material"
      | "Part"
      | "Tool",
    supplierPartId: line.supplierPartId ?? "",
    supplierPartRevision: line.supplierPartRevision ?? "",
    description: line.description ?? "",
    itemId: line.itemId ?? "",
    accountId: line.accountId ?? undefined,
    costCenterId: line.costCenterId ?? undefined,
    requiredDate: line.requiredDate ?? undefined,
    quantity: line.quantity ?? [1],
    inventoryUnitOfMeasureCode: line.inventoryUnitOfMeasureCode ?? "",
    purchaseUnitOfMeasureCode: line.purchaseUnitOfMeasureCode ?? "",
    conversionFactor: line.conversionFactor ?? undefined,
    itemType: (line.itemType ?? "Part") as MethodItemType
  };

  return (
    <Fragment key={lineId}>
      <SupplierQuoteLineForm key={lineId} initialValues={initialValues} />
      <SupplierInteractionLineNotes
        id={line.id}
        table="supplierQuoteLine"
        title={t`Notes`}
        subTitle={line.itemReadableId ?? ""}
        internalNotes={line.internalNotes as JSONContent}
        externalNotes={line.externalNotes as JSONContent}
      />
      <SupplierQuoteLinePricing
        line={line}
        pricesByQuantity={pricesByQuantity}
        exchangeRate={exchangeRate}
      />

      <DeferredFiles resolve={files}>
        {(resolvedFiles) => (
          <SupplierInteractionLineDocuments
            files={resolvedFiles ?? []}
            id={id}
            lineId={lineId}
            type="Supplier Quote"
          />
        )}
      </DeferredFiles>

      <Outlet />
    </Fragment>
  );
}
