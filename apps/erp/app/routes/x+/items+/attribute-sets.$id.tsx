import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData, useNavigate } from "react-router";
import { itemAttributeSetValidator } from "~/modules/items/itemAttribute.models";
import {
  getItemAttributeSet,
  getItemAttributes,
  upsertItemAttributeSet
} from "~/modules/items/itemAttribute.service";
import ItemAttributeSetForm from "~/modules/items/ui/ItemAttributeSets/ItemAttributeSetForm";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts",
    role: "employee"
  });
  const { id } = params;
  if (!id) throw notFound("id not found");

  const [set, attributes] = await Promise.all([
    getItemAttributeSet(client, id),
    getItemAttributes(client, companyId)
  ]);

  if (set.error || !set.data) {
    throw redirect(
      path.to.itemAttributeSets,
      await flash(request, error(set.error, "Attribute set not found"))
    );
  }

  return {
    set: set.data,
    attributeOptions: (attributes.data ?? []).map(
      (a: { id: string; name: string; code: string }) => ({
        label: `${a.code} — ${a.name}`,
        value: a.id
      })
    )
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts"
  });
  const { id } = params;
  if (!id) throw new Error("Could not find id");

  const existing = await getItemAttributeSet(client, id);
  if (existing.error || !existing.data) {
    return data(
      {},
      await flash(request, error(existing.error, "Attribute set not found"))
    );
  }
  // System (shared) sets are read-only for tenants; editing them would attempt
  // a cross-tenant write that RLS now blocks anyway.
  if (existing.data.companyId === null) {
    return data(
      {},
      await flash(
        request,
        error(new Error("Access denied"), "Cannot edit a system attribute set")
      )
    );
  }

  const validation = await validator(itemAttributeSetValidator).validate(
    await request.formData()
  );
  if (validation.error) return validationError(validation.error);

  const setCompanyId = (existing.data.companyId ?? null) as string | null;

  const result = await upsertItemAttributeSet(client, {
    id,
    code: validation.data.code,
    name: validation.data.name,
    attributeIds: validation.data.attributeIds,
    companyId: setCompanyId,
    updatedBy: userId
  });

  if (result.error) {
    return data(
      {},
      await flash(
        request,
        error(result.error, "Failed to update attribute set")
      )
    );
  }

  throw redirect(
    `${path.to.itemAttributeSets}?${getParams(request)}`,
    await flash(request, success("Updated attribute set"))
  );
}

export default function EditItemAttributeSetRoute() {
  const { set, attributeOptions } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const isSystem = set.companyId === null;

  return (
    <ItemAttributeSetForm
      initialValues={{
        id: set.id,
        code: set.code ?? "",
        name: set.name ?? "",
        attributeIds: [...(set.itemAttributeSetAttribute ?? [])]
          .sort(
            (a: { sortOrder?: number }, b: { sortOrder?: number }) =>
              (a.sortOrder ?? 100) - (b.sortOrder ?? 100)
          )
          .map((a: { attributeId: string }) => a.attributeId)
      }}
      attributeOptions={attributeOptions}
      isSystem={isSystem}
      onClose={() => navigate(path.to.itemAttributeSets)}
    />
  );
}
