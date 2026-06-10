import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import { flattenTree } from "~/components/TreeView";
import {
  getMakeMethods,
  getMethodTree,
  getPartUsedIn
} from "~/modules/items";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts"
  });

  const { itemId } = params;
  if (!itemId) {
    return { usedIn: null, methodTree: null };
  }

  const url = new URL(request.url);
  const requestedMethodId = url.searchParams.get("methodId");

  const makeMethods = await getMakeMethods(client, itemId, companyId);
  const makeMethod = !makeMethods.data?.length
    ? null
    : requestedMethodId
      ? (makeMethods.data.find((m) => m.id === requestedMethodId) ??
        makeMethods.data.find((m) => m.status === "Active") ??
        makeMethods.data[0])
      : (makeMethods.data.find((m) => m.status === "Active") ??
        makeMethods.data[0]);

  const [usedIn, methodTree] = await Promise.all([
    getPartUsedIn(client, itemId, companyId),
    makeMethod
      ? getMethodTree(client, makeMethod.id).then((tree) => {
          if (tree.error) return null;
          const methods =
            tree.data.length > 0 ? flattenTree(tree.data[0]) : [];
          return { makeMethod, methods };
        })
      : Promise.resolve(null)
  ]);

  return { usedIn, methodTree };
}
