import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs } from "react-router";
import { data, useLocation, useNavigate } from "react-router";
import { RegisteredEntityFormModal } from "~/components/NewEntityModal";
import { useUrlParams } from "~/hooks";
import { salesOrderValidator, upsertSalesOrder } from "~/modules/sales";
import { getNextSequence } from "~/modules/settings";
import { setCustomFields } from "~/utils/form";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Orders`,
  to: path.to.salesOrders
};

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "sales",
    bypassRls: true
  });

  const formData = await request.formData();
  const validation = await validator(salesOrderValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
  const { id, ...d } = validation.data;
  let salesOrderId = d.salesOrderId;
  const useNextSequence = !salesOrderId;

  if (useNextSequence) {
    const nextSequence = await getNextSequence(client, "salesOrder", companyId);
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
    salesOrderId = nextSequence.data;
  }

  if (!salesOrderId) throw new Error("salesOrderId is not defined");

  const createSalesOrder = await upsertSalesOrder(client, {
    ...d,
    salesOrderId,
    companyId,
    createdBy: userId,
    customFields: setCustomFields(formData)
  });

  if (createSalesOrder.error || !createSalesOrder.data?.[0]) {
    return data(
      {
        data: createSalesOrder.data,
        error: {
          message: "Failed to insert sales order"
        }
      },
      await flash(
        request,
        error(createSalesOrder.error, "Failed to insert sales order")
      )
    );
  }

  return data(createSalesOrder, { status: 201 });
}

export default function SalesOrderNewRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const [params] = useUrlParams();

  return (
    <RegisteredEntityFormModal
      to={path.to.newSalesOrder}
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
