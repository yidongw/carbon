import { error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { useLingui } from "@lingui/react/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData, useNavigate, useParams } from "react-router";
import { ConfirmDelete } from "~/components/Modals";
import {
  deletePurchasePayment,
  getPurchasePayment
} from "~/modules/accounting";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "invoicing"
  });
  const { purchasePaymentId } = params;
  if (!purchasePaymentId) throw notFound("purchasePaymentId not found");

  const purchasePayment = await getPurchasePayment(client, purchasePaymentId);
  if (purchasePayment.error) {
    throw redirect(
      `${path.to.purchasePayments}?${getParams(request)}`,
      await flash(
        request,
        error(purchasePayment.error, "Failed to get supplier payment")
      )
    );
  }

  return { purchasePayment: purchasePayment.data };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "invoicing"
  });

  const { purchasePaymentId } = params;
  if (!purchasePaymentId) {
    throw redirect(
      `${path.to.purchasePayments}?${getParams(request)}`,
      await flash(request, error(params, "Failed to get a supplier payment id"))
    );
  }

  const { error: deletePaymentError } = await deletePurchasePayment(
    client,
    purchasePaymentId
  );
  if (deletePaymentError) {
    throw redirect(
      `${path.to.purchasePayments}?${getParams(request)}`,
      await flash(
        request,
        error(deletePaymentError, "Failed to delete supplier payment")
      )
    );
  }

  throw redirect(
    `${path.to.purchasePayments}?${getParams(request)}`,
    await flash(request, success("Successfully deleted supplier payment"))
  );
}

export default function DeleteSupplierPaymentRoute() {
  const { purchasePaymentId } = useParams();
  const { purchasePayment } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { t } = useLingui();

  if (!purchasePaymentId || !purchasePayment) return null;

  const onCancel = () => navigate(path.to.purchasePayments);

  return (
    <ConfirmDelete
      action={path.to.deletePurchasePayment(purchasePaymentId)}
      name={purchasePayment.paymentId}
      text={t`Are you sure you want to delete the supplier payment: ${purchasePayment.paymentId}? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}
