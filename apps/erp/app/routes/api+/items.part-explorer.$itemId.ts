import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import { flattenTree } from "~/components/TreeView";
import {
  getMakeMethods,
  getMethodTree,
  getPartUsedInGroup
} from "~/modules/items";
import type { PartUsedInGroupKey } from "~/modules/items/partUsedInGroups";
import { PART_USED_IN_GROUP_DEFINITIONS } from "~/modules/items/partUsedInGroups";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts"
  });

  const { itemId } = params;
  if (!itemId) {
    return { methodTree: null };
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

  const makeMethods = await getMakeMethods(client, itemId, companyId);
  const makeMethod = !makeMethods.data?.length
    ? null
    : requestedMethodId
      ? (makeMethods.data.find((m) => m.id === requestedMethodId) ??
        makeMethods.data.find((m) => m.status === "Active") ??
        makeMethods.data[0])
      : (makeMethods.data.find((m) => m.status === "Active") ??
        makeMethods.data[0]);

  const methodTree = makeMethod
    ? await getMethodTree(client, makeMethod.id).then((tree) => {
        if (tree.error) return null;
        const methods = tree.data.length > 0 ? flattenTree(tree.data[0]) : [];
        return { makeMethod, methods };
      })
    : null;

  return { methodTree };
}
