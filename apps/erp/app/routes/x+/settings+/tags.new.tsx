import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import {
  OVERLAY_PARAM,
  overlay,
  overlayToken,
  serializeSearch
} from "~/components/Overlay/overlay";
import { insertTag, tagValidator } from "~/modules/shared";
import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isOverlay = url.searchParams.get("overlay") === "true";

  // Bare URL (deep link / direct nav): redirect to the list with the overlay
  // open, so the form always renders as an overlay rather than a full page.
  if (!isOverlay) {
    const token = overlayToken(overlay.to.newTag());
    const redirectParams = new URLSearchParams();
    if (token) redirectParams.append(OVERLAY_PARAM, token);
    const query = serializeSearch(redirectParams);
    throw redirect(query ? `${path.to.tags}?${query}` : path.to.tags);
  }

  await requirePermissions(request, {});

  // When opened from an inline Tags field the opener pins the table (any
  // taggable table); lock it so the tag is created for that exact table. With no
  // table pinned (the Tags settings page) the user picks one (see `tagTables`).
  const requestedTable = url.searchParams.get("table");

  return {
    table: requestedTable ?? "",
    lockTable: Boolean(requestedTable)
  };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {});

  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  const formData = await request.formData();
  const validation = await validator(tagValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const insert = await insertTag(client, {
    ...validation.data,
    companyId,
    createdBy: userId
  });

  if (insert.error) {
    return data(
      { ok: false as const, error: "Failed to create tag" },
      await flash(request, error(insert.error, "Failed to create tag"))
    );
  }

  if (isOverlay) {
    return data(
      { ok: true as const, name: validation.data.name },
      await flash(request, success("Tag created"))
    );
  }

  return redirect(path.to.tags, await flash(request, success("Tag created")));
}

export default function NewTagRoute() {
  return null;
}
