import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData, useNavigate } from "react-router";
import { itemAttributeValidator } from "~/modules/items/itemAttribute.models";
import {
  getItemAttribute,
  upsertItemAttribute
} from "~/modules/items/itemAttribute.service";
import ItemAttributeForm from "~/modules/items/ui/ItemAttributes/ItemAttributeForm";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
    role: "employee"
  });
  const { id } = params;
  if (!id) throw notFound("id not found");

  const attribute = await getItemAttribute(client, id);
  if (!attribute.data) throw notFound("Attribute not found");
  if (attribute.data.companyId === null) {
    throw redirect(
      path.to.itemAttributes,
      await flash(
        request,
        error(new Error("Access denied"), "Cannot edit system attribute")
      )
    );
  }

  return { attribute: attribute.data };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts"
  });
  const { id } = params;
  if (!id) throw new Error("Could not find id");

  const validation = await validator(itemAttributeValidator).validate(
    await request.formData()
  );
  if (validation.error) return validationError(validation.error);

  const update = await upsertItemAttribute(client, {
    id,
    ...validation.data,
    updatedBy: userId
  });
  if (update.error) {
    return data(
      {},
      await flash(request, error(update.error, "Failed to update attribute"))
    );
  }

  throw redirect(
    `${path.to.itemAttributes}?${getParams(request)}`,
    await flash(request, success("Updated attribute"))
  );
}

export default function EditItemAttributeRoute() {
  const { attribute } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <ItemAttributeForm
      initialValues={{
        id: attribute?.id,
        code: attribute?.code ?? "",
        name: attribute?.name ?? "",
        sortOrder: attribute?.sortOrder ?? 100
      }}
      onClose={() => navigate(path.to.itemAttributes)}
    />
  );
}
