import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useNavigate } from "react-router";
import { styleColorValidator, upsertStyleColor } from "~/modules/items";
import StyleColorForm from "~/modules/items/ui/StyleColors/StyleColorForm";
import { getParams, path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  await requirePermissions(request, {
    create: "parts"
  });

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId } = await requirePermissions(request, {
    create: "parts"
  });

  const formData = await request.formData();

  const validation = await validator(styleColorValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
  const { id, ...rest } = validation.data;

  const insertStyleColor = await upsertStyleColor(client, {
    ...rest,
    companyId
  });
  if (insertStyleColor.error) {
    return data(
      {},
      await flash(
        request,
        error(insertStyleColor.error, "Failed to insert style color")
      )
    );
  }

  const styleColorId = insertStyleColor.data?.id;
  if (!styleColorId) {
    return data(
      {},
      await flash(request, error(insertStyleColor, "Failed to insert style color"))
    );
  }

  throw redirect(
    `${path.to.styleColors}?${getParams(request)}`,
    await flash(request, success("Style color created"))
  );
}

export default function NewStyleColorRoute() {
  const navigate = useNavigate();
  const initialValues = {
    colorCode: "",
    colorName: ""
  };

  return (
    <StyleColorForm
      onClose={() => navigate(-1)}
      initialValues={initialValues}
    />
  );
}
