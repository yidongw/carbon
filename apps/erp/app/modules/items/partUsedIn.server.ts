import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { flattenTree } from "~/components/TreeView";
import { getMakeMethods, getMethodTree, getPartUsedInGroup } from "./items.service";
import {
  PART_USED_IN_GROUP_DEFINITIONS,
  transformPartUsedInGroupChildren,
  type PartUsedInGroupKey
} from "./partUsedInGroups";
import type { UsedInNode } from "./ui/Item/UsedIn";

export type PartMethodTree = {
  makeMethod: NonNullable<
    Awaited<ReturnType<typeof getMakeMethods>>["data"]
  >[number];
  methods: ReturnType<typeof flattenTree>;
};

export type PartUsedInGroupPromises = Record<
  PartUsedInGroupKey,
  Promise<UsedInNode["children"]>
>;

export function createPartUsedInGroupPromises(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string
): PartUsedInGroupPromises {
  return Object.fromEntries(
    PART_USED_IN_GROUP_DEFINITIONS.map((group) => [
      group.key,
      getPartUsedInGroup(client, itemId, companyId, group.key).then(
        (children) => transformPartUsedInGroupChildren(group.key, children)
      )
    ])
  ) as PartUsedInGroupPromises;
}

export function createEmptyPartUsedInGroupPromises(): PartUsedInGroupPromises {
  return Object.fromEntries(
    PART_USED_IN_GROUP_DEFINITIONS.map((group) => [group.key, Promise.resolve([])])
  ) as PartUsedInGroupPromises;
}

export function createPendingPartUsedInGroupPromises(): PartUsedInGroupPromises {
  return Object.fromEntries(
    PART_USED_IN_GROUP_DEFINITIONS.map((group) => [
      group.key,
      new Promise<UsedInNode["children"]>(() => {})
    ])
  ) as PartUsedInGroupPromises;
}

export async function getPartMethodTree(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string,
  requestedMethodId?: string | null
): Promise<PartMethodTree | null> {
  const makeMethods = await getMakeMethods(client, itemId, companyId);
  const makeMethod = !makeMethods.data?.length
    ? null
    : requestedMethodId
      ? (makeMethods.data.find((method) => method.id === requestedMethodId) ??
        makeMethods.data.find((method) => method.status === "Active") ??
        makeMethods.data[0])
      : (makeMethods.data.find((method) => method.status === "Active") ??
        makeMethods.data[0]);

  if (!makeMethod) return null;

  const tree = await getMethodTree(client, makeMethod.id);
  if (tree.error) return null;

  const methods = tree.data.length > 0 ? flattenTree(tree.data[0]) : [];

  return { makeMethod, methods };
}
