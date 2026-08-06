import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import { getAttributeSetFormOptionsForItemType } from "~/modules/items/itemAttribute.service";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {});
  const url = new URL(request.url);
  const itemType = url.searchParams.get("itemType") ?? "Consumable";
  return await getAttributeSetFormOptionsForItemType(
    client,
    itemType,
    companyId
  );
}
