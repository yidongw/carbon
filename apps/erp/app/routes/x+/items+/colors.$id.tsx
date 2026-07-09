import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData, useNavigate } from "react-router";
import {
  getStyleColor,
  styleColorValidator,
  upsertStyleColor
} from "~/modules/items";
import StyleColorForm from "~/modules/items/ui/StyleColors/StyleColorForm";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
    role: "employee"
  });

  const { id } = params;
  if (!id) throw notFound("id not found");

  const styleColor = await getStyleColor(client, id);

  if (styleColor.data?.companyId === null) {
    throw redirect(
      path.to.styleColors,
      await flash(
        request,
        error(new Error("Access denied"), "Cannot edit global style color")
      )
    );
  }

  return {
    styleColor: styleColor?.data ?? null
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
  const validation = await validator(styleColorValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const updateStyleColor = await upsertStyleColor(client, {
    id: id,
    ...validation.data,
    updatedBy: userId
  });

  if (updateStyleColor.error) {
    return data(
      {},
      await flash(
        request,
        error(updateStyleColor.error, "Failed to update style color")
      )
    );
  }

  throw redirect(
    `${path.to.styleColors}?${getParams(request)}`,
    await flash(request, success("Updated style color"))
  );
}

export default function EditStyleColorRoute() {
  const { styleColor } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const initialValues = {
    id: styleColor?.id ?? undefined,
    colorCode: styleColor?.colorCode ?? "",
    colorName: styleColor?.colorName ?? ""
  };

  return (
    <StyleColorForm
      key={initialValues.id}
      initialValues={initialValues}
      onClose={() => navigate(-1)}
    />
  );
}
