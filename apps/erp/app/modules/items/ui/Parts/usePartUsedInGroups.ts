import { useLingui } from "@lingui/react/macro";
import { useEffect, useState } from "react";
import {
  createLoadingUsedInNodes,
  PART_USED_IN_GROUP_DEFINITIONS,
  transformPartUsedInGroupChildren,
  type PartUsedInGroupKey
} from "~/modules/items/partUsedInGroups";
import type { UsedInNode } from "~/modules/items/ui/Item/UsedIn";
import { path } from "~/utils/path";

type GroupLoaderResponse = {
  group: PartUsedInGroupKey;
  children: UsedInNode["children"];
};

export function usePartUsedInGroups(itemId: string) {
  const { t } = useLingui();
  const [nodes, setNodes] = useState<UsedInNode[]>(() =>
    createLoadingUsedInNodes(t)
  );

  useEffect(() => {
    setNodes(createLoadingUsedInNodes(t));

    const controllers = PART_USED_IN_GROUP_DEFINITIONS.map((group) => {
      const controller = new AbortController();

      fetch(
        `${path.to.api.partExplorer(itemId)}?group=${encodeURIComponent(group.key)}`,
        { signal: controller.signal }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to load ${group.key}`);
          }
          return response.json() as Promise<GroupLoaderResponse>;
        })
        .then((data) => {
          setNodes((current) =>
            current.map((node) =>
              node.key === data.group
                ? {
                    ...node,
                    children: transformPartUsedInGroupChildren(
                      data.group,
                      data.children
                    ),
                    isLoading: false
                  }
                : node
            )
          );
        })
        .catch((error) => {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }

          setNodes((current) =>
            current.map((node) =>
              node.key === group.key ? { ...node, isLoading: false } : node
            )
          );
        });

      return controller;
    });

    return () => {
      for (const controller of controllers) {
        controller.abort();
      }
    };
  }, [itemId, t]);

  return nodes;
}
