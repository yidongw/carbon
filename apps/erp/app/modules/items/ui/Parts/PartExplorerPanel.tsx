import {
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { Suspense, useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { useFetcher, useSearchParams } from "react-router";
import type { PartSummary } from "~/modules/items";
import BoMExplorer, { BoMActions } from "~/modules/items/ui/Item/BoMExplorer";
import { UsedInTree } from "~/modules/items/ui/Item/UsedIn";
import type { loader as explorerLoader } from "~/routes/api+/items.part-explorer.$itemId";
import { path } from "~/utils/path";
import { usePartUsedInGroups } from "./usePartUsedInGroups";

function PartUsedInExplorer({
  partSummary,
  filterText
}: {
  partSummary: PartSummary;
  filterText: string;
}) {
  const usedInTree = usePartUsedInGroups(partSummary.id!);

  return (
    <UsedInTree
      tree={usedInTree}
      revisions={partSummary.revisions}
      itemReadableId={partSummary.readableId ?? ""}
      itemReadableIdWithRevision={partSummary.readableIdWithRevision ?? ""}
      filterText={filterText}
      hideSearch
    />
  );
}

export default function PartExplorerPanel({
  partSummary
}: {
  partSummary: PartSummary;
}) {
  const { t } = useLingui();
  const [searchParams] = useSearchParams();
  const [filterText, setFilterText] = useState("");
  const fetcher = useFetcher<typeof explorerLoader>();

  const itemId = partSummary.id!;
  const methodId = searchParams.get("methodId");
  const explorerUrl =
    path.to.api.partExplorer(itemId) +
    (methodId ? `?methodId=${encodeURIComponent(methodId)}` : "");

  const isManufactured = partSummary.replenishmentSystem !== "Buy";

  useEffect(() => {
    if (!isManufactured) return;
    if (fetcher.state === "idle" && !fetcher.data) {
      fetcher.load(explorerUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [explorerUrl, isManufactured]);
  const methodTreeLoading = fetcher.state !== "idle" && !fetcher.data;
  const { methodTree } = fetcher.data ?? {};

  return (
    <div className="flex flex-col h-full">
      {isManufactured ? (
        <Tabs defaultValue="manufacturing" className="flex flex-col h-full">
          <div className="px-2 pt-2 flex-shrink-0">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="manufacturing">
                <Trans>Manufacturing</Trans>
              </TabsTrigger>
              <TabsTrigger value="used-in">
                <Trans>Used In</Trans>
              </TabsTrigger>
            </TabsList>
          </div>
          <HStack className="w-full justify-between flex-shrink-0 p-2 pb-0">
            <InputGroup size="sm" className="flex flex-grow">
              <InputLeftElement>
                <LuSearch className="h-4 w-4" />
              </InputLeftElement>
              <Input
                placeholder={t`Search...`}
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </InputGroup>
            {methodTree ? (
              <Suspense fallback={null}>
                <BoMActions makeMethodId={methodTree.makeMethod.id} />
              </Suspense>
            ) : null}
          </HStack>
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="manufacturing">
              {methodTree ? (
                <Suspense
                  fallback={
                    <div className="flex w-full items-center justify-center p-4">
                      <Spinner className="h-6 w-6" />
                    </div>
                  }
                >
                  <div className="w-full p-2">
                    <BoMExplorer
                      itemType="Part"
                      makeMethod={methodTree.makeMethod}
                      // @ts-ignore
                      methods={methodTree.methods}
                      methodId={methodTree.makeMethod.id}
                      filterText={filterText}
                      hideSearch
                    />
                  </div>
                </Suspense>
              ) : methodTreeLoading ? (
                <div className="flex w-full items-center justify-center p-4">
                  <Spinner className="h-6 w-6" />
                </div>
              ) : null}
            </TabsContent>
            <TabsContent value="used-in">
              <PartUsedInExplorer
                partSummary={partSummary}
                filterText={filterText}
              />
            </TabsContent>
          </div>
        </Tabs>
      ) : (
        <>
          <HStack className="w-full justify-between flex-shrink-0 p-2 pb-0">
            <InputGroup size="sm" className="flex flex-grow">
              <InputLeftElement>
                <LuSearch className="h-4 w-4" />
              </InputLeftElement>
              <Input
                placeholder={t`Search...`}
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </InputGroup>
          </HStack>
          <div className="flex-1 overflow-y-auto">
            <PartUsedInExplorer
              partSummary={partSummary}
              filterText={filterText}
            />
          </div>
        </>
      )}
    </div>
  );
}
