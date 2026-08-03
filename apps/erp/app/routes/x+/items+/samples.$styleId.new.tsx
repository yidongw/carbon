import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
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
import {
  createStyleSamples,
  createStyleSampleValidator,
  getStyleSizes
} from "~/modules/items";
import { getUserDefaults } from "~/modules/users/users.server";
import { path } from "~/utils/path";

type StyleColor = { id: string; colorCode: string; colorName: string };
type StyleSize = {
  id: string;
  sizeCode: string;
  sizeName: string;
  sortOrder?: number;
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const styleId = params.styleId;
  if (!styleId) throw redirect(path.to.samples);

  const url = new URL(request.url);
  const isOverlay = url.searchParams.get("overlay") === "true";

  if (!isOverlay) {
    const target = overlay.to.newStyleSample({ styleId });
    const token = overlayToken(target);
    const redirectParams = new URLSearchParams();
    if (token) redirectParams.append(OVERLAY_PARAM, token);
    const query = serializeSearch(redirectParams);
    throw redirect(query ? `${path.to.samples}?${query}` : path.to.samples);
  }

  const { client, companyId, userId } = await requirePermissions(request, {
    view: "parts",
    bypassRls: true
  });

  const styleClient = client as typeof client & {
    from: (t: string) => any;
  };
  const [style, allSizes, defaults] = await Promise.all([
    styleClient
      .from("styles")
      .select("colors, readableIdWithRevision")
      // route param is the style readableId (= style.id), not the item id
      .eq("readableId", styleId)
      .eq("companyId", companyId)
      .maybeSingle(),
    getStyleSizes(client, companyId),
    getUserDefaults(client, userId, companyId)
  ]);

  const colors = (style.data?.colors ?? []) as StyleColor[];
  const sizes = ((allSizes.data ?? []) as StyleSize[])
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  // Offer every company size, ordered, and guarantee L (the sample default).
  const sizeCodes = Array.from(new Set([...sizes.map((s) => s.sizeCode), "L"]));

  return {
    styleId,
    styleDisplayId: style.data?.readableIdWithRevision ?? styleId,
    colorOptions: colors.map((c) => ({
      value: c.id,
      label: c.colorName || c.colorCode
    })),
    sizeOptions: sizeCodes.map((code) => ({ value: code, label: code })),
    defaultColorIds: colors.map((c) => c.id),
    defaultSize: "L",
    defaultLocationId: defaults.data?.locationId ?? ""
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { companyId, userId } = await requirePermissions(request, {
    create: "parts"
  });

  const url = new URL(request.url);
  const isOverlay = url.searchParams.get("overlay") === "true";

  const validation = await validator(createStyleSampleValidator).validate(
    await request.formData()
  );
  if (validation.error) return validationError(validation.error);

  // Placing samples writes to itemLedger, whose RLS requires inventory_create.
  // Sample creators only need parts_create (checked above), so do the privileged
  // ledger/tracked-entity writes with the service-role client.
  const serviceRole = getCarbonServiceRole();
  const result = await createStyleSamples(serviceRole, {
    ...validation.data,
    companyId,
    userId
  });

  if (result.error) {
    return data(
      { ok: false as const },
      await flash(request, error(result.error, "Failed to create samples"))
    );
  }

  if (isOverlay) {
    return data(
      { ok: true as const },
      await flash(request, success("Samples created"))
    );
  }

  return redirect(
    path.to.samples,
    await flash(request, success("Samples created"))
  );
}

export default function NewStyleSampleRoute() {
  return null;
}
