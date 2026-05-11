import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs } from "react-router";
import { data, useLocation, useNavigate } from "react-router";
import { RegisteredEntityFormModal } from "~/components/NewEntityModal";
import { consumableValidator, upsertConsumable } from "~/modules/items";
import { setCustomFields } from "~/utils/form";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Consumables`,
  to: path.to.consumables,
  module: "items"
};

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "parts"
  });

  const formData = await request.formData();
  const validation = await validator(consumableValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const createConsumable = await upsertConsumable(client, {
    ...validation.data,
    companyId,
    customFields: setCustomFields(formData),
    createdBy: userId
  });
  if (createConsumable.error) {
    return data(
      createConsumable,
      await flash(
        request,
        error(createConsumable.error, "Failed to insert consumable")
      )
    );
  }

  const itemId = createConsumable.data?.id;
  if (!itemId) throw new Error("Consumable ID not found");

  return data(createConsumable, { status: 201 });
}

export default function ConsumablesNewRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const searchParams = new URLSearchParams(location.search);
  return (
    <RegisteredEntityFormModal
      to={path.to.newConsumable}
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
