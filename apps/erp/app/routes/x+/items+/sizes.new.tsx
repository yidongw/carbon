import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useNavigate } from "react-router";
import { styleSizeValidator, upsertStyleSize } from "~/modules/items";
import StyleSizeForm from "~/modules/items/ui/StyleSizes/StyleSizeForm";
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

  const validation = await validator(styleSizeValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
  const { id, ...rest } = validation.data;

  const insertStyleSize = await upsertStyleSize(client, {
    ...rest,
    companyId,
    createdBy: userId
  });
  if (insertStyleSize.error) {
    return data(
      {},
      await flash(
        request,
        error(insertStyleSize.error, "Failed to insert style size")
      )
    );
  }

  const styleSizeId = insertStyleSize.data?.id;
  if (!styleSizeId) {
    return data(
      {},
      await flash(
        request,
        error(insertStyleSize, "Failed to insert style size")
      )
    );
  }

  throw redirect(
    `${path.to.styleSizes}?${getParams(request)}`,
    await flash(request, success("Style size created"))
  );
}

export default function NewStyleSizeRoute() {
  const navigate = useNavigate();
  const initialValues = {
    sizeCode: "",
    sizeName: ""
  };

  return (
    <StyleSizeForm onClose={() => navigate(-1)} initialValues={initialValues} />
  );
}
