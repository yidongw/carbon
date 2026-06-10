import { HStack, Input, InputGroup, InputLeftElement, VStack } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { Suspense, useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { Await } from "react-router";
import { z } from "zod";
import type { PartSummary } from "~/modules/items";
import type { PartUsedInGroupPromises } from "~/modules/items/partUsedIn.server";
import { PART_USED_IN_GROUP_DEFINITIONS } from "~/modules/items/partUsedInGroups";
import type { UsedInKey } from "~/modules/items/ui/Item/UsedIn";
import {
  RevisionsItem,
  UsedInItem,
  UsedInSkeleton
} from "~/modules/items/ui/Item/UsedIn";
import { getReadableIdWithRevision } from "~/utils/string";

const revisionValidator = z.array(
  z.object({
    id: z.string(),
    revision: z.string(),
    methodType: z.string(),
    type: z.string()
  })
);

function UsedInGroupAwait({
  name,
  module,
  groupKey,
  childrenPromise,
  filterText,
  itemReadableIdWithRevision
}: {
  name: string;
  module: string;
  groupKey: (typeof PART_USED_IN_GROUP_DEFINITIONS)[number]["key"];
  childrenPromise: Promise<
    import("~/modules/items/ui/Item/UsedIn").UsedInNode["children"]
  >;
  filterText: string;
  itemReadableIdWithRevision: string;
}) {
  const loadingNode = {
    key: groupKey,
    name,
    module,
    children: [],
    isLoading: true
  };

  return (
    <Suspense
      fallback={
        <UsedInItem
          node={loadingNode}
          filterText={filterText}
          itemReadableIdWithRevision={itemReadableIdWithRevision}
        />
      }
    >
      <Await resolve={childrenPromise}>
        {(children) => (
          <UsedInItem
            node={{
              key: groupKey,
              name,
              module,
              children,
              isLoading: false
            }}
            filterText={filterText}
            itemReadableIdWithRevision={itemReadableIdWithRevision}
          />
        )}
      </Await>
    </Suspense>
  );
}

function PartUsedInGroupsList({
  usedInGroups,
  partSummary,
  filterText
}: {
  usedInGroups: PartUsedInGroupPromises;
  partSummary: Promise<PartSummary>;
  filterText: string;
}) {
  const { t } = useLingui();
  const [itemReadableIdWithRevision, setItemReadableIdWithRevision] =
    useState("");

  useEffect(() => {
    let cancelled = false;
    partSummary.then((resolvedPartSummary) => {
      if (!cancelled) {
        setItemReadableIdWithRevision(
          resolvedPartSummary.readableIdWithRevision ?? ""
        );
      }
    });
    return () => {
      cancelled = true;
    };
  }, [partSummary]);

  return (
    <>
      {PART_USED_IN_GROUP_DEFINITIONS.map((group) => (
        <UsedInGroupAwait
          key={group.key}
          groupKey={group.key}
          name={t(group.name)}
          module={group.module}
          childrenPromise={usedInGroups[group.key]}
          filterText={filterText}
          itemReadableIdWithRevision={itemReadableIdWithRevision}
        />
      ))}
    </>
  );
}

export function PartUsedInExplorer({
  usedInGroups,
  partSummary,
  filterText: filterTextProp,
  hideSearch
}: {
  usedInGroups: PartUsedInGroupPromises;
  partSummary: Promise<PartSummary>;
  filterText?: string;
  hideSearch?: boolean;
}) {
  const { t } = useLingui();
  const [filterTextInternal, setFilterTextInternal] = useState("");
  const filterText = filterTextProp ?? filterTextInternal;

  return (
    <VStack className="w-full p-2">
      {!hideSearch && (
        <HStack className="w-full py">
          <InputGroup size="sm" className="flex flex-grow">
            <InputLeftElement>
              <LuSearch className="h-4 w-4" />
            </InputLeftElement>
            <Input
              placeholder={t`Search...`}
              value={filterText}
              onChange={(e) => setFilterTextInternal(e.target.value)}
            />
          </InputGroup>
        </HStack>
      )}
      <VStack spacing={0}>
        <Suspense
          fallback={
            <RevisionsItem
              filterText={filterText}
              node={{
                key: "Part",
                name: t`Revisions`,
                module: "parts",
                children: [],
                isLoading: true
              }}
              maxRevision=""
            />
          }
        >
          <Await resolve={partSummary}>
            {(resolvedPartSummary) => {
              const revisions = (
                revisionValidator.safeParse(resolvedPartSummary.revisions)?.data ??
                []
              ).map((revision) => ({
                id: revision.id,
                documentReadableId: getReadableIdWithRevision(
                  resolvedPartSummary.readableId ?? "",
                  revision.revision
                ),
                methodType: revision.methodType,
                type: revision.type,
                revision: revision.revision
              }));

              return (
                <RevisionsItem
                  filterText={filterText}
                  node={{
                    key: (revisions[0]?.type as UsedInKey) ?? "Part",
                    name: t`Revisions`,
                    module: "parts",
                    children: revisions
                  }}
                  maxRevision={revisions[0]?.revision ?? ""}
                />
              );
            }}
          </Await>
        </Suspense>
        <PartUsedInGroupsList
          usedInGroups={usedInGroups}
          partSummary={partSummary}
          filterText={filterText}
        />
      </VStack>
    </VStack>
  );
}

export function PartUsedInExplorerShell() {
  return <UsedInSkeleton />;
}
