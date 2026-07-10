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
import {
  getMasterWorkOrderSplitRows,
  parseSplitRows,
  replacePendingSplitRows,
  splitRowsFormValidator
} from "~/modules/production";
import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isOverlay = url.searchParams.get("overlay") === "true";
  const masterWorkOrderId = url.searchParams.get("masterWorkOrderId") ?? "";

  if (!isOverlay) {
    const token = overlayToken(
      overlay.to.reportMasterWorkOrderCutting({ masterWorkOrderId })
    );
    const redirectParams = new URLSearchParams();
    if (token) redirectParams.append(OVERLAY_PARAM, token);
    const query = serializeSearch(redirectParams);
    const to = masterWorkOrderId
      ? path.to.masterWorkOrder(masterWorkOrderId)
      : path.to.masterWorkOrders;
    throw redirect(query ? `${to}?${query}` : to);
  }

  const { client, companyId } = await requirePermissions(request, {
    view: "production"
  });

  const rows = await getMasterWorkOrderSplitRows(
    client,
    masterWorkOrderId,
    companyId
  );
  const pending = (rows.data ?? []).filter((r) => !r.bundleWorkOrderId);

  return {
    initialValues: {
      masterWorkOrderId,
      rows: pending.map((r) => ({
        id: r.id,
        colorCode: r.colorCode ?? "",
        sizeCode: r.sizeCode ?? "",
        quantity: r.quantity
      }))
    }
  };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "production"
  });

  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  const formData = await request.formData();
  const validation = await validator(splitRowsFormValidator).validate(formData);
  if (validation.error) {
    return validationError(validation.error);
  }

  const { masterWorkOrderId, rows } = validation.data;
  const result = await replacePendingSplitRows(client, {
    masterWorkOrderId,
    companyId,
    createdBy: userId,
    rows: parseSplitRows(rows)
  });

  if (result.error) {
    return data(
      { ok: false as const },
      await flash(request, error(result.error, "Failed to save cutting rows"))
    );
  }

  if (isOverlay) {
    return data(
      { ok: true as const },
      await flash(request, success("Cutting rows saved"))
    );
  }

  return redirect(
    path.to.masterWorkOrder(masterWorkOrderId),
    await flash(request, success("Cutting rows saved"))
  );
}

export default function ReportCuttingRoute() {
  return null;
}
