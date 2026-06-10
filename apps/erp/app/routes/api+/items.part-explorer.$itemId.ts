import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import { getPartUsedInGroup } from "~/modules/items";
import {
  getPartMethodTree,
  type PartMethodTree
} from "~/modules/items/partUsedIn.server";
import type { PartUsedInGroupKey } from "~/modules/items/partUsedInGroups";
import { PART_USED_IN_GROUP_DEFINITIONS } from "~/modules/items/partUsedInGroups";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts"
  });

  const { itemId } = params;
  if (!itemId) {
    return { methodTree: null as PartMethodTree | null };
  }

  const url = new URL(request.url);
  const requestedMethodId = url.searchParams.get("methodId");
  const requestedGroup = url.searchParams.get("group") as PartUsedInGroupKey | null;

  if (
    requestedGroup &&
    PART_USED_IN_GROUP_DEFINITIONS.some((group) => group.key === requestedGroup)
  ) {
    return {
      group: requestedGroup,
      children: await getPartUsedInGroup(
        client,
        itemId,
        companyId,
        requestedGroup
      )
    };
  }

  const methodTree = await getPartMethodTree(
    client,
    itemId,
    companyId,
    requestedMethodId
  );

  return { methodTree };
}
