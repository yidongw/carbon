import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData, useNavigate } from "react-router";
import { itemAttributeSetAssignmentValidator } from "~/modules/items/itemAttribute.models";
import {
  getItemAttributeSets,
  upsertItemAttributeSetAssignment
} from "~/modules/items/itemAttribute.service";
import ItemAttributeSetAssignmentForm from "~/modules/items/ui/ItemAttributeSetAssignments/ItemAttributeSetAssignmentForm";
import { getParams, path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    create: "parts"
  });
  const sets = await getItemAttributeSets(client, companyId);
  return {
    attributeSetOptions: (sets.data ?? []).map(
      (s: { id: string; name: string; code: string }) => ({
        label: `${s.code} — ${s.name}`,
        value: s.id
      })
    )
  };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "parts"
  });

  const validation = await validator(
    itemAttributeSetAssignmentValidator
  ).validate(await request.formData());
  if (validation.error) return validationError(validation.error);

  const { id: _id, ...rest } = validation.data;
  const insert = await upsertItemAttributeSetAssignment(client, {
    ...rest,
    companyId,
    createdBy: userId
  });
  if (insert.error) {
    return data(
      {},
      await flash(
        request,
        error(insert.error, "Failed to create set assignment")
      )
    );
  }

  throw redirect(
    `${path.to.itemAttributeSetAssignments}?${getParams(request)}`,
    await flash(request, success("Created set assignment"))
  );
}

export default function NewItemAttributeSetAssignmentRoute() {
  const { attributeSetOptions } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  return (
    <ItemAttributeSetAssignmentForm
      initialValues={{ itemType: "Style", attributeSetId: "" }}
      attributeSetOptions={attributeSetOptions}
      onClose={() => navigate(path.to.itemAttributeSetAssignments)}
    />
  );
}
