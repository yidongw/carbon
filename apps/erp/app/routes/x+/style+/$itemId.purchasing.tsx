import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { VStack } from "@carbon/react";
import { Suspense } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Await, redirect, useLoaderData, useParams } from "react-router";
import { useRouteData } from "~/hooks";
import { getBatchProperties } from "~/modules/inventory";
import BatchPropertiesConfig from "~/modules/inventory/ui/Batches/BatchPropertiesConfig";
import type { SupplierPart } from "~/modules/items";
import {
  getItemCostHistory,
  getItemReplenishment,
  itemPurchasingValidator,
  upsertItemPurchasing
} from "~/modules/items";
import { ItemPurchasingForm, SupplierParts } from "~/modules/items/ui/Item";
import { ItemCostHistoryChart } from "~/modules/items/ui/Item/ItemCostHistoryChart";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts"
  });

  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");

  const [stylePurchasingResult, itemCostHistory] = await Promise.all([
    getItemReplenishment(client, itemId, companyId),
    getItemCostHistory(client, itemId, companyId)
  ]);

  if (stylePurchasingResult.error) {
    throw redirect(
      path.to.items,
      await flash(
        request,
        error(stylePurchasingResult.error, "Failed to load style purchasing")
      )
    );
  }

  return {
    stylePurchasing: stylePurchasingResult.data,
    batchProperties: getBatchProperties(client, [itemId], companyId),
    itemCostHistory: itemCostHistory.data ?? []
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts"
  });

  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");

  const validation = await validator(itemPurchasingValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const updateStylePurchasing = await upsertItemPurchasing(client, {
    ...validation.data,
    itemId,
    updatedBy: userId
  });
  if (updateStylePurchasing.error) {
    throw redirect(
      path.to.style(itemId),
      await flash(
        request,
        error(updateStylePurchasing.error, "Failed to update style purchasing")
      )
    );
  }

  throw redirect(
    path.to.stylePurchasing(itemId),
    await flash(request, success("Updated style purchasing"))
  );
}

export default function StylePurchasingRoute() {
  const { stylePurchasing, batchProperties, itemCostHistory } =
    useLoaderData<typeof loader>();

  const { itemId } = useParams();
  if (!itemId) throw new Error("Could not find itemId");
  const routeData = useRouteData<{ supplierParts: SupplierPart[] }>(
    path.to.style(itemId)
  );
  const supplierParts = routeData?.supplierParts ?? [];

  const styleData = useRouteData<{
    styleSummary: {
      itemTrackingType?: string;
      readableIdWithRevision?: string;
      unitOfMeasureCode?: string | null;
    };
  }>(path.to.style(itemId));

  const initialValues = {
    ...stylePurchasing,
    preferredSupplierId: stylePurchasing?.preferredSupplierId ?? undefined,
    leadTime: stylePurchasing?.leadTime ?? "",
    purchasingBlocked: stylePurchasing?.purchasingBlocked ?? false,
    purchasingUnitOfMeasureCode:
      stylePurchasing?.purchasingUnitOfMeasureCode ?? "",
    conversionFactor: stylePurchasing?.conversionFactor ?? 1
  };

  return (
    <VStack spacing={2} className="p-2">
      <ItemPurchasingForm
        key={initialValues.itemId}
        initialValues={initialValues}
        allowedSuppliers={
          supplierParts.map((s) => s.supplierId).filter(Boolean) as string[]
        }
        inventoryUnitOfMeasureCode={styleData?.styleSummary?.unitOfMeasureCode}
      />
      <SupplierParts supplierParts={supplierParts} />
      {["Batch", "Serial"].includes(
        styleData?.styleSummary?.itemTrackingType ?? ""
      ) && (
        <Suspense fallback={null}>
          <Await resolve={batchProperties}>
            {(resolvedProperties) => (
              <BatchPropertiesConfig
                itemId={itemId}
                key={`batch-properties:${itemId}`}
                properties={resolvedProperties.data ?? []}
              />
            )}
          </Await>
        </Suspense>
      )}
      <ItemCostHistoryChart
        readableId={styleData?.styleSummary?.readableIdWithRevision ?? ""}
        itemCostHistory={itemCostHistory}
      />
    </VStack>
  );
}
