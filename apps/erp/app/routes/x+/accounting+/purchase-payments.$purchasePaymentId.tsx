import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData, useNavigate } from "react-router";
import {
  getPurchasePayment,
  purchasePaymentValidator,
  upsertPurchasePayment
} from "~/modules/accounting";
import { SupplierPaymentForm } from "~/modules/accounting/ui/SupplierPayments";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "invoicing"
  });

  const { purchasePaymentId } = params;
  if (!purchasePaymentId) throw notFound("purchasePaymentId not found");

  const purchasePayment = await getPurchasePayment(client, purchasePaymentId);

  return {
    purchasePayment: purchasePayment?.data ?? null
  };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "invoicing"
  });

  const formData = await request.formData();
  const validation = await validator(purchasePaymentValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...d } = validation.data;
  if (!id) throw new Error("id not found");

  const updatePurchasePayment = await upsertPurchasePayment(client, {
    id,
    ...d,
    updatedBy: userId
  });

  if (updatePurchasePayment.error) {
    return data(
      {},
      await flash(
        request,
        error(updatePurchasePayment.error, "Failed to update supplier payment")
      )
    );
  }

  throw redirect(
    `${path.to.purchasePayments}?${getParams(request)}`,
    await flash(request, success("Updated supplier payment"))
  );
}

export default function EditSupplierPaymentRoute() {
  const { purchasePayment } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const initialValues = {
    id: purchasePayment?.id ?? undefined,
    paymentId: purchasePayment?.paymentId ?? "",
    supplierId: purchasePayment?.supplierId ?? "",
    paymentDate: purchasePayment?.paymentDate ?? "",
    currencyCode: purchasePayment?.currencyCode ?? "",
    totalAmount: purchasePayment?.totalAmount ?? 0
  };

  return (
    <SupplierPaymentForm
      key={initialValues.id}
      initialValues={initialValues}
      onClose={() => navigate(-1)}
    />
  );
}
