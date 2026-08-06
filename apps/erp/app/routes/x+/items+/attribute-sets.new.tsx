import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData, useNavigate } from "react-router";
import { itemAttributeSetValidator } from "~/modules/items/itemAttribute.models";
import {
  getItemAttributes,
  upsertItemAttributeSet
} from "~/modules/items/itemAttribute.service";
import ItemAttributeSetForm from "~/modules/items/ui/ItemAttributeSets/ItemAttributeSetForm";
import { getParams, path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    create: "parts"
  });
  const attributes = await getItemAttributes(client, companyId);
  return {
    attributeOptions: (attributes.data ?? []).map(
      (a: { id: string; name: string; code: string }) => ({
        label: `${a.code} — ${a.name}`,
        value: a.id
      })
    )
  };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "parts"
  });

  const validation = await validator(itemAttributeSetValidator).validate(
    await request.formData()
  );
  if (validation.error) return validationError(validation.error);

  const { id: _id, ...rest } = validation.data;
  const insert = await upsertItemAttributeSet(client, {
    ...rest,
    companyId,
    createdBy: userId
  });
  if (insert.error) {
    return data(
      {},
      await flash(
        request,
        error(insert.error, "Failed to create attribute set")
      )
    );
  }

  throw redirect(
    `${path.to.itemAttributeSets}?${getParams(request)}`,
    await flash(request, success("Created attribute set"))
  );
}

export default function NewItemAttributeSetRoute() {
  const { attributeOptions } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  return (
    <ItemAttributeSetForm
      initialValues={{ code: "", name: "", attributeIds: [] }}
      attributeOptions={attributeOptions}
      onClose={() => navigate(path.to.itemAttributeSets)}
    />
  );
}
