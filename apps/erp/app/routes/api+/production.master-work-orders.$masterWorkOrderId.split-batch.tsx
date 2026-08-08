import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import {
  type CuttingSplitBundle,
  type CuttingSplitProposal,
  getCuttingSplitProposal,
  saveBundleSplit
} from "~/modules/production";

export type MasterWorkOrderSplitBatchLoaderData = CuttingSplitProposal;

export async function loader({
  request,
  params
}: LoaderFunctionArgs): Promise<MasterWorkOrderSplitBatchLoaderData | null> {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    role: "employee"
  });

  const { masterWorkOrderId } = params;
  if (!masterWorkOrderId) return null;

  return getCuttingSplitProposal(client, masterWorkOrderId, companyId);
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "production"
  });

  const { masterWorkOrderId } = params;
  if (!masterWorkOrderId) {
    return data(
      { ok: false as const },
      await flash(request, error("Missing master work order", "Split failed"))
    );
  }

  const formData = await request.formData();
  let bundles: CuttingSplitBundle[] = [];
  try {
    bundles = JSON.parse(String(formData.get("bundles") ?? "[]"));
  } catch {
    bundles = [];
  }

  // Rows without an id are new bundles (need a positive quantity); rows with an
  // id update an existing bundle (may be any quantity ≥ its reported).
  const toSave = bundles.filter((b) => b.id || (Number(b?.quantity) || 0) > 0);
  if (toSave.length === 0) {
    return data(
      { ok: false as const },
      await flash(request, error("Nothing to save", "Split failed"))
    );
  }

  const proposal = await getCuttingSplitProposal(
    client,
    masterWorkOrderId,
    companyId
  );
  const cellKey = (valuesKey: string | null | undefined) =>
    (valuesKey ?? "").trim();
  const cutByCell = new Map(
    proposal.cells.map((c) => [cellKey(c.valuesKey), c.cut])
  );
  const reportedById = new Map(
    proposal.existingBundles.map((b) => [b.id, b.reportedQuantity])
  );

  // Each attribute combo's bundles (existing + new) can't sum beyond its cut.
  const requestedByCell = new Map<string, number>();
  for (const b of toSave) {
    const k = cellKey(b.valuesKey);
    requestedByCell.set(
      k,
      (requestedByCell.get(k) ?? 0) + (Number(b.quantity) || 0)
    );
  }
  for (const [k, requested] of requestedByCell) {
    const cut = cutByCell.get(k) ?? 0;
    if (requested > cut + 0.0001) {
      return data(
        { ok: false as const },
        await flash(
          request,
          error(
            "Split exceeds the cut quantity for an attribute combo",
            `An attribute combo can't exceed the cut quantity (max ${cut})`
          )
        )
      );
    }
  }

  // An existing bundle can't be shrunk below what's already been reported.
  for (const b of toSave) {
    if (!b.id) continue;
    const reported = reportedById.get(b.id) ?? 0;
    if ((Number(b.quantity) || 0) < reported) {
      return data(
        { ok: false as const },
        await flash(
          request,
          error(
            "Bundle quantity below reported",
            `A bundle can't be set below its reported quantity (${reported})`
          )
        )
      );
    }
  }

  const result = await saveBundleSplit(client, {
    masterWorkOrderId,
    companyId,
    createdBy: userId,
    bundles: toSave
  });

  if (result.error) {
    return data(
      { ok: false as const },
      await flash(request, error(result.error, "Failed to save bundles"))
    );
  }

  // The success toast is shown + translated client-side (completeOverlayConfirm)
  // from these counts — an interpolated flash string can't be catalog-matched.
  return data({
    ok: true as const,
    created: result.data.created,
    updated: result.data.updated
  });
}
