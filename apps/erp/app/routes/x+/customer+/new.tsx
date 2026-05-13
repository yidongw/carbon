import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs } from "react-router";
import { data, useLocation, useNavigate } from "react-router";
import { RegisteredEntityFormModal } from "~/components/NewEntityModal";
import { customerValidator, upsertCustomer } from "~/modules/sales";
import { setCustomFields } from "~/utils/form";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Customers`,
  to: path.to.customers,
  module: "sales"
};

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "sales"
  });

  const formData = await request.formData();
  const validation = await validator(customerValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
  const { id, ...rest } = validation.data;

  const createCustomer = await upsertCustomer(client, {
    ...rest,
    companyId,
    customFields: setCustomFields(formData),
    createdBy: userId
  });
  if (createCustomer.error) {
    return data(
      createCustomer,
      await flash(
        request,
        error(createCustomer.error, "Failed to insert customer")
      )
    );
  }

  return data(createCustomer, { status: 201 });
}

export default function CustomersNewRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const searchParams = new URLSearchParams(location.search);

  return (
    <RegisteredEntityFormModal
      to={path.to.newCustomer}
      searchParams={searchParams}
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
