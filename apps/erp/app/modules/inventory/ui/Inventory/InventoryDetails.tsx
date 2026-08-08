import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  VStack
} from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import { useLocale } from "@react-aria/i18n";
import { useState } from "react";
import { LuMoveDown, LuMoveUp } from "react-icons/lu";
import type { z } from "zod";
import { DateSelect } from "~/components/DateSelect";
import { StyleQuantityCell } from "~/components/StyleQuantityCell";
import type {
  ItemQuantities,
  ItemStorageUnitQuantities,
  itemTrackingTypes,
  pickMethodValidator
} from "~/modules/items";
import type { BreakdownEntry } from "../../types";
import InventoryStorageUnits from "./InventoryStorageUnits";
import { SkuQuantitiesCard, type SkuQuantityRow } from "./SkuQuantitiesCard";

type InventoryDetailsProps = {
  itemStorageUnitQuantities: ItemStorageUnitQuantities[];
  itemUnitOfMeasureCode: string;
  itemTrackingType: (typeof itemTrackingTypes)[number];
  itemShelfLife: {
    mode: string | null;
    days: number | null;
  } | null;
  trackedEntityExpirations: Record<string, string | null>;
  pickMethod: z.infer<typeof pickMethodValidator>;
  quantities: ItemQuantities | null;
  pendingTransfers?: { toShip: number; toReceive: number };
  storageUnits: { value: string; label: string }[];
  // Per-variant (SKU) on-hand for Style items; empty for non-Style items.
  variantQuantities?: SkuQuantityRow[];
};

const InventoryDetails = ({
  itemStorageUnitQuantities,
  itemUnitOfMeasureCode,
  itemTrackingType,
  itemShelfLife,
  trackedEntityExpirations,
  pickMethod,
  quantities,
  pendingTransfers,
  storageUnits,
  variantQuantities
}: InventoryDetailsProps) => {
  const { locale } = useLocale();
  const formatter = Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true
  });
  const [usageWindow, setUsageWindow] = useState<"30" | "90">("30");
  const dailyUsage =
    usageWindow === "30"
      ? (quantities?.usageLast30Days ?? 0)
      : (quantities?.usageLast90Days ?? 0);

  // Style items (with variant SKUs) get a clickable SKU breakdown on the
  // On Hand / On Jobs cards, sourced from the RPC's variant-rollup jsonb.
  const isStyle = (variantQuantities?.length ?? 0) > 0;
  const breakdown =
    (quantities as { breakdown?: BreakdownEntry[] } | null)?.breakdown ?? [];
  const jobBreakdown =
    (quantities as { jobBreakdown?: BreakdownEntry[] } | null)?.jobBreakdown ??
    [];
  const statCardClassName =
    "flex items-center gap-2 text-4xl font-medium tracking-tighter hover:opacity-70 transition-opacity";

  return (
    <VStack>
      <div className="w-full grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <Trans>Quantity on Hand</Trans>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isStyle && (quantities?.quantityOnHand ?? 0) > 0 ? (
              <StyleQuantityCell
                value={quantities?.quantityOnHand ?? 0}
                breakdown={breakdown}
                className={statCardClassName}
              />
            ) : (
              <h3 className="text-4xl font-medium tracking-tighter">
                {formatter.format(quantities?.quantityOnHand ?? 0)}
              </h3>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <Trans>Days Remaining</Trans>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-4xl font-medium tracking-tighter">
              {formatter.format(quantities?.daysRemaining ?? 0)}
            </h3>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>
              <Trans>Daily Usage</Trans>
            </CardTitle>
            <DateSelect
              value={usageWindow}
              onValueChange={(v) => {
                if (v === "30" || v === "90") setUsageWindow(v);
              }}
              options={[
                { value: "30", label: "30D" },
                { value: "90", label: "90D" }
              ]}
              showCustom={false}
            />
          </CardHeader>
          <CardContent>
            <h3 className="text-4xl font-medium tracking-tighter">
              {formatter.format(dailyUsage)}
            </h3>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <Trans>Quantity on Purchase Order</Trans>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-start items-center gap-1">
              <h3 className="text-4xl font-medium tracking-tighter">
                {formatter.format(quantities?.quantityOnPurchaseOrder ?? 0)}
              </h3>
              <LuMoveUp className="text-emerald-500 text-lg" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <Trans>Quantity on Sales Order</Trans>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-start items-center gap-1">
              <h3 className="text-4xl font-medium tracking-tighter">
                {formatter.format(quantities?.quantityOnSalesOrder ?? 0)}
              </h3>
              <LuMoveDown className="text-red-500 text-lg" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <Trans>Quantity on Jobs</Trans>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-start gap-2">
              <div className="flex justify-start items-center gap-1">
                {isStyle && (quantities?.quantityOnProductionOrder ?? 0) > 0 ? (
                  <StyleQuantityCell
                    value={quantities?.quantityOnProductionOrder ?? 0}
                    breakdown={jobBreakdown}
                    quantityHeader={<Trans>On Jobs</Trans>}
                    className={statCardClassName}
                  />
                ) : (
                  <h3 className="text-4xl font-medium tracking-tighter">
                    {formatter.format(
                      quantities?.quantityOnProductionOrder ?? 0
                    )}
                  </h3>
                )}
                <LuMoveUp className="text-emerald-500 text-lg" />
              </div>
              <div className="flex justify-start items-center gap-1">
                <h3 className="text-4xl font-medium tracking-tighter">
                  {formatter.format(
                    quantities?.quantityOnProductionDemand ?? 0
                  )}
                </h3>
                <LuMoveDown className="text-red-500 text-lg" />
              </div>
            </div>
          </CardContent>
        </Card>
        {pendingTransfers && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>
                  <Trans>To Ship</Trans>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-start items-center gap-1">
                  {isStyle && (pendingTransfers.toShip ?? 0) > 0 ? (
                    <StyleQuantityCell
                      value={pendingTransfers.toShip ?? 0}
                      breakdown={[]}
                      className={statCardClassName}
                    />
                  ) : (
                    <h3 className="text-4xl font-medium tracking-tighter">
                      {formatter.format(pendingTransfers.toShip ?? 0)}
                    </h3>
                  )}
                  <LuMoveDown className="text-red-500 text-lg" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>
                  <Trans>To Receive</Trans>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-start items-center gap-1">
                  {isStyle && (pendingTransfers.toReceive ?? 0) > 0 ? (
                    <StyleQuantityCell
                      value={pendingTransfers.toReceive ?? 0}
                      breakdown={[]}
                      className={statCardClassName}
                    />
                  ) : (
                    <h3 className="text-4xl font-medium tracking-tighter">
                      {formatter.format(pendingTransfers.toReceive ?? 0)}
                    </h3>
                  )}
                  <LuMoveUp className="text-emerald-500 text-lg" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      {variantQuantities && variantQuantities.length > 0 && (
        <SkuQuantitiesCard variantQuantities={variantQuantities} />
      )}
      <InventoryStorageUnits
        itemStorageUnitQuantities={itemStorageUnitQuantities}
        itemUnitOfMeasureCode={itemUnitOfMeasureCode}
        itemTrackingType={itemTrackingType}
        itemShelfLife={itemShelfLife}
        trackedEntityExpirations={trackedEntityExpirations}
        pickMethod={pickMethod}
        storageUnits={storageUnits}
      />
    </VStack>
  );
};

export default InventoryDetails;
