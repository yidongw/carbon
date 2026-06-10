import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { VStack } from "@carbon/react";
import { Suspense } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Await, redirect, useLoaderData } from "react-router";
import {
  getItemCost,
  getItemCostHistory,
  itemCostValidator,
  upsertItemCost
} from "~/modules/items";
import { ItemCostingForm } from "~/modules/items/ui/Item";
import { ItemCostHistoryChart } from "~/modules/items/ui/Item/ItemCostHistoryChart";
import { getCustomFields, setCustomFields } from "~/utils/form";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts"
  });

  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");

  const costingData = (async () => {
    try {
      const [itemCost, itemCostHistory] = await Promise.all([
        getItemCost(client, itemId, companyId),
        getItemCostHistory(client, itemId, companyId)
      ]);

      if (itemCost.error) return null;

      return {
        itemCost: itemCost.data,
        itemCostHistory: itemCostHistory.data ?? []
      };
    } catch {
      return null;
    }
  })();

  return { costingData };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts"
  });

  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");

  const formData = await request.formData();
  const validation = await validator(itemCostValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const updateItemCost = await upsertItemCost(client, {
    ...validation.data,
    itemId,
    updatedBy: userId,
    customFields: setCustomFields(formData)
  });
  if (updateItemCost.error) {
    throw redirect(
      path.to.part(itemId),
      await flash(
        request,
        error(updateItemCost.error, "Failed to update part costing")
      )
    );
  }

  throw redirect(
    path.to.partCosting(itemId),
    await flash(request, success("Updated part costing"))
  );
}

export default function PartCostingRoute() {
  const { costingData } = useLoaderData<typeof loader>();

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
        <Await resolve={costingData}>
          {(resolved) => {
            if (!resolved) return null;
            return (
              <>
                <ItemCostingForm
                  key={resolved.itemCost.itemId}
                  // @ts-expect-error TS2322 - TODO: fix type
                  initialValues={{
                    ...resolved.itemCost,
                    itemPostingGroupId: resolved.itemCost.itemPostingGroupId ?? undefined,
                    ...getCustomFields(resolved.itemCost.customFields)
                  }}
                />
                <ItemCostHistoryChart
                  readableId={resolved.itemCost.readableIdWithRevision ?? ""}
                  itemCostHistory={resolved.itemCostHistory}
                />
              </>
            );
          }}
        </Await>
      </Suspense>
    </VStack>
  );
}
