import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useNavigate, useParams } from "react-router";
import { itemAttributeValueValidator } from "~/modules/items/itemAttribute.models";
import { upsertItemAttributeValue } from "~/modules/items/itemAttribute.service";
import ItemAttributeValueForm from "~/modules/items/ui/ItemAttributes/ItemAttributeValueForm";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requirePermissions(request, { create: "parts" });
  if (!params.attributeId) throw notFound("attributeId not found");
  return null;
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "parts"
  });
  const { attributeId } = params;
  if (!attributeId) throw notFound("attributeId not found");

  const validation = await validator(itemAttributeValueValidator).validate(
    await request.formData()
  );
  if (validation.error) return validationError(validation.error);

  const { id: _id, ...rest } = validation.data;
  const insert = await upsertItemAttributeValue(client, {
    ...rest,
    attributeId,
    companyId,
    createdBy: userId
  });
  if (insert.error) {
    return data(
      {},
      await flash(
        request,
        error(insert.error, "Failed to create attribute value")
      )
    );
  }

  throw redirect(
    `${path.to.itemAttributeValues(attributeId)}?${getParams(request)}`,
    await flash(request, success("Created attribute value"))
  );
}

export default function NewItemAttributeValueRoute() {
  const { attributeId } = useParams();
  const navigate = useNavigate();
  if (!attributeId) return null;

  return (
    <ItemAttributeValueForm
      attributeId={attributeId}
      initialValues={{
        attributeId,
        code: "",
        name: "",
        sortOrder: 100
      }}
      onClose={() => navigate(path.to.itemAttributeValues(attributeId))}
    />
  );
}
