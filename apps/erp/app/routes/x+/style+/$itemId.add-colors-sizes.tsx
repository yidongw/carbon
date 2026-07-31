import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import { path } from "~/utils/path";

// POST-only endpoint: the inline "add color/size" pickers submit here via a
// fetcher. A direct GET just returns to the style page.
export async function loader({ params }: LoaderFunctionArgs) {
  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");
  throw redirect(path.to.style(itemId));
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "parts"
  });

  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");

  const formData = await request.formData();
  const styleColorIds = Array.from(formData.entries())
    .filter(([key]) => key.startsWith("styleColorIds["))
    .map(([, value]) => value as string)
    .filter(Boolean);
  const styleSizeIds = Array.from(formData.entries())
    .filter(([key]) => key.startsWith("styleSizeIds["))
    .map(([, value]) => value as string)
    .filter(Boolean);

  const { addStyleColorsAndSizes } = await import(
    "~/modules/items/style.server"
  );
  const result = await addStyleColorsAndSizes(client, {
    itemId,
    companyId,
    userId,
    styleColorIds,
    styleSizeIds
  });

  if (result.error) {
    return data(
      { ok: false as const, error: "Failed to add colors and sizes" },
      await flash(
        request,
        error(result.error, "Failed to add colors and sizes")
      )
    );
  }

  return data(
    { ok: true as const },
    await flash(request, success("Added colors and sizes"))
  );
}

export default function AddStyleColorsSizesRoute() {
  return null;
}
