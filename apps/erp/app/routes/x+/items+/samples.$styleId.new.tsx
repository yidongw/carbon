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
  createStyleSampleValidator
} from "~/modules/items";
import { getItemAttributeSelectionsForItem } from "~/modules/items/itemAttribute.service";
import { getUserDefaults } from "~/modules/users/users.server";
import { path } from "~/utils/path";

type StyleAttrRow = {
  attributeId: string;
  code: string;
  name: string;
  values: Array<{ id: string; code: string; name: string }>;
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
  const [style, defaults] = await Promise.all([
    styleClient
      .from("styles")
      // `attributes` is no longer on the styles view; the fallback below
      // reconstructs it from the item's attribute selections.
      .select("id, readableIdWithRevision")
      // route param is the style readableId (= style.id), not the item id
      .eq("readableId", styleId)
      .eq("companyId", companyId)
      .maybeSingle(),
    getUserDefaults(client, userId, companyId)
  ]);

  // The styles view no longer carries `attributes`; reconstruct it from the
  // item's attribute selections.
  let attributes: StyleAttrRow[] = [];
  if (style.data?.id) {
    const state = await getItemAttributeSelectionsForItem(client, {
      itemId: style.data.id,
      companyId
    });
    if (!state.error && state.data.attributeSetId) {
      const db = client as any;
      const { data: setAttrs } = await db
        .from("itemAttributeSetAttribute")
        .select(
          "attributeId, sortOrder, itemAttribute:attributeId(id, code, name)"
        )
        .eq("attributeSetId", state.data.attributeSetId)
        .order("sortOrder", { ascending: true });
      const valueIds = Object.values(state.data.selections).flat();
      const { data: values } = valueIds.length
        ? await db
            .from("itemAttributeValue")
            .select("id, attributeId, code, name, sortOrder")
            .in("id", valueIds)
        : { data: [] };
      attributes = (
        (setAttrs ?? []) as Array<{
          attributeId: string;
          itemAttribute: { id: string; code: string; name: string } | null;
        }>
      )
        .map((row) => {
          const opts = (
            (values ?? []) as Array<{
              id: string;
              attributeId: string;
              code: string;
              name: string | null;
            }>
          )
            .filter((v) => v.attributeId === row.attributeId)
            .map((v) => ({
              id: v.id,
              code: v.code,
              name: v.name ?? v.code
            }));
          if (opts.length === 0) return null;
          return {
            attributeId: row.attributeId,
            code: row.itemAttribute?.code ?? row.attributeId,
            name: row.itemAttribute?.name ?? row.itemAttribute?.code ?? "",
            values: opts
          };
        })
        .filter(Boolean) as StyleAttrRow[];
    }
  }

  return {
    styleId,
    styleDisplayId: style.data?.readableIdWithRevision ?? styleId,
    attributes: attributes.map((a) => ({
      attributeId: a.attributeId,
      code: a.code,
      name: a.name,
      options: (a.values ?? []).map((v) => ({
        value: v.id,
        label: v.name || v.code,
        // Keep the code so the form can localize the display name per locale.
        code: v.code
      }))
    })),
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
