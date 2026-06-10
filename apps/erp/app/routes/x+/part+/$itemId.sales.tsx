import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { VStack } from "@carbon/react";
import { Suspense } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Await, redirect, useLoaderData } from "react-router";
import {
  getItemCustomerParts,
  getItemUnitSalePrice,
  itemUnitSalePriceValidator,
  upsertItemUnitSalePrice
} from "~/modules/items";
import { ItemSalePriceForm } from "~/modules/items/ui/Item";
import CustomerParts from "~/modules/items/ui/Item/CustomerParts";
import { getCustomFields, setCustomFields } from "~/utils/form";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts",
    role: "employee"
  });

  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");

  const salesData = (async () => {
    try {
      const [partUnitSalePrice, customerParts] = await Promise.all([
        getItemUnitSalePrice(client, itemId, companyId),
        getItemCustomerParts(client, itemId, companyId)
      ]);

      if (partUnitSalePrice.error) return null;

      return {
        partUnitSalePrice: partUnitSalePrice.data,
        customerParts: customerParts.data,
        itemId
      };
    } catch {
      return null;
    }
  })();

  return { salesData };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts"
  });

  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");

  const formData = await request.formData();
  const validation = await validator(itemUnitSalePriceValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const updatePartUnitSalePrice = await upsertItemUnitSalePrice(client, {
    ...validation.data,
    itemId,
    updatedBy: userId,
    customFields: setCustomFields(formData)
  });
  if (updatePartUnitSalePrice.error) {
    throw redirect(
      path.to.part(itemId),
      await flash(
        request,
        error(updatePartUnitSalePrice.error, "Failed to update part sale price")
      )
    );
  }

  throw redirect(
    path.to.partSales(itemId),
    await flash(request, success("Updated part sale price"))
  );
}

export default function PartSalesRoute() {
  const { salesData } = useLoaderData<typeof loader>();

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
        <Await resolve={salesData}>
          {(resolved) => {
            if (!resolved) return null;
            const { partUnitSalePrice, customerParts, itemId } = resolved;
            const initialValues = {
              ...partUnitSalePrice,
              salesUnitOfMeasureCode: partUnitSalePrice?.salesUnitOfMeasureCode ?? "",
              ...getCustomFields(partUnitSalePrice.customFields),
              itemId
            };
            return (
              <>
                <ItemSalePriceForm
                  key={initialValues.itemId}
                  initialValues={initialValues}
                />
                {customerParts ? (
                  <CustomerParts customerParts={customerParts} itemId={itemId} />
                ) : null}
              </>
            );
          }}
        </Await>
      </Suspense>
    </VStack>
  );
}
