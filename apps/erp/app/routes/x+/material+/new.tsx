import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs } from "react-router";
import { data, useLocation, useNavigate } from "react-router";
import { RegisteredEntityFormModal } from "~/components/NewEntityModal";
import { materialValidator, upsertMaterial } from "~/modules/items";
import { setCustomFields } from "~/utils/form";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Materials`,
  to: path.to.materials,
  module: "items"
};

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "parts"
  });

  const formData = await request.formData();
  const validation = await validator(materialValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const createMaterial = await upsertMaterial(client, {
    ...validation.data,
    companyId,
    customFields: setCustomFields(formData),
    createdBy: userId
  });
  if (createMaterial.error) {
    return data(
      createMaterial,
      await flash(
        request,
        error(createMaterial.error, "Failed to insert material")
      )
    );
  }

  const itemId = createMaterial.data?.id;
  if (!itemId) throw new Error("Material ID not found");

  return data(createMaterial, { status: 201 });
}

export default function MaterialsNewRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const searchParams = new URLSearchParams(location.search);
  return (
    <RegisteredEntityFormModal
      to={path.to.newMaterial}
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
