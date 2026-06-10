import { path } from "~/utils/path";

export function prefetchPartSiblingRoutes(itemId: string) {
  const routes = [
    path.to.partPurchasing(itemId),
    path.to.partCosting(itemId),
    path.to.partPlanning(itemId),
    path.to.partInventory(itemId),
    path.to.partSales(itemId),
    path.to.partQuality(itemId)
  ];

  routes.forEach((href, index) => {
    window.setTimeout(() => {
      void fetch(href, { credentials: "include" });
    }, index * 100);
  });
}
