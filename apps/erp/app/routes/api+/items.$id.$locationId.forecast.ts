import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { getLocalTimeZone, today } from "@internationalized/date";
import type { LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { sumQuantityByGroup } from "~/modules/items/itemForecast";
import {
  getDemandForecastSources,
  getItemDemand,
  getItemQuantities,
  getItemSupply,
  getOpenJobMaterials,
  getOpenProductionOrders,
  getOpenPurchaseOrderLines,
  getOpenSalesOrderLines,
  getVariantFamilyItemIds
} from "~/modules/items/items.service";
import { getOrCreatePeriods } from "~/modules/shared/shared.server";

const defaultResponse = {
  demand: [],
  demandForecast: [],
  demandForecastSources: [],
  supply: [],
  periods: [],
  quantityOnHand: 0,
  openSalesOrderLines: [],
  openJobMaterials: [],
  openProductionOrders: [],
  openPurchaseOrderLines: []
};

const WEEKS_TO_FORECAST = 12 * 4;

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts"
  });

  const { id: itemId, locationId } = params;
  if (!itemId) throw new Error("Could not find itemId");
  if (!locationId) throw new Error("Could not find locationId");

  const periods = await getOrCreatePeriods(
    today(getLocalTimeZone()),
    WEEKS_TO_FORECAST
  );
  const periodIds = periods.map((p) => p.id ?? "");
  const familyItemIds = await getVariantFamilyItemIds(
    client,
    itemId,
    companyId
  );

  const [
    demand,
    supply,
    quantities,
    openSalesOrderLines,
    openJobMaterials,
    openProductionOrders,
    openPurchaseOrderLines,
    demandForecastSources
  ] = await Promise.all([
    getItemDemand(client, {
      itemId: familyItemIds,
      locationId,
      periods: periodIds,
      companyId
    }),
    getItemSupply(client, {
      itemId: familyItemIds,
      locationId,
      periods: periodIds,
      companyId
    }),
    getItemQuantities(client, itemId, companyId, locationId),
    getOpenSalesOrderLines(client, {
      itemId: familyItemIds,
      companyId,
      locationId
    }),
    getOpenJobMaterials(client, {
      itemId: familyItemIds,
      companyId,
      locationId
    }),
    getOpenProductionOrders(client, {
      itemId: familyItemIds,
      companyId,
      locationId
    }),
    getOpenPurchaseOrderLines(client, {
      itemId: familyItemIds,
      companyId,
      locationId
    }),
    getDemandForecastSources(client, {
      itemId: familyItemIds,
      locationId,
      periods: periodIds,
      companyId
    })
  ]);

  if (demand.error || supply.error) {
    return data(
      { ...defaultResponse, periods },
      await flash(request, error(null, "Failed to load demand"))
    );
  }

  const demandActuals = sumQuantityByGroup(demand.actuals, "actualQuantity", [
    "periodId",
    "sourceType"
  ]);
  const demandForecasts = sumQuantityByGroup(
    demand.forecasts,
    "forecastQuantity",
    ["periodId"]
  );
  const supplyActuals = sumQuantityByGroup(supply.actuals, "actualQuantity", [
    "periodId",
    "sourceType"
  ]);
  const supplyForecasts = sumQuantityByGroup(
    supply.forecasts,
    "forecastQuantity",
    ["periodId", "sourceType"]
  );

  return {
    demand: demandActuals,
    demandForecast: demandForecasts,
    demandForecastSources: demandForecastSources.data ?? [],
    supply: [
      ...supplyActuals,
      ...supplyForecasts.map((f) => ({
        ...f,
        actualQuantity: f.forecastQuantity
      }))
    ],
    periods,
    quantityOnHand: quantities.data?.quantityOnHand ?? 0,
    openSalesOrderLines: openSalesOrderLines.data ?? [],
    openJobMaterials: openJobMaterials.data ?? [],
    openProductionOrders: openProductionOrders.data ?? [],
    openPurchaseOrderLines: openPurchaseOrderLines.data ?? []
  };
}
