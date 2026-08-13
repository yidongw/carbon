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
import {
  expandVariantTableToLines,
  hasStyleVariantsQuantity
} from "~/modules/items/styleOrderLines.server";
import {
  readVariantQuantitiesFormRaw,
  variantTableUpdateFields
} from "~/modules/production/variantsQuantityOverlay.server";
import type { PurchasingRFQ } from "~/modules/purchasing";
import {
  getPurchasingRFQ,
  getPurchasingRFQLine,
  getSupplierInteractionLineDocuments,
  isRfqLocked,
  purchasingRfqLineValidator,
  replacePurchasingRfqLinesWithStyleVariants,
  upsertPurchasingRFQLine
} from "~/modules/purchasing";
import { PurchasingRFQLineForm } from "~/modules/purchasing/ui/PurchasingRfq";
import {
  SupplierInteractionLineDocuments,
  SupplierInteractionLineNotes
} from "~/modules/purchasing/ui/SupplierInteraction";
import { getDatabaseClient } from "~/services/database.server";
import { setCustomFields } from "~/utils/form";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { path } from "~/utils/path";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { companyId } = await requirePermissions(request, {
    view: "purchasing"
  });

  const { rfqId, lineId } = params;
  if (!rfqId) throw new Error("Could not find rfqId");
  if (!lineId) throw new Error("Could not find lineId");

  const serviceRole = getCarbonServiceRole();

  const line = await getPurchasingRFQLine(serviceRole, lineId);

  if (line.error) {
    throw redirect(
      path.to.purchasingRfq(rfqId),
      await flash(request, error(line.error, "Failed to load line"))
    );
  }

  return {
    line: line.data,
    files: getSupplierInteractionLineDocuments(serviceRole, companyId, lineId)
  };
};

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client: viewClient } = await requirePermissions(request, {
    view: "purchasing"
  });
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "purchasing"
  });

  const { rfqId, lineId } = params;
  if (!rfqId) throw new Error("Could not find rfqId");
  if (!lineId) throw new Error("Could not find lineId");

  const rfq = await getPurchasingRFQ(viewClient, rfqId);
  await requireUnlocked({
    request,
    isLocked: isRfqLocked(rfq.data?.status),
    redirectTo: path.to.purchasingRfq(rfqId),
    message: "Cannot modify a locked RFQ. Reopen it first."
  });

  const formData = await request.formData();

  const validation = await validator(purchasingRfqLineValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const {
    id: _id,
    variantQuantities: variantQuantitiesFromValidator,
    quantity: rawQuantity,
    ...d
  } = validation.data;

  let quantity = rawQuantity;
  let variantQuantities: Json | undefined;
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
      variantQuantities = fields.variantQuantities;
      quantity = [fields.quantity];
    } catch {
      // Invalid JSON — keep typed quantity; FormData config is expand-only.
    }
  }

  if (
    d.itemId &&
    variantQuantities &&
    hasStyleVariantsQuantity(variantQuantities)
  ) {
    const expanded = await expandVariantTableToLines(client, {
      parentItemId: d.itemId,
      companyId,
      variantQuantities
    });
    if (!expanded.ok) {
      throw redirect(
        path.to.purchasingRfqLine(rfqId, lineId),
        await flash(request, error(expanded.error, expanded.error))
      );
    }

    const onlyParent =
      expanded.variants.length === 1 &&
      expanded.variants[0].variantItemId === d.itemId;

    if (!onlyParent) {
      try {
        await replacePurchasingRfqLinesWithStyleVariants(getDatabaseClient(), {
          companyId,
          userId,
          purchasingRfqId: rfqId,
          replaceLineId: lineId,
          variants: expanded.variants,
          base: {
            description: d.description,
            purchaseUnitOfMeasureCode: d.purchaseUnitOfMeasureCode,
            inventoryUnitOfMeasureCode: d.inventoryUnitOfMeasureCode,
            conversionFactor: d.conversionFactor
          },
          customFields: setCustomFields(formData)
        });
      } catch (err) {
        throw redirect(
          path.to.purchasingRfqLine(rfqId, lineId),
          await flash(
            request,
            error(err, "Failed to update RFQ lines for style variants")
          )
        );
      }

      throw redirect(path.to.purchasingRfq(rfqId));
    }

    quantity = [expanded.variants[0].quantity];
  }

  // FormData `variantQuantities` is expand-only; never persist on the line.
  const updateLine = await upsertPurchasingRFQLine(client, {
    id: lineId,
    ...d,
    quantity,
    companyId,
    updatedBy: userId,
    customFields: setCustomFields(formData)
  });

  if (updateLine.error) {
    throw redirect(
      path.to.purchasingRfqLine(rfqId, lineId),
      await flash(request, error(updateLine.error, "Failed to update RFQ line"))
    );
  }

  throw redirect(path.to.purchasingRfqLine(rfqId, lineId));
}

export default function PurchasingRFQLine() {
  const { t } = useLingui();
  const { line, files } = useLoaderData<typeof loader>();

  const permissions = usePermissions();

  const { rfqId, lineId } = useParams();
  if (!rfqId) throw new Error("Could not find rfqId");
  if (!lineId) throw new Error("Could not find lineId");

  const rfqData = useRouteData<{
    rfqSummary: PurchasingRFQ;
  }>(path.to.purchasingRfq(rfqId));

  const isReadOnly = isRfqLocked(rfqData?.rfqSummary?.status);

  const initialValues = {
    ...line,
    id: line.id ?? undefined,
    purchasingRfqId: line.purchasingRfqId ?? "",
    description: line.description ?? "",
    itemId: line.itemId ?? "",
    quantity: line.quantity ?? [1],
    order: line.order ?? 1,
    purchaseUnitOfMeasureCode: line.purchaseUnitOfMeasureCode ?? "",
    inventoryUnitOfMeasureCode: line.inventoryUnitOfMeasureCode ?? "",
    conversionFactor: line.conversionFactor ?? 1,
    itemType: (line.itemType ?? "Part") as
      | "Part"
      | "Material"
      | "Tool"
      | "Consumable"
  };

  return (
    <Fragment key={lineId}>
      <PurchasingRFQLineForm key={lineId} initialValues={initialValues} />
      <SupplierInteractionLineNotes
        id={line.id}
        table="purchasingRfqLine"
        title={t`Notes`}
        subTitle={line.itemReadableId ?? ""}
        internalNotes={line.internalNotes as JSONContent}
        externalNotes={line.externalNotes as JSONContent}
      />
      <DeferredFiles resolve={files}>
        {(resolvedFiles) => (
          <SupplierInteractionLineDocuments
            files={resolvedFiles ?? []}
            id={rfqId}
            lineId={lineId}
            type="Purchasing Request for Quote"
          />
        )}
      </DeferredFiles>
      <CadModel
        isReadOnly={isReadOnly || !permissions.can("update", "purchasing")}
        metadata={{
          purchasingRfqLineId: line.id ?? undefined,
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
