import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData, useNavigate } from "react-router";
import {
  getStyleSize,
  styleSizeValidator,
  upsertStyleSize
} from "~/modules/items";
import StyleSizeForm from "~/modules/items/ui/StyleSizes/StyleSizeForm";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
    role: "employee"
  });

  const { id } = params;
  if (!id) throw notFound("id not found");

  const styleSize = await getStyleSize(client, id);

  if (styleSize.data?.companyId === null) {
    throw redirect(
      path.to.styleSizes,
      await flash(
        request,
        error(new Error("Access denied"), "Cannot edit global style size")
      )
    );
  }

  return {
    styleSize: styleSize?.data ?? null
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts"
  });

  const { id } = params;
  if (!id) throw new Error("Could not find id");

  const formData = await request.formData();
  const validation = await validator(styleSizeValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const updateStyleSize = await upsertStyleSize(client, {
    id: id,
    ...validation.data,
    updatedBy: userId
  });

  if (updateStyleSize.error) {
    return data(
      {},
      await flash(
        request,
        error(updateStyleSize.error, "Failed to update style size")
      )
    );
  }

  throw redirect(
    `${path.to.styleSizes}?${getParams(request)}`,
    await flash(request, success("Updated style size"))
  );
}

export default function EditStyleSizeRoute() {
  const { styleSize } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const initialValues = {
    id: styleSize?.id ?? undefined,
    sizeCode: styleSize?.sizeCode ?? "",
    sizeName: styleSize?.sizeName ?? ""
  };

  return (
    <StyleSizeForm
      key={initialValues.id}
      initialValues={initialValues}
      onClose={() => navigate(-1)}
    />
  );
}
