import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import type { Json } from "@carbon/database";
import { validationError, validator } from "@carbon/form";
import type { JSONContent } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { Fragment } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData, useParams } from "react-router";
import { CadModel, DeferredFiles } from "~/components";
import { usePermissions, useRouteData } from "~/hooks";
import { hasStyleVariantsQuantity } from "~/modules/items/styleOrderLines.server";
import {
  readVariantQuantitiesFormRaw,
  variantTableUpdateFields
} from "~/modules/production/variantsQuantityOverlay.server";
import type { SalesRFQ } from "~/modules/sales";
import {
  getOpportunityLineDocuments,
  getSalesRFQ,
  getSalesRFQLine,
  isSalesRfqLocked,
  salesRfqLineValidator,
  upsertSalesRFQLine
} from "~/modules/sales";
import {
  OpportunityLineDocuments,
  OpportunityLineNotes
} from "~/modules/sales/ui/Opportunity";
import { SalesRFQLineForm } from "~/modules/sales/ui/SalesRFQ";
import type { MethodItemType } from "~/modules/shared/types";
import { setCustomFields } from "~/utils/form";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { path } from "~/utils/path";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { companyId } = await requirePermissions(request, {
    view: "sales"
  });

  const { rfqId, lineId } = params;
  if (!rfqId) throw new Error("Could not find rfqId");
  if (!lineId) throw new Error("Could not find lineId");

  const serviceRole = await getCarbonServiceRole();

  const line = await getSalesRFQLine(serviceRole, lineId);

  if (line.error) {
    throw redirect(
      path.to.salesRfq(rfqId),
      await flash(request, error(line.error, "Failed to load line"))
    );
  }

  const itemId = line.data.itemId;

  return {
    line: line.data,
    files: getOpportunityLineDocuments(serviceRole, companyId, lineId, itemId)
  };
};

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);

  const { rfqId, lineId } = params;
  if (!rfqId) throw new Error("Could not find rfqId");
  if (!lineId) throw new Error("Could not find lineId");

  const { client: viewClient } = await requirePermissions(request, {
    view: "sales"
  });

  const rfq = await getSalesRFQ(viewClient, rfqId);
  await requireUnlocked({
    request,
    isLocked: isSalesRfqLocked(rfq.data?.status),
    redirectTo: path.to.salesRfqLine(rfqId, lineId),
    message: "Cannot modify a locked RFQ. Reopen it first."
  });

  const { client, userId } = await requirePermissions(request, {
    create: "sales"
  });

  const formData = await request.formData();

  const validation = await validator(salesRfqLineValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const {
    id: _id,
    variantQuantities: variantQuantitiesFromValidator,
    configuration: _configurationFromValidator,
    quantity: rawQuantity,
    ...d
  } = validation.data;

  let quantity = rawQuantity;
  let configuration: Json | undefined | null;
  const variantQuantitiesRaw = readVariantQuantitiesFormRaw(
    formData,
    variantQuantitiesFromValidator
  );
  if (variantQuantitiesRaw) {
    try {
      const parsed = JSON.parse(variantQuantitiesRaw) as Record<
        string,
        unknown
      >;
      const fields = variantTableUpdateFields(parsed);
      if (hasStyleVariantsQuantity(fields.variantQuantities)) {
        configuration = fields.variantQuantities;
        quantity = [fields.quantity];
      }
    } catch (err) {
      console.error(err);
    }
  } else if (formData.has("variantQuantities")) {
    const existing = await client
      .from("salesRfqLine")
      .select("configuration")
      .eq("id", lineId)
      .single();
    if (hasStyleVariantsQuantity(existing.data?.configuration)) {
      configuration = null;
    }
  }

  const updateLine = await upsertSalesRFQLine(client, {
    id: lineId,
    ...d,
    quantity,
    ...(configuration !== undefined ? { configuration } : {}),
    updatedBy: userId,
    customFields: setCustomFields(formData)
  });

  if (updateLine.error) {
    throw redirect(
      path.to.salesRfqLine(rfqId, lineId),
      await flash(
        request,
        error(updateLine.error, "Failed to update quote line")
      )
    );
  }

  throw redirect(path.to.salesRfqLine(rfqId, lineId));
}

export default function SalesRFQLine() {
  const { t } = useLingui();
  const { line, files } = useLoaderData<typeof loader>();

  const permissions = usePermissions();

  const { rfqId, lineId } = useParams();
  if (!rfqId) throw new Error("Could not find rfqId");
  if (!lineId) throw new Error("Could not find lineId");

  const rfqData = useRouteData<{
    rfqSummary: SalesRFQ;
  }>(path.to.salesRfq(rfqId));

  const isReadOnly = isSalesRfqLocked(rfqData?.rfqSummary?.status);

  // Dual-read variantTable (and legacy configTable) without importing .server
  // helpers into the client bundle.
  const styleVariantQuantities = (() => {
    const cfg = (line as { configuration?: unknown }).configuration;
    if (!cfg || typeof cfg !== "object" || Array.isArray(cfg)) return undefined;
    const record = cfg as Record<string, unknown>;
    const table = record.variantTable ?? record.configTable;
    return Array.isArray(table) && table.length > 0
      ? JSON.stringify(
          Array.isArray(record.variantTable) ? cfg : { variantTable: table }
        )
      : undefined;
  })();

  const initialValues = {
    ...line,
    id: line.id ?? undefined,
    salesRfqId: line.salesRfqId ?? "",
    customerPartId: line.customerPartId ?? "",
    customerPartRevision: line.customerPartRevision ?? "",
    description: line.description ?? "",
    itemId: line.itemId ?? "",
    itemType: ((line as { itemType?: string }).itemType ??
      "Part") as MethodItemType,
    quantity: line.quantity ?? [1],
    order: line.order ?? 1,
    unitOfMeasureCode: line.unitOfMeasureCode ?? "",
    modelUploadId: line.modelUploadId ?? undefined,
    configuration: undefined,
    variantQuantities: styleVariantQuantities
  };

  return (
    <Fragment key={lineId}>
      <SalesRFQLineForm key={lineId} initialValues={initialValues} />
      <OpportunityLineNotes
        id={line.id}
        table="salesRfqLine"
        title={t`Notes`}
        subTitle={line.customerPartId ?? ""}
        internalNotes={line.internalNotes as JSONContent}
        externalNotes={line.externalNotes as JSONContent}
      />

      <DeferredFiles resolve={files}>
        {(resolvedFiles) => (
          <OpportunityLineDocuments
            files={resolvedFiles ?? []}
            id={rfqId}
            lineId={lineId}
            itemId={line?.itemId}
            modelUpload={line ?? undefined}
            type="Request for Quote"
          />
        )}
      </DeferredFiles>
      <CadModel
        isReadOnly={isReadOnly || !permissions.can("update", "sales")}
        metadata={{
          salesRfqLineId: line.id ?? undefined,
          itemId: line.itemId ?? undefined
        }}
        modelPath={line?.modelPath ?? null}
        title={t`CAD Model`}
        uploadClassName="aspect-square min-h-[420px] max-h-[70vh]"
        viewerClassName="aspect-square min-h-[420px] max-h-[70vh]"
      />

      <Outlet />
    </Fragment>
  );
}
