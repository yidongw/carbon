import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { VStack } from "@carbon/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import {
  getItemUnitSalePrice,
  itemUnitSalePriceValidator,
  upsertItemUnitSalePrice
} from "~/modules/items";
import { ItemSalePriceForm } from "~/modules/items/ui/Item";
import { getCustomFields, setCustomFields } from "~/utils/form";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts",
    role: "employee"
  });

  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");

  const styleUnitSalePrice = await getItemUnitSalePrice(
    client,
    itemId,
    companyId
  );
  if (styleUnitSalePrice.error) {
    throw redirect(
      path.to.items,
      await flash(
        request,
        error(styleUnitSalePrice.error, "Failed to load style unit sale price")
      )
    );
  }

  return {
    styleUnitSalePrice: styleUnitSalePrice.data,
    itemId
  };
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

  const updateStyleUnitSalePrice = await upsertItemUnitSalePrice(client, {
    ...validation.data,
    itemId,
    updatedBy: userId,
    customFields: setCustomFields(formData)
  });
  if (updateStyleUnitSalePrice.error) {
    throw redirect(
      path.to.style(itemId),
      await flash(
        request,
        error(
          updateStyleUnitSalePrice.error,
          "Failed to update style sale price"
        )
      )
    );
  }

  throw redirect(
    path.to.styleSales(itemId),
    await flash(request, success("Updated style sale price"))
  );
}

export default function StyleSalesRoute() {
  const { itemId, styleUnitSalePrice } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={2} className="p-2">
      <ItemSalePriceForm
        key={itemId}
        initialValues={{
          itemId,
          unitSalePrice: styleUnitSalePrice?.unitSalePrice ?? 0,
          ...getCustomFields(styleUnitSalePrice?.customFields ?? {})
        }}
      />
    </VStack>
  );
}
