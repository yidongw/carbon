import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useParams } from "react-router";
import {
  getShipment,
  getShipmentLines,
  getShipmentRelatedItems,
  getShipmentTracking
} from "~/modules/inventory";
import {
  getJobVariantQuantities,
  jobVariantQuantitiesToConfigTable
} from "~/modules/production/jobVariantQuantity.service";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Shipments`,
  to: path.to.shipments
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "inventory"
  });

  const { shipmentId } = params;
  if (!shipmentId) throw new Error("Could not find shipmentId");

  const [shipment, shipmentLines, shipmentLineTracking] = await Promise.all([
    getShipment(client, shipmentId),
    getShipmentLines(client, shipmentId),
    getShipmentTracking(client, shipmentId, companyId)
  ]);

  if (shipment.error) {
    throw redirect(
      path.to.shipments,
      await flash(request, error(shipment.error, "Failed to load shipment"))
    );
  }

  if (shipment.data.companyId !== companyId) {
    throw redirect(path.to.shipments);
  }

  // Attach source SO/PO/job Style variant plan so Ordered can show chips and the
  // ship modal can hint against what was ordered.
  const rawLines = shipmentLines.data ?? [];
  const sourceLineIds = [
    ...new Set(
      rawLines
        .map((line) => line.lineId)
        .filter((id): id is string => typeof id === "string" && id.length > 0)
    )
  ];
  const orderVariantQuantitiesByLineId = new Map<string, unknown>();
  if (sourceLineIds.length > 0) {
    if (shipment.data.sourceDocument === "Sales Order") {
      const { data } = await client
        .from("salesOrderLine")
        .select("id, configuration")
        .in("id", sourceLineIds);
      for (const row of data ?? []) {
        if (row.configuration != null) {
          orderVariantQuantitiesByLineId.set(row.id, row.configuration);
        }
      }
    } else if (shipment.data.sourceDocument === "Purchase Order") {
      const { data } = await client
        .from("purchaseOrderLine")
        .select("id, configuration")
        .in("id", sourceLineIds);
      for (const row of data ?? []) {
        if (row.configuration != null) {
          orderVariantQuantitiesByLineId.set(row.id, row.configuration);
        }
      }
    }
  }

  // Style jobs store planned variant qty in jobVariantQuantity (not job.configuration).
  const jobIds = [
    ...new Set(
      rawLines
        .map((line) => {
          const fulfillment = line.fulfillment as {
            job?: { id?: string } | null;
          } | null;
          return fulfillment?.job?.id;
        })
        .filter((id): id is string => typeof id === "string" && id.length > 0)
    )
  ];
  const jobVariantQuantitiesByJobId = new Map<string, unknown>();
  await Promise.all(
    jobIds.map(async (jobId) => {
      const planned = await getJobVariantQuantities(client, jobId, companyId);
      if (planned.error || planned.data.length === 0) return;
      jobVariantQuantitiesByJobId.set(
        jobId,
        jobVariantQuantitiesToConfigTable(planned.data)
      );
    })
  );

  const linesWithOrderVariantQuantities = rawLines.map((line) => {
    const fromSource = line.lineId
      ? orderVariantQuantitiesByLineId.get(line.lineId)
      : undefined;
    const jobId = (line.fulfillment as { job?: { id?: string } | null } | null)
      ?.job?.id;
    const fromJob = jobId ? jobVariantQuantitiesByJobId.get(jobId) : undefined;
    return {
      ...line,
      orderVariantQuantities: fromSource ?? fromJob ?? null
    };
  });

  let fixedAssetLines: {
    id: string;
    salesOrderLineId: string;
    assetId: string;
    assetName: string | null;
    assetReadableId: string | null;
    description: string | null;
    shipped: boolean;
    serialNumber: string | null;
  }[] = [];

  if (shipment.data.sourceDocument === "Sales Order") {
    const serviceRole = getCarbonServiceRole();
    const faLineRecords = await serviceRole
      .from("shipmentFixedAssetLine")
      .select(
        "id, salesOrderLineId, shipped, serialNumber, salesOrderLine:salesOrderLineId(assetId, description, fixedAsset:assetId(name, fixedAssetId, serialNumber))"
      )
      .eq("shipmentId", shipmentId);

    fixedAssetLines = (faLineRecords.data ?? [])
      .filter((row) => {
        const sol = row.salesOrderLine as any;
        return sol?.assetId;
      })
      .map((row) => {
        const sol = row.salesOrderLine as any;
        return {
          id: row.id,
          salesOrderLineId: row.salesOrderLineId,
          assetId: sol.assetId,
          assetName: sol.fixedAsset?.name ?? null,
          assetReadableId: sol.fixedAsset?.fixedAssetId ?? null,
          description: sol.description,
          shipped: row.shipped,
          serialNumber: row.serialNumber ?? sol.fixedAsset?.serialNumber ?? null
        };
      });
  }

  return {
    shipment: shipment.data,
    shipmentLines: linesWithOrderVariantQuantities,
    fixedAssetLines,
    shipmentLineTracking: shipmentLineTracking.data ?? [],
    relatedItems: getShipmentRelatedItems(
      client,
      shipmentId,
      shipment.data?.sourceDocumentId ?? ""
    )
  };
}

export default function ShipmentRoute() {
  const params = useParams();
  const { shipmentId } = params;
  if (!shipmentId) throw new Error("Could not find shipmentId");

  return (
    <div className="flex h-[calc(100dvh-49px)] overflow-y-auto overscroll-contain scrollbar-hide w-full">
      <div className="h-full p-4 w-full max-w-5xl mx-auto">
        <div className="flex flex-col gap-2 pb-16 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
