import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useNavigate } from "react-router";
import { useUser } from "~/hooks";
import {
  purchasePaymentValidator,
  upsertPurchasePayment
} from "~/modules/accounting";
import { SupplierPaymentForm } from "~/modules/accounting/ui/SupplierPayments";
import { getParams, path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  await requirePermissions(request, {
    create: "invoicing"
  });

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "invoicing"
  });

  const formData = await request.formData();
  const modal = formData.get("type") === "modal";

  const validation = await validator(purchasePaymentValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  // biome-ignore lint/correctness/noUnusedVariables: id is not used on insert
  const { id, ...rest } = validation.data;

  const insertPurchasePayment = await upsertPurchasePayment(client, {
    ...rest,
    companyId,
    createdBy: userId
  });
  if (insertPurchasePayment.error) {
    return data(
      {},
      await flash(
        request,
        error(insertPurchasePayment.error, "Failed to insert supplier payment")
      )
    );
  }

  return modal
    ? data(insertPurchasePayment, { status: 201 })
    : redirect(
        `${path.to.purchasePayments}?${getParams(request)}`,
        await flash(request, success("Supplier payment created"))
      );
}

export default function NewSupplierPaymentRoute() {
  const navigate = useNavigate();
  const { company } = useUser();
  const initialValues = {
    paymentId: "",
    supplierId: "",
    paymentDate: "",
    currencyCode: company.baseCurrencyCode ?? "",
    totalAmount: 0
  };

  return (
    <SupplierPaymentForm
      initialValues={initialValues}
      onClose={() => navigate(-1)}
    />
  );
}
