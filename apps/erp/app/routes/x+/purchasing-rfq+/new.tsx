import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs } from "react-router";
import { data, useLocation, useNavigate } from "react-router";
import { RegisteredEntityFormModal } from "~/components/NewEntityModal";
import {
  purchasingRfqValidator,
  upsertPurchasingRFQ,
  upsertPurchasingRFQSuppliers
} from "~/modules/purchasing";
import { getNextSequence } from "~/modules/settings";
import { setCustomFields } from "~/utils/form";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`RFQs`,
  to: path.to.purchasingRfqs
};

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "purchasing"
  });

  const formData = await request.formData();
  const validation = await validator(purchasingRfqValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  let rfqId = validation.data.rfqId;
  const useNextSequence = !rfqId;

  if (useNextSequence) {
    const nextSequence = await getNextSequence(
      client,
      "purchasingRfq",
      companyId
    );
    if (nextSequence.error) {
      return data(
        {
          error: {
            message: "Failed to get next sequence"
          }
        },
        await flash(
          request,
          error(nextSequence.error, "Failed to get next sequence")
        )
      );
    }
    rfqId = nextSequence.data;
  }

  if (!rfqId) throw new Error("rfqId is not defined");

  // Extract supplier IDs
  const { supplierIds, ...rfqData } = validation.data;

  const createPurchasingRFQ = await upsertPurchasingRFQ(client, {
    ...rfqData,
    rfqId,
    companyId,
    createdBy: userId,
    customFields: setCustomFields(formData)
  });

  if (createPurchasingRFQ.error || !createPurchasingRFQ.data) {
    return data(
      {
        data: createPurchasingRFQ.data,
        error: {
          message: "Failed to insert RFQ"
        }
      },
      await flash(
        request,
        error(createPurchasingRFQ.error, "Failed to insert RFQ")
      )
    );
  }

  const rfq = createPurchasingRFQ.data;

  // Create supplier associations
  if (supplierIds && supplierIds.length > 0) {
    const suppliersResult = await upsertPurchasingRFQSuppliers(
      client,
      rfq.id,
      supplierIds,
      companyId,
      userId
    );
    if (suppliersResult.error) {
      return data(
        {
          data: createPurchasingRFQ.data,
          error: {
            message: "Failed to assign suppliers"
          }
        },
        await flash(
          request,
          error(suppliersResult.error, "Failed to assign suppliers")
        )
      );
    }
  }

  return data({ data: rfq }, { status: 201 });
}

export default function PurchasingRFQNewRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  return (
    <RegisteredEntityFormModal
      to={path.to.newPurchasingRFQ}
      onClose={() => {
        if (from) {
          navigate(from);
        } else {
          navigate(-1);
        }
      }}
    />
  );
}
