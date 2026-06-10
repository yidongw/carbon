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
import type { PostgrestResponse } from "@supabase/supabase-js";
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

  const purchasingData = (async () => {
    try {
      const [partPurchasingResult, itemCostHistory] = await Promise.all([
        getItemReplenishment(client, itemId, companyId),
        getItemCostHistory(client, itemId, companyId)
      ]);

      if (partPurchasingResult.error) return null;

      return {
        partPurchasing: partPurchasingResult.data,
        itemCostHistory: itemCostHistory.data ?? []
      };
    } catch {
      return null;
    }
  })();

  return {
    purchasingData,
    batchProperties: getBatchProperties(client, [itemId], companyId)
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts"
  });

  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");

  // validate with partsValidator
  const validation = await validator(itemPurchasingValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const updatePartPurchasing = await upsertItemPurchasing(client, {
    ...validation.data,
    itemId,
    updatedBy: userId
  });
  if (updatePartPurchasing.error) {
    throw redirect(
      path.to.part(itemId),
      await flash(
        request,
        error(updatePartPurchasing.error, "Failed to update part purchasing")
      )
    );
  }

  throw redirect(
    path.to.partPurchasing(itemId),
    await flash(request, success("Updated part purchasing"))
  );
}

export default function PartPurchasingRoute() {
  const { purchasingData, batchProperties } = useLoaderData<typeof loader>();

  const { itemId } = useParams();
  if (!itemId) throw new Error("Could not find itemId");
  const routeData = useRouteData<{
    supplierParts: Promise<PostgrestResponse<SupplierPart>>;
  }>(path.to.part(itemId));

  const partData = useRouteData<{
    partSummary: { itemTrackingType?: string; readableIdWithRevision?: string };
  }>(path.to.part(itemId));

  const isBatchOrSerial = ["Batch", "Serial"].includes(
    partData?.partSummary?.itemTrackingType ?? ""
  );

  return (
    <VStack spacing={2} className="p-2">
      <Suspense
        fallback={
          <div className="space-y-3 animate-pulse">
            <div className="h-48 bg-muted rounded-md" />
            <div className="h-32 bg-muted rounded-md" />
          </div>
        }
      >
        <Await resolve={purchasingData}>
          {(resolved) => {
            if (!resolved) return null;
            const { partPurchasing, itemCostHistory } = resolved;
            const initialValues = {
              ...partPurchasing,
              preferredSupplierId: partPurchasing?.preferredSupplierId ?? undefined,
              leadTime: partPurchasing?.leadTime ?? "",
              purchasingBlocked: partPurchasing?.purchasingBlocked ?? false,
              purchasingUnitOfMeasureCode:
                partPurchasing?.purchasingUnitOfMeasureCode ?? "",
              conversionFactor: partPurchasing?.conversionFactor ?? 1
            };
            return (
              <>
                <Suspense fallback={null}>
                  <Await resolve={routeData?.supplierParts}>
                    {(supplierPartsResult) => {
                      const supplierParts = supplierPartsResult?.data ?? [];
                      return (
                        <>
                          <ItemPurchasingForm
                            key={initialValues.itemId}
                            initialValues={initialValues}
                            allowedSuppliers={
                              supplierParts
                                .map((s) => s.supplierId)
                                .filter(Boolean) as string[]
                            }
                          />
                          <SupplierParts supplierParts={supplierParts} />
                        </>
                      );
                    }}
                  </Await>
                </Suspense>
                {isBatchOrSerial && (
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
                  readableId={partData?.partSummary?.readableIdWithRevision ?? ""}
                  itemCostHistory={itemCostHistory}
                />
              </>
            );
          }}
        </Await>
      </Suspense>
    </VStack>
  );
}
