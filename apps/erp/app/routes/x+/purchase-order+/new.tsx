import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs } from "react-router";
import { data, useLocation, useNavigate } from "react-router";
import { z } from "zod";
import { RegisteredEntityFormModal } from "~/components/NewEntityModal";
import { useUrlParams } from "~/hooks";
import {
  purchaseOrderValidator,
  upsertPurchaseOrder
} from "~/modules/purchasing";
import { getNextSequence } from "~/modules/settings";
import { setCustomFields } from "~/utils/form";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

const newPurchaseOrderValidator = purchaseOrderValidator.extend({
  locationId: z.string().min(1, { message: "Location is required" })
});

export const handle: Handle = {
  breadcrumb: msg`Orders`,
  to: path.to.purchaseOrders
};

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "purchasing",
    bypassRls: true
  });

  const formData = await request.formData();
  const validation = await validator(newPurchaseOrderValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  let purchaseOrderId = validation.data.purchaseOrderId;
  const useNextSequence = !purchaseOrderId;

  if (useNextSequence) {
    const nextSequence = await getNextSequence(
      client,
      "purchaseOrder",
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
    purchaseOrderId = nextSequence.data;
  }

  if (!purchaseOrderId) throw new Error("purchaseOrderId is not defined");

  const createPurchaseOrder = await upsertPurchaseOrder(client, {
    ...validation.data,
    purchaseOrderId,
    companyId,
    createdBy: userId,
    customFields: setCustomFields(formData)
  });

  if (createPurchaseOrder.error || !createPurchaseOrder.data?.[0]) {
    return data(
      {
        data: createPurchaseOrder.data,
        error: {
          message: "Failed to insert purchase order"
        }
      },
      await flash(
        request,
        error(createPurchaseOrder.error, "Failed to insert purchase order")
      )
    );
  }

  return data(createPurchaseOrder, { status: 201 });
}

export default function PurchaseOrderNewRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const [params] = useUrlParams();

  return (
    <RegisteredEntityFormModal
      to={path.to.newPurchaseOrder}
      searchParams={params}
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
