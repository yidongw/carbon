import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import {
  data,
  redirect,
  useLoaderData,
  useNavigate,
  useParams
} from "react-router";
import { itemAttributeValueValidator } from "~/modules/items/itemAttribute.models";
import {
  getItemAttributeValue,
  upsertItemAttributeValue
} from "~/modules/items/itemAttribute.service";
import ItemAttributeValueForm from "~/modules/items/ui/ItemAttributes/ItemAttributeValueForm";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
    role: "employee"
  });
  const { attributeId, id } = params;
  if (!attributeId || !id) throw notFound("id not found");

  const value = await getItemAttributeValue(client, id);
  if (value.data?.companyId === null) {
    throw redirect(
      path.to.itemAttributeValues(attributeId),
      await flash(
        request,
        error(new Error("Access denied"), "Cannot edit system attribute value")
      )
    );
  }

  return { value: value.data ?? null };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts"
  });
  const { attributeId, id } = params;
  if (!attributeId || !id) throw notFound("id not found");

  const validation = await validator(itemAttributeValueValidator).validate(
    await request.formData()
  );
  if (validation.error) return validationError(validation.error);

  const update = await upsertItemAttributeValue(client, {
    id,
    ...validation.data,
    attributeId,
    updatedBy: userId
  });
  if (update.error) {
    return data(
      {},
      await flash(
        request,
        error(update.error, "Failed to update attribute value")
      )
    );
  }

  throw redirect(
    `${path.to.itemAttributeValues(attributeId)}?${getParams(request)}`,
    await flash(request, success("Updated attribute value"))
  );
}

export default function EditItemAttributeValueRoute() {
  const { attributeId } = useParams();
  const { value } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  if (!attributeId) return null;

  return (
    <ItemAttributeValueForm
      attributeId={attributeId}
      initialValues={{
        id: value?.id,
        attributeId,
        code: value?.code ?? "",
        name: value?.name ?? "",
        sortOrder: value?.sortOrder ?? 100
      }}
      onClose={() => navigate(path.to.itemAttributeValues(attributeId))}
    />
  );
}
