import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { trigger } from "@carbon/jobs";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs } from "react-router";
import { data, useLocation, useNavigate } from "react-router";
import { RegisteredEntityFormModal } from "~/components/NewEntityModal";
import { partValidator, upsertPart } from "~/modules/items";
import { setCustomFields } from "~/utils/form";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Parts`,
  to: path.to.parts,
  module: "items"
};

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "parts"
  });

  const formData = await request.formData();
  const validation = await validator(partValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const createPart = await upsertPart(client, {
    ...validation.data,
    companyId,
    customFields: setCustomFields(formData),
    createdBy: userId
  });
  if (createPart.error) {
    return data(
      createPart,
      await flash(request, error(createPart.error, "Failed to insert part"))
    );
  }

  if (validation.data.modelUploadId) {
    await trigger("model-thumbnail", {
      companyId,
      modelId: validation.data.modelUploadId
    });
  }

  const itemId = createPart.data?.id;
  if (!itemId) throw new Error("Part ID not found");

  return data(createPart, { status: 201 });
}

export default function PartsNewRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const searchParams = new URLSearchParams(location.search);
  return (
    <RegisteredEntityFormModal
      to={path.to.newPart}
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
