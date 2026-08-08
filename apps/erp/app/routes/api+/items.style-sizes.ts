import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import {
  getGarmentAttributeValueList,
  SYSTEM_ATTRIBUTE
} from "~/modules/items/itemAttribute.service";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {});
  return await getGarmentAttributeValueList(client, {
    attributeId: SYSTEM_ATTRIBUTE.size,
    companyId
  });
}
