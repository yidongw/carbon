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
  bundleWorkOrderValidator,
  getBundleWorkOrders,
  getMasterWorkOrder,
  insertBundleWorkOrder
} from "~/modules/production";
import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isOverlay = url.searchParams.get("overlay") === "true";
  const masterWorkOrderId = url.searchParams.get("masterWorkOrderId") ?? "";

  if (!isOverlay) {
    const token = overlayToken(
      overlay.to.newBundleWorkOrder({ masterWorkOrderId })
    );
    const redirectParams = new URLSearchParams();
    if (token) redirectParams.append(OVERLAY_PARAM, token);
    const query = serializeSearch(redirectParams);
    const to = masterWorkOrderId
      ? path.to.masterWorkOrder(masterWorkOrderId)
      : path.to.masterWorkOrders;
    throw redirect(query ? `${to}?${query}` : to);
  }

  await requirePermissions(request, { view: "production" });

  return {
    initialValues: {
      masterWorkOrderId,
      colorCode: "",
      sizeCode: "",
      quantity: 0
    }
  };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "production"
  });

  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  const formData = await request.formData();
  const validation = await validator(bundleWorkOrderValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { masterWorkOrderId, colorCode, sizeCode, quantity } = validation.data;

  const master = await getMasterWorkOrder(client, masterWorkOrderId, companyId);
  if (master.error || !master.data?.jobId || !master.data.itemId) {
    return data(
      { ok: false as const },
      await flash(
        request,
        error(master.error, "Could not find the master work order")
      )
    );
  }
  const parentJobId = master.data.jobId;
  const itemId = master.data.itemId;

  const existing = await getBundleWorkOrders(
    client,
    masterWorkOrderId,
    companyId
  );
  const sequence = (existing.data?.length ?? 0) + 1;
  const bundleNumber = `${master.data.jobReadableId ?? "MWO"}-${String(
    sequence
  ).padStart(2, "0")}`;

  const insert = await insertBundleWorkOrder(client, {
    masterWorkOrderId,
    parentJobId,
    itemId,
    quantity,
    bundleNumber,
    sequence,
    colorCode: colorCode || null,
    sizeCode: sizeCode || null,
    companyId,
    createdBy: userId
  });

  if (insert.error) {
    return data(
      { ok: false as const },
      await flash(
        request,
        error(insert.error, "Failed to create bundle work order")
      )
    );
  }

  if (isOverlay) {
    return data(
      { ok: true as const },
      await flash(request, success("Bundle work order created"))
    );
  }

  return redirect(
    path.to.masterWorkOrder(masterWorkOrderId),
    await flash(request, success("Bundle work order created"))
  );
}

export default function NewBundleWorkOrderRoute() {
  return null;
}
