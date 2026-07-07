import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData, useParams } from "react-router";
import { styleValidator } from "~/modules/items";
import { StyleForm } from "~/modules/items/ui/Styles";
import { getCustomFields, setCustomFields } from "~/utils/form";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { companyId } = await requirePermissions(request, {
    view: "parts",
    bypassRls: true
  });

  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");

  const { getStyle } = await import("~/modules/items/style.server");
  const styleSummary = await getStyle(itemId, companyId);
  if (styleSummary.error || !styleSummary.data) {
    throw redirect(
      path.to.items,
      await flash(request, error(styleSummary.error, "Failed to load style"))
    );
  }

  return { styleSummary: styleSummary.data };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts"
  });

  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");

  const formData = await request.formData();
  const validation = await validator(styleValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const styleColorIds = Array.from(formData.entries())
    .filter(([key]) => key.startsWith("styleColorIds["))
    .map(([, value]) => value as string)
    .filter(Boolean);
  const { upsertStyle } = await import("~/modules/items/style.server");
  const updateStyle = await upsertStyle(client, {
    ...validation.data,
    id: itemId,
    styleColorIds,
    customFields: setCustomFields(formData),
    updatedBy: userId
  });
  if (updateStyle.error) {
    throw redirect(
      path.to.style(itemId),
      await flash(request, error(updateStyle.error, "Failed to update style"))
    );
  }

  throw redirect(
    path.to.style(itemId),
    await flash(request, success("Updated style"))
  );
}

export default function StyleRoute() {
  const { itemId } = useParams();
  if (!itemId) throw new Error("Could not find itemId");

  const { styleSummary } = useLoaderData<typeof loader>();

  const initialValues = {
    id: styleSummary.readableId ?? "",
    revision: styleSummary.revision ?? "0",
    name: styleSummary.name ?? "",
    description: styleSummary.description ?? "",
    itemTrackingType:
      (styleSummary.itemTrackingType as
        | "Batch"
        | "Inventory"
        | "Non-Inventory"
        | "Serial"
        | null) ?? "Inventory",
    replenishmentSystem:
      (styleSummary.replenishmentSystem as
        | "Buy"
        | "Buy and Make"
        | "Make"
        | null) ?? "Buy",
    defaultMethodType:
      (styleSummary.defaultMethodType as
        | "Make to Order"
        | "Pull from Inventory"
        | "Purchase to Order"
        | null) ?? "Pull from Inventory",
    unitOfMeasureCode: styleSummary.unitOfMeasureCode ?? "EA",
    unitCost: 0,
    lotSize: 0,
    styleColorIds: (styleSummary.colors ?? []).map((c) => c.id),
    thumbnailPath: styleSummary.thumbnailPath ?? "",
    shelfLifeCalculateFromBom: false,
    tags: styleSummary.tags ?? [],
    ...getCustomFields(styleSummary.customFields)
  };

  return (
    <div className="max-w-4xl w-full p-2 sm:p-0 mx-auto mt-0 md:mt-8">
      <StyleForm initialValues={initialValues} />
    </div>
  );
}
