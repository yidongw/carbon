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
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { useFetcher, useSearchParams } from "react-router";
import type { PartSummary } from "~/modules/items";
import type { UsedInNode } from "~/modules/items/ui/Item/UsedIn";
import { UsedInSkeleton } from "~/modules/items/ui/Item/UsedIn";
import type { loader as explorerLoader } from "~/routes/api+/items.part-explorer.$itemId";
import { path } from "~/utils/path";

const BoMExplorer = lazy(
  () => import("~/modules/items/ui/Item/BoMExplorer")
);
const BoMActions = lazy(() =>
  import("~/modules/items/ui/Item/BoMExplorer").then((m) => ({
    default: m.BoMActions
  }))
);
const UsedInTree = lazy(() =>
  import("~/modules/items/ui/Item/UsedIn").then((m) => ({
    default: m.UsedInTree
  }))
);

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

  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data) {
      fetcher.load(explorerUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [explorerUrl]);

  const isManufactured = partSummary.replenishmentSystem !== "Buy";
  const loading = fetcher.state !== "idle" && !fetcher.data;
  const { usedIn, methodTree } = fetcher.data ?? {};

  const usedInTree = useMemo((): UsedInNode[] | null => {
    if (!usedIn) return null;

    const {
      issues,
      jobMaterials,
      jobs,
      maintenanceDispatchItems,
      methodMaterials,
      purchaseOrderLines,
      receiptLines,
      quoteLines,
      quoteMaterials,
      salesOrderLines,
      shipmentLines,
      supplierQuotes
    } = usedIn;

    return [
      { key: "issues", name: t`Issues`, module: "quality", children: issues },
      {
        key: "jobs",
        name: t`Jobs`,
        module: "production",
        children: jobs.map((job) => ({ ...job, methodType: "Make to Order" }))
      },
      {
        key: "jobMaterials",
        name: t`Job Materials`,
        module: "production",
        children: jobMaterials
      },
      {
        key: "maintenanceDispatchItems",
        name: t`Maintenance`,
        module: "resources",
        children: maintenanceDispatchItems
      },
      {
        key: "methodMaterials",
        name: t`Method Materials`,
        module: "parts",
        // @ts-expect-error
        children: methodMaterials
      },
      {
        key: "purchaseOrderLines",
        name: t`Purchase Orders`,
        module: "purchasing",
        children: purchaseOrderLines.map((po) => ({
          ...po,
          methodType: "Purchase to Order"
        }))
      },
      {
        key: "receiptLines",
        name: t`Receipts`,
        module: "inventory",
        children: receiptLines.map((receipt) => ({
          ...receipt,
          methodType: "Pull from Inventory"
        }))
      },
      {
        key: "quoteLines",
        name: t`Quotes`,
        module: "sales",
        children: quoteLines
      },
      {
        key: "quoteMaterials",
        name: t`Quote Materials`,
        module: "sales",
        children: quoteMaterials?.map((qm) => ({
          ...qm,
          documentReadableId: qm.documentReadableId ?? ""
        }))
      },
      {
        key: "salesOrderLines",
        name: t`Sales Orders`,
        module: "sales",
        children: salesOrderLines
      },
      {
        key: "shipmentLines",
        name: t`Shipments`,
        module: "inventory",
        children: shipmentLines.map((shipment) => ({
          ...shipment,
          methodType: "Shipment"
        }))
      },
      {
        key: "supplierQuotes",
        name: t`Supplier Quotes`,
        module: "purchasing",
        children: supplierQuotes
      }
    ];
  }, [usedIn, t]);

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center p-8">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

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
              ) : null}
            </TabsContent>
            <TabsContent value="used-in">
              {usedInTree ? (
                <Suspense fallback={<UsedInSkeleton />}>
                  <UsedInTree
                    tree={usedInTree}
                    revisions={partSummary.revisions}
                    itemReadableId={partSummary.readableId ?? ""}
                    itemReadableIdWithRevision={
                      partSummary.readableIdWithRevision ?? ""
                    }
                    filterText={filterText}
                    hideSearch
                  />
                </Suspense>
              ) : (
                <UsedInSkeleton />
              )}
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
            {usedInTree ? (
              <Suspense fallback={<UsedInSkeleton />}>
                <UsedInTree
                  tree={usedInTree}
                  revisions={partSummary.revisions}
                  itemReadableId={partSummary.readableId ?? ""}
                  itemReadableIdWithRevision={
                    partSummary.readableIdWithRevision ?? ""
                  }
                  filterText={filterText}
                  hideSearch
                />
              </Suspense>
            ) : (
              <UsedInSkeleton />
            )}
          </div>
        </>
      )}
    </div>
  );
}
