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
import { Suspense, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { Await } from "react-router";
import type { PartSummary } from "~/modules/items";
import type {
  PartMethodTree,
  PartUsedInGroupPromises
} from "~/modules/items/partUsedIn.server";
import BoMExplorer, { BoMActions } from "~/modules/items/ui/Item/BoMExplorer";
import { PartUsedInExplorer } from "./PartUsedInExplorer";

export default function PartExplorerPanel({
  usedInGroups,
  methodTree,
  partSummary
}: {
  usedInGroups: PartUsedInGroupPromises;
  methodTree: Promise<PartMethodTree | null>;
  partSummary: Promise<PartSummary>;
}) {
  const { t } = useLingui();
  const [filterText, setFilterText] = useState("");

  const searchInput = (
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
  );

  const usedInExplorer = (
    <PartUsedInExplorer
      usedInGroups={usedInGroups}
      partSummary={partSummary}
      filterText={filterText}
      hideSearch
    />
  );

  return (
    <div className="flex flex-col h-full">
      <Suspense
        fallback={
          <>
            <HStack className="w-full justify-between flex-shrink-0 p-2 pb-0">
              {searchInput}
            </HStack>
            <div className="flex-1 overflow-y-auto">{usedInExplorer}</div>
          </>
        }
      >
        <Await resolve={partSummary}>
          {(resolvedPartSummary) => {
            const isManufactured =
              resolvedPartSummary.replenishmentSystem !== "Buy";

            if (!isManufactured) {
              return (
                <>
                  <HStack className="w-full justify-between flex-shrink-0 p-2 pb-0">
                    {searchInput}
                  </HStack>
                  <div className="flex-1 overflow-y-auto">{usedInExplorer}</div>
                </>
              );
            }

            return (
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
                  {searchInput}
                  <Suspense fallback={null}>
                    <Await resolve={methodTree}>
                      {(resolvedMethodTree) =>
                        resolvedMethodTree ? (
                          <BoMActions
                            makeMethodId={resolvedMethodTree.makeMethod.id}
                          />
                        ) : null
                      }
                    </Await>
                  </Suspense>
                </HStack>
                <div className="flex-1 overflow-y-auto">
                  <TabsContent value="manufacturing">
                    <Suspense
                      fallback={
                        <div className="flex w-full items-center justify-center p-4">
                          <Spinner className="h-6 w-6" />
                        </div>
                      }
                    >
                      <Await resolve={methodTree}>
                        {(resolvedMethodTree) =>
                          resolvedMethodTree ? (
                            <div className="w-full p-2">
                              <BoMExplorer
                                itemType="Part"
                                makeMethod={resolvedMethodTree.makeMethod}
                                // @ts-ignore
                                methods={resolvedMethodTree.methods}
                                methodId={resolvedMethodTree.makeMethod.id}
                                filterText={filterText}
                                hideSearch
                              />
                            </div>
                          ) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              <Trans>No make method found for this part.</Trans>
                            </div>
                          )
                        }
                      </Await>
                    </Suspense>
                  </TabsContent>
                  <TabsContent value="used-in">{usedInExplorer}</TabsContent>
                </div>
              </Tabs>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
