import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useNavigate } from "react-router";
import { insertTemplate, templateCreateValidator } from "~/modules/items";
import TemplateForm from "~/modules/items/ui/Templates/TemplateForm";
import { getParams, path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  await requirePermissions(request, {
    create: "parts"
  });

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "parts"
  });

  const formData = await request.formData();
  const modal = formData.get("type") == "modal";

  const validation = await validator(templateCreateValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const created = await insertTemplate(client, {
    ...validation.data,
    companyId,
    createdBy: userId
  });

  if (created.error || !created.data?.id) {
    return data(
      {},
      await flash(
        request,
        error(created.error ?? null, "Failed to insert template")
      )
    );
  }

  return modal
    ? data(created, { status: 201 })
    : redirect(
        `${path.to.templates}?${getParams(request)}`,
        await flash(request, success("Template created"))
      );
}

export default function NewTemplateRoute() {
  const navigate = useNavigate();

  return (
    <TemplateForm
      initialValues={{ name: "", description: "" }}
      onClose={() => navigate(-1)}
    />
  );
}
