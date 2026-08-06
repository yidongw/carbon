import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useNavigate } from "react-router";
import { itemAttributeValidator } from "~/modules/items/itemAttribute.models";
import { upsertItemAttribute } from "~/modules/items/itemAttribute.service";
import ItemAttributeForm from "~/modules/items/ui/ItemAttributes/ItemAttributeForm";
import { getParams, path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  await requirePermissions(request, { create: "parts" });
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "parts"
  });

  const validation = await validator(itemAttributeValidator).validate(
    await request.formData()
  );
  if (validation.error) return validationError(validation.error);

  const { id: _id, ...rest } = validation.data;
  const insert = await upsertItemAttribute(client, {
    ...rest,
    companyId,
    createdBy: userId
  });
  if (insert.error) {
    return data(
      {},
      await flash(request, error(insert.error, "Failed to create attribute"))
    );
  }

  throw redirect(
    `${path.to.itemAttributes}?${getParams(request)}`,
    await flash(request, success("Created attribute"))
  );
}

export default function NewItemAttributeRoute() {
  const navigate = useNavigate();
  return (
    <ItemAttributeForm
      initialValues={{ code: "", name: "", sortOrder: 100 }}
      onClose={() => navigate(path.to.itemAttributes)}
    />
  );
}
